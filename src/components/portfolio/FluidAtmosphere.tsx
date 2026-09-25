"use client";

import { useEffect, useRef } from "react";

const vertex = `attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
const fragment = `precision mediump float;
uniform vec2 resolution;
uniform float time;
uniform vec3 primary;
uniform vec3 secondary;
uniform vec3 tertiary;
void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 p = (uv - .5) * vec2(resolution.x / resolution.y, 1.0);
  float t = time * .055;
  float bend = sin(p.x * 1.8 + t) * .18 + sin(p.x * 2.7 - t * .6) * .06;
  float d = p.y - bend;
  float light = exp(-d * d * 9.0);
  float foldDistance = (d + .16 + sin(p.x * 1.4 + t * .7) * .08) * 8.0;
  float fold = exp(-foldDistance * foldDistance);
  float glow = exp(-dot(p - vec2(-.45, .15), p - vec2(-.45, .15)) * 1.4);
  vec3 color = mix(primary, secondary, smoothstep(-.8, .9, p.x));
  color *= light * .16 + fold * .065;
  color += tertiary * glow * .05;
  color *= exp(-dot(p * .5, p * .5));
  gl_FragColor = vec4(vec3(.024, .020, .037) + color, 1.0);
}`;
const fallback = [
  [0.55, 0.36, 0.96],
  [0.75, 0.52, 0.99],
  [0.47, 0.31, 0.8],
];

/** Fixed scenery: neither page scroll nor the pointer changes its geometry. */
export default function FluidAtmosphere({ colors }: { colors: string[] }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const palette = useRef(fallback);
  const refresh = useRef<() => void>(() => {});
  useEffect(() => {
    palette.current = fallback.map((base, index) => {
      const rgb = colors[index]?.match(/[\d.]+/g)?.map(Number);
      return rgb?.length === 3 ? rgb.map((n) => Math.min(1, Math.max(0, n / 255))) : base;
    });
    refresh.current();
  }, [colors]);

  useEffect(() => {
    const surface = canvas.current;
    if (!surface) return;
    const gl = surface.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "low-power",
    });
    if (!gl) return;
    const shaders: WebGLShader[] = [];
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const dispose = () => {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      shaders.forEach((shader) => gl.deleteShader(shader));
    };
    if (!program || !buffer) {
      dispose();
      return;
    }
    for (const [kind, source] of [
      [gl.VERTEX_SHADER, vertex],
      [gl.FRAGMENT_SHADER, fragment],
    ] as const) {
      const shader = gl.createShader(kind);
      if (!shader) {
        dispose();
        return;
      }
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        dispose();
        return;
      }
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      dispose();
      return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniforms = Object.fromEntries(
      ["resolution", "time", "primary", "secondary", "tertiary"].map((name) => [
        name,
        gl.getUniformLocation(program, name),
      ]),
    );
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const tint = palette.current.map((color) => [...color]);
    let frame = 0;
    let previous = 0;
    let elapsed = 0;
    let lost = false;
    const draw = (now: number) => {
      frame = 0;
      if (lost || document.hidden) return;
      const dt = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
      previous = now;
      if (!preference.matches) elapsed += dt;
      const ease = preference.matches ? 1 : 1 - Math.exp(-dt * 0.65);
      tint.forEach((color, index) =>
        color.forEach((value, channel) => {
          color[channel] = value + (palette.current[index][channel] - value) * ease;
        }),
      );
      gl.uniform2f(uniforms.resolution, surface.width, surface.height);
      gl.uniform1f(uniforms.time, elapsed);
      ["primary", "secondary", "tertiary"].forEach((name, index) =>
        gl.uniform3fv(uniforms[name], tint[index]),
      );
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      surface.style.opacity = "1";
      if (!preference.matches) frame = requestAnimationFrame(draw);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      if (!document.hidden && !lost) frame = requestAnimationFrame(draw);
    };
    const resize = () => {
      const width = surface.clientWidth;
      const height = surface.clientHeight;
      const scale = Math.min(1, (coarse.matches ? 850 : 1400) / Math.max(1, width));
      const nextWidth = Math.max(1, Math.round(width * scale));
      const nextHeight = Math.max(1, Math.round(height * scale));
      if (surface.width === nextWidth && surface.height === nextHeight) return;
      surface.width = nextWidth;
      surface.height = nextHeight;
      gl.viewport(0, 0, nextWidth, nextHeight);
      sync();
    };
    const contextLost = () => {
      lost = true;
      cancelAnimationFrame(frame);
      surface.style.opacity = "0";
    };
    const observer = new ResizeObserver(resize);
    observer.observe(surface);
    surface.addEventListener("webglcontextlost", contextLost);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    refresh.current = sync;
    resize();
    sync();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      surface.removeEventListener("webglcontextlost", contextLost);
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
      refresh.current = () => {};
      dispose();
    };
  }, []);
  return (
    <div className="fluid-atmosphere" aria-hidden="true">
      <canvas ref={canvas} style={{ opacity: 0 }} />
    </div>
  );
}
