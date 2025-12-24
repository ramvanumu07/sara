export const curriculum = [
  // ═══════════════════════════════════════════════════════════════
  // PHASE 0 — GETTING STARTED
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'getting-started',
    title: 'Getting Started',
    subtopics: [
      {
        id: 'console-log',
        title: 'console.log',
        tasks: [
          'Print a number',
          'Print a string',
          'Print the result of an arithmetic expression',
          'Print multiple lines using console.log'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 1 — VARIABLES & STATE
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'variables-state',
    title: 'Variables & State Management',
    subtopics: [
      {
        id: 'let-const',
        title: 'let and const',
        tasks: [
          'Store your age and print it',
          'Increase age by 5 and print the result',
          'Store two numbers and print their sum',
          'Swap two variables using a temporary variable'
        ]
      },
      {
        id: 'data-types',
        title: 'Data Types (Number, String, Boolean)',
        tasks: [
          'Store and print a number',
          'Store and print a string',
          'Store and print a boolean',
          'Change a value\'s type and print it'
        ]
      },
      {
        id: 'state-change',
        title: 'State Change',
        tasks: [
          'Track a bank balance after deposit',
          'Track the balance after withdrawal',
          'Apply multiple transactions step by step'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2 — OPERATORS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'operators',
    title: 'Operators',
    subtopics: [
      {
        id: 'arithmetic',
        title: 'Arithmetic Operators',
        tasks: [
          'Calculate area of a rectangle',
          'Convert minutes to seconds',
          'Calculate simple interest',
          'Find remainder of division'
        ]
      },
      {
        id: 'comparison',
        title: 'Comparison Operators',
        tasks: [
          'Compare two numbers',
          'Check if a number is greater than 100',
          'Check if two strings are equal',
          'Compare lengths of two strings',
          'Check if age is greater than or equal to 18'
        ]
      },
      {
        id: 'logical',
        title: 'Logical Operators (&&, ||, !)',
        tasks: [
          'Check if age ≥ 18 AND citizen',
          'Check if number is positive AND even',
          'Check if user is admin OR editor',
          'Check if temperature is within safe range',
          'Combine three logical conditions'
        ]
      },
      {
        id: 'ternary',
        title: 'Ternary Operator',
        tasks: [
          'Check even or odd using ternary',
          'Pass or fail using ternary',
          'Find max of two numbers',
          'Show login message based on condition',
          'Write a simple nested ternary'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 3 — CONDITIONAL STATEMENTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'conditionals',
    title: 'Conditional Statements',
    subtopics: [
      {
        id: 'if-else',
        title: 'if / else / else if',
        tasks: [
          'Check positive, negative, or zero',
          'Find largest of three numbers',
          'Check leap year',
          'Check vowel or consonant',
          'Build a simple calculator using if-else'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 4 — LOOPS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'loops',
    title: 'Loops',
    subtopics: [
      {
        id: 'for-loop',
        title: 'for loop',
        tasks: [
          'Print numbers from 1 to 10',
          'Print even numbers in a range',
          'Find sum of first N numbers',
          'Print multiplication table',
          'Count digits in a number'
        ]
      },
      {
        id: 'while-loop',
        title: 'while loop',
        tasks: [
          'Reverse a number',
          'Find sum of digits',
          'Check palindrome number',
          'Calculate factorial',
          'Input validation loop'
        ]
      },
      {
        id: 'break-continue',
        title: 'break and continue',
        tasks: [
          'Stop loop when a condition is met',
          'Skip multiples of 3',
          'Find first even number',
          'Exit loop early based on condition'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 5 — FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'functions',
    title: 'Functions',
    subtopics: [
      {
        id: 'function-basics',
        title: 'Function Basics',
        tasks: [
          'Write a function to add two numbers',
          'Write a function to check prime',
          'Write a factorial function',
          'Write a function to reverse a number',
          'Write a palindrome checker function'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 6 — ARRAYS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'arrays',
    title: 'Arrays',
    subtopics: [
      {
        id: 'array-basics',
        title: 'Array Basics',
        tasks: [
          'Find sum of array elements',
          'Find maximum element',
          'Find minimum element',
          'Count even numbers in array',
          'Reverse an array manually'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 7 — STRINGS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'strings',
    title: 'Strings',
    subtopics: [
      {
        id: 'string-ops',
        title: 'String Operations',
        tasks: [
          'Count vowels in a string',
          'Reverse a string',
          'Check palindrome string',
          'Count frequency of characters',
          'Remove spaces from string'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 8 — OBJECTS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'objects',
    title: 'Objects',
    subtopics: [
      {
        id: 'object-basics',
        title: 'Object Basics',
        tasks: [
          'Create a user object',
          'Update object property',
          'Store multiple users in an array',
          'Find oldest user',
          'Calculate average age'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 9 — PROBLEM SOLVING INTEGRATION
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'problem-solving',
    title: 'Problem Solving Integration',
    subtopics: [
      {
        id: 'mixed-logic',
        title: 'Mixed Logic Problems',
        tasks: [
          'FizzBuzz',
          'Remove duplicates from array',
          'Build frequency counter',
          'Implement simple to-do list logic'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PROJECT: STUDENT MANAGEMENT SYSTEM
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'project-student',
    title: '📁 Project: Student Management System',
    isProject: true,
    subtopics: [
      {
        id: 'student-mgmt',
        title: 'Build Student Management System',
        tasks: [
          'Add students',
          'Store marks',
          'Calculate average marks',
          'Find topper',
          'Display report'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 10 — FUNCTIONAL ARRAY METHODS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'array-methods',
    title: 'Functional Array Methods',
    subtopics: [
      {
        id: 'foreach',
        title: 'forEach',
        tasks: [
          'Print all elements',
          'Multiply each element by 2',
          'Print index and value'
        ]
      },
      {
        id: 'map',
        title: 'map',
        tasks: [
          'Convert prices to tax-added prices',
          'Square all numbers',
          'Convert names to uppercase'
        ]
      },
      {
        id: 'filter',
        title: 'filter',
        tasks: [
          'Extract even numbers',
          'Filter students who passed',
          'Remove falsy values'
        ]
      },
      {
        id: 'reduce',
        title: 'reduce',
        tasks: [
          'Calculate sum of numbers',
          'Find maximum value',
          'Count occurrences'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PROJECT: SHOPPING CART PROCESSOR
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'project-cart',
    title: '📁 Project: Shopping Cart Processor',
    isProject: true,
    subtopics: [
      {
        id: 'shopping-cart',
        title: 'Build Shopping Cart Processor',
        tasks: [
          'Calculate total price',
          'Filter items above a price',
          'Generate discounted prices list'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 11 — REAL-WORLD DATA HANDLING
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'objects-arrays',
    title: 'Real-World Data Handling',
    subtopics: [
      {
        id: 'array-of-objects',
        title: 'Array of Objects',
        tasks: [
          'Find user by ID',
          'Increase salary of employees',
          'Filter active users',
          'Group users by role'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PROJECT: EMPLOYEE MANAGEMENT SYSTEM
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'project-employee',
    title: '📁 Project: Employee Management System',
    isProject: true,
    subtopics: [
      {
        id: 'employee-mgmt',
        title: 'Build Employee Management System',
        tasks: [
          'Add employees',
          'Promote employee',
          'Calculate payroll',
          'Filter by department'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 12 — ADVANCED FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'advanced-functions',
    title: 'Advanced Functions',
    subtopics: [
      {
        id: 'callbacks-arrow',
        title: 'Callbacks & Arrow Functions',
        tasks: [
          'Pass function as argument',
          'Create reusable logger',
          'Build custom filter function',
          'Delay execution using callback'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PROJECT: CUSTOM ARRAY UTILITIES
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'project-utils',
    title: '📁 Project: Custom Array Utilities',
    isProject: true,
    subtopics: [
      {
        id: 'array-utils',
        title: 'Build Custom Array Utilities',
        tasks: [
          'Implement custom map',
          'Implement custom filter',
          'Implement custom reduce'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 13 — ASYNC PROGRAMMING
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'async',
    title: 'Async Programming',
    subtopics: [
      {
        id: 'callbacks-async',
        title: 'Callbacks',
        tasks: [
          'Display delayed message',
          'Execute sequential callbacks'
        ]
      },
      {
        id: 'promises',
        title: 'Promises',
        tasks: [
          'Create a promise',
          'Resolve and reject promise',
          'Chain promises'
        ]
      },
      {
        id: 'async-await',
        title: 'Async / Await',
        tasks: [
          'Rewrite promise code using async/await',
          'Handle errors using try/catch'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PROJECT: FAKE API SIMULATOR
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'project-api-sim',
    title: '📁 Project: Fake API Simulator',
    isProject: true,
    subtopics: [
      {
        id: 'fake-api',
        title: 'Build Fake API Simulator',
        tasks: [
          'Mock API using setTimeout',
          'Handle success and failure',
          'Process returned data'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 14 — API INTEGRATION
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'apis',
    title: 'API Integration',
    subtopics: [
      {
        id: 'fetch-api',
        title: 'Fetch API',
        tasks: [
          'Fetch posts from API',
          'Extract specific fields',
          'Handle loading state',
          'Handle error state'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PROJECT: MINI DATA DASHBOARD
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'project-dashboard',
    title: '📁 Project: Mini Data Dashboard',
    isProject: true,
    subtopics: [
      {
        id: 'data-dashboard',
        title: 'Build Mini Data Dashboard',
        tasks: [
          'Fetch data',
          'Filter data',
          'Display summary information'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PHASE 15 — ERROR HANDLING
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'error-handling',
    title: 'Error Handling',
    subtopics: [
      {
        id: 'try-catch',
        title: 'try / catch & Debugging',
        tasks: [
          'Catch runtime error',
          'Validate user input',
          'Handle failure gracefully'
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // PROJECT: SAFE CALCULATOR
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'project-calc',
    title: '📁 Project: Safe Calculator',
    isProject: true,
    subtopics: [
      {
        id: 'safe-calc',
        title: 'Build Safe Calculator',
        tasks: [
          'Handle invalid inputs',
          'Prevent crashes'
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

export function calculateProgress(userProgress = {}) {
  let totalSubtopics = 0
  let completedSubtopics = 0
  const byTopic = {}

  curriculum.forEach(topic => {
    // Count completed subtopics using new format: `${topicId}-${subtopicId}`: { status: 'completed' }
    const topicCompleted = topic.subtopics.filter(sub => {
      const key = `${topic.id}-${sub.id}`
      return userProgress[key]?.status === 'completed'
    }).length

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
