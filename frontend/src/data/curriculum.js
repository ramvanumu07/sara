export const curriculum = [
  // ═══════════════════════════════════════════════════════════════
  // FOUNDATION: FIRST CODE
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'foundation',
    title: 'Foundation: First Code',
    subtopics: [
      {
        id: 'first-program',
        title: 'Your first program (console.log)',
        // Context for AI - NOT a script, just guidance
        concepts: ['Output display', 'Basic syntax structure', 'Running JavaScript code'],
        prerequisites: [],
        teachingGoal: 'User understands WHY console.log exists and can confidently use it to see output',
        tasks: [
          'Print your name',
          'Print multiple lines of text',
          'Print numbers and perform calculations in console',
          'Print a formatted message with multiple values',
          'Debug by printing variable values at different stages'
        ]
      },
      {
        id: 'basic-output',
        title: 'Basic output and debugging',
        concepts: ['Using output to understand code', 'Tracing execution', 'Finding bugs'],
        prerequisites: ['console.log basics'],
        teachingGoal: 'User can strategically place console.log to debug and trace their code',
        tasks: [
          'Print the result of different arithmetic operations',
          'Use console.log to trace program flow',
          'Print error messages for debugging'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // VARIABLES & CONSTANTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'variables-constants',
    title: 'Variables & Constants',
    subtopics: [
      {
        id: 'const-declaration',
        title: 'Declaring values with const',
        concepts: ['Storing values', 'Immutability', 'Why const is preferred'],
        prerequisites: ['console.log'],
        teachingGoal: 'User understands const creates unchangeable storage and knows when to use it',
        tasks: [
          'Store your age in a constant and print it',
          'Store the value of PI and calculate circle area',
          'Store your name, city, and country in separate constants',
          'Store the result of a calculation in a constant',
          'Try to reassign a const and understand the error'
        ]
      },
      {
        id: 'let-declaration',
        title: 'When to use let',
        concepts: ['Mutable storage', 'When values need to change', 'let vs const decision'],
        prerequisites: ['const basics'],
        teachingGoal: 'User knows when let is necessary vs const, and defaults to const',
        tasks: [
          'Create a counter that changes value',
          'Store a temperature that updates',
          'Use let for values that need updating in calculations',
          'Identify scenarios where let is necessary vs const'
        ]
      },
      {
        id: 'naming-conventions',
        title: 'Naming conventions and readability',
        concepts: ['Readable code', 'Self-documenting names', 'camelCase', 'Magic numbers'],
        prerequisites: ['const and let'],
        teachingGoal: 'User writes variable names that explain what they store without comments',
        tasks: [
          'Rename poorly named variables (x, y, temp1) to meaningful names',
          'Create constants for a person\'s details with proper naming',
          'Practice camelCase naming for multi-word variables',
          'Avoid abbreviations - write full descriptive names',
          'Convert magic numbers to named constants (e.g., const MAX_ATTEMPTS = 3)'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // DATA TYPES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'data-types',
    title: 'Data Types',
    subtopics: [
      {
        id: 'numbers-arithmetic',
        title: 'Numbers and basic arithmetic',
        concepts: ['Number type', 'Arithmetic operations', 'Order of operations', 'Modulo'],
        prerequisites: ['Variables'],
        teachingGoal: 'User can perform calculations and understands operator precedence',
        tasks: [
          'Perform addition, subtraction, multiplication, division',
          'Calculate the remainder using modulo operator',
          'Calculate the area of a rectangle given length and width',
          'Convert temperature from Celsius to Fahrenheit',
          'Calculate simple interest (P * R * T / 100)',
          'Calculate the average of three numbers',
          'Calculate discount amount and final price',
          'Swap two numbers without a third variable',
          'Calculate BMI (weight / height²)',
          'Find the last digit of a number using modulo'
        ]
      },
      {
        id: 'strings-operations',
        title: 'Strings and string operations',
        concepts: ['Text data', 'String creation', 'Concatenation', 'String methods'],
        prerequisites: ['Variables', 'console.log'],
        teachingGoal: 'User can work with text data, combine strings, and use basic string methods',
        tasks: [
          'Concatenate first name and last name',
          'Create a greeting message with name',
          'Find the length of a string',
          'Access individual characters in a string',
          'Convert string to uppercase and lowercase',
          'Check if a string contains a specific character',
          'Extract initials from a full name',
          'Build a formatted address string',
          'Create a username from email (before @)',
          'Repeat a string multiple times'
        ]
      },
      {
        id: 'booleans',
        title: 'Booleans and logical values',
        learningPoints: [
          'What are booleans',
          'true and false values',
          'Boolean from comparisons',
          'Logical operators with booleans'
        ],
        tasks: [
          'Store the result of a comparison in a boolean',
          'Create boolean flags for different states (isActive, hasPermission)',
          'Combine multiple boolean values with logical operators',
          'Negate boolean values',
          'Store the result of type checking'
        ]
      },
      {
        id: 'undefined-null',
        title: 'Understanding undefined and null',
        learningPoints: [
          'What is undefined',
          'What is null',
          'Difference between null and undefined',
          'Checking for null or undefined'
        ],
        tasks: [
          'Declare variables without initialization and observe undefined',
          'Explicitly set values to null',
          'Understand the difference between null and undefined',
          'Check for null or undefined values',
          'Handle missing data with null'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // OPERATORS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'operators',
    title: 'Operators',
    subtopics: [
      {
        id: 'arithmetic-operators',
        title: 'Arithmetic operators',
        learningPoints: [
          'Order of operations',
          'Using parentheses',
          'Compound expressions'
        ],
        tasks: [
          'Calculate compound expressions (order of operations)',
          'Use parentheses to control operation order',
          'Calculate total cost with tax',
          'Find quotient and remainder in division',
          'Calculate powers using multiplication'
        ]
      },
      {
        id: 'comparison-operators',
        title: 'Comparison operators',
        learningPoints: [
          'Greater than, less than',
          'Equality operators',
          'Strict vs loose equality',
          'Comparing different types'
        ],
        tasks: [
          'Compare two numbers and store result',
          'Check if a number equals another',
          'Use strict equality (===) vs loose equality (==)',
          'Compare strings alphabetically',
          'Check if a value is greater than, less than another',
          'Create multiple comparison expressions'
        ]
      },
      {
        id: 'logical-operators',
        title: 'Logical operators (&&, ||, !)',
        learningPoints: [
          'AND operator (&&)',
          'OR operator (||)',
          'NOT operator (!)',
          'Combining conditions'
        ],
        tasks: [
          'Combine multiple conditions with AND',
          'Use OR for alternative conditions',
          'Negate conditions with NOT',
          'Create complex logical expressions',
          'Check if a number is in a range using &&',
          'Validate multiple criteria together',
          'Use logical operators to simplify conditions'
        ]
      },
      {
        id: 'assignment-vs-comparison',
        title: 'Assignment vs comparison (= vs ==, ===)',
        learningPoints: [
          'Assignment operator (=)',
          'Comparison operators (==, ===)',
          'Common bugs with assignment',
          'Always use strict equality'
        ],
        tasks: [
          'Identify bugs where = is used instead of ==',
          'Practice using === for all comparisons',
          'Understand when == causes unexpected results',
          'Refactor code using = to use === correctly'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // CONDITIONAL LOGIC
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'conditional-logic',
    title: 'Conditional Logic',
    subtopics: [
      {
        id: 'if-statements',
        title: 'if statements',
        learningPoints: [
          'What is an if statement',
          'Condition evaluation',
          'Code block execution'
        ],
        tasks: [
          'Check if a number is positive',
          'Check if age is above 18',
          'Print message only if condition is true',
          'Check if a string is empty',
          'Validate user input with if'
        ]
      },
      {
        id: 'if-else-statements',
        title: 'if-else statements',
        learningPoints: [
          'else clause',
          'Two-way branching',
          'Mutually exclusive conditions'
        ],
        tasks: [
          'Check if number is even or odd',
          'Determine if temperature is hot or cold',
          'Check if year is leap year or not',
          'Grade pass or fail based on marks',
          'Check if user is adult or minor',
          'Determine if number is divisible by 5',
          'Check password strength (simple)'
        ]
      },
      {
        id: 'else-if-chains',
        title: 'else-if chains',
        learningPoints: [
          'Multiple conditions',
          'else if syntax',
          'Order of condition checking'
        ],
        tasks: [
          'Grade system (A, B, C, D, F) based on marks',
          'Determine season based on month',
          'Categorize age groups (child, teen, adult, senior)',
          'Determine ticket price based on age',
          'Calculate shipping cost based on weight ranges',
          'Determine tax bracket based on income',
          'Movie rating system based on age',
          'Determine day type (weekday/weekend) from day number'
        ]
      },
      {
        id: 'nested-conditions',
        title: 'Nested conditions',
        learningPoints: [
          'Nesting if statements',
          'Multiple levels of conditions',
          'Complex decision logic'
        ],
        tasks: [
          'Check if number is positive, negative, or zero with nested conditions',
          'Determine if a year is leap year using nested logic',
          'Validate username and password separately',
          'Check eligibility based on multiple criteria',
          'Determine discount based on membership and purchase amount',
          'Grade system with attendance criteria',
          'Loan eligibility based on age, income, and credit score'
        ]
      },
      {
        id: 'readable-conditions',
        title: 'Writing readable conditions',
        learningPoints: [
          'Named boolean variables',
          'Extracting complex conditions',
          'Simplifying logic',
          'Early returns'
        ],
        tasks: [
          'Refactor: if(num%2==0?true:false) to isEven = num%2==0; if(isEven)',
          'Extract complex conditions into named boolean variables',
          'Replace magic numbers with named constants in conditions',
          'Simplify double negatives in conditions',
          'Break down complex nested conditions into readable parts',
          'Use early returns instead of nested if-else',
          'Name your conditions meaningfully (isEligible, hasAccess, canProceed)'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // LOOPS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'loops',
    title: 'Loops',
    subtopics: [
      {
        id: 'while-loops',
        title: 'while loops',
        learningPoints: [
          'while loop syntax',
          'Loop condition',
          'Avoiding infinite loops',
          'When to use while'
        ],
        tasks: [
          'Print numbers 1 to 10',
          'Print even numbers up to 20',
          'Calculate sum of first 10 numbers',
          'Count down from 10 to 1',
          'Find factorial of a number',
          'Print multiplication table of a number',
          'Keep doubling a number until it exceeds 1000',
          'Find the first power of 2 greater than a given number',
          'Keep asking for input until valid (simulate with counter)',
          'Calculate compound interest over years'
        ]
      },
      {
        id: 'for-loops',
        title: 'for loops',
        learningPoints: [
          'for loop syntax',
          'Initialization, condition, update',
          'Loop counter',
          'When to use for'
        ],
        tasks: [
          'Print numbers 1 to 100',
          'Print odd numbers from 1 to 50',
          'Sum all numbers from 1 to N',
          'Print squares of numbers 1 to 10',
          'Count digits in a number',
          'Reverse a number',
          'Check if number is palindrome',
          'Find sum of digits',
          'Print Fibonacci sequence up to N terms',
          'Find GCD of two numbers'
        ]
      },
      {
        id: 'loop-control',
        title: 'Loop control (break, continue)',
        learningPoints: [
          'break statement',
          'continue statement',
          'When to use break',
          'When to use continue'
        ],
        tasks: [
          'Find first number divisible by 7 in a range (use break)',
          'Print numbers but skip multiples of 3 (use continue)',
          'Search for a specific value and exit when found',
          'Sum positive numbers only, skip negatives',
          'Find first prime number after N',
          'Print pattern but skip certain rows',
          'Validate input in a loop, break on valid input'
        ]
      },
      {
        id: 'nested-loops',
        title: 'Nested loops',
        learningPoints: [
          'Loop inside a loop',
          'Inner and outer loop',
          'Pattern printing',
          'Matrix operations'
        ],
        tasks: [
          'Print a multiplication table (1-10)',
          'Print a square pattern of stars',
          'Print a triangle pattern',
          'Print a pyramid pattern',
          'Print numbers in matrix form',
          'Find all pairs of numbers that sum to a target',
          'Print all prime numbers up to N',
          'Generate all combinations of two arrays'
        ]
      },
      {
        id: 'choosing-loops',
        title: 'Choosing the right loop',
        learningPoints: [
          'for vs while',
          'Known vs unknown iterations',
          'Converting between loops'
        ],
        tasks: [
          'Refactor while to for where count is known',
          'Refactor for to while where condition-based',
          'Identify when to use for vs while',
          'Convert between loop types and understand trade-offs'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // ARRAYS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'arrays',
    title: 'Arrays',
    subtopics: [
      {
        id: 'creating-arrays',
        title: 'Creating and accessing arrays',
        learningPoints: [
          'What is an array',
          'Array syntax',
          'Accessing elements by index',
          'Zero-based indexing'
        ],
        tasks: [
          'Create an array of your favorite fruits',
          'Create an array of numbers 1-5',
          'Access first element of array',
          'Access last element of array',
          'Access middle element',
          'Create an array of student names',
          'Store days of week in array',
          'Create an empty array and understand it'
        ]
      },
      {
        id: 'array-length-indices',
        title: 'Array length and indices',
        learningPoints: [
          'length property',
          'Index calculation',
          'Valid index checking'
        ],
        tasks: [
          'Find length of an array',
          'Access element at specific index',
          'Calculate last index using length',
          'Check if index is valid before accessing',
          'Understand zero-based indexing'
        ]
      },
      {
        id: 'iterating-arrays',
        title: 'Iterating through arrays',
        learningPoints: [
          'Looping through arrays',
          'Accessing each element',
          'Index in iteration',
          'Processing array elements'
        ],
        tasks: [
          'Print all elements of an array',
          'Print elements with their indices',
          'Sum all numbers in an array',
          'Find the largest number in an array',
          'Find the smallest number in an array',
          'Count specific elements in an array',
          'Find average of numbers in array',
          'Print even numbers from array',
          'Check if all elements are positive',
          'Find first negative number',
          'Count occurrences of a value'
        ]
      },
      {
        id: 'array-patterns',
        title: 'Common array patterns',
        learningPoints: [
          'Array manipulation patterns',
          'Searching in arrays',
          'Transforming arrays',
          'Comparing arrays'
        ],
        tasks: [
          'Reverse an array manually',
          'Check if array contains a value',
          'Find index of a specific value',
          'Remove duplicates from array (basic approach)',
          'Merge two arrays',
          'Copy an array',
          'Compare two arrays for equality',
          'Find common elements between two arrays',
          'Create a new array with squared values',
          'Filter numbers greater than a threshold'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // FUNCTIONS (THE TURNING POINT)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'functions',
    title: 'Functions (The Turning Point)',
    subtopics: [
      {
        id: 'declaring-functions',
        title: 'Declaring functions',
        learningPoints: [
          'What is a function',
          'Function declaration syntax',
          'Calling a function',
          'Code reuse'
        ],
        tasks: [
          'Create a function that prints "Hello"',
          'Create a function that prints your name',
          'Create a function to print a greeting',
          'Convert previous programs to use functions',
          'Create multiple small functions for different tasks'
        ]
      },
      {
        id: 'parameters-arguments',
        title: 'Parameters and arguments',
        learningPoints: [
          'What are parameters',
          'What are arguments',
          'Multiple parameters',
          'Default values'
        ],
        tasks: [
          'Function to greet a person by name',
          'Function to add two numbers',
          'Function to calculate rectangle area (length, width)',
          'Function to calculate circle area (radius)',
          'Function with three parameters',
          'Function to create full name from first and last',
          'Function to calculate discount',
          'Function to convert Celsius to Fahrenheit',
          'Function with default values understanding'
        ]
      },
      {
        id: 'return-values',
        title: 'Return values',
        learningPoints: [
          'return statement',
          'Returning values',
          'Using returned values',
          'return vs console.log'
        ],
        tasks: [
          'Function that returns sum of two numbers',
          'Function that returns if number is even',
          'Function that returns absolute value',
          'Function that returns larger of two numbers',
          'Function that returns string length',
          'Function that returns last digit',
          'Use returned value in calculations',
          'Chain function calls using return values',
          'Return early from functions',
          'Understand difference between return and console.log'
        ]
      },
      {
        id: 'function-naming',
        title: 'Function naming conventions',
        learningPoints: [
          'Verb-based naming',
          'Descriptive names',
          'Boolean function naming',
          'Consistency'
        ],
        tasks: [
          'Rename poorly named functions (func1, doIt, xyz)',
          'Use verbs for function names (calculate, check, get, validate)',
          'Name functions based on what they do, not how',
          'Use is/has/can for boolean-returning functions',
          'Create consistently named related functions'
        ]
      },
      {
        id: 'single-responsibility',
        title: 'Single responsibility principle',
        learningPoints: [
          'One function = one job',
          'Splitting functions',
          'Focused functions',
          'Extracting logic'
        ],
        tasks: [
          'Split a multi-task function into smaller functions',
          'Identify functions doing too much',
          'Refactor complex functions into focused ones',
          'One function = one job',
          'Extract calculation logic into separate functions',
          'Extract validation logic into separate functions'
        ]
      },
      {
        id: 'when-to-create-function',
        title: 'When to create a function',
        learningPoints: [
          'Code repetition',
          'Complex logic extraction',
          'Reusability',
          'Program organization'
        ],
        tasks: [
          'Identify repeated code and extract to function',
          'Create function for code used more than once',
          'Extract complex logic into named functions',
          'Break down large programs into functions',
          'Create function for every distinct operation',
          'Refactor 10 old assignments to use functions'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // FUNCTION SCOPE
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'function-scope',
    title: 'Function Scope',
    subtopics: [
      {
        id: 'local-global-scope',
        title: 'Local vs global scope',
        learningPoints: [
          'Local variables',
          'Global variables',
          'Variable accessibility',
          'Variable shadowing'
        ],
        tasks: [
          'Create variables inside functions (local)',
          'Understand local variables aren\'t accessible outside',
          'Create function-specific variables',
          'Shadow global variables with local ones',
          'Understand variable lifetime in functions'
        ]
      },
      {
        id: 'avoid-globals',
        title: 'Why avoid global variables',
        learningPoints: [
          'Problems with globals',
          'Using parameters instead',
          'Self-contained functions',
          'Data flow through parameters'
        ],
        tasks: [
          'Refactor code with global variables to use parameters',
          'Pass data through parameters instead of globals',
          'Return data instead of modifying globals',
          'Create self-contained functions',
          'Convert all previous assignments to avoid globals'
        ]
      },
      {
        id: 'scope-chain',
        title: 'Scope chain and accessibility',
        learningPoints: [
          'Nested scope',
          'Inner function access',
          'Block scope',
          'Scope hierarchy'
        ],
        tasks: [
          'Understand nested scope access',
          'Inner functions accessing outer variables',
          'Parameters creating local scope',
          'Block scope with const and let in functions'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PURE FUNCTIONS & REUSABILITY
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'pure-functions',
    title: 'Pure Functions & Reusability',
    subtopics: [
      {
        id: 'reusable-functions',
        title: 'Writing reusable functions',
        learningPoints: [
          'Generic functions',
          'Parameterized logic',
          'Utility functions',
          'Function libraries'
        ],
        tasks: [
          'Create isDivisible(number, divisor) function',
          'Use isDivisible for checking even/odd',
          'Use isDivisible for leap year calculation',
          'Create isInRange(value, min, max) function',
          'Create getGrade(marks) function usable anywhere',
          'Create formatCurrency(amount) function',
          'Create calculatePercentage(value, total) function',
          'Create clamp(value, min, max) function',
          'Rewrite 20 previous assignments using reusable functions'
        ]
      },
      {
        id: 'avoiding-side-effects',
        title: 'Avoiding side effects',
        learningPoints: [
          'What are side effects',
          'Pure functions',
          'No external modifications',
          'Predictable behavior'
        ],
        tasks: [
          'Refactor functions that modify external variables',
          'Create functions that only use parameters and return values',
          'Avoid console.log inside reusable functions',
          'Separate calculation from output',
          'Create predictable functions'
        ]
      },
      {
        id: 'predictable-functions',
        title: 'Predictable inputs and outputs',
        learningPoints: [
          'Same input = same output',
          'No hidden dependencies',
          'Input validation',
          'Documentation'
        ],
        tasks: [
          'Same input always gives same output',
          'No hidden dependencies',
          'No random behavior in calculations',
          'Document what function expects and returns',
          'Validate inputs within functions'
        ]
      },
      {
        id: 'function-composition',
        title: 'Function composition',
        learningPoints: [
          'Combining functions',
          'Function pipelines',
          'Building complex from simple',
          'Chaining calls'
        ],
        tasks: [
          'Use output of one function as input to another',
          'Build complex operations from simple functions',
          'Create pipeline of function calls',
          'Combine multiple utility functions',
          'Break complex calculations into function chains'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // ARRAY METHODS (FUNCTIONAL APPROACH)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'array-methods',
    title: 'Array Methods (Functional Approach)',
    subtopics: [
      {
        id: 'foreach',
        title: 'forEach for iteration',
        learningPoints: [
          'forEach syntax',
          'Callback function',
          'forEach vs for loop',
          'No return value'
        ],
        tasks: [
          'Print each element using forEach',
          'Sum array elements using forEach',
          'Count elements matching condition using forEach',
          'Build a string from array using forEach',
          'Process each element with forEach'
        ]
      },
      {
        id: 'map',
        title: 'map for transformation',
        learningPoints: [
          'map syntax',
          'Transforming elements',
          'Returns new array',
          'Original unchanged'
        ],
        tasks: [
          'Square each number in array using map',
          'Convert array to uppercase strings using map',
          'Extract property from array of objects using map',
          'Transform prices with discount using map',
          'Convert temperatures C to F using map',
          'Add prefix to each string using map',
          'Double each number using map',
          'Get lengths of all strings using map'
        ]
      },
      {
        id: 'filter',
        title: 'filter for selection',
        learningPoints: [
          'filter syntax',
          'Condition callback',
          'Returns filtered array',
          'Selecting elements'
        ],
        tasks: [
          'Filter even numbers from array',
          'Filter numbers greater than threshold',
          'Filter strings longer than N characters',
          'Filter positive numbers only',
          'Remove empty strings using filter',
          'Filter passing grades',
          'Get adults from age array using filter',
          'Filter elements matching multiple criteria'
        ]
      },
      {
        id: 'find-findindex',
        title: 'find and findIndex',
        learningPoints: [
          'find syntax',
          'findIndex syntax',
          'First match only',
          'find vs filter'
        ],
        tasks: [
          'Find first even number',
          'Find first string containing substring',
          'Find first number divisible by N',
          'Get index of first negative number',
          'Find first element matching complex condition',
          'Understand difference between find and filter'
        ]
      },
      {
        id: 'some-every',
        title: 'some and every',
        learningPoints: [
          'some syntax',
          'every syntax',
          'Testing conditions',
          'Short-circuit evaluation'
        ],
        tasks: [
          'Check if any element is negative',
          'Check if all elements are positive',
          'Check if any string is empty',
          'Check if all numbers are even',
          'Validate array contents with every',
          'Check existence with some'
        ]
      },
      {
        id: 'reduce',
        title: 'reduce for accumulation',
        learningPoints: [
          'reduce syntax',
          'Accumulator pattern',
          'Initial value',
          'Building results'
        ],
        tasks: [
          'Sum array using reduce',
          'Find product of all numbers using reduce',
          'Find maximum using reduce',
          'Count occurrences using reduce',
          'Flatten nested array using reduce',
          'Build object from array using reduce',
          'Calculate average using reduce',
          'Group elements by criteria using reduce'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // STRING METHODS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'string-methods',
    title: 'String Methods',
    subtopics: [
      {
        id: 'string-manipulations',
        title: 'Common string manipulations',
        learningPoints: [
          'Case conversion',
          'Trimming whitespace',
          'Capitalization'
        ],
        tasks: [
          'Convert string to uppercase',
          'Convert string to lowercase',
          'Trim whitespace from string',
          'Remove extra spaces',
          'Capitalize first letter',
          'Title case a string (capitalize each word)'
        ]
      },
      {
        id: 'split-join',
        title: 'split and join',
        learningPoints: [
          'split method',
          'join method',
          'String to array',
          'Array to string'
        ],
        tasks: [
          'Split sentence into words',
          'Split CSV string',
          'Join array elements with comma',
          'Join words with spaces',
          'Reverse words in a sentence',
          'Convert camelCase to words'
        ]
      },
      {
        id: 'substring-slice',
        title: 'substring and slice',
        learningPoints: [
          'substring method',
          'slice method',
          'Extracting portions',
          'Index parameters'
        ],
        tasks: [
          'Extract first N characters',
          'Extract last N characters',
          'Get substring between positions',
          'Extract domain from email',
          'Get file extension from filename',
          'Extract area code from phone number'
        ]
      },
      {
        id: 'string-searching',
        title: 'String searching and matching',
        learningPoints: [
          'includes method',
          'indexOf method',
          'startsWith and endsWith',
          'Finding patterns'
        ],
        tasks: [
          'Check if string includes substring',
          'Find position of character in string',
          'Check if string starts with prefix',
          'Check if string ends with suffix',
          'Count occurrences of character',
          'Find all positions of a character',
          'Validate string patterns'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // OBJECTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'objects',
    title: 'Objects',
    subtopics: [
      {
        id: 'creating-objects',
        title: 'Creating objects',
        learningPoints: [
          'Object literal syntax',
          'Properties and values',
          'Nested objects'
        ],
        tasks: [
          'Create person object with name, age, city',
          'Create product object with name, price, quantity',
          'Create book object with title, author, year',
          'Create multiple related objects',
          'Create nested objects'
        ]
      },
      {
        id: 'accessing-properties',
        title: 'Accessing properties (dot vs bracket)',
        learningPoints: [
          'Dot notation',
          'Bracket notation',
          'Dynamic access',
          'Nested access'
        ],
        tasks: [
          'Access properties using dot notation',
          'Access properties using bracket notation',
          'Access nested properties',
          'Use variables to access properties dynamically',
          'Access properties with spaces in names'
        ]
      },
      {
        id: 'modifying-properties',
        title: 'Adding and modifying properties',
        learningPoints: [
          'Adding properties',
          'Updating values',
          'Deleting properties',
          'Copying properties'
        ],
        tasks: [
          'Add new property to existing object',
          'Modify existing property value',
          'Update multiple properties',
          'Delete a property',
          'Copy properties from one object to another'
        ]
      },
      {
        id: 'object-methods',
        title: 'Methods in objects',
        learningPoints: [
          'Methods as properties',
          'this keyword',
          'Method invocation',
          'Using object data'
        ],
        tasks: [
          'Create object with methods',
          'Use this keyword in methods',
          'Create calculator object with methods',
          'Create person object with greeting method',
          'Methods that use object\'s own properties'
        ]
      },
      {
        id: 'object-iteration',
        title: 'Object iteration',
        learningPoints: [
          'Object.keys',
          'Object.values',
          'Object.entries',
          'for...in loop'
        ],
        tasks: [
          'Print all property names',
          'Print all property values',
          'Print key-value pairs',
          'Count properties in object',
          'Check if property exists',
          'Create new object from existing with modifications',
          'Merge two objects',
          'Filter object properties',
          'Transform object values',
          'Convert object to array of entries'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // DESTRUCTURING
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'destructuring',
    title: 'Destructuring',
    subtopics: [
      {
        id: 'array-destructuring',
        title: 'Array destructuring',
        learningPoints: [
          'Destructuring syntax',
          'Extracting elements',
          'Skipping elements',
          'Rest pattern'
        ],
        tasks: [
          'Extract first two elements from array',
          'Skip elements while destructuring',
          'Get rest of array elements',
          'Swap two variables using destructuring',
          'Extract values from returned array'
        ]
      },
      {
        id: 'object-destructuring',
        title: 'Object destructuring',
        learningPoints: [
          'Property extraction',
          'Renaming',
          'Default values',
          'Nested destructuring'
        ],
        tasks: [
          'Extract properties from object',
          'Rename properties while destructuring',
          'Set default values in destructuring',
          'Destructure nested objects',
          'Destructure function parameters'
        ]
      },
      {
        id: 'destructuring-use-cases',
        title: 'Practical use cases',
        learningPoints: [
          'Function parameters',
          'API responses',
          'Configuration objects',
          'Cleaner code'
        ],
        tasks: [
          'Extract coordinates from point object',
          'Get name and age from person object',
          'Destructure API response structure',
          'Extract configuration values',
          'Simplify function parameters with destructuring'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // ARROW FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'arrow-functions',
    title: 'Arrow Functions',
    subtopics: [
      {
        id: 'arrow-syntax',
        title: 'Arrow function syntax',
        learningPoints: [
          'Arrow function syntax',
          'Parameter variations',
          'Function body',
          'Converting functions'
        ],
        tasks: [
          'Convert function declaration to arrow function',
          'One-parameter arrow function (no parentheses)',
          'Zero-parameter arrow function',
          'Multiple-parameter arrow function',
          'Arrow function with function body'
        ]
      },
      {
        id: 'when-to-use-arrows',
        title: 'When to use arrow functions',
        learningPoints: [
          'Array method callbacks',
          'Short functions',
          'When not to use',
          'this binding differences'
        ],
        tasks: [
          'Use arrow functions with array methods',
          'Replace anonymous functions with arrows',
          'Short callback functions',
          'When to keep traditional functions',
          'Arrow functions in object methods (and pitfalls)'
        ]
      },
      {
        id: 'implicit-explicit-returns',
        title: 'Implicit vs explicit returns',
        learningPoints: [
          'Implicit return',
          'Explicit return',
          'Returning objects',
          'Shortest form'
        ],
        tasks: [
          'Single expression with implicit return',
          'Multi-line with explicit return',
          'Return object literal with arrows',
          'Refactor to shortest form when possible',
          'Know when explicit return is needed'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // HIGHER-ORDER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'higher-order-functions',
    title: 'Higher-Order Functions',
    subtopics: [
      {
        id: 'functions-as-arguments',
        title: 'Functions as arguments',
        learningPoints: [
          'Passing functions',
          'Callback functions',
          'Custom implementations',
          'Function references'
        ],
        tasks: [
          'Create function that accepts callback',
          'Pass function as argument',
          'Execute callback at right time',
          'Create custom forEach implementation',
          'Create custom map implementation',
          'Custom filter implementation'
        ]
      },
      {
        id: 'functions-returning-functions',
        title: 'Functions returning functions',
        learningPoints: [
          'Returning functions',
          'Function factories',
          'Closures',
          'Private state'
        ],
        tasks: [
          'Function that returns another function',
          'Create function factory',
          'Create specialized functions from generic ones',
          'Closure concept through returning functions',
          'Create counter using closure',
          'Create private variables with closures'
        ]
      },
      {
        id: 'callback-patterns',
        title: 'Callbacks and their patterns',
        learningPoints: [
          'Async callbacks',
          'Error handling',
          'Callback sequences',
          'Timing'
        ],
        tasks: [
          'Async simulation with callbacks',
          'Error handling with callbacks',
          'Multiple callbacks in sequence',
          'Understand callback execution timing',
          'Pass data through callbacks'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // ARRAY ADVANCED PATTERNS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'array-advanced',
    title: 'Array Advanced Patterns',
    subtopics: [
      {
        id: 'chaining-methods',
        title: 'Chaining array methods',
        learningPoints: [
          'Method chaining',
          'Order of operations',
          'Building pipelines',
          'Readable chains'
        ],
        tasks: [
          'Filter then map an array',
          'Map then filter results',
          'Filter, map, then reduce',
          'Chain three or more operations',
          'Build complex transformations through chaining'
        ]
      },
      {
        id: 'combining-methods',
        title: 'Combining map, filter, reduce',
        learningPoints: [
          'Choosing the right method',
          'Combining methods',
          'Complex transformations',
          'Data pipelines'
        ],
        tasks: [
          'Get sum of even numbers using filter and reduce',
          'Get average of passing grades using filter and reduce',
          'Transform and accumulate in one chain',
          'Count items matching criteria after transformation',
          'Complex data processing pipelines'
        ]
      },
      {
        id: 'nested-arrays',
        title: 'Working with nested arrays',
        learningPoints: [
          'Flattening arrays',
          'Nested iteration',
          'Deep transformations',
          'Grouping'
        ],
        tasks: [
          'Flatten one level of nesting',
          'Flatten completely nested arrays',
          'Map over nested arrays',
          'Filter nested structures',
          'Transform nested array structures',
          'Find elements in nested arrays',
          'Group flat array into nested structure'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // TEMPLATE LITERALS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'template-literals',
    title: 'Template Literals',
    subtopics: [
      {
        id: 'string-interpolation',
        title: 'String interpolation',
        learningPoints: [
          'Template literal syntax',
          'Embedding expressions',
          'Variables in strings',
          'Calculations in templates'
        ],
        tasks: [
          'Create greeting with name variable',
          'Build message with multiple variables',
          'Include calculations in template',
          'Format currency in template',
          'Create dynamic URLs',
          'Build HTML strings with data'
        ]
      },
      {
        id: 'multiline-strings',
        title: 'Multi-line strings',
        learningPoints: [
          'Multi-line syntax',
          'Preserving whitespace',
          'Formatted output'
        ],
        tasks: [
          'Create multi-line message',
          'Format address in multiple lines',
          'Create formatted output with newlines',
          'Build ASCII art with template literals'
        ]
      },
      {
        id: 'dynamic-strings',
        title: 'Dynamic string building',
        learningPoints: [
          'Dynamic content',
          'Building templates',
          'Complex strings'
        ],
        tasks: [
          'Generate report with dynamic data',
          'Create formatted invoice',
          'Build email templates',
          'Generate SQL queries (as strings)',
          'Create configuration strings'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // SPREAD AND REST
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'spread-rest',
    title: 'Spread and Rest',
    subtopics: [
      {
        id: 'spread-arrays',
        title: 'Spread operator for arrays',
        learningPoints: [
          'Spread syntax',
          'Copying arrays',
          'Combining arrays',
          'Function arguments'
        ],
        tasks: [
          'Copy an array using spread',
          'Concatenate arrays using spread',
          'Add elements to array using spread',
          'Pass array elements as function arguments',
          'Find max/min using spread with Math'
        ]
      },
      {
        id: 'spread-objects',
        title: 'Spread operator for objects',
        learningPoints: [
          'Object spread',
          'Merging objects',
          'Overriding properties',
          'Shallow copying'
        ],
        tasks: [
          'Copy object using spread',
          'Merge objects using spread',
          'Override properties while merging',
          'Add properties to existing object',
          'Clone nested objects (shallow)'
        ]
      },
      {
        id: 'rest-parameters',
        title: 'Rest parameters in functions',
        learningPoints: [
          'Rest syntax',
          'Variable arguments',
          'Combining with regular params',
          'Flexible functions'
        ],
        tasks: [
          'Function accepting variable number of arguments',
          'Collect remaining parameters with rest',
          'Combine regular parameters with rest',
          'Sum any number of values',
          'Create flexible functions with rest'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // ERROR HANDLING
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'error-handling',
    title: 'Error Handling',
    subtopics: [
      {
        id: 'understanding-errors',
        title: 'Understanding errors',
        learningPoints: [
          'Error types',
          'Reading error messages',
          'Stack traces',
          'Common mistakes'
        ],
        tasks: [
          'Identify common error types',
          'Read error messages correctly',
          'Find line numbers in errors',
          'Understand stack traces',
          'Common mistakes causing errors'
        ]
      },
      {
        id: 'try-catch',
        title: 'try-catch blocks',
        learningPoints: [
          'try block',
          'catch block',
          'Error object',
          'Continued execution'
        ],
        tasks: [
          'Wrap risky code in try-catch',
          'Catch and log errors',
          'Continue execution after error',
          'Try-catch in functions',
          'Nested try-catch blocks'
        ]
      },
      {
        id: 'throwing-errors',
        title: 'Throwing errors',
        learningPoints: [
          'throw statement',
          'Custom error messages',
          'Validation errors',
          'Early throwing'
        ],
        tasks: [
          'Throw error for invalid input',
          'Create custom error messages',
          'Throw errors in validation functions',
          'Early error throwing pattern',
          'Meaningful error messages'
        ]
      },
      {
        id: 'graceful-handling',
        title: 'Graceful error handling',
        learningPoints: [
          'Default values',
          'Retry logic',
          'User-friendly messages',
          'Preventing crashes'
        ],
        tasks: [
          'Provide default values on error',
          'Retry logic with error handling',
          'User-friendly error messages',
          'Log errors for debugging',
          'Prevent application crash with proper handling'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // ASYNCHRONOUS JAVASCRIPT BASICS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'async-basics',
    title: 'Asynchronous JavaScript Basics',
    subtopics: [
      {
        id: 'sync-vs-async',
        title: 'Understanding synchronous vs asynchronous',
        learningPoints: [
          'Blocking code',
          'Non-blocking code',
          'Execution order',
          'Async operations'
        ],
        tasks: [
          'Understand blocking code',
          'Understand non-blocking code',
          'Observe execution order',
          'Identify async operations',
          'Real-world async examples'
        ]
      },
      {
        id: 'settimeout-setinterval',
        title: 'setTimeout and setInterval',
        learningPoints: [
          'setTimeout syntax',
          'setInterval syntax',
          'Clearing timers',
          'Callback timing'
        ],
        tasks: [
          'Delay execution with setTimeout',
          'Repeat execution with setInterval',
          'Clear timeouts and intervals',
          'Create countdown timer',
          'Debounce pattern simulation',
          'Understand callback execution timing'
        ]
      },
      {
        id: 'why-async',
        title: 'Why asynchronous matters',
        learningPoints: [
          'API calls',
          'Multiple operations',
          'Callback hell',
          'Better patterns'
        ],
        tasks: [
          'Simulate API call delay',
          'Handle multiple async operations',
          'Understand callback hell problem',
          'Need for better async patterns'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PROMISES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'promises',
    title: 'Promises',
    subtopics: [
      {
        id: 'creating-promises',
        title: 'Creating promises',
        learningPoints: [
          'Promise constructor',
          'resolve and reject',
          'Promise states',
          'Delayed promises'
        ],
        tasks: [
          'Create a basic promise',
          'Resolve a promise with value',
          'Reject a promise with error',
          'Promise that resolves after delay',
          'Conditional resolve/reject'
        ]
      },
      {
        id: 'then-catch',
        title: 'then and catch',
        learningPoints: [
          'then method',
          'catch method',
          'Chaining then',
          'Error propagation'
        ],
        tasks: [
          'Handle promise resolution with then',
          'Handle promise rejection with catch',
          'Chain multiple then calls',
          'Return values from then',
          'Error propagation in chains'
        ]
      },
      {
        id: 'chaining-promises',
        title: 'Chaining promises',
        learningPoints: [
          'Sequential execution',
          'Data passing',
          'Transformation',
          'Error stages'
        ],
        tasks: [
          'Sequential promise execution',
          'Pass data through promise chain',
          'Transform data in chain',
          'Multiple async operations in sequence',
          'Handle errors at different stages'
        ]
      },
      {
        id: 'promise-all-race',
        title: 'Promise.all and Promise.race',
        learningPoints: [
          'Promise.all',
          'Promise.race',
          'Parallel execution',
          'Combining results'
        ],
        tasks: [
          'Wait for multiple promises with Promise.all',
          'Get first resolved promise with Promise.race',
          'Handle errors in Promise.all',
          'Parallel async operations',
          'Combine results from multiple promises'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // ASYNC/AWAIT
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'async-await',
    title: 'Async/Await',
    subtopics: [
      {
        id: 'async-functions',
        title: 'async functions',
        learningPoints: [
          'async keyword',
          'Returns promise',
          'Converting to async',
          'Multiple operations'
        ],
        tasks: [
          'Create async function',
          'Async function always returns promise',
          'Convert promise-based code to async',
          'Multiple async operations',
          'Await in async function'
        ]
      },
      {
        id: 'await-keyword',
        title: 'await keyword',
        learningPoints: [
          'await syntax',
          'Waiting for promises',
          'Sequential awaits',
          'Conditional awaits'
        ],
        tasks: [
          'Wait for promise resolution',
          'Store awaited result in variable',
          'Sequential awaits',
          'Conditional awaits',
          'Await in loops'
        ]
      },
      {
        id: 'async-error-handling',
        title: 'Error handling with async/await',
        learningPoints: [
          'try-catch with async',
          'Specific errors',
          'Multiple try-catch',
          'Recovery patterns'
        ],
        tasks: [
          'Try-catch with async/await',
          'Handle specific errors',
          'Multiple try-catch blocks',
          'Error recovery patterns',
          'Clean error handling'
        ]
      },
      {
        id: 'converting-to-async',
        title: 'Converting promises to async/await',
        learningPoints: [
          'Refactoring promises',
          'Simplifying code',
          'Parallel with async',
          'When to use which'
        ],
        tasks: [
          'Refactor promise chains to async/await',
          'Convert complex promise code',
          'Simplify nested promises',
          'Parallel operations with Promise.all and async/await',
          'When to use promises vs async/await'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // MODERN JAVASCRIPT PRACTICES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'modern-practices',
    title: 'Modern JavaScript Practices',
    subtopics: [
      {
        id: 'const-first',
        title: 'Const by default mindset',
        learningPoints: [
          'const first approach',
          'Identifying mutability',
          'Refactoring to const'
        ],
        tasks: [
          'Audit code for let that should be const',
          'Identify true mutable needs',
          'Practice const-first coding',
          'Refactor old code to use const'
        ]
      },
      {
        id: 'extracting-logic',
        title: 'Extracting reusable logic',
        learningPoints: [
          'Finding patterns',
          'Utility functions',
          'Abstraction',
          'Helpers'
        ],
        tasks: [
          'Find repeated code patterns',
          'Extract to utility functions',
          'Create helper function library',
          'Identify opportunities for abstraction',
          'Build reusable validation functions',
          'Create formatting utilities'
        ]
      },
      {
        id: 'readable-names',
        title: 'Readable variable names',
        learningPoints: [
          'Descriptive names',
          'Intention-revealing',
          'Boolean naming',
          'Avoiding generic names'
        ],
        tasks: [
          'Refactor single-letter variables',
          'Replace abbreviations with full words',
          'Use intention-revealing names',
          'Boolean variable naming (is, has, can)',
          'Avoid generic names (data, temp, value)'
        ]
      },
      {
        id: 'code-organization',
        title: 'Code organization principles',
        learningPoints: [
          'Grouping functions',
          'Logical ordering',
          'Separation of concerns',
          'Short functions'
        ],
        tasks: [
          'Group related functions',
          'Order functions logically',
          'Separate concerns',
          'Keep functions short and focused',
          'One level of abstraction per function'
        ]
      },
      {
        id: 'self-documenting',
        title: 'Writing self-documenting code',
        learningPoints: [
          'Code that explains itself',
          'Meaningful names',
          'Clear structure',
          'Refactoring for clarity'
        ],
        tasks: [
          'Code that explains itself',
          'Reduce need for comments',
          'Meaningful function and variable names',
          'Clear structure and flow',
          'Extract complex conditions to named variables',
          'Refactor entire old programs with all principles'
        ]
      }
    ]
  }
]

// Helper functions
export function getTopicById(topicId) {
  return curriculum.find(topic => topic.id === topicId)
}

export function getSubtopicById(topicId, subtopicId) {
  const topic = getTopicById(topicId)
  return topic?.subtopics.find(sub => sub.id === subtopicId)
}

export function calculateProgress(userProgress) {
  let totalSubtopics = 0
  let completedSubtopics = 0
  const byTopic = {}

  curriculum.forEach(topic => {
    const topicCompleted = topic.subtopics.filter(sub =>
      userProgress?.[topic.id]?.subtopics?.[sub.id]
    ).length

    totalSubtopics += topic.subtopics.length
    completedSubtopics += topicCompleted

    byTopic[topic.id] = {
      completed: topicCompleted,
      total: topic.subtopics.length
    }
  })

  return {
    overall: totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0,
    completed: completedSubtopics,
    total: totalSubtopics,
    byTopic
  }
}
