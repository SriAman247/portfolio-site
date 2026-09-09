# Aman Srivastava — Portfolio

A React + Vite single-page portfolio, styled as an interactive data console.

## Before you push

Open `src/App.jsx` and replace the placeholder contact details:
- `your.email@example.com` (appears twice)
- the LinkedIn `href="#"` link

## Deploy to GitHub Pages

1. Create a new **public** repo on GitHub, e.g. `portfolio`.
2. In this folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/SriAman247/portfolio.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source → GitHub Actions**. The included
   workflow (`.github/workflows/deploy.yml`) will build and publish it
   automatically on every push to `main`.
4. After the first push, check the **Actions** tab — once the workflow run
   turns green, your site is live at:
   `https://sriaman247.github.io/portfolio/`

## Deploy to Vercel instead (alternative, zero-config)

If you'd rather skip GitHub Pages: push the repo as above, then at
vercel.com → **New Project → Import** your GitHub repo. Vercel auto-detects
Vite and deploys on every push, with a cleaner URL and no `base` path caveat.

## Local development

```bash
npm install
npm run dev
```
