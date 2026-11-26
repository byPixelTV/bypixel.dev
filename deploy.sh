
#!/usr/bin/env bash

set -Eeuo pipefail
umask 077

STACK_DIR="/opt/stacks/bypixel.dev"
STATE_DIR="$STACK_DIR/.deployment"

IMAGE="ghcr.io/bypixeltv/bypixel.dev"
LATEST="$IMAGE:latest"

CURRENT_FILE="$STATE_DIR/current"
PREVIOUS_FILE="$STATE_DIR/previous"
FAILED_FILE="$STATE_DIR/failed"

CONTAINER="bypixel-web"
WAIT_TIMEOUT=120

cd "$STACK_DIR"
mkdir -p "$STATE_DIR"

exec 9>"$STATE_DIR/lock"
flock -x 9

log() {
    printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

read_state() {
    if [[ -f "$1" ]]; then
        cat "$1"
    fi
}

write_state() {
    printf '%s\n' "$2" > "$1.tmp"
    mv -f "$1.tmp" "$1"
}

valid_ref() {
    [[ "$1" =~ ^ghcr\.io/bypixeltv/bypixel\.dev@sha256:[a-f0-9]{64}$ ]]
}

compose() {
    local ref="$1"
    shift

    if ! valid_ref "$ref"; then
        log "ERROR: Invalid image reference: $ref"
        return 1
    fi

    IMAGE_REF="$ref" docker compose \
        --project-directory "$STACK_DIR" \
        -f "$STACK_DIR/compose.yml" "$@"
}

ensure_image() {
    local ref="$1"

    valid_ref "$ref" || return 1

    if ! docker image inspect "$ref" >/dev/null 2>&1; then
        docker pull "$ref" || return 1
    fi
}

start_image() {
    local ref="$1"

    ensure_image "$ref" || return 1

    compose "$ref" up \
        -d \
        --no-deps \
        --pull never \
        --wait \
        --wait-timeout "$WAIT_TIMEOUT" \
        bypixel
}

get_running_ref() {
    docker inspect \
        --format '{{.Config.Image}}' \
        "$CONTAINER" 2>/dev/null || true
}

get_latest_ref() {
    # Docker downloads only missing image layers.
    docker pull "$LATEST" >&2 || return 1

    local ref

    ref="$(docker image inspect "$LATEST" \
        --format '{{range .RepoDigests}}{{println .}}{{end}}' \
        | grep -E '^ghcr\.io/bypixeltv/bypixel\.dev@sha256:[a-f0-9]{64}$' \
        | head -n 1)"

    valid_ref "$ref" || return 1

    printf '%s\n' "$ref"
}

CURRENT="$(read_state "$CURRENT_FILE")"
PREVIOUS="$(read_state "$PREVIOUS_FILE")"
FAILED="$(read_state "$FAILED_FILE")"

MODE="${1:-update}"

case "$MODE" in
    status)
        echo "Current:  ${CURRENT:-none}"
        echo "Previous: ${PREVIOUS:-none}"
        echo "Skipped:  ${FAILED:-none}"
        echo "Running:  $(get_running_ref)"

        docker inspect \
            --format 'Health: {{.State.Health.Status}}' \
            "$CONTAINER" 2>/dev/null || true

        exit 0
        ;;

    rollback)
        if ! valid_ref "$PREVIOUS"; then
            log "No previous image available."
            exit 1
        fi

        log "Rolling back to $PREVIOUS"

        if start_image "$PREVIOUS"; then
            write_state "$CURRENT_FILE" "$PREVIOUS"

            if valid_ref "$CURRENT"; then
                write_state "$PREVIOUS_FILE" "$CURRENT"
                write_state "$FAILED_FILE" "$CURRENT"
            fi

            log "Rollback successful."
            exit 0
        fi

        log "ERROR: Manual rollback failed."

        if valid_ref "$CURRENT"; then
            start_image "$CURRENT" || log "CRITICAL: Recovery failed."
        fi

        exit 1
        ;;

    update|force)
        ;;

    *)
        echo "Usage: $0 [update|force|status|rollback]"
        exit 1
        ;;
esac

NEW="$(get_latest_ref)" || {
    log "ERROR: Could not resolve registry image."
    exit 1
}

RUNNING="$(get_running_ref)"

if [[ "$MODE" != "force" ]]; then
    if [[ "$NEW" == "$FAILED" ]]; then
        log "Skipping rejected image: $NEW"
        exit 0
    fi

    if [[ "$NEW" == "$CURRENT" && "$RUNNING" == "$CURRENT" ]]; then
        HEALTH="$(docker inspect \
            --format '{{.State.Health.Status}}' \
            "$CONTAINER" 2>/dev/null || true)"

        if [[ "$HEALTH" == "healthy" ]]; then
            exit 0
        fi
    fi
fi

log "Deploying image: $NEW"
log "Previous image: ${CURRENT:-none}"

if start_image "$NEW"; then
    if valid_ref "$CURRENT" && [[ "$CURRENT" != "$NEW" ]]; then
        write_state "$PREVIOUS_FILE" "$CURRENT"
    fi

    write_state "$CURRENT_FILE" "$NEW"
    rm -f "$FAILED_FILE"

    log "Deployment successful."
    exit 0
fi

log "ERROR: New deployment failed."

write_state "$FAILED_FILE" "$NEW"

if valid_ref "$CURRENT" && [[ "$CURRENT" != "$NEW" ]]; then
    log "Restoring $CURRENT"

    if start_image "$CURRENT"; then
        log "Automatic rollback successful."
    else
        log "CRITICAL: Automatic rollback failed."
    fi
else
    log "No previous working image available."
    compose "$NEW" stop bypixel || true
fi

exit 1
