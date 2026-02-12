# Deploy Sara to Vercel (free)

This project is set up to run on **Vercel** with the frontend and API in one repo.

---

## Deploy from your machine (quick)

**Step 1 – Log in (once)**  
In a terminal at the project root:

```bash
npx vercel login
```

Open the URL shown in the browser, sign in to Vercel, then return to the terminal.

**Step 2 – Deploy**

```bash
npx vercel deploy --prod --yes
```

Or run the script (PowerShell):

```powershell
.\deploy-vercel.ps1
```

After the build finishes, use the production URL printed in the terminal. Add environment variables in the Vercel dashboard (see below) before using the app.

---

## Deploy via Vercel dashboard (Git)

## 1. Push your code to GitHub

Make sure your project is in a Git repo and pushed to GitHub (or GitLab/Bitbucket).

## 2. Import the project in Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (free account).
2. Click **Add New…** → **Project**.
3. Import your Git repository (e.g. your `sara` repo).
4. Vercel will detect the config from `vercel.json`. Do **not** change the **Root Directory**.
5. Before deploying, add the environment variables (step 3).

## 3. Set environment variables

In the Vercel project: **Settings** → **Environment Variables**. Add these for **Production** (and optionally Preview):

| Name | Value | Required |
|------|--------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_SERVICE_KEY` | Supabase service role (anon key or service key) | Yes |
| `JWT_SECRET` | Long random string (e.g. 32+ chars) | Yes |
| `GROQ_API_KEY` | Your Groq API key (for AI chat) | Yes (for learning) |
| `SESSION_TIMEOUT_HOURS` | e.g. `24` | Optional |
| `REDIS_URL` | e.g. `redis://...` | Optional (uses in-memory cache if missing) |
| `SENTRY_DSN` | Sentry DSN | Optional |
| `NODE_ENV` | `production` | Optional (Vercel often sets this) |

- **Do not** set `VITE_API_BASE_URL` in the dashboard; it is set in `vercel.json` so the frontend uses relative `/api` on the same domain.

## 4. Deploy

Click **Deploy**. Vercel will:

- Run `npm run install:all` (root, frontend, backend).
- Run `npm run build` (builds the frontend).
- Serve the frontend from `frontend/dist`.
- Route `/api/*` to the Node serverless function (your Express app).

After the build finishes, open the deployment URL (e.g. `https://your-project.vercel.app`). The app and API will be on the same origin.

## 5. Optional: custom domain

In the Vercel project: **Settings** → **Domains** → add your domain and follow the DNS steps.

## Limits (free tier)

- **Serverless execution**: 10 s timeout (Hobby). Heavy or long-running requests may need optimization.
- **Bandwidth and builds**: See [Vercel pricing](https://vercel.com/pricing).
- **Database**: Use Supabase (or similar) separately; not included in Vercel.

## Troubleshooting

- **API 404 or 500**: Check **Deployments** → latest deployment → **Functions** and logs for the `/api` function.
- **CORS errors**: Backend allows `*.vercel.app` and `VERCEL_URL`; for a custom domain, add it in **Settings** → **Environment Variables** as `FRONTEND_URL` (comma-separated if multiple).
- **Env vars**: All backend env vars (Supabase, JWT, Groq, etc.) must be set in Vercel; the serverless function does not use a local `.env` file.
