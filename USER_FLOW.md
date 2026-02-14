# Sara – Complete User Flow (Step-by-Step)

This document describes **every part of the app** as a user would experience it, with **example test data** where applicable. Use it for QA, onboarding, or to ensure nothing is missed.

---

## 1. First-time visitor (not logged in)

1. **Open app**  
   User goes to the app (e.g. `http://localhost:5173`).

2. **Welcome (landing) page**  
   - Sees: “Sara” brand, tagline “Your Personal AI Learning Assistant”, value text, “Start Learning Now” button.  
   - Header: “Login” and “Sign Up”.  
   - **Action**: Click “Start Learning Now” or “Sign Up” → goes to **Sign up** page.

3. **Optional: Login link**  
   - Click “Login” in header → **Login** page.

4. **Optional: Terms / Privacy**  
   - If links exist in footer: “Terms”, “Privacy” → static legal pages. No test data.

---

## 2. Sign up (new account)

**Route**: `/signup`

**Fields and example test data**:

| Field | Example value | Rules |
|-------|----------------|--------|
| Username | `testuser` | 3–20 chars, letters/numbers/underscore only; real-time “available” check |
| Email | `testuser@example.com` | Valid email; real-time “available” check |
| Name | `Test User` | Required |
| Password | `TestPass1!` | Min 8 chars; uppercase, lowercase, number, special char; strength meter |
| Confirm password | `TestPass1!` | Must match password |
| Security question | e.g. “What was your first pet’s name?” | One of the predefined list (see `frontend/src/utils/securityQuestions.js`) |
| Security answer | `Whiskers` | Used later for Forgot password |

**Flow**:

1. Fill all fields.  
2. Username: after 3+ valid chars, app checks availability (e.g. “Username is available” / “Username is taken”).  
3. Email: similar check (“Email is available” / “Email already in use”).  
4. Password: strength meter updates as you type.  
5. Select one security question, enter answer.  
6. Click **Sign Up**.  
7. **Success**: Redirect to **Dashboard** (user is logged in).  
8. **Error**: Inline messages (e.g. validation, “username taken”, “email in use”).

**Notes**:  
- If already logged in, visiting `/signup` redirects to Dashboard.  
- Security questions: e.g. first pet’s name, birth city, first school, favorite teacher, best friend’s name, favorite food, childhood nickname.

---

## 3. Login

**Route**: `/login`

**Test data**:

| Field | Example |
|-------|--------|
| Username or email | `testuser` or `testuser@example.com` |
| Password | `TestPass1!` |

**Flow**:

1. Enter username **or** email in one field.  
2. Enter password.  
3. Click **Login**.  
4. **Success**: Redirect to **Dashboard**.  
5. **Failure**: Field-level or general error (e.g. “Username or email not found”, “Incorrect password”).  
6. **Links**: “Forgot Password?” → Forgot password flow; “Sign up” → Sign up.

**Notes**:  
- Rate limiting after multiple failed attempts (e.g. 5 attempts, then wait).  
- If already logged in, `/login` redirects to Dashboard.

---

## 4. Forgot password

**Route**: `/forgot-password`

**Step 1 – Find account**

- **Field**: Username or email.  
- **Example**: `testuser` or `testuser@example.com`.  
- **Action**: Click “Continue”.  
- **Success**: Backend returns security question → **Step 2**.  
- **Failure**: e.g. “Account with this username/email does not exist”.

**Step 2 – Security question**

- **Shown**: Account (e.g. username), question text (e.g. “What was your first pet’s name?”).  
- **Field**: Security answer.  
- **Example**: `Whiskers` (must match what was set at signup).  
- **Action**: Click “Verify”.  
- **Success**: **Step 3** (new password).  
- **Failure**: e.g. “Incorrect security answer”.

**Step 3 – New password**

