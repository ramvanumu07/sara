# Deploy SARA to Render – Step-by-step

Use this guide to deploy the **backend** (Web Service) and **frontend** (Static Site) on [Render](https://render.com).

---

## Prerequisites

- [ ] GitHub (or GitLab) account
- [ ] Render account: https://dashboard.render.com/register
- [ ] This repo pushed to a GitHub/GitLab repo (e.g. `https://github.com/YOUR_USERNAME/sara`)

---

## Part 1: Push your code

1. **Create a repo** on GitHub (if you haven’t) and push your project:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/sara.git
   git add .
   git commit -m "Prepare for Render deploy"
   git push -u origin main
   ```
2. **Optional:** Add a `.env.example` in `backend/` and `frontend/` (no secrets) so you know which env vars to set on Render. Never commit real `.env` or secrets.

---

## Part 2: Deploy the backend (Web Service)

1. Go to **https://dashboard.render.com** and log in.
2. Click **New +** → **Web Service**.
3. **Connect repository**: choose your Git provider and select the `sara` repo. Authorize if asked.
4. **Configure the Web Service:**
   - **Name:** `sara-backend` (or any name).
   - **Region:** Pick one close to your users.
   - **Branch:** `main` (or your default branch).
   - **Root Directory:** leave empty (repo root).
   - **Runtime:** `Node`.
   - **Build Command:**
     ```bash
     cd backend && npm install
     ```
   - **Start Command:**
     ```bash
     cd backend && npm start
     ```
   - **Instance type:** Free (or paid if you prefer).

5. **Environment variables** (Add one by one; use “Secret” for keys/tokens):

   | Key | Value | Secret? |
   |-----|--------|--------|
   | `NODE_ENV` | `production` | No |
   | `PORT` | (leave empty; Render sets this) | No |
   | `FRONTEND_URL` | Set after frontend deploy (e.g. `https://sara-frontend.onrender.com`) | No |
   | `SUPABASE_URL` | Your Supabase project URL | No |
   | `SUPABASE_SERVICE_KEY` | Your Supabase service role key | **Yes** |
   | `GROQ_API_KEY` | Your Groq API key | **Yes** |
   | `JWT_SECRET` | Strong random string (e.g. from `openssl rand -hex 32`) | **Yes** |
   | `SENTRY_DSN` | Your Sentry DSN (optional) | No |
   | `REDIS_URL` | (Optional) Add a Redis instance in Render and paste its URL here | **Yes** if used |
   | `LOG_LEVEL` | `info` | No |

   You can copy from your local `backend/.env` but **do not paste the file into the repo**.

6. Click **Create Web Service**. Wait until the first deploy finishes.
7. Copy the backend URL (e.g. `https://sara-backend.onrender.com`). You’ll use it for the frontend and for `FRONTEND_URL` later.

---

## Part 3: Point backend CORS to the frontend (after frontend URL exists)

After you have the frontend URL (from Part 4):

1. In Render dashboard, open your **backend** service.
2. Go to **Environment**.
3. Set **`FRONTEND_URL`** to your frontend URL (e.g. `https://sara-frontend.onrender.com`).
4. Save. Render will redeploy the backend so CORS allows the frontend.

---

## Part 4: Deploy the frontend (Static Site)

1. In Render dashboard click **New +** → **Static Site**.
2. **Connect** the same `sara` repository.
3. **Configure:**
   - **Name:** `sara-frontend`.
   - **Branch:** `main`.
   - **Root Directory:** leave empty.
   - **Build Command:**
     ```bash
     cd frontend && npm install && npm run build
     ```
   - **Publish Directory:** `frontend/dist`
     - This is where Vite writes the built files.

4. **Environment variables** (needed at **build** time for `VITE_*`):
   - **`VITE_API_BASE_URL`** = your backend URL from Part 2 (e.g. `https://sara-backend.onrender.com`).
   - Copy other `VITE_*` from your local `frontend/.env` if you use them (e.g. `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Do **not** put secrets that must stay server-only here.

5. Click **Create Static Site**. Wait for the first deploy.
6. Copy the frontend URL (e.g. `https://sara-frontend.onrender.com`).

---

## Part 5: Final CORS and check

1. Set **`FRONTEND_URL`** on the backend to the frontend URL (Part 3) if you didn’t already.
2. Open the frontend URL in a browser and use the app; it should call the backend API.
3. If you see CORS errors, double-check:
   - Backend **Environment** → `FRONTEND_URL` = exact frontend URL (no trailing slash).
   - Backend redeployed after changing `FRONTEND_URL`.

---

## Part 6: Optional – Redis

If your backend uses Redis (e.g. rate limiting or cache):

1. In Render: **New +** → **Redis**.
2. Create the instance and copy the **Internal Redis URL**.
3. In the **backend** Web Service → **Environment**, add **`REDIS_URL`** = that URL (mark as Secret if you prefer).
4. Redeploy the backend.

---

## Summary checklist

- [ ] Repo pushed to GitHub/GitLab.
- [ ] Backend Web Service created; build = `cd backend && npm install`, start = `cd backend && npm start`.
- [ ] All backend env vars set (especially `FRONTEND_URL` after frontend is live).
- [ ] Frontend Static Site created; build = `cd frontend && npm install && npm run build`, publish = `frontend/dist`.
- [ ] `VITE_API_BASE_URL` set to backend URL on frontend.
- [ ] `FRONTEND_URL` on backend set to frontend URL.
- [ ] Optional: Redis added and `REDIS_URL` set on backend.

---

## Optional: Deploy with Blueprint (render.yaml)

A **render.yaml** Blueprint is in the repo. You can use it to create both services from the dashboard:

1. **New +** → **Blueprint**.
2. Connect the same repo; Render will detect **render.yaml**.
3. Add all environment variables in the dashboard when prompted (values with `sync: false` are not in the file for security).
4. Deploy. Then set **FRONTEND_URL** on the backend to the frontend URL, and **VITE_API_BASE_URL** on the frontend to the backend URL, and redeploy if needed.

The step-by-step flow above (Parts 1–6) is the most reliable for a first deploy and makes it clear where each URL and secret goes.

---

## Troubleshooting

- **Build fails:** Check the build logs; ensure **Build Command** and **Publish Directory** match the paths above.
- **Blank page / wrong API:** Ensure `VITE_API_BASE_URL` is set for the **frontend** build and points to the backend URL (no trailing slash).
- **CORS errors:** Ensure `FRONTEND_URL` on the backend is exactly the frontend origin (e.g. `https://sara-frontend.onrender.com`) and that the backend was redeployed.
- **Free tier sleep:** On the free plan, the backend may sleep after inactivity; the first request can be slow.
