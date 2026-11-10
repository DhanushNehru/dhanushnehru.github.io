# GitHub Pages and the portfolio

The portfolio runs on Netlify at https://dhanushnehru.got-a.page/.
GitHub Pages project sites run at `https://dhanushnehru.github.io/REPOSITORY/`.
Keep these two hosts separate.

## Why the project sites broke

A custom domain on the `dhanushnehru.github.io` user site is inherited by
its project sites. The old `dhanushnehru.got-a.page` binding redirected project
URLs to Netlify, where those project paths did not exist. A successful Pages
build did not mean the URL worked.

Do not add `CNAME` or `public/CNAME` to this repository, or set a custom domain
in its GitHub Pages settings. The portfolio domain stays configured in Netlify
and DNS. The root `index.html` is only a small homepage redirect; it does not
forward `/repository/` paths. Netlify builds the real portfolio from `src/`.

The `Pages routing guard` workflow rejects those CNAME files on PRs and pushes.
Its manual **Run workflow** also checks the live HTTP routes of all public,
non-fork, Pages-enabled project repositories, including newly added ones:

```sh
python3 scripts/check-pages.py
```

The script is reusable: pass a GitHub username to check another account.
It requires no token. An intentional per-project custom domain will be flagged
as a cross-host redirect and needs review. This is an HTTP smoke test, not a
browser test, and does not prove that scripts, rendering or every link work.
There is no scheduled monitoring job.

## New project checklist

1. Use a public project repository and enable Pages for the correct source.
2. Plain HTML/CSS/JS: publish the directory containing `index.html`, keep asset
   and fetch paths relative (for example `./js/main.js`, not `/js/main.js`),
   and use `.nojekyll` when Jekyll is not needed.
3. Built sites: build in Actions and publish only the generated output. Set
   the framework's base path to `/REPOSITORY/` (Vite `base`, Astro `base`, or
   the equivalent), and use that base for assets and API/static-data fetches.
   Do not publish source files expecting the browser to compile them.
4. Use GitHub's `configure-pages`, `upload-pages-artifact` and `deploy-pages`
   actions for Actions deployments. Give only the deployment job
   `pages: write` and `id-token: write`; keep PR tests read-only and never
   expose deployment secrets to untrusted PR code. Review and use current
   supported versions from the official guide, rather than copying an old
   workflow blindly.
5. Test the production build under `/REPOSITORY/`, not only at localhost `/`.
   Open it in a browser; check the console, assets, data fetches, navigation,
   reloads and mobile layout. Client-side routers need a supported static
   routing strategy (hash routes are the simplest option on Pages).
6. After deploy, run the smoke test above and visit the actual project URL.
   A green deployment alone is not an acceptance test.

GitHub Pages hosts static content. Server APIs, databases and runtime secrets
need a separate backend; setting a base path cannot make server code run there.
Old permanent redirects can remain cached in browsers after this repair. Test
with a fresh browser session if an old URL still redirects unexpectedly.

## Repair rollout

Merge the routing PR, check that the user site's Pages custom-domain field is
empty, and let Pages finish deploying. If the old binding remains, remove only
that Pages binding. Do not change the Netlify domain or DNS. Then verify the
portfolio, its existing `/claude-skills/` route, and each GitHub project URL.
Per-project build or runtime defects, if any remain, need their own fixes.

References:
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages
