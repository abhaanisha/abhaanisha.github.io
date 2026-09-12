# Abha Singh Sardar — portfolio site

Static site. Everything in this folder is what gets served; no build step.

## Publish on GitHub Pages

1. Create a repository. For a URL like `https://<username>.github.io`, name it `<username>.github.io`; any other name gives `https://<username>.github.io/<repo>/`.
2. Upload the **contents** of this folder to the repository root (keep the folder structure — `assets/`, `_ds/`, and the dotfile `.nojekyll` included).
3. Repository → Settings → Pages → Source: *Deploy from a branch*, branch `main`, folder `/ (root)`. Save.
4. Wait a minute, then open the URL Pages shows.

Or from a terminal:

```
cd site
git init && git add -A && git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

## Notes

- `.nojekyll` matters: without it GitHub ignores the `_ds/` folder (underscore prefix) and the site loses all its styling.
- Pages: `index.html` (home), `coursework.html`, `projects.html`, `skills.html`, `gallery.html`, `resume.html`, `contact.html`.
- `SiteNav.dc.html` and `SiteFooter.dc.html` are shared partials loaded by every page — keep them.
- The résumé PDF and photographs live in `assets/`.
- React is loaded from unpkg.com at runtime, so the site needs an internet connection to render.
