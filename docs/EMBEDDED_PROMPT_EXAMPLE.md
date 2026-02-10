# Embedded Prompt System - Implementation Example

## 🎯 **Your New System Prompt Architecture**

Your EduBridge platform now uses **embedded conversation history** directly within the system prompt, providing superior context control and more consistent AI behavior.

## 📋 **How It Works**

### **Traditional Approach (Before):**
```javascript
// Old way - separate message objects
const messages = [
  { role: "system", content: "You are a tutor..." },
  { role: "assistant", content: "Previous AI response" },
  { role: "user", content: "Previous user message" },
  { role: "assistant", content: "Another AI response" },
  { role: "user", content: "Current question" }
]
```

### **New Embedded Approach (Now):**
```javascript
// New way - conversation history embedded in system prompt
const messages = [
  { 
    role: "system", 
    content: `# Role
You are an interactive JavaScript tutor teaching "Variables and Constants".

# Goals to Cover
Master variable declaration, assignment, and scope concepts

# Conversation History
TUTOR: Welcome! Today we'll learn about JavaScript variables. What do you think a variable is?

STUDENT: Is it like a container for data?

TUTOR: Exactly! 🎉 A variable is a container that stores data values. Here's how:
\`\`\`javascript
let userName = "John";
\`\`\`
Your turn! Create a variable called 'age' and set it to your age.

STUDENT: let age = 25;

TUTOR: Perfect! 🎉 You've got it. Now let's explore different ways to declare variables...

# Core Teaching Pattern
[... rest of your prompt structure ...]`
  },
  { role: "user", content: "What's the difference between let and const?" }
]
```

## 🔧 **Implementation Details**

### **1. Session Chat Implementation**
```javascript
// In /api/chat/session
const embeddedPrompt = buildEmbeddedSessionPrompt(
  subtopicTitle,           // "Variables and Constants"
  learningObjectives,      // "Master variable declaration..."
  conversationHistory      // Array of previous messages
)

// Single system message with embedded history
const messages = [
  { role: 'system', content: embeddedPrompt },
  { role: 'user', content: currentUserMessage }
]
```

### **2. Conversation History Formatting**
```javascript
// Your conversation gets formatted like this:
function formatConversationHistory(history) {
  return history.map(msg => {
    const role = msg.role === 'assistant' ? 'TUTOR' : 'STUDENT'
    return `${role}: ${msg.content}`
  }).join('\n\n')
}

// Result:
// TUTOR: Welcome! Let's learn about variables...
// STUDENT: What is a variable?
// TUTOR: Great question! A variable is...
```

### **3. Different Chat Types**

#### **Session Chat (Learning)**
```javascript
# Role
You are an interactive JavaScript tutor teaching "${subtopicTitle}".

# Goals to Cover
${learningObjectives}

# Conversation History
${formattedHistory}

# Core Teaching Pattern
1. One sentence: what it does
2. "Here's how:" + code example
3. "Your turn!" + practice task
4. STOP and wait for response
```

#### **Playground Chat (Coding Practice)**
```javascript
# Role
You are a coding practice mentor helping with JavaScript playground exercises.

# Current Context
**Current Code in Editor:**
\`\`\`javascript
let name = "John";
console.log(name);
\`\`\`

# Conversation History
${formattedHistory}

# Mentoring Style
- Encourage experimentation
- Debug together
- Build confidence
- Stay concise (2-3 sentences)
```

#### **Assignment Hints**
```javascript
# Role
You are a patient coding mentor helping with JavaScript assignments.

# Assignment Context
- **Difficulty Level**: medium
**Student's Current Code:**
\`\`\`javascript
function calculate() {
  // I'm stuck here
}
\`\`\`

# Conversation History
${formattedHistory}

# Hint Strategy
- Level 1: Ask guiding questions
- Level 2: Point out focus areas
- Level 3: Explain approach (no full code)
```

## 🎯 **Benefits of This Approach**

### **1. Better Context Control**
- **Full conversation** embedded in system prompt
- **No token limit issues** with message arrays
- **Consistent AI behavior** across responses

### **2. Structured Teaching**
- **Clear learning objectives** always visible
- **Progress tracking** within the prompt
- **Adaptive responses** based on conversation state

### **3. Professional Implementation**
- **Industry-standard** prompt engineering
- **Scalable architecture** for different chat types
- **Easy maintenance** and updates

## 📊 **Real Example: Complete API Call**

### **What gets sent to GROQ:**
```javascript
{
  messages: [
    {
      role: "system",
      content: `# Role
You are an interactive JavaScript tutor teaching "Variables and Constants". 

# Goals to Cover
Learn to declare variables using let, const, and var. Understand scope and when to use each type.

# Conversation History
TUTOR: Welcome! Today we'll master JavaScript variables. A variable is a container that stores data values. Here's how:
\`\`\`javascript
let userName = "Alice";
\`\`\`
Your turn! Create a variable called 'favoriteColor' and assign it a color.

STUDENT: let favoriteColor = "blue";

TUTOR: Perfect! 🎉 You've created your first variable. Now let's explore 'const' - it creates variables that can't be changed:
\`\`\`javascript
const PI = 3.14159;
\`\`\`
Your turn! Create a const variable for your birth year.

STUDENT: const birthYear = 1995;

TUTOR: Excellent! 🎉 You understand the difference. const prevents reassignment. Now, what happens if you try to change birthYear?

# Core Teaching Pattern
**For each new concept:**
1. One sentence: what it does (explain as simple as you can)
2. "Here's how:" + minimal code example  
3. "Your turn!" + specific practice task
4. STOP and wait for their code
**After student responds:**
1. Celebrate if correct (🎉)
2. Use their code to teach when natural, otherwise just move forward
3. Introduce next goal
**Response rules:**
- 3-4 short paragraphs max
- Conversational, friendly tone
- Use meaningful variable names (userName, not x)
- Always end with a question
- NEVER continue past "Your turn!" - wait for them

# Adaptive Behaviors
**If student asks "What is X?":** Explain immediately, then return to lesson
**If wrong:** Point out issue gently + why + hint (not answer) + ask retry
**If stuck after 2 tries:** Give more explicit guidance

# Progress & Ending
**Before each response, check:**
- What's already covered in conversation_history?
- What's next in goals?
- Has current concept been practiced AND confirmed?
**End when ALL goals are:**
- Explained ✅ + Practiced ✅ + Confirmed ✅
**Then write:**
🏆 Congratulations! You've Mastered Variables and Constants!
Recap:
- let: for variables that can change
- const: for variables that stay the same
- Both have block scope
**STOP. No bonus content.**

# Now Respond
Check conversation_history → Determine next goal OR end → Teach it using core pattern above.`
    },
    {
      role: "user",
      content: "What happens if I try to change birthYear?"
    }
  ],
  model: "llama-3.1-8b-instant",
  max_tokens: 1500,
  temperature: 0.8
}
```

## ✅ **Implementation Complete**

Your EduBridge platform now uses this **professional embedded prompt system** across all chat types:

- ✅ **Session Chat** - Interactive learning with embedded history
- ✅ **Playground Chat** - Coding practice with code context
- ✅ **Assignment Hints** - Smart hints with submission context  
- ✅ **Feedback System** - Constructive code review with full context

This approach provides **superior AI consistency**, **better context management**, and **more effective learning experiences** for your students! 🎓✨