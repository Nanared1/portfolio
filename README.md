# Nana Abekah — Portfolio

Personal portfolio and résumé website. Built with HTML, CSS, and JavaScript.

## Local preview

```sh
python3 -m http.server 4173 --directory dist
```

Open http://localhost:4173.

## Files

- `dist/index.html` — portfolio
- `dist/style.css` — responsive design
- `dist/script.js` — project overview dialogs
- `dist/resume.html` — résumé and print layout
- `dist/assets/favicon.svg` — favicon

## Deployment

Firebase Hosting serves `dist/` from the existing `my-portfolio-6ba2b` project. No build step is required.

```sh
firebase deploy --only hosting --project my-portfolio-6ba2b
```

The hosting configuration enables clean URLs, including `/resume`.
Typography uses Google Fonts with local system-font fallbacks.


### Automatic deployment

Every push to `main` deploys to the live Firebase Hosting site through GitHub Actions. The workflow can also be started manually from the Actions tab. Deployment credentials are stored in an encrypted repository secret and are not included in the source code.