- **Fields**: New password, Confirm password.  
- **Example**: `NewPass2!`, `NewPass2!` (same rules as signup: 8+ chars, upper, lower, number, special).  
- **Action**: Click “Reset Password”.  
- **Success**: **Step 4** (success message).  
- **Failure**: Validation or server error (e.g. “Passwords do not match”).

**Step 4 – Success**

- Message that password was reset.  
- **Link**: “Back to Sign In” → Login. User can log in with **new** password.

---

## 5. Dashboard (logged in)

**Route**: `/dashboard`

**What the user sees**:

- **Sidebar** (desktop always; mobile via hamburger):  
  - “Sara” / logo.  
  - **Dashboard** (current).  
  - **Profile**.  
  - **Logout**.  
- **Course dropdown**: e.g. “JavaScript” (from curriculum).  
- **Continue learning**:  
  - If user has progress: card with last topic and phase (e.g. “console.log – Learning Session” or “Coding Assignments”).  
  - Button: “Continue” → goes to **Learn** for that topic (and phase).  
  - If no progress: “Start with first topic” (e.g. first topic of selected course).  
- **Topic list**: All topics of selected course (e.g. “console.log”, “Variables”, …).  
  - Each topic: status (Not started / In progress / Completed), phase (Learning Session / Interactive Practice / Coding Assignments).  
  - Click topic → **Learn** for that topic.  
- **Optional**: Code editor toggle (full-screen playground); same idea as “play” in Learn but from dashboard.

**Test behaviour**:

1. After login, user lands here.  
2. Select course “JavaScript”.  
3. Click first topic (e.g. “console.log”) → **Learn** `/learn/console-log` (Session phase).  
4. Or click “Continue” if there is progress.

---

## 6. Profile (edit profile)

**Route**: `/profile`  
**Access**: Sidebar → “Profile”.

**Fields** (pre-filled from current user):

| Field | Example edit |
|-------|----------------|
| Name | `Test User` → `Test User Updated` |
| Username | `testuser` → `testuser2` (must be available) |
| Email | `testuser@example.com` → `testuser2@example.com` (must be available) |

**Flow**:

1. Change one or more fields.  
2. Username/email: debounced availability check (e.g. “Available” / “Taken”).  
3. Click **Save** or **Update profile**.  
4. **Success**: “Profile updated successfully!”; form shows new values; auth context updated.  
5. **Failure**: Validation (e.g. “Username is already taken”) or server error.

**Notes**:  
- No password change on this page (password change is via Forgot password or a separate flow if implemented).  
- If username/email are taken, Save is blocked or shows error.

---

## 7. Learn – Session phase (chat with AI)

**Route**: `/learn/:topicId` (e.g. `/learn/console-log`)  
**Phase**: Session (default when no `?phase=assignment`).

**What the user sees**:

- **Header**: “Sara” (back to Dashboard), topic title (e.g. “console.log”), “Learning Session”, and a **“Code”** button (disabled until session is “complete”).  
- **Chat area**:  
  - Messages (assistant first, then user/assistant turns).  
  - Markdown and code blocks in assistant messages.  
- **Input**: Text box + “Send” to type a message.  
- **Optional**: Editor toggle to open **inline playground** (same session page) to try code while chatting.

**Flow (example test data)**:

1. User opens first topic (e.g. “console.log”).  
2. If no history: backend may send first assistant message (welcome / first concept).  
3. User types, e.g.: `What is console.log?` → Send.  
4. Assistant replies (e.g. explanation, maybe with code).  
5. User continues until the AI signals session complete (e.g. “ready for the playground” / “Congratulations” / internal SESSION_COMPLETE).  
6. **“Code”** button becomes enabled.  
7. User can:  
   - Click **“Code”** → **Assignment phase** (same topic, task list + editor).  
   - Or use **Editor toggle** to practice in the inline playground (Run code, see output; no “took X ms” in output).

**Test messages (examples)**:

- `What is console.log?`  
- `Show me an example`  
- `How do I print a number?`  
- (Continue until session is marked complete.)

