# Deploy Sara to Render via Git

Deploy the Sara Learning Platform (frontend + backend) to [Render](https://render.com) using your Git repo.

## Prerequisites

- GitHub (or GitLab) repo with your Sara project
- [Render](https://render.com) account
- Supabase (or your DB) and other secrets ready

---

## Option A: Deploy with Blueprint (recommended)

1. **Push your code** (including `render.yaml`) to your Git repo.

2. **In Render:** [Dashboard](https://dashboard.render.com) → **New** → **Blueprint**.

3. **Connect repository:** Choose your Git provider and select the Sara repo. Render will detect `render.yaml` in the root.

4. **Apply the Blueprint:** Click **Apply**. Render creates two services:
   - **sara-backend** (Web Service, Node)
   - **sara-frontend** (Static Site)

5. **Set environment variables** in the Render Dashboard for each service:

   **sara-backend**
   - `FRONTEND_URL` = your frontend URL (e.g. `https://sara-frontend.onrender.com`) — get this after the first deploy of the frontend.
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_KEY` = your Supabase service role key
   - `JWT_SECRET` = long random string (or use “Generate” in Render)
   - Optional: `REDIS_URL`, `GROQ_API_KEY`, `SENTRY_DSN`

   **sara-frontend**
   - `VITE_API_BASE_URL` = your backend URL (e.g. `https://sara-backend.onrender.com`) — no trailing slash.

6. **Redeploy** the backend after setting `FRONTEND_URL`, and the frontend after setting `VITE_API_BASE_URL`, so CORS and API base URL are correct.

---

## Option B: Manual setup (two services)

### Backend (Web Service)

1. **New** → **Web Service**.
2. Connect your repo, branch.
3. **Root Directory:** `backend`
4. **Runtime:** Node
5. **Build Command:** `npm install`
6. **Start Command:** `npm start`
7. **Plan:** Free (or your choice)
8. Add the same **Environment Variables** as in Option A for **sara-backend**.
9. Create the service and note the URL (e.g. `https://sara-backend.onrender.com`).

### Frontend (Static Site)

1. **New** → **Static Site**.
2. Connect the same repo and branch.
3. **Build Command:** `npm run install:all && npm run build`
4. **Publish Directory:** `frontend/dist`
5. **Environment:** Add `VITE_API_BASE_URL` = backend URL (e.g. `https://sara-backend.onrender.com`).
6. Create the service and note the URL (e.g. `https://sara-frontend.onrender.com`).

Then in the **backend** service, add `FRONTEND_URL` = your static site URL and redeploy.

---

## After deploy

- **Frontend:** Open the static site URL (e.g. `https://sara-frontend.onrender.com`).
- **Backend:** Health check: `https://<backend-url>/health`
- **CORS:** The backend allows `*.onrender.com` and the value of `FRONTEND_URL`.

## Free tier notes

- Backend free instances spin down after ~15 minutes of no traffic; first request may be slow.
- Redis is optional; without `REDIS_URL` the backend uses in-memory cache (fine for low traffic).

## Troubleshooting

| Issue | Check |
|-------|--------|
| Frontend can’t reach API | `VITE_API_BASE_URL` set to backend URL (no trailing slash)? |
| CORS errors | `FRONTEND_URL` on backend set to frontend URL? Backend allows `*.onrender.com`. |
| Build fails | Root `install:all` and `build` run from repo root; `frontend/dist` must exist after build. |
