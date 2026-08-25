# Ability

A static documentation site: HTML for content and layout, CSS for look, and a small JavaScript file for behavior only. There is no backend, framework, or build step.

## What lives where

- **HTML** — page text, header, nav, footer, and structure
- **CSS** — `site/assets/ability-look.css`
- **JavaScript** — `site/assets/ability-ui.js` for dark mode, search, copy-to-clipboard, in-page TOC highlighting, and the home canvas

To point the header GitHub icon at your library, set `GITHUB_LIBRARY_URL` in `site/assets/ability-ui.js`.

Relative URLs are used throughout, so the same files work on a personal GitHub Pages project site without embedding a username or repo name.

## Local preview

ES modules need an HTTP server (opening `index.html` as a file will not load them):

```bash
cd site
python3 -m http.server 5173
```

Then open `http://localhost:5173`.

## Deploy to GitHub Pages

1. Create a repository and push this project.
2. In the repo: **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main` or `master`, or run the workflow from the Actions tab.

The live site will be `https://<username>.github.io/<repo>/` (or `https://<username>.github.io/` if the repo is named `<username>.github.io`).
