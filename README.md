# Sadhana Dashboard

A simple public dashboard to log hours for **Satsang** and **Sadhana**.

**Data storage:** Without configuration, data is stored only in each browser (localStorage). To have **one shared list for all users** (so data isn’t lost when different people use different browsers), set up a free [Supabase](https://supabase.com) project and add your credentials (see below).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Shared data (Supabase, optional)

To store entries in a shared database so everyone sees the same data:

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase dashboard, open **SQL Editor** and run the script in `supabase/schema.sql` (creates the `entries` table and permissions).
3. Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL` — from **Project Settings → API → Project URL**
   - `VITE_SUPABASE_ANON_KEY` — from **Project Settings → API → anon public**
4. Restart the dev server. The app will use Supabase; all users see the same entries.

For production (e.g. GitHub Pages, Netlify), add the same env vars in the host’s environment / build settings.

## Build

```bash
npm run build
```

Output is in `dist/`.

## Deploy to GitHub Pages (public URL)

1. **Create a GitHub repo** and push this project:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Sadhana Dashboard"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/SadhanaDashboard.git
   git push -u origin main
   ```

2. **Enable GitHub Pages** in the repo:
   - Go to **Settings → Pages**
   - Under **Build and deployment**, set **Source** to **GitHub Actions**

3. **Trigger a deploy**: Push any commit to `main`, or run the **Deploy to GitHub Pages** workflow from the **Actions** tab.

4. **Your public URL** (after the first successful deploy):
   ```
   https://YOUR_USERNAME.github.io/SadhanaDashboard/
   ```

Replace `YOUR_USERNAME` with your GitHub username.

## Alternative: Deploy with Netlify or Vercel

- **Netlify**: Drag and drop the `dist` folder (after `npm run build`) at [app.netlify.com/drop](https://app.netlify.com/drop), or connect the repo and set build command `npm run build` and publish directory `dist`. No `base` path change needed (use root).
- **Vercel**: Connect the repo; same build command and output directory. For root deployment, keep `base: '/'` (don’t set `GITHUB_PAGES=true`).

For GitHub Pages we build with base `/SadhanaDashboard/` so the app works at `username.github.io/SadhanaDashboard/`.
