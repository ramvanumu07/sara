# Outcome suitability for "one code question per outcome"

The system prompt tells the AI to teach **one outcome at a time** and give a **"Your turn!"** practice task (code question) for each. Not every outcome is equally suitable for that.

---

## Outcome types and best response (summary)

| Type | What it is | Examples from curriculum | Best reply / practice to expect |
|------|------------|---------------------------|----------------------------------|
| **Code / Syntax / API** | How to use a construct or method; “write this” is natural | `if` syntax, `Math.round()`, `array.map`, `JSON.stringify`, destructuring | **Specific practice task:** “Your turn! Write 2–3 lines that…” (small runnable snippet). Student writes code; AI checks output or logic. |
| **Conceptual / Theory** | “What is X?”, “Why does Y happen?”, mental models | Event loop, call stack, undefined vs null, truthy/falsy, why we need Promises | **Check understanding, not code:** “What does this print?” (trace), or **MCQ:** “Which is true? A) … B) …” or “In one sentence, why do we use …?” |
| **Design / Architectural** | “When to use X vs Y”, “Which tool for the job”, style/judgment | When to use for vs while, Map vs Object, when to use try/catch, recursion vs iteration | **Scenario or choice:** “Given [scenario], would you use A or B? Why?” or short **MCQ** (e.g. “When is a Map better than an Object?”). Optional: one-line code to justify. |
| **Execution / Flow** | How execution order works; reasoning about code | Condition order in else-if, how errors bubble up, return value propagation | **Trace or predict:** “Here’s a snippet. What runs first, and what’s the result?” or “What does this print?” — student explains, no writing full code. |
| **Risk / Pitfall** | What goes wrong and how to avoid it | Infinite loop risk, stack overflow, NaN traps, “rest must be last” | **Short code + question:** One-line buggy example + “What’s wrong?” or “What will happen if we …?” (MCQ or one-sentence answer). |

**In short:**  
- **Code-type outcome** → ask a **specific practice task** (write a small snippet).  
- **Theory-type outcome** → ask a **question on what was taught** (MCQ, “what does this print?”, or one-sentence explain).  
- **Design-type outcome** → ask a **scenario/choice or MCQ** (“When would you use X?”).  
- **Flow / risk** → **trace or predict** (“What does this print?” / “What’s wrong here?”).

---

**Coverage:** These 5 types cover all outcome styles in the curriculum (293 outcomes). Outcomes about naming or style (e.g. CamelCase, descriptive verb-based names) fit Design (choice/MCQ) or Code (write code following the rule). Outcomes that compare two things (e.g. == vs ===, JSON vs Object) can be Conceptual (MCQ on the distinction) or Code (write a snippet that shows both). No extra type is needed.

## Summary

| Category | Count | Notes |
|----------|--------|------|
| **Clearly code-suitable** | ~250+ | Syntax, APIs, patterns – easy to ask "write code that..." |
| **Weaker / conceptual** | ~30–40 | "Why", design choice, theory, or judgment – code question can feel forced |

**Answer: No.** Not all outcomes across all topics are equally suitable for generating a clear, single code question. Some are conceptual, design, or "why" focused; the AI can still try, but the question may be stretched or less natural.

---

## Outcomes that are WEAKER for a code question

These are **conceptual**, **design**, **"why"**, or **meta** – the AI can still give an example and a "Your turn!", but the *code* part is less direct.

### Conceptual / "What is" / Theory

| Topic | Outcome |
|-------|--------|
| Understanding Undefined and Null | The concept of Uninitialized Memory: undefined |
| Type Coercion | Introduction to Coercion: Automatic Type Switching |
| Type Coercion | Safe Coding: Strategies to avoid implicit bugs |
| Operators | Short-circuiting: How JS optimizes logical checks |
| Working with Dates | The Date Object: Tracking time in memory |
| while Loops | Infinite Loop Risk: Managing System Resources |
| Functions | The Call Stack: Executing and Invoking Functions |
| Recursion | The Call Stack: Visualizing Function Nesting |
| Recursion | Return Value Propagation: Passing data back up the chain |
| Closures | What is a Closure: The persistent link to Lexical Scope |
| forEach | The Void Return: Understanding why forEach returns undefined |
| find and findIndex | Efficiency: Understanding why searching stops at the first match |
| some and every | Short-Circuit Logic: Optimizing Truth Evaluations |
| some and every | The Vacuous Truth: Empty Array Behavior |
| reduce | Versatility: Rebuilding map and filter using reduce |
| Error handling | Error Propagation: Understanding how errors "bubble up" |
| Error handling | Strategic Usage: When to catch vs. when to let it fail |
| Callbacks, timers, async | Execution Models: Synchronous vs. Asynchronous |
| Callbacks, timers, async | The Single Thread: Why JS can only do one thing at a time |
| Callbacks, timers, async | The Event Loop: Managing the Task Queue |
| Callbacks, timers, async | Callback Hell: The limitation of nested callbacks |
| Callbacks, timers, async | **Evolution: Why we need Promises** |
| Promises | Value Passing: Why returning from .then() creates a new Promise |
| async/await | Context Rules: Why await requires an async environment |
| async/await | Return Logic: Understanding the Implicit Promise wrapper |
| async/await | Propagation: How errors bubble through async chains |

### Design / "When to use" / Architectural choice

| Topic | Outcome |
|-------|--------|
| Variables and Constants | Identifier Naming Rules (CamelCase and Reserved Words) |
| Functions | Identifier Naming: Descriptive Verb-based Names |
| Functions | **Software Design: Reusability and Single Responsibility** |
| for Loops | **Architectural Choice: When to use for vs. while** |
| Specialized Collections | **Architectural Choice: Map vs. Object & Set vs. Array** |
| Spread and Rest | Constraint Logic: Why Rest must be the Final Parameter |
| Spread and Rest | Structural Comparison: Spread vs. Rest Identification |
| Data Serialization | **Architectural Distinction: JSON vs. JavaScript Object Literals** |
| Arrow Functions | **Architectural Constraints: When to stick to regular functions** |
| Recursion | **Architectural Choice: Recursion vs. Iteration** |
| Recursion | Stack Overflow: The risk of infinite recursion |
| Recursion | Tail Recursion: An introduction to optimization |
| Method chaining and nested arrays | **Architectural Logic: Choosing the Right Method for the Job** |
| Modules | Module Scope: Why variables stay private by default |
| Modules | Modern Patterns: Dynamic Imports for Performance |

### Still code-able but less direct

- **"Execution Flow"** / **"Why condition order matters"** – can demo with code, but the outcome is about reasoning.
- **"Immutability: Protecting the Original Data Source"** – can ask "use map without mutating the original," so still OK.
- **JSON Syntax Rules: Why it is stricter than JS Objects** – can ask a small JSON.parse/stringify task; borderline.

---

## Recommendations

1. **Keep current outcomes** – The AI can still do "explain + example + Your turn!" for almost all; for conceptual ones, "Your turn!" can be "write a tiny snippet that demonstrates X" or "trace this code."
2. **Optionally refine prompts** – For topics with many conceptual outcomes, you could add: *"For conceptual goals, you may use a short 'trace this code' or 'what does this print?' question instead of a full coding task."*
3. **Optionally tag outcomes** (future) – e.g. `code_focus: true/false` so the AI knows when to prefer a clear code task vs. explain + light practice.

---

*Generated from `data/curriculum.js` outcomes. Total outcomes: 293.*
