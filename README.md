# dhanushnehru.github.io

Personal portfolio, built with [Astro](https://astro.build) and Tailwind CSS.

## Development

Requires Node.js 26 (see `.nvmrc`).

```sh
nvm use
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check and build to dist/
```

Latest Medium articles and YouTube videos are fetched at build time (`src/lib/feeds.ts`).

## Deployment

Netlify builds the site using `netlify.toml`. A scheduled GitHub Action (`.github/workflows/netlify-rebuild.yml`) calls a Netlify build hook daily so new articles and videos show up; set the hook URL as the `NETLIFY_BUILD_HOOK` repository secret.
