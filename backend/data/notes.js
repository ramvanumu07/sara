/**
 * Subtopic Notes - Served via API on demand
 * Structure: { 'topicId-subtopicId': 'markdown notes' }
 */

export const notes = {
  'foundation-first-program': `## What is console.log?
\`console.log()\` displays output in the terminal/console. It's how you see what your code is doing.

## Basic Syntax
\`\`\`javascript
console.log("Hello, World!");  // Prints text
console.log(42);               // Prints a number
console.log(3.14);             // Prints a decimal
\`\`\`

## Printing Different Types
\`\`\`javascript
// Strings - text in quotes (single or double)
console.log("Hello");
console.log('Hello');

// Numbers - no quotes needed
console.log(100);
console.log(-50);
console.log(3.14159);
\`\`\`

## Multiple Values
\`\`\`javascript
console.log("Result:", 100);   // Outputs: Result: 100
console.log("Sum:", 5 + 3);    // Outputs: Sum: 8
\`\`\`

## Math Expressions
\`\`\`javascript
console.log(5 + 3);    // 8 (addition)
console.log(10 - 4);   // 6 (subtraction)
console.log(8 * 5);    // 40 (multiplication)
console.log(20 / 4);   // 5 (division)
\`\`\`

## Key Points
- Parentheses \`()\` are required
- Strings need quotes, numbers don't
- Expressions are calculated before printing`,

  'variables-variables-and-constants': `## What are Variables and Constants?
Containers that store values for reuse throughout your code.

## const - Constants (Cannot Change)
\`\`\`javascript
const PI = 3.14159;
const name = "JavaScript";
const age = 25;

// PI = 3.14;  // ❌ Error! Cannot reassign const
\`\`\`

## let - Variables (Can Change)
\`\`\`javascript
let score = 0;
score = 100;        // ✅ Can reassign
score = score + 50; // ✅ Can update

let count = 1;
count = count * 2;  // Now count is 2
\`\`\`

## When to Use Which
\`\`\`javascript
const TAX_RATE = 0.08;  // Never changes - use const
let total = 0;          // Will change - use let
\`\`\`

## Naming Conventions
\`\`\`javascript
// ✅ Good names (camelCase, descriptive)
const userName = "Alice";
let currentScore = 0;
const maxAttempts = 3;

// ❌ Bad names
const x = "Alice";     // Not descriptive
const USERNAME = "A";  // Reserved for true constants
\`\`\`

## Using Variables
\`\`\`javascript
const price = 100;
const quantity = 3;
const total = price * quantity;  // 300
console.log(total);
\`\`\`

## Key Rules
- Use \`const\` by default
- Use \`let\` only when value will change
- Never use \`var\` (outdated)
- Names are case-sensitive`,

  'data-types-numbers-arithmetic': `## Number Types
JavaScript has one number type for both integers and decimals.

\`\`\`javascript
const integer = 42;
const decimal = 3.14;
const negative = -100;
\`\`\`

## Basic Operators
\`\`\`javascript
console.log(10 + 5);   // 15 (addition)
console.log(10 - 5);   // 5 (subtraction)
console.log(10 * 5);   // 50 (multiplication)
console.log(10 / 5);   // 2 (division)
\`\`\`

## Modulo (Remainder)
\`\`\`javascript
console.log(10 % 3);   // 1 (remainder of 10 ÷ 3)
console.log(15 % 5);   // 0 (evenly divisible)
console.log(7 % 2);    // 1 (odd number check)
\`\`\`

## Operator Precedence
Like math class: \`* / %\` happen before \`+ -\`

\`\`\`javascript
console.log(2 + 3 * 4);    // 14 (not 20)
console.log((2 + 3) * 4);  // 20 (parentheses first)
\`\`\`

## Practical Examples
\`\`\`javascript
// Rectangle area and perimeter
const length = 10;
const width = 5;
const area = length * width;           // 50
const perimeter = 2 * (length + width); // 30

// Time conversion
const totalMinutes = 185;
const hours = Math.floor(totalMinutes / 60);  // 3
const minutes = totalMinutes % 60;             // 5

// Average
const sum = 78 + 85 + 92;
const average = sum / 3;  // 85

// Percentage
const price = 1250;
const discount = price * 0.20;  // 250 (20%)
const final = price - discount; // 1000
\`\`\``,

  'data-types-strings-operations': `## Creating Strings
Text enclosed in quotes (single or double).

\`\`\`javascript
const single = 'Hello';
const double = "World";
const mixed = "It's working";  // Use double when text has apostrophe
\`\`\`

## String Length
\`\`\`javascript
const word = "JavaScript";
console.log(word.length);  // 10
\`\`\`

## Accessing Characters (0-indexed)
\`\`\`javascript
const str = "Hello";
console.log(str[0]);    // "H" (first)
console.log(str[1]);    // "e" (second)
console.log(str[4]);    // "o" (fifth)
console.log(str[str.length - 1]);  // "o" (last)
\`\`\`

## String Concatenation
\`\`\`javascript
const first = "John";
const last = "Smith";
const full = first + " " + last;  // "John Smith"
\`\`\`

## Case Conversion
\`\`\`javascript
const text = "Hello World";
console.log(text.toUpperCase());  // "HELLO WORLD"
console.log(text.toLowerCase());  // "hello world"
\`\`\`

## Practical Examples
\`\`\`javascript
// Get initials
const firstName = "Alice";
const lastName = "Brown";
const initials = firstName[0] + lastName[0];  // "AB"

// Access specific positions
const word = "Programming";
const first3 = word[0] + word[1] + word[2];  // "Pro"

// Middle character (for odd length)
const middle = word[Math.floor(word.length / 2)];
\`\`\`

## Key Points
- Strings are immutable (cannot change individual characters)
- Index starts at 0
- Use \`.length\` for character count
- Use \`+\` to join strings`,

  'data-types-undefined-null': `## undefined
A variable declared but not assigned a value.

\`\`\`javascript
let x;
console.log(x);         // undefined
console.log(typeof x);  // "undefined"
\`\`\`

## null
Intentionally assigned to represent "no value."

\`\`\`javascript
let user = null;        // Deliberately empty
console.log(user);      // null
console.log(typeof user);  // "object" (JS quirk)
\`\`\`

## Key Difference
\`\`\`javascript
// undefined = not assigned yet
let notAssigned;

// null = deliberately empty
let cleared = null;
\`\`\`

## Common Use Cases
\`\`\`javascript
// Reset a variable
let data = 100;
console.log(data);        // 100
console.log(typeof data); // "number"

data = null;              // Clear it intentionally
console.log(data);        // null
console.log(typeof data); // "object"
\`\`\`

## Checking for undefined/null
\`\`\`javascript
let value;
if (value === undefined) {
  console.log("Not assigned");
}

let empty = null;
if (empty === null) {
  console.log("Intentionally empty");
}
\`\`\`

## Key Points
- \`undefined\`: Variable exists but has no value
- \`null\`: Explicitly assigned to mean "nothing"
- \`typeof undefined\` → "undefined"
- \`typeof null\` → "object" (historical bug in JS)`,

  'date-time-date-time': `## Creating Dates
\`\`\`javascript
// Current date/time
const now = new Date();

// From string
const date1 = new Date("2024-01-15");

// From parts (month is 0-indexed!)
const date2 = new Date(2024, 0, 15);  // Jan 15, 2024
const date3 = new Date(2024, 11, 25); // Dec 25, 2024
\`\`\`

## Getting Date Parts
\`\`\`javascript
const date = new Date("2024-03-15");

date.getFullYear();  // 2024
date.getMonth();     // 2 (March, 0-indexed)
date.getDate();      // 15
date.getDay();       // 5 (Friday, 0=Sunday)
date.getHours();     // hours
date.getMinutes();   // minutes
date.getSeconds();   // seconds
\`\`\`

## Month is 0-Indexed!
\`\`\`javascript
// January = 0, December = 11
const months = ['Jan','Feb','Mar','Apr','May','Jun',
                'Jul','Aug','Sep','Oct','Nov','Dec'];
\`\`\`

## Day of Week
\`\`\`javascript
const days = ['Sunday','Monday','Tuesday','Wednesday',
              'Thursday','Friday','Saturday'];
const dayName = days[date.getDay()];
\`\`\`

## Date Calculations
\`\`\`javascript
// Days between dates
const date1 = new Date("2024-01-01");
const date2 = new Date("2024-01-10");
const diffMs = date2 - date1;
const diffDays = diffMs / (1000 * 60 * 60 * 24);  // 9

// Add days
const future = new Date(date1);
future.setDate(future.getDate() + 10);
\`\`\`

## Formatting
\`\`\`javascript
const date = new Date("2024-03-15");
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');
const formatted = \`\${year}-\${month}-\${day}\`;  // "2024-03-15"
\`\`\`

## Leap Year Check
\`\`\`javascript
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
\`\`\``,

  'type-coercion-type-coercion': `## What is Type Coercion?
Automatic or manual conversion between types (string, number, boolean).

## Explicit Conversion (You Control It)
\`\`\`javascript
// To String
String(123);        // "123"
String(true);       // "true"
(123).toString();   // "123"

// To Number
Number("123");      // 123
Number("abc");      // NaN
parseInt("42px");   // 42
parseFloat("3.14"); // 3.14

// To Boolean
Boolean(1);         // true
Boolean(0);         // false
Boolean("");        // false
Boolean("hello");   // true
\`\`\`

## Truthy and Falsy Values
\`\`\`javascript
// Falsy (convert to false)
false, 0, "", null, undefined, NaN

// Truthy (everything else)
true, 1, "hello", [], {}, -1, "0"
\`\`\`

## Implicit Coercion (Automatic)
\`\`\`javascript
// + with string concatenates
"5" + 3;      // "53" (string)
5 + "3";      // "53" (string)

// Other operators convert to number
"5" - 3;      // 2 (number)
"5" * 2;      // 10 (number)
"10" / 2;     // 5 (number)
\`\`\`

## Equality Comparison
\`\`\`javascript
// == allows coercion (avoid!)
5 == "5";     // true
0 == false;   // true
null == undefined;  // true

// === strict equality (use this!)
5 === "5";    // false
0 === false;  // false
\`\`\`

## NaN (Not a Number)
\`\`\`javascript
Number("abc");     // NaN
NaN === NaN;       // false (!)
isNaN(NaN);        // true
Number.isNaN(NaN); // true (safer)
\`\`\`

## Best Practices
\`\`\`javascript
// Always use explicit conversion
const num = Number(userInput);
const str = String(value);

// Always use strict equality
if (value === 5) { }

// Check for NaN properly
if (Number.isNaN(result)) { }
\`\`\``,

  'math-object-math-object': `## Math Object
Built-in object with mathematical functions and constants.

## Rounding
\`\`\`javascript
Math.round(4.5);   // 5 (nearest integer)
Math.round(4.4);   // 4

Math.floor(4.9);   // 4 (round down)
Math.ceil(4.1);    // 5 (round up)
Math.trunc(4.9);   // 4 (remove decimal, no rounding)
Math.trunc(-4.9);  // -4
\`\`\`

## Absolute Value
\`\`\`javascript
Math.abs(-15);     // 15
Math.abs(15);      // 15
\`\`\`

## Power and Square Root
\`\`\`javascript
Math.pow(2, 8);    // 256 (2^8)
Math.sqrt(144);    // 12
Math.sqrt(2);      // 1.4142...
\`\`\`

## Min and Max
\`\`\`javascript
Math.min(5, 3, 9, 1);  // 1
Math.max(5, 3, 9, 1);  // 9

// With array (use spread)
const nums = [5, 3, 9, 1];
Math.min(...nums);     // 1
Math.max(...nums);     // 9
\`\`\`

## Random Numbers
\`\`\`javascript
Math.random();         // 0 to 0.999...

// Random integer 0 to 9
Math.floor(Math.random() * 10);

// Random integer 1 to 10
Math.floor(Math.random() * 10) + 1;

// Random integer min to max
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
\`\`\`

## Constants
\`\`\`javascript
Math.PI;     // 3.14159...
Math.E;      // 2.71828... (Euler's number)
\`\`\`

## Practical Examples
\`\`\`javascript
// Circle area
const radius = 7;
const area = Math.PI * Math.pow(radius, 2);  // 153.938...

// Round to 2 decimal places
const rounded = Math.round(area * 100) / 100;  // 153.94
\`\`\``,

  'operators-operators': `## Increment and Decrement
\`\`\`javascript
let count = 5;
count++;        // 6 (add 1)
count--;        // 5 (subtract 1)
\`\`\`

## Compound Assignment
\`\`\`javascript
let x = 10;
x += 5;         // x = x + 5 → 15
x -= 3;         // x = x - 3 → 12
x *= 2;         // x = x * 2 → 24
x /= 4;         // x = x / 4 → 6
x %= 4;         // x = x % 4 → 2
\`\`\`

## Comparison Operators
\`\`\`javascript
5 > 3;          // true (greater than)
5 < 3;          // false (less than)
5 >= 5;         // true (greater or equal)
5 <= 4;         // false (less or equal)
5 === 5;        // true (strict equal)
5 !== 3;        // true (strict not equal)
\`\`\`

## Logical Operators
\`\`\`javascript
// AND (&&) - both must be true
true && true;   // true
true && false;  // false

// OR (||) - at least one true
true || false;  // true
false || false; // false

// NOT (!) - flip the value
!true;          // false
!false;         // true
\`\`\`

## Combining Conditions
\`\`\`javascript
const age = 25;
const hasLicense = true;

// Check multiple conditions
const canDrive = age >= 18 && hasLicense;  // true

const isWeekend = false;
const isHoliday = true;
const dayOff = isWeekend || isHoliday;     // true
\`\`\`

## Practical Example
\`\`\`javascript
// Loan eligibility
const age = 28;
const income = 55000;
const creditScore = 720;

const ageOk = age >= 21 && age <= 60;      // true
const incomeOk = income >= 30000;           // true
const creditOk = creditScore >= 700;        // true
const eligible = ageOk && incomeOk && creditOk;  // true
\`\`\``,

  'conditionals-if-statements': `## Basic if Statement
Executes code only when condition is true.

\`\`\`javascript
if (condition) {
  // Code runs only if condition is true
}
\`\`\`

## Examples
\`\`\`javascript
const age = 18;

if (age >= 18) {
  console.log("You are an adult");
}

const score = 85;
if (score >= 60) {
  console.log("You passed!");
}
\`\`\`

## Multiple Conditions
\`\`\`javascript
const age = 25;
const hasID = true;

if (age >= 18 && hasID) {
  console.log("Entry allowed");
}
\`\`\`

## Key Points
- Condition must evaluate to true/false
- Code block uses curly braces \`{ }\`
- If condition is false, code is skipped`,

  'conditionals-if-else': `## if-else Statement
Choose between two paths - one or the other.

\`\`\`javascript
if (condition) {
  // Runs when true
} else {
  // Runs when false
}
\`\`\`

## Examples
\`\`\`javascript
const number = 17;

if (number % 2 === 0) {
  console.log("Even");
} else {
  console.log("Odd");
}
// Output: "Odd"

const score = 58;
if (score >= 60) {
  console.log("Pass");
} else {
  console.log("Fail");
}
// Output: "Fail"
\`\`\`

## Practical Example
\`\`\`javascript
const balance = 500;
const withdrawal = 300;

if (balance >= withdrawal) {
  const remaining = balance - withdrawal;
  console.log(remaining);  // 200
} else {
  console.log("Insufficient funds");
}
\`\`\`

## Key Points
- Exactly ONE branch executes
- if and else are mutually exclusive`,

  'conditionals-else-if-chains': `## else-if Chains
Check multiple conditions in sequence.

\`\`\`javascript
if (condition1) {
  // First check
} else if (condition2) {
  // Second check
} else if (condition3) {
  // Third check
} else {
  // Default (none matched)
}
\`\`\`

## Grade Example
\`\`\`javascript
const score = 73;

if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");
} else if (score >= 70) {
  console.log("C");
} else if (score >= 60) {
  console.log("D");
} else {
  console.log("F");
}
// Output: "C"
\`\`\`

## Age Category Example
\`\`\`javascript
const age = 45;

if (age < 13) {
  console.log("Child");
} else if (age < 20) {
  console.log("Teen");
} else if (age < 60) {
  console.log("Adult");
} else {
  console.log("Senior");
}
// Output: "Adult"
\`\`\`

## Key Points
- Order matters! First true condition wins
- Only ONE branch executes
- Final \`else\` is optional (catches everything else)`,

  'conditionals-nested-conditions': `## Nested if Statements
Place if statements inside other if/else blocks.

\`\`\`javascript
if (outerCondition) {
  if (innerCondition) {
    // Both conditions true
  } else {
    // Outer true, inner false
  }
} else {
  // Outer false
}
\`\`\`

## Login Example
\`\`\`javascript
const userExists = true;
const passwordCorrect = true;

if (userExists) {
  if (passwordCorrect) {
    console.log("Login successful");
  } else {
    console.log("Wrong password");
  }
} else {
  console.log("User not found");
}
\`\`\`

## Driving Check
\`\`\`javascript
const age = 25;
const hasLicense = true;

if (age >= 18) {
  if (hasLicense) {
    console.log("Can drive");
  } else {
    console.log("Need license");
  }
} else {
  console.log("Too young");
}
\`\`\`

## Number Classification
\`\`\`javascript
const number = -15;

if (number >= 0) {
  if (number % 2 === 0) {
    console.log("Positive Even");
  } else {
    console.log("Positive Odd");
  }
} else {
  if (number % 2 === 0) {
    console.log("Negative Even");
  } else {
    console.log("Negative Odd");
  }
}
// Output: "Negative Odd"
\`\`\`

## Key Points
- Outer condition checked first
- Inner only checked if outer is true
- Keep nesting shallow for readability`,

  'loops-while-loops': `## while Loop
Repeats while condition is true.

\`\`\`javascript
while (condition) {
  // Code repeats while condition is true
  // Must update something to eventually exit!
}
\`\`\`

## Counter Pattern
\`\`\`javascript
let i = 1;
while (i <= 5) {
  console.log(i);  // 1, 2, 3, 4, 5
  i++;
}
\`\`\`

## Sum Example
\`\`\`javascript
let sum = 0;
let i = 1;
while (i <= 10) {
  sum += i;  // Add current number to sum
  i++;
}
console.log(sum);  // 55
\`\`\`

## Doubling Until Threshold
\`\`\`javascript
let value = 5;
while (value <= 100) {
  console.log(value);  // 5, 10, 20, 40, 80, 160
  value *= 2;
}
\`\`\`

## Multiplication Table
\`\`\`javascript
const num = 7;
let i = 1;
while (i <= 10) {
  console.log(num * i);  // 7, 14, 21... 70
  i++;
}
\`\`\`

## Key Points
- Condition checked BEFORE each iteration
- Loop body must change something to avoid infinite loop
- Use when number of iterations is unknown`,

  'loops-for-loops': `## for Loop
Compact loop with initialization, condition, and update.

\`\`\`javascript
for (init; condition; update) {
  // Code runs for each iteration
}
\`\`\`

## Basic Example
\`\`\`javascript
for (let i = 1; i <= 5; i++) {
  console.log(i);  // 1, 2, 3, 4, 5
}
\`\`\`

## Even Numbers
\`\`\`javascript
for (let i = 2; i <= 20; i += 2) {
  console.log(i);  // 2, 4, 6, 8... 20
}
\`\`\`

## Countdown
\`\`\`javascript
for (let i = 10; i >= 1; i--) {
  console.log(i);  // 10, 9, 8... 1
}
\`\`\`

## Factorial
\`\`\`javascript
let factorial = 1;
for (let i = 1; i <= 6; i++) {
  factorial *= i;
}
console.log(factorial);  // 720 (6!)
\`\`\`

## Sum of Odd Numbers
\`\`\`javascript
let sum = 0;
for (let i = 1; i <= 100; i += 2) {
  sum += i;
}
console.log(sum);  // 2500
\`\`\`

## Key Points
- \`init\`: runs once before loop starts
- \`condition\`: checked before each iteration
- \`update\`: runs after each iteration
- Preferred when iterations are known`,

  'loops-loop-control': `## break Statement
Immediately exits the entire loop.

\`\`\`javascript
for (let i = 1; i <= 100; i++) {
  if (i === 5) {
    break;  // Exit loop at 5
  }
  console.log(i);  // 1, 2, 3, 4
}
\`\`\`

## continue Statement
Skips to next iteration.

\`\`\`javascript
for (let i = 1; i <= 5; i++) {
  if (i === 3) {
    continue;  // Skip 3
  }
  console.log(i);  // 1, 2, 4, 5
}
\`\`\`

## Find First Match (break)
\`\`\`javascript
// Find first number divisible by 7 between 50-100
for (let i = 50; i <= 100; i++) {
  if (i % 7 === 0) {
    console.log(i);  // 56
    break;
  }
}
\`\`\`

## Skip Multiples (continue)
\`\`\`javascript
// Print 1-30, skip multiples of 4
for (let i = 1; i <= 30; i++) {
  if (i % 4 === 0) {
    continue;
  }
  console.log(i);
}
\`\`\`

## Sum Until Threshold
\`\`\`javascript
let sum = 0;
let count = 0;

for (let i = 1; i <= 100; i++) {
  sum += i;
  count++;
  if (sum > 200) {
    break;
  }
}
console.log(sum);    // 210
console.log(count);  // 20
\`\`\`

## Key Points
- \`break\`: exit loop completely
- \`continue\`: skip to next iteration
- Use \`break\` when you've found what you need
- Use \`continue\` to skip specific values`,

  'loops-nested-loops': `## Nested Loops
A loop inside another loop.

\`\`\`javascript
for (let outer = 1; outer <= 3; outer++) {
  for (let inner = 1; inner <= 2; inner++) {
    console.log(outer, inner);
  }
}
// Output: (1,1) (1,2) (2,1) (2,2) (3,1) (3,2)
\`\`\`

## Triangle Pattern
\`\`\`javascript
for (let row = 1; row <= 5; row++) {
  let stars = "";
  for (let col = 1; col <= row; col++) {
    stars += "*";
  }
  console.log(stars);
}
// *
// **
// ***
// ****
// *****
\`\`\`

## Multiplication Grid
\`\`\`javascript
for (let row = 1; row <= 4; row++) {
  let line = "";
  for (let col = 1; col <= 6; col++) {
    line += (row * col) + " ";
  }
  console.log(line);
}
// 1 2 3 4 5 6
// 2 4 6 8 10 12
// 3 6 9 12 15 18
// 4 8 12 16 20 24
\`\`\`

## Coordinate Pairs
\`\`\`javascript
for (let row = 1; row <= 3; row++) {
  for (let col = 1; col <= 4; col++) {
    console.log(\`\${row},\${col}\`);
  }
}
// 1,1  1,2  1,3  1,4
// 2,1  2,2  2,3  2,4
// 3,1  3,2  3,3  3,4
\`\`\`

## Key Points
- Inner loop completes fully for each outer iteration
- Total iterations = outer × inner
- Useful for grids, patterns, 2D data`,

  'arrays-arrays': `## Creating Arrays
Store multiple values in a single variable.

\`\`\`javascript
const numbers = [10, 25, 8, 17, 42];
const names = ["Alice", "Bob", "Charlie"];
const mixed = [1, "hello", true];
const empty = [];
\`\`\`

## Accessing Elements (0-indexed)
\`\`\`javascript
const arr = [10, 20, 30, 40];
arr[0];              // 10 (first)
arr[2];              // 30 (third)
arr[arr.length - 1]; // 40 (last)
\`\`\`

## Array Length
\`\`\`javascript
const arr = [1, 2, 3, 4, 5];
arr.length;  // 5
\`\`\`

## Modifying Elements
\`\`\`javascript
const arr = [1, 2, 3];
arr[1] = 99;  // [1, 99, 3]
\`\`\`

## Iterating with Loops
\`\`\`javascript
const nums = [4, 9, 2, 7];
let sum = 0;
for (let i = 0; i < nums.length; i++) {
  sum += nums[i];
}
console.log(sum);  // 22
\`\`\`

## Find Maximum
\`\`\`javascript
const nums = [23, 67, 12, 89, 45];
let max = nums[0];
for (let i = 1; i < nums.length; i++) {
  if (nums[i] > max) {
    max = nums[i];
  }
}
console.log(max);  // 89
\`\`\`

## Count Matches
\`\`\`javascript
const nums = [3, 8, 12, 5, 17, 9];
let count = 0;
for (let i = 0; i < nums.length; i++) {
  if (nums[i] > 10) {
    count++;
  }
}
console.log(count);  // 2
\`\`\`

## Find First Match
\`\`\`javascript
const nums = [5, 12, 8, 19, 3];
let found = -1;
for (let i = 0; i < nums.length; i++) {
  if (nums[i] > 10) {
    found = nums[i];
    break;
  }
}
console.log(found);  // 12
\`\`\`

## Key Points
- Index starts at 0
- \`.length\` gives count of elements
- Use loops to process all elements`,

  'functions-functions': `## Function Declaration
Reusable blocks of code.

\`\`\`javascript
function greet() {
  console.log("Hello!");
}
greet();  // Call the function
\`\`\`

## Parameters and Arguments
\`\`\`javascript
function add(a, b) {      // a, b are parameters
  return a + b;
}
const result = add(5, 3); // 5, 3 are arguments
console.log(result);      // 8
\`\`\`

## Return Values
\`\`\`javascript
function square(n) {
  return n * n;  // Sends value back
}
const result = square(4);  // 16
\`\`\`

## return vs console.log
\`\`\`javascript
// return: gives value back to caller
function getSum(a, b) {
  return a + b;  // Can use this value
}
const total = getSum(5, 3);  // total = 8

// console.log: just displays, returns nothing
function showSum(a, b) {
  console.log(a + b);  // Displays 8
}
const result = showSum(5, 3);  // result = undefined
\`\`\`

## Multiple Parameters
\`\`\`javascript
function findMax(a, b, c) {
  if (a >= b && a >= c) return a;
  if (b >= a && b >= c) return b;
  return c;
}
findMax(5, 9, 3);  // 9
\`\`\`

## Practical Examples
\`\`\`javascript
function isEven(n) {
  return n % 2 === 0;
}

function celsiusToFahrenheit(c) {
  return c * 9/5 + 32;
}

function isDivisible(a, b) {
  return a % b === 0;
}

function sumArray(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }
  return sum;
}
\`\`\`

## Function Naming
\`\`\`javascript
// ✅ Good: verb + noun, camelCase
function calculateTotal(items) { }
function getUserName() { }
function isValidEmail(email) { }

// ❌ Bad
function x() { }
function process() { }
\`\`\`

## Key Points
- Use \`return\` to send values back
- Functions do ONE specific thing
- Use descriptive verb-based names`,

  'recursion-recursion': `## What is Recursion?
A function that calls itself to solve smaller subproblems.

\`\`\`javascript
function recurse(n) {
  if (n <= 0) return;  // Base case: STOP
  console.log(n);
  recurse(n - 1);      // Recursive call
}
\`\`\`

## Two Essential Parts
1. **Base Case**: When to stop (prevents infinite loop)
2. **Recursive Case**: Call itself with smaller input

## Sum 1 to N
\`\`\`javascript
function sumTo(n) {
  if (n <= 0) return 0;        // Base case
  return n + sumTo(n - 1);     // n + sum of rest
}
sumTo(5);  // 5 + 4 + 3 + 2 + 1 + 0 = 15
\`\`\`

## Factorial
\`\`\`javascript
function factorial(n) {
  if (n <= 1) return 1;        // Base case
  return n * factorial(n - 1); // n * factorial of (n-1)
}
factorial(5);  // 5 * 4 * 3 * 2 * 1 = 120
\`\`\`

## Fibonacci
\`\`\`javascript
function fib(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  return fib(n - 1) + fib(n - 2);
}
fib(6);  // 8 (0,1,1,2,3,5,8)
\`\`\`

## Array Sum
\`\`\`javascript
function sumArray(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sumArray(arr.slice(1));
}
sumArray([1, 2, 3, 4]);  // 10
\`\`\`

## Reverse String
\`\`\`javascript
function reverse(str) {
  if (str.length <= 1) return str;
  return reverse(str.slice(1)) + str[0];
}
reverse("hello");  // "olleh"
\`\`\`

## Palindrome Check
\`\`\`javascript
function isPalindrome(str) {
  if (str.length <= 1) return true;
  if (str[0] !== str[str.length - 1]) return false;
  return isPalindrome(str.slice(1, -1));
}
isPalindrome("racecar");  // true
\`\`\`

## Key Points
- Always have a base case!
- Each call should move toward base case
- Think: "How is this a smaller version of the same problem?"`,

  'array-methods-foreach': `## forEach Method
Execute a function for each element.

\`\`\`javascript
array.forEach((element, index, array) => {
  // Do something with each element
});
\`\`\`

## Basic Usage
\`\`\`javascript
const nums = [1, 2, 3];
nums.forEach(num => console.log(num));
// 1
// 2
// 3
\`\`\`

## With Index
\`\`\`javascript
const fruits = ['apple', 'banana', 'cherry'];
fruits.forEach((fruit, i) => {
  console.log(\`\${i}: \${fruit}\`);
});
// 0: apple
// 1: banana
// 2: cherry
\`\`\`

## Accumulating with External Variable
\`\`\`javascript
const nums = [1, 2, 3, 4, 5];
let sum = 0;
nums.forEach(num => {
  sum += num;
});
console.log(sum);  // 15
\`\`\`

## Counting Matches
\`\`\`javascript
const nums = [5, 15, 8, 20, 3, 12];
let count = 0;
nums.forEach(num => {
  if (num > 10) count++;
});
console.log(count);  // 3
\`\`\`

## Key Points
- forEach returns \`undefined\` (not a new array)
- Used for side effects (logging, updating external vars)
- Cannot break out early (use regular for loop if needed)`,

  'array-methods-map': `## map Method
Transform each element into something new.

\`\`\`javascript
const newArray = array.map(element => {
  return transformedValue;
});
\`\`\`

## Double Numbers
\`\`\`javascript
const nums = [1, 2, 3, 4];
const doubled = nums.map(n => n * 2);
console.log(doubled);  // [2, 4, 6, 8]
\`\`\`

## Square Numbers
\`\`\`javascript
const nums = [1, 2, 3, 4];
const squared = nums.map(n => n * n);
console.log(squared);  // [1, 4, 9, 16]
\`\`\`

## Uppercase Strings
\`\`\`javascript
const words = ['hello', 'world'];
const upper = words.map(w => w.toUpperCase());
console.log(upper);  // ['HELLO', 'WORLD']
\`\`\`

## Get String Lengths
\`\`\`javascript
const words = ['hi', 'hello', 'hey'];
const lengths = words.map(w => w.length);
console.log(lengths);  // [2, 5, 3]
\`\`\`

## Even/Odd Labels
\`\`\`javascript
const nums = [1, 2, 3, 4];
const labels = nums.map(n => n % 2 === 0 ? 'even' : 'odd');
console.log(labels);  // ['odd', 'even', 'odd', 'even']
\`\`\`

## Key Points
- Returns a NEW array (same length)
- Original array unchanged
- Each element is transformed by callback`,

  'array-methods-filter': `## filter Method
Keep only elements that pass a test.

\`\`\`javascript
const filtered = array.filter(element => {
  return true;  // keep element
  return false; // exclude element
});
\`\`\`

## Filter Even Numbers
\`\`\`javascript
const nums = [1, 2, 3, 4, 5, 6];
const evens = nums.filter(n => n % 2 === 0);
console.log(evens);  // [2, 4, 6]
\`\`\`

## Filter by Threshold
\`\`\`javascript
const nums = [1, 5, 10, 15, 20];
const big = nums.filter(n => n > 10);
console.log(big);  // [15, 20]
\`\`\`

## Filter Long Strings
\`\`\`javascript
const words = ['hi', 'hello', 'hey', 'world'];
const long = words.filter(w => w.length > 3);
console.log(long);  // ['hello', 'world']
\`\`\`

## Filter Positive Numbers
\`\`\`javascript
const nums = [-3, -1, 0, 1, 3];
const positive = nums.filter(n => n > 0);
console.log(positive);  // [1, 3]
\`\`\`

## Multiple Conditions
\`\`\`javascript
const nums = [1, 6, 8, 12, 15, 18];
const divisibleBy2And3 = nums.filter(n => n % 2 === 0 && n % 3 === 0);
console.log(divisibleBy2And3);  // [6, 12, 18]
\`\`\`

## Key Points
- Returns NEW array (may be shorter)
- Callback must return true/false
- Original array unchanged`,

  'array-methods-find-findindex': `## find Method
Returns FIRST element that matches.

\`\`\`javascript
const found = array.find(element => condition);
// Returns element or undefined
\`\`\`

## findIndex Method
Returns INDEX of first match.

\`\`\`javascript
const index = array.findIndex(element => condition);
// Returns index or -1
\`\`\`

## Find First Even
\`\`\`javascript
const nums = [1, 3, 4, 6, 8];
const firstEven = nums.find(n => n % 2 === 0);
console.log(firstEven);  // 4 (not [4, 6, 8])
\`\`\`

## Find Index of Negative
\`\`\`javascript
const nums = [5, 3, -2, 8, -4];
const idx = nums.findIndex(n => n < 0);
console.log(idx);  // 2
\`\`\`

## Find Greater Than
\`\`\`javascript
const nums = [1, 5, 10, 15];
const found = nums.find(n => n > 8);
console.log(found);  // 10
\`\`\`

## Not Found
\`\`\`javascript
const nums = [1, 2, 3];
const result = nums.find(n => n > 10);
console.log(result);  // undefined

const idx = nums.findIndex(n => n > 10);
console.log(idx);  // -1
\`\`\`

## Find String Starting With
\`\`\`javascript
const words = ['banana', 'Apple', 'cherry'];
const idx = words.findIndex(w => w.toLowerCase().startsWith('a'));
console.log(idx);  // 1
\`\`\`

## Key Points
- \`find\`: returns element or undefined
- \`findIndex\`: returns index or -1
- Both stop at FIRST match`,

  'array-methods-some-every': `## some Method
Returns true if ANY element passes.

\`\`\`javascript
const hasMatch = array.some(element => condition);
\`\`\`

## every Method
Returns true if ALL elements pass.

\`\`\`javascript
const allPass = array.every(element => condition);
\`\`\`

## some: Any Negative?
\`\`\`javascript
[1, 2, -3, 4].some(n => n < 0);  // true
[1, 2, 3, 4].some(n => n < 0);   // false
\`\`\`

## every: All Positive?
\`\`\`javascript
[1, 2, 3, 4].every(n => n > 0);    // true
[1, 2, -3, 4].every(n => n > 0);   // false
\`\`\`

## some: Any Divisible by 5?
\`\`\`javascript
[3, 7, 10, 12].some(n => n % 5 === 0);  // true
[1, 2, 3, 4].some(n => n % 5 === 0);    // false
\`\`\`

## every: All Strings > 2 chars?
\`\`\`javascript
['hello', 'world', 'hey'].every(s => s.length > 2);  // true
['hi', 'hello'].every(s => s.length > 2);            // false
\`\`\`

## Empty Array Behavior
\`\`\`javascript
[].some(n => n > 0);   // false (no elements to test)
[].every(n => n > 0);  // true (vacuously true)
\`\`\`

## Key Points
- \`some\`: "Is there at least one?"
- \`every\`: "Do all of them?"
- Both stop early when result is determined`,

  'array-methods-reduce': `## reduce Method
Accumulate array into a single value.

\`\`\`javascript
const result = array.reduce((accumulator, current) => {
  return newAccumulator;
}, initialValue);
\`\`\`

## Sum Numbers
\`\`\`javascript
const nums = [1, 2, 3, 4, 5];
const sum = nums.reduce((acc, n) => acc + n, 0);
console.log(sum);  // 15
\`\`\`

## Product
\`\`\`javascript
const nums = [1, 2, 3, 4];
const product = nums.reduce((acc, n) => acc * n, 1);
console.log(product);  // 24
\`\`\`

## Find Maximum
\`\`\`javascript
const nums = [3, 7, 2, 9, 5];
const max = nums.reduce((acc, n) => n > acc ? n : acc, nums[0]);
console.log(max);  // 9
\`\`\`

## Count Even Numbers
\`\`\`javascript
const nums = [1, 2, 3, 4, 5, 6];
const count = nums.reduce((acc, n) => {
  return n % 2 === 0 ? acc + 1 : acc;
}, 0);
console.log(count);  // 3
\`\`\`

## Join Strings
\`\`\`javascript
const words = ['a', 'b', 'c'];
const joined = words.reduce((acc, w) => {
  return acc === '' ? w : acc + ' - ' + w;
}, '');
console.log(joined);  // "a - b - c"
\`\`\`

## Build Object
\`\`\`javascript
const nums = [1, 2, 3, 4];
const result = nums.reduce((acc, n) => {
  acc.sum += n;
  acc.count++;
  return acc;
}, { sum: 0, count: 0 });
// { sum: 10, count: 4 }
\`\`\`

## Key Points
- Extremely versatile (sum, product, max, count, transform)
- Initial value is important!
- Accumulator carries result through iterations`,

  'string-methods-string-manipulations': `## trim - Remove Whitespace
\`\`\`javascript
"  hello  ".trim();      // "hello"
"  spaces  ".trim();     // "spaces"
\`\`\`

## replace / replaceAll
\`\`\`javascript
// Replace first occurrence
"hello world".replace("o", "0");     // "hell0 world"

// Replace all occurrences
"hello world".replaceAll("o", "0");  // "hell0 w0rld"
"one two three".replaceAll(" ", "-"); // "one-two-three"
\`\`\`

## repeat
\`\`\`javascript
"ab".repeat(3);   // "ababab"
"*".repeat(5);    // "*****"
"x".repeat(0);    // ""
\`\`\`

## padStart / padEnd
\`\`\`javascript
// Pad beginning
"42".padStart(5, "0");   // "00042"
"7".padStart(3, "0");    // "007"

// Pad end
"hi".padEnd(5, ".");     // "hi..."
\`\`\`

## Title Case (Capitalize Words)
\`\`\`javascript
function titleCase(str) {
  return str.split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
titleCase("hello world");     // "Hello World"
titleCase("ALREADY CAPS");    // "Already Caps"
\`\`\`

## Key Points
- \`trim()\`: removes leading/trailing whitespace
- \`replace()\`: first occurrence only
- \`replaceAll()\`: all occurrences
- \`padStart/padEnd\`: pad to specified length`,

  'string-methods-split-join': `## split - String to Array
\`\`\`javascript
"hello world".split(" ");    // ["hello", "world"]
"a,b,c".split(",");          // ["a", "b", "c"]
"hello".split("");           // ["h", "e", "l", "l", "o"]
\`\`\`

## join - Array to String
\`\`\`javascript
["hello", "world"].join(" ");  // "hello world"
["a", "b", "c"].join(",");     // "a,b,c"
["a", "b", "c"].join("");      // "abc"
["a", "b", "c"].join(" | ");   // "a | b | c"
\`\`\`

## Reverse a String
\`\`\`javascript
function reverseString(str) {
  return str.split("").reverse().join("");
}
reverseString("hello");  // "olleh"
\`\`\`

## Count Words
\`\`\`javascript
function wordCount(str) {
  if (str === "") return 0;
  return str.split(" ").length;
}
wordCount("hello world");  // 2
\`\`\`

## Convert CSV to Pipe-Separated
\`\`\`javascript
function csvToPipe(csv) {
  return csv.split(",").join(" | ");
}
csvToPipe("a,b,c");  // "a | b | c"
\`\`\`

## Key Points
- \`split(separator)\`: breaks string at separator
- \`join(separator)\`: combines array with separator
- Empty separator splits into characters`,

  'string-methods-substring-slice': `## slice Method
Extract portion of string.

\`\`\`javascript
str.slice(start, end);  // end is exclusive
\`\`\`

## Basic Usage
\`\`\`javascript
"hello".slice(0, 3);    // "hel" (chars 0, 1, 2)
"hello".slice(2);       // "llo" (from index 2 to end)
\`\`\`

## Negative Indices
\`\`\`javascript
"hello".slice(-3);      // "llo" (last 3 chars)
"hello".slice(-3, -1);  // "ll" (from -3 to -1, exclusive)
\`\`\`

## First N Characters
\`\`\`javascript
"JavaScript".slice(0, 3);  // "Jav"
\`\`\`

## Last N Characters
\`\`\`javascript
"JavaScript".slice(-3);    // "ipt"
\`\`\`

## Remove First and Last
\`\`\`javascript
"hello".slice(1, -1);      // "ell"
\`\`\`

## Middle Characters
\`\`\`javascript
function getMiddle(str) {
  const mid = Math.floor(str.length / 2);
  if (str.length % 2 === 0) {
    return str.slice(mid - 1, mid + 1);  // Two chars
  }
  return str.slice(mid, mid + 1);        // One char
}
getMiddle("hello");  // "l"
getMiddle("test");   // "es"
\`\`\`

## Key Points
- End index is not included
- Negative indices count from end
- Original string unchanged`,

  'string-methods-string-searching': `## includes - Contains?
\`\`\`javascript
"hello world".includes("world");  // true
"hello world".includes("xyz");    // false
\`\`\`

## indexOf - Find Position
\`\`\`javascript
"hello world".indexOf("o");       // 4 (first occurrence)
"hello world".indexOf("xyz");     // -1 (not found)
\`\`\`

## lastIndexOf - Find Last
\`\`\`javascript
"hello world".lastIndexOf("o");   // 7 (last occurrence)
"banana".lastIndexOf("a");        // 5
\`\`\`

## startsWith / endsWith
\`\`\`javascript
"hello".startsWith("he");         // true
"hello".startsWith("lo");         // false

"hello.js".endsWith(".js");       // true
"hello.txt".endsWith(".js");      // false
\`\`\`

## Count Character Occurrences
\`\`\`javascript
function countChar(str, char) {
  let count = 0;
  for (let c of str) {
    if (c === char) count++;
  }
  return count;
}
countChar("mississippi", "s");  // 4

// Or with split:
function countChar(str, char) {
  return str.split(char).length - 1;
}
\`\`\`

## Key Points
- \`includes()\`: returns boolean
- \`indexOf()\`: returns position or -1
- \`startsWith/endsWith\`: check boundaries`,

  'regex-regex': `## Creating Regular Expressions
\`\`\`javascript
const regex = /pattern/flags;
const regex = new RegExp("pattern", "flags");
\`\`\`

## Common Flags
\`\`\`javascript
/hello/i   // i = case insensitive
/hello/g   // g = global (find all)
/hello/gi  // both
\`\`\`

## test() - Check for Match
\`\`\`javascript
/hello/.test("hello world");  // true
/xyz/.test("hello world");    // false
\`\`\`

## Special Characters
\`\`\`javascript
\\d    // Any digit [0-9]
\\w    // Word character [a-zA-Z0-9_]
\\s    // Whitespace
.     // Any character (except newline)
\`\`\`

## Character Classes
\`\`\`javascript
[abc]   // a, b, or c
[a-z]   // any lowercase letter
[A-Z]   // any uppercase letter
[0-9]   // any digit
[^abc]  // NOT a, b, or c
\`\`\`

## Quantifiers
\`\`\`javascript
*      // 0 or more
+      // 1 or more
?      // 0 or 1
{3}    // exactly 3
{2,5}  // 2 to 5
\`\`\`

## Anchors
\`\`\`javascript
^      // Start of string
$      // End of string
\`\`\`

## Examples
\`\`\`javascript
// Only digits
/^\\d+$/.test("12345");      // true
/^\\d+$/.test("123abc");     // false

// Replace whitespace with dash
"hello world".replace(/\\s+/g, "-");  // "hello-world"

// Extract numbers
"abc123def456".match(/\\d+/g);  // ["123", "456"]

// Starts with capital
/^[A-Z]/.test("Hello");   // true
/^[A-Z]/.test("hello");   // false

// Simple email check
/\\w+@\\w+\\.\\w+/.test("a@b.c");  // true

// Replace vowels
"hello".replace(/[aeiou]/gi, "*");  // "h*ll*"
\`\`\``,

  'objects-objects': `## Creating Objects
\`\`\`javascript
const person = {
  name: "Alice",
  age: 25,
  isStudent: true
};
\`\`\`

## Accessing Properties
\`\`\`javascript
// Dot notation
person.name;        // "Alice"

// Bracket notation (for dynamic keys)
person["name"];     // "Alice"
const key = "age";
person[key];        // 25
\`\`\`

## Modifying Objects
\`\`\`javascript
person.age = 26;           // Update
person.email = "a@b.com";  // Add new property
delete person.isStudent;   // Remove property
\`\`\`

## Nested Objects
\`\`\`javascript
const user = {
  name: "Alice",
  address: {
    city: "NYC",
    zip: "10001"
  }
};
user.address.city;  // "NYC"
\`\`\`

## Object Methods
\`\`\`javascript
Object.keys(person);    // ["name", "age"]
Object.values(person);  // ["Alice", 25]
Object.entries(person); // [["name","Alice"],["age",25]]
\`\`\`

## Check Property Exists
\`\`\`javascript
"name" in person;              // true
person.hasOwnProperty("age");  // true
\`\`\`

## Iterate Properties
\`\`\`javascript
for (let key in person) {
  console.log(key, person[key]);
}

// Or with Object methods
Object.keys(person).forEach(key => {
  console.log(key, person[key]);
});
\`\`\`

## Access Nested Path
\`\`\`javascript
function getPath(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj);
}
getPath(user, "address.city");  // "NYC"
\`\`\``,

  'json-json': `## What is JSON?
JavaScript Object Notation - text format for data exchange.

## JSON.stringify - Object to String
\`\`\`javascript
const obj = { name: "Alice", age: 25 };
const json = JSON.stringify(obj);
// '{"name":"Alice","age":25}'
\`\`\`

## JSON.parse - String to Object
\`\`\`javascript
const json = '{"name":"Bob","age":30}';
const obj = JSON.parse(json);
obj.name;  // "Bob"
\`\`\`

## Pretty Printing
\`\`\`javascript
JSON.stringify(obj, null, 2);
// {
//   "name": "Alice",
//   "age": 25
// }
\`\`\`

## Deep Clone
\`\`\`javascript
const original = { a: 1, b: { c: 2 } };
const clone = JSON.parse(JSON.stringify(original));
// clone is a completely separate copy
\`\`\`

## Check Valid JSON
\`\`\`javascript
function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}
isValidJSON('{"valid":true}');  // true
isValidJSON('not json');         // false
\`\`\`

## JSON Limitations
\`\`\`javascript
// Cannot store:
// - Functions
// - undefined
// - Symbols
// - Circular references
\`\`\`

## Key Points
- JSON keys must be double-quoted strings
- Values: string, number, boolean, null, array, object
- \`stringify\` for saving/sending
- \`parse\` for loading/receiving`,

  'map-set-map-set': `## Map - Key-Value Pairs (Any Key Type)
\`\`\`javascript
const map = new Map();
map.set('name', 'Alice');
map.set(1, 'one');
map.get('name');     // 'Alice'
map.has('name');     // true
map.delete('name');  // removes
map.size;            // count
map.clear();         // removes all
\`\`\`

## Map from Array
\`\`\`javascript
const map = new Map([
  ['a', 1],
  ['b', 2]
]);
\`\`\`

## Map Iteration
\`\`\`javascript
for (let [key, value] of map) {
  console.log(key, value);
}
\`\`\`

## Set - Unique Values Only
\`\`\`javascript
const set = new Set();
set.add(1);
set.add(2);
set.add(1);   // Ignored (duplicate)
set.has(1);   // true
set.size;     // 2
set.delete(1);
\`\`\`

## Remove Duplicates
\`\`\`javascript
const arr = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(arr)];  // [1, 2, 3]
\`\`\`

## Count Occurrences with Map
\`\`\`javascript
function countItems(arr) {
  const counts = new Map();
  for (let item of arr) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }
  return counts;
}
\`\`\`

## Check Common Elements
\`\`\`javascript
function hasCommon(arr1, arr2) {
  const set = new Set(arr1);
  return arr2.some(item => set.has(item));
}
\`\`\`

## Set Operations
\`\`\`javascript
// Intersection
const intersection = [...set1].filter(x => set2.has(x));

// Union
const union = new Set([...set1, ...set2]);
\`\`\`

## Map vs Object
- Map: any key type, ordered, .size property
- Object: string/symbol keys only

## Set vs Array
- Set: unique values, O(1) lookup
- Array: allows duplicates, indexed`,

  'destructuring-destructuring': `## Array Destructuring
Extract values from arrays into variables.

\`\`\`javascript
const [first, second] = [1, 2, 3];
// first = 1, second = 2

const [a, , c] = [1, 2, 3];  // Skip elements
// a = 1, c = 3

const [x, ...rest] = [1, 2, 3, 4];
// x = 1, rest = [2, 3, 4]
\`\`\`

## Default Values
\`\`\`javascript
const [a = 10, b = 20] = [5];
// a = 5, b = 20 (default used)
\`\`\`

## Object Destructuring
\`\`\`javascript
const { name, age } = { name: "Alice", age: 25 };
// name = "Alice", age = 25
\`\`\`

## Renaming Variables
\`\`\`javascript
const { name: userName } = { name: "Alice" };
// userName = "Alice"
\`\`\`

## Default Values in Objects
\`\`\`javascript
const { name, country = "Unknown" } = { name: "Bob" };
// country = "Unknown"
\`\`\`

## Nested Destructuring
\`\`\`javascript
const { user: { name, address: { city } } } = {
  user: { name: "Alice", address: { city: "NYC" } }
};
// name = "Alice", city = "NYC"
\`\`\`

## Function Parameters
\`\`\`javascript
function greet({ name, age }) {
  return \`\${name} is \${age}\`;
}
greet({ name: "Alice", age: 25 });
\`\`\`

## Swap Variables
\`\`\`javascript
let a = 1, b = 2;
[a, b] = [b, a];
// a = 2, b = 1
\`\`\``,

  'arrow-functions-arrow-functions': `## Arrow Function Syntax
Compact function syntax.

\`\`\`javascript
// Full syntax
const add = (a, b) => {
  return a + b;
};

// Concise (implicit return)
const add = (a, b) => a + b;

// Single parameter (no parens needed)
const double = x => x * 2;

// No parameters
const greet = () => "Hello!";
\`\`\`

## Implicit Return
\`\`\`javascript
// Single expression returns automatically
const square = n => n * n;

// Need explicit return with braces
const square = n => {
  return n * n;
};
\`\`\`

## Returning Objects
\`\`\`javascript
// Wrap object in parentheses
const makeObj = n => ({ value: n, squared: n * n });
\`\`\`

## With Array Methods
\`\`\`javascript
const nums = [1, 2, 3, 4];

nums.map(n => n * 2);           // [2, 4, 6, 8]
nums.filter(n => n > 2);        // [3, 4]
nums.reduce((a, n) => a + n, 0); // 10
\`\`\`

## Chaining
\`\`\`javascript
const result = [1, 2, 3, 4, 5]
  .filter(n => n > 2)
  .map(n => n * 2)
  .reduce((a, n) => a + n, 0);  // 24
\`\`\`

## Key Points
- Concise syntax for simple functions
- Implicit return for single expressions
- No own \`this\` (inherits from parent)
- Perfect for callbacks`,

  'closures-closures': `## What is a Closure?
A function that remembers variables from its outer scope.

\`\`\`javascript
function outer() {
  let count = 0;  // Private variable
  return function inner() {
    count++;
    return count;
  };
}
const counter = outer();
counter();  // 1
counter();  // 2
counter();  // 3
\`\`\`

## Function Factory
\`\`\`javascript
function createAdder(x) {
  return function(y) {
    return x + y;
  };
}
const add5 = createAdder(5);
add5(3);   // 8
add5(10);  // 15
\`\`\`

## Multiplier Factory
\`\`\`javascript
function createMultiplier(mult) {
  return n => n * mult;
}
const double = createMultiplier(2);
const triple = createMultiplier(3);
double(5);  // 10
triple(5);  // 15
\`\`\`

## Counter with Methods
\`\`\`javascript
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count
  };
}
const c = createCounter();
c.increment();  // 1
c.increment();  // 2
c.getValue();   // 2
\`\`\`

## Range Checker
\`\`\`javascript
function createRangeChecker(min, max) {
  return n => n >= min && n <= max;
}
const isTeenager = createRangeChecker(13, 19);
isTeenager(15);  // true
isTeenager(25);  // false
\`\`\`

## Once Function
\`\`\`javascript
function once(fn) {
  let called = false;
  let result;
  return function(...args) {
    if (!called) {
      result = fn(...args);
      called = true;
    }
    return result;
  };
}
\`\`\`

## Key Points
- Inner function "closes over" outer variables
- Data privacy (encapsulation)
- State persistence between calls
- Foundation for many patterns`,

  'array-advanced-array-advanced-patterns': `## Method Chaining
Chain multiple array methods together.

\`\`\`javascript
const result = [1, 2, 3, 4, 5, 6]
  .filter(n => n % 2 === 0)  // [2, 4, 6]
  .map(n => n * 2)           // [4, 8, 12]
  .reduce((a, n) => a + n, 0); // 24
\`\`\`

## 2D Arrays (Matrices)
\`\`\`javascript
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
matrix[1][2];  // 6 (row 1, col 2)
\`\`\`

## Sum All Elements in 2D Array
\`\`\`javascript
function sum2D(matrix) {
  return matrix.flat().reduce((a, n) => a + n, 0);
}
\`\`\`

## flat() - Flatten Arrays
\`\`\`javascript
[[1, 2], [3, 4]].flat();     // [1, 2, 3, 4]
[1, [2, [3]]].flat();        // [1, 2, [3]] (one level)
[1, [2, [3]]].flat(2);       // [1, 2, 3] (two levels)
[1, [2, [3]]].flat(Infinity); // [1, 2, 3] (all levels)
\`\`\`

## flatMap() - Map + Flatten
\`\`\`javascript
const arr = [[1, 2], [3]];
arr.flatMap(x => x.map(n => n * 2));  // [2, 4, 6]
\`\`\`

## Row with Max Sum
\`\`\`javascript
function maxRowIndex(matrix) {
  let maxSum = -Infinity;
  let maxIdx = 0;
  matrix.forEach((row, i) => {
    const sum = row.reduce((a, n) => a + n, 0);
    if (sum > maxSum) {
      maxSum = sum;
      maxIdx = i;
    }
  });
  return maxIdx;
}
\`\`\`

## Transpose Matrix
\`\`\`javascript
function transpose(matrix) {
  return matrix[0].map((_, i) => 
    matrix.map(row => row[i])
  );
}
\`\`\`

## Key Points
- Chain methods for complex transformations
- Use \`flat()\` to flatten nested arrays
- Use \`flatMap()\` for map + flatten in one step`,

  'spread-rest-spread-rest': `## Spread Operator (...)
Unpacks elements from arrays/objects.

## Spread with Arrays
\`\`\`javascript
// Copy array
const copy = [...original];

// Merge arrays
const merged = [...arr1, ...arr2];

// Add elements
const withNew = [...arr, newItem];
const withFirst = [newItem, ...arr];
\`\`\`

## Spread with Functions
\`\`\`javascript
const nums = [5, 3, 9, 1];
Math.max(...nums);  // 9
Math.min(...nums);  // 1
\`\`\`

## Spread with Objects
\`\`\`javascript
// Copy object
const copy = { ...obj };

// Merge objects
const merged = { ...obj1, ...obj2 };

// Override property
const updated = { ...obj, name: "New" };
\`\`\`

## Rest Parameters
Collects remaining arguments into array.

\`\`\`javascript
function sum(...numbers) {
  return numbers.reduce((a, n) => a + n, 0);
}
sum(1, 2, 3);     // 6
sum(1, 2, 3, 4);  // 10
\`\`\`

## Rest with Other Params
\`\`\`javascript
function greet(greeting, ...names) {
  return names.map(n => \`\${greeting}, \${n}!\`);
}
greet("Hello", "Alice", "Bob");
// ["Hello, Alice!", "Hello, Bob!"]
\`\`\`

## Rest in Destructuring
\`\`\`javascript
const [first, ...rest] = [1, 2, 3, 4];
// first = 1, rest = [2, 3, 4]

const { name, ...others } = { name: "A", age: 25, city: "NY" };
// name = "A", others = { age: 25, city: "NY" }
\`\`\`

## Key Difference
- **Spread**: Unpacks (in arrays, objects, calls)
- **Rest**: Collects (in function parameters, destructuring)`,

  'error-handling-error-handling': `## try-catch Syntax
\`\`\`javascript
try {
  // Code that might throw
} catch (error) {
  // Handle the error
} finally {
  // Always runs (optional)
}
\`\`\`

## Basic Usage
\`\`\`javascript
try {
  const data = JSON.parse(invalidJson);
} catch (error) {
  console.log("Parse failed:", error.message);
}
\`\`\`

## throw - Create Errors
\`\`\`javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

try {
  divide(10, 0);
} catch (e) {
  console.log(e.message);  // "Cannot divide by zero"
}
\`\`\`

## Error Properties
\`\`\`javascript
catch (error) {
  error.name;     // "Error", "TypeError", etc.
  error.message;  // Description
  error.stack;    // Stack trace
}
\`\`\`

## Custom Validation
\`\`\`javascript
function validateAge(age) {
  if (age < 0) throw new Error("Age cannot be negative");
  if (age > 150) throw new Error("Age cannot exceed 150");
  return age;
}
\`\`\`

## Safe JSON Parse
\`\`\`javascript
function safeParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}
\`\`\`

## Safe Property Access
\`\`\`javascript
function getPath(obj, path) {
  try {
    return path.split('.').reduce((o, k) => o[k], obj);
  } catch {
    return "Property not found";
  }
}
\`\`\`

## Key Points
- Use try-catch for risky operations
- throw creates new errors
- finally always executes
- Error has name, message, stack`,

  'async-basics-async-basics': `## Synchronous vs Asynchronous
\`\`\`javascript
// Sync: line by line, blocking
console.log("A");
console.log("B");
// Output: A, B

// Async: non-blocking
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
// Output: A, C, B
\`\`\`

## Callback Functions
Functions passed as arguments, called later.

\`\`\`javascript
function processData(data, callback) {
  const result = data * 2;
  callback(result);
}

processData(5, result => {
  console.log(result);  // 10
});
\`\`\`

## setTimeout
\`\`\`javascript
setTimeout(() => {
  console.log("After 2 seconds");
}, 2000);
\`\`\`

## setInterval
\`\`\`javascript
const id = setInterval(() => {
  console.log("Every second");
}, 1000);

// Stop it
clearInterval(id);
\`\`\`

## Callback Pattern
\`\`\`javascript
function calculate(a, b, callback) {
  callback({
    sum: a + b,
    difference: a - b,
    product: a * b
  });
}

calculate(10, 3, result => {
  console.log(result);
  // { sum: 13, difference: 7, product: 30 }
});
\`\`\`

## Error-First Callbacks
\`\`\`javascript
function fetchData(onSuccess, onError) {
  if (dataAvailable) {
    onSuccess(data);
  } else {
    onError("Data not found");
  }
}
\`\`\`

## Event Loop Order
\`\`\`javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
// A, C, B (sync first, then async)
\`\`\`

## Key Points
- JavaScript is single-threaded
- Callbacks allow async operations
- Event loop handles execution order
- Sync code always runs before async`,

  'promises-promises': `## What is a Promise?
Object representing eventual completion or failure.

## Promise States
- **Pending**: Initial state
- **Fulfilled**: Operation succeeded
- **Rejected**: Operation failed

## Creating Promises
\`\`\`javascript
const promise = new Promise((resolve, reject) => {
  if (success) {
    resolve(value);  // Fulfill
  } else {
    reject(error);   // Reject
  }
});
\`\`\`

## Consuming Promises
\`\`\`javascript
promise
  .then(value => console.log(value))
  .catch(error => console.log(error))
  .finally(() => console.log("Done"));
\`\`\`

## Example
\`\`\`javascript
function checkNumber(n) {
  return new Promise((resolve, reject) => {
    if (n > 0) {
      resolve(n * 2);
    } else {
      reject("Number must be positive");
    }
  });
}

checkNumber(5)
  .then(result => console.log(result))  // 10
  .catch(err => console.log(err));
\`\`\`

## Chaining
\`\`\`javascript
Promise.resolve(5)
  .then(n => n * 2)   // 10
  .then(n => n + 10)  // 20
  .then(n => console.log(n));
\`\`\`

## Promise.resolve / reject
\`\`\`javascript
Promise.resolve(42);     // Already fulfilled
Promise.reject("Error"); // Already rejected
\`\`\`

## Promise.all
\`\`\`javascript
Promise.all([p1, p2, p3])
  .then(results => console.log(results))
  .catch(err => console.log(err));  // First rejection
\`\`\`

## Promise.race
\`\`\`javascript
Promise.race([p1, p2, p3])
  .then(first => console.log(first));  // First to settle
\`\`\`

## Key Points
- Promises replace callback hell
- Chain with .then()
- Handle errors with .catch()
- Use Promise.all for parallel operations`,

  'async-await-async-await': `## async Function
Declares a function that returns a promise.

\`\`\`javascript
async function getData() {
  return "Hello";  // Automatically wrapped in Promise
}
getData().then(console.log);  // "Hello"
\`\`\`

## await Keyword
Pauses until promise resolves.

\`\`\`javascript
async function example() {
  const result = await somePromise;
  console.log(result);
}
\`\`\`

## Basic Example
\`\`\`javascript
async function doubleAsync(n) {
  return n * 2;
}

async function main() {
  const result = await doubleAsync(5);
  console.log(result);  // 10
}
\`\`\`

## Error Handling
\`\`\`javascript
async function fetchData() {
  try {
    const result = await riskyOperation();
    return result;
  } catch (error) {
    console.log("Error:", error.message);
    return null;
  }
}
\`\`\`

## Sequential Operations
\`\`\`javascript
async function sequential(n) {
  const doubled = await doubleAsync(n);   // Wait
  const plusTen = await addTenAsync(doubled);  // Then wait
  return plusTen;
}
\`\`\`

## Parallel Operations
\`\`\`javascript
async function parallel(nums) {
  const promises = nums.map(n => doubleAsync(n));
  return await Promise.all(promises);
}
\`\`\`

## Async Arrow Function
\`\`\`javascript
const multiply = async (a, b) => a * b;
\`\`\`

## Throwing Errors
\`\`\`javascript
async function validate(n) {
  if (n <= 0) {
    throw new Error("Must be positive");
  }
  return n * 2;
}
\`\`\`

## Key Points
- \`async\` makes function return promise
- \`await\` pauses until promise settles
- Use try-catch for error handling
- Cleaner than .then() chains`,

  'classes-classes': `## Class Declaration
\`\`\`javascript
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  
  getArea() {
    return this.width * this.height;
  }
}

const rect = new Rectangle(5, 3);
rect.getArea();  // 15
\`\`\`

## Static Methods/Properties
Belong to class, not instances.

\`\`\`javascript
class Counter {
  static count = 0;
  
  constructor() {
    Counter.count++;
  }
  
  static getCount() {
    return Counter.count;
  }
}
new Counter();
new Counter();
Counter.getCount();  // 2
\`\`\`

## Getters and Setters
\`\`\`javascript
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }
  
  get fahrenheit() {
    return this.celsius * 9/5 + 32;
  }
}
const t = new Temperature(100);
t.fahrenheit;  // 212
\`\`\`

## Inheritance
\`\`\`javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return "...";
  }
}

class Dog extends Animal {
  speak() {
    return "Woof!";
  }
}

const dog = new Dog("Buddy");
dog.speak();  // "Woof!"
\`\`\`

## super Keyword
\`\`\`javascript
class Child extends Parent {
  constructor(name, age) {
    super(name);  // Call parent constructor
    this.age = age;
  }
}
\`\`\`

## instanceof
\`\`\`javascript
const dog = new Dog("Rex");
dog instanceof Dog;     // true
dog instanceof Animal;  // true
\`\`\`

## Key Points
- constructor initializes properties
- \`this\` refers to instance
- \`static\` for class-level members
- \`extends\` for inheritance
- \`super\` calls parent`,

  'modules-modules': `## Why Modules?
- Organize code into separate files
- Avoid global namespace pollution
- Reusability and maintainability

## Module Pattern (IIFE)
\`\`\`javascript
const counter = (function() {
  let count = 0;  // Private
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getValue: () => count
  };
})();

counter.increment();  // 1
counter.getValue();   // 1
// count is not accessible directly
\`\`\`

## Revealing Module Pattern
\`\`\`javascript
const calculator = (function() {
  let result = 0;
  
  function add(n) { result += n; }
  function subtract(n) { result -= n; }
  function getResult() { return result; }
  
  return { add, subtract, getResult };
})();
\`\`\`

## ES6 Named Exports
\`\`\`javascript
// math.js
export const PI = 3.14159;
export function add(a, b) { return a + b; }

// main.js
import { PI, add } from './math.js';
\`\`\`

## Default Export
\`\`\`javascript
// user.js
export default class User { }

// main.js
import User from './user.js';
\`\`\`

## Import Aliases
\`\`\`javascript
import { add as sum } from './math.js';
\`\`\`

## Import All
\`\`\`javascript
import * as math from './math.js';
math.add(1, 2);
math.PI;
\`\`\`

## Module Scope
Variables inside modules are private by default.
Only exported items are accessible outside.

## Key Points
- IIFE pattern for private state
- Export public API only
- Import what you need
- Modules have their own scope`
}

/**
 * Get notes for a specific subtopic
 */
export function getNotes(topicId, subtopicId) {
  const key = `${topicId}-${subtopicId}`
  return notes[key] || null
}

export default notes


