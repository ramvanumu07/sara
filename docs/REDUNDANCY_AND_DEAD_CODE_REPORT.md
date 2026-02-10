# Redundancy and Dead Code Report

Audit of the Sara codebase for duplicate logic and unused files/functions.  
*(Generated from a full scan of backend and frontend.)*

---

## 1. Redundancy (duplicate or repeated patterns)

### 1.1 Already fixed
- **Session prompt** – Was duplicated in `learning.js` and `chat.js`. Now centralized in `backend/prompts/sessionPrompt.js` (single source of truth).

### 1.2 Repeated “Topic not found” handling
- **Where:** `learning.js` (10 times), `chat.js` (6 times), `progressManager.js` (1 time).
- **Pattern:** `const topic = findTopicById(courses, topicId); if (!topic) return res.status(404).json(createErrorResponse('Topic not found'))`.
- **Suggestion:** Add a small helper, e.g. `getTopicOrRespond(res, topicId)` that returns the topic or sends 404 and returns `null`, then use it in all routes to avoid repeating the same 2–3 lines.

### 1.3 Duplicate API config (frontend)
- **Files:** `frontend/src/config/api.js` (used) and `frontend/src/config/api-optimized.js` (not imported anywhere).
- **Issue:** Two parallel API clients with different env vars (`VITE_API_BASE_URL` vs `VITE_API_URL`) and token keys (`sara_token` vs `token`). Only `api.js` is used.
- **Suggestion:** Remove `api-optimized.js` or merge any useful parts into `api.js` and delete the duplicate.

### 1.4 Unused prompt files (legacy)
- **Files:** `backend/prompts/session-prompt.txt`, `backend/prompts/feedback-prompt.txt`, `backend/prompts/mentor-prompt.txt`.
- **Issue:** No code imports or reads these. Session behavior is driven by `sessionPrompt.js`. The .txt files look like an older/alternate prompt system.
- **Suggestion:** If you confirm they are not used by any other process, remove or move to a `docs/legacy-prompts` folder.

### 1.5 Duplicate “sanitize” logic
- **`backend/utils/sanitize.js`** – Exports `sanitizeString`, `sanitizeCode`. **Not imported anywhere.**
- **`backend/middleware/validation.js`** – Defines its own `sanitizeString`, `sanitizeObject`, `sanitizeInput`. That middleware is also never used (see dead code below).
- **Suggestion:** Either use `utils/sanitize.js` where sanitization is needed and remove the duplicate in `validation.js`, or delete `utils/sanitize.js` if you standardize on validation middleware later.

---

## 2. Dead code – files and functions

### 2.1 Backend – unused files
| File | Reason |
|------|--------|
| `backend/middleware/csrf.js` | Never imported in `server.js` or any route. CSRF middleware is not applied. |
| `backend/middleware/distributedRateLimit.js` | Never imported. Rate limiting is done via `rateLimiting.js` in routes. |
| `backend/middleware/validation.js` | Never imported. No route uses its schemas or `validateRequest` / `sanitizeInput`. |
| `backend/utils/errors.js` | Never imported. Error responses use `utils/responses.js` (`createErrorResponse`, etc.). |
| `backend/utils/sanitize.js` | Never imported. No backend code uses it. |
| `frontend/src/config/api-optimized.js` | Never imported. All API usage goes through `config/api.js`. |

### 2.2 Backend – unused exports / functions
| Location | Export / function | Reason |
|----------|-------------------|--------|
| `backend/utils/curriculum.js` | `validateLearningObjectives` | Exported but never imported anywhere. |
| `backend/utils/responses.js` | `sendSuccessResponse` | Exported but never used; routes use `createSuccessResponse` + `res.json()` directly. |
| `backend/services/chatService.js` | `getLastMessages`, `parseHistoryToMessages` | Imported in `chat.js` but never called in the file body. Dead imports (and functions can be removed if no other callers). |

### 2.3 Frontend – unused components
| Component | Reason |
|-----------|--------|
| `frontend/src/components/EmailValidator.jsx` | Not imported in `Signup.jsx` or any other page. Signup uses `validateEmail` from `utils/emailValidation` instead. |
| `frontend/src/components/UsernameChecker.jsx` | Not imported in `Signup.jsx` or any other page. Signup does its own username validation. |

### 2.4 Backend – deprecated but still present
| Item | Note |
|------|------|
| `backend/routes/progress.js` – `GET /` | Marked DEPRECATED in code; suggests using `/api/learn/progress` instead. Still registered. Consider removing once clients are migrated. |

---

## 3. Summary counts

| Category | Count |
|----------|--------|
| **Redundancy patterns** (candidates for helpers or consolidation) | 4 (topic lookup, api-optimized, legacy prompts, sanitize) |
| **Unused backend files** | 6 (csrf, distributedRateLimit, validation, errors, sanitize, api-optimized on frontend) |
| **Unused backend exports/functions** | 4 (`validateLearningObjectives`, `sendSuccessResponse`, `getLastMessages`, `parseHistoryToMessages`) |
| **Unused frontend components** | 2 (EmailValidator, UsernameChecker) |
| **Legacy/unused prompt files** | 3 (.txt prompts) |
| **Repeated “Topic not found” blocks** | 17 (good candidate for one helper) |

---

## 4. Recommended next steps

1. **Remove or merge clearly dead code**
   - Delete or archive `api-optimized.js`, `csrf.js`, `distributedRateLimit.js`, `validation.js`, `errors.js`, `utils/sanitize.js` if you confirm no external tools depend on them.
   - Remove unused exports: `validateLearningObjectives`, `sendSuccessResponse`; and either use or remove `getLastMessages` / `parseHistoryToMessages` and clean imports in `chat.js`.

2. **Reduce redundancy**
   - Introduce a single “get topic or 404” helper and use it in learning, chat, and progress routes.
   - Decide on one place for sanitization (e.g. `utils/sanitize.js`) and remove the duplicate in `validation.js`, or remove `utils/sanitize.js` if you are not using it.

3. **Frontend**
   - Either start using `EmailValidator` and `UsernameChecker` in Signup (or elsewhere) or remove them to avoid confusion.

4. **Prompts**
   - If the .txt prompt files are not used by any script or docs, remove them or move to a legacy folder and point any docs to `sessionPrompt.js` instead.

---

## 5. Cleanup applied (recent)

- **Removed dead exports:** `validateLearningObjectives` (curriculum.js), `sendSuccessResponse` (responses.js); `getLastMessages`, `parseHistoryToMessages` (chatService.js). Dropped unused imports in chat.js.
- **Added shared helper:** `utils/topicHelper.js` → `getTopicOrRespond(res, courses, topicId, createErrorResponse)`. Replaced 17 repeated "topic not found" blocks in learning.js and chat.js with this helper.
- **Deleted unused files:** `backend/utils/errors.js`, `backend/utils/sanitize.js`, `frontend/src/config/api-optimized.js`.
- **Left in place (not wired):** `middleware/csrf.js`, `middleware/distributedRateLimit.js`, `middleware/validation.js` — still unused; remove or wire when needed.
