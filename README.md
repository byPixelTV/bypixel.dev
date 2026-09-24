This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Spotify diagnostics

Run `npm run spotify:check` locally, or `npm run spotify:check -- --production`
inside the deployed server/container with its production environment variables.
The production flag selects Next.js production environment files; it does not
connect to your deployed server from your local machine.

The command bypasses the widget cache and makes one token request followed by one
currently-playing and one recently-played request. It prints the API status and
track details, never credentials, and stops immediately on HTTP 429. Do not run
it again until `Retry-After` has elapsed.

- HTTP 429: rate/quota limit; `Retry-After` is the wait in seconds.
  `QUOTA_EXCEEDED` indicates a Spotify development quota restriction.
- HTTP 200: compare the API track ID/title with the widget. A successful history
  request alone does not prove that the current-playback endpoint works.
- HTTP 204: Spotify returned no current playback.
- HTTP 401/403: authentication or access failure, not proof of a rate limit.

In hosting logs, search for `[Spotify]`. Web API errors include endpoint and HTTP
status; 429 entries include cooldown expiry. A successful browser Server Action
response does not imply a successful upstream Spotify request. Cache and cooldown
state are in memory per server process, not shared across deployment instances.
