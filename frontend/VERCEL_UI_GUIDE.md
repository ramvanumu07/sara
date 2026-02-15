# Vercel UI parity – local vs deployed

So that **localhost and Vercel show the same UI**, use this as the reference.

## How Vercel builds and serves

- **Build:** `npm run build` (from repo root: `install:all` then `build`).
- **Output:** `frontend/dist` (static SPA).
- **API:** Requests to `/api/*` are rewritten to your backend (e.g. serverless or external API).
- **Env:** `VITE_*` variables are baked in at **build time** (not at runtime).

## Checklist for code changes (Vercel-first)

1. **Test with production build locally** before pushing:
   ```bash
   cd frontend && npm run build && npm run preview
   ```
   Open http://localhost:4173 and confirm the UI matches what you expect on Vercel.

2. **Avoid dev-only UI**  
   Do not branch layout or important UI on:
   - `import.meta.env.DEV`
   - `import.meta.env.MODE === 'development'`  
   so that production (Vercel) and local preview stay identical.

3. **API base URL**  
   - Localhost: `http://localhost:5000` (or `VITE_API_BASE_URL` if set).
   - Vercel: same-origin `/api` when `VITE_API_BASE_URL` is empty.  
   Keep this logic in `src/config/api.js`; do not add host-specific UI.

4. **Styles**  
   Prefer styles that work the same in dev and prod (no reliance on dev-only CSS or source maps). If you add layout/CSS, verify in `npm run preview` and on Vercel.

5. **Env on Vercel**  
   Set `VITE_API_BASE_URL` in Vercel only if the frontend must call a different origin (e.g. external API). Leave it empty for same-origin `/api`.

## Quick parity check

After making UI or layout changes:

1. `cd frontend && npm run build && npm run preview`
2. Check the app at http://localhost:4173
3. Deploy to Vercel and compare with the live URL

If localhost (dev) and Vercel differ, the production build (preview) is the source of truth for what Vercel serves.
