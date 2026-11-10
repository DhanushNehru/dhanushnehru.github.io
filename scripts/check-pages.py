#!/usr/bin/env python3
"""HTTP routing smoke test for public, non-fork GitHub Pages projects.

No token required. This checks routes, not JavaScript execution or rendering.
Usage: python3 scripts/check-pages.py [GitHub username]
"""
import json
import sys
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen


def get(url):
    return urlopen(Request(url, headers={"User-Agent": "pages-routing-check"}), timeout=20)


def main():
    owner = sys.argv[1] if len(sys.argv) > 1 else "DhanushNehru"
    if not owner or any(c not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-" for c in owner):
        raise SystemExit("Expected a GitHub username")
    repos = []
    page = 1
    while True:
        with get(f"https://api.github.com/users/{owner}/repos?type=owner&per_page=100&page={page}") as response:
            batch = json.load(response)
        repos.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    failed = 0
    checked = 0
    for repo in repos:
        if repo["fork"] or repo["private"] or not repo["has_pages"] or repo["name"].lower() == f"{owner.lower()}.github.io":
            continue
        checked += 1
        url = f"https://{owner.lower()}.github.io/{repo['name']}/"
        try:
            with get(url) as response:
                final = response.url
                content_type = response.headers.get("Content-Type", "")
                # The user site has no custom domain. Cross-host redirects are
                # unexpected for these project routes and need explicit review.
                if urlsplit(final).hostname != urlsplit(url).hostname:
                    raise ValueError(f"unexpected cross-host redirect to {final}")
                if "text/html" not in content_type:
                    raise ValueError(f"expected HTML, got {content_type}")
                body = response.read(2_000_000).decode("utf-8", errors="replace")
                if not body.strip() or "<title>Page not found</title>" in body or "There isn't a GitHub Pages site here" in body:
                    raise ValueError("empty page or known not-found page")
                print(f"PASS {url} -> {response.status} {final}")
        except (HTTPError, URLError, ValueError, TimeoutError) as error:
            failed += 1
            print(f"FAIL {url}: {error}")
    print(f"Checked {checked} project routes; {failed} failed.")
    return 1 if failed or not checked else 0


if __name__ == "__main__":
    sys.exit(main())