---

## 8. Learn – Assignment phase (tasks + Run + Submit)

**Route**: `/learn/:topicId?phase=assignment` (e.g. `/learn/console-log?phase=assignment`).

**What the user sees**:

- **Header**: Topic title, “Assignment 1 of N”, and **Back** (to session) / **Next** (next task) or “Back to session” on first task.  
- **Left (or top on mobile)**: Editor with tab “assignment.js”, **Run** and **Submit** buttons.  
- **Right (or bottom)**: **Terminal output** (Run output) and/or **Test results** (after Submit).  
- **Task description**: Above or beside editor (e.g. “Print the result of 147 + 289”, “Your output should be: 436”).

**Flow (example for first task – console.log)**:

1. **Task 1** description: e.g. “Print the result of 147 + 289. Your output should be: 436”.  
2. User writes in editor, e.g.:  
   `console.log(147 + 289)`  
3. **Run**: Clicks Run → output shows `436` (no execution time line).  
4. **Submit**: Clicks Submit → backend runs tests; **Test results** show Pass/Fail (e.g. “Expected: 436”, “Actual: 436”).  
5. If all tests pass: assignment marked complete; user can click **Next** to next task (or see “Topic completed” when all tasks done).  
6. If tests fail: User fixes code, Run again, Submit again.  
7. **Optional**: “Get AI review” / feedback (if implemented) after submit.

**More example tasks (from curriculum)**:

- “Print the result of 100 divided by 8” → `12.5`.  
- “Print (15 + 25) * 3 - 10” → `110`.  
- “Print ‘Hello’ and ‘World’ with one space” → `Hello World`.  
- “Print: He said \"JavaScript is amazing\”” (quotes in output).

**Navigation**:

- **Back** on first task → back to Session phase (chat).  
- **Back** on later task → previous task.  
- **Next** → next task; after last task, topic is complete (user can go to Dashboard or pick another topic).

---

## 9. Logout

**Where**: Dashboard (or any page) → Sidebar → **Logout**.

**Flow**:

1. Click Logout.  
2. Tokens and user cleared; redirect to **Login** (or Welcome, depending on implementation).  
3. Next visit: user must log in again.

---

## 10. End-to-end test script (summary)

| Step | Action | Test data / Expected |
|------|--------|----------------------|
| 1 | Open app | Welcome page |
| 2 | Sign up | username `testuser`, email `testuser@example.com`, name `Test User`, password `TestPass1!`, security Q&A → Dashboard |
| 3 | Dashboard | See “JavaScript”, topic list, Continue (or “Start”) |
| 4 | Click first topic | Learn Session, first AI message |
| 5 | Chat | Send “What is console.log?” etc. until “Code” enables |
| 6 | Click “Code” | Assignment phase, Task 1 |
| 7 | Assignment | Type `console.log(147 + 289)`, Run → `436`, Submit → Pass |
| 8 | Next task | Repeat for task 2, 3, … |
| 9 | Profile | Change name to “Test User Updated”, Save → success |
| 10 | Forgot password | Username `testuser` → security Q → new password → login with new password |
| 11 | Logout | Redirect to Login |

---

## 11. Optional / edge flows

- **Terms / Privacy**: From footer (or links) → static content.  
- **Direct URL**: Logged-in user opens `/learn/console-log` → Session; `/learn/console-log?phase=assignment` → Assignment.  
- **Already logged in**: Visit `/`, `/login`, `/signup`, `/forgot-password` → redirect to Dashboard (or as implemented).  
- **Invalid topic**: e.g. `/learn/invalid-id` → error or 404 from backend/frontend.  
- **Token expiry**: After some time, API returns 401; frontend may try refresh; on failure, redirect to Login (and “session expired” if implemented).

This is the **current** Sara user flow; if a screen or field is missing here, it may not exist in the app yet or may be behind a feature flag.
