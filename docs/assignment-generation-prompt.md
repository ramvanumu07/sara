I am building a JavaScript learning agent with assignments for each topic. I need you to generate assignment tasks based on the topic's outcomes.

CONTEXT:
* JS is taught as a general-purpose programming language (like C/Python), NOT for web development
* Goal: Build programming skills, logical thinking, and core computer science concepts
* Each topic has mini-tasks in session phase (solvable in <10 seconds) and a play phase for practice
* Assignments must be significantly harder - they should combine multiple outcomes and require actual problem-solving

ASSIGNMENT STRUCTURE:
```javascript
{
  id: 'topic-identifier',
  title: 'Topic Title',
  outcomes: ['outcome 1', 'outcome 2', ...],
  tasks: [
    {
      description: 'Task description as code comments',
      solution_type: 'script' | 'function',
      function_name: 'nameHere',  // Required for 'function' type
      testCases: [
        {
          input: {
            // For 'script': variables to declare (e.g., { temp: 25, unit: 'C' })
            // For 'function': function arguments (e.g., { arr: [1,2,3], target: 5 })
          },
          expectedOutput: 'expected result as string'
        }
      ]
    }
  ]
}
```

SOLUTION TYPES GUIDE:
1. **'script'**: Use for topics where students write procedural code (variables, loops, conditionals, etc.)
   - Input values become const declarations
   - Output is captured from console.log
   - Example topics: Numbers, Strings, Loops, Conditionals

2. **'function'**: Use for topics where students define and return values from functions
   - Input values become function arguments
   - Output is the return value (converted to string)
   - Must specify function_name
   - Example topics: Functions, Arrow Functions, Recursion, Array methods (map, filter, etc.)


CRITICAL RULES:
1. No fixed task count - Base the number on topic complexity (could be 3-20 tasks)

2. Tasks must be complex - Should combine multiple outcomes, not test one thing at a time

3. Unique logic patterns - Each task must require a distinct computational thinking approach. Avoid repetitive problem structures even with different contexts.

4. No untaught concepts - Only use outcomes already taught in current or previous topics

5. Clear, conversational descriptions - Write as natural instructions, not technical specifications

6. Specify correct solution_type based on the topic:
   - Early topics (console.log through conditionals, loops) → 'script'
   - Function-related topics → 'function' with function_name

7. Follow patterns for each solution_type:
   
   **For 'script' type:**
```javascript
   // Do not rename variableName, use it as input for your program.
   // While testing we will change its value.
   const variableName = value;
```
   
   **For 'function' type:**
```javascript
   // Create a function named functionName that takes parameter(s)
   // Your function should return the result
   function functionName(param1, param2) {
     // Your code here
   }
```
   
   **For 'class' type:**
```javascript
   // Create a class named ClassName
   // Include constructor and required methods
   class ClassName {
     constructor(param1, param2) {
       // Your code here
     }
   }
```

8. Show expected output as examples - Use format like:
```javascript
   // For example, your output should look like:
   // Output line 1
   // Output line 2
```
   NOT "First line:", "Second line:" format

9. No "START YOUR CODE" line - I add this automatically to every assignment

10. For 'function' type, input object keys should match parameter names when possible for clarity

NOW I'LL GIVE YOU:
* Topic List in order
* Current topic name
* Current topic outcomes list

Generate the final JSON structure with appropriate solution_type and test cases.
