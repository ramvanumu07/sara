# Sara – Current Codebase Analysis (Latest Version)

This document describes the **actual** Sara project as it exists in the repo today. Use it as the single source of truth to avoid mixing in old requirements or naming.

---

## 1. What Sara Is (Product)

- **Brand**: Sara – “Your Personal Learning Assistant” (see frontend `.env`: `VITE_APP_NAME=Sara`, loading text “Loading Sara...” in `App.jsx`). The app is **not** fixed to JavaScript only; multiple languages are or will be supported.
- **Product**: Interactive coding learning platform with **3-phase flow per topic**: **Session** (AI chat) → **Play** (playground) → **Assignment** (tasks + run + test + AI feedback). Current curriculum may be JS-focused; the product vision includes other languages.
- **Docs/legacy names**: README still says “EduBridge”; package names are `devsprout` (root), `edubridge-frontend`, `sara-backend`. The **running app and UI are Sara**.

---

## 2. Tech Stack (Current)

| Layer     | Technology |
|----------|------------|
| Frontend | React 18, Vite 5, React Router 6, CodeMirror 6 (@uiw/react-codemirror), Axios, React Markdown |
| Backend  | Node 18+, Express, Supabase (PostgreSQL), Groq (LLaMA), Winston, Sentry, ioredis (optional cache) |
| Auth     | JWT access + refresh tokens; session table `user_sessions`; login by **username or email** |
| Code run | Frontend: `CodeExecutor` (in-browser); Backend: secure execution for assignment tests and playground |

---

## 3. Configuration (Current)

**Backend `.env`** (actual usage):

- `PORT=5000` (default 5000 in code)
- `NODE_ENV`, `FRONTEND_URL` (e.g. `http://localhost:5173`)
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`
- `GROQ_API_KEY`, `JWT_SECRET`
- `SENTRY_DSN`, `REDIS_URL` (optional; falls back to in-memory cache if Redis unavailable), `LOG_LEVEL`

**Frontend `.env`** (actual usage):

- **`VITE_API_BASE_URL`** (e.g. `http://localhost:5000`) – **not** `VITE_API_URL`. Used in `frontend/src/config/api.js`.
- `VITE_API_TIMEOUT`, `VITE_APP_NAME`, `VITE_APP_VERSION`, `VITE_SUPABASE_*`, `VITE_SENTRY_DSN`, feature flags, etc.

**API base URL**: Frontend sends requests to `VITE_API_BASE_URL + '/api'` (e.g. `http://localhost:5000/api`). There is **no** `/api/v1/` prefix in the codebase.

---

## 4. API Structure (Current)

All under `/api` (mounted in `server.js`):

- **`/api/auth`**: `POST /signup`, `POST /login`, `POST /logout`, `GET /validate`, `POST /refresh`, `GET /profile`, `PUT /profile`, `POST /forgot-password`, `POST /reset-password`, check-email, check-username, security-question flows, sessions.
- **`/api/chat`**: `POST /session` (session chat), `POST /assignment/hint`, `POST /feedback`, `GET /history/:topicId`, `DELETE /history/:topicId`, etc.
- **`/api/learn`**: `GET /state/:topicId`, `POST /session/start`, `POST /playtime/start`, `POST /playtime/complete`, `POST /assignment/start`, `POST /assignment/complete`, `POST /execute`, `POST /execute-playground`, `GET /progress`, `GET /continue`, `GET /courses`, `GET /topics`, `GET /topic/:topicId`, debug routes.
- **`/api/progress`**: `GET /`, `POST /update` (learning progress).
- **`/api/debug`**: debug-schema and debug-chat routes.
- **Health**: `GET /health`, `GET /metrics` (no `/api` prefix).

**Auth**: Bearer token in `Authorization` header. Token stored in frontend as `sara_token`; refresh as `sara_refresh_token`; user object as `sara_user` in localStorage. Login accepts **username or email** (`usernameOrEmail` + `password`).

---

## 5. Data Model (Current)

**Users** (`sara-schema-updated.sql` / current schema):

- `username` (unique), `email` (unique), `name`, `password`, `has_access`, `access_expires_at`, `last_login`, timestamps. **No** `student_id` in the current schema.

**Progress** (single-topic):

- `user_id`, `topic_id`, `status`, `phase`, `current_task`, `total_tasks`, `completed_assignments`, `session_completed`, `playtime_started`, `playtime_completed`, `assignment_started`, `topic_completed`, timestamps. **Unique on (user_id, topic_id)** – no subtopic.

**Chat**:

- Stored per (user_id, topic_id) – e.g. `messages` text, `message_count`, `phase`.

**Other**: `admins`, `password_reset_tokens`, `user_sessions`, `learning_analytics`.

**Curriculum**: Lives in **repo root** `data/curriculum.js` (not under `backend/`). Backend imports it as `courses` from `../../data/curriculum.js` (from routes). Topics and tasks (with test cases) are defined there.

---

## 6. Frontend Structure (Current)

- **Routes**: `/` (Welcome), `/login`, `/signup`, `/forgot-password`, `/dashboard`, `/profile`, `/learn/:topicId`, `/terms`, `/privacy`. Legacy `/learn/:topicId/:subtopicId` redirects to `/learn/:topicId`.
- **Auth**: `AuthContext` uses `auth.validate()`, `auth.login(usernameOrEmail, password)`, `auth.signup(...)`, token/refresh and localStorage keys above.
- **API layer**: Single place – `frontend/src/config/api.js`. Uses `VITE_API_BASE_URL`; no `VITE_API_URL`.
- **Learn page**: Session (chat with AI), Play (playground – CodeMirror, Run, output), Assignment (task list, editor, Run/Submit, test results). **Playground/assignment output must NOT show “took X ms” or “Execution completed in Xms”.**
- **Mobile**: Responsive CSS; editor/terminal header bars use reduced height and padding on small screens (`Learn-responsive.css`, `index.css`).

---

## 7. Backend Structure (Current)

- **Entry**: `server.js` (not server-optimized.js). Port from `process.env.PORT` or 5000; uses `getSafePort()` for conflict handling.
- **Routes**: `auth.js`, `chat.js`, `learning.js`, `progress.js`, `debug-schema.js`, `debug-chat.js`.
- **Services**: database, AI, chatService, chatHistory, SecureCodeExecutor, cache (Redis with in-memory fallback), logger, errorTracking, performanceMonitor, etc.
- **Auth**: JWT + `user_sessions`; `authenticateToken` middleware; refresh flow.

---

## 8. Conventions to Use Going Forward

- **Auth**: Login/signup with **username** and **email** (not student_id). Tokens: `sara_token`, `sara_refresh_token`, `sara_user`.
- **API base**: `VITE_API_BASE_URL` (e.g. `http://localhost:5000`); paths under `/api`; no `/api/v1/`.
- **Learning**: Single-topic model; **topicId** only (no subtopicId in URLs or progress). Phases: session, play, assignment.
- **Backend port**: Default **5000** (README may still say 3001; code and current .env use 5000).
- **Output**: Do **not** show execution time (“took X ms”, “Execution completed in Xms”) in playground or assignment output.

---

## 9. README vs Reality

- README mentions `schema.sql` and `migrations.sql`; actual DB files include `fresh-schema.sql`, `sara-schema-updated.sql`, and migrations under `database/`.
- README says `PORT=3001` and `VITE_API_URL`; current setup uses **PORT=5000** and **VITE_API_BASE_URL**.
- README lists `/api/v1/`; actual routes are under **`/api`** (no v1).

Use this analysis (and the code/config) as the source of truth, not the README, when implementing or discussing features.
