export const courses = [
  {
    "id": 'javascript',
    "title": 'JavaScript',
    "description": 'Master JavaScript from fundamentals to advanced concepts',
    "topics": [
      {
        "id": 'console-log',
        "title": 'console.log',
        "outcomes": [
          'console.log() basic syntax',
          'String literals (Single vs. Double quotes)',
          'Printing numeric values and decimals',
          'Basic arithmetic expressions in logs',
          'String concatenation (+) and the space problem',
          'Comma-separated logging and auto-spacing',
          'Logic vs. String representation (The Quote Trap)',
          'Introduction to Template Literals (${})'
        ],
        "tasks": [
          {
            "description": '// Print the result of 147 + 289\n// Your output should be:\n// 436',
            "solution_type": 'script',
            "testCases": [
              {
                "input": {},
                "expectedOutput": '436'
              }
            ]
          },
          {
            "description": '// Print the result of 100 divided by 8\n// Your output should be:\n// 12.5',
            "solution_type": 'script',
            "testCases": [
              {
                "input": {},
                "expectedOutput": '12.5'
              }
            ]
          },
          {
            "description": '// Print the result of (15 + 25) * 3 - 10\n// Your output should be:\n// 110',
            "solution_type": 'script',
            "testCases": [
              {
                "input": {},
                "expectedOutput": '110'
              }
            ]
          },
          {
            "description": '// Print three separate calculations, each on a new line:\n// 45 + 78\n// 200 - 63\n// 12 * 9\n// Your output should be:\n// 123\n// 137\n// 108',
            "solution_type": 'script',
            "testCases": [
              {
                "input": {},
                "expectedOutput": '123\n137\n108'
              }
            ]
          },
          {
            "description": '// Print "Hello" and "World" with exactly one space between them using the + operator\n// Your output should be:\n// Hello World',
            "solution_type": 'script',
            "testCases": [
              {
                "input": {},
                "expectedOutput": 'Hello World'
              }
            ]
          },
          {
            "description": '// Print the text "The answer is" followed by the calculation 7 * 6\n// Your output should be:\n// The answer is 42',
            "solution_type": 'script',
            "testCases": [
              {
                "input": {},
                "expectedOutput": 'The answer is 42'
              }
            ]
          },
          {
            "description": '// Use a template literal to print "15 plus 28 equals" followed by the actual sum\n// Your output should be:\n// 15 plus 28 equals 43',
            "solution_type": 'script',
            "testCases": [
              {
                "input": {},
                "expectedOutput": '15 plus 28 equals 43'
              }
            ]
          },
          {
            "description": '// Print: He said "JavaScript is amazing"\n// (Include the double quotes in the output)\n// Your output should be:\n// He said "JavaScript is amazing"',
            "solution_type": 'script',
            "testCases": [
              {
                "input": {},
                "expectedOutput": 'He said "JavaScript is amazing"'
              }
            ]
          },
          {
            "description": '// Print three values using comma separation: the number 100, the text "items", and the calculation 50 * 2\n// Your output should be:\n// 100 items 100',
            "solution_type": 'script',
            "testCases": [
              {
                "input": {},
                "expectedOutput": '100 items 100'
              }
            ]
          },
          {
            "description": '// Print a formatted statement showing both the expression and result\n// Use template literals to print: "Expression: 20 + 30 * 2 = " followed by the calculated result\n// Your output should be:\n// Expression: 20 + 30 * 2 = 80',
            "solution_type": 'script',
            "testCases": [
              {
                "input": {},
                "expectedOutput": 'Expression: 20 + 30 * 2 = 80'
              }
            ]
          }
        ]
      },
      {
        "id": 'variables-and-constants',
        "title": 'Variables and Constants',
        "outcomes": [
          'Variables as named memory containers',
          'Declaring constants with const',
          'Declaring mutable variables with let',
          'Initialization and Assignment',
          'Accessing and using stored values',
          'Variable Reassignment (let)',
          'Immutability: Why const cannot be reassigned',
          'Identifier Naming Rules (CamelCase and Reserved Words)'
        ],
        "tasks": [
          {
            "description": '// Do not rename a and b, use them as input for your program.\n// While testing we will change their values.\nconst a = 15;\nconst b = 27;\n\n// Swap the values of a and b using a third variable\n// Print both values after swapping\n// For example, if a = 15 and b = 27, your output should be:\n// 27\n// 15',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "a": 15, "b": 27 },
                "expectedOutput": '27\n15'
              },
              {
                "input": { "a": 100, "b": 200 },
                "expectedOutput": '200\n100'
              },
              {
                "input": { "a": 7, "b": 3 },
                "expectedOutput": '3\n7'
              }
            ]
          },
          {
            "description": '// Do not rename num1, num2, num3, use them as input for your program.\n// While testing we will change their values.\nconst num1 = 5;\nconst num2 = 12;\nconst num3 = 8;\n\n// Calculate a running sum: start with num1, add num2, then add num3\n// Print the sum after each addition\n// For example, if num1 = 5, num2 = 12, num3 = 8, your output should be:\n// 5\n// 17\n// 25',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "num1": 5, "num2": 12, "num3": 8 },
                "expectedOutput": '5\n17\n25'
              },
              {
                "input": { "num1": 10, "num2": 20, "num3": 30 },
                "expectedOutput": '10\n30\n60'
              },
              {
                "input": { "num1": 1, "num2": 2, "num3": 3 },
                "expectedOutput": '1\n3\n6'
              }
            ]
          },
          {
            "description": '// Do not rename start and increment, use them as input for your program.\n// While testing we will change their values.\nconst start = 10;\nconst increment = 3;\n\n// Create a counter starting at \'start\' and increment it 4 times by \'increment\'\n// Print the counter value after each increment\n// For example, if start = 10 and increment = 3, your output should be:\n// 13\n// 16\n// 19\n// 22',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "start": 10, "increment": 3 },
                "expectedOutput": '13\n16\n19\n22'
              },
              {
                "input": { "start": 0, "increment": 5 },
                "expectedOutput": '5\n10\n15\n20'
              },
              {
                "input": { "start": 100, "increment": 10 },
                "expectedOutput": '110\n120\n130\n140'
              }
            ]
          },
          {
            "description": '// Do not rename celsius, use it as input for your program.\n// While testing we will change its value.\nconst celsius = 100;\n\n// Convert celsius to Fahrenheit using: (celsius * 9/5) + 32, then store that result\n// Convert the Fahrenheit value to Kelvin using: (F - 32) * 5/9 + 273.15\n// Print both converted values (Fahrenheit first, then Kelvin)\n// For example, if celsius = 100, your output should be:\n// 212\n// 373.15',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "celsius": 100 },
                "expectedOutput": '212\n373.15'
              },
              {
                "input": { "celsius": 0 },
                "expectedOutput": '32\n273.15'
              },
              {
                "input": { "celsius": 25 },
                "expectedOutput": '77\n298.15'
              }
            ]
          },
          {
            "description": '// Do not rename principal, rate, time, use them as input for your program.\n// While testing we will change their values.\nconst principal = 1000;\nconst rate = 5;\nconst time = 2;\n\n// Calculate simple interest: (principal * rate * time) / 100\n// Calculate total amount: principal + interest\n// Print the interest and then the total amount\n// For example, if principal = 1000, rate = 5, time = 2, your output should be:\n// 100\n// 1100',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "principal": 1000, "rate": 5, "time": 2 },
                "expectedOutput": '100\n1100'
              },
              {
                "input": { "principal": 5000, "rate": 10, "time": 3 },
                "expectedOutput": '1500\n6500'
              },
              {
                "input": { "principal": 2000, "rate": 7, "time": 1 },
                "expectedOutput": '140\n2140'
              }
            ]
          },
          {
            "description": '// Do not rename length and width, use them as input for your program.\n// While testing we will change their values.\nconst length = 8;\nconst width = 5;\n\n// Calculate the area and perimeter of a rectangle\n// Area = length * width\n// Perimeter = 2 * (length + width)\n// Print area first, then perimeter\n// For example, if length = 8 and width = 5, your output should be:\n// 40\n// 26',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "length": 8, "width": 5 },
                "expectedOutput": '40\n26'
              },
              {
                "input": { "length": 10, "width": 10 },
                "expectedOutput": '100\n40'
              },
              {
                "input": { "length": 12, "width": 7 },
                "expectedOutput": '84\n38'
              }
            ]
          },
          {
            "description": '// Do not rename score1, score2, score3, use them as input for your program.\n// While testing we will change their values.\nconst score1 = 85;\nconst score2 = 92;\nconst score3 = 78;\n\n// Calculate the sum of all scores\n// Calculate the average (sum divided by 3)\n// Print the sum and then the average\n// For example, if scores are 85, 92, 78, your output should be:\n// 255\n// 85',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "score1": 85, "score2": 92, "score3": 78 },
                "expectedOutput": '255\n85'
              },
              {
                "input": { "score1": 90, "score2": 90, "score3": 90 },
                "expectedOutput": '270\n90'
              },
              {
                "input": { "score1": 70, "score2": 80, "score3": 100 },
                "expectedOutput": '250\n83.33333333333333'
              }
            ]
          },
          {
            "description": '// Do not rename distance and time, use them as input for your program.\n// While testing we will change their values.\nconst distance = 150;\nconst time = 3;\n\n// Calculate speed: distance / time\n// Calculate double the speed\n// Print original speed and then doubled speed\n// For example, if distance = 150 and time = 3, your output should be:\n// 50\n// 100',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "distance": 150, "time": 3 },
                "expectedOutput": '50\n100'
              },
              {
                "input": { "distance": 200, "time": 4 },
                "expectedOutput": '50\n100'
              },
              {
                "input": { "distance": 360, "time": 6 },
                "expectedOutput": '60\n120'
              }
            ]
          },
          {
            "description": '// Do not rename num, use it as input for your program.\n// num will be a two-digit number.\n// While testing we will change its value.\nconst num = 47;\n\n// Extract and store the tens digit and units digit separately\n// Print tens digit first, then units digit\n// Hint: Use Math.floor(num / 10) for tens, num % 10 for units\n// For example, if num = 47, your output should be:\n// 4\n// 7',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "num": 47 },
                "expectedOutput": '4\n7'
              },
              {
                "input": { "num": 93 },
                "expectedOutput": '9\n3'
              },
              {
                "input": { "num": 10 },
                "expectedOutput": '1\n0'
              }
            ]
          },
          {
            "description": '// Do not rename x, y, z, use them as input for your program.\n// While testing we will change their values.\nconst x = 6;\nconst y = 4;\nconst z = 2;\n\n// Calculate: (x + y) * z\n// Store the result and then calculate: result - x\n// Print both values\n// For example, if x = 6, y = 4, z = 2, your output should be:\n// 20\n// 14',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "x": 6, "y": 4, "z": 2 },
                "expectedOutput": '20\n14'
              },
              {
                "input": { "x": 10, "y": 5, "z": 3 },
                "expectedOutput": '45\n35'
              },
              {
                "input": { "x": 8, "y": 2, "z": 5 },
                "expectedOutput": '50\n42'
              }
            ]
          }
        ]
      },
      {
        "id": 'numbers-and-basic-arithmetic',
        "title": 'Numbers and Basic Arithmetic',
        "outcomes": [
          'Number Types: Integers and Floating-points',
          'Basic Arithmetic: Addition and Subtraction',
          'Scale and Ratio: Multiplication and Division',
          'The Modulo Operator: Finding the Remainder (%)',
          'Operator Precedence (PEMDAS/BODMAS)',
          'Overriding Priority with Parentheses',
          'Compound Logic: Multi-step Calculations'
        ],
        "tasks": [
          {
            "description": '// Do not rename dividend and divisor, use them as input for your program.\n// While testing we will change their values.\nconst dividend = 47;\nconst divisor = 6;\n\n// Calculate the quotient (without decimals) and remainder\n// Use Math.floor for quotient and % for remainder\n// Print quotient first, then remainder\n// For example, if dividend = 47 and divisor = 6, your output should be:\n// 7\n// 5',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "dividend": 47, "divisor": 6 },
                "expectedOutput": '7\n5'
              },
              {
                "input": { "dividend": 100, "divisor": 7 },
                "expectedOutput": '14\n2'
              },
              {
                "input": { "dividend": 15, "divisor": 5 },
                "expectedOutput": '3\n0'
              },
              {
                "input": { "dividend": 7, "divisor": 10 },
                "expectedOutput": '0\n7'
              },
              {
                "input": { "dividend": 1000, "divisor": 3 },
                "expectedOutput": '333\n1'
              }
            ]
          },
          {
            "description": '// Do not rename a, b, c, use them as input for your program.\n// While testing we will change their values.\nconst a = 12;\nconst b = 25;\nconst c = 18;\n\n// Calculate and print:\n// 1. Sum of all three numbers\n// 2. Product of all three numbers\n// 3. Average of all three numbers\n// For example, if a = 12, b = 25, c = 18, your output should be:\n// 55\n// 5400\n// 18.333333333333332',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "a": 12, "b": 25, "c": 18 },
                "expectedOutput": '55\n5400\n18.333333333333332'
              },
              {
                "input": { "a": 10, "b": 20, "c": 30 },
                "expectedOutput": '60\n6000\n20'
              },
              {
                "input": { "a": 0, "b": 5, "c": 10 },
                "expectedOutput": '15\n0\n5'
              },
              {
                "input": { "a": -5, "b": 10, "c": 15 },
                "expectedOutput": '20\n-750\n6.666666666666667'
              },
              {
                "input": { "a": 100, "b": 200, "c": 300 },
                "expectedOutput": '600\n6000000\n200'
              }
            ]
          },
          {
            "description": '// Do not rename obtained and total, use them as input for your program.\n// While testing we will change their values.\nconst obtained = 427;\nconst total = 500;\n\n// Calculate the percentage: (obtained / total) * 100\n// Print the percentage value\n// For example, if obtained = 427 and total = 500, your output should be:\n// 85.4',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "obtained": 427, "total": 500 },
                "expectedOutput": '85.4'
              },
              {
                "input": { "obtained": 360, "total": 400 },
                "expectedOutput": '90'
              },
              {
                "input": { "obtained": 75, "total": 150 },
                "expectedOutput": '50'
              },
              {
                "input": { "obtained": 500, "total": 500 },
                "expectedOutput": '100'
              },
              {
                "input": { "obtained": 0, "total": 100 },
                "expectedOutput": '0'
              },
              {
                "input": { "obtained": 33, "total": 100 },
                "expectedOutput": '33'
              }
            ]
          },
          {
            "description": '// Do not rename num, use it as input for your program.\n// num will be a positive integer.\n// While testing we will change its value.\nconst num = 5847;\n\n// Extract and print the last digit of num\n// Hint: Use the modulo operator\n// For example, if num = 5847, your output should be:\n// 7',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "num": 5847 },
                "expectedOutput": '7'
              },
              {
                "input": { "num": 1234 },
                "expectedOutput": '4'
              },
              {
                "input": { "num": 9990 },
                "expectedOutput": '0'
              },
              {
                "input": { "num": 5 },
                "expectedOutput": '5'
              },
              {
                "input": { "num": 10000 },
                "expectedOutput": '0'
              }
            ]
          },
          {
            "description": '// Do not rename amount, use it as input for your program.\n// amount will be a positive integer representing total rupees.\n// While testing we will change its value.\nconst amount = 1847;\n\n// Break down the amount into 500, 100, 50, and remaining rupees\n// Calculate how many 500 notes, then from remainder how many 100 notes,\n// then from that remainder how many 50 notes, and finally the remaining amount\n// Print all four values in order\n// For example, if amount = 1847, your output should be:\n// 3\n// 3\n// 0\n// 47',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "amount": 1847 },
                "expectedOutput": '3\n3\n0\n47'
              },
              {
                "input": { "amount": 2750 },
                "expectedOutput": '5\n2\n1\n0'
              },
              {
                "input": { "amount": 649 },
                "expectedOutput": '1\n1\n0\n49'
              },
              {
                "input": { "amount": 25 },
                "expectedOutput": '0\n0\n0\n25'
              },
              {
                "input": { "amount": 500 },
                "expectedOutput": '1\n0\n0\n0'
              },
              {
                "input": { "amount": 3999 },
                "expectedOutput": '7\n4\n1\n49'
              }
            ]
          },
          {
            "description": '// Do not rename num, use it as input for your program.\n// While testing we will change its value.\nconst num = 47;\n\n// Calculate the remainder when num is divided by 2\n// Print the remainder (0 for even, 1 for odd)\n// For example, if num = 47, your output should be:\n// 1',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "num": 47 },
                "expectedOutput": '1'
              },
              {
                "input": { "num": 100 },
                "expectedOutput": '0'
              },
              {
                "input": { "num": 89 },
                "expectedOutput": '1'
              },
              {
                "input": { "num": 0 },
                "expectedOutput": '0'
              },
              {
                "input": { "num": 1 },
                "expectedOutput": '1'
              },
              {
                "input": { "num": 1000 },
                "expectedOutput": '0'
              }
            ]
          },
          {
            "description": '// Do not rename num, use it as input for your program.\n// num will be a two-digit number.\n// While testing we will change its value.\nconst num = 73;\n\n// Reverse the digits and print the reversed number\n// Extract tens and units digits, then form reversed number\n// For example, if num = 73, your output should be:\n// 37',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "num": 73 },
                "expectedOutput": '37'
              },
              {
                "input": { "num": 45 },
                "expectedOutput": '54'
              },
              {
                "input": { "num": 91 },
                "expectedOutput": '19'
              },
              {
                "input": { "num": 10 },
                "expectedOutput": '1'
              },
              {
                "input": { "num": 99 },
                "expectedOutput": '99'
              },
              {
                "input": { "num": 20 },
                "expectedOutput": '2'
              }
            ]
          },
          {
            "description": '// Do not rename principal and rate, use them as input for your program.\n// While testing we will change their values.\nconst principal = 10000;\nconst rate = 8;\n\n// Calculate the amount after 1 year with compound interest\n// Formula: principal * (1 + rate/100)\n// Print the final amount\n// For example, if principal = 10000 and rate = 8, your output should be:\n// 10800',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "principal": 10000, "rate": 8 },
                "expectedOutput": '10800'
              },
              {
                "input": { "principal": 5000, "rate": 10 },
                "expectedOutput": '5500'
              },
              {
                "input": { "principal": 20000, "rate": 5 },
                "expectedOutput": '21000'
              },
              {
                "input": { "principal": 1000, "rate": 0 },
                "expectedOutput": '1000'
              },
              {
                "input": { "principal": 15000, "rate": 12 },
                "expectedOutput": '16800'
              }
            ]
          },
          {
            "description": '// Do not rename a, b, c, d, use them as input for your program.\n// While testing we will change their values.\nconst a = 10;\nconst b = 5;\nconst c = 3;\nconst d = 2;\n\n// Calculate: a + b * c - d\n// Then calculate: (a + b) * (c - d)\n// Print both results\n// For example, if a = 10, b = 5, c = 3, d = 2, your output should be:\n// 23\n// 15',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "a": 10, "b": 5, "c": 3, "d": 2 },
                "expectedOutput": '23\n15'
              },
              {
                "input": { "a": 20, "b": 4, "c": 5, "d": 3 },
                "expectedOutput": '37\n48'
              },
              {
                "input": { "a": 8, "b": 6, "c": 2, "d": 1 },
                "expectedOutput": '19\n14'
              },
              {
                "input": { "a": 0, "b": 0, "c": 0, "d": 0 },
                "expectedOutput": '0\n0'
              },
              {
                "input": { "a": 100, "b": 10, "c": 2, "d": 1 },
                "expectedOutput": '119\n110'
              },
              {
                "input": { "a": 5, "b": 3, "c": 3, "d": 3 },
                "expectedOutput": '11\n0'
              }
            ]
          },
          {
            "description": '// Do not rename hours, minutes, seconds, use them as input for your program.\n// While testing we will change their values.\nconst hours = 2;\nconst minutes = 15;\nconst seconds = 30;\n\n// Convert the total time to seconds\n// 1 hour = 3600 seconds, 1 minute = 60 seconds\n// Print total seconds\n// For example, if hours = 2, minutes = 15, seconds = 30, your output should be:\n// 8130',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "hours": 2, "minutes": 15, "seconds": 30 },
                "expectedOutput": '8130'
              },
              {
                "input": { "hours": 1, "minutes": 0, "seconds": 0 },
                "expectedOutput": '3600'
              },
              {
                "input": { "hours": 0, "minutes": 45, "seconds": 20 },
                "expectedOutput": '2720'
              },
              {
                "input": { "hours": 0, "minutes": 0, "seconds": 0 },
                "expectedOutput": '0'
              },
              {
                "input": { "hours": 24, "minutes": 0, "seconds": 0 },
                "expectedOutput": '86400'
              },
              {
                "input": { "hours": 0, "minutes": 1, "seconds": 1 },
                "expectedOutput": '61'
              }
            ]
          },
          {
            "description": '// Do not rename radius, use it as input for your program.\n// While testing we will change its value.\nconst radius = 7;\n\n// Calculate the area of a circle: π * radius * radius\n// Use 3.14159 as the value of π\n// Print the area\n// For example, if radius = 7, your output should be:\n// 153.93804',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "radius": 7 },
                "expectedOutput": '153.93804'
              },
              {
                "input": { "radius": 10 },
                "expectedOutput": '314.159'
              },
              {
                "input": { "radius": 5 },
                "expectedOutput": '78.53975'
              },
              {
                "input": { "radius": 1 },
                "expectedOutput": '3.14159'
              },
              {
                "input": { "radius": 0 },
                "expectedOutput": '0'
              },
              {
                "input": { "radius": 100 },
                "expectedOutput": '31415.9'
              }
            ]
          },
          {
            "description": '// Do not rename num, use it as input for your program.\n// num will be a three-digit number.\n// While testing we will change its value.\nconst num = 456;\n\n// Extract all three digits and calculate their sum\n// Use division and modulo operations\n// Print the sum of digits\n// For example, if num = 456, your output should be:\n// 15',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "num": 456 },
                "expectedOutput": '15'
              },
              {
                "input": { "num": 123 },
                "expectedOutput": '6'
              },
              {
                "input": { "num": 999 },
                "expectedOutput": '27'
              },
              {
                "input": { "num": 100 },
                "expectedOutput": '1'
              },
              {
                "input": { "num": 505 },
                "expectedOutput": '10'
              },
              {
                "input": { "num": 111 },
                "expectedOutput": '3'
              }
            ]
          },
          {
            "description": '// Do not rename costPrice and sellingPrice, use them as input for your program.\n// While testing we will change their values.\nconst costPrice = 850;\nconst sellingPrice = 1020;\n\n// Calculate the profit or loss amount (sellingPrice - costPrice)\n// Then calculate the profit/loss percentage: (difference / costPrice) * 100\n// Print the amount first, then the percentage\n// For example, if costPrice = 850 and sellingPrice = 1020, your output should be:\n// 170\n// 20',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "costPrice": 850, "sellingPrice": 1020 },
                "expectedOutput": '170\n20'
              },
              {
                "input": { "costPrice": 1000, "sellingPrice": 1200 },
                "expectedOutput": '200\n20'
              },
              {
                "input": { "costPrice": 500, "sellingPrice": 400 },
                "expectedOutput": '-100\n-20'
              },
              {
                "input": { "costPrice": 1000, "sellingPrice": 1000 },
                "expectedOutput": '0\n0'
              },
              {
                "input": { "costPrice": 200, "sellingPrice": 300 },
                "expectedOutput": '100\n50'
              },
              {
                "input": { "costPrice": 1500, "sellingPrice": 1200 },
                "expectedOutput": '-300\n-20'
              }
            ]
          },
          {
            "description": '// Do not rename n1, n2, n3, n4, n5, use them as input for your program.\n// While testing we will change their values.\nconst n1 = 23;\nconst n2 = 45;\nconst n3 = 67;\nconst n4 = 12;\nconst n5 = 89;\n\n// Calculate the sum of all five numbers\n// Calculate the average by dividing sum by 5\n// Print the average\n// For example, if numbers are 23, 45, 67, 12, 89, your output should be:\n// 47.2',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "n1": 23, "n2": 45, "n3": 67, "n4": 12, "n5": 89 },
                "expectedOutput": '47.2'
              },
              {
                "input": { "n1": 10, "n2": 20, "n3": 30, "n4": 40, "n5": 50 },
                "expectedOutput": '30'
              },
              {
                "input": { "n1": 100, "n2": 200, "n3": 300, "n4": 400, "n5": 500 },
                "expectedOutput": '300'
              },
              {
                "input": { "n1": 0, "n2": 0, "n3": 0, "n4": 0, "n5": 0 },
                "expectedOutput": '0'
              },
              {
                "input": { "n1": 5, "n2": 5, "n3": 5, "n4": 5, "n5": 5 },
                "expectedOutput": '5'
              },
              {
                "input": { "n1": -10, "n2": 10, "n3": 20, "n4": 30, "n5": 50 },
                "expectedOutput": '20'
              }
            ]
          },
          {
            "description": '// Do not rename weight and height, use them as input for your program.\n// weight is in kilograms, height is in meters.\n// While testing we will change their values.\nconst weight = 70;\nconst height = 1.75;\n\n// Calculate BMI: weight / (height * height)\n// Print the BMI value\n// For example, if weight = 70 and height = 1.75, your output should be:\n// 22.857142857142858',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "weight": 70, "height": 1.75 },
                "expectedOutput": '22.857142857142858'
              },
              {
                "input": { "weight": 80, "height": 1.8 },
                "expectedOutput": '24.691358024691358'
              },
              {
                "input": { "weight": 60, "height": 1.65 },
                "expectedOutput": '22.038567493112947'
              },
              {
                "input": { "weight": 100, "height": 2.0 },
                "expectedOutput": '25'
              },
              {
                "input": { "weight": 50, "height": 1.5 },
                "expectedOutput": '22.22222222222222'
              },
              {
                "input": { "weight": 90, "height": 1.9 },
                "expectedOutput": '24.930747922437675'
              }
            ]
          }
        ]
      },
      {
        "id": 'built-in-math-utilities',
        "title": 'Built-in Math Utilities',
        "outcomes": [
          'The Math Object: Static Utilities for Computation',
          'Rounding Logic: Math.round() vs. Math.trunc()',
          'Directional Rounding: Math.floor() and Math.ceil()',
          'Absolute Values and Distance: Math.abs()',
          'Powers and Roots: Math.pow() and Math.sqrt()',
          'Boundary Logic: Finding Math.min() and Math.max()',
          'Stochastic Logic: Generating Math.random()',
          'Formula Design: Scaling Random Numbers to a Range',
          'Mathematical Constants: Math.PI and Math.E'
        ],
        "tasks": [
          {
            "description": '// Do not rename num, use it as input for your program.\n// While testing we will change its value.\nconst num = 47.6;\n\n// Apply different rounding methods and print the results\n// Print round, floor, ceil, trunc of num in order\n// For example, if num = 47.6, your output should be:\n// 48\n// 47\n// 48\n// 47',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "num": 47.6 },
                "expectedOutput": '48\n47\n48\n47'
              },
              {
                "input": { "num": -47.6 },
                "expectedOutput": '-48\n-48\n-47\n-47'
              },
              {
                "input": { "num": 12.3 },
                "expectedOutput": '12\n12\n13\n12'
              },
              {
                "input": { "num": 99.9 },
                "expectedOutput": '100\n99\n100\n99'
              },
              {
                "input": { "num": 0.5 },
                "expectedOutput": '1\n0\n1\n0'
              },
              {
                "input": { "num": -0.5 },
                "expectedOutput": '-0\n-1\n-0\n-0'
              }
            ]
          },
          {
            "description": '// Do not rename x1, y1, x2, y2, use them as input for your program.\n// While testing we will change their values.\nconst x1 = 3;\nconst y1 = 4;\nconst x2 = 7;\nconst y2 = 1;\n\n// Calculate the distance between points (x1, y1) and (x2, y2)\n// Distance formula: √[(x2-x1)² + (y2-y1)²]\n// Print the distance\n// For example, if points are (3,4) and (7,1), your output should be:\n// 5',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "x1": 3, "y1": 4, "x2": 7, "y2": 1 },
                "expectedOutput": '5'
              },
              {
                "input": { "x1": 0, "y1": 0, "x2": 3, "y2": 4 },
                "expectedOutput": '5'
              },
              {
                "input": { "x1": 1, "y1": 1, "x2": 4, "y2": 5 },
                "expectedOutput": '5'
              },
              {
                "input": { "x1": 0, "y1": 0, "x2": 0, "y2": 0 },
                "expectedOutput": '0'
              },
              {
                "input": { "x1": -2, "y1": -3, "x2": 1, "y2": 1 },
                "expectedOutput": '5'
              },
              {
                "input": { "x1": 5, "y1": 5, "x2": 5, "y2": 10 },
                "expectedOutput": '5'
              }
            ]
          },
          {
            "description": '// Do not rename num, use it as input for your program.\n// num will be a positive integer.\n// While testing we will change its value.\nconst num = 144;\n\n// Find the square root of num\n// Verify by squaring the result\n// Print the square root, then the squared verification\n// For example, if num = 144, your output should be:\n// 12\n// 144',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "num": 144 },
                "expectedOutput": '12\n144'
              },
              {
                "input": { "num": 64 },
                "expectedOutput": '8\n64'
              },
              {
                "input": { "num": 1 },
                "expectedOutput": '1\n1'
              },
              {
                "input": { "num": 100 },
                "expectedOutput": '10\n100'
              },
              {
                "input": { "num": 625 },
                "expectedOutput": '25\n625'
              },
              {
                "input": { "num": 10000 },
                "expectedOutput": '100\n10000'
              }
            ]
          },
          {
            "description": '// Do not rename a, b, c, d, e, use them as input for your program.\n// While testing we will change their values.\nconst a = 45;\nconst b = 23;\nconst c = 89;\nconst d = 12;\nconst e = 67;\n\n// Find minimum, maximum, and range (max - min)\n// Print min, max, range in order\n// For example, if numbers are 45, 23, 89, 12, 67, your output should be:\n// 12\n// 89\n// 77',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "a": 45, "b": 23, "c": 89, "d": 12, "e": 67 },
                "expectedOutput": '12\n89\n77'
              },
              {
                "input": { "a": 10, "b": 20, "c": 30, "d": 40, "e": 50 },
                "expectedOutput": '10\n50\n40'
              },
              {
                "input": { "a": 100, "b": 100, "c": 100, "d": 100, "e": 100 },
                "expectedOutput": '100\n100\n0'
              },
              {
                "input": { "a": -10, "b": -5, "c": 0, "d": 5, "e": 10 },
                "expectedOutput": '-10\n10\n20'
              },
              {
                "input": { "a": 1, "b": 2, "c": 3, "d": 4, "e": 5 },
                "expectedOutput": '1\n5\n4'
              },
              {
                "input": { "a": 999, "b": 1, "c": 500, "d": 250, "e": 750 },
                "expectedOutput": '1\n999\n998'
              }
            ]
          },
          {
            "description": '// Do not rename radius, use it as input for your program.\n// While testing we will change its value.\nconst radius = 7;\n\n// Calculate circumference and area of a circle\n// Circumference = 2πr, Area = πr²\n// Print circumference, then area\n// For example, if radius = 7, your output should be:\n// 43.982297150257104\n// 153.93804002589985',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "radius": 7 },
                "expectedOutput": '43.982297150257104\n153.93804002589985'
              },
              {
                "input": { "radius": 10 },
                "expectedOutput": '62.83185307179586\n314.1592653589793'
              },
              {
                "input": { "radius": 1 },
                "expectedOutput": '6.283185307179586\n3.141592653589793'
              },
              {
                "input": { "radius": 5 },
                "expectedOutput": '31.41592653589793\n78.53981633974483'
              },
              {
                "input": { "radius": 0 },
                "expectedOutput": '0\n0'
              },
              {
                "input": { "radius": 100 },
                "expectedOutput": '628.3185307179587\n31415.926535897932'
              }
            ]
          },
          {
            "description": '// Do not rename a, b, c, use them as input for your program.\n// While testing we will change their values.\nconst a = 15;\nconst b = 25;\nconst c = 10;\n\n// Calculate absolute difference between a and b\n// Then calculate absolute difference between that result and c\n// Print both absolute differences\n// For example, if a = 15, b = 25, c = 10, your output should be:\n// 10\n// 0',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "a": 15, "b": 25, "c": 10 },
                "expectedOutput": '10\n0'
              },
              {
                "input": { "a": 50, "b": 20, "c": 15 },
                "expectedOutput": '30\n15'
              },
              {
                "input": { "a": 100, "b": 100, "c": 0 },
                "expectedOutput": '0\n0'
              },
              {
                "input": { "a": -10, "b": 10, "c": 20 },
                "expectedOutput": '20\n0'
              },
              {
                "input": { "a": 7, "b": 3, "c": 2 },
                "expectedOutput": '4\n2'
              },
              {
                "input": { "a": 0, "b": 0, "c": 0 },
                "expectedOutput": '0\n0'
              }
            ]
          },
          {
            "description": '// Do not rename principal, rate, time, use them as input for your program.\n// While testing we will change their values.\nconst principal = 1000;\nconst rate = 5;\nconst time = 3;\n\n// Calculate final amount with compound interest\n// Amount = principal × (1 + rate/100)^time\n// Print the final amount\n// For example, if principal = 1000, rate = 5, time = 3, your output should be:\n// 1157.625',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "principal": 1000, "rate": 5, "time": 3 },
                "expectedOutput": '1157.625'
              },
              {
                "input": { "principal": 5000, "rate": 10, "time": 2 },
                "expectedOutput": '6050'
              },
              {
                "input": { "principal": 2000, "rate": 8, "time": 5 },
                "expectedOutput": '2938.6561536'
              },
              {
                "input": { "principal": 10000, "rate": 0, "time": 10 },
                "expectedOutput": '10000'
              },
              {
                "input": { "principal": 1500, "rate": 6, "time": 1 },
                "expectedOutput": '1590'
              },
              {
                "input": { "principal": 3000, "rate": 12, "time": 4 },
                "expectedOutput": '4722.04364800000'
              }
            ]
          },
          {
            "description": '// Do not rename temp1, temp2, temp3, temp4, temp5, use them as input for your program.\n// While testing we will change their values.\nconst temp1 = 23.5;\nconst temp2 = 19.8;\nconst temp3 = 27.3;\nconst temp4 = 15.2;\nconst temp5 = 21.9;\n\n// Find minimum temperature, maximum temperature, and average\n// Round the average to 2 decimal places\n// Print min, max, rounded average in order\n// For example, if temps are 23.5, 19.8, 27.3, 15.2, 21.9, your output should be:\n// 15.2\n// 27.3\n// 21.54',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "temp1": 23.5, "temp2": 19.8, "temp3": 27.3, "temp4": 15.2, "temp5": 21.9 },
                "expectedOutput": '15.2\n27.3\n21.54'
              },
              {
                "input": { "temp1": 10, "temp2": 20, "temp3": 30, "temp4": 40, "temp5": 50 },
                "expectedOutput": '10\n50\n30'
              },
              {
                "input": { "temp1": 25.5, "temp2": 25.5, "temp3": 25.5, "temp4": 25.5, "temp5": 25.5 },
                "expectedOutput": '25.5\n25.5\n25.5'
              },
              {
                "input": { "temp1": -10, "temp2": -5, "temp3": 0, "temp4": 5, "temp5": 10 },
                "expectedOutput": '-10\n10\n0'
              },
              {
                "input": { "temp1": 32.14, "temp2": 28.76, "temp3": 35.89, "temp4": 30.12, "temp5": 33.55 },
                "expectedOutput": '28.76\n35.89\n32.09'
              },
              {
                "input": { "temp1": 0, "temp2": 0, "temp3": 0, "temp4": 0, "temp5": 1 },
                "expectedOutput": '0\n1\n0.2'
              }
            ]
          },
          {
            "description": '// Do not rename a, b, use them as input for your program.\n// a and b are the two legs of a right triangle.\n// While testing we will change their values.\nconst a = 3;\nconst b = 4;\n\n// Calculate the hypotenuse of the right triangle\n// Pythagorean theorem: c = √(a² + b²)\n// Print the hypotenuse\n// For example, if a = 3 and b = 4, your output should be:\n// 5',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "a": 3, "b": 4 },
                "expectedOutput": '5'
              },
              {
                "input": { "a": 5, "b": 12 },
                "expectedOutput": '13'
              },
              {
                "input": { "a": 8, "b": 15 },
                "expectedOutput": '17'
              },
              {
                "input": { "a": 1, "b": 1 },
                "expectedOutput": '1.4142135623730951'
              },
              {
                "input": { "a": 6, "b": 8 },
                "expectedOutput": '10'
              },
              {
                "input": { "a": 9, "b": 12 },
                "expectedOutput": '15'
              }
            ]
          },
          {
            "description": '// Do not rename dividend, divisor, use them as input for your program.\n// While testing we will change their values.\nconst dividend = 47;\nconst divisor = 6;\n\n// Divide dividend by divisor\n// Print the result rounded down, then rounded up\n// For example, if dividend = 47 and divisor = 6, your output should be:\n// 7\n// 8',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "dividend": 47, "divisor": 6 },
                "expectedOutput": '7\n8'
              },
              {
                "input": { "dividend": 100, "divisor": 3 },
                "expectedOutput": '33\n34'
              },
              {
                "input": { "dividend": 50, "divisor": 5 },
                "expectedOutput": '10\n10'
              },
              {
                "input": { "dividend": 7, "divisor": 2 },
                "expectedOutput": '3\n4'
              },
              {
                "input": { "dividend": 1, "divisor": 10 },
                "expectedOutput": '0\n1'
              },
              {
                "input": { "dividend": 999, "divisor": 100 },
                "expectedOutput": '9\n10'
              }
            ]
          },
          {
            "description": '// Do not rename radius, use it as input for your program.\n// While testing we will change its value.\nconst radius = 5;\n\n// Calculate the volume of a sphere\n// Volume = (4/3) × π × radius³\n// Print the volume\n// For example, if radius = 5, your output should be:\n// 523.5987755982989',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "radius": 5 },
                "expectedOutput": '523.5987755982989'
              },
              {
                "input": { "radius": 10 },
                "expectedOutput": '4188.790204786391'
              },
              {
                "input": { "radius": 1 },
                "expectedOutput": '4.1887902047863905'
              },
              {
                "input": { "radius": 3 },
                "expectedOutput": '113.09733552923255'
              },
              {
                "input": { "radius": 0 },
                "expectedOutput": '0'
              },
              {
                "input": { "radius": 7 },
                "expectedOutput": '1436.755040241732'
              }
            ]
          },
          {
            "description": '// Do not rename base, exponent, use them as input for your program.\n// While testing we will change their values.\nconst base = 2;\nconst exponent = 10;\n\n// Calculate base raised to the power of exponent\n// Then calculate the exponent-th root of the result to verify\n// Print the power result, then the root verification\n// For example, if base = 2 and exponent = 10, your output should be:\n// 1024\n// 2',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "base": 2, "exponent": 10 },
                "expectedOutput": '1024\n2'
              },
              {
                "input": { "base": 3, "exponent": 4 },
                "expectedOutput": '81\n3'
              },
              {
                "input": { "base": 5, "exponent": 3 },
                "expectedOutput": '125\n5'
              },
              {
                "input": { "base": 10, "exponent": 2 },
                "expectedOutput": '100\n10'
              },
              {
                "input": { "base": 2, "exponent": 5 },
                "expectedOutput": '32\n2'
              },
              {
                "input": { "base": 4, "exponent": 3 },
                "expectedOutput": '64\n4'
              }
            ]
          },
          {
            "description": '// Do not rename num, use it as input for your program.\n// While testing we will change its value.\nconst num = 27;\n\n// Calculate the cube root of num\n// Cube root is the same as raising to power (1/3)\n// Print the cube root\n// For example, if num = 27, your output should be:\n// 3',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "num": 27 },
                "expectedOutput": '3'
              },
              {
                "input": { "num": 64 },
                "expectedOutput": '4'
              },
              {
                "input": { "num": 125 },
                "expectedOutput": '5'
              },
              {
                "input": { "num": 1 },
                "expectedOutput": '1'
              },
              {
                "input": { "num": 8 },
                "expectedOutput": '2'
              },
              {
                "input": { "num": 1000 },
                "expectedOutput": '10'
              }
            ]
          },
          {
            "description": '// Do not rename initial, growthRate, periods, use them as input for your program.\n// While testing we will change their values.\nconst initial = 100;\nconst growthRate = 1.5;\nconst periods = 4;\n\n// Calculate value after exponential growth\n// Final = initial × (growthRate)^periods\n// Print the final value\n// For example, if initial = 100, growthRate = 1.5, periods = 4, your output should be:\n// 506.25',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "initial": 100, "growthRate": 1.5, "periods": 4 },
                "expectedOutput": '506.25'
              },
              {
                "input": { "initial": 200, "growthRate": 2, "periods": 3 },
                "expectedOutput": '1600'
              },
              {
                "input": { "initial": 50, "growthRate": 1.1, "periods": 5 },
                "expectedOutput": '80.52550000000001'
              },
              {
                "input": { "initial": 1000, "growthRate": 1, "periods": 10 },
                "expectedOutput": '1000'
              },
              {
                "input": { "initial": 150, "growthRate": 1.25, "periods": 6 },
                "expectedOutput": '572.204589843750'
              },
              {
                "input": { "initial": 500, "growthRate": 0.5, "periods": 2 },
                "expectedOutput": '125'
              }
            ]
          },
          {
            "description": '// Do not rename a, b, c, use them as input for your program.\n// a, b, c are the three sides of a triangle.\n// While testing we will change their values.\nconst a = 5;\nconst b = 6;\nconst c = 7;\n\n// Calculate the area using Heron\'s formula\n// s = (a + b + c) / 2\n// Area = √[s(s-a)(s-b)(s-c)]\n// Print the area\n// For example, if sides are 5, 6, 7, your output should be:\n// 14.696938456699069',
            "solution_type": 'script',
            "testCases": [
              {
                "input": { "a": 5, "b": 6, "c": 7 },
                "expectedOutput": '14.696938456699069'
              },
              {
                "input": { "a": 3, "b": 4, "c": 5 },
                "expectedOutput": '6'
              },
              {
                "input": { "a": 13, "b": 14, "c": 15 },
                "expectedOutput": '84'
              },
              {
                "input": { "a": 7, "b": 8, "c": 9 },
                "expectedOutput": '26.832815729997478'
              },
              {
                "input": { "a": 10, "b": 10, "c": 10 },
                "expectedOutput": '43.30127018922193'
              },
              {
                "input": { "a": 6, "b": 8, "c": 10 },
                "expectedOutput": '24'
              }
            ]
          }
        ]
      },
      {
        "id": "undefined-null-basics",
        "title": "Understanding Undefined and Null",
        "outcomes": [
          "The concept of Uninitialized Memory: undefined",
          "Intentional Absence of Value: null",
          "Logical Comparison: undefined vs. null",
          "Using the typeof operator for type inspection"
        ],
        "tasks": [
          {
            "description": "// Do not rename a, b, c, d, use them as input for your program.\n// While testing we will change their values.\nconst a = undefined;\nconst b = null;\nconst c = 42;\nconst d = \"hello\";\n\n// Print the type of each variable using typeof\n// For example, if a = undefined, b = null, c = 42, d = \"hello\", your output should be:\n// undefined\n// object\n// number\n// string",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "a": null, "b": null, "c": 42, "d": "hello" },
                "expectedOutput": "object\nobject\nnumber\nstring"
              },
              {
                "input": { "a": null, "b": null, "c": 100, "d": "world" },
                "expectedOutput": "object\nobject\nnumber\nstring"
              },
              {
                "input": { "a": null, "b": null, "c": 0, "d": "" },
                "expectedOutput": "object\nobject\nnumber\nstring"
              },
              {
                "input": { "a": null, "b": null, "c": -50, "d": "test" },
                "expectedOutput": "object\nobject\nnumber\nstring"
              },
              {
                "input": { "a": null, "b": null, "c": 3.14, "d": "JavaScript" },
                "expectedOutput": "object\nobject\nnumber\nstring"
              }
            ]
          }
        ]
      },
      {
        "id": "strings-and-basic-operations",
        "title": "Strings and Basic Operations",
        "outcomes": [
          "String Creation: Character Sequences in Memory",
          "The length Property: Measuring Sequence Size",
          "Zero-based Indexing: Accessing Specific Characters",
          "Dynamic Access: Calculating the Last Character Index",
          "Concatenation: Merging Sequences",
          "Case Transformation: toUpperCase and toLowerCase Methods",
          "Method Chaining: Combining Operations in a Single Line"
        ],
        "tasks": [
          {
            "description": "// Do not rename str, use it as input for your program.\n// While testing we will change its value.\nconst str = \"JavaScript\";\n\n// Print the length of the string\n// For example, if str = \"JavaScript\", your output should be:\n// 10",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "JavaScript" },
                "expectedOutput": "10"
              },
              {
                "input": { "str": "Programming" },
                "expectedOutput": "11"
              },
              {
                "input": { "str": "Code" },
                "expectedOutput": "4"
              },
              {
                "input": { "str": "" },
                "expectedOutput": "0"
              },
              {
                "input": { "str": "A" },
                "expectedOutput": "1"
              },
              {
                "input": { "str": "Development" },
                "expectedOutput": "11"
              }
            ]
          },
          {
            "description": "// Do not rename word, use it as input for your program.\n// While testing we will change its value.\nconst word = \"Programming\";\n\n// Print the first character and the last character\n// For example, if word = \"Programming\", your output should be:\n// P\n// g",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "word": "Programming" },
                "expectedOutput": "P\ng"
              },
              {
                "input": { "word": "JavaScript" },
                "expectedOutput": "J\nt"
              },
              {
                "input": { "word": "Code" },
                "expectedOutput": "C\ne"
              },
              {
                "input": { "word": "A" },
                "expectedOutput": "A\nA"
              },
              {
                "input": { "word": "Algorithm" },
                "expectedOutput": "A\nm"
              },
              {
                "input": { "word": "Function" },
                "expectedOutput": "F\nn"
              }
            ]
          },
          {
            "description": "// Do not rename firstName and lastName, use them as input for your program.\n// While testing we will change their values.\nconst firstName = \"John\";\nconst lastName = \"Smith\";\n\n// Create and print: \"firstName lastName\" and \"lastName, firstName\"\n// For example, if firstName = \"John\" and lastName = \"Smith\", your output should be:\n// John Smith\n// Smith, John",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "firstName": "John", "lastName": "Smith" },
                "expectedOutput": "John Smith\nSmith, John"
              },
              {
                "input": { "firstName": "Alice", "lastName": "Johnson" },
                "expectedOutput": "Alice Johnson\nJohnson, Alice"
              },
              {
                "input": { "firstName": "Bob", "lastName": "Brown" },
                "expectedOutput": "Bob Brown\nBrown, Bob"
              },
              {
                "input": { "firstName": "Emma", "lastName": "Davis" },
                "expectedOutput": "Emma Davis\nDavis, Emma"
              },
              {
                "input": { "firstName": "Michael", "lastName": "Wilson" },
                "expectedOutput": "Michael Wilson\nWilson, Michael"
              },
              {
                "input": { "firstName": "Sarah", "lastName": "Lee" },
                "expectedOutput": "Sarah Lee\nLee, Sarah"
              }
            ]
          },
          {
            "description": "// Do not rename text, use it as input for your program.\n// While testing we will change its value.\nconst text = \"Hello World\";\n\n// Transform to uppercase, then get its length\n// Print the uppercase version and its length\n// For example, if text = \"Hello World\", your output should be:\n// HELLO WORLD\n// 11",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "text": "Hello World" },
                "expectedOutput": "HELLO WORLD\n11"
              },
              {
                "input": { "text": "JavaScript" },
                "expectedOutput": "JAVASCRIPT\n10"
              },
              {
                "input": { "text": "programming" },
                "expectedOutput": "PROGRAMMING\n11"
              },
              {
                "input": { "text": "Code" },
                "expectedOutput": "CODE\n4"
              },
              {
                "input": { "text": "a" },
                "expectedOutput": "A\n1"
              },
              {
                "input": { "text": "Data Structure" },
                "expectedOutput": "DATA STRUCTURE\n14"
              }
            ]
          },
          {
            "description": "// Do not rename a, b, c, use them as input for your program.\n// While testing we will change their values.\nconst a = \"Data\";\nconst b = \"Base\";\nconst c = \"System\";\n\n// Create: a+b, b+c, and a+b+c\n// Print all three combinations\n// For example, if a = \"Data\", b = \"Base\", c = \"System\", your output should be:\n// DataBase\n// BaseSystem\n// DataBaseSystem",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "a": "Data", "b": "Base", "c": "System" },
                "expectedOutput": "DataBase\nBaseSystem\nDataBaseSystem"
              },
              {
                "input": { "a": "Web", "b": "App", "c": "Dev" },
                "expectedOutput": "WebApp\nAppDev\nWebAppDev"
              },
              {
                "input": { "a": "Java", "b": "Script", "c": "Code" },
                "expectedOutput": "JavaScript\nScriptCode\nJavaScriptCode"
              },
              {
                "input": { "a": "A", "b": "B", "c": "C" },
                "expectedOutput": "AB\nBC\nABC"
              },
              {
                "input": { "a": "Front", "b": "End", "c": "Framework" },
                "expectedOutput": "FrontEnd\nEndFramework\nFrontEndFramework"
              },
              {
                "input": { "a": "Open", "b": "Source", "c": "Project" },
                "expectedOutput": "OpenSource\nSourceProject\nOpenSourceProject"
              }
            ]
          },
          {
            "description": "// Do not rename str, use it as input for your program.\n// While testing we will change its value.\nconst str = \"Function\";\n\n// Print characters at positions 0, 2, 4, and 6\n// For example, if str = \"Function\", your output should be:\n// F\n// n\n// t\n// o",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "Function" },
                "expectedOutput": "F\nn\nt\no"
              },
              {
                "input": { "str": "Programming" },
                "expectedOutput": "P\no\nr\nm"
              },
              {
                "input": { "str": "JavaScript" },
                "expectedOutput": "J\nv\nS\nr"
              },
              {
                "input": { "str": "Algorithm" },
                "expectedOutput": "A\ng\nr\nt"
              },
              {
                "input": { "str": "Development" },
                "expectedOutput": "D\nv\nl\nm"
              },
              {
                "input": { "str": "Computer" },
                "expectedOutput": "C\nm\nu\ne"
              }
            ]
          },
          {
            "description": "// Do not rename str1 and str2, use them as input for your program.\n// While testing we will change their values.\nconst str1 = \"Computer\";\nconst str2 = \"Science\";\n\n// Calculate: length of str1, length of str2, sum of both lengths, difference of lengths\n// Print all four values\n// For example, if str1 = \"Computer\" and str2 = \"Science\", your output should be:\n// 8\n// 7\n// 15\n// 1",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str1": "Computer", "str2": "Science" },
                "expectedOutput": "8\n7\n15\n1"
              },
              {
                "input": { "str1": "JavaScript", "str2": "Programming" },
                "expectedOutput": "10\n11\n21\n1"
              },
              {
                "input": { "str1": "Web", "str2": "Development" },
                "expectedOutput": "3\n11\n14\n8"
              },
              {
                "input": { "str1": "Code", "str2": "Test" },
                "expectedOutput": "4\n4\n8\n0"
              },
              {
                "input": { "str1": "Algorithm", "str2": "Data" },
                "expectedOutput": "9\n4\n13\n5"
              },
              {
                "input": { "str1": "Function", "str2": "Variable" },
                "expectedOutput": "8\n8\n16\n0"
              }
            ]
          },
          {
            "description": "// Do not rename word, use it as input for your program.\n// While testing we will change its value.\nconst word = \"JavaScript\";\n\n// Print original, uppercase version, lowercase version, then length of uppercase\n// For example, if word = \"JavaScript\", your output should be:\n// JavaScript\n// JAVASCRIPT\n// javascript\n// 10",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "word": "JavaScript" },
                "expectedOutput": "JavaScript\nJAVASCRIPT\njavascript\n10"
              },
              {
                "input": { "word": "Programming" },
                "expectedOutput": "Programming\nPROGRAMMING\nprogramming\n11"
              },
              {
                "input": { "word": "Code" },
                "expectedOutput": "Code\nCODE\ncode\n4"
              },
              {
                "input": { "word": "Algorithm" },
                "expectedOutput": "Algorithm\nALGORITHM\nalgorithm\n9"
              },
              {
                "input": { "word": "Function" },
                "expectedOutput": "Function\nFUNCTION\nfunction\n8"
              },
              {
                "input": { "word": "Variable" },
                "expectedOutput": "Variable\nVARIABLE\nvariable\n8"
              }
            ]
          },
          {
            "description": "// Do not rename text, use it as input for your program.\n// While testing we will change its value.\nconst text = \"Algorithm\";\n\n// Extract characters at positions 0, 1, 2 and concatenate them\n// Then extract characters at positions 3, 4, 5 and concatenate them\n// Print both results\n// For example, if text = \"Algorithm\", your output should be:\n// Alg\n// ori",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "text": "Algorithm" },
                "expectedOutput": "Alg\nori"
              },
              {
                "input": { "text": "Programming" },
                "expectedOutput": "Pro\ngra"
              },
              {
                "input": { "text": "JavaScript" },
                "expectedOutput": "Jav\nasc"
              },
              {
                "input": { "text": "Function" },
                "expectedOutput": "Fun\nct"
              },
              {
                "input": { "text": "Computer" },
                "expectedOutput": "Com\nput"
              },
              {
                "input": { "text": "Development" },
                "expectedOutput": "Dev\nelo"
              }
            ]
          },
          {
            "description": "// Do not rename input, use it as input for your program.\n// While testing we will change its value.\nconst input = \"programming\";\n\n// Convert to uppercase, then concatenate with original lowercase version\n// Print the combined result and its total length\n// For example, if input = \"programming\", your output should be:\n// PROGRAMMINGprogramming\n// 22",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "input": "programming" },
                "expectedOutput": "PROGRAMMINGprogramming\n22"
              },
              {
                "input": { "input": "javascript" },
                "expectedOutput": "JAVASCRIPTjavascript\n20"
              },
              {
                "input": { "input": "code" },
                "expectedOutput": "CODEcode\n8"
              },
              {
                "input": { "input": "function" },
                "expectedOutput": "FUNCTIONfunction\n16"
              },
              {
                "input": { "input": "algorithm" },
                "expectedOutput": "ALGORITHMalgorithm\n18"
              },
              {
                "input": { "input": "variable" },
                "expectedOutput": "VARIABLEvariable\n16"
              }
            ]
          }
        ]
      },
      {
        "id": "type-coercion",
        "title": "Type Coercion",
        "outcomes": [
          "Introduction to Coercion: Automatic Type Switching",
          "Explicit vs. Implicit: Manual vs. Automatic conversion",
          "The String Bias: Coercion with the + operator",
          "Numeric Focus: Coercion with -, *, and / operators",
          "Boolean Logic: The Truthy and Falsy concept",
          "The \"Not-a-Number\" (NaN) behavior and traps",
          "Equality Logic: Type coercion in == vs. ===",
          "Safe Coding: Strategies to avoid implicit bugs"
        ],
        "tasks": [
          {
            "description": "// Do not rename num and str, use them as input for your program.\n// While testing we will change their values.\nconst num = 42;\nconst str = \"10\";\n\n// Calculate num + str, num - str, num * str\n// Print all three results\n// For example, if num = 42 and str = \"10\", your output should be:\n// 4210\n// 32\n// 420",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "num": 42, "str": "10" },
                "expectedOutput": "4210\n32\n420"
              },
              {
                "input": { "num": 15, "str": "5" },
                "expectedOutput": "155\n10\n75"
              },
              {
                "input": { "num": 100, "str": "20" },
                "expectedOutput": "10020\n80\n2000"
              },
              {
                "input": { "num": 7, "str": "3" },
                "expectedOutput": "73\n4\n21"
              },
              {
                "input": { "num": 0, "str": "8" },
                "expectedOutput": "08\n-8\n0"
              },
              {
                "input": { "num": 25, "str": "0" },
                "expectedOutput": "250\n25\n0"
              }
            ]
          },
          {
            "description": "// Do not rename flag1 and flag2, use them as input for your program.\n// While testing we will change their values.\nconst flag1 = true;\nconst flag2 = false;\n\n// Calculate flag1 + 5, flag2 + 5, flag1 * 10, flag2 * 10\n// Print all four results\n// For example, if flag1 = true and flag2 = false, your output should be:\n// 6\n// 5\n// 10\n// 0",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "flag1": true, "flag2": false },
                "expectedOutput": "6\n5\n10\n0"
              },
              {
                "input": { "flag1": false, "flag2": true },
                "expectedOutput": "5\n6\n0\n10"
              },
              {
                "input": { "flag1": true, "flag2": true },
                "expectedOutput": "6\n6\n10\n10"
              },
              {
                "input": { "flag1": false, "flag2": false },
                "expectedOutput": "5\n5\n0\n0"
              }
            ]
          },
          {
            "description": "// Do not rename x and y, use them as input for your program.\n// While testing we will change their values.\nconst x = null;\nconst y = undefined;\n\n// Calculate x + 10, y + 10, x * 2, y * 2\n// Print all four results\n// For example, if x = null and y = undefined, your output should be:\n// 10\n// NaN\n// 0\n// NaN",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "x": null, "y": null },
                "expectedOutput": "10\n10\n0\n0"
              },
              {
                "input": { "x": null, "y": null },
                "expectedOutput": "10\n10\n0\n0"
              },
              {
                "input": { "x": null, "y": null },
                "expectedOutput": "10\n10\n0\n0"
              },
              {
                "input": { "x": null, "y": null },
                "expectedOutput": "10\n10\n0\n0"
              }
            ]
          },
          {
            "description": "// Do not rename val1 and val2, use them as input for your program.\n// While testing we will change their values.\nconst val1 = \"7\";\nconst val2 = \"3\";\n\n// Calculate val1 + val2, val1 - val2, val1 / val2\n// Print all three results\n// For example, if val1 = \"7\" and val2 = \"3\", your output should be:\n// 73\n// 4\n// 2.3333333333333335",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "val1": "7", "val2": "3" },
                "expectedOutput": "73\n4\n2.3333333333333335"
              },
              {
                "input": { "val1": "12", "val2": "4" },
                "expectedOutput": "124\n8\n3"
              },
              {
                "input": { "val1": "20", "val2": "5" },
                "expectedOutput": "205\n15\n4"
              },
              {
                "input": { "val1": "15", "val2": "2" },
                "expectedOutput": "152\n13\n7.5"
              },
              {
                "input": { "val1": "100", "val2": "10" },
                "expectedOutput": "10010\n90\n10"
              },
              {
                "input": { "val1": "8", "val2": "0" },
                "expectedOutput": "80\n8\nInfinity"
              }
            ]
          },
          {
            "description": "// Do not rename a, b, c, use them as input for your program.\n// While testing we will change their values.\nconst a = \"5\";\nconst b = 5;\nconst c = 0;\n\n// Calculate a == b, a === b, c == false, c === false\n// Print all four boolean results\n// For example, if a = \"5\", b = 5, c = 0, your output should be:\n// true\n// false\n// true\n// false",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "a": "5", "b": 5, "c": 0 },
                "expectedOutput": "true\nfalse\ntrue\nfalse"
              },
              {
                "input": { "a": "10", "b": 10, "c": 1 },
                "expectedOutput": "true\nfalse\nfalse\nfalse"
              },
              {
                "input": { "a": "0", "b": 0, "c": 0 },
                "expectedOutput": "true\nfalse\ntrue\nfalse"
              },
              {
                "input": { "a": "7", "b": 7, "c": 1 },
                "expectedOutput": "true\nfalse\ntrue\nfalse"
              },
              {
                "input": { "a": "3", "b": 3, "c": 0 },
                "expectedOutput": "true\nfalse\ntrue\nfalse"
              },
              {
                "input": { "a": "1", "b": 1, "c": 1 },
                "expectedOutput": "true\nfalse\ntrue\nfalse"
              }
            ]
          },
          {
            "description": "// Do not rename text, use it as input for your program.\n// While testing we will change its value.\nconst text = \"hello\";\n\n// Calculate text * 1, text - 0, text / 2\n// Print all three results\n// For example, if text = \"hello\", your output should be:\n// NaN\n// NaN\n// NaN",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "text": "hello" },
                "expectedOutput": "NaN\nNaN\nNaN"
              },
              {
                "input": { "text": "world" },
                "expectedOutput": "NaN\nNaN\nNaN"
              },
              {
                "input": { "text": "abc" },
                "expectedOutput": "NaN\nNaN\nNaN"
              },
              {
                "input": { "text": "test" },
                "expectedOutput": "NaN\nNaN\nNaN"
              },
              {
                "input": { "text": "javascript" },
                "expectedOutput": "NaN\nNaN\nNaN"
              },
              {
                "input": { "text": "code" },
                "expectedOutput": "NaN\nNaN\nNaN"
              }
            ]
          }
        ]
      },
      {
        "id": "operators-comparison-and-logical",
        "title": "Operators (Comparison & Logical)",
        "outcomes": [
          "Abstract vs. Strict Equality: == vs ===",
          "Relational Operators: >, <, >=, <=",
          "Logical Gates: AND (&&), OR (||), and NOT (!)",
          "Short-circuiting: How JS optimizes logical checks"
        ],
        "tasks": [
          {
            "description": "// Use a and b as input.\n// Print the result of (a == b) followed by (a === b).\nconst a = 10;\nconst b = \"10\";\n\n// For a = 10, b = \"10\", output:\n// true\n// false",
            "solution_type": "script",
            "testCases": [
              { "input": { "a": 10, "b": "10" }, "expectedOutput": "true\nfalse" },
              { "input": { "a": 0, "b": false }, "expectedOutput": "true\nfalse" },
              { "input": { "a": 1, "b": true }, "expectedOutput": "true\nfalse" }
            ]
          },
          {
            "description": "// Use x as input.\n// Use comparison and logical operators to check if x is between 50 and 100 (inclusive).\n// Print the boolean result.\nconst x = 75;\n\n// For x = 75, output: true",
            "solution_type": "script",
            "testCases": [
              { "input": { "x": 75 }, "expectedOutput": "true" },
              { "input": { "x": 50 }, "expectedOutput": "true" },
              { "input": { "x": 101 }, "expectedOutput": "false" },
              { "input": { "x": 49 }, "expectedOutput": "false" }
            ]
          },
          {
            "description": "// Use val as input.\n// Use the NOT (!) operator to print the opposite of the value's truthiness.\n// Then print the 'double NOT' (!!) to show its actual boolean value.\nconst val = \"Hello\";\n\n// For val = \"Hello\", output:\n// false\n// true",
            "solution_type": "script",
            "testCases": [
              { "input": { "val": "Hello" }, "expectedOutput": "false\ntrue" },
              { "input": { "val": "" }, "expectedOutput": "true\nfalse" },
              { "input": { "val": 0 }, "expectedOutput": "true\nfalse" }
            ]
          },
          {
            "description": "// Short-circuiting OR (||)\n// Print the value of (input || \"Default\").\n// This mimics assigning a fallback value without an if-statement.\nconst input = \"\";\n\n// For input = \"\", output: Default",
            "solution_type": "script",
            "testCases": [
              { "input": { "input": "" }, "expectedOutput": "Default" },
              { "input": { "input": "User123" }, "expectedOutput": "User123" },
              { "input": { "input": null }, "expectedOutput": "Default" }
            ]
          },
          {
            "description": "// Short-circuiting AND (&&)\n// Print the value of (isValid && \"Success\").\n// If isValid is false, it should print false. If true, it should print \"Success\".\nconst isValid = true;\n\n// For isValid = true, output: Success",
            "solution_type": "script",
            "testCases": [
              { "input": { "isValid": true }, "expectedOutput": "Success" },
              { "input": { "isValid": false }, "expectedOutput": "false" }
            ]
          },
          {
            "description": "// Relational Strings\n// Print the result of (str1 > str2).\n// This checks alphabetical (Unicode) priority.\nconst str1 = \"apple\";\nconst str2 = \"banana\";\n\n// For \"apple\" > \"banana\", output: false",
            "solution_type": "script",
            "testCases": [
              { "input": { "str1": "apple", "str2": "banana" }, "expectedOutput": "false" },
              { "input": { "str1": "cat", "str2": "can" }, "expectedOutput": "true" },
              { "input": { "str1": "Alpha", "str2": "alpha" }, "expectedOutput": "false" }
            ]
          },
          {
            "description": "// Multiple Logic Gates\n// Check if (a is even) AND (b is even).\n// Print the boolean result.\nconst a = 4;\nconst b = 8;\n\n// For 4 and 8, output: true",
            "solution_type": "script",
            "testCases": [
              { "input": { "a": 4, "b": 8 }, "expectedOutput": "true" },
              { "input": { "a": 3, "b": 8 }, "expectedOutput": "false" },
              { "input": { "a": 7, "b": 5 }, "expectedOutput": "false" }
            ]
          }
        ]
      },
      {
        "id": "if-statement",
        "title": "if Statement",
        "outcomes": [
          "The if Statement: Conditional Execution Syntax",
          "Code Blocks: Scope and the Curly Brace {}",
          "Condition Evaluation: Resolving Expressions to Booleans",
          "Truthy Execution: How non-booleans trigger branches"
        ],
        "tasks": [
          {
            "description": "// Do not rename age, use it as input for your program.\n// While testing we will change its value.\nconst age = 20;\n\n// Check if age is 18 or greater\n// If true, print: \"You are eligible to vote\"\n// If false, print nothing",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "age": 20 },
                "expectedOutput": "You are eligible to vote"
              },
              {
                "input": { "age": 18 },
                "expectedOutput": "You are eligible to vote"
              },
              {
                "input": { "age": 15 },
                "expectedOutput": ""
              },
              {
                "input": { "age": 0 },
                "expectedOutput": ""
              }
            ]
          },
          {
            "description": "// Do not rename number, use it as input for your program.\n// While testing we will change its value.\nconst number = 10;\n\n// Check if number is even (divisible by 2)\n// If true, print: \"Even number\"\n// If false, print nothing",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "number": 10 },
                "expectedOutput": "Even number"
              },
              {
                "input": { "number": 0 },
                "expectedOutput": "Even number"
              },
              {
                "input": { "number": 7 },
                "expectedOutput": ""
              },
              {
                "input": { "number": -4 },
                "expectedOutput": "Even number"
              }
            ]
          },
          {
            "description": "// Do not rename str, use it as input for your program.\n// While testing we will change its value.\nconst str = \"Hello\";\n\n// Check if the length of str is greater than 3\n// If true, print: \"Long string\"\n// If false, print nothing",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "Hello" },
                "expectedOutput": "Long string"
              },
              {
                "input": { "str": "Test" },
                "expectedOutput": "Long string"
              },
              {
                "input": { "str": "Hi" },
                "expectedOutput": ""
              },
              {
                "input": { "str": "Cat" },
                "expectedOutput": ""
              },
              {
                "input": { "str": "" },
                "expectedOutput": ""
              }
            ]
          },
          {
            "description": "// Do not rename a and b, use them as input for your program.\n// While testing we will change their values.\nconst a = 8;\nconst b = 12;\n\n// Check if both a and b are greater than 5\n// If true, print: \"Both numbers are large\"\n// If false, print nothing",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "a": 8, "b": 12 },
                "expectedOutput": "Both numbers are large"
              },
              {
                "input": { "a": 6, "b": 6 },
                "expectedOutput": "Both numbers are large"
              },
              {
                "input": { "a": 4, "b": 10 },
                "expectedOutput": ""
              },
              {
                "input": { "a": 10, "b": 3 },
                "expectedOutput": ""
              },
              {
                "input": { "a": 2, "b": 3 },
                "expectedOutput": ""
              }
            ]
          },
          {
            "description": "// Do not rename value, use it as input for your program.\n// While testing we will change its value.\nconst value = 0;\n\n// Check if value is truthy (not 0, not empty string, not null, not undefined, not false)\n// If true, print: \"Truthy value\"\n// If false, print nothing\n// Hint: You can use if (value) to check truthiness",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "value": 5 },
                "expectedOutput": "Truthy value"
              },
              {
                "input": { "value": "Hello" },
                "expectedOutput": "Truthy value"
              },
              {
                "input": { "value": 0 },
                "expectedOutput": ""
              },
              {
                "input": { "value": "" },
                "expectedOutput": ""
              },
              {
                "input": { "value": null },
                "expectedOutput": ""
              }
            ]
          },
          {
            "description": "// Do not rename x and y, use them as input for your program.\n// While testing we will change their values.\nconst x = 10;\nconst y = 20;\n\n// Check if the sum of x and y is greater than 25\n// If true, print: \"Sum is large\"\n// If false, print nothing",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "x": 10, "y": 20 },
                "expectedOutput": "Sum is large"
              },
              {
                "input": { "x": 15, "y": 15 },
                "expectedOutput": "Sum is large"
              },
              {
                "input": { "x": 10, "y": 15 },
                "expectedOutput": ""
              },
              {
                "input": { "x": 12, "y": 13 },
                "expectedOutput": ""
              },
              {
                "input": { "x": 13, "y": 13 },
                "expectedOutput": "Sum is large"
              }
            ]
          }
        ]
      },
      {
        "id": "if-else-statement",
        "title": "if...else Statement",
        "outcomes": [
          "The else Block: Defining the \"Otherwise\" Path",
          "Binary Logic: Designing Two-Way Decisions",
          "Mutual Exclusivity: Ensuring only one path executes"
        ],
        "tasks": [
          {
            "description": "// Do not rename number, use it as input for your program.\n// While testing we will change its value.\nconst number = 7;\n\n// Check if number is even or odd\n// If even, print: \"Even\"\n// Otherwise, print: \"Odd\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "number": 7 },
                "expectedOutput": "Odd"
              },
              {
                "input": { "number": 10 },
                "expectedOutput": "Even"
              },
              {
                "input": { "number": 0 },
                "expectedOutput": "Even"
              },
              {
                "input": { "number": -3 },
                "expectedOutput": "Odd"
              }
            ]
          },
          {
            "description": "// Do not rename age, use it as input for your program.\n// While testing we will change its value.\nconst age = 16;\n\n// Check if age is 18 or greater\n// If true, print: \"Adult\"\n// Otherwise, print: \"Minor\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "age": 16 },
                "expectedOutput": "Minor"
              },
              {
                "input": { "age": 18 },
                "expectedOutput": "Adult"
              },
              {
                "input": { "age": 25 },
                "expectedOutput": "Adult"
              },
              {
                "input": { "age": 0 },
                "expectedOutput": "Minor"
              }
            ]
          },
          {
            "description": "// Do not rename temperature, use it as input for your program.\n// While testing we will change its value.\nconst temperature = 15;\n\n// Check if temperature is greater than 25\n// If true, print: \"Hot\"\n// Otherwise, print: \"Cold\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "temperature": 15 },
                "expectedOutput": "Cold"
              },
              {
                "input": { "temperature": 30 },
                "expectedOutput": "Hot"
              },
              {
                "input": { "temperature": 25 },
                "expectedOutput": "Cold"
              },
              {
                "input": { "temperature": 26 },
                "expectedOutput": "Hot"
              }
            ]
          },
          {
            "description": "// Do not rename score, use it as input for your program.\n// While testing we will change its value.\nconst score = 45;\n\n// Check if score is 50 or greater\n// If true, print: \"Pass\"\n// Otherwise, print: \"Fail\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "score": 45 },
                "expectedOutput": "Fail"
              },
              {
                "input": { "score": 50 },
                "expectedOutput": "Pass"
              },
              {
                "input": { "score": 75 },
                "expectedOutput": "Pass"
              },
              {
                "input": { "score": 0 },
                "expectedOutput": "Fail"
              }
            ]
          },
          {
            "description": "// Do not rename num1 and num2, use them as input for your program.\n// While testing we will change their values.\nconst num1 = 15;\nconst num2 = 20;\n\n// Compare num1 and num2\n// If num1 is greater, print: \"First is larger\"\n// Otherwise, print: \"Second is larger or equal\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "num1": 15, "num2": 20 },
                "expectedOutput": "Second is larger or equal"
              },
              {
                "input": { "num1": 30, "num2": 20 },
                "expectedOutput": "First is larger"
              },
              {
                "input": { "num1": 10, "num2": 10 },
                "expectedOutput": "Second is larger or equal"
              },
              {
                "input": { "num1": 5, "num2": 3 },
                "expectedOutput": "First is larger"
              }
            ]
          },
          {
            "description": "// Do not rename year, use it as input for your program.\n// While testing we will change its value.\nconst year = 2023;\n\n// Check if year is divisible by 4 (simplified leap year check)\n// If true, print: \"Leap year\"\n// Otherwise, print: \"Not a leap year\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "year": 2023 },
                "expectedOutput": "Not a leap year"
              },
              {
                "input": { "year": 2024 },
                "expectedOutput": "Leap year"
              },
              {
                "input": { "year": 2020 },
                "expectedOutput": "Leap year"
              },
              {
                "input": { "year": 2021 },
                "expectedOutput": "Not a leap year"
              }
            ]
          },
          {
            "description": "// Do not rename str, use it as input for your program.\n// While testing we will change its value.\nconst str = \"Hello\";\n\n// Check if str has length greater than 5\n// If true, print: \"Long\"\n// Otherwise, print: \"Short\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "Hello" },
                "expectedOutput": "Short"
              },
              {
                "input": { "str": "JavaScript" },
                "expectedOutput": "Long"
              },
              {
                "input": { "str": "Hi" },
                "expectedOutput": "Short"
              },
              {
                "input": { "str": "Code!" },
                "expectedOutput": "Short"
              },
              {
                "input": { "str": "Python" },
                "expectedOutput": "Long"
              }
            ]
          }
        ]
      },
      {
        "id": "else-if-chains",
        "title": "else if Chains",
        "outcomes": [
          "The else if Syntax: Expanding Decision Branches",
          "Multi-state Logic: Handling more than two outcomes",
          "The Final else: Creating a Default Fallback",
          "Execution Flow: Why Condition Order Matters"
        ],
        "tasks": [
          {
            "description": "// Do not rename score, use it as input for your program.\n// While testing we will change its value.\nconst score = 75;\n\n// Check the grade based on score:\n// If score >= 90, print: \"A\"\n// Else if score >= 80, print: \"B\"\n// Else if score >= 70, print: \"C\"\n// Else if score >= 60, print: \"D\"\n// Otherwise, print: \"F\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "score": 75 },
                "expectedOutput": "C"
              },
              {
                "input": { "score": 95 },
                "expectedOutput": "A"
              },
              {
                "input": { "score": 85 },
                "expectedOutput": "B"
              },
              {
                "input": { "score": 60 },
                "expectedOutput": "D"
              },
              {
                "input": { "score": 55 },
                "expectedOutput": "F"
              },
              {
                "input": { "score": 90 },
                "expectedOutput": "A"
              }
            ]
          },
          {
            "description": "// Do not rename age, use it as input for your program.\n// While testing we will change its value.\nconst age = 25;\n\n// Categorize age group:\n// If age < 13, print: \"Child\"\n// Else if age < 20, print: \"Teenager\"\n// Else if age < 60, print: \"Adult\"\n// Otherwise, print: \"Senior\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "age": 25 },
                "expectedOutput": "Adult"
              },
              {
                "input": { "age": 10 },
                "expectedOutput": "Child"
              },
              {
                "input": { "age": 15 },
                "expectedOutput": "Teenager"
              },
              {
                "input": { "age": 65 },
                "expectedOutput": "Senior"
              },
              {
                "input": { "age": 13 },
                "expectedOutput": "Teenager"
              },
              {
                "input": { "age": 60 },
                "expectedOutput": "Senior"
              }
            ]
          },
          {
            "description": "// Do not rename temperature, use it as input for your program.\n// While testing we will change its value.\nconst temperature = 22;\n\n// Categorize the weather:\n// If temperature > 30, print: \"Hot\"\n// Else if temperature > 20, print: \"Warm\"\n// Else if temperature > 10, print: \"Cool\"\n// Otherwise, print: \"Cold\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "temperature": 22 },
                "expectedOutput": "Warm"
              },
              {
                "input": { "temperature": 35 },
                "expectedOutput": "Hot"
              },
              {
                "input": { "temperature": 15 },
                "expectedOutput": "Cool"
              },
              {
                "input": { "temperature": 5 },
                "expectedOutput": "Cold"
              },
              {
                "input": { "temperature": 30 },
                "expectedOutput": "Warm"
              },
              {
                "input": { "temperature": 31 },
                "expectedOutput": "Hot"
              }
            ]
          },
          {
            "description": "// Do not rename number, use it as input for your program.\n// While testing we will change its value.\nconst number = 0;\n\n// Classify the number:\n// If number > 0, print: \"Positive\"\n// Else if number < 0, print: \"Negative\"\n// Otherwise, print: \"Zero\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "number": 0 },
                "expectedOutput": "Zero"
              },
              {
                "input": { "number": 10 },
                "expectedOutput": "Positive"
              },
              {
                "input": { "number": -5 },
                "expectedOutput": "Negative"
              },
              {
                "input": { "number": 100 },
                "expectedOutput": "Positive"
              }
            ]
          },
          {
            "description": "// Do not rename dayNumber, use it as input for your program.\n// While testing we will change its value.\nconst dayNumber = 3;\n\n// Convert day number to day name:\n// If dayNumber === 1, print: \"Monday\"\n// Else if dayNumber === 2, print: \"Tuesday\"\n// Else if dayNumber === 3, print: \"Wednesday\"\n// Else if dayNumber === 4, print: \"Thursday\"\n// Else if dayNumber === 5, print: \"Friday\"\n// Else if dayNumber === 6, print: \"Saturday\"\n// Else if dayNumber === 7, print: \"Sunday\"\n// Otherwise, print: \"Invalid day\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "dayNumber": 3 },
                "expectedOutput": "Wednesday"
              },
              {
                "input": { "dayNumber": 1 },
                "expectedOutput": "Monday"
              },
              {
                "input": { "dayNumber": 7 },
                "expectedOutput": "Sunday"
              },
              {
                "input": { "dayNumber": 5 },
                "expectedOutput": "Friday"
              },
              {
                "input": { "dayNumber": 0 },
                "expectedOutput": "Invalid day"
              },
              {
                "input": { "dayNumber": 10 },
                "expectedOutput": "Invalid day"
              }
            ]
          },
          {
            "description": "// Do not rename hours, use it as input for your program.\n// While testing we will change its value.\nconst hours = 14;\n\n// Determine time of day:\n// If hours < 12, print: \"Morning\"\n// Else if hours < 17, print: \"Afternoon\"\n// Else if hours < 21, print: \"Evening\"\n// Otherwise, print: \"Night\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "hours": 14 },
                "expectedOutput": "Afternoon"
              },
              {
                "input": { "hours": 8 },
                "expectedOutput": "Morning"
              },
              {
                "input": { "hours": 18 },
                "expectedOutput": "Evening"
              },
              {
                "input": { "hours": 22 },
                "expectedOutput": "Night"
              },
              {
                "input": { "hours": 12 },
                "expectedOutput": "Afternoon"
              },
              {
                "input": { "hours": 0 },
                "expectedOutput": "Morning"
              }
            ]
          },
          {
            "description": "// Do not rename num, use it as input for your program.\n// While testing we will change its value.\nconst num = 15;\n\n// Check divisibility (order matters!):\n// If num is divisible by 15, print: \"Divisible by 15\"\n// Else if num is divisible by 5, print: \"Divisible by 5\"\n// Else if num is divisible by 3, print: \"Divisible by 3\"\n// Otherwise, print: \"Not divisible by 3, 5, or 15\"\n// Note: This demonstrates why condition order matters",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "num": 15 },
                "expectedOutput": "Divisible by 15"
              },
              {
                "input": { "num": 10 },
                "expectedOutput": "Divisible by 5"
              },
              {
                "input": { "num": 9 },
                "expectedOutput": "Divisible by 3"
              },
              {
                "input": { "num": 30 },
                "expectedOutput": "Divisible by 15"
              },
              {
                "input": { "num": 7 },
                "expectedOutput": "Not divisible by 3, 5, or 15"
              },
              {
                "input": { "num": 25 },
                "expectedOutput": "Divisible by 5"
              }
            ]
          },
          {
            "description": "// Do not rename price, use it as input for your program.\n// While testing we will change its value.\nconst price = 1500;\n\n// Determine discount category:\n// If price >= 2000, print: \"20% discount\"\n// Else if price >= 1000, print: \"10% discount\"\n// Else if price >= 500, print: \"5% discount\"\n// Otherwise, print: \"No discount\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "price": 1500 },
                "expectedOutput": "10% discount"
              },
              {
                "input": { "price": 2500 },
                "expectedOutput": "20% discount"
              },
              {
                "input": { "price": 750 },
                "expectedOutput": "5% discount"
              },
              {
                "input": { "price": 300 },
                "expectedOutput": "No discount"
              },
              {
                "input": { "price": 2000 },
                "expectedOutput": "20% discount"
              },
              {
                "input": { "price": 1000 },
                "expectedOutput": "10% discount"
              }
            ]
          }
        ]
      },
      {
        "id": "nested-conditions",
        "title": "Nested Conditions",
        "outcomes": [
          "Nested Structures: Decisions inside Decisions",
          "Execution Hierarchy: Outer vs. Inner Flow",
          "Dependency Logic: Managing Complex Conditional Trees"
        ],
        "tasks": [
          {
            "description": "// Do not rename age and hasLicense, use them as input for your program.\n// While testing we will change their values.\nconst age = 20;\nconst hasLicense = true;\n\n// Check if person can drive:\n// First check if age >= 18\n//   If true, then check if hasLicense is true\n//     If true, print: \"Can drive\"\n//     Otherwise, print: \"Has age but no license\"\n//   Otherwise, print: \"Too young to drive\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "age": 20, "hasLicense": true },
                "expectedOutput": "Can drive"
              },
              {
                "input": { "age": 20, "hasLicense": false },
                "expectedOutput": "Has age but no license"
              },
              {
                "input": { "age": 16, "hasLicense": true },
                "expectedOutput": "Too young to drive"
              },
              {
                "input": { "age": 16, "hasLicense": false },
                "expectedOutput": "Too young to drive"
              },
              {
                "input": { "age": 18, "hasLicense": true },
                "expectedOutput": "Can drive"
              }
            ]
          },
          {
            "description": "// Do not rename number, use it as input for your program.\n// While testing we will change its value.\nconst number = 12;\n\n// Check if number is positive and even:\n// First check if number > 0\n//   If true, then check if number is even (divisible by 2)\n//     If true, print: \"Positive even number\"\n//     Otherwise, print: \"Positive odd number\"\n//   Otherwise, print: \"Not positive\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "number": 12 },
                "expectedOutput": "Positive even number"
              },
              {
                "input": { "number": 7 },
                "expectedOutput": "Positive odd number"
              },
              {
                "input": { "number": -5 },
                "expectedOutput": "Not positive"
              },
              {
                "input": { "number": 0 },
                "expectedOutput": "Not positive"
              },
              {
                "input": { "number": 10 },
                "expectedOutput": "Positive even number"
              }
            ]
          },
          {
            "description": "// Do not rename score and attendance, use them as input for your program.\n// While testing we will change their values.\nconst score = 85;\nconst attendance = 90;\n\n// Determine if student passes with distinction:\n// First check if score >= 75\n//   If true, then check if attendance >= 80\n//     If true, print: \"Pass with distinction\"\n//     Otherwise, print: \"Pass but low attendance\"\n//   Otherwise, print: \"Fail\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "score": 85, "attendance": 90 },
                "expectedOutput": "Pass with distinction"
              },
              {
                "input": { "score": 80, "attendance": 70 },
                "expectedOutput": "Pass but low attendance"
              },
              {
                "input": { "score": 60, "attendance": 95 },
                "expectedOutput": "Fail"
              },
              {
                "input": { "score": 75, "attendance": 80 },
                "expectedOutput": "Pass with distinction"
              },
              {
                "input": { "score": 90, "attendance": 75 },
                "expectedOutput": "Pass but low attendance"
              }
            ]
          },
          {
            "description": "// Do not rename temperature and isRaining, use them as input for your program.\n// While testing we will change their values.\nconst temperature = 25;\nconst isRaining = false;\n\n// Suggest outdoor activity:\n// First check if temperature > 20\n//   If true, then check if isRaining is false\n//     If true, print: \"Good day for outdoor activity\"\n//     Otherwise, print: \"Warm but raining\"\n//   Otherwise, check if isRaining is false\n//     If true, print: \"Cold but dry\"\n//     Otherwise, print: \"Cold and raining\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "temperature": 25, "isRaining": false },
                "expectedOutput": "Good day for outdoor activity"
              },
              {
                "input": { "temperature": 25, "isRaining": true },
                "expectedOutput": "Warm but raining"
              },
              {
                "input": { "temperature": 15, "isRaining": false },
                "expectedOutput": "Cold but dry"
              },
              {
                "input": { "temperature": 15, "isRaining": true },
                "expectedOutput": "Cold and raining"
              },
              {
                "input": { "temperature": 21, "isRaining": false },
                "expectedOutput": "Good day for outdoor activity"
              }
            ]
          },
          {
            "description": "// Do not rename age and income, use them as input for your program.\n// While testing we will change their values.\nconst age = 30;\nconst income = 50000;\n\n// Determine loan eligibility:\n// First check if age >= 21\n//   If true, then check if age <= 60\n//     If true, then check if income >= 30000\n//       If true, print: \"Eligible for loan\"\n//       Otherwise, print: \"Age OK but income too low\"\n//     Otherwise, print: \"Too old\"\n//   Otherwise, print: \"Too young\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "age": 30, "income": 50000 },
                "expectedOutput": "Eligible for loan"
              },
              {
                "input": { "age": 30, "income": 20000 },
                "expectedOutput": "Age OK but income too low"
              },
              {
                "input": { "age": 65, "income": 50000 },
                "expectedOutput": "Too old"
              },
              {
                "input": { "age": 18, "income": 50000 },
                "expectedOutput": "Too young"
              },
              {
                "input": { "age": 21, "income": 30000 },
                "expectedOutput": "Eligible for loan"
              },
              {
                "input": { "age": 60, "income": 40000 },
                "expectedOutput": "Eligible for loan"
              }
            ]
          },
          {
            "description": "// Do not rename num, use it as input for your program.\n// While testing we will change its value.\nconst num = 15;\n\n// Classify number in detail:\n// First check if num > 0\n//   If true, then check if num > 10\n//     If true, print: \"Large positive\"\n//     Otherwise, print: \"Small positive\"\n//   Otherwise, check if num < 0\n//     If true, print: \"Negative\"\n//     Otherwise, print: \"Zero\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "num": 15 },
                "expectedOutput": "Large positive"
              },
              {
                "input": { "num": 5 },
                "expectedOutput": "Small positive"
              },
              {
                "input": { "num": -8 },
                "expectedOutput": "Negative"
              },
              {
                "input": { "num": 0 },
                "expectedOutput": "Zero"
              },
              {
                "input": { "num": 10 },
                "expectedOutput": "Small positive"
              },
              {
                "input": { "num": 11 },
                "expectedOutput": "Large positive"
              }
            ]
          },
          {
            "description": "// Do not rename isMember, purchaseAmount, use them as input for your program.\n// While testing we will change their values.\nconst isMember = true;\nconst purchaseAmount = 150;\n\n// Calculate discount eligibility:\n// First check if isMember is true\n//   If true, then check if purchaseAmount >= 100\n//     If true, print: \"20% member discount\"\n//     Otherwise, print: \"10% member discount\"\n//   Otherwise, check if purchaseAmount >= 200\n//     If true, print: \"5% non-member discount\"\n//     Otherwise, print: \"No discount\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "isMember": true, "purchaseAmount": 150 },
                "expectedOutput": "20% member discount"
              },
              {
                "input": { "isMember": true, "purchaseAmount": 80 },
                "expectedOutput": "10% member discount"
              },
              {
                "input": { "isMember": false, "purchaseAmount": 250 },
                "expectedOutput": "5% non-member discount"
              },
              {
                "input": { "isMember": false, "purchaseAmount": 150 },
                "expectedOutput": "No discount"
              },
              {
                "input": { "isMember": true, "purchaseAmount": 100 },
                "expectedOutput": "20% member discount"
              },
              {
                "input": { "isMember": false, "purchaseAmount": 200 },
                "expectedOutput": "5% non-member discount"
              }
            ]
          },
          {
            "description": "// Do not rename year, use it as input for your program.\n// While testing we will change its value.\nconst year = 2024;\n\n// Complete leap year check (nested logic):\n// First check if year is divisible by 4\n//   If true, then check if year is divisible by 100\n//     If true, then check if year is divisible by 400\n//       If true, print: \"Leap year\"\n//       Otherwise, print: \"Not a leap year\"\n//     Otherwise, print: \"Leap year\"\n//   Otherwise, print: \"Not a leap year\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "year": 2024 },
                "expectedOutput": "Leap year"
              },
              {
                "input": { "year": 2000 },
                "expectedOutput": "Leap year"
              },
              {
                "input": { "year": 1900 },
                "expectedOutput": "Not a leap year"
              },
              {
                "input": { "year": 2023 },
                "expectedOutput": "Not a leap year"
              },
              {
                "input": { "year": 2020 },
                "expectedOutput": "Leap year"
              },
              {
                "input": { "year": 1800 },
                "expectedOutput": "Not a leap year"
              }
            ]
          }
        ]
      },
      {
        "id": "date-time",
        "title": "Working with Dates",
        "outcomes": [
          "The Date Object: Tracking time in memory",
          "Capturing the current System Time",
          "Parsing Dates from Strings",
          "Constructing Dates from Numeric Components",
          "The Zero-indexed Month Pitfall",
          "Extracting Components (getMethods)",
          "Modifying Date Objects (setMethods)",
          "The Weekday Integer (getDay)",
          "Unix Timestamps and getTime()",
          "Temporal Logic: Comparing Two Dates",
          "Date Arithmetic: Adding and Subtracting Time",
          "Standard Formatting: ISO and Local Strings"
        ],
        "tasks": [
          {
            "description": "// Create a Date object for January 1, 2025\n// Remember: months are zero-indexed (0 = January, 11 = December)\n// Print the full date using toDateString()\n// Your output should be: Wed Jan 01 2025",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "Wed Jan 01 2025"
              }
            ]
          },
          {
            "description": "// Do not rename dateStr, use it as input for your program.\n// While testing we will change its value.\nconst dateStr = \"2024-06-15\";\n\n// Parse the date string and extract the year using getFullYear()\n// Print only the year\n// For \"2024-06-15\", your output should be: 2024",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "dateStr": "2024-06-15" },
                "expectedOutput": "2024"
              },
              {
                "input": { "dateStr": "2023-12-25" },
                "expectedOutput": "2023"
              },
              {
                "input": { "dateStr": "2025-01-01" },
                "expectedOutput": "2025"
              }
            ]
          },
          {
            "description": "// Do not rename dateStr, use it as input for your program.\n// While testing we will change its value.\nconst dateStr = \"2024-03-15\";\n\n// Parse the date string and extract the month number\n// Remember: getMonth() returns 0-11, so add 1 for human-readable month\n// Print the month number (1-12)\n// For \"2024-03-15\", your output should be: 3",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "dateStr": "2024-03-15" },
                "expectedOutput": "3"
              },
              {
                "input": { "dateStr": "2024-01-10" },
                "expectedOutput": "1"
              },
              {
                "input": { "dateStr": "2024-12-25" },
                "expectedOutput": "12"
              },
              {
                "input": { "dateStr": "2024-07-04" },
                "expectedOutput": "7"
              }
            ]
          },
          {
            "description": "// Do not rename dateStr, use it as input for your program.\n// While testing we will change its value.\nconst dateStr = \"2024-08-25\";\n\n// Parse the date and get the day of the week\n// Use getDay() which returns 0 (Sunday) to 6 (Saturday)\n// Convert to day name and print it\n// For \"2024-08-25\", your output should be: Sunday",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "dateStr": "2024-08-25" },
                "expectedOutput": "Sunday"
              },
              {
                "input": { "dateStr": "2024-08-26" },
                "expectedOutput": "Monday"
              },
              {
                "input": { "dateStr": "2024-08-31" },
                "expectedOutput": "Saturday"
              },
              {
                "input": { "dateStr": "2024-01-01" },
                "expectedOutput": "Monday"
              }
            ]
          },
          {
            "description": "// Create a date for your birthday this year: December 25\n// Extract and print three components on separate lines:\n// - Day of month using getDate()\n// - Month number (remember to add 1 to getMonth())\n// - Year using getFullYear()\n// Your output should be:\n// 25\n// 12\n// 2025",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "25\n12\n2025"
              }
            ]
          },
          {
            "description": "// Do not rename dateStr1 and dateStr2, use them as input for your program.\n// While testing we will change their values.\nconst dateStr1 = \"2024-06-15\";\nconst dateStr2 = \"2024-08-20\";\n\n// Compare two dates and determine which is earlier\n// If dateStr1 is earlier, print: \"First date is earlier\"\n// If dateStr2 is earlier, print: \"Second date is earlier\"\n// If they are the same, print: \"Same date\"\n// Hint: You can compare Date objects directly with < and >",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "dateStr1": "2024-06-15", "dateStr2": "2024-08-20" },
                "expectedOutput": "First date is earlier"
              },
              {
                "input": { "dateStr1": "2024-12-25", "dateStr2": "2024-01-01" },
                "expectedOutput": "Second date is earlier"
              },
              {
                "input": { "dateStr1": "2024-07-04", "dateStr2": "2024-07-04" },
                "expectedOutput": "Same date"
              },
              {
                "input": { "dateStr1": "2025-01-01", "dateStr2": "2024-12-31" },
                "expectedOutput": "Second date is earlier"
              }
            ]
          },
          {
            "description": "// Do not rename dateStr, use it as input for your program.\n// While testing we will change its value.\nconst dateStr = \"2024-03-10\";\n\n// Parse the date and add 7 days to it\n// Use getDate() and setDate() methods\n// Print the new date in ISO format (YYYY-MM-DD) using toISOString().split('T')[0]\n// For \"2024-03-10\", your output should be: 2024-03-17",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "dateStr": "2024-03-10" },
                "expectedOutput": "2024-03-17"
              },
              {
                "input": { "dateStr": "2024-12-28" },
                "expectedOutput": "2025-01-04"
              },
              {
                "input": { "dateStr": "2024-02-25" },
                "expectedOutput": "2024-03-03"
              },
              {
                "input": { "dateStr": "2024-01-01" },
                "expectedOutput": "2024-01-08"
              }
            ]
          },
          {
            "description": "// Do not rename dateStr1 and dateStr2, use them as input for your program.\n// While testing we will change their values.\nconst dateStr1 = \"2024-01-01\";\nconst dateStr2 = \"2024-01-15\";\n\n// Calculate the difference in days between two dates\n// Use getTime() to get timestamps in milliseconds\n// Convert milliseconds to days (1 day = 24 * 60 * 60 * 1000 ms)\n// Print the absolute difference in days\n// For \"2024-01-01\" and \"2024-01-15\", your output should be: 14",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "dateStr1": "2024-01-01", "dateStr2": "2024-01-15" },
                "expectedOutput": "14"
              },
              {
                "input": { "dateStr1": "2024-06-01", "dateStr2": "2024-06-30" },
                "expectedOutput": "29"
              },
              {
                "input": { "dateStr1": "2024-12-25", "dateStr2": "2024-12-31" },
                "expectedOutput": "6"
              },
              {
                "input": { "dateStr1": "2024-01-10", "dateStr2": "2024-01-10" },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Create a date for March 15, 2024\n// Modify it to change the month to June (month index 5)\n// Use setMonth() method\n// Print the modified date using toDateString()\n// Your output should be: Sat Jun 15 2024",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "Sat Jun 15 2024"
              }
            ]
          },
          {
            "description": "// Do not rename dateStr, use it as input for your program.\n// While testing we will change its value.\nconst dateStr = \"2024-07-04\";\n\n// Parse the date and check if it falls on a weekend\n// Use getDay() - it returns 0 for Sunday, 6 for Saturday\n// If weekend (Saturday or Sunday), print: \"Weekend\"\n// Otherwise, print: \"Weekday\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "dateStr": "2024-07-04" },
                "expectedOutput": "Weekday"
              },
              {
                "input": { "dateStr": "2024-07-06" },
                "expectedOutput": "Weekend"
              },
              {
                "input": { "dateStr": "2024-07-07" },
                "expectedOutput": "Weekend"
              },
              {
                "input": { "dateStr": "2024-07-08" },
                "expectedOutput": "Weekday"
              }
            ]
          },
          {
            "description": "// Do not rename year, month, day (use them as input for your program).\n// While testing we will change their values.\nconst year = 2024;\nconst month = 2;  // Human-readable month (1-12)\nconst day = 29;\n\n// Create a Date object using year, month, and day\n// Remember: Date constructor uses 0-indexed months, so subtract 1 from month\n// Check if the date is valid by comparing if the day matches\n// If valid, print: \"Valid date\"\n// If invalid (e.g., Feb 30), print: \"Invalid date\"\n// Hint: new Date(2024, 1, 30) will roll over to March, so getDate() won't match",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "year": 2024, "month": 2, "day": 29 },
                "expectedOutput": "Valid date"
              },
              {
                "input": { "year": 2024, "month": 2, "day": 30 },
                "expectedOutput": "Invalid date"
              },
              {
                "input": { "year": 2024, "month": 4, "day": 31 },
                "expectedOutput": "Invalid date"
              },
              {
                "input": { "year": 2024, "month": 12, "day": 31 },
                "expectedOutput": "Valid date"
              }
            ]
          },
          {
            "description": "// Do not rename dateStr, use it as input for your program.\n// While testing we will change its value.\nconst dateStr = \"2024-08-15\";\n\n// Parse the date and format it as \"Month Day, Year\"\n// Create an array of month names: [\"January\", \"February\", ...]\n// Use getMonth(), getDate(), and getFullYear()\n// For \"2024-08-15\", your output should be: August 15, 2024",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "dateStr": "2024-08-15" },
                "expectedOutput": "August 15, 2024"
              },
              {
                "input": { "dateStr": "2024-01-01" },
                "expectedOutput": "January 1, 2024"
              },
              {
                "input": { "dateStr": "2024-12-25" },
                "expectedOutput": "December 25, 2024"
              },
              {
                "input": { "dateStr": "2024-07-04" },
                "expectedOutput": "July 4, 2024"
              }
            ]
          }
        ]
      },
      {
        "id": "while-loops",
        "title": "while Loops",
        "outcomes": [
          "The while Loop: Iterative Execution Syntax",
          "The Loop Condition: Controlling the Entry Gate",
          "The Counter Pattern: Tracking Iteration State",
          "Loop Termination: Ensuring a Safe Exit",
          "Infinite Loop Risk: Managing System Resources"
        ],
        "tasks": [
          {
            "description": "// Print numbers from 1 to 5 using a while loop\n// Each number should be on a new line\n// Your output should be:\n// 1\n// 2\n// 3\n// 4\n// 5",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "1\n2\n3\n4\n5"
              }
            ]
          },
          {
            "description": "// Do not rename n, use it as input for your program.\n// While testing we will change its value.\nconst n = 10;\n\n// Print all even numbers from 2 to n (inclusive)\n// Each number should be on a new line\n// For n = 10, your output should be:\n// 2\n// 4\n// 6\n// 8\n// 10",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "n": 10 },
                "expectedOutput": "2\n4\n6\n8\n10"
              },
              {
                "input": { "n": 6 },
                "expectedOutput": "2\n4\n6"
              },
              {
                "input": { "n": 2 },
                "expectedOutput": "2"
              },
              {
                "input": { "n": 1 },
                "expectedOutput": ""
              }
            ]
          },
          {
            "description": "// Do not rename limit, use it as input for your program.\n// While testing we will change its value.\nconst limit = 5;\n\n// Calculate the sum of numbers from 1 to limit\n// Print only the final sum\n// For limit = 5, your output should be: 15\n// (Because 1 + 2 + 3 + 4 + 5 = 15)",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "limit": 5 },
                "expectedOutput": "15"
              },
              {
                "input": { "limit": 10 },
                "expectedOutput": "55"
              },
              {
                "input": { "limit": 1 },
                "expectedOutput": "1"
              },
              {
                "input": { "limit": 100 },
                "expectedOutput": "5050"
              }
            ]
          },
          {
            "description": "// Do not rename num, use it as input for your program.\n// While testing we will change its value.\nconst num = 7;\n\n// Print the multiplication table for num from 1 to 10\n// Format: num x i = result\n// For num = 7, your output should be:\n// 7 x 1 = 7\n// 7 x 2 = 14\n// 7 x 3 = 21\n// ... up to 7 x 10 = 70",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "num": 7 },
                "expectedOutput": "7 x 1 = 7\n7 x 2 = 14\n7 x 3 = 21\n7 x 4 = 28\n7 x 5 = 35\n7 x 6 = 42\n7 x 7 = 49\n7 x 8 = 56\n7 x 9 = 63\n7 x 10 = 70"
              },
              {
                "input": { "num": 3 },
                "expectedOutput": "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30"
              }
            ]
          },
          {
            "description": "// Do not rename num, use it as input for your program.\n// While testing we will change its value.\nconst num = 5;\n\n// Calculate the factorial of num\n// Factorial of n = n × (n-1) × (n-2) × ... × 1\n// Print only the final result\n// For num = 5, your output should be: 120\n// (Because 5 × 4 × 3 × 2 × 1 = 120)",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "num": 5 },
                "expectedOutput": "120"
              },
              {
                "input": { "num": 3 },
                "expectedOutput": "6"
              },
              {
                "input": { "num": 1 },
                "expectedOutput": "1"
              },
              {
                "input": { "num": 7 },
                "expectedOutput": "5040"
              }
            ]
          },
          {
            "description": "// Do not rename num, use it as input for your program.\n// While testing we will change its value.\nconst num = 12345;\n\n// Count the number of digits in num\n// Use a while loop to repeatedly divide by 10\n// Print only the count\n// For num = 12345, your output should be: 5",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "num": 12345 },
                "expectedOutput": "5"
              },
              {
                "input": { "num": 7 },
                "expectedOutput": "1"
              },
              {
                "input": { "num": 1000 },
                "expectedOutput": "4"
              },
              {
                "input": { "num": 999999 },
                "expectedOutput": "6"
              }
            ]
          },
          {
            "description": "// Do not rename num, use it as input for your program.\n// While testing we will change its value.\nconst num = 12321;\n\n// Reverse the digits of num\n// For num = 12321, your output should be: 12321\n// For num = 1234, output should be: 4321\n// Hint: Use modulo (%) to extract last digit, then divide by 10",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "num": 12321 },
                "expectedOutput": "12321"
              },
              {
                "input": { "num": 1234 },
                "expectedOutput": "4321"
              },
              {
                "input": { "num": 500 },
                "expectedOutput": "5"
              },
              {
                "input": { "num": 9876 },
                "expectedOutput": "6789"
              }
            ]
          },
          {
            "description": "// Do not rename n, use it as input for your program.\n// While testing we will change its value.\nconst n = 7;\n\n// Print the first n numbers in the Fibonacci sequence\n// Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13, ...\n// Each number is the sum of the previous two\n// Print each number on a new line\n// For n = 7, your output should be:\n// 0\n// 1\n// 1\n// 2\n// 3\n// 5\n// 8",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "n": 7 },
                "expectedOutput": "0\n1\n1\n2\n3\n5\n8"
              },
              {
                "input": { "n": 5 },
                "expectedOutput": "0\n1\n1\n2\n3"
              },
              {
                "input": { "n": 1 },
                "expectedOutput": "0"
              },
              {
                "input": { "n": 10 },
                "expectedOutput": "0\n1\n1\n2\n3\n5\n8\n13\n21\n34"
              }
            ]
          },
          {
            "description": "// Do not rename num, use it as input for your program.\n// While testing we will change its value.\nconst num = 29;\n\n// Check if num is a prime number\n// A prime number is only divisible by 1 and itself\n// Print: \"Prime\" if it's prime, otherwise print: \"Not prime\"\n// Hint: Check divisibility from 2 to num-1",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "num": 29 },
                "expectedOutput": "Prime"
              },
              {
                "input": { "num": 15 },
                "expectedOutput": "Not prime"
              },
              {
                "input": { "num": 2 },
                "expectedOutput": "Prime"
              },
              {
                "input": { "num": 1 },
                "expectedOutput": "Not prime"
              },
              {
                "input": { "num": 17 },
                "expectedOutput": "Prime"
              }
            ]
          },
          {
            "description": "// Do not rename num, use it as input for your program.\n// While testing we will change its value.\nconst num = 28;\n\n// Check if num is a perfect number\n// A perfect number equals the sum of its proper divisors (excluding itself)\n// Example: 28 = 1 + 2 + 4 + 7 + 14\n// Print: \"Perfect number\" if true, otherwise print: \"Not perfect\"",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "num": 28 },
                "expectedOutput": "Perfect number"
              },
              {
                "input": { "num": 6 },
                "expectedOutput": "Perfect number"
              },
              {
                "input": { "num": 12 },
                "expectedOutput": "Not perfect"
              },
              {
                "input": { "num": 496 },
                "expectedOutput": "Perfect number"
              }
            ]
          }
        ]
      },
      {
        "id": "for-loops",
        "title": "for Loops",
        "outcomes": [
          "The for Loop: Compact Iteration Syntax",
          "Variable Initialization: Setting the Starting Point",
          "The Limit Condition: Defining the Exit Boundary",
          "The Update Expression: Incremental State Change",
          "Architectural Choice: When to use for vs. while"
        ],
        "tasks": [
          {
            "description": "// Print numbers from 1 to 10 using a for loop\n// Each number should be on a new line\n// Your output should be:\n// 1\n// 2\n// 3\n// ... up to 10",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "1\n2\n3\n4\n5\n6\n7\n8\n9\n10"
              }
            ]
          },
          {
            "description": "// Do not rename n, use it as input for your program.\n// While testing we will change its value.\nconst n = 15;\n\n// Print all odd numbers from 1 to n (inclusive)\n// Each number should be on a new line\n// For n = 15, your output should be:\n// 1\n// 3\n// 5\n// ... up to 15",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "n": 15 },
                "expectedOutput": "1\n3\n5\n7\n9\n11\n13\n15"
              },
              {
                "input": { "n": 10 },
                "expectedOutput": "1\n3\n5\n7\n9"
              },
              {
                "input": { "n": 5 },
                "expectedOutput": "1\n3\n5"
              },
              {
                "input": { "n": 1 },
                "expectedOutput": "1"
              }
            ]
          },
          {
            "description": "// Do not rename start and end, use them as input for your program.\n// While testing we will change their values.\nconst start = 5;\nconst end = 10;\n\n// Print numbers from start to end (inclusive) in reverse order\n// Each number should be on a new line\n// For start = 5 and end = 10, your output should be:\n// 10\n// 9\n// 8\n// 7\n// 6\n// 5",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "start": 5, "end": 10 },
                "expectedOutput": "10\n9\n8\n7\n6\n5"
              },
              {
                "input": { "start": 1, "end": 5 },
                "expectedOutput": "5\n4\n3\n2\n1"
              },
              {
                "input": { "start": 8, "end": 12 },
                "expectedOutput": "12\n11\n10\n9\n8"
              }
            ]
          },
          {
            "description": "// Do not rename n, use it as input for your program.\n// While testing we will change its value.\nconst n = 20;\n\n// Calculate the sum of all numbers from 1 to n that are divisible by 3\n// Print only the final sum\n// For n = 20, the numbers are: 3, 6, 9, 12, 15, 18\n// Your output should be: 63",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "n": 20 },
                "expectedOutput": "63"
              },
              {
                "input": { "n": 10 },
                "expectedOutput": "18"
              },
              {
                "input": { "n": 30 },
                "expectedOutput": "165"
              },
              {
                "input": { "n": 5 },
                "expectedOutput": "3"
              }
            ]
          },
          {
            "description": "// Do not rename str, use it as input for your program.\n// While testing we will change its value.\nconst str = \"Hello\";\n\n// Print each character of the string on a new line\n// Use str.length to get the length and str[i] to access characters\n// For str = \"Hello\", your output should be:\n// H\n// e\n// l\n// l\n// o",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "Hello" },
                "expectedOutput": "H\ne\nl\nl\no"
              },
              {
                "input": { "str": "JS" },
                "expectedOutput": "J\nS"
              },
              {
                "input": { "str": "Code" },
                "expectedOutput": "C\no\nd\ne"
              }
            ]
          },
          {
            "description": "// Do not rename str, use it as input for your program.\n// While testing we will change its value.\nconst str = \"JavaScript\";\n\n// Count the number of vowels (a, e, i, o, u) in the string\n// Case-insensitive: treat 'A' and 'a' as the same\n// Print only the count\n// For str = \"JavaScript\", your output should be: 3",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "JavaScript" },
                "expectedOutput": "3"
              },
              {
                "input": { "str": "Hello World" },
                "expectedOutput": "3"
              },
              {
                "input": { "str": "AEIOU" },
                "expectedOutput": "5"
              },
              {
                "input": { "str": "xyz" },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Do not rename n, use it as input for your program.\n// While testing we will change its value.\nconst n = 5;\n\n// Print a pattern of stars forming a right triangle\n// For n = 5, your output should be:\n// *\n// **\n// ***\n// ****\n// *****",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "n": 5 },
                "expectedOutput": "*\n**\n***\n****\n*****"
              },
              {
                "input": { "n": 3 },
                "expectedOutput": "*\n**\n***"
              },
              {
                "input": { "n": 1 },
                "expectedOutput": "*"
              },
              {
                "input": { "n": 7 },
                "expectedOutput": "*\n**\n***\n****\n*****\n******\n*******"
              }
            ]
          },
          {
            "description": "// Do not rename num, use it as input for your program.\n// While testing we will change its value.\nconst num = 12345;\n\n// Calculate the sum of all digits in num\n// Convert num to a string to iterate through digits\n// Print only the final sum\n// For num = 12345, your output should be: 15\n// (Because 1 + 2 + 3 + 4 + 5 = 15)",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "num": 12345 },
                "expectedOutput": "15"
              },
              {
                "input": { "num": 999 },
                "expectedOutput": "27"
              },
              {
                "input": { "num": 1000 },
                "expectedOutput": "1"
              },
              {
                "input": { "num": 246 },
                "expectedOutput": "12"
              }
            ]
          },
          {
            "description": "// Do not rename str, use it as input for your program.\n// While testing we will change its value.\nconst str = \"racecar\";\n\n// Check if str is a palindrome (reads the same forwards and backwards)\n// Compare characters from start and end moving towards center\n// Print: \"Palindrome\" if true, otherwise print: \"Not palindrome\"\n// Hint: Compare str[i] with str[str.length - 1 - i]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "racecar" },
                "expectedOutput": "Palindrome"
              },
              {
                "input": { "str": "hello" },
                "expectedOutput": "Not palindrome"
              },
              {
                "input": { "str": "madam" },
                "expectedOutput": "Palindrome"
              },
              {
                "input": { "str": "a" },
                "expectedOutput": "Palindrome"
              },
              {
                "input": { "str": "noon" },
                "expectedOutput": "Palindrome"
              }
            ]
          },
          {
            "description": "// Do not rename limit, use it as input for your program.\n// While testing we will change its value.\nconst limit = 50;\n\n// Print all prime numbers from 2 to limit\n// A prime number is only divisible by 1 and itself\n// Each prime should be on a new line\n// For limit = 50, your output should be:\n// 2\n// 3\n// 5\n// 7\n// ... up to 47",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "limit": 20 },
                "expectedOutput": "2\n3\n5\n7\n11\n13\n17\n19"
              },
              {
                "input": { "limit": 10 },
                "expectedOutput": "2\n3\n5\n7"
              },
              {
                "input": { "limit": 30 },
                "expectedOutput": "2\n3\n5\n7\n11\n13\n17\n19\n23\n29"
              }
            ]
          }
        ]
      },
      {
        "id": "loop-control",
        "title": "Loop Control (break, continue)",
        "outcomes": [
          "The break Statement: Immediate Loop Exit",
          "The continue Statement: Skipping the Current Cycle",
          "Early Termination: Optimizing Search Logic",
          "Conditional Skipping: Filtered Execution Flow"
        ],
        "tasks": [
          {
            "description": "// Print numbers from 1 to 20, but stop when you reach 10\n// Use a for loop with break statement\n// Your output should be:\n// 1\n// 2\n// 3\n// ... up to 10",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "1\n2\n3\n4\n5\n6\n7\n8\n9\n10"
              }
            ]
          },
          {
            "description": "// Do not rename n, use it as input for your program.\n// While testing we will change its value.\nconst n = 20;\n\n// Print numbers from 1 to n, but skip multiples of 3\n// Use continue statement to skip multiples of 3\n// For n = 20, your output should be:\n// 1\n// 2\n// 4\n// 5\n// 7\n// 8\n// ... (skipping 3, 6, 9, 12, 15, 18)",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "n": 15 },
                "expectedOutput": "1\n2\n4\n5\n7\n8\n10\n11\n13\n14"
              },
              {
                "input": { "n": 10 },
                "expectedOutput": "1\n2\n4\n5\n7\n8\n10"
              },
              {
                "input": { "n": 5 },
                "expectedOutput": "1\n2\n4\n5"
              }
            ]
          },
          {
            "description": "// Do not rename str and target, use them as input for your program.\n// While testing we will change their values.\nconst str = \"JavaScript\";\nconst target = \"S\";\n\n// Find the first occurrence of target character in str\n// Print the index (position) where it's found\n// Use break to stop searching once found\n// If not found, print: -1\n// For str = \"JavaScript\" and target = \"S\", your output should be: 4",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "JavaScript", "target": "S" },
                "expectedOutput": "4"
              },
              {
                "input": { "str": "Hello", "target": "l" },
                "expectedOutput": "2"
              },
              {
                "input": { "str": "Code", "target": "x" },
                "expectedOutput": "-1"
              },
              {
                "input": { "str": "Programming", "target": "g" },
                "expectedOutput": "3"
              }
            ]
          },
          {
            "description": "// Do not rename limit, use it as input for your program.\n// While testing we will change its value.\nconst limit = 30;\n\n// Print all even numbers from 1 to limit, but stop if you encounter a number greater than 20\n// Use continue for odd numbers and break for numbers > 20\n// For limit = 30, your output should be:\n// 2\n// 4\n// 6\n// ... up to 20",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "limit": 30 },
                "expectedOutput": "2\n4\n6\n8\n10\n12\n14\n16\n18\n20"
              },
              {
                "input": { "limit": 15 },
                "expectedOutput": "2\n4\n6\n8\n10\n12\n14"
              },
              {
                "input": { "limit": 25 },
                "expectedOutput": "2\n4\n6\n8\n10\n12\n14\n16\n18\n20"
              }
            ]
          },
          {
            "description": "// Do not rename str, use it as input for your program.\n// While testing we will change its value.\nconst str = \"Hello World\";\n\n// Print all characters except vowels (a, e, i, o, u)\n// Use continue to skip vowels\n// Case-insensitive: skip both 'a' and 'A'\n// For str = \"Hello World\", your output should be:\n// H\n// l\n// l\n//  \n// W\n// r\n// l\n// d",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "Hello World" },
                "expectedOutput": "H\nl\nl\n \nW\nr\nl\nd"
              },
              {
                "input": { "str": "JavaScript" },
                "expectedOutput": "J\nv\nS\nc\nr\np\nt"
              },
              {
                "input": { "str": "Code" },
                "expectedOutput": "C\nd"
              }
            ]
          },
          {
            "description": "// Do not rename num, use it as input for your program.\n// While testing we will change its value.\nconst num = 84;\n\n// Find the smallest divisor of num (greater than 1)\n// Use break once you find the first divisor\n// Print the divisor\n// For num = 84, your output should be: 2",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "num": 84 },
                "expectedOutput": "2"
              },
              {
                "input": { "num": 15 },
                "expectedOutput": "3"
              },
              {
                "input": { "num": 17 },
                "expectedOutput": "17"
              },
              {
                "input": { "num": 21 },
                "expectedOutput": "3"
              }
            ]
          },
          {
            "description": "// Do not rename n, use it as input for your program.\n// While testing we will change its value.\nconst n = 50;\n\n// Print numbers from 1 to n, but:\n// - Skip numbers divisible by 5\n// - Stop completely when you reach a number divisible by 7 and greater than 30\n// Use continue for divisible by 5, break for the stopping condition\n// For n = 50, your output should be numbers 1-34 (excluding 5, 10, 15, 20, 25, 30) and stopping at 35",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "n": 50 },
                "expectedOutput": "1\n2\n3\n4\n6\n7\n8\n9\n11\n12\n13\n14\n16\n17\n18\n19\n21\n22\n23\n24\n26\n27\n28\n29\n31\n32\n33\n34"
              },
              {
                "input": { "n": 40 },
                "expectedOutput": "1\n2\n3\n4\n6\n7\n8\n9\n11\n12\n13\n14\n16\n17\n18\n19\n21\n22\n23\n24\n26\n27\n28\n29\n31\n32\n33\n34"
              },
              {
                "input": { "n": 30 },
                "expectedOutput": "1\n2\n3\n4\n6\n7\n8\n9\n11\n12\n13\n14\n16\n17\n18\n19\n21\n22\n23\n24\n26\n27\n28\n29"
              }
            ]
          },
          {
            "description": "// Do not rename str, use it as input for your program.\n// While testing we will change its value.\nconst str = \"a1b2c3d4\";\n\n// Print only the digit characters from the string\n// Use continue to skip non-digit characters\n// Hint: A character is a digit if it's between '0' and '9'\n// For str = \"a1b2c3d4\", your output should be:\n// 1\n// 2\n// 3\n// 4",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "a1b2c3d4" },
                "expectedOutput": "1\n2\n3\n4"
              },
              {
                "input": { "str": "hello123world" },
                "expectedOutput": "1\n2\n3"
              },
              {
                "input": { "str": "no digits here" },
                "expectedOutput": ""
              },
              {
                "input": { "str": "test567end" },
                "expectedOutput": "5\n6\n7"
              }
            ]
          }
        ]
      },
      {
        "id": "nested-loops",
        "title": "Nested Loops",
        "outcomes": [
          "Nested Loop Syntax: Hierarchical Iteration",
          "Execution Flow: The \"Clockwork\" of Inner and Outer Loops",
          "Calculating Workload: Total Iterations (N * M)",
          "Generative Logic: Grid and Pattern Printing"
        ],
        "tasks": [
          {
            "description": "// Do not rename rows and cols, use them as input for your program.\n// While testing we will change their values.\nconst rows = 3;\nconst cols = 4;\n\n// Print a grid of stars (*) with the given dimensions\n// Each row should be on a new line\n// For rows = 3 and cols = 4, your output should be:\n// ****\n// ****\n// ****",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "rows": 3, "cols": 4 },
                "expectedOutput": "****\n****\n****"
              },
              {
                "input": { "rows": 2, "cols": 5 },
                "expectedOutput": "*****\n*****"
              },
              {
                "input": { "rows": 4, "cols": 3 },
                "expectedOutput": "***\n***\n***\n***"
              },
              {
                "input": { "rows": 1, "cols": 6 },
                "expectedOutput": "******"
              }
            ]
          },
          {
            "description": "// Print the multiplication table from 1 to 5\n// Format each line as: \"1 2 3 4 5\" (space-separated)\n// Your output should be:\n// 1 2 3 4 5\n// 2 4 6 8 10\n// 3 6 9 12 15\n// 4 8 12 16 20\n// 5 10 15 20 25",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "1 2 3 4 5\n2 4 6 8 10\n3 6 9 12 15\n4 8 12 16 20\n5 10 15 20 25"
              }
            ]
          },
          {
            "description": "// Do not rename n, use it as input for your program.\n// While testing we will change its value.\nconst n = 4;\n\n// Print a right triangle pattern of numbers\n// Each row i should have numbers from 1 to i\n// For n = 4, your output should be:\n// 1\n// 1 2\n// 1 2 3\n// 1 2 3 4",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "n": 4 },
                "expectedOutput": "1\n1 2\n1 2 3\n1 2 3 4"
              },
              {
                "input": { "n": 3 },
                "expectedOutput": "1\n1 2\n1 2 3"
              },
              {
                "input": { "n": 5 },
                "expectedOutput": "1\n1 2\n1 2 3\n1 2 3 4\n1 2 3 4 5"
              },
              {
                "input": { "n": 1 },
                "expectedOutput": "1"
              }
            ]
          },
          {
            "description": "// Do not rename n, use it as input for your program.\n// While testing we will change its value.\nconst n = 5;\n\n// Print a pyramid pattern of stars\n// Row i should have i stars\n// For n = 5, your output should be:\n// *\n// **\n// ***\n// ****\n// *****\n// ****\n// ***\n// **\n// *",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "n": 5 },
                "expectedOutput": "*\n**\n***\n****\n*****\n****\n***\n**\n*"
              },
              {
                "input": { "n": 3 },
                "expectedOutput": "*\n**\n***\n**\n*"
              },
              {
                "input": { "n": 4 },
                "expectedOutput": "*\n**\n***\n****\n***\n**\n*"
              }
            ]
          },
          {
            "description": "// Do not rename str1 and str2, use them as input for your program.\n// While testing we will change their values.\nconst str1 = \"abc\";\nconst str2 = \"xy\";\n\n// Print all possible pairs of characters from str1 and str2\n// Format: \"char1char2\" (concatenated, no space)\n// For str1 = \"abc\" and str2 = \"xy\", your output should be:\n// ax\n// ay\n// bx\n// by\n// cx\n// cy",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str1": "abc", "str2": "xy" },
                "expectedOutput": "ax\nay\nbx\nby\ncx\ncy"
              },
              {
                "input": { "str1": "ab", "str2": "12" },
                "expectedOutput": "a1\na2\nb1\nb2"
              },
              {
                "input": { "str1": "XY", "str2": "123" },
                "expectedOutput": "X1\nX2\nX3\nY1\nY2\nY3"
              }
            ]
          },
          {
            "description": "// Do not rename n, use it as input for your program.\n// While testing we will change its value.\nconst n = 4;\n\n// Print a hollow square pattern\n// Only the border should have stars, inside should be spaces\n// For n = 4, your output should be:\n// ****\n// *  *\n// *  *\n// ****",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "n": 4 },
                "expectedOutput": "****\n*  *\n*  *\n****"
              },
              {
                "input": { "n": 5 },
                "expectedOutput": "*****\n*   *\n*   *\n*   *\n*****"
              },
              {
                "input": { "n": 3 },
                "expectedOutput": "***\n* *\n***"
              },
              {
                "input": { "n": 2 },
                "expectedOutput": "**\n**"
              }
            ]
          },
          {
            "description": "// Do not rename limit, use it as input for your program.\n// While testing we will change its value.\nconst limit = 20;\n\n// Find and print all pairs of numbers (a, b) where:\n// - Both a and b are between 1 and limit\n// - a < b\n// - a + b equals 10\n// Format: \"a + b = 10\"\n// For limit = 20, your output should be:\n// 1 + 9 = 10\n// 2 + 8 = 10\n// 3 + 7 = 10\n// 4 + 6 = 10",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "limit": 20 },
                "expectedOutput": "1 + 9 = 10\n2 + 8 = 10\n3 + 7 = 10\n4 + 6 = 10"
              },
              {
                "input": { "limit": 10 },
                "expectedOutput": "1 + 9 = 10\n2 + 8 = 10\n3 + 7 = 10\n4 + 6 = 10"
              },
              {
                "input": { "limit": 8 },
                "expectedOutput": "2 + 8 = 10\n3 + 7 = 10\n4 + 6 = 10"
              }
            ]
          },
          {
            "description": "// Do not rename n, use it as input for your program.\n// While testing we will change its value.\nconst n = 3;\n\n// Print a pattern where each row shows row number repeated row times\n// For n = 3, your output should be:\n// 1\n// 2 2\n// 3 3 3",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "n": 3 },
                "expectedOutput": "1\n2 2\n3 3 3"
              },
              {
                "input": { "n": 4 },
                "expectedOutput": "1\n2 2\n3 3 3\n4 4 4 4"
              },
              {
                "input": { "n": 5 },
                "expectedOutput": "1\n2 2\n3 3 3\n4 4 4 4\n5 5 5 5 5"
              },
              {
                "input": { "n": 1 },
                "expectedOutput": "1"
              }
            ]
          },
          {
            "description": "// Do not rename rows and cols, use them as input for your program.\n// While testing we will change their values.\nconst rows = 3;\nconst cols = 4;\n\n// Print a grid showing coordinates (row, col) for each position\n// Format: \"(row,col)\" with space between coordinates\n// For rows = 3 and cols = 4, your output should be:\n// (0,0) (0,1) (0,2) (0,3)\n// (1,0) (1,1) (1,2) (1,3)\n// (2,0) (2,1) (2,2) (2,3)",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "rows": 3, "cols": 4 },
                "expectedOutput": "(0,0) (0,1) (0,2) (0,3)\n(1,0) (1,1) (1,2) (1,3)\n(2,0) (2,1) (2,2) (2,3)"
              },
              {
                "input": { "rows": 2, "cols": 3 },
                "expectedOutput": "(0,0) (0,1) (0,2)\n(1,0) (1,1) (1,2)"
              },
              {
                "input": { "rows": 2, "cols": 2 },
                "expectedOutput": "(0,0) (0,1)\n(1,0) (1,1)"
              }
            ]
          },
          {
            "description": "// Do not rename limit, use it as input for your program.\n// While testing we will change its value.\nconst limit = 30;\n\n// Count and print the total number of prime numbers from 2 to limit\n// Use nested loops: outer loop for each number, inner loop to check if prime\n// Print only the final count\n// For limit = 30, there are 10 primes: 2,3,5,7,11,13,17,19,23,29\n// Your output should be: 10",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "limit": 30 },
                "expectedOutput": "10"
              },
              {
                "input": { "limit": 20 },
                "expectedOutput": "8"
              },
              {
                "input": { "limit": 10 },
                "expectedOutput": "4"
              },
              {
                "input": { "limit": 50 },
                "expectedOutput": "15"
              }
            ]
          }
        ]
      },
      {
        "id": "arrays",
        "title": "Arrays",
        "outcomes": [
          "Array Creation: Grouping Data in Memory",
          "Zero-based Indexing: Accessing List Members",
          "The length Property: Measuring Collection Size",
          "Dynamic Access: Finding the Final Element",
          "Mutable Collections: Modifying Elements in Place",
          "Linear Traversal: Iterating with for Loops",
          "The Accumulator Pattern: Summarizing Array Data",
          "The Search Pattern: Finding Specific Data in a List"
        ],
        "tasks": [
          {
            "description": "// Do not rename numbers, use it as input for your program.\n// While testing we will change its value.\nconst numbers = [10, 20, 30, 40, 50];\n\n// Print the first and last elements of the array\n// Each on a new line\n// For numbers = [10, 20, 30, 40, 50], your output should be:\n// 10\n// 50",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "numbers": [10, 20, 30, 40, 50] },
                "expectedOutput": "10\n50"
              },
              {
                "input": { "numbers": [5, 15, 25] },
                "expectedOutput": "5\n25"
              },
              {
                "input": { "numbers": [100] },
                "expectedOutput": "100\n100"
              },
              {
                "input": { "numbers": [7, 14, 21, 28, 35, 42] },
                "expectedOutput": "7\n42"
              }
            ]
          },
          {
            "description": "// Do not rename arr, use it as input for your program.\n// While testing we will change its value.\nconst arr = [3, 7, 2, 9, 1];\n\n// Print each element of the array on a new line\n// For arr = [3, 7, 2, 9, 1], your output should be:\n// 3\n// 7\n// 2\n// 9\n// 1",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [3, 7, 2, 9, 1] },
                "expectedOutput": "3\n7\n2\n9\n1"
              },
              {
                "input": { "arr": [10, 20] },
                "expectedOutput": "10\n20"
              },
              {
                "input": { "arr": [5] },
                "expectedOutput": "5"
              },
              {
                "input": { "arr": [1, 2, 3, 4, 5, 6] },
                "expectedOutput": "1\n2\n3\n4\n5\n6"
              }
            ]
          },
          {
            "description": "// Do not rename numbers, use it as input for your program.\n// While testing we will change its value.\nconst numbers = [5, 10, 15, 20, 25];\n\n// Calculate and print the sum of all elements in the array\n// For numbers = [5, 10, 15, 20, 25], your output should be: 75",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "numbers": [5, 10, 15, 20, 25] },
                "expectedOutput": "75"
              },
              {
                "input": { "numbers": [1, 2, 3, 4] },
                "expectedOutput": "10"
              },
              {
                "input": { "numbers": [100] },
                "expectedOutput": "100"
              },
              {
                "input": { "numbers": [10, 20, 30, 40, 50, 60] },
                "expectedOutput": "210"
              }
            ]
          },
          {
            "description": "// Do not rename numbers, use it as input for your program.\n// While testing we will change its value.\nconst numbers = [12, 5, 8, 21, 3];\n\n// Find and print the largest number in the array\n// For numbers = [12, 5, 8, 21, 3], your output should be: 21",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "numbers": [12, 5, 8, 21, 3] },
                "expectedOutput": "21"
              },
              {
                "input": { "numbers": [1, 2, 3, 4, 5] },
                "expectedOutput": "5"
              },
              {
                "input": { "numbers": [50, 25, 75, 10] },
                "expectedOutput": "75"
              },
              {
                "input": { "numbers": [100] },
                "expectedOutput": "100"
              }
            ]
          },
          {
            "description": "// Do not rename arr and target, use them as input for your program.\n// While testing we will change their values.\nconst arr = [10, 20, 30, 40, 50];\nconst target = 30;\n\n// Find the index of target in the array\n// If found, print the index\n// If not found, print: -1\n// For arr = [10, 20, 30, 40, 50] and target = 30, your output should be: 2",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [10, 20, 30, 40, 50], "target": 30 },
                "expectedOutput": "2"
              },
              {
                "input": { "arr": [10, 20, 30, 40, 50], "target": 10 },
                "expectedOutput": "0"
              },
              {
                "input": { "arr": [10, 20, 30, 40, 50], "target": 60 },
                "expectedOutput": "-1"
              },
              {
                "input": { "arr": [5, 15, 25, 35], "target": 35 },
                "expectedOutput": "3"
              }
            ]
          },
          {
            "description": "// Do not rename numbers, use it as input for your program.\n// While testing we will change its value.\nconst numbers = [3, 7, 2, 9, 1, 5];\n\n// Count how many even numbers are in the array\n// Print only the count\n// For numbers = [3, 7, 2, 9, 1, 5], your output should be: 1",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "numbers": [3, 7, 2, 9, 1, 5] },
                "expectedOutput": "1"
              },
              {
                "input": { "numbers": [2, 4, 6, 8] },
                "expectedOutput": "4"
              },
              {
                "input": { "numbers": [1, 3, 5, 7] },
                "expectedOutput": "0"
              },
              {
                "input": { "numbers": [10, 15, 20, 25, 30] },
                "expectedOutput": "3"
              }
            ]
          },
          {
            "description": "// Do not rename arr, use it as input for your program.\n// While testing we will change its value.\nconst arr = [1, 2, 3, 4, 5];\n\n// Print the array in reverse order\n// Each element on a new line\n// For arr = [1, 2, 3, 4, 5], your output should be:\n// 5\n// 4\n// 3\n// 2\n// 1",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5] },
                "expectedOutput": "5\n4\n3\n2\n1"
              },
              {
                "input": { "arr": [10, 20, 30] },
                "expectedOutput": "30\n20\n10"
              },
              {
                "input": { "arr": [7] },
                "expectedOutput": "7"
              },
              {
                "input": { "arr": [5, 10, 15, 20] },
                "expectedOutput": "20\n15\n10\n5"
              }
            ]
          },
          {
            "description": "// Do not rename numbers, use it as input for your program.\n// While testing we will change its value.\nconst numbers = [10, 5, 8, 3, 12, 7];\n\n// Print all numbers greater than 7\n// Each number on a new line\n// For numbers = [10, 5, 8, 3, 12, 7], your output should be:\n// 10\n// 8\n// 12",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "numbers": [10, 5, 8, 3, 12, 7] },
                "expectedOutput": "10\n8\n12"
              },
              {
                "input": { "numbers": [1, 2, 3, 4, 5] },
                "expectedOutput": ""
              },
              {
                "input": { "numbers": [20, 15, 25, 10] },
                "expectedOutput": "20\n15\n25\n10"
              },
              {
                "input": { "numbers": [8, 9, 10] },
                "expectedOutput": "8\n9\n10"
              }
            ]
          },
          {
            "description": "// Do not rename arr, use it as input for your program.\n// While testing we will change its value.\nconst arr = [5, 2, 8, 2, 9, 2, 3];\n\n// Double each element in the array (multiply by 2)\n// Print the modified array elements on a new line\n// For arr = [5, 2, 8, 2, 9, 2, 3], your output should be:\n// 10\n// 4\n// 16\n// 4\n// 18\n// 4\n// 6",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [5, 2, 8, 2, 9, 2, 3] },
                "expectedOutput": "10\n4\n16\n4\n18\n4\n6"
              },
              {
                "input": { "arr": [1, 2, 3] },
                "expectedOutput": "2\n4\n6"
              },
              {
                "input": { "arr": [10, 20, 30] },
                "expectedOutput": "20\n40\n60"
              },
              {
                "input": { "arr": [7] },
                "expectedOutput": "14"
              }
            ]
          },
          {
            "description": "// Do not rename words, use it as input for your program.\n// While testing we will change its value.\nconst words = [\"apple\", \"banana\", \"kiwi\", \"grape\", \"watermelon\"];\n\n// Find and print the longest word in the array\n// For words = [\"apple\", \"banana\", \"kiwi\", \"grape\", \"watermelon\"], your output should be: watermelon",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "words": ["apple", "banana", "kiwi", "grape", "watermelon"] },
                "expectedOutput": "watermelon"
              },
              {
                "input": { "words": ["cat", "dog", "elephant"] },
                "expectedOutput": "elephant"
              },
              {
                "input": { "words": ["hi", "hello", "hey"] },
                "expectedOutput": "hello"
              },
              {
                "input": { "words": ["code"] },
                "expectedOutput": "code"
              }
            ]
          },
          {
            "description": "// Do not rename arr, use it as input for your program.\n// While testing we will change its value.\nconst arr = [3, 7, 2, 7, 9, 7, 1];\n\n// Count how many times the number 7 appears in the array\n// Print only the count\n// For arr = [3, 7, 2, 7, 9, 7, 1], your output should be: 3",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [3, 7, 2, 7, 9, 7, 1] },
                "expectedOutput": "3"
              },
              {
                "input": { "arr": [7, 7, 7, 7] },
                "expectedOutput": "4"
              },
              {
                "input": { "arr": [1, 2, 3, 4, 5] },
                "expectedOutput": "0"
              },
              {
                "input": { "arr": [7] },
                "expectedOutput": "1"
              }
            ]
          },
          {
            "description": "// Do not rename numbers, use it as input for your program.\n// While testing we will change its value.\nconst numbers = [4, 7, 2, 9, 1, 6];\n\n// Calculate and print the average of all numbers in the array\n// Round to 2 decimal places\n// For numbers = [4, 7, 2, 9, 1, 6], sum = 29, average = 29/6 = 4.83\n// Your output should be: 4.83",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "numbers": [4, 7, 2, 9, 1, 6] },
                "expectedOutput": "4.83"
              },
              {
                "input": { "numbers": [10, 20, 30] },
                "expectedOutput": "20.00"
              },
              {
                "input": { "numbers": [5, 5, 5, 5] },
                "expectedOutput": "5.00"
              },
              {
                "input": { "numbers": [1, 2, 3, 4, 5] },
                "expectedOutput": "3.00"
              }
            ]
          }
        ]
      },
      {
        "id": "objects",
        "title": "Objects",
        "outcomes": [
          "Object Literals: Modeling Entities with Key-Value Pairs",
          "Dot Notation vs. Bracket Notation: Accessing Data",
          "Dynamic Keys: Accessing Properties with Variables",
          "Mutable State: Adding, Modifying, and Deleting Properties",
          "Data Hierarchy: Navigating Nested Objects",
          "Object Methods: Assigning Behavior to Data",
          "The this Keyword: An Introduction to Context",
          "Static Methods: Object.keys() and Object.values()",
          "Iteration: Traversing Objects with for...in",
          "Existence Checks: The \"in\" Operator and hasOwnProperty"
        ],
        "tasks": [
          {
            "description": "// Do not rename person, use it as input for your program.\n// While testing we will change its value.\nconst person = { name: \"Alice\", age: 25, city: \"New York\" };\n\n// Print the name and age properties using dot notation\n// Each on a new line\n// For the given person object, your output should be:\n// Alice\n// 25",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "person": { "name": "Alice", "age": 25, "city": "New York" } },
                "expectedOutput": "Alice\n25"
              },
              {
                "input": { "person": { "name": "Bob", "age": 30, "city": "London" } },
                "expectedOutput": "Bob\n30"
              },
              {
                "input": { "person": { "name": "Charlie", "age": 35, "city": "Paris" } },
                "expectedOutput": "Charlie\n35"
              }
            ]
          },
          {
            "description": "// Do not rename car and key, use them as input for your program.\n// While testing we will change their values.\nconst car = { brand: \"Toyota\", model: \"Camry\", year: 2020 };\nconst key = \"model\";\n\n// Access the property using the variable key with bracket notation\n// Print the value\n// For car = { brand: \"Toyota\", model: \"Camry\", year: 2020 } and key = \"model\"\n// Your output should be: Camry",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "car": { "brand": "Toyota", "model": "Camry", "year": 2020 }, "key": "model" },
                "expectedOutput": "Camry"
              },
              {
                "input": { "car": { "brand": "Honda", "model": "Civic", "year": 2019 }, "key": "brand" },
                "expectedOutput": "Honda"
              },
              {
                "input": { "car": { "brand": "Ford", "model": "Mustang", "year": 2021 }, "key": "year" },
                "expectedOutput": "2021"
              }
            ]
          },
          {
            "description": "// Do not rename product, use it as input for your program.\n// While testing we will change its value.\nconst product = { name: \"Laptop\", price: 999 };\n\n// Add a new property 'stock' with value 50\n// Then add a property 'category' with value \"Electronics\"\n// Print all values using Object.values(), each on a new line\n// Your output should be:\n// Laptop\n// 999\n// 50\n// Electronics",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "product": { "name": "Laptop", "price": 999 } },
                "expectedOutput": "Laptop\n999\n50\nElectronics"
              },
              {
                "input": { "product": { "name": "Phone", "price": 599 } },
                "expectedOutput": "Phone\n599\n50\nElectronics"
              }
            ]
          },
          {
            "description": "// Do not rename user, use it as input for your program.\n// While testing we will change its value.\nconst user = { username: \"john_doe\", email: \"john@example.com\", age: 28 };\n\n// Print all the keys of the object using Object.keys()\n// Each key on a new line\n// For the given user object, your output should be:\n// username\n// email\n// age",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "user": { "username": "john_doe", "email": "john@example.com", "age": 28 } },
                "expectedOutput": "username\nemail\nage"
              },
              {
                "input": { "user": { "id": 1, "name": "Alice", "role": "admin" } },
                "expectedOutput": "id\nname\nrole"
              },
              {
                "input": { "user": { "firstName": "Bob", "lastName": "Smith" } },
                "expectedOutput": "firstName\nlastName"
              }
            ]
          },
          {
            "description": "// Do not rename company, use it as input for your program.\n// While testing we will change its value.\nconst company = {\n  name: \"TechCorp\",\n  location: { city: \"San Francisco\", country: \"USA\" },\n  employees: 500\n};\n\n// Access and print the city from the nested location object\n// For the given company object, your output should be: San Francisco",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "company": { "name": "TechCorp", "location": { "city": "San Francisco", "country": "USA" }, "employees": 500 } },
                "expectedOutput": "San Francisco"
              },
              {
                "input": { "company": { "name": "StartupInc", "location": { "city": "Austin", "country": "USA" }, "employees": 50 } },
                "expectedOutput": "Austin"
              },
              {
                "input": { "company": { "name": "GlobalCo", "location": { "city": "London", "country": "UK" }, "employees": 1000 } },
                "expectedOutput": "London"
              }
            ]
          },
          {
            "description": "// Do not rename obj and propertyName, use them as input for your program.\n// While testing we will change their values.\nconst obj = { name: \"Alice\", age: 30, city: \"Paris\" };\nconst propertyName = \"age\";\n\n// Check if the property exists in the object using the 'in' operator\n// Print: \"Found\" if it exists, otherwise print: \"Not found\"\n// For obj = { name: \"Alice\", age: 30, city: \"Paris\" } and propertyName = \"age\"\n// Your output should be: Found",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "obj": { "name": "Alice", "age": 30, "city": "Paris" }, "propertyName": "age" },
                "expectedOutput": "Found"
              },
              {
                "input": { "obj": { "name": "Alice", "age": 30, "city": "Paris" }, "propertyName": "country" },
                "expectedOutput": "Not found"
              },
              {
                "input": { "obj": { "x": 10, "y": 20 }, "propertyName": "x" },
                "expectedOutput": "Found"
              },
              {
                "input": { "obj": { "x": 10, "y": 20 }, "propertyName": "z" },
                "expectedOutput": "Not found"
              }
            ]
          },
          {
            "description": "// Do not rename scores, use it as input for your program.\n// While testing we will change its value.\nconst scores = { math: 85, science: 90, english: 78, history: 88 };\n\n// Calculate the total sum of all scores using Object.values()\n// Print only the total\n// For the given scores object, your output should be: 341",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "scores": { "math": 85, "science": 90, "english": 78, "history": 88 } },
                "expectedOutput": "341"
              },
              {
                "input": { "scores": { "test1": 100, "test2": 90, "test3": 95 } },
                "expectedOutput": "285"
              },
              {
                "input": { "scores": { "quiz": 50 } },
                "expectedOutput": "50"
              }
            ]
          },
          {
            "description": "// Do not rename inventory, use it as input for your program.\n// While testing we will change its value.\nconst inventory = { apples: 50, bananas: 30, oranges: 40 };\n\n// Use a for...in loop to print each item and its quantity\n// Format: \"item: quantity\"\n// For the given inventory, your output should be:\n// apples: 50\n// bananas: 30\n// oranges: 40",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "inventory": { "apples": 50, "bananas": 30, "oranges": 40 } },
                "expectedOutput": "apples: 50\nbananas: 30\noranges: 40"
              },
              {
                "input": { "inventory": { "pens": 100, "pencils": 150 } },
                "expectedOutput": "pens: 100\npencils: 150"
              },
              {
                "input": { "inventory": { "laptops": 10, "mice": 25, "keyboards": 20 } },
                "expectedOutput": "laptops: 10\nmice: 25\nkeyboards: 20"
              }
            ]
          },
          {
            "description": "// Do not rename student, use it as input for your program.\n// While testing we will change its value.\nconst student = {\n  name: \"Emma\",\n  grades: { math: 92, science: 88, english: 85 },\n  age: 16\n};\n\n// Calculate the average grade from the nested grades object\n// Print the average rounded to 2 decimal places\n// For the given student, average = (92 + 88 + 85) / 3 = 88.33\n// Your output should be: 88.33",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "student": { "name": "Emma", "grades": { "math": 92, "science": 88, "english": 85 }, "age": 16 } },
                "expectedOutput": "88.33"
              },
              {
                "input": { "student": { "name": "John", "grades": { "math": 100, "science": 95, "english": 90 }, "age": 17 } },
                "expectedOutput": "95.00"
              },
              {
                "input": { "student": { "name": "Sarah", "grades": { "math": 80, "science": 85 }, "age": 15 } },
                "expectedOutput": "82.50"
              }
            ]
          },
          {
            "description": "// Do not rename settings, use it as input for your program.\n// While testing we will change its value.\nconst settings = { theme: \"dark\", notifications: true, language: \"en\", autoSave: false };\n\n// Count how many properties have boolean values (true or false)\n// Use typeof to check if value is 'boolean'\n// Print only the count\n// For the given settings, your output should be: 2",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "settings": { "theme": "dark", "notifications": true, "language": "en", "autoSave": false } },
                "expectedOutput": "2"
              },
              {
                "input": { "settings": { "a": true, "b": false, "c": true, "d": 5 } },
                "expectedOutput": "3"
              },
              {
                "input": { "settings": { "x": "test", "y": 10, "z": "hello" } },
                "expectedOutput": "0"
              },
              {
                "input": { "settings": { "enabled": true } },
                "expectedOutput": "1"
              }
            ]
          },
          {
            "description": "// Do not rename book, use it as input for your program.\n// While testing we will change its value.\nconst book = { title: \"1984\", author: \"George Orwell\", pages: 328, published: 1949 };\n\n// Create a new object with only the title and author properties\n// Print the new object's values using Object.values(), each on a new line\n// For the given book, your output should be:\n// 1984\n// George Orwell",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "book": { "title": "1984", "author": "George Orwell", "pages": 328, "published": 1949 } },
                "expectedOutput": "1984\nGeorge Orwell"
              },
              {
                "input": { "book": { "title": "The Hobbit", "author": "J.R.R. Tolkien", "pages": 310, "published": 1937 } },
                "expectedOutput": "The Hobbit\nJ.R.R. Tolkien"
              }
            ]
          },
          {
            "description": "// Do not rename data, use it as input for your program.\n// While testing we will change its value.\nconst data = { a: 10, b: 20, c: 30, d: 40, e: 50 };\n\n// Print all keys whose values are greater than 25\n// Each key on a new line\n// For the given data, your output should be:\n// c\n// d\n// e",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "data": { "a": 10, "b": 20, "c": 30, "d": 40, "e": 50 } },
                "expectedOutput": "c\nd\ne"
              },
              {
                "input": { "data": { "x": 100, "y": 15, "z": 30 } },
                "expectedOutput": "x\nz"
              },
              {
                "input": { "data": { "m": 5, "n": 10, "o": 15 } },
                "expectedOutput": ""
              },
              {
                "input": { "data": { "p": 26, "q": 27, "r": 25 } },
                "expectedOutput": "p\nq"
              }
            ]
          }
        ]
      },
      {
        "id": "map-set",
        "title": "Specialized Collections",
        "outcomes": [
          "Map: Advanced Key-Value Collections",
          "Map CRUD: set(), get(), has(), and delete()",
          "Map State: size and clear() management",
          "Map Iteration: entries(), keys(), and values()",
          "Set: The Collection of Unique Values",
          "Set CRUD: add(), has(), and delete()",
          "Array-to-Set: The \"Unique Value\" Pattern",
          "Architectural Choice: Map vs. Object & Set vs. Array"
        ],
        "tasks": [
          {
            "description": "// Create a new Map and add three key-value pairs:\n// - \"name\" -> \"Alice\"\n// - \"age\" -> 25\n// - \"city\" -> \"Paris\"\n// Print the value associated with the key \"name\"\n// Your output should be: Alice",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "Alice"
              }
            ]
          },
          {
            "description": "// Do not rename map and key, use them as input for your program.\n// While testing we will change their values.\nconst map = new Map([[\"a\", 10], [\"b\", 20], [\"c\", 30]]);\nconst key = \"b\";\n\n// Check if the key exists in the map using has()\n// If it exists, print the value using get()\n// If it doesn't exist, print: \"Not found\"\n// For key = \"b\", your output should be: 20",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "map": "new Map([[\"a\", 10], [\"b\", 20], [\"c\", 30]])", "key": "b" },
                "expectedOutput": "20"
              },
              {
                "input": { "map": "new Map([[\"a\", 10], [\"b\", 20], [\"c\", 30]])", "key": "d" },
                "expectedOutput": "Not found"
              },
              {
                "input": { "map": "new Map([[\"x\", 100], [\"y\", 200]])", "key": "x" },
                "expectedOutput": "100"
              }
            ]
          },
          {
            "description": "// Do not rename map, use it as input for your program.\n// While testing we will change its value.\nconst map = new Map([[\"apple\", 5], [\"banana\", 3], [\"orange\", 7]]);\n\n// Print the size of the map (number of entries)\n// Then print all keys using keys(), each on a new line\n// For the given map, your output should be:\n// 3\n// apple\n// banana\n// orange",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "map": "new Map([[\"apple\", 5], [\"banana\", 3], [\"orange\", 7]])" },
                "expectedOutput": "3\napple\nbanana\norange"
              },
              {
                "input": { "map": "new Map([[\"x\", 1], [\"y\", 2]])" },
                "expectedOutput": "2\nx\ny"
              },
              {
                "input": { "map": "new Map([[\"a\", 10]])" },
                "expectedOutput": "1\na"
              }
            ]
          },
          {
            "description": "// Do not rename map, use it as input for your program.\n// While testing we will change its value.\nconst map = new Map([[\"math\", 90], [\"science\", 85], [\"english\", 88]]);\n\n// Calculate the sum of all values in the map using values()\n// Print only the total sum\n// For the given map, your output should be: 263",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "map": "new Map([[\"math\", 90], [\"science\", 85], [\"english\", 88]])" },
                "expectedOutput": "263"
              },
              {
                "input": { "map": "new Map([[\"a\", 10], [\"b\", 20], [\"c\", 30]])" },
                "expectedOutput": "60"
              },
              {
                "input": { "map": "new Map([[\"x\", 100]])" },
                "expectedOutput": "100"
              }
            ]
          },
          {
            "description": "// Create a new Set with the following values: 1, 2, 3, 4, 5\n// Add the value 6 to the set\n// Check if the value 3 exists using has()\n// Print: \"Found\" if it exists, otherwise print: \"Not found\"\n// Your output should be: Found",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "Found"
              }
            ]
          },
          {
            "description": "// Do not rename arr, use it as input for your program.\n// While testing we will change its value.\nconst arr = [1, 2, 2, 3, 4, 4, 5, 5, 5];\n\n// Create a Set from the array to get unique values\n// Print the size of the set (number of unique values)\n// For arr = [1, 2, 2, 3, 4, 4, 5, 5, 5], your output should be: 5",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 2, 3, 4, 4, 5, 5, 5] },
                "expectedOutput": "5"
              },
              {
                "input": { "arr": [10, 20, 30, 10, 20] },
                "expectedOutput": "3"
              },
              {
                "input": { "arr": [5, 5, 5, 5] },
                "expectedOutput": "1"
              },
              {
                "input": { "arr": [1, 2, 3, 4, 5, 6] },
                "expectedOutput": "6"
              }
            ]
          },
          {
            "description": "// Do not rename set, use it as input for your program.\n// While testing we will change its value.\nconst set = new Set([10, 20, 30, 40, 50]);\n\n// Delete the value 30 from the set using delete()\n// Print all remaining values in the set, each on a new line\n// For the given set, your output should be:\n// 10\n// 20\n// 40\n// 50",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "set": "new Set([10, 20, 30, 40, 50])" },
                "expectedOutput": "10\n20\n40\n50"
              },
              {
                "input": { "set": "new Set([1, 2, 3])" },
                "expectedOutput": "1\n2\n3"
              },
              {
                "input": { "set": "new Set([5, 10, 15, 20])" },
                "expectedOutput": "5\n10\n15\n20"
              }
            ]
          },
          {
            "description": "// Do not rename arr1 and arr2, use them as input for your program.\n// While testing we will change their values.\nconst arr1 = [1, 2, 3, 4];\nconst arr2 = [3, 4, 5, 6];\n\n// Find the common elements between arr1 and arr2 using Sets\n// Print the common elements, each on a new line\n// Hint: Create a set from arr1, then check which elements from arr2 are in the set\n// For arr1 = [1, 2, 3, 4] and arr2 = [3, 4, 5, 6], your output should be:\n// 3\n// 4",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr1": [1, 2, 3, 4], "arr2": [3, 4, 5, 6] },
                "expectedOutput": "3\n4"
              },
              {
                "input": { "arr1": [10, 20, 30], "arr2": [20, 30, 40] },
                "expectedOutput": "20\n30"
              },
              {
                "input": { "arr1": [5, 10, 15], "arr2": [20, 25, 30] },
                "expectedOutput": ""
              },
              {
                "input": { "arr1": [1, 2, 3], "arr2": [1, 2, 3] },
                "expectedOutput": "1\n2\n3"
              }
            ]
          },
          {
            "description": "// Do not rename map, use it as input for your program.\n// While testing we will change its value.\nconst map = new Map([[\"a\", 10], [\"b\", 20], [\"c\", 30], [\"d\", 25]]);\n\n// Count how many entries have values greater than 20\n// Use entries() to iterate through the map\n// Print only the count\n// For the given map, your output should be: 2",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "map": "new Map([[\"a\", 10], [\"b\", 20], [\"c\", 30], [\"d\", 25]])" },
                "expectedOutput": "2"
              },
              {
                "input": { "map": "new Map([[\"x\", 50], [\"y\", 60], [\"z\", 70]])" },
                "expectedOutput": "3"
              },
              {
                "input": { "map": "new Map([[\"m\", 5], [\"n\", 10]])" },
                "expectedOutput": "0"
              },
              {
                "input": { "map": "new Map([[\"p\", 21], [\"q\", 22]])" },
                "expectedOutput": "2"
              }
            ]
          },
          {
            "description": "// Do not rename words, use it as input for your program.\n// While testing we will change its value.\nconst words = [\"apple\", \"banana\", \"apple\", \"orange\", \"banana\", \"apple\"];\n\n// Count the frequency of each word using a Map\n// Print each word and its count in the format: \"word: count\"\n// For the given words array, your output should be:\n// apple: 3\n// banana: 2\n// orange: 1",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "words": ["apple", "banana", "apple", "orange", "banana", "apple"] },
                "expectedOutput": "apple: 3\nbanana: 2\norange: 1"
              },
              {
                "input": { "words": ["cat", "dog", "cat", "cat"] },
                "expectedOutput": "cat: 3\ndog: 1"
              },
              {
                "input": { "words": ["one", "two", "three"] },
                "expectedOutput": "one: 1\ntwo: 1\nthree: 1"
              }
            ]
          },
          {
            "description": "// Do not rename str, use it as input for your program.\n// While testing we will change its value.\nconst str = \"javascript\";\n\n// Find all unique characters in the string using a Set\n// Convert the string to an array, create a Set, then print the count of unique characters\n// For str = \"javascript\", unique characters are: j, a, v, s, c, r, i, p, t (9 unique)\n// Your output should be: 9",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "javascript" },
                "expectedOutput": "9"
              },
              {
                "input": { "str": "hello" },
                "expectedOutput": "4"
              },
              {
                "input": { "str": "aaa" },
                "expectedOutput": "1"
              },
              {
                "input": { "str": "programming" },
                "expectedOutput": "9"
              }
            ]
          },
          {
            "description": "// Do not rename map, use it as input for your program.\n// While testing we will change its value.\nconst map = new Map([[1, \"one\"], [2, \"two\"], [3, \"three\"]]);\n\n// Iterate through the map using entries()\n// Print each entry in the format: \"key -> value\"\n// For the given map, your output should be:\n// 1 -> one\n// 2 -> two\n// 3 -> three",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "map": "new Map([[1, \"one\"], [2, \"two\"], [3, \"three\"]])" },
                "expectedOutput": "1 -> one\n2 -> two\n3 -> three"
              },
              {
                "input": { "map": "new Map([[\"a\", \"apple\"], [\"b\", \"banana\"]])" },
                "expectedOutput": "a -> apple\nb -> banana"
              },
              {
                "input": { "map": "new Map([[10, \"ten\"]])" },
                "expectedOutput": "10 -> ten"
              }
            ]
          }
        ]
      },
      {
        "id": "destructuring",
        "title": "Destructuring",
        "outcomes": [
          "Array Destructuring: Unpacking by Position",
          "Skipping and Rest: Targeted Array Extraction",
          "Object Destructuring: Unpacking by Key Name",
          "Renaming and Defaults: Safe Data Extraction",
          "Nested Destructuring: Deep Data Access",
          "Parameter Destructuring: Clean Function Inputs",
          "The Swap Trick: Variable Exchange without Temps"
        ],
        "tasks": [
          {
            "description": "// Do not rename colors, use it as input for your program.\n// While testing we will change its value.\nconst colors = [\"red\", \"green\", \"blue\"];\n\n// Use array destructuring to extract the first two colors into variables\n// Print them on separate lines\n// For colors = [\"red\", \"green\", \"blue\"], your output should be:\n// red\n// green",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "colors": ["red", "green", "blue"] },
                "expectedOutput": "red\ngreen"
              },
              {
                "input": { "colors": ["yellow", "purple", "orange"] },
                "expectedOutput": "yellow\npurple"
              },
              {
                "input": { "colors": ["black", "white", "gray"] },
                "expectedOutput": "black\nwhite"
              }
            ]
          },
          {
            "description": "// Do not rename numbers, use it as input for your program.\n// While testing we will change its value.\nconst numbers = [10, 20, 30, 40, 50];\n\n// Use array destructuring to get the first element and the rest of the array\n// Use the rest operator (...)\n// Print the first element on one line, then print the rest array elements each on a new line\n// For numbers = [10, 20, 30, 40, 50], your output should be:\n// 10\n// 20\n// 30\n// 40\n// 50",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "numbers": [10, 20, 30, 40, 50] },
                "expectedOutput": "10\n20\n30\n40\n50"
              },
              {
                "input": { "numbers": [5, 15, 25] },
                "expectedOutput": "5\n15\n25"
              },
              {
                "input": { "numbers": [100, 200] },
                "expectedOutput": "100\n200"
              }
            ]
          },
          {
            "description": "// Do not rename person, use it as input for your program.\n// While testing we will change its value.\nconst person = { name: \"Alice\", age: 25, city: \"Paris\" };\n\n// Use object destructuring to extract name and age\n// Print them on separate lines\n// For the given person object, your output should be:\n// Alice\n// 25",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "person": { "name": "Alice", "age": 25, "city": "Paris" } },
                "expectedOutput": "Alice\n25"
              },
              {
                "input": { "person": { "name": "Bob", "age": 30, "city": "London" } },
                "expectedOutput": "Bob\n30"
              },
              {
                "input": { "person": { "name": "Charlie", "age": 35, "city": "Berlin" } },
                "expectedOutput": "Charlie\n35"
              }
            ]
          },
          {
            "description": "// Do not rename user, use it as input for your program.\n// While testing we will change its value.\nconst user = { username: \"john_doe\", email: \"john@example.com\" };\n\n// Use object destructuring with default values\n// Extract username, email, and age (with default value 18)\n// Print all three values on separate lines\n// For the given user object (which doesn't have age), your output should be:\n// john_doe\n// john@example.com\n// 18",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "user": { "username": "john_doe", "email": "john@example.com" } },
                "expectedOutput": "john_doe\njohn@example.com\n18"
              },
              {
                "input": { "user": { "username": "alice", "email": "alice@test.com", "age": 25 } },
                "expectedOutput": "alice\nalice@test.com\n25"
              },
              {
                "input": { "user": { "username": "bob", "email": "bob@mail.com" } },
                "expectedOutput": "bob\nbob@mail.com\n18"
              }
            ]
          },
          {
            "description": "// Do not rename data, use it as input for your program.\n// While testing we will change its value.\nconst data = { id: 101, info: { name: \"Product A\", price: 50 } };\n\n// Use nested destructuring to extract id, name, and price\n// Print all three values on separate lines\n// For the given data object, your output should be:\n// 101\n// Product A\n// 50",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "data": { "id": 101, "info": { "name": "Product A", "price": 50 } } },
                "expectedOutput": "101\nProduct A\n50"
              },
              {
                "input": { "data": { "id": 202, "info": { "name": "Product B", "price": 75 } } },
                "expectedOutput": "202\nProduct B\n75"
              },
              {
                "input": { "data": { "id": 303, "info": { "name": "Product C", "price": 100 } } },
                "expectedOutput": "303\nProduct C\n100"
              }
            ]
          },
          {
            "description": "// Do not rename a and b, use them as input for your program.\n// While testing we will change their values.\nconst a = 10;\nconst b = 20;\n\n// Swap the values of a and b using array destructuring\n// Do NOT use a temporary variable\n// Print both values after swapping on separate lines\n// For a = 10 and b = 20, your output should be:\n// 20\n// 10",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "a": 10, "b": 20 },
                "expectedOutput": "20\n10"
              },
              {
                "input": { "a": 5, "b": 15 },
                "expectedOutput": "15\n5"
              },
              {
                "input": { "a": 100, "b": 200 },
                "expectedOutput": "200\n100"
              },
              {
                "input": { "a": 7, "b": 3 },
                "expectedOutput": "3\n7"
              }
            ]
          },
          {
            "description": "// Do not rename arr, use it as input for your program.\n// While testing we will change its value.\nconst arr = [1, 2, 3, 4, 5, 6];\n\n// Use array destructuring to skip the first two elements and extract the rest\n// Print the extracted elements, each on a new line\n// For arr = [1, 2, 3, 4, 5, 6], your output should be:\n// 3\n// 4\n// 5\n// 6",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5, 6] },
                "expectedOutput": "3\n4\n5\n6"
              },
              {
                "input": { "arr": [10, 20, 30, 40] },
                "expectedOutput": "30\n40"
              },
              {
                "input": { "arr": [5, 10, 15] },
                "expectedOutput": "15"
              }
            ]
          },
          {
            "description": "// Do not rename config, use it as input for your program.\n// While testing we will change its value.\nconst config = { host: \"localhost\", port: 3000, timeout: 5000 };\n\n// Use object destructuring with renaming\n// Extract 'host' as 'serverHost' and 'port' as 'serverPort'\n// Print both renamed variables on separate lines\n// For the given config, your output should be:\n// localhost\n// 3000",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "config": { "host": "localhost", "port": 3000, "timeout": 5000 } },
                "expectedOutput": "localhost\n3000"
              },
              {
                "input": { "config": { "host": "192.168.1.1", "port": 8080, "timeout": 3000 } },
                "expectedOutput": "192.168.1.1\n8080"
              },
              {
                "input": { "config": { "host": "example.com", "port": 443, "timeout": 10000 } },
                "expectedOutput": "example.com\n443"
              }
            ]
          },
          {
            "description": "// Do not rename students, use it as input for your program.\n// While testing we will change its value.\nconst students = [\n  { name: \"Alice\", grade: 85 },\n  { name: \"Bob\", grade: 92 },\n  { name: \"Charlie\", grade: 78 }\n];\n\n// Use array and object destructuring to extract the name from the first student\n// and the grade from the second student\n// Print both values on separate lines\n// For the given students array, your output should be:\n// Alice\n// 92",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "students": [{ "name": "Alice", "grade": 85 }, { "name": "Bob", "grade": 92 }, { "name": "Charlie", "grade": 78 }] },
                "expectedOutput": "Alice\n92"
              },
              {
                "input": { "students": [{ "name": "David", "grade": 90 }, { "name": "Emma", "grade": 88 }] },
                "expectedOutput": "David\n88"
              },
              {
                "input": { "students": [{ "name": "Frank", "grade": 95 }, { "name": "Grace", "grade": 100 }, { "name": "Henry", "grade": 82 }] },
                "expectedOutput": "Frank\n100"
              }
            ]
          },
          {
            "description": "// Do not rename response, use it as input for your program.\n// While testing we will change its value.\nconst response = {\n  status: 200,\n  data: {\n    user: { id: 1, name: \"John\" },\n    posts: [\"post1\", \"post2\"]\n  }\n};\n\n// Use nested destructuring to extract:\n// - status from the top level\n// - name from data.user\n// - The first post from data.posts array\n// Print all three values on separate lines\n// For the given response, your output should be:\n// 200\n// John\n// post1",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "response": { "status": 200, "data": { "user": { "id": 1, "name": "John" }, "posts": ["post1", "post2"] } } },
                "expectedOutput": "200\nJohn\npost1"
              },
              {
                "input": { "response": { "status": 404, "data": { "user": { "id": 2, "name": "Alice" }, "posts": ["article1", "article2", "article3"] } } },
                "expectedOutput": "404\nAlice\narticle1"
              }
            ]
          }
        ]
      },
      {
        "id": "spread-rest",
        "title": "Spread and Rest Operators",
        "outcomes": [
          "Spread Syntax: Unpacking Elements and Properties",
          "Shallow Copying: Creating Independent Arrays and Objects",
          "Merging Collections: Combining Multiple Data Sources",
          "Property Overriding: Updating State with Spread",
          "Rest Syntax: Gathering Remaining Values into an Array",
          "Constraint Logic: Why Rest must be the Final Parameter",
          "Structural Comparison: Spread vs. Rest Identification"
        ],
        "tasks": [
          {
            "description": "// Do not rename arr1 and arr2, use them as input for your program.\n// While testing we will change their values.\nconst arr1 = [1, 2, 3];\nconst arr2 = [4, 5, 6];\n\n// Use the spread operator to combine arr1 and arr2 into a new array\n// Print each element of the combined array on a new line\n// For arr1 = [1, 2, 3] and arr2 = [4, 5, 6], your output should be:\n// 1\n// 2\n// 3\n// 4\n// 5\n// 6",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr1": [1, 2, 3], "arr2": [4, 5, 6] },
                "expectedOutput": "1\n2\n3\n4\n5\n6"
              },
              {
                "input": { "arr1": [10, 20], "arr2": [30, 40] },
                "expectedOutput": "10\n20\n30\n40"
              },
              {
                "input": { "arr1": [5], "arr2": [15, 25] },
                "expectedOutput": "5\n15\n25"
              }
            ]
          },
          {
            "description": "// Do not rename original, use it as input for your program.\n// While testing we will change its value.\nconst original = [1, 2, 3, 4, 5];\n\n// Create a shallow copy of the array using the spread operator\n// Modify the first element of the copy to be 100\n// Print the first element of the original array, then the first element of the copy\n// This demonstrates that they are independent\n// For original = [1, 2, 3, 4, 5], your output should be:\n// 1\n// 100",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "original": [1, 2, 3, 4, 5] },
                "expectedOutput": "1\n100"
              },
              {
                "input": { "original": [10, 20, 30] },
                "expectedOutput": "10\n100"
              },
              {
                "input": { "original": [5, 15, 25, 35] },
                "expectedOutput": "5\n100"
              }
            ]
          },
          {
            "description": "// Do not rename obj1 and obj2, use them as input for your program.\n// While testing we will change their values.\nconst obj1 = { a: 1, b: 2 };\nconst obj2 = { c: 3, d: 4 };\n\n// Use the spread operator to merge obj1 and obj2 into a new object\n// Print all values of the merged object using Object.values(), each on a new line\n// For obj1 = { a: 1, b: 2 } and obj2 = { c: 3, d: 4 }, your output should be:\n// 1\n// 2\n// 3\n// 4",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "obj1": { "a": 1, "b": 2 }, "obj2": { "c": 3, "d": 4 } },
                "expectedOutput": "1\n2\n3\n4"
              },
              {
                "input": { "obj1": { "x": 10 }, "obj2": { "y": 20, "z": 30 } },
                "expectedOutput": "10\n20\n30"
              },
              {
                "input": { "obj1": { "m": 5, "n": 10 }, "obj2": { "o": 15 } },
                "expectedOutput": "5\n10\n15"
              }
            ]
          },
          {
            "description": "// Do not rename user, use it as input for your program.\n// While testing we will change its value.\nconst user = { name: \"Alice\", age: 25, city: \"Paris\" };\n\n// Create a new object using spread that copies user and updates the age to 26\n// Print the age from the original object, then the age from the new object\n// For the given user, your output should be:\n// 25\n// 26",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "user": { "name": "Alice", "age": 25, "city": "Paris" } },
                "expectedOutput": "25\n26"
              },
              {
                "input": { "user": { "name": "Bob", "age": 30, "city": "London" } },
                "expectedOutput": "30\n26"
              },
              {
                "input": { "user": { "name": "Charlie", "age": 20, "city": "Berlin" } },
                "expectedOutput": "20\n26"
              }
            ]
          },
          {
            "description": "// Do not rename numbers, use it as input for your program.\n// While testing we will change its value.\nconst numbers = [5, 10, 15, 20, 25];\n\n// Use rest syntax with array destructuring to get the first element and the rest\n// Calculate the sum of the rest elements (excluding the first)\n// Print the first element on one line, then the sum on the next line\n// For numbers = [5, 10, 15, 20, 25], rest = [10, 15, 20, 25], sum = 70\n// Your output should be:\n// 5\n// 70",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "numbers": [5, 10, 15, 20, 25] },
                "expectedOutput": "5\n70"
              },
              {
                "input": { "numbers": [1, 2, 3, 4] },
                "expectedOutput": "1\n9"
              },
              {
                "input": { "numbers": [100, 50, 25] },
                "expectedOutput": "100\n75"
              }
            ]
          },
          {
            "description": "// Do not rename arr, use it as input for your program.\n// While testing we will change its value.\nconst arr = [10, 20, 30, 40, 50];\n\n// Use spread operator to insert the number 25 between 20 and 30\n// Create a new array with: first 2 elements, then 25, then the rest\n// Print each element of the new array on a new line\n// For arr = [10, 20, 30, 40, 50], your output should be:\n// 10\n// 20\n// 25\n// 30\n// 40\n// 50",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [10, 20, 30, 40, 50] },
                "expectedOutput": "10\n20\n25\n30\n40\n50"
              },
              {
                "input": { "arr": [1, 2, 3, 4] },
                "expectedOutput": "1\n2\n25\n3\n4"
              },
              {
                "input": { "arr": [5, 10, 15] },
                "expectedOutput": "5\n10\n25\n15"
              }
            ]
          },
          {
            "description": "// Do not rename obj, use it as input for your program.\n// While testing we will change its value.\nconst obj = { a: 1, b: 2, c: 3, d: 4 };\n\n// Use rest syntax with object destructuring to extract 'a' and gather the rest\n// Print the value of 'a', then print the count of remaining properties\n// For obj = { a: 1, b: 2, c: 3, d: 4 }, rest has 3 properties\n// Your output should be:\n// 1\n// 3",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "obj": { "a": 1, "b": 2, "c": 3, "d": 4 } },
                "expectedOutput": "1\n3"
              },
              {
                "input": { "obj": { "a": 10, "x": 20, "y": 30 } },
                "expectedOutput": "10\n2"
              },
              {
                "input": { "obj": { "a": 5, "b": 10 } },
                "expectedOutput": "5\n1"
              }
            ]
          },
          {
            "description": "// Do not rename arrays, use it as input for your program.\n// While testing we will change its value.\nconst arrays = [[1, 2], [3, 4], [5, 6]];\n\n// Use spread operator to flatten the array of arrays into a single array\n// Print each element of the flattened array on a new line\n// For arrays = [[1, 2], [3, 4], [5, 6]], your output should be:\n// 1\n// 2\n// 3\n// 4\n// 5\n// 6",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arrays": [[1, 2], [3, 4], [5, 6]] },
                "expectedOutput": "1\n2\n3\n4\n5\n6"
              },
              {
                "input": { "arrays": [[10], [20, 30], [40]] },
                "expectedOutput": "10\n20\n30\n40"
              },
              {
                "input": { "arrays": [[5, 10, 15], [20, 25]] },
                "expectedOutput": "5\n10\n15\n20\n25"
              }
            ]
          },
          {
            "description": "// Do not rename defaults and overrides, use them as input for your program.\n// While testing we will change their values.\nconst defaults = { theme: \"light\", fontSize: 14, language: \"en\" };\nconst overrides = { fontSize: 16, language: \"fr\" };\n\n// Merge defaults and overrides using spread operator\n// overrides should take precedence over defaults\n// Print all values from the merged object using Object.values(), each on a new line\n// For the given objects, your output should be:\n// light\n// 16\n// fr",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "defaults": { "theme": "light", "fontSize": 14, "language": "en" }, "overrides": { "fontSize": 16, "language": "fr" } },
                "expectedOutput": "light\n16\nfr"
              },
              {
                "input": { "defaults": { "color": "blue", "size": 10 }, "overrides": { "color": "red" } },
                "expectedOutput": "red\n10"
              },
              {
                "input": { "defaults": { "a": 1, "b": 2, "c": 3 }, "overrides": { "b": 20, "c": 30 } },
                "expectedOutput": "1\n20\n30"
              }
            ]
          },
          {
            "description": "// Do not rename str, use it as input for your program.\n// While testing we will change its value.\nconst str = \"hello\";\n\n// Use spread operator to convert the string into an array of characters\n// Then use rest syntax to get the first character and the rest\n// Print the first character, then print the count of remaining characters\n// For str = \"hello\", first = 'h', rest has 4 characters\n// Your output should be:\n// h\n// 4",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "hello" },
                "expectedOutput": "h\n4"
              },
              {
                "input": { "str": "world" },
                "expectedOutput": "w\n4"
              },
              {
                "input": { "str": "JavaScript" },
                "expectedOutput": "J\n9"
              },
              {
                "input": { "str": "ab" },
                "expectedOutput": "a\n1"
              }
            ]
          }
        ]
      },
      {
        "id": "json",
        "title": "Data Serialization",
        "outcomes": [
          "JSON Fundamentals: The Universal Data Interchange Format",
          "JSON Syntax Rules: Why it is stricter than JS Objects",
          "JSON.stringify(): Converting Objects to Strings",
          "JSON.parse(): Reconstructing Objects from Strings",
          "Formatting: Using Spacing and Replacers in stringify",
          "The Reviver: Transforming Data during Parsing",
          "Serialization Limits: Handling Functions and undefined",
          "The Deep Clone Trick: Creating Independent Object Copies",
          "Architectural Distinction: JSON vs. JavaScript Object Literals"
        ],
        "tasks": [
          {
            "description": "// Do not rename user, use it as input for your program.\n// While testing we will change its value.\nconst user = { name: \"Alice\", age: 25, city: \"Paris\" };\n\n// Convert the user object to a JSON string using JSON.stringify()\n// Print the JSON string\n// For the given user, your output should be:\n// {\"name\":\"Alice\",\"age\":25,\"city\":\"Paris\"}",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "user": { "name": "Alice", "age": 25, "city": "Paris" } },
                "expectedOutput": "{\"name\":\"Alice\",\"age\":25,\"city\":\"Paris\"}"
              },
              {
                "input": { "user": { "name": "Bob", "age": 30, "city": "London" } },
                "expectedOutput": "{\"name\":\"Bob\",\"age\":30,\"city\":\"London\"}"
              },
              {
                "input": { "user": { "name": "Charlie", "age": 35, "city": "Berlin" } },
                "expectedOutput": "{\"name\":\"Charlie\",\"age\":35,\"city\":\"Berlin\"}"
              }
            ]
          },
          {
            "description": "// Do not rename jsonStr, use it as input for your program.\n// While testing we will change its value.\nconst jsonStr = '{\"product\":\"Laptop\",\"price\":999,\"inStock\":true}';\n\n// Parse the JSON string using JSON.parse()\n// Extract and print the product name and price on separate lines\n// For the given jsonStr, your output should be:\n// Laptop\n// 999",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "jsonStr": "{\"product\":\"Laptop\",\"price\":999,\"inStock\":true}" },
                "expectedOutput": "Laptop\n999"
              },
              {
                "input": { "jsonStr": "{\"product\":\"Phone\",\"price\":599,\"inStock\":false}" },
                "expectedOutput": "Phone\n599"
              },
              {
                "input": { "jsonStr": "{\"product\":\"Tablet\",\"price\":399,\"inStock\":true}" },
                "expectedOutput": "Tablet\n399"
              }
            ]
          },
          {
            "description": "// Do not rename data, use it as input for your program.\n// While testing we will change its value.\nconst data = { name: \"Test\", value: 42, active: true };\n\n// Convert data to a JSON string with indentation (use 2 spaces)\n// Print the formatted JSON string\n// For the given data, your output should be:\n// {\n//   \"name\": \"Test\",\n//   \"value\": 42,\n//   \"active\": true\n// }",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "data": { "name": "Test", "value": 42, "active": true } },
                "expectedOutput": "{\n  \"name\": \"Test\",\n  \"value\": 42,\n  \"active\": true\n}"
              },
              {
                "input": { "data": { "x": 10, "y": 20 } },
                "expectedOutput": "{\n  \"x\": 10,\n  \"y\": 20\n}"
              },
              {
                "input": { "data": { "id": 1, "type": "admin" } },
                "expectedOutput": "{\n  \"id\": 1,\n  \"type\": \"admin\"\n}"
              }
            ]
          },
          {
            "description": "// Do not rename original, use it as input for your program.\n// While testing we will change its value.\nconst original = { name: \"Alice\", scores: [85, 90, 95] };\n\n// Create a deep clone of the original object using JSON methods\n// Modify the first score in the clone to 100\n// Print the first score from original, then from the clone\n// This demonstrates they are independent\n// For the given original, your output should be:\n// 85\n// 100",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "original": { "name": "Alice", "scores": [85, 90, 95] } },
                "expectedOutput": "85\n100"
              },
              {
                "input": { "original": { "name": "Bob", "scores": [70, 75, 80] } },
                "expectedOutput": "70\n100"
              },
              {
                "input": { "original": { "name": "Charlie", "scores": [60, 65] } },
                "expectedOutput": "60\n100"
              }
            ]
          },
          {
            "description": "// Do not rename arr, use it as input for your program.\n// While testing we will change its value.\nconst arr = [1, 2, 3, 4, 5];\n\n// Convert the array to a JSON string\n// Then parse it back and print each element on a new line\n// For arr = [1, 2, 3, 4, 5], your output should be:\n// 1\n// 2\n// 3\n// 4\n// 5",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5] },
                "expectedOutput": "1\n2\n3\n4\n5"
              },
              {
                "input": { "arr": [10, 20, 30] },
                "expectedOutput": "10\n20\n30"
              },
              {
                "input": { "arr": [100] },
                "expectedOutput": "100"
              }
            ]
          },
          {
            "description": "// Do not rename obj, use it as input for your program.\n// While testing we will change its value.\nconst obj = {\n  id: 1,\n  name: \"John\",\n  email: \"john@example.com\",\n  password: \"secret123\",\n  role: \"user\"\n};\n\n// Convert obj to JSON, but exclude the 'password' field\n// Use the replacer parameter in JSON.stringify()\n// Print the resulting JSON string\n// For the given obj, your output should be:\n// {\"id\":1,\"name\":\"John\",\"email\":\"john@example.com\",\"role\":\"user\"}",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "obj": { "id": 1, "name": "John", "email": "john@example.com", "password": "secret123", "role": "user" } },
                "expectedOutput": "{\"id\":1,\"name\":\"John\",\"email\":\"john@example.com\",\"role\":\"user\"}"
              },
              {
                "input": { "obj": { "id": 2, "name": "Alice", "email": "alice@test.com", "password": "pass456", "role": "admin" } },
                "expectedOutput": "{\"id\":2,\"name\":\"Alice\",\"email\":\"alice@test.com\",\"role\":\"admin\"}"
              }
            ]
          },
          {
            "description": "// Do not rename nested, use it as input for your program.\n// While testing we will change its value.\nconst nested = {\n  user: {\n    name: \"Bob\",\n    address: {\n      city: \"Paris\",\n      country: \"France\"\n    }\n  }\n};\n\n// Convert the nested object to JSON and back\n// Access and print the city from the parsed object\n// For the given nested object, your output should be: Paris",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "nested": { "user": { "name": "Bob", "address": { "city": "Paris", "country": "France" } } } },
                "expectedOutput": "Paris"
              },
              {
                "input": { "nested": { "user": { "name": "Alice", "address": { "city": "London", "country": "UK" } } } },
                "expectedOutput": "London"
              },
              {
                "input": { "nested": { "user": { "name": "Charlie", "address": { "city": "Berlin", "country": "Germany" } } } },
                "expectedOutput": "Berlin"
              }
            ]
          },
          {
            "description": "// Do not rename jsonStr, use it as input for your program.\n// While testing we will change its value.\nconst jsonStr = '[{\"name\":\"Alice\",\"age\":25},{\"name\":\"Bob\",\"age\":30},{\"name\":\"Charlie\",\"age\":35}]';\n\n// Parse the JSON string (array of objects)\n// Calculate and print the average age\n// Round to 2 decimal places\n// For the given jsonStr, average = (25 + 30 + 35) / 3 = 30.00\n// Your output should be: 30.00",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "jsonStr": "[{\"name\":\"Alice\",\"age\":25},{\"name\":\"Bob\",\"age\":30},{\"name\":\"Charlie\",\"age\":35}]" },
                "expectedOutput": "30.00"
              },
              {
                "input": { "jsonStr": "[{\"name\":\"David\",\"age\":20},{\"name\":\"Emma\",\"age\":22}]" },
                "expectedOutput": "21.00"
              },
              {
                "input": { "jsonStr": "[{\"name\":\"Frank\",\"age\":40},{\"name\":\"Grace\",\"age\":45},{\"name\":\"Henry\",\"age\":50}]" },
                "expectedOutput": "45.00"
              }
            ]
          },
          {
            "description": "// Do not rename data, use it as input for your program.\n// While testing we will change its value.\nconst data = {\n  items: [\n    { name: \"Item1\", price: 10 },\n    { name: \"Item2\", price: 20 },\n    { name: \"Item3\", price: 30 }\n  ]\n};\n\n// Convert data to JSON string, parse it back\n// Calculate the total price of all items\n// Print only the total\n// For the given data, your output should be: 60",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "data": { "items": [{ "name": "Item1", "price": 10 }, { "name": "Item2", "price": 20 }, { "name": "Item3", "price": 30 }] } },
                "expectedOutput": "60"
              },
              {
                "input": { "data": { "items": [{ "name": "A", "price": 5 }, { "name": "B", "price": 15 }] } },
                "expectedOutput": "20"
              },
              {
                "input": { "data": { "items": [{ "name": "X", "price": 100 }] } },
                "expectedOutput": "100"
              }
            ]
          },
          {
            "description": "// Do not rename config, use it as input for your program.\n// While testing we will change its value.\nconst config = {\n  theme: \"dark\",\n  fontSize: 14,\n  notifications: true,\n  autoSave: false\n};\n\n// Convert config to JSON string, parse it back\n// Count how many boolean properties exist\n// Print only the count\n// For the given config, your output should be: 2",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "config": { "theme": "dark", "fontSize": 14, "notifications": true, "autoSave": false } },
                "expectedOutput": "2"
              },
              {
                "input": { "config": { "a": true, "b": 10, "c": false, "d": true } },
                "expectedOutput": "3"
              },
              {
                "input": { "config": { "x": "test", "y": 5, "z": "hello" } },
                "expectedOutput": "0"
              }
            ]
          }
        ]
      },
      {
        "id": "functions",
        "title": "Functions",
        "outcomes": [
          "Function Declaration: Defining a Reusable Logic Block",
          "The Call Stack: Executing and Invoking Functions",
          "Input Channels: Working with Parameters",
          "Data Passing: Providing Arguments during Invocation",
          "The return Statement: Outputting Data from a Function",
          "The return vs. console.log Distinction",
          "Multi-input Logic: Handling Multiple Parameters",
          "Identifier Naming: Descriptive Verb-based Names",
          "Software Design: Reusability and Single Responsibility"
        ],
        "tasks": [
          {
            "description": "// Create a function named greet that takes no parameters\n// The function should return the string \"Hello, World!\"\n// Call the function and print the result\n// Your output should be: Hello, World!",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "Hello, World!"
              }
            ]
          },
          {
            "description": "// Create a function named double that takes one parameter: num\n// The function should return num multiplied by 2\n// Test it by calling double(5) and printing the result\n// Your output should be: 10",
            "solution_type": "function",
            "function_name": "double",
            "testCases": [
              {
                "input": { "num": 5 },
                "expectedOutput": "10"
              },
              {
                "input": { "num": 10 },
                "expectedOutput": "20"
              },
              {
                "input": { "num": 7 },
                "expectedOutput": "14"
              },
              {
                "input": { "num": 0 },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Create a function named add that takes two parameters: a and b\n// The function should return the sum of a and b\n// Test it with add(10, 20) and print the result\n// Your output should be: 30",
            "solution_type": "function",
            "function_name": "add",
            "testCases": [
              {
                "input": { "a": 10, "b": 20 },
                "expectedOutput": "30"
              },
              {
                "input": { "a": 5, "b": 15 },
                "expectedOutput": "20"
              },
              {
                "input": { "a": 100, "b": 200 },
                "expectedOutput": "300"
              },
              {
                "input": { "a": 0, "b": 0 },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Create a function named isEven that takes one parameter: num\n// The function should return true if num is even, false otherwise\n// Test it with isEven(4) and print the result\n// Your output should be: true",
            "solution_type": "function",
            "function_name": "isEven",
            "testCases": [
              {
                "input": { "num": 4 },
                "expectedOutput": "true"
              },
              {
                "input": { "num": 7 },
                "expectedOutput": "false"
              },
              {
                "input": { "num": 0 },
                "expectedOutput": "true"
              },
              {
                "input": { "num": 13 },
                "expectedOutput": "false"
              }
            ]
          },
          {
            "description": "// Create a function named getMax that takes two parameters: x and y\n// The function should return the larger of the two numbers\n// If they're equal, return either one\n// Test it with getMax(15, 10) and print the result\n// Your output should be: 15",
            "solution_type": "function",
            "function_name": "getMax",
            "testCases": [
              {
                "input": { "x": 15, "y": 10 },
                "expectedOutput": "15"
              },
              {
                "input": { "x": 5, "y": 20 },
                "expectedOutput": "20"
              },
              {
                "input": { "x": 10, "y": 10 },
                "expectedOutput": "10"
              },
              {
                "input": { "x": 100, "y": 50 },
                "expectedOutput": "100"
              }
            ]
          },
          {
            "description": "// Create a function named calculateArea that takes two parameters: width and height\n// The function should return the area of a rectangle (width * height)\n// Test it with calculateArea(5, 10) and print the result\n// Your output should be: 50",
            "solution_type": "function",
            "function_name": "calculateArea",
            "testCases": [
              {
                "input": { "width": 5, "height": 10 },
                "expectedOutput": "50"
              },
              {
                "input": { "width": 7, "height": 3 },
                "expectedOutput": "21"
              },
              {
                "input": { "width": 12, "height": 8 },
                "expectedOutput": "96"
              },
              {
                "input": { "width": 1, "height": 1 },
                "expectedOutput": "1"
              }
            ]
          },
          {
            "description": "// Create a function named countVowels that takes one parameter: str\n// The function should return the count of vowels (a, e, i, o, u) in the string\n// Case-insensitive: treat 'A' and 'a' as the same\n// Test it with countVowels(\"hello\") and print the result\n// Your output should be: 2",
            "solution_type": "function",
            "function_name": "countVowels",
            "testCases": [
              {
                "input": { "str": "hello" },
                "expectedOutput": "2"
              },
              {
                "input": { "str": "JavaScript" },
                "expectedOutput": "3"
              },
              {
                "input": { "str": "AEIOU" },
                "expectedOutput": "5"
              },
              {
                "input": { "str": "xyz" },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Create a function named reverseString that takes one parameter: str\n// The function should return the reversed string\n// Test it with reverseString(\"hello\") and print the result\n// Your output should be: olleh",
            "solution_type": "function",
            "function_name": "reverseString",
            "testCases": [
              {
                "input": { "str": "hello" },
                "expectedOutput": "olleh"
              },
              {
                "input": { "str": "world" },
                "expectedOutput": "dlrow"
              },
              {
                "input": { "str": "JavaScript" },
                "expectedOutput": "tpircSavaJ"
              },
              {
                "input": { "str": "a" },
                "expectedOutput": "a"
              }
            ]
          },
          {
            "description": "// Create a function named isPalindrome that takes one parameter: str\n// The function should return true if the string is a palindrome, false otherwise\n// A palindrome reads the same forwards and backwards\n// Test it with isPalindrome(\"racecar\") and print the result\n// Your output should be: true",
            "solution_type": "function",
            "function_name": "isPalindrome",
            "testCases": [
              {
                "input": { "str": "racecar" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "hello" },
                "expectedOutput": "false"
              },
              {
                "input": { "str": "madam" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "noon" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "world" },
                "expectedOutput": "false"
              }
            ]
          },
          {
            "description": "// Create a function named sumArray that takes one parameter: arr (an array of numbers)\n// The function should return the sum of all elements in the array\n// Test it with sumArray([1, 2, 3, 4, 5]) and print the result\n// Your output should be: 15",
            "solution_type": "function",
            "function_name": "sumArray",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5] },
                "expectedOutput": "15"
              },
              {
                "input": { "arr": [10, 20, 30] },
                "expectedOutput": "60"
              },
              {
                "input": { "arr": [5] },
                "expectedOutput": "5"
              },
              {
                "input": { "arr": [0, 0, 0] },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Create a function named findMax that takes one parameter: arr (an array of numbers)\n// The function should return the largest number in the array\n// Test it with findMax([5, 12, 8, 21, 3]) and print the result\n// Your output should be: 21",
            "solution_type": "function",
            "function_name": "findMax",
            "testCases": [
              {
                "input": { "arr": [5, 12, 8, 21, 3] },
                "expectedOutput": "21"
              },
              {
                "input": { "arr": [1, 2, 3, 4, 5] },
                "expectedOutput": "5"
              },
              {
                "input": { "arr": [100] },
                "expectedOutput": "100"
              },
              {
                "input": { "arr": [50, 25, 75, 10] },
                "expectedOutput": "75"
              }
            ]
          },
          {
            "description": "// Create a function named factorial that takes one parameter: n\n// The function should return the factorial of n\n// Factorial of n = n × (n-1) × (n-2) × ... × 1\n// Test it with factorial(5) and print the result\n// Your output should be: 120",
            "solution_type": "function",
            "function_name": "factorial",
            "testCases": [
              {
                "input": { "n": 5 },
                "expectedOutput": "120"
              },
              {
                "input": { "n": 3 },
                "expectedOutput": "6"
              },
              {
                "input": { "n": 1 },
                "expectedOutput": "1"
              },
              {
                "input": { "n": 7 },
                "expectedOutput": "5040"
              }
            ]
          }
        ]
      },
      {
        "id": "arrow-functions",
        "title": "Arrow Functions",
        "outcomes": [
          "Arrow Syntax: The Modern Function Expression",
          "Concise vs. Full Body: Knowing when to use { }",
          "Parameter Formatting: Rules for () and single inputs",
          "Implicit Return: Returning values without the keyword",
          "The Object Trap: Returning Object Literals safely",
          "Functional Synergy: Arrow Functions with Array Methods",
          "Lexical this: How arrows inherit context",
          "Architectural Constraints: When to stick to regular functions"
        ],
        "tasks": [
          {
            "description": "// Create an arrow function named greet that takes no parameters\n// The function should return \"Hello!\"\n// Call the function and print the result\n// Your output should be: Hello!",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "Hello!"
              }
            ]
          },
          {
            "description": "// Create an arrow function named square that takes one parameter: num\n// Return the square of num\n// Test it with square(5) and print the result\n// Your output should be: 25",
            "solution_type": "function",
            "function_name": "square",
            "testCases": [
              {
                "input": { "num": 5 },
                "expectedOutput": "25"
              },
              {
                "input": { "num": 7 },
                "expectedOutput": "49"
              },
              {
                "input": { "num": 10 },
                "expectedOutput": "100"
              },
              {
                "input": { "num": 0 },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Create an arrow function named multiply that takes two parameters: a and b\n// Return the product of a and b\n// Test it with multiply(6, 7) and print the result\n// Your output should be: 42",
            "solution_type": "function",
            "function_name": "multiply",
            "testCases": [
              {
                "input": { "a": 6, "b": 7 },
                "expectedOutput": "42"
              },
              {
                "input": { "a": 5, "b": 5 },
                "expectedOutput": "25"
              },
              {
                "input": { "a": 10, "b": 3 },
                "expectedOutput": "30"
              },
              {
                "input": { "a": 0, "b": 100 },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Create an arrow function named isPositive that takes one parameter: num\n// Return true if num is greater than 0, false otherwise\n// Test it with isPositive(5) and print the result\n// Your output should be: true",
            "solution_type": "function",
            "function_name": "isPositive",
            "testCases": [
              {
                "input": { "num": 5 },
                "expectedOutput": "true"
              },
              {
                "input": { "num": -3 },
                "expectedOutput": "false"
              },
              {
                "input": { "num": 0 },
                "expectedOutput": "false"
              },
              {
                "input": { "num": 100 },
                "expectedOutput": "true"
              }
            ]
          },
          {
            "description": "// Create an arrow function named getFullName that takes two parameters: firstName and lastName\n// Return the full name with a space between first and last name\n// Test it with getFullName(\"John\", \"Doe\") and print the result\n// Your output should be: John Doe",
            "solution_type": "function",
            "function_name": "getFullName",
            "testCases": [
              {
                "input": { "firstName": "John", "lastName": "Doe" },
                "expectedOutput": "John Doe"
              },
              {
                "input": { "firstName": "Jane", "lastName": "Smith" },
                "expectedOutput": "Jane Smith"
              },
              {
                "input": { "firstName": "Alice", "lastName": "Johnson" },
                "expectedOutput": "Alice Johnson"
              },
              {
                "input": { "firstName": "Bob", "lastName": "Brown" },
                "expectedOutput": "Bob Brown"
              }
            ]
          },
          {
            "description": "// Create an arrow function named createPerson that takes two parameters: name and age\n// Return an object with properties name and age\n// Test it with createPerson(\"Alice\", 25) and print the result as JSON string using JSON.stringify\n// Your output should be: {\"name\":\"Alice\",\"age\":25}",
            "solution_type": "function",
            "function_name": "createPerson",
            "testCases": [
              {
                "input": { "name": "Alice", "age": 25 },
                "expectedOutput": "{\"name\":\"Alice\",\"age\":25}"
              },
              {
                "input": { "name": "Bob", "age": 30 },
                "expectedOutput": "{\"name\":\"Bob\",\"age\":30}"
              },
              {
                "input": { "name": "Charlie", "age": 22 },
                "expectedOutput": "{\"name\":\"Charlie\",\"age\":22}"
              },
              {
                "input": { "name": "Diana", "age": 28 },
                "expectedOutput": "{\"name\":\"Diana\",\"age\":28}"
              }
            ]
          },
          {
            "description": "// Create an arrow function named filterEven that takes one parameter: arr (array of numbers)\n// Return a new array containing only the even numbers from arr\n// Test it with filterEven([1, 2, 3, 4, 5, 6]) and print the result as JSON string\n// Your output should be: [2,4,6]",
            "solution_type": "function",
            "function_name": "filterEven",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5, 6] },
                "expectedOutput": "[2,4,6]"
              },
              {
                "input": { "arr": [10, 15, 20, 25] },
                "expectedOutput": "[10,20]"
              },
              {
                "input": { "arr": [1, 3, 5, 7] },
                "expectedOutput": "[]"
              },
              {
                "input": { "arr": [2, 4, 6, 8] },
                "expectedOutput": "[2,4,6,8]"
              }
            ]
          },
          {
            "description": "// Create an arrow function named doubleValues that takes one parameter: arr (array of numbers)\n// Return a new array with all values doubled\n// Test it with doubleValues([1, 2, 3, 4]) and print the result as JSON string\n// Your output should be: [2,4,6,8]",
            "solution_type": "function",
            "function_name": "doubleValues",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4] },
                "expectedOutput": "[2,4,6,8]"
              },
              {
                "input": { "arr": [5, 10, 15] },
                "expectedOutput": "[10,20,30]"
              },
              {
                "input": { "arr": [0, 1, 2] },
                "expectedOutput": "[0,2,4]"
              },
              {
                "input": { "arr": [7] },
                "expectedOutput": "[14]"
              }
            ]
          },
          {
            "description": "// Create an arrow function named sumAll that takes one parameter: arr (array of numbers)\n// Return the sum of all elements in the array\n// Test it with sumAll([1, 2, 3, 4, 5]) and print the result\n// Your output should be: 15",
            "solution_type": "function",
            "function_name": "sumAll",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5] },
                "expectedOutput": "15"
              },
              {
                "input": { "arr": [10, 20, 30] },
                "expectedOutput": "60"
              },
              {
                "input": { "arr": [5] },
                "expectedOutput": "5"
              },
              {
                "input": { "arr": [0, 0, 0] },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Create an arrow function named getLengths that takes one parameter: arr (array of strings)\n// Return a new array containing the length of each string\n// Test it with getLengths([\"hi\", \"hello\", \"hey\"]) and print the result as JSON string\n// Your output should be: [2,5,3]",
            "solution_type": "function",
            "function_name": "getLengths",
            "testCases": [
              {
                "input": { "arr": ["hi", "hello", "hey"] },
                "expectedOutput": "[2,5,3]"
              },
              {
                "input": { "arr": ["JavaScript", "is", "awesome"] },
                "expectedOutput": "[10,2,7]"
              },
              {
                "input": { "arr": ["a", "ab", "abc"] },
                "expectedOutput": "[1,2,3]"
              },
              {
                "input": { "arr": [""] },
                "expectedOutput": "[0]"
              }
            ]
          },
          {
            "description": "// Create an arrow function named getAdults that takes one parameter: people\n// people is an array of objects with properties: name and age\n// Return a new array containing only people who are 18 or older\n// Test it with getAdults([{name: \"Alice\", age: 25}, {name: \"Bob\", age: 15}])\n// Print the result as JSON string\n// Your output should be: [{\"name\":\"Alice\",\"age\":25}]",
            "solution_type": "function",
            "function_name": "getAdults",
            "testCases": [
              {
                "input": { "people": [{ "name": "Alice", "age": 25 }, { "name": "Bob", "age": 15 }] },
                "expectedOutput": "[{\"name\":\"Alice\",\"age\":25}]"
              },
              {
                "input": { "people": [{ "name": "Charlie", "age": 30 }, { "name": "Diana", "age": 20 }, { "name": "Eve", "age": 17 }] },
                "expectedOutput": "[{\"name\":\"Charlie\",\"age\":30},{\"name\":\"Diana\",\"age\":20}]"
              },
              {
                "input": { "people": [{ "name": "Frank", "age": 18 }] },
                "expectedOutput": "[{\"name\":\"Frank\",\"age\":18}]"
              },
              {
                "input": { "people": [{ "name": "Grace", "age": 10 }, { "name": "Henry", "age": 12 }] },
                "expectedOutput": "[]"
              }
            ]
          },
          {
            "description": "// Create an arrow function named calculator that takes three parameters: a, b, operation\n// operation is a string: \"add\", \"subtract\", \"multiply\", or \"divide\"\n// Return the result of performing the specified operation on a and b\n// Test it with calculator(10, 5, \"add\") and print the result\n// Your output should be: 15",
            "solution_type": "function",
            "function_name": "calculator",
            "testCases": [
              {
                "input": { "a": 10, "b": 5, "operation": "add" },
                "expectedOutput": "15"
              },
              {
                "input": { "a": 10, "b": 5, "operation": "subtract" },
                "expectedOutput": "5"
              },
              {
                "input": { "a": 10, "b": 5, "operation": "multiply" },
                "expectedOutput": "50"
              },
              {
                "input": { "a": 10, "b": 5, "operation": "divide" },
                "expectedOutput": "2"
              }
            ]
          }
        ]
      },
      {
        "id": "recursion",
        "title": "Functions Calling Themselves",
        "outcomes": [
          "Recursion: Functions that call themselves",
          "The Base Case: The Stopping Condition",
          "The Recursive Case: Moving toward the end",
          "The Call Stack: Visualizing Function Nesting",
          "Return Value Propagation: Passing data back up the chain",
          "Recursive Problem Solving: Breaking big tasks into smaller ones",
          "Architectural Choice: Recursion vs. Iteration",
          "Stack Overflow: The risk of infinite recursion",
          "Tail Recursion: An introduction to optimization"
        ],
        "tasks": [
          {
            "description": "// Create a recursive function named countdown that takes one parameter: n\n// The function should print numbers from n down to 1\n// Stop when n reaches 0 or less\n// Test it with countdown(5) and your output should be:\n// 5\n// 4\n// 3\n// 2\n// 1",
            "solution_type": "function",
            "function_name": "countdown",
            "testCases": [
              {
                "input": { "n": 5 },
                "expectedOutput": "5\n4\n3\n2\n1"
              },
              {
                "input": { "n": 3 },
                "expectedOutput": "3\n2\n1"
              },
              {
                "input": { "n": 1 },
                "expectedOutput": "1"
              },
              {
                "input": { "n": 0 },
                "expectedOutput": ""
              }
            ]
          },
          {
            "description": "// Create a recursive function named sumToN that takes one parameter: n\n// Return the sum of all numbers from 1 to n\n// Test it with sumToN(5) and print the result\n// Your output should be: 15",
            "solution_type": "function",
            "function_name": "sumToN",
            "testCases": [
              {
                "input": { "n": 5 },
                "expectedOutput": "15"
              },
              {
                "input": { "n": 10 },
                "expectedOutput": "55"
              },
              {
                "input": { "n": 1 },
                "expectedOutput": "1"
              },
              {
                "input": { "n": 7 },
                "expectedOutput": "28"
              }
            ]
          },
          {
            "description": "// Create a recursive function named factorial that takes one parameter: n\n// Return the factorial of n (n! = n × (n-1) × (n-2) × ... × 1)\n// Test it with factorial(5) and print the result\n// Your output should be: 120",
            "solution_type": "function",
            "function_name": "factorial",
            "testCases": [
              {
                "input": { "n": 5 },
                "expectedOutput": "120"
              },
              {
                "input": { "n": 3 },
                "expectedOutput": "6"
              },
              {
                "input": { "n": 0 },
                "expectedOutput": "1"
              },
              {
                "input": { "n": 7 },
                "expectedOutput": "5040"
              }
            ]
          },
          {
            "description": "// Create a recursive function named power that takes two parameters: base and exponent\n// Return base raised to the power of exponent\n// Test it with power(2, 3) and print the result\n// Your output should be: 8",
            "solution_type": "function",
            "function_name": "power",
            "testCases": [
              {
                "input": { "base": 2, "exponent": 3 },
                "expectedOutput": "8"
              },
              {
                "input": { "base": 5, "exponent": 2 },
                "expectedOutput": "25"
              },
              {
                "input": { "base": 10, "exponent": 0 },
                "expectedOutput": "1"
              },
              {
                "input": { "base": 3, "exponent": 4 },
                "expectedOutput": "81"
              }
            ]
          },
          {
            "description": "// Create a recursive function named countDigits that takes one parameter: num\n// Return the count of digits in num\n// Test it with countDigits(12345) and print the result\n// Your output should be: 5",
            "solution_type": "function",
            "function_name": "countDigits",
            "testCases": [
              {
                "input": { "num": 12345 },
                "expectedOutput": "5"
              },
              {
                "input": { "num": 999 },
                "expectedOutput": "3"
              },
              {
                "input": { "num": 7 },
                "expectedOutput": "1"
              },
              {
                "input": { "num": 1000000 },
                "expectedOutput": "7"
              }
            ]
          },
          {
            "description": "// Create a recursive function named fibonacci that takes one parameter: n\n// Return the nth Fibonacci number\n// Fibonacci sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21...\n// Test it with fibonacci(6) and print the result\n// Your output should be: 8",
            "solution_type": "function",
            "function_name": "fibonacci",
            "testCases": [
              {
                "input": { "n": 6 },
                "expectedOutput": "8"
              },
              {
                "input": { "n": 0 },
                "expectedOutput": "0"
              },
              {
                "input": { "n": 1 },
                "expectedOutput": "1"
              },
              {
                "input": { "n": 8 },
                "expectedOutput": "21"
              }
            ]
          },
          {
            "description": "// Create a recursive function named reverseString that takes one parameter: str\n// Return the reversed string\n// Test it with reverseString(\"hello\") and print the result\n// Your output should be: olleh",
            "solution_type": "function",
            "function_name": "reverseString",
            "testCases": [
              {
                "input": { "str": "hello" },
                "expectedOutput": "olleh"
              },
              {
                "input": { "str": "world" },
                "expectedOutput": "dlrow"
              },
              {
                "input": { "str": "a" },
                "expectedOutput": "a"
              },
              {
                "input": { "str": "JavaScript" },
                "expectedOutput": "tpircSavaJ"
              }
            ]
          },
          {
            "description": "// Create a recursive function named sumArray that takes one parameter: arr (array of numbers)\n// Return the sum of all elements in the array\n// Test it with sumArray([1, 2, 3, 4, 5]) and print the result\n// Your output should be: 15",
            "solution_type": "function",
            "function_name": "sumArray",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5] },
                "expectedOutput": "15"
              },
              {
                "input": { "arr": [10, 20, 30] },
                "expectedOutput": "60"
              },
              {
                "input": { "arr": [5] },
                "expectedOutput": "5"
              },
              {
                "input": { "arr": [] },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Create a recursive function named isPalindrome that takes one parameter: str\n// Return true if str is a palindrome, false otherwise\n// A palindrome reads the same forwards and backwards\n// Test it with isPalindrome(\"racecar\") and print the result\n// Your output should be: true",
            "solution_type": "function",
            "function_name": "isPalindrome",
            "testCases": [
              {
                "input": { "str": "racecar" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "hello" },
                "expectedOutput": "false"
              },
              {
                "input": { "str": "madam" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "a" },
                "expectedOutput": "true"
              }
            ]
          },
          {
            "description": "// Create a recursive function named findMax that takes one parameter: arr (array of numbers)\n// Return the maximum number in the array\n// Test it with findMax([3, 7, 2, 9, 4]) and print the result\n// Your output should be: 9",
            "solution_type": "function",
            "function_name": "findMax",
            "testCases": [
              {
                "input": { "arr": [3, 7, 2, 9, 4] },
                "expectedOutput": "9"
              },
              {
                "input": { "arr": [1, 2, 3, 4, 5] },
                "expectedOutput": "5"
              },
              {
                "input": { "arr": [100] },
                "expectedOutput": "100"
              },
              {
                "input": { "arr": [50, 25, 75, 10] },
                "expectedOutput": "75"
              }
            ]
          },
          {
            "description": "// Create a recursive function named countOccurrences that takes two parameters: arr and target\n// Return the count of how many times target appears in arr\n// Test it with countOccurrences([1, 2, 3, 2, 4, 2], 2) and print the result\n// Your output should be: 3",
            "solution_type": "function",
            "function_name": "countOccurrences",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 2, 4, 2], "target": 2 },
                "expectedOutput": "3"
              },
              {
                "input": { "arr": [5, 5, 5, 5], "target": 5 },
                "expectedOutput": "4"
              },
              {
                "input": { "arr": [1, 2, 3], "target": 4 },
                "expectedOutput": "0"
              },
              {
                "input": { "arr": [7], "target": 7 },
                "expectedOutput": "1"
              }
            ]
          },
          {
            "description": "// Create a recursive function named flatten that takes one parameter: arr\n// arr can contain nested arrays at any depth\n// Return a new flattened array with all elements at the top level\n// Example: [1, [2, 3], [4, [5, 6]]] should become [1, 2, 3, 4, 5, 6]\n// Test it with flatten([1, [2, 3], [4, [5, 6]]]) and print result as JSON string\n// Your output should be: [1,2,3,4,5,6]",
            "solution_type": "function",
            "function_name": "flatten",
            "testCases": [
              {
                "input": { "arr": [1, [2, 3], [4, [5, 6]]] },
                "expectedOutput": "[1,2,3,4,5,6]"
              },
              {
                "input": { "arr": [1, 2, 3] },
                "expectedOutput": "[1,2,3]"
              },
              {
                "input": { "arr": [[1], [2], [3]] },
                "expectedOutput": "[1,2,3]"
              },
              {
                "input": { "arr": [] },
                "expectedOutput": "[]"
              }
            ]
          }
        ]
      },
      {
        "id": "closures",
        "title": "Functions remembering their scope",
        "outcomes": [
          "What is a Closure: The persistent link to Lexical Scope",
          "Data Privacy: Creating \"Private\" Variables in JS",
          "Function Factories: Generating Specialized Logic",
          "State Preservation: The Counter Pattern",
          "Loop Challenges: Understanding Closures in Iteration",
          "Practical Use Cases: Memoization and Event Logic"
        ],
        "tasks": [
          {
            "description": "// Create a function named createGreeting that takes one parameter: greeting\n// Return an inner function that takes a name parameter\n// The inner function should return greeting + name\n// Test it by creating a greeter with \"Hello, \" and calling it with \"Alice\"\n// Your output should be: Hello, Alice",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "greeting": "Hello, ", "name": "Alice" },
                "expectedOutput": "Hello, Alice"
              },
              {
                "input": { "greeting": "Hi, ", "name": "Bob" },
                "expectedOutput": "Hi, Bob"
              },
              {
                "input": { "greeting": "Welcome, ", "name": "Charlie" },
                "expectedOutput": "Welcome, Charlie"
              }
            ]
          },
          {
            "description": "// Create a function named createCounter that takes no parameters\n// Return an object with two methods: increment and getValue\n// increment should increase an internal count by 1\n// getValue should return the current count\n// The count should start at 0 and persist across method calls\n// Test by creating a counter, calling increment twice, then getValue\n// Your output should be: 2",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "operations": ["increment", "increment", "getValue"] },
                "expectedOutput": "2"
              },
              {
                "input": { "operations": ["increment", "getValue"] },
                "expectedOutput": "1"
              },
              {
                "input": { "operations": ["getValue"] },
                "expectedOutput": "0"
              },
              {
                "input": { "operations": ["increment", "increment", "increment", "getValue"] },
                "expectedOutput": "3"
              }
            ]
          },
          {
            "description": "// Create a function named createMultiplier that takes one parameter: multiplier\n// Return a function that takes a number and returns it multiplied by multiplier\n// Test by creating a doubler (multiplier = 2) and calling it with 5\n// Your output should be: 10",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "multiplier": 2, "number": 5 },
                "expectedOutput": "10"
              },
              {
                "input": { "multiplier": 3, "number": 7 },
                "expectedOutput": "21"
              },
              {
                "input": { "multiplier": 10, "number": 4 },
                "expectedOutput": "40"
              },
              {
                "input": { "multiplier": 5, "number": 0 },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Create a function named createAdder that takes one parameter: x\n// Return a function that takes a parameter y and returns x + y\n// Test by creating an adder with x = 10 and calling it with y = 5\n// Your output should be: 15",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "x": 10, "y": 5 },
                "expectedOutput": "15"
              },
              {
                "input": { "x": 100, "y": 50 },
                "expectedOutput": "150"
              },
              {
                "input": { "x": 7, "y": 3 },
                "expectedOutput": "10"
              },
              {
                "input": { "x": 0, "y": 0 },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Create a function named secretKeeper that takes one parameter: secret\n// Return an object with two methods: getSecret and setSecret\n// getSecret should return the current secret\n// setSecret should take a new value and update the secret\n// The secret variable should not be directly accessible from outside\n// Test by creating a keeper with \"myPassword\", calling getSecret\n// Your output should be: myPassword",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "secret": "myPassword", "operations": [{ "method": "getSecret" }] },
                "expectedOutput": "myPassword"
              },
              {
                "input": { "secret": "initial", "operations": [{ "method": "setSecret", "value": "updated" }, { "method": "getSecret" }] },
                "expectedOutput": "updated"
              },
              {
                "input": { "secret": "test123", "operations": [{ "method": "getSecret" }] },
                "expectedOutput": "test123"
              }
            ]
          },
          {
            "description": "// Create a function named createBankAccount that takes one parameter: initialBalance\n// Return an object with three methods: deposit, withdraw, and getBalance\n// deposit should add to the balance and return the new balance\n// withdraw should subtract from the balance and return the new balance\n// getBalance should return the current balance\n// Test by creating account with 100, depositing 50, then getting balance\n// Your output should be: 150",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "initialBalance": 100, "operations": [{ "method": "deposit", "amount": 50 }, { "method": "getBalance" }] },
                "expectedOutput": "150"
              },
              {
                "input": { "initialBalance": 200, "operations": [{ "method": "withdraw", "amount": 50 }, { "method": "getBalance" }] },
                "expectedOutput": "150"
              },
              {
                "input": { "initialBalance": 500, "operations": [{ "method": "getBalance" }] },
                "expectedOutput": "500"
              },
              {
                "input": { "initialBalance": 100, "operations": [{ "method": "deposit", "amount": 25 }, { "method": "withdraw", "amount": 25 }, { "method": "getBalance" }] },
                "expectedOutput": "100"
              }
            ]
          },
          {
            "description": "// Create a function named createLimitedCounter that takes one parameter: limit\n// Return an object with two methods: increment and getValue\n// increment should increase count by 1, but not exceed the limit\n// getValue should return the current count\n// Count starts at 0\n// Test by creating counter with limit 3, incrementing 5 times, then getValue\n// Your output should be: 3",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "limit": 3, "increments": 5 },
                "expectedOutput": "3"
              },
              {
                "input": { "limit": 5, "increments": 3 },
                "expectedOutput": "3"
              },
              {
                "input": { "limit": 10, "increments": 10 },
                "expectedOutput": "10"
              },
              {
                "input": { "limit": 2, "increments": 0 },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Create a function named createLogger that takes one parameter: prefix\n// Return a function that takes a message parameter\n// The returned function should print prefix + \": \" + message\n// Test by creating logger with \"INFO\" and calling it with \"Server started\"\n// Your output should be: INFO: Server started",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "prefix": "INFO", "message": "Server started" },
                "expectedOutput": "INFO: Server started"
              },
              {
                "input": { "prefix": "ERROR", "message": "Connection failed" },
                "expectedOutput": "ERROR: Connection failed"
              },
              {
                "input": { "prefix": "WARNING", "message": "Low memory" },
                "expectedOutput": "WARNING: Low memory"
              }
            ]
          },
          {
            "description": "// Create a function named createTemperatureConverter that takes one parameter: unit\n// unit can be \"C\" for Celsius or \"F\" for Fahrenheit\n// Return a function that takes a temperature value\n// If unit is \"C\", convert Celsius to Fahrenheit: (C × 9/5) + 32\n// If unit is \"F\", convert Fahrenheit to Celsius: (F - 32) × 5/9\n// Test by creating converter with \"C\" and calling it with 0\n// Your output should be: 32",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "unit": "C", "value": 0 },
                "expectedOutput": "32"
              },
              {
                "input": { "unit": "F", "value": 32 },
                "expectedOutput": "0"
              },
              {
                "input": { "unit": "C", "value": 100 },
                "expectedOutput": "212"
              },
              {
                "input": { "unit": "F", "value": 212 },
                "expectedOutput": "100"
              }
            ]
          },
          {
            "description": "// Create a function named createIdGenerator that takes no parameters\n// Return a function that generates sequential IDs starting from 1\n// Each call to the returned function should return the next ID\n// Test by creating generator and calling it three times, print last result\n// Your output should be: 3",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "calls": 3 },
                "expectedOutput": "3"
              },
              {
                "input": { "calls": 1 },
                "expectedOutput": "1"
              },
              {
                "input": { "calls": 5 },
                "expectedOutput": "5"
              },
              {
                "input": { "calls": 10 },
                "expectedOutput": "10"
              }
            ]
          },
          {
            "description": "// Create a function named once that takes one parameter: fn (a function)\n// Return a new function that can only be called once\n// The first call executes fn and returns its result\n// Subsequent calls return the same result without executing fn again\n// Test by creating a once wrapper for a function that returns a random string\n// Call it twice and verify both calls return the same value\n// For testing: wrap a function that returns \"first\" on all calls\n// Your output should be: first",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "functionResult": "first", "calls": 2 },
                "expectedOutput": "first"
              },
              {
                "input": { "functionResult": "test", "calls": 5 },
                "expectedOutput": "test"
              },
              {
                "input": { "functionResult": "value", "calls": 1 },
                "expectedOutput": "value"
              }
            ]
          },
          {
            "description": "// Create a function named createCalculator that takes no parameters\n// Return an object with methods: add, subtract, multiply, divide, and getValue\n// Each operation method takes a number and performs that operation on internal total\n// getValue returns the current total\n// Total starts at 0\n// Test by creating calculator, adding 10, multiplying by 2, then getValue\n// Your output should be: 20",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "operations": [{ "method": "add", "value": 10 }, { "method": "multiply", "value": 2 }, { "method": "getValue" }] },
                "expectedOutput": "20"
              },
              {
                "input": { "operations": [{ "method": "add", "value": 100 }, { "method": "subtract", "value": 50 }, { "method": "getValue" }] },
                "expectedOutput": "50"
              },
              {
                "input": { "operations": [{ "method": "add", "value": 20 }, { "method": "divide", "value": 4 }, { "method": "getValue" }] },
                "expectedOutput": "5"
              },
              {
                "input": { "operations": [{ "method": "getValue" }] },
                "expectedOutput": "0"
              }
            ]
          }
        ]
      },
      {
        "id": "foreach",
        "title": "forEach for iteration",
        "outcomes": [
          "forEach Syntax: Functional List Traversal",
          "Callback Parameters: Accessing Element, Index, and Array",
          "The Void Return: Understanding why forEach returns undefined",
          "Side Effects: Performing Actions per Iteration"
        ],
        "tasks": [
          {
            "description": "// Given an array of numbers: [1, 2, 3, 4, 5]\n// Use forEach to print each number\n// Your output should be:\n// 1\n// 2\n// 3\n// 4\n// 5",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5] },
                "expectedOutput": "1\n2\n3\n4\n5"
              },
              {
                "input": { "arr": [10, 20, 30] },
                "expectedOutput": "10\n20\n30"
              },
              {
                "input": { "arr": [7] },
                "expectedOutput": "7"
              }
            ]
          },
          {
            "description": "// Given an array of strings: [\"apple\", \"banana\", \"cherry\"]\n// Use forEach to print each string in uppercase\n// Your output should be:\n// APPLE\n// BANANA\n// CHERRY",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["apple", "banana", "cherry"] },
                "expectedOutput": "APPLE\nBANANA\nCHERRY"
              },
              {
                "input": { "arr": ["hello", "world"] },
                "expectedOutput": "HELLO\nWORLD"
              },
              {
                "input": { "arr": ["test"] },
                "expectedOutput": "TEST"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [2, 4, 6, 8]\n// Use forEach to print each number doubled\n// Your output should be:\n// 4\n// 8\n// 12\n// 16",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [2, 4, 6, 8] },
                "expectedOutput": "4\n8\n12\n16"
              },
              {
                "input": { "arr": [1, 3, 5] },
                "expectedOutput": "2\n6\n10"
              },
              {
                "input": { "arr": [10] },
                "expectedOutput": "20"
              }
            ]
          },
          {
            "description": "// Given an array of strings: [\"cat\", \"dog\", \"bird\"]\n// Use forEach with index parameter to print: \"Index 0: cat\" for each element\n// Your output should be:\n// Index 0: cat\n// Index 1: dog\n// Index 2: bird",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["cat", "dog", "bird"] },
                "expectedOutput": "Index 0: cat\nIndex 1: dog\nIndex 2: bird"
              },
              {
                "input": { "arr": ["apple", "banana"] },
                "expectedOutput": "Index 0: apple\nIndex 1: banana"
              },
              {
                "input": { "arr": ["test"] },
                "expectedOutput": "Index 0: test"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [5, 10, 15, 20]\n// Use forEach to calculate and print the sum of all elements\n// Hint: Initialize a variable before forEach to accumulate the sum\n// Your output should be: 50",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [5, 10, 15, 20] },
                "expectedOutput": "50"
              },
              {
                "input": { "arr": [1, 2, 3, 4] },
                "expectedOutput": "10"
              },
              {
                "input": { "arr": [100] },
                "expectedOutput": "100"
              },
              {
                "input": { "arr": [0, 0, 0] },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [3, 7, 2, 9, 1]\n// Use forEach to find and print the maximum value\n// Your output should be: 9",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [3, 7, 2, 9, 1] },
                "expectedOutput": "9"
              },
              {
                "input": { "arr": [5, 15, 10] },
                "expectedOutput": "15"
              },
              {
                "input": { "arr": [42] },
                "expectedOutput": "42"
              },
              {
                "input": { "arr": [1, 1, 1] },
                "expectedOutput": "1"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [1, 2, 3, 4, 5, 6]\n// Use forEach to print only the even numbers\n// Your output should be:\n// 2\n// 4\n// 6",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5, 6] },
                "expectedOutput": "2\n4\n6"
              },
              {
                "input": { "arr": [10, 15, 20, 25] },
                "expectedOutput": "10\n20"
              },
              {
                "input": { "arr": [1, 3, 5] },
                "expectedOutput": ""
              },
              {
                "input": { "arr": [8] },
                "expectedOutput": "8"
              }
            ]
          },
          {
            "description": "// Given an array: [{name: \"Alice\", age: 25}, {name: \"Bob\", age: 30}]\n// Use forEach to print each person's name\n// Your output should be:\n// Alice\n// Bob",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [{ "name": "Alice", "age": 25 }, { "name": "Bob", "age": 30 }] },
                "expectedOutput": "Alice\nBob"
              },
              {
                "input": { "arr": [{ "name": "Charlie", "age": 22 }] },
                "expectedOutput": "Charlie"
              },
              {
                "input": { "arr": [{ "name": "Diana", "age": 28 }, { "name": "Eve", "age": 35 }, { "name": "Frank", "age": 40 }] },
                "expectedOutput": "Diana\nEve\nFrank"
              }
            ]
          }
        ]
      },
      {
        "id": "map",
        "title": "map for transformation",
        "outcomes": [
          "map Syntax: Projecting Data to a New Array",
          "Functional Transformation: The Mapping Logic",
          "Index Preservation: Why Input and Output Length Match",
          "Immutability: Protecting the Original Data Source"
        ],
        "tasks": [
          {
            "description": "// Given an array of numbers: [1, 2, 3, 4, 5]\n// Use map to create a new array with each number doubled\n// Print the new array as JSON string\n// Your output should be: [2,4,6,8,10]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5] },
                "expectedOutput": "[2,4,6,8,10]"
              },
              {
                "input": { "arr": [10, 20, 30] },
                "expectedOutput": "[20,40,60]"
              },
              {
                "input": { "arr": [0] },
                "expectedOutput": "[0]"
              },
              {
                "input": { "arr": [7, 14] },
                "expectedOutput": "[14,28]"
              }
            ]
          },
          {
            "description": "// Given an array of strings: [\"hello\", \"world\", \"javascript\"]\n// Use map to create a new array with each string in uppercase\n// Print the new array as JSON string\n// Your output should be: [\"HELLO\",\"WORLD\",\"JAVASCRIPT\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["hello", "world", "javascript"] },
                "expectedOutput": "[\"HELLO\",\"WORLD\",\"JAVASCRIPT\"]"
              },
              {
                "input": { "arr": ["apple", "banana"] },
                "expectedOutput": "[\"APPLE\",\"BANANA\"]"
              },
              {
                "input": { "arr": ["test"] },
                "expectedOutput": "[\"TEST\"]"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [1, 2, 3, 4]\n// Use map to create a new array with each number squared\n// Print the new array as JSON string\n// Your output should be: [1,4,9,16]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4] },
                "expectedOutput": "[1,4,9,16]"
              },
              {
                "input": { "arr": [5, 10] },
                "expectedOutput": "[25,100]"
              },
              {
                "input": { "arr": [0] },
                "expectedOutput": "[0]"
              },
              {
                "input": { "arr": [3, 7] },
                "expectedOutput": "[9,49]"
              }
            ]
          },
          {
            "description": "// Given an array of strings: [\"cat\", \"elephant\", \"dog\"]\n// Use map to create a new array containing the length of each string\n// Print the new array as JSON string\n// Your output should be: [3,8,3]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["cat", "elephant", "dog"] },
                "expectedOutput": "[3,8,3]"
              },
              {
                "input": { "arr": ["hi", "hello", "hey"] },
                "expectedOutput": "[2,5,3]"
              },
              {
                "input": { "arr": [""] },
                "expectedOutput": "[0]"
              },
              {
                "input": { "arr": ["JavaScript"] },
                "expectedOutput": "[10]"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [10, 20, 30, 40]\n// Use map to create a new array with each number divided by 10\n// Print the new array as JSON string\n// Your output should be: [1,2,3,4]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [10, 20, 30, 40] },
                "expectedOutput": "[1,2,3,4]"
              },
              {
                "input": { "arr": [50, 100] },
                "expectedOutput": "[5,10]"
              },
              {
                "input": { "arr": [0] },
                "expectedOutput": "[0]"
              },
              {
                "input": { "arr": [70] },
                "expectedOutput": "[7]"
              }
            ]
          },
          {
            "description": "// Given an array: [{name: \"Alice\", age: 25}, {name: \"Bob\", age: 30}]\n// Use map to create a new array containing only the names\n// Print the new array as JSON string\n// Your output should be: [\"Alice\",\"Bob\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [{ "name": "Alice", "age": 25 }, { "name": "Bob", "age": 30 }] },
                "expectedOutput": "[\"Alice\",\"Bob\"]"
              },
              {
                "input": { "arr": [{ "name": "Charlie", "age": 22 }] },
                "expectedOutput": "[\"Charlie\"]"
              },
              {
                "input": { "arr": [{ "name": "Diana", "age": 28 }, { "name": "Eve", "age": 35 }] },
                "expectedOutput": "[\"Diana\",\"Eve\"]"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [5, 10, 15, 20]\n// Use map to create a new array where each number has 100 added to it\n// Print the new array as JSON string\n// Your output should be: [105,110,115,120]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [5, 10, 15, 20] },
                "expectedOutput": "[105,110,115,120]"
              },
              {
                "input": { "arr": [0, 50] },
                "expectedOutput": "[100,150]"
              },
              {
                "input": { "arr": [1] },
                "expectedOutput": "[101]"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [1, 2, 3, 4, 5]\n// Use map to create a new array where each number is converted to a boolean\n// Even numbers should be true, odd numbers should be false\n// Print the new array as JSON string\n// Your output should be: [false,true,false,true,false]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5] },
                "expectedOutput": "[false,true,false,true,false]"
              },
              {
                "input": { "arr": [10, 15, 20] },
                "expectedOutput": "[true,false,true]"
              },
              {
                "input": { "arr": [7] },
                "expectedOutput": "[false]"
              },
              {
                "input": { "arr": [8] },
                "expectedOutput": "[true]"
              }
            ]
          },
          {
            "description": "// Given an array: [{name: \"Alice\", score: 85}, {name: \"Bob\", score: 92}]\n// Use map to create a new array of strings formatted as: \"name: score\"\n// Print the new array as JSON string\n// Your output should be: [\"Alice: 85\",\"Bob: 92\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [{ "name": "Alice", "score": 85 }, { "name": "Bob", "score": 92 }] },
                "expectedOutput": "[\"Alice: 85\",\"Bob: 92\"]"
              },
              {
                "input": { "arr": [{ "name": "Charlie", "score": 78 }] },
                "expectedOutput": "[\"Charlie: 78\"]"
              },
              {
                "input": { "arr": [{ "name": "Diana", "score": 95 }, { "name": "Eve", "score": 88 }] },
                "expectedOutput": "[\"Diana: 95\",\"Eve: 88\"]"
              }
            ]
          },
          {
            "description": "// Given an array of strings: [\"1\", \"2\", \"3\", \"4\"]\n// Use map to create a new array with each string converted to a number\n// Print the new array as JSON string\n// Your output should be: [1,2,3,4]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["1", "2", "3", "4"] },
                "expectedOutput": "[1,2,3,4]"
              },
              {
                "input": { "arr": ["10", "20"] },
                "expectedOutput": "[10,20]"
              },
              {
                "input": { "arr": ["5"] },
                "expectedOutput": "[5]"
              },
              {
                "input": { "arr": ["0", "100"] },
                "expectedOutput": "[0,100]"
              }
            ]
          }
        ]
      },
      {
        "id": "filter",
        "title": "filter for selection",
        "outcomes": [
          "filter Syntax: Extracting Specific Data",
          "The Predicate Function: Returning Booleans for Selection",
          "Subset Generation: Why the Resulting Length May Differ",
          "Immutability: Filtering without Altering the Source"
        ],
        "tasks": [
          {
            "description": "// Given an array of numbers: [1, 2, 3, 4, 5, 6, 7, 8]\n// Use filter to create a new array containing only even numbers\n// Print the new array as JSON string\n// Your output should be: [2,4,6,8]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5, 6, 7, 8] },
                "expectedOutput": "[2,4,6,8]"
              },
              {
                "input": { "arr": [10, 15, 20, 25] },
                "expectedOutput": "[10,20]"
              },
              {
                "input": { "arr": [1, 3, 5] },
                "expectedOutput": "[]"
              },
              {
                "input": { "arr": [2, 4, 6] },
                "expectedOutput": "[2,4,6]"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [10, 25, 30, 45, 50, 60]\n// Use filter to create a new array containing only numbers greater than 30\n// Print the new array as JSON string\n// Your output should be: [45,50,60]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [10, 25, 30, 45, 50, 60] },
                "expectedOutput": "[45,50,60]"
              },
              {
                "input": { "arr": [5, 10, 15] },
                "expectedOutput": "[]"
              },
              {
                "input": { "arr": [100, 200] },
                "expectedOutput": "[100,200]"
              },
              {
                "input": { "arr": [31] },
                "expectedOutput": "[31]"
              }
            ]
          },
          {
            "description": "// Given an array of strings: [\"apple\", \"banana\", \"kiwi\", \"grape\", \"watermelon\"]\n// Use filter to create a new array containing only strings with length greater than 5\n// Print the new array as JSON string\n// Your output should be: [\"banana\",\"watermelon\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["apple", "banana", "kiwi", "grape", "watermelon"] },
                "expectedOutput": "[\"banana\",\"watermelon\"]"
              },
              {
                "input": { "arr": ["hi", "hello", "hey"] },
                "expectedOutput": "[]"
              },
              {
                "input": { "arr": ["JavaScript", "is", "awesome"] },
                "expectedOutput": "[\"JavaScript\",\"awesome\"]"
              },
              {
                "input": { "arr": ["test"] },
                "expectedOutput": "[]"
              }
            ]
          },
          {
            "description": "// Given an array: [{name: \"Alice\", age: 25}, {name: \"Bob\", age: 17}, {name: \"Charlie\", age: 30}]\n// Use filter to create a new array containing only people aged 18 or older\n// Print the new array as JSON string\n// Your output should be: [{\"name\":\"Alice\",\"age\":25},{\"name\":\"Charlie\",\"age\":30}]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [{ "name": "Alice", "age": 25 }, { "name": "Bob", "age": 17 }, { "name": "Charlie", "age": 30 }] },
                "expectedOutput": "[{\"name\":\"Alice\",\"age\":25},{\"name\":\"Charlie\",\"age\":30}]"
              },
              {
                "input": { "arr": [{ "name": "Diana", "age": 15 }, { "name": "Eve", "age": 16 }] },
                "expectedOutput": "[]"
              },
              {
                "input": { "arr": [{ "name": "Frank", "age": 18 }] },
                "expectedOutput": "[{\"name\":\"Frank\",\"age\":18}]"
              },
              {
                "input": { "arr": [{ "name": "Grace", "age": 20 }, { "name": "Henry", "age": 22 }] },
                "expectedOutput": "[{\"name\":\"Grace\",\"age\":20},{\"name\":\"Henry\",\"age\":22}]"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [5, 10, 15, 20, 25, 30]\n// Use filter to create a new array containing only numbers divisible by 10\n// Print the new array as JSON string\n// Your output should be: [10,20,30]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [5, 10, 15, 20, 25, 30] },
                "expectedOutput": "[10,20,30]"
              },
              {
                "input": { "arr": [3, 7, 11] },
                "expectedOutput": "[]"
              },
              {
                "input": { "arr": [100, 200, 300] },
                "expectedOutput": "[100,200,300]"
              },
              {
                "input": { "arr": [50] },
                "expectedOutput": "[50]"
              }
            ]
          },
          {
            "description": "// Given an array of strings: [\"hello\", \"world\", \"javascript\", \"code\"]\n// Use filter to create a new array containing only strings that start with the letter 'c'\n// Print the new array as JSON string\n// Your output should be: [\"code\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["hello", "world", "javascript", "code"] },
                "expectedOutput": "[\"code\"]"
              },
              {
                "input": { "arr": ["cat", "dog", "cow"] },
                "expectedOutput": "[\"cat\",\"cow\"]"
              },
              {
                "input": { "arr": ["apple", "banana"] },
                "expectedOutput": "[]"
              },
              {
                "input": { "arr": ["cherry"] },
                "expectedOutput": "[\"cherry\"]"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n// Use filter to create a new array containing only odd numbers\n// Print the new array as JSON string\n// Your output should be: [1,3,5,7,9]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                "expectedOutput": "[1,3,5,7,9]"
              },
              {
                "input": { "arr": [2, 4, 6, 8] },
                "expectedOutput": "[]"
              },
              {
                "input": { "arr": [11, 13, 15] },
                "expectedOutput": "[11,13,15]"
              },
              {
                "input": { "arr": [7] },
                "expectedOutput": "[7]"
              }
            ]
          },
          {
            "description": "// Given an array: [{name: \"Apple\", price: 1.5}, {name: \"Banana\", price: 0.8}, {name: \"Orange\", price: 2.0}]\n// Use filter to create a new array containing only items with price less than 1.0\n// Print the new array as JSON string\n// Your output should be: [{\"name\":\"Banana\",\"price\":0.8}]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [{ "name": "Apple", "price": 1.5 }, { "name": "Banana", "price": 0.8 }, { "name": "Orange", "price": 2.0 }] },
                "expectedOutput": "[{\"name\":\"Banana\",\"price\":0.8}]"
              },
              {
                "input": { "arr": [{ "name": "Grape", "price": 3.0 }, { "name": "Melon", "price": 5.0 }] },
                "expectedOutput": "[]"
              },
              {
                "input": { "arr": [{ "name": "Cherry", "price": 0.5 }] },
                "expectedOutput": "[{\"name\":\"Cherry\",\"price\":0.5}]"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]\n// Use filter to create a new array containing numbers between 3 and 7 (inclusive)\n// Print the new array as JSON string\n// Your output should be: [3,4,5,6,7]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
                "expectedOutput": "[3,4,5,6,7]"
              },
              {
                "input": { "arr": [1, 2, 8, 9] },
                "expectedOutput": "[]"
              },
              {
                "input": { "arr": [5, 6] },
                "expectedOutput": "[5,6]"
              },
              {
                "input": { "arr": [3, 7, 10] },
                "expectedOutput": "[3,7]"
              }
            ]
          },
          {
            "description": "// Given an array of strings: [\"a\", \"ab\", \"abc\", \"abcd\", \"abcde\"]\n// Use filter to create a new array containing strings with exactly 3 characters\n// Print the new array as JSON string\n// Your output should be: [\"abc\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["a", "ab", "abc", "abcd", "abcde"] },
                "expectedOutput": "[\"abc\"]"
              },
              {
                "input": { "arr": ["cat", "dog", "bird"] },
                "expectedOutput": "[\"cat\",\"dog\"]"
              },
              {
                "input": { "arr": ["hello", "hi"] },
                "expectedOutput": "[]"
              },
              {
                "input": { "arr": ["sun"] },
                "expectedOutput": "[\"sun\"]"
              }
            ]
          }
        ]
      },
      {
        "id": "find-findindex",
        "title": "find and findIndex",
        "outcomes": [
          "find Syntax: Retrieving the First Matching Element",
          "findIndex Syntax: Locating the Position of a Match",
          "Search Failure (Value): Handling undefined in find",
          "Search Failure (Index): Handling -1 in findIndex",
          "Efficiency: Understanding why searching stops at the first match"
        ],
        "tasks": [
          {
            "description": "// Given an array of numbers: [5, 10, 15, 20, 25]\n// Use find to get the first number greater than 12\n// Print the result\n// Your output should be: 15",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [5, 10, 15, 20, 25] },
                "expectedOutput": "15"
              },
              {
                "input": { "arr": [1, 2, 3] },
                "expectedOutput": "undefined"
              },
              {
                "input": { "arr": [13, 14, 15] },
                "expectedOutput": "13"
              },
              {
                "input": { "arr": [100] },
                "expectedOutput": "100"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [5, 10, 15, 20, 25]\n// Use findIndex to get the index of the first number greater than 12\n// Print the result\n// Your output should be: 2",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [5, 10, 15, 20, 25] },
                "expectedOutput": "2"
              },
              {
                "input": { "arr": [1, 2, 3] },
                "expectedOutput": "-1"
              },
              {
                "input": { "arr": [13, 14, 15] },
                "expectedOutput": "0"
              },
              {
                "input": { "arr": [5, 20] },
                "expectedOutput": "1"
              }
            ]
          },
          {
            "description": "// Given an array of strings: [\"apple\", \"banana\", \"cherry\", \"date\"]\n// Use find to get the first string that starts with the letter 'c'\n// Print the result\n// Your output should be: cherry",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["apple", "banana", "cherry", "date"] },
                "expectedOutput": "cherry"
              },
              {
                "input": { "arr": ["cat", "dog", "cow"] },
                "expectedOutput": "cat"
              },
              {
                "input": { "arr": ["apple", "banana"] },
                "expectedOutput": "undefined"
              },
              {
                "input": { "arr": ["cake"] },
                "expectedOutput": "cake"
              }
            ]
          },
          {
            "description": "// Given an array: [{id: 1, name: \"Alice\"}, {id: 2, name: \"Bob\"}, {id: 3, name: \"Charlie\"}]\n// Use find to get the object with id equal to 2\n// Print the result as JSON string\n// Your output should be: {\"id\":2,\"name\":\"Bob\"}",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [{ "id": 1, "name": "Alice" }, { "id": 2, "name": "Bob" }, { "id": 3, "name": "Charlie" }] },
                "expectedOutput": "{\"id\":2,\"name\":\"Bob\"}"
              },
              {
                "input": { "arr": [{ "id": 1, "name": "Alice" }] },
                "expectedOutput": "undefined"
              },
              {
                "input": { "arr": [{ "id": 5, "name": "Diana" }, { "id": 2, "name": "Eve" }] },
                "expectedOutput": "{\"id\":2,\"name\":\"Eve\"}"
              }
            ]
          },
          {
            "description": "// Given an array: [{id: 1, name: \"Alice\"}, {id: 2, name: \"Bob\"}, {id: 3, name: \"Charlie\"}]\n// Use findIndex to get the index of the object with id equal to 3\n// Print the result\n// Your output should be: 2",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [{ "id": 1, "name": "Alice" }, { "id": 2, "name": "Bob" }, { "id": 3, "name": "Charlie" }] },
                "expectedOutput": "2"
              },
              {
                "input": { "arr": [{ "id": 5, "name": "Diana" }] },
                "expectedOutput": "-1"
              },
              {
                "input": { "arr": [{ "id": 3, "name": "Eve" }, { "id": 4, "name": "Frank" }] },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [2, 4, 6, 8, 10]\n// Use find to get the first odd number\n// Print the result\n// Your output should be: undefined",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [2, 4, 6, 8, 10] },
                "expectedOutput": "undefined"
              },
              {
                "input": { "arr": [1, 2, 3] },
                "expectedOutput": "1"
              },
              {
                "input": { "arr": [2, 3, 4] },
                "expectedOutput": "3"
              },
              {
                "input": { "arr": [7] },
                "expectedOutput": "7"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [3, 6, 9, 12, 15]\n// Use findIndex to get the index of the first number divisible by 5\n// Print the result\n// Your output should be: 4",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [3, 6, 9, 12, 15] },
                "expectedOutput": "4"
              },
              {
                "input": { "arr": [1, 2, 3] },
                "expectedOutput": "-1"
              },
              {
                "input": { "arr": [5, 10] },
                "expectedOutput": "0"
              },
              {
                "input": { "arr": [3, 10, 20] },
                "expectedOutput": "1"
              }
            ]
          },
          {
            "description": "// Given an array of strings: [\"short\", \"medium length\", \"tiny\", \"a bit longer\"]\n// Use find to get the first string with length greater than 10\n// Print the result\n// Your output should be: medium length",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["short", "medium length", "tiny", "a bit longer"] },
                "expectedOutput": "medium length"
              },
              {
                "input": { "arr": ["hi", "hello"] },
                "expectedOutput": "undefined"
              },
              {
                "input": { "arr": ["JavaScript is awesome"] },
                "expectedOutput": "JavaScript is awesome"
              }
            ]
          },
          {
            "description": "// Given an array: [{name: \"Alice\", age: 17}, {name: \"Bob\", age: 25}, {name: \"Charlie\", age: 30}]\n// Use findIndex to get the index of the first person aged 18 or older\n// Print the result\n// Your output should be: 1",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [{ "name": "Alice", "age": 17 }, { "name": "Bob", "age": 25 }, { "name": "Charlie", "age": 30 }] },
                "expectedOutput": "1"
              },
              {
                "input": { "arr": [{ "name": "Diana", "age": 15 }, { "name": "Eve", "age": 16 }] },
                "expectedOutput": "-1"
              },
              {
                "input": { "arr": [{ "name": "Frank", "age": 18 }] },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [1, 3, 5, 7, 9, 11]\n// Use find to get the first even number\n// If no even number exists, print \"No even number found\"\n// Otherwise print the number\n// Your output should be: No even number found",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 3, 5, 7, 9, 11] },
                "expectedOutput": "No even number found"
              },
              {
                "input": { "arr": [1, 2, 3] },
                "expectedOutput": "2"
              },
              {
                "input": { "arr": [8, 10] },
                "expectedOutput": "8"
              },
              {
                "input": { "arr": [1, 3, 6] },
                "expectedOutput": "6"
              }
            ]
          }
        ]
      },
      {
        "id": "some-every",
        "title": "some and every",
        "outcomes": [
          "some Syntax: The Logical OR for Arrays",
          "every Syntax: The Logical AND for Arrays",
          "Short-Circuit Logic: Optimizing Truth Evaluations",
          "The Vacuous Truth: Empty Array Behavior"
        ],
        "tasks": [
          {
            "description": "// Given an array of numbers: [1, 3, 5, 7, 9]\n// Use some to check if at least one number is even\n// Print the result\n// Your output should be: false",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 3, 5, 7, 9] },
                "expectedOutput": "false"
              },
              {
                "input": { "arr": [1, 2, 3] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [2, 4, 6] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [] },
                "expectedOutput": "false"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [2, 4, 6, 8, 10]\n// Use every to check if all numbers are even\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [2, 4, 6, 8, 10] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [2, 3, 4] },
                "expectedOutput": "false"
              },
              {
                "input": { "arr": [1, 3, 5] },
                "expectedOutput": "false"
              },
              {
                "input": { "arr": [] },
                "expectedOutput": "true"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [10, 20, 30, 40, 50]\n// Use some to check if at least one number is greater than 45\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [10, 20, 30, 40, 50] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [10, 20, 30] },
                "expectedOutput": "false"
              },
              {
                "input": { "arr": [100, 200] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [] },
                "expectedOutput": "false"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [5, 10, 15, 20, 25]\n// Use every to check if all numbers are greater than 3\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [5, 10, 15, 20, 25] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [1, 2, 3] },
                "expectedOutput": "false"
              },
              {
                "input": { "arr": [4, 5, 6] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [] },
                "expectedOutput": "true"
              }
            ]
          },
          {
            "description": "// Given an array of strings: [\"apple\", \"banana\", \"cherry\"]\n// Use some to check if at least one string starts with 'b'\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["apple", "banana", "cherry"] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": ["apple", "cherry"] },
                "expectedOutput": "false"
              },
              {
                "input": { "arr": ["ball", "bat"] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [] },
                "expectedOutput": "false"
              }
            ]
          },
          {
            "description": "// Given an array of strings: [\"hello\", \"world\", \"test\"]\n// Use every to check if all strings have length greater than 3\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["hello", "world", "test"] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": ["hi", "hello"] },
                "expectedOutput": "false"
              },
              {
                "input": { "arr": ["code", "java"] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [] },
                "expectedOutput": "true"
              }
            ]
          },
          {
            "description": "// Given an array: [{name: \"Alice\", age: 25}, {name: \"Bob\", age: 17}, {name: \"Charlie\", age: 30}]\n// Use some to check if at least one person is under 18\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [{ "name": "Alice", "age": 25 }, { "name": "Bob", "age": 17 }, { "name": "Charlie", "age": 30 }] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [{ "name": "Diana", "age": 20 }, { "name": "Eve", "age": 25 }] },
                "expectedOutput": "false"
              },
              {
                "input": { "arr": [{ "name": "Frank", "age": 16 }] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [] },
                "expectedOutput": "false"
              }
            ]
          },
          {
            "description": "// Given an array: [{name: \"Alice\", age: 25}, {name: \"Bob\", age: 30}, {name: \"Charlie\", age: 35}]\n// Use every to check if all people are 18 or older\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [{ "name": "Alice", "age": 25 }, { "name": "Bob", "age": 30 }, { "name": "Charlie", "age": 35 }] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [{ "name": "Diana", "age": 17 }, { "name": "Eve", "age": 20 }] },
                "expectedOutput": "false"
              },
              {
                "input": { "arr": [{ "name": "Frank", "age": 18 }] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [] },
                "expectedOutput": "true"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [5, 10, 15, 20]\n// Use some to check if at least one number is divisible by 3\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [5, 10, 15, 20] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [1, 2, 4] },
                "expectedOutput": "false"
              },
              {
                "input": { "arr": [9, 12] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [] },
                "expectedOutput": "false"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [10, 20, 30, 40]\n// Use every to check if all numbers are divisible by 10\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [10, 20, 30, 40] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [10, 15, 20] },
                "expectedOutput": "false"
              },
              {
                "input": { "arr": [100, 200] },
                "expectedOutput": "true"
              },
              {
                "input": { "arr": [] },
                "expectedOutput": "true"
              }
            ]
          }
        ]
      },
      {
        "id": "reduce",
        "title": "reduce for accumulation",
        "outcomes": [
          "reduce Syntax: The Multipurpose Folding Tool",
          "The Accumulator: Tracking the Running Total",
          "Current Value: Processing Elements in Sequence",
          "The Initial Value: Setting the Starting State",
          "Versatility: Rebuilding map and filter using reduce"
        ],
        "tasks": [
          {
            "description": "// Given an array of numbers: [1, 2, 3, 4, 5]\n// Use reduce to calculate the sum of all numbers\n// Print the result\n// Your output should be: 15",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5] },
                "expectedOutput": "15"
              },
              {
                "input": { "arr": [10, 20, 30] },
                "expectedOutput": "60"
              },
              {
                "input": { "arr": [5] },
                "expectedOutput": "5"
              },
              {
                "input": { "arr": [0, 0, 0] },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [2, 3, 4]\n// Use reduce to calculate the product of all numbers\n// Print the result\n// Your output should be: 24",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [2, 3, 4] },
                "expectedOutput": "24"
              },
              {
                "input": { "arr": [5, 5] },
                "expectedOutput": "25"
              },
              {
                "input": { "arr": [10] },
                "expectedOutput": "10"
              },
              {
                "input": { "arr": [1, 2, 3] },
                "expectedOutput": "6"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [10, 5, 20, 15, 30]\n// Use reduce to find the maximum number\n// Print the result\n// Your output should be: 30",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [10, 5, 20, 15, 30] },
                "expectedOutput": "30"
              },
              {
                "input": { "arr": [1, 2, 3] },
                "expectedOutput": "3"
              },
              {
                "input": { "arr": [100] },
                "expectedOutput": "100"
              },
              {
                "input": { "arr": [7, 14, 21] },
                "expectedOutput": "21"
              }
            ]
          },
          {
            "description": "// Given an array of strings: [\"Hello\", \" \", \"World\", \"!\"]\n// Use reduce to concatenate all strings into one\n// Print the result\n// Your output should be: Hello World!",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["Hello", " ", "World", "!"] },
                "expectedOutput": "Hello World!"
              },
              {
                "input": { "arr": ["JavaScript", " ", "is", " ", "fun"] },
                "expectedOutput": "JavaScript is fun"
              },
              {
                "input": { "arr": ["test"] },
                "expectedOutput": "test"
              },
              {
                "input": { "arr": ["a", "b", "c"] },
                "expectedOutput": "abc"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [1, 2, 2, 3, 3, 3, 4]\n// Use reduce to count the occurrences of each number\n// Return an object where keys are numbers and values are counts\n// Print the result as JSON string\n// Your output should be: {\"1\":1,\"2\":2,\"3\":3,\"4\":1}",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 2, 3, 3, 3, 4] },
                "expectedOutput": "{\"1\":1,\"2\":2,\"3\":3,\"4\":1}"
              },
              {
                "input": { "arr": [5, 5, 5] },
                "expectedOutput": "{\"5\":3}"
              },
              {
                "input": { "arr": [1] },
                "expectedOutput": "{\"1\":1}"
              },
              {
                "input": { "arr": [7, 8, 7] },
                "expectedOutput": "{\"7\":2,\"8\":1}"
              }
            ]
          },
          {
            "description": "// Given an array of arrays: [[1, 2], [3, 4], [5, 6]]\n// Use reduce to flatten into a single array\n// Print the result as JSON string\n// Your output should be: [1,2,3,4,5,6]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [[1, 2], [3, 4], [5, 6]] },
                "expectedOutput": "[1,2,3,4,5,6]"
              },
              {
                "input": { "arr": [[10], [20], [30]] },
                "expectedOutput": "[10,20,30]"
              },
              {
                "input": { "arr": [[1, 2, 3]] },
                "expectedOutput": "[1,2,3]"
              },
              {
                "input": { "arr": [[5, 6], [7, 8, 9]] },
                "expectedOutput": "[5,6,7,8,9]"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [1, 2, 3, 4, 5]\n// Use reduce to create a new array with only even numbers (like filter)\n// Print the result as JSON string\n// Your output should be: [2,4]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5] },
                "expectedOutput": "[2,4]"
              },
              {
                "input": { "arr": [10, 15, 20] },
                "expectedOutput": "[10,20]"
              },
              {
                "input": { "arr": [1, 3, 5] },
                "expectedOutput": "[]"
              },
              {
                "input": { "arr": [8] },
                "expectedOutput": "[8]"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [1, 2, 3, 4]\n// Use reduce to create a new array with each number doubled (like map)\n// Print the result as JSON string\n// Your output should be: [2,4,6,8]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4] },
                "expectedOutput": "[2,4,6,8]"
              },
              {
                "input": { "arr": [5, 10] },
                "expectedOutput": "[10,20]"
              },
              {
                "input": { "arr": [0] },
                "expectedOutput": "[0]"
              },
              {
                "input": { "arr": [3, 7] },
                "expectedOutput": "[6,14]"
              }
            ]
          },
          {
            "description": "// Given an array: [{name: \"Alice\", age: 25}, {name: \"Bob\", age: 30}, {name: \"Charlie\", age: 35}]\n// Use reduce to calculate the total age of all people\n// Print the result\n// Your output should be: 90",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [{ "name": "Alice", "age": 25 }, { "name": "Bob", "age": 30 }, { "name": "Charlie", "age": 35 }] },
                "expectedOutput": "90"
              },
              {
                "input": { "arr": [{ "name": "Diana", "age": 20 }] },
                "expectedOutput": "20"
              },
              {
                "input": { "arr": [{ "name": "Eve", "age": 22 }, { "name": "Frank", "age": 28 }] },
                "expectedOutput": "50"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [5, 10, 15, 20]\n// Use reduce to calculate the average\n// Hint: Sum all numbers, then divide by array length\n// Print the result\n// Your output should be: 12.5",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [5, 10, 15, 20] },
                "expectedOutput": "12.5"
              },
              {
                "input": { "arr": [10, 20, 30] },
                "expectedOutput": "20"
              },
              {
                "input": { "arr": [5] },
                "expectedOutput": "5"
              },
              {
                "input": { "arr": [2, 4, 6, 8] },
                "expectedOutput": "5"
              }
            ]
          },
          {
            "description": "// Given an array of strings: [\"apple\", \"banana\", \"cherry\"]\n// Use reduce to create an object where keys are strings and values are their lengths\n// Print the result as JSON string\n// Your output should be: {\"apple\":5,\"banana\":6,\"cherry\":6}",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["apple", "banana", "cherry"] },
                "expectedOutput": "{\"apple\":5,\"banana\":6,\"cherry\":6}"
              },
              {
                "input": { "arr": ["hi", "hello"] },
                "expectedOutput": "{\"hi\":2,\"hello\":5}"
              },
              {
                "input": { "arr": ["test"] },
                "expectedOutput": "{\"test\":4}"
              }
            ]
          },
          {
            "description": "// Given an array: [{x: 1}, {x: 2}, {x: 3}]\n// Use reduce to extract all x values into a single array\n// Print the result as JSON string\n// Your output should be: [1,2,3]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [{ "x": 1 }, { "x": 2 }, { "x": 3 }] },
                "expectedOutput": "[1,2,3]"
              },
              {
                "input": { "arr": [{ "x": 10 }] },
                "expectedOutput": "[10]"
              },
              {
                "input": { "arr": [{ "x": 5 }, { "x": 15 }, { "x": 25 }] },
                "expectedOutput": "[5,15,25]"
              }
            ]
          }
        ]
      },
      {
        "id": "string-manipulations",
        "title": "Common string manipulations",
        "outcomes": [
          "trim(): Removing whitespace from Memory",
          "replace() and replaceAll(): Pattern Substitution",
          "repeat(): Generative Sequence Creation",
          "Padding: Aligning Data with padStart() and padEnd()"
        ],
        "tasks": [
          {
            "description": "// Given a string: \"  Hello World  \"\n// Use trim() to remove leading and trailing whitespace\n// Print the result\n// Your output should be: Hello World",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "  Hello World  " },
                "expectedOutput": "Hello World"
              },
              {
                "input": { "str": "   JavaScript   " },
                "expectedOutput": "JavaScript"
              },
              {
                "input": { "str": "test" },
                "expectedOutput": "test"
              },
              {
                "input": { "str": "  " },
                "expectedOutput": ""
              }
            ]
          },
          {
            "description": "// Given a string: \"Hello World\"\n// Use replace() to replace \"World\" with \"JavaScript\"\n// Print the result\n// Your output should be: Hello JavaScript",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "Hello World", "search": "World", "replacement": "JavaScript" },
                "expectedOutput": "Hello JavaScript"
              },
              {
                "input": { "str": "I love coding", "search": "coding", "replacement": "programming" },
                "expectedOutput": "I love programming"
              },
              {
                "input": { "str": "test", "search": "test", "replacement": "exam" },
                "expectedOutput": "exam"
              }
            ]
          },
          {
            "description": "// Given a string: \"cat cat cat\"\n// Use replaceAll() to replace all occurrences of \"cat\" with \"dog\"\n// Print the result\n// Your output should be: dog dog dog",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "cat cat cat", "search": "cat", "replacement": "dog" },
                "expectedOutput": "dog dog dog"
              },
              {
                "input": { "str": "hello hello", "search": "hello", "replacement": "hi" },
                "expectedOutput": "hi hi"
              },
              {
                "input": { "str": "test", "search": "test", "replacement": "exam" },
                "expectedOutput": "exam"
              }
            ]
          },
          {
            "description": "// Given a string: \"ha\"\n// Use repeat() to repeat the string 3 times\n// Print the result\n// Your output should be: hahaha",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "ha", "count": 3 },
                "expectedOutput": "hahaha"
              },
              {
                "input": { "str": "abc", "count": 2 },
                "expectedOutput": "abcabc"
              },
              {
                "input": { "str": "x", "count": 5 },
                "expectedOutput": "xxxxx"
              },
              {
                "input": { "str": "test", "count": 0 },
                "expectedOutput": ""
              }
            ]
          },
          {
            "description": "// Given a string: \"5\"\n// Use padStart() to pad the string to a total length of 4 with \"0\"\n// Print the result\n// Your output should be: 0005",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "5", "length": 4, "padChar": "0" },
                "expectedOutput": "0005"
              },
              {
                "input": { "str": "42", "length": 5, "padChar": "0" },
                "expectedOutput": "00042"
              },
              {
                "input": { "str": "7", "length": 3, "padChar": "0" },
                "expectedOutput": "007"
              },
              {
                "input": { "str": "100", "length": 2, "padChar": "0" },
                "expectedOutput": "100"
              }
            ]
          },
          {
            "description": "// Given a string: \"5\"\n// Use padEnd() to pad the string to a total length of 4 with \"0\"\n// Print the result\n// Your output should be: 5000",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "5", "length": 4, "padChar": "0" },
                "expectedOutput": "5000"
              },
              {
                "input": { "str": "42", "length": 5, "padChar": "0" },
                "expectedOutput": "42000"
              },
              {
                "input": { "str": "7", "length": 3, "padChar": "0" },
                "expectedOutput": "700"
              },
              {
                "input": { "str": "100", "length": 2, "padChar": "0" },
                "expectedOutput": "100"
              }
            ]
          },
          {
            "description": "// Given a string: \"  JavaScript is awesome  \"\n// Use trim() and replace() to remove whitespace and replace \"awesome\" with \"great\"\n// Print the result\n// Your output should be: JavaScript is great",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "  JavaScript is awesome  " },
                "expectedOutput": "JavaScript is great"
              },
              {
                "input": { "str": "  coding is fun  " },
                "expectedOutput": "coding is great"
              }
            ]
          },
          {
            "description": "// Given a string: \"hello-world-javascript\"\n// Use replaceAll() to replace all hyphens (-) with spaces\n// Print the result\n// Your output should be: hello world javascript",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "hello-world-javascript" },
                "expectedOutput": "hello world javascript"
              },
              {
                "input": { "str": "one-two-three" },
                "expectedOutput": "one two three"
              },
              {
                "input": { "str": "test" },
                "expectedOutput": "test"
              },
              {
                "input": { "str": "a-b-c-d" },
                "expectedOutput": "a b c d"
              }
            ]
          },
          {
            "description": "// Given a string: \"*\"\n// Use repeat() to create a string with 10 asterisks\n// Print the result\n// Your output should be: **********",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "*", "count": 10 },
                "expectedOutput": "**********"
              },
              {
                "input": { "str": "-", "count": 5 },
                "expectedOutput": "-----"
              },
              {
                "input": { "str": "#", "count": 7 },
                "expectedOutput": "#######"
              }
            ]
          },
          {
            "description": "// Given a string: \"Code\"\n// Use padStart() to center-align by padding with spaces to length 10\n// Then use padEnd() on the result to make total length 14\n// Print the result (should have 3 spaces before and 4 spaces after)\n// Your output should be: \"   Code       \" (3 spaces + Code + 7 spaces, but padEnd adds to existing)",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "Code" },
                "expectedOutput": "   Code       "
              },
              {
                "input": { "str": "Hi" },
                "expectedOutput": "    Hi        "
              }
            ]
          }
        ]
      },
      {
        "id": "split-join",
        "title": "split and join",
        "outcomes": [
          "split Syntax: Deconstructing Strings into Arrays",
          "join Syntax: Reconstructing Arrays into Strings",
          "The Empty Separator: Character-level Tokenization",
          "The Round Trip: Splitting, Modifying, and Joining",
          "Implicit Join: Behavior with Missing or Default Separators"
        ],
        "tasks": [
          {
            "description": "// Given a string: \"apple,banana,cherry\"\n// Use split() to convert it into an array using comma as separator\n// Print the result as JSON string\n// Your output should be: [\"apple\",\"banana\",\"cherry\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "apple,banana,cherry" },
                "expectedOutput": "[\"apple\",\"banana\",\"cherry\"]"
              },
              {
                "input": { "str": "one,two,three" },
                "expectedOutput": "[\"one\",\"two\",\"three\"]"
              },
              {
                "input": { "str": "test" },
                "expectedOutput": "[\"test\"]"
              },
              {
                "input": { "str": "a,b" },
                "expectedOutput": "[\"a\",\"b\"]"
              }
            ]
          },
          {
            "description": "// Given an array: [\"apple\", \"banana\", \"cherry\"]\n// Use join() to convert it into a string with comma separator\n// Print the result\n// Your output should be: apple,banana,cherry",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["apple", "banana", "cherry"] },
                "expectedOutput": "apple,banana,cherry"
              },
              {
                "input": { "arr": ["one", "two", "three"] },
                "expectedOutput": "one,two,three"
              },
              {
                "input": { "arr": ["test"] },
                "expectedOutput": "test"
              },
              {
                "input": { "arr": ["a", "b"] },
                "expectedOutput": "a,b"
              }
            ]
          },
          {
            "description": "// Given a string: \"hello\"\n// Use split('') to convert it into an array of characters\n// Print the result as JSON string\n// Your output should be: [\"h\",\"e\",\"l\",\"l\",\"o\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "hello" },
                "expectedOutput": "[\"h\",\"e\",\"l\",\"l\",\"o\"]"
              },
              {
                "input": { "str": "abc" },
                "expectedOutput": "[\"a\",\"b\",\"c\"]"
              },
              {
                "input": { "str": "x" },
                "expectedOutput": "[\"x\"]"
              },
              {
                "input": { "str": "JS" },
                "expectedOutput": "[\"J\",\"S\"]"
              }
            ]
          },
          {
            "description": "// Given an array: [\"H\", \"e\", \"l\", \"l\", \"o\"]\n// Use join('') to convert it into a string with no separator\n// Print the result\n// Your output should be: Hello",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["H", "e", "l", "l", "o"] },
                "expectedOutput": "Hello"
              },
              {
                "input": { "arr": ["a", "b", "c"] },
                "expectedOutput": "abc"
              },
              {
                "input": { "arr": ["t", "e", "s", "t"] },
                "expectedOutput": "test"
              },
              {
                "input": { "arr": ["x"] },
                "expectedOutput": "x"
              }
            ]
          },
          {
            "description": "// Given a string: \"one two three four\"\n// Use split() with space separator to create an array\n// Print the result as JSON string\n// Your output should be: [\"one\",\"two\",\"three\",\"four\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "one two three four" },
                "expectedOutput": "[\"one\",\"two\",\"three\",\"four\"]"
              },
              {
                "input": { "str": "hello world" },
                "expectedOutput": "[\"hello\",\"world\"]"
              },
              {
                "input": { "str": "test" },
                "expectedOutput": "[\"test\"]"
              },
              {
                "input": { "str": "a b c" },
                "expectedOutput": "[\"a\",\"b\",\"c\"]"
              }
            ]
          },
          {
            "description": "// Given an array: [\"JavaScript\", \"is\", \"awesome\"]\n// Use join() with space separator to create a sentence\n// Print the result\n// Your output should be: JavaScript is awesome",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["JavaScript", "is", "awesome"] },
                "expectedOutput": "JavaScript is awesome"
              },
              {
                "input": { "arr": ["Hello", "World"] },
                "expectedOutput": "Hello World"
              },
              {
                "input": { "arr": ["one"] },
                "expectedOutput": "one"
              },
              {
                "input": { "arr": ["I", "love", "coding"] },
                "expectedOutput": "I love coding"
              }
            ]
          },
          {
            "description": "// Given a string: \"racecar\"\n// Split it into characters, reverse the array, then join back\n// Check if the result equals the original string\n// Print true if palindrome, false otherwise\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "racecar" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "hello" },
                "expectedOutput": "false"
              },
              {
                "input": { "str": "madam" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "test" },
                "expectedOutput": "false"
              }
            ]
          },
          {
            "description": "// Given a string: \"hello world\"\n// Split into words, convert each word to uppercase, then join with hyphens\n// Print the result\n// Your output should be: HELLO-WORLD",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "hello world" },
                "expectedOutput": "HELLO-WORLD"
              },
              {
                "input": { "str": "one two three" },
                "expectedOutput": "ONE-TWO-THREE"
              },
              {
                "input": { "str": "test" },
                "expectedOutput": "TEST"
              },
              {
                "input": { "str": "javascript is fun" },
                "expectedOutput": "JAVASCRIPT-IS-FUN"
              }
            ]
          },
          {
            "description": "// Given a string: \"apple-banana-cherry\"\n// Split by hyphen, then join with space\n// Print the result\n// Your output should be: apple banana cherry",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "apple-banana-cherry" },
                "expectedOutput": "apple banana cherry"
              },
              {
                "input": { "str": "one-two-three" },
                "expectedOutput": "one two three"
              },
              {
                "input": { "str": "test" },
                "expectedOutput": "test"
              },
              {
                "input": { "str": "a-b-c" },
                "expectedOutput": "a b c"
              }
            ]
          },
          {
            "description": "// Given a string: \"hello\"\n// Split into characters, reverse the array, join back, and convert to uppercase\n// Print the result\n// Your output should be: OLLEH",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "hello" },
                "expectedOutput": "OLLEH"
              },
              {
                "input": { "str": "world" },
                "expectedOutput": "DLROW"
              },
              {
                "input": { "str": "abc" },
                "expectedOutput": "CBA"
              },
              {
                "input": { "str": "test" },
                "expectedOutput": "TSET"
              }
            ]
          }
        ]
      },
      {
        "id": "substring-slice",
        "title": "substring and slice",
        "outcomes": [
          "slice Syntax: Extracting String Segments",
          "substring Syntax: Standard Character Extraction",
          "The Exclusive End: Understanding the (Start, End) Boundary",
          "Implicit End: Omission for Remainder Extraction",
          "Negative Indices: Slicing from the End of the Sequence"
        ],
        "tasks": [
          {
            "description": "// Given a string: \"JavaScript\"\n// Use slice() to extract characters from index 0 to 4 (exclusive)\n// Print the result\n// Your output should be: Java",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "JavaScript", "start": 0, "end": 4 },
                "expectedOutput": "Java"
              },
              {
                "input": { "str": "Hello World", "start": 0, "end": 5 },
                "expectedOutput": "Hello"
              },
              {
                "input": { "str": "testing", "start": 0, "end": 4 },
                "expectedOutput": "test"
              },
              {
                "input": { "str": "abc", "start": 0, "end": 2 },
                "expectedOutput": "ab"
              }
            ]
          },
          {
            "description": "// Given a string: \"JavaScript\"\n// Use slice() to extract from index 4 to the end\n// Print the result\n// Your output should be: Script",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "JavaScript", "start": 4 },
                "expectedOutput": "Script"
              },
              {
                "input": { "str": "Hello World", "start": 6 },
                "expectedOutput": "World"
              },
              {
                "input": { "str": "testing", "start": 4 },
                "expectedOutput": "ing"
              },
              {
                "input": { "str": "abc", "start": 1 },
                "expectedOutput": "bc"
              }
            ]
          },
          {
            "description": "// Given a string: \"JavaScript\"\n// Use slice() with negative index to extract the last 6 characters\n// Print the result\n// Your output should be: Script",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "JavaScript", "start": -6 },
                "expectedOutput": "Script"
              },
              {
                "input": { "str": "Hello World", "start": -5 },
                "expectedOutput": "World"
              },
              {
                "input": { "str": "testing", "start": -3 },
                "expectedOutput": "ing"
              },
              {
                "input": { "str": "abcdef", "start": -2 },
                "expectedOutput": "ef"
              }
            ]
          },
          {
            "description": "// Given a string: \"JavaScript\"\n// Use substring() to extract characters from index 0 to 4\n// Print the result\n// Your output should be: Java",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "JavaScript", "start": 0, "end": 4 },
                "expectedOutput": "Java"
              },
              {
                "input": { "str": "Hello World", "start": 0, "end": 5 },
                "expectedOutput": "Hello"
              },
              {
                "input": { "str": "testing", "start": 0, "end": 4 },
                "expectedOutput": "test"
              },
              {
                "input": { "str": "abc", "start": 0, "end": 2 },
                "expectedOutput": "ab"
              }
            ]
          },
          {
            "description": "// Given a string: \"JavaScript\"\n// Use substring() to extract from index 4 to the end\n// Print the result\n// Your output should be: Script",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "JavaScript", "start": 4 },
                "expectedOutput": "Script"
              },
              {
                "input": { "str": "Hello World", "start": 6 },
                "expectedOutput": "World"
              },
              {
                "input": { "str": "testing", "start": 4 },
                "expectedOutput": "ing"
              },
              {
                "input": { "str": "abc", "start": 1 },
                "expectedOutput": "bc"
              }
            ]
          },
          {
            "description": "// Given a string: \"Hello World\"\n// Use slice() to extract characters from index 6 to 11\n// Print the result\n// Your output should be: World",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "Hello World", "start": 6, "end": 11 },
                "expectedOutput": "World"
              },
              {
                "input": { "str": "JavaScript", "start": 4, "end": 10 },
                "expectedOutput": "Script"
              },
              {
                "input": { "str": "testing", "start": 2, "end": 5 },
                "expectedOutput": "sti"
              }
            ]
          },
          {
            "description": "// Given a string: \"Hello World\"\n// Use slice() with negative indices to extract from -5 to -1\n// Print the result\n// Your output should be: Worl",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "Hello World", "start": -5, "end": -1 },
                "expectedOutput": "Worl"
              },
              {
                "input": { "str": "JavaScript", "start": -6, "end": -1 },
                "expectedOutput": "Scrip"
              },
              {
                "input": { "str": "testing", "start": -4, "end": -1 },
                "expectedOutput": "tin"
              }
            ]
          },
          {
            "description": "// Given a string: \"programming\"\n// Use slice() to get the first 7 characters\n// Print the result\n// Your output should be: program",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "programming", "length": 7 },
                "expectedOutput": "program"
              },
              {
                "input": { "str": "JavaScript", "length": 4 },
                "expectedOutput": "Java"
              },
              {
                "input": { "str": "testing", "length": 4 },
                "expectedOutput": "test"
              }
            ]
          },
          {
            "description": "// Given a string: \"Hello World\"\n// Use slice() to extract the middle word \"World\" without hardcoding indices\n// Hint: Use indexOf() to find the space, then slice from that position + 1\n// Print the result\n// Your output should be: World",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "Hello World" },
                "expectedOutput": "World"
              },
              {
                "input": { "str": "Good Morning" },
                "expectedOutput": "Morning"
              },
              {
                "input": { "str": "JavaScript Rocks" },
                "expectedOutput": "Rocks"
              }
            ]
          },
          {
            "description": "// Given a string: \"abcdefghij\"\n// Use slice() to extract every character except the first and last\n// Print the result\n// Your output should be: bcdefghi",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "abcdefghij" },
                "expectedOutput": "bcdefghi"
              },
              {
                "input": { "str": "hello" },
                "expectedOutput": "ell"
              },
              {
                "input": { "str": "test" },
                "expectedOutput": "es"
              },
              {
                "input": { "str": "abc" },
                "expectedOutput": "b"
              }
            ]
          }
        ]
      },
      {
        "id": "string-searching",
        "title": "String searching and matching",
        "outcomes": [
          "indexOf(): Locating the First Occurrence",
          "lastIndexOf(): Searching from the End",
          "includes(): Simple Boolean Existence Checks",
          "startsWith() and endsWith(): Boundary Validation"
        ],
        "tasks": [
          {
            "description": "// Given a string: \"Hello World\"\n// Use indexOf() to find the position of \"World\"\n// Print the result\n// Your output should be: 6",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "Hello World", "search": "World" },
                "expectedOutput": "6"
              },
              {
                "input": { "str": "JavaScript", "search": "Script" },
                "expectedOutput": "4"
              },
              {
                "input": { "str": "testing", "search": "ing" },
                "expectedOutput": "4"
              },
              {
                "input": { "str": "hello", "search": "xyz" },
                "expectedOutput": "-1"
              }
            ]
          },
          {
            "description": "// Given a string: \"banana\"\n// Use indexOf() to find the first occurrence of \"a\"\n// Print the result\n// Your output should be: 1",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "banana", "search": "a" },
                "expectedOutput": "1"
              },
              {
                "input": { "str": "hello", "search": "l" },
                "expectedOutput": "2"
              },
              {
                "input": { "str": "test", "search": "t" },
                "expectedOutput": "0"
              },
              {
                "input": { "str": "abc", "search": "c" },
                "expectedOutput": "2"
              }
            ]
          },
          {
            "description": "// Given a string: \"banana\"\n// Use lastIndexOf() to find the last occurrence of \"a\"\n// Print the result\n// Your output should be: 5",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "banana", "search": "a" },
                "expectedOutput": "5"
              },
              {
                "input": { "str": "hello", "search": "l" },
                "expectedOutput": "3"
              },
              {
                "input": { "str": "test", "search": "t" },
                "expectedOutput": "3"
              },
              {
                "input": { "str": "abc", "search": "a" },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Given a string: \"JavaScript is awesome\"\n// Use includes() to check if the string contains \"awesome\"\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "JavaScript is awesome", "search": "awesome" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "Hello World", "search": "World" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "testing", "search": "xyz" },
                "expectedOutput": "false"
              },
              {
                "input": { "str": "abc", "search": "ab" },
                "expectedOutput": "true"
              }
            ]
          },
          {
            "description": "// Given a string: \"hello.txt\"\n// Use startsWith() to check if the string starts with \"hello\"\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "hello.txt", "search": "hello" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "JavaScript", "search": "Java" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "testing", "search": "test" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "abc", "search": "xyz" },
                "expectedOutput": "false"
              }
            ]
          },
          {
            "description": "// Given a string: \"hello.txt\"\n// Use endsWith() to check if the string ends with \".txt\"\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "hello.txt", "search": ".txt" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "document.pdf", "search": ".pdf" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "image.png", "search": ".jpg" },
                "expectedOutput": "false"
              },
              {
                "input": { "str": "test", "search": "st" },
                "expectedOutput": "true"
              }
            ]
          },
          {
            "description": "// Given a string: \"the cat in the hat\"\n// Use indexOf() to find the position of the second \"the\"\n// Hint: Use indexOf() twice with a starting position parameter\n// Print the result\n// Your output should be: 11",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "the cat in the hat" },
                "expectedOutput": "11"
              },
              {
                "input": { "str": "hello hello world" },
                "expectedOutput": "6"
              },
              {
                "input": { "str": "test test test" },
                "expectedOutput": "5"
              }
            ]
          },
          {
            "description": "// Given a string: \"JavaScript\"\n// Check if the string both starts with \"Java\" and ends with \"Script\"\n// Print true if both conditions are met, false otherwise\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "JavaScript" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "JavaCode" },
                "expectedOutput": "false"
              },
              {
                "input": { "str": "TypeScript" },
                "expectedOutput": "false"
              },
              {
                "input": { "str": "Java" },
                "expectedOutput": "false"
              }
            ]
          },
          {
            "description": "// Given a string: \"hello world hello\"\n// Count how many times \"hello\" appears in the string\n// Hint: Use indexOf() in a loop or count manually\n// Print the count\n// Your output should be: 2",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "hello world hello", "search": "hello" },
                "expectedOutput": "2"
              },
              {
                "input": { "str": "test test test", "search": "test" },
                "expectedOutput": "3"
              },
              {
                "input": { "str": "banana", "search": "a" },
                "expectedOutput": "3"
              },
              {
                "input": { "str": "abc", "search": "x" },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Given a string: \"example@email.com\"\n// Check if it contains \"@\" and ends with \".com\"\n// Print true if both conditions are met, false otherwise\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "example@email.com" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "test@site.org" },
                "expectedOutput": "false"
              },
              {
                "input": { "str": "invalid.com" },
                "expectedOutput": "false"
              },
              {
                "input": { "str": "user@domain.com" },
                "expectedOutput": "true"
              }
            ]
          }
        ]
      },
      {
        "id": "regex",
        "title": "Pattern matching",
        "outcomes": [
          "Regular Expressions: Defining Patterns in Memory",
          "Literal vs. Constructor: Creating Regex Objects",
          "The .test() Method: Pattern Verification (Boolean)",
          "The .match() Method: Extracting Pattern Matches",
          "Advanced Substitution: replace() with Regex",
          "Character Classes: Searching for Types (\\d, \\w, \\s)",
          "Special Characters and Escaping",
          "Quantifiers: Managing Repetition (+, *, {n})",
          "Anchors: Start (^) and End ($) Boundaries",
          "Flags: Global (g) and Case-Insensitive (i) searches",
          "Capture Groups: Isolating Sub-patterns",
          "The .exec() Method: Iterative Pattern Matching"
        ],
        "tasks": [
          {
            "description": "// Given a string: \"hello123\"\n// Create a regex pattern to test if the string contains any digit\n// Use the test() method\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "hello123" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "hello" },
                "expectedOutput": "false"
              },
              {
                "input": { "str": "test456" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "abc" },
                "expectedOutput": "false"
              }
            ]
          },
          {
            "description": "// Given a string: \"The year is 2024\"\n// Create a regex to match all digits in the string\n// Use the match() method with global flag\n// Print the result as JSON string\n// Your output should be: [\"2\",\"0\",\"2\",\"4\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "The year is 2024" },
                "expectedOutput": "[\"2\",\"0\",\"2\",\"4\"]"
              },
              {
                "input": { "str": "Room 101" },
                "expectedOutput": "[\"1\",\"0\",\"1\"]"
              },
              {
                "input": { "str": "No digits here" },
                "expectedOutput": "null"
              },
              {
                "input": { "str": "42" },
                "expectedOutput": "[\"4\",\"2\"]"
              }
            ]
          },
          {
            "description": "// Given a string: \"Hello World\"\n// Create a regex to replace all spaces with hyphens\n// Use replace() with regex and global flag\n// Print the result\n// Your output should be: Hello-World",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "Hello World" },
                "expectedOutput": "Hello-World"
              },
              {
                "input": { "str": "one two three" },
                "expectedOutput": "one-two-three"
              },
              {
                "input": { "str": "test" },
                "expectedOutput": "test"
              },
              {
                "input": { "str": "a b c" },
                "expectedOutput": "a-b-c"
              }
            ]
          },
          {
            "description": "// Given a string: \"hello HELLO HeLLo\"\n// Create a case-insensitive regex to match all occurrences of \"hello\"\n// Use match() with global and case-insensitive flags\n// Print the result as JSON string\n// Your output should be: [\"hello\",\"HELLO\",\"HeLLo\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "hello HELLO HeLLo" },
                "expectedOutput": "[\"hello\",\"HELLO\",\"HeLLo\"]"
              },
              {
                "input": { "str": "Test test TEST" },
                "expectedOutput": "[\"Test\",\"test\",\"TEST\"]"
              },
              {
                "input": { "str": "world" },
                "expectedOutput": "null"
              }
            ]
          },
          {
            "description": "// Given a string: \"abc123def456\"\n// Create a regex to match sequences of one or more digits\n// Use match() with global flag\n// Print the result as JSON string\n// Your output should be: [\"123\",\"456\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "abc123def456" },
                "expectedOutput": "[\"123\",\"456\"]"
              },
              {
                "input": { "str": "test99x88" },
                "expectedOutput": "[\"99\",\"88\"]"
              },
              {
                "input": { "str": "no digits" },
                "expectedOutput": "null"
              },
              {
                "input": { "str": "42" },
                "expectedOutput": "[\"42\"]"
              }
            ]
          },
          {
            "description": "// Given a string: \"hello\"\n// Create a regex to test if the string starts with \"he\"\n// Use test() method with ^ anchor\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "hello" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "help" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "world" },
                "expectedOutput": "false"
              },
              {
                "input": { "str": "the" },
                "expectedOutput": "false"
              }
            ]
          },
          {
            "description": "// Given a string: \"testing\"\n// Create a regex to test if the string ends with \"ing\"\n// Use test() method with $ anchor\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "testing" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "running" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "test" },
                "expectedOutput": "false"
              },
              {
                "input": { "str": "singer" },
                "expectedOutput": "false"
              }
            ]
          },
          {
            "description": "// Given a string: \"cat bat rat mat\"\n// Create a regex to match all three-letter words ending with \"at\"\n// Use match() with global flag\n// Print the result as JSON string\n// Your output should be: [\"cat\",\"bat\",\"rat\",\"mat\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "cat bat rat mat" },
                "expectedOutput": "[\"cat\",\"bat\",\"rat\",\"mat\"]"
              },
              {
                "input": { "str": "sat fat" },
                "expectedOutput": "[\"sat\",\"fat\"]"
              },
              {
                "input": { "str": "dog log" },
                "expectedOutput": "null"
              }
            ]
          },
          {
            "description": "// Given a string: \"hello   world  test\"\n// Create a regex to replace multiple consecutive spaces with a single space\n// Use replace() with regex and global flag\n// Print the result\n// Your output should be: hello world test",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "hello   world  test" },
                "expectedOutput": "hello world test"
              },
              {
                "input": { "str": "one    two" },
                "expectedOutput": "one two"
              },
              {
                "input": { "str": "a  b  c" },
                "expectedOutput": "a b c"
              },
              {
                "input": { "str": "test" },
                "expectedOutput": "test"
              }
            ]
          },
          {
            "description": "// Given a string: \"abc123XYZ\"\n// Create a regex to test if the string contains only alphanumeric characters\n// Use test() method\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "abc123XYZ" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "test123" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "hello world" },
                "expectedOutput": "false"
              },
              {
                "input": { "str": "test@123" },
                "expectedOutput": "false"
              }
            ]
          },
          {
            "description": "// Given a string: \"My phone is 555-1234\"\n// Create a regex to match a phone pattern: 3 digits, hyphen, 4 digits\n// Use match() method\n// Print the first match (the phone number)\n// Your output should be: 555-1234",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "My phone is 555-1234" },
                "expectedOutput": "555-1234"
              },
              {
                "input": { "str": "Call 123-4567 now" },
                "expectedOutput": "123-4567"
              },
              {
                "input": { "str": "No phone here" },
                "expectedOutput": "null"
              },
              {
                "input": { "str": "999-0000" },
                "expectedOutput": "999-0000"
              }
            ]
          },
          {
            "description": "// Given a string: \"Price: $25.99\"\n// Create a regex to extract the dollar amount (digits and decimal)\n// Use match() to get the price\n// Print just the number part (without $)\n// Your output should be: 25.99",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "Price: $25.99" },
                "expectedOutput": "25.99"
              },
              {
                "input": { "str": "Cost: $100.50" },
                "expectedOutput": "100.50"
              },
              {
                "input": { "str": "$9.99 only" },
                "expectedOutput": "9.99"
              },
              {
                "input": { "str": "No price" },
                "expectedOutput": "null"
              }
            ]
          },
          {
            "description": "// Given a string: \"email@example.com\"\n// Create a regex to validate basic email format\n// Pattern: one or more word characters, @, one or more word characters, dot, 2-3 letters\n// Use test() method\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "email@example.com" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "test@site.org" },
                "expectedOutput": "true"
              },
              {
                "input": { "str": "invalid.email.com" },
                "expectedOutput": "false"
              },
              {
                "input": { "str": "user@domain" },
                "expectedOutput": "false"
              }
            ]
          },
          {
            "description": "// Given a string: \"The code is ABC-123-XYZ\"\n// Create a regex to match the pattern: 3 uppercase letters, hyphen, 3 digits, hyphen, 3 uppercase letters\n// Use match() method\n// Print the matched code\n// Your output should be: ABC-123-XYZ",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "The code is ABC-123-XYZ" },
                "expectedOutput": "ABC-123-XYZ"
              },
              {
                "input": { "str": "Code: DEF-456-GHI" },
                "expectedOutput": "DEF-456-GHI"
              },
              {
                "input": { "str": "No code here" },
                "expectedOutput": "null"
              }
            ]
          },
          {
            "description": "// Given a string: \"Visit https://example.com for more\"\n// Create a regex to extract URLs that start with http:// or https://\n// Use match() method\n// Print the URL\n// Your output should be: https://example.com",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "Visit https://example.com for more" },
                "expectedOutput": "https://example.com"
              },
              {
                "input": { "str": "Go to http://test.org" },
                "expectedOutput": "http://test.org"
              },
              {
                "input": { "str": "No URL here" },
                "expectedOutput": "null"
              }
            ]
          }
        ]
      },
      {
        "id": "array-advanced-patterns",
        "title": "Method chaining and nested arrays",
        "outcomes": [
          "Method Chaining: Building Logical Data Pipelines",
          "Code Readability: Formatting and Debugging Chains",
          "Multidimensional Arrays: Creating and Accessing 2D Grids",
          "Nested Iteration: Traversing Rows and Columns",
          "Array Flattening: Working with .flat() and Depth",
          "flatMap(): Combined Transformation and Flattening",
          "Architectural Logic: Choosing the Right Method for the Job"
        ],
        "tasks": [
          {
            "description": "// Given an array of numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n// Chain filter and map to: filter even numbers, then double them\n// Print the result as JSON string\n// Your output should be: [4,8,12,16,20]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
                "expectedOutput": "[4,8,12,16,20]"
              },
              {
                "input": { "arr": [5, 10, 15, 20] },
                "expectedOutput": "[20,40]"
              },
              {
                "input": { "arr": [1, 3, 5] },
                "expectedOutput": "[]"
              },
              {
                "input": { "arr": [2, 4] },
                "expectedOutput": "[4,8]"
              }
            ]
          },
          {
            "description": "// Given an array of strings: [\"apple\", \"banana\", \"cherry\", \"date\"]\n// Chain filter and map to: filter strings longer than 5 characters, then convert to uppercase\n// Print the result as JSON string\n// Your output should be: [\"BANANA\",\"CHERRY\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["apple", "banana", "cherry", "date"] },
                "expectedOutput": "[\"BANANA\",\"CHERRY\"]"
              },
              {
                "input": { "arr": ["hi", "hello", "hey"] },
                "expectedOutput": "[]"
              },
              {
                "input": { "arr": ["JavaScript", "is", "awesome"] },
                "expectedOutput": "[\"JAVASCRIPT\",\"AWESOME\"]"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [1, 2, 3, 4, 5]\n// Chain map, filter, and reduce to: double each, filter even results, then sum them\n// Print the result\n// Your output should be: 20",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5] },
                "expectedOutput": "20"
              },
              {
                "input": { "arr": [2, 4, 6] },
                "expectedOutput": "24"
              },
              {
                "input": { "arr": [1, 3, 5] },
                "expectedOutput": "0"
              },
              {
                "input": { "arr": [10] },
                "expectedOutput": "20"
              }
            ]
          },
          {
            "description": "// Given a 2D array: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\n// Access and print the element at row 1, column 2\n// Your output should be: 6",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [[1, 2, 3], [4, 5, 6], [7, 8, 9]], "row": 1, "col": 2 },
                "expectedOutput": "6"
              },
              {
                "input": { "arr": [[10, 20], [30, 40]], "row": 0, "col": 1 },
                "expectedOutput": "20"
              },
              {
                "input": { "arr": [[5, 10, 15], [20, 25, 30]], "row": 1, "col": 0 },
                "expectedOutput": "20"
              }
            ]
          },
          {
            "description": "// Given a 2D array: [[1, 2], [3, 4], [5, 6]]\n// Calculate the sum of all elements across all rows\n// Print the result\n// Your output should be: 21",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [[1, 2], [3, 4], [5, 6]] },
                "expectedOutput": "21"
              },
              {
                "input": { "arr": [[10, 20], [30, 40]] },
                "expectedOutput": "100"
              },
              {
                "input": { "arr": [[5], [10], [15]] },
                "expectedOutput": "30"
              },
              {
                "input": { "arr": [[1, 1, 1], [2, 2, 2]] },
                "expectedOutput": "9"
              }
            ]
          },
          {
            "description": "// Given a 2D array: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\n// Extract the first column (all elements at index 0 of each row)\n// Print the result as JSON string\n// Your output should be: [1,4,7]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
                "expectedOutput": "[1,4,7]"
              },
              {
                "input": { "arr": [[10, 20], [30, 40], [50, 60]] },
                "expectedOutput": "[10,30,50]"
              },
              {
                "input": { "arr": [[5, 10, 15], [20, 25, 30]] },
                "expectedOutput": "[5,20]"
              }
            ]
          },
          {
            "description": "// Given a nested array: [[1, 2], [3, [4, 5]], [6, 7]]\n// Use flat() to flatten it one level deep\n// Print the result as JSON string\n// Your output should be: [1,2,3,[4,5],6,7]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [[1, 2], [3, [4, 5]], [6, 7]] },
                "expectedOutput": "[1,2,3,[4,5],6,7]"
              },
              {
                "input": { "arr": [[10], [20, [30]], [40]] },
                "expectedOutput": "[10,20,[30],40]"
              },
              {
                "input": { "arr": [[1, 2, 3]] },
                "expectedOutput": "[1,2,3]"
              }
            ]
          },
          {
            "description": "// Given a nested array: [[1, [2, [3, [4]]]]]\n// Use flat() with Infinity to completely flatten it\n// Print the result as JSON string\n// Your output should be: [1,2,3,4]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [[1, [2, [3, [4]]]]] },
                "expectedOutput": "[1,2,3,4]"
              },
              {
                "input": { "arr": [[5, [10, [15]]]] },
                "expectedOutput": "[5,10,15]"
              },
              {
                "input": { "arr": [[1], [2], [3]] },
                "expectedOutput": "[1,2,3]"
              }
            ]
          },
          {
            "description": "// Given an array: [\"hello world\", \"test case\"]\n// Use flatMap() to split each string into words and flatten the result\n// Print the result as JSON string\n// Your output should be: [\"hello\",\"world\",\"test\",\"case\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["hello world", "test case"] },
                "expectedOutput": "[\"hello\",\"world\",\"test\",\"case\"]"
              },
              {
                "input": { "arr": ["one two", "three"] },
                "expectedOutput": "[\"one\",\"two\",\"three\"]"
              },
              {
                "input": { "arr": ["JavaScript"] },
                "expectedOutput": "[\"JavaScript\"]"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [1, 2, 3]\n// Use flatMap() to create an array where each number appears twice\n// Print the result as JSON string\n// Your output should be: [1,1,2,2,3,3]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3] },
                "expectedOutput": "[1,1,2,2,3,3]"
              },
              {
                "input": { "arr": [5, 10] },
                "expectedOutput": "[5,5,10,10]"
              },
              {
                "input": { "arr": [7] },
                "expectedOutput": "[7,7]"
              }
            ]
          },
          {
            "description": "// Given an array: [{name: \"Alice\", scores: [85, 90]}, {name: \"Bob\", scores: [75, 80]}]\n// Use flatMap() to extract all scores into a single array\n// Print the result as JSON string\n// Your output should be: [85,90,75,80]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [{ "name": "Alice", "scores": [85, 90] }, { "name": "Bob", "scores": [75, 80] }] },
                "expectedOutput": "[85,90,75,80]"
              },
              {
                "input": { "arr": [{ "name": "Charlie", "scores": [95] }, { "name": "Diana", "scores": [88, 92] }] },
                "expectedOutput": "[95,88,92]"
              }
            ]
          },
          {
            "description": "// Given an array: [{name: \"Alice\", age: 25}, {name: \"Bob\", age: 17}, {name: \"Charlie\", age: 30}]\n// Chain filter and map to: filter adults (age >= 18), then extract just names\n// Print the result as JSON string\n// Your output should be: [\"Alice\",\"Charlie\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [{ "name": "Alice", "age": 25 }, { "name": "Bob", "age": 17 }, { "name": "Charlie", "age": 30 }] },
                "expectedOutput": "[\"Alice\",\"Charlie\"]"
              },
              {
                "input": { "arr": [{ "name": "Diana", "age": 16 }, { "name": "Eve", "age": 20 }] },
                "expectedOutput": "[\"Eve\"]"
              },
              {
                "input": { "arr": [{ "name": "Frank", "age": 18 }] },
                "expectedOutput": "[\"Frank\"]"
              }
            ]
          },
          {
            "description": "// Given a 2D array: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\n// Create a new array containing the sum of each row\n// Print the result as JSON string\n// Your output should be: [6,15,24]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
                "expectedOutput": "[6,15,24]"
              },
              {
                "input": { "arr": [[10, 20], [30, 40]] },
                "expectedOutput": "[30,70]"
              },
              {
                "input": { "arr": [[5], [10], [15]] },
                "expectedOutput": "[5,10,15]"
              }
            ]
          },
          {
            "description": "// Given an array of numbers: [1, 2, 3, 4, 5, 6]\n// Chain methods to: filter numbers > 2, square them, then calculate the sum\n// Print the result\n// Your output should be: 86",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3, 4, 5, 6] },
                "expectedOutput": "86"
              },
              {
                "input": { "arr": [1, 2, 3] },
                "expectedOutput": "9"
              },
              {
                "input": { "arr": [5, 10] },
                "expectedOutput": "125"
              }
            ]
          },
          {
            "description": "// Given an array: [\"hi\", \"hello\", \"hey\", \"greetings\"]\n// Chain methods to: filter strings with length > 3, convert to uppercase, then join with comma\n// Print the result\n// Your output should be: HELLO,GREETINGS",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": ["hi", "hello", "hey", "greetings"] },
                "expectedOutput": "HELLO,GREETINGS"
              },
              {
                "input": { "arr": ["test", "code", "js"] },
                "expectedOutput": "TEST,CODE"
              },
              {
                "input": { "arr": ["a", "ab", "abc"] },
                "expectedOutput": ""
              }
            ]
          }
        ]
      },
      {
        "id": "error-handling",
        "title": "Error handling with try-catch",
        "outcomes": [
          "Error Types: Identifying Reference, Syntax, and Type Errors",
          "Error Objects: Accessing .name and .message Properties",
          "try...catch Syntax: Creating a Safety Net for Logic",
          "The finally Block: Executing Cleanup regardless of outcome",
          "The throw Statement: Manually Triggering Logic Failures",
          "Custom Messaging: Providing Context for Debugging",
          "Error Propagation: Understanding how errors \"bubble up\"",
          "Strategic Usage: When to catch vs. when to let it fail"
        ],
        "tasks": [
          {
            "description": "// Create a try-catch block that attempts to access an undefined variable\n// In the catch block, print the error message\n// Attempt to log: undefinedVariable\n// Your output should be: undefinedVariable is not defined",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "undefinedVariable is not defined"
              }
            ]
          },
          {
            "description": "// Create a try-catch block that attempts to parse invalid JSON\n// The invalid JSON string is: \"{broken json}\"\n// In the catch block, print the error name\n// Your output should be: SyntaxError",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "jsonString": "{broken json}" },
                "expectedOutput": "SyntaxError"
              },
              {
                "input": { "jsonString": "{invalid}" },
                "expectedOutput": "SyntaxError"
              }
            ]
          },
          {
            "description": "// Create a try-catch-finally block\n// In try: print \"Trying\"\n// In catch: print \"Error occurred\"\n// In finally: print \"Cleanup\"\n// Test with code that throws an error\n// Your output should be:\n// Trying\n// Error occurred\n// Cleanup",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "Trying\nError occurred\nCleanup"
              }
            ]
          },
          {
            "description": "// Create a function that throws a custom error if a number is negative\n// Use throw new Error() with message \"Number must be positive\"\n// Wrap the function call in try-catch and print the error message\n// Test with number: -5\n// Your output should be: Number must be positive",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "num": -5 },
                "expectedOutput": "Number must be positive"
              },
              {
                "input": { "num": -10 },
                "expectedOutput": "Number must be positive"
              },
              {
                "input": { "num": -1 },
                "expectedOutput": "Number must be positive"
              }
            ]
          },
          {
            "description": "// Create a function named divide that takes two parameters: a and b\n// Throw an error if b is 0 with message \"Cannot divide by zero\"\n// Otherwise return a / b\n// Wrap a call to divide(10, 0) in try-catch and print the error message\n// Your output should be: Cannot divide by zero",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "a": 10, "b": 0 },
                "expectedOutput": "Cannot divide by zero"
              },
              {
                "input": { "a": 20, "b": 0 },
                "expectedOutput": "Cannot divide by zero"
              },
              {
                "input": { "a": 5, "b": 0 },
                "expectedOutput": "Cannot divide by zero"
              }
            ]
          },
          {
            "description": "// Create a try-catch block that attempts to call a non-existent function\n// In the catch block, print both error name and message separated by: \": \"\n// Attempt to call: nonExistentFunction()\n// Your output should be: ReferenceError: nonExistentFunction is not defined",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "ReferenceError: nonExistentFunction is not defined"
              }
            ]
          },
          {
            "description": "// Create a function that validates age\n// Throw an error if age is less than 0 with message \"Age cannot be negative\"\n// Throw an error if age is greater than 150 with message \"Age is unrealistic\"\n// Otherwise return \"Valid age\"\n// Test with age -5 in try-catch and print the error message\n// Your output should be: Age cannot be negative",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "age": -5 },
                "expectedOutput": "Age cannot be negative"
              },
              {
                "input": { "age": 200 },
                "expectedOutput": "Age is unrealistic"
              },
              {
                "input": { "age": -1 },
                "expectedOutput": "Age cannot be negative"
              }
            ]
          },
          {
            "description": "// Create a try-catch-finally block\n// In try: attempt to parse valid JSON {\"name\":\"Alice\"}\n// In try: also print \"Parsing successful\"\n// In finally: print \"Done\"\n// Your output should be:\n// Parsing successful\n// Done",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "jsonString": "{\"name\":\"Alice\"}" },
                "expectedOutput": "Parsing successful\nDone"
              },
              {
                "input": { "jsonString": "{\"age\":25}" },
                "expectedOutput": "Parsing successful\nDone"
              }
            ]
          },
          {
            "description": "// Create a function that checks if a string is empty\n// Throw an error if the string is empty with message \"String cannot be empty\"\n// Otherwise return the string length\n// Test with empty string \"\" in try-catch and print the error message\n// Your output should be: String cannot be empty",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "str": "" },
                "expectedOutput": "String cannot be empty"
              }
            ]
          },
          {
            "description": "// Create a function that safely accesses array elements\n// Parameters: arr and index\n// Throw an error if index is negative with message \"Index cannot be negative\"\n// Throw an error if index >= array length with message \"Index out of bounds\"\n// Otherwise return the element at that index\n// Test with array [1,2,3] and index 5 in try-catch, print error message\n// Your output should be: Index out of bounds",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3], "index": 5 },
                "expectedOutput": "Index out of bounds"
              },
              {
                "input": { "arr": [10, 20], "index": -1 },
                "expectedOutput": "Index cannot be negative"
              },
              {
                "input": { "arr": [5], "index": 10 },
                "expectedOutput": "Index out of bounds"
              }
            ]
          },
          {
            "description": "// Create nested try-catch blocks\n// Outer try: contains inner try-catch\n// Inner try: throw error with message \"Inner error\"\n// Inner catch: print the error message and re-throw the error\n// Outer catch: print \"Caught in outer: \" + error message\n// Your output should be:\n// Inner error\n// Caught in outer: Inner error",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "Inner error\nCaught in outer: Inner error"
              }
            ]
          },
          {
            "description": "// Create a function that validates email format\n// Throw an error if email doesn't contain \"@\" with message \"Invalid email: missing @\"\n// Throw an error if email doesn't contain \".\" with message \"Invalid email: missing domain\"\n// Otherwise return \"Valid email\"\n// Test with \"invalidemail.com\" in try-catch and print error message\n// Your output should be: Invalid email: missing @",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "email": "invalidemail.com" },
                "expectedOutput": "Invalid email: missing @"
              },
              {
                "input": { "email": "test@invalid" },
                "expectedOutput": "Invalid email: missing domain"
              },
              {
                "input": { "email": "notemail" },
                "expectedOutput": "Invalid email: missing @"
              }
            ]
          }
        ]
      },
      {
        "id": "classes",
        "title": "Object-oriented programming",
        "outcomes": [
          "Classes as Blueprints: Defining the Template",
          "The constructor Method: Initializing Instance State",
          "this in Classes: Referencing the Current Instance",
          "Methods: Defining Shared Behavior",
          "Static Members: Properties and Methods belonging to the Blueprint",
          "Encapsulation: Using Getters and Setters for Data Control",
          "Inheritance: Extending Logic with \"extends\" and \"super\"",
          "Polymorphism: Overriding Methods for Specialized Logic",
          "Type Checking: Identifying Instances with \"instanceof\""
        ],
        "tasks": [
          {
            "description": "// Create a class named Person with a constructor that takes name and age\n// Add a method introduce() that returns \"Hi, I'm {name} and I'm {age} years old\"\n// Create an instance with name \"Alice\" and age 25\n// Call introduce() and print the result\n// Your output should be: Hi, I'm Alice and I'm 25 years old",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "name": "Alice", "age": 25 },
                "expectedOutput": "Hi, I'm Alice and I'm 25 years old"
              },
              {
                "input": { "name": "Bob", "age": 30 },
                "expectedOutput": "Hi, I'm Bob and I'm 30 years old"
              },
              {
                "input": { "name": "Charlie", "age": 22 },
                "expectedOutput": "Hi, I'm Charlie and I'm 22 years old"
              }
            ]
          },
          {
            "description": "// Create a class named Rectangle with constructor taking width and height\n// Add a method getArea() that returns the area\n// Add a method getPerimeter() that returns the perimeter\n// Create instance with width 5 and height 10, print the area\n// Your output should be: 50",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "width": 5, "height": 10, "method": "getArea" },
                "expectedOutput": "50"
              },
              {
                "input": { "width": 5, "height": 10, "method": "getPerimeter" },
                "expectedOutput": "30"
              },
              {
                "input": { "width": 7, "height": 3, "method": "getArea" },
                "expectedOutput": "21"
              }
            ]
          },
          {
            "description": "// Create a class named Counter with a constructor that initializes count to 0\n// Add method increment() that increases count by 1\n// Add method decrement() that decreases count by 1\n// Add method getValue() that returns current count\n// Create instance, call increment twice, then getValue and print result\n// Your output should be: 2",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "operations": ["increment", "increment", "getValue"] },
                "expectedOutput": "2"
              },
              {
                "input": { "operations": ["increment", "decrement", "getValue"] },
                "expectedOutput": "0"
              },
              {
                "input": { "operations": ["increment", "increment", "increment", "getValue"] },
                "expectedOutput": "3"
              }
            ]
          },
          {
            "description": "// Create a class named BankAccount with constructor taking accountHolder and balance\n// Add method deposit(amount) that adds to balance and returns new balance\n// Add method withdraw(amount) that subtracts from balance and returns new balance\n// Add method getBalance() that returns current balance\n// Create account with holder \"Alice\" and balance 100, deposit 50, print balance\n// Your output should be: 150",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "accountHolder": "Alice", "initialBalance": 100, "operations": [{ "type": "deposit", "amount": 50 }] },
                "expectedOutput": "150"
              },
              {
                "input": { "accountHolder": "Bob", "initialBalance": 200, "operations": [{ "type": "withdraw", "amount": 50 }] },
                "expectedOutput": "150"
              },
              {
                "input": { "accountHolder": "Charlie", "initialBalance": 500, "operations": [{ "type": "deposit", "amount": 100 }, { "type": "withdraw", "amount": 50 }] },
                "expectedOutput": "550"
              }
            ]
          },
          {
            "description": "// Create a class named Circle with constructor taking radius\n// Add a static property PI with value 3.14159\n// Add method getArea() that calculates area using Circle.PI\n// Add method getCircumference() that calculates circumference using Circle.PI\n// Create circle with radius 5, print the area\n// Your output should be: 78.53975",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "radius": 5, "method": "getArea" },
                "expectedOutput": "78.53975"
              },
              {
                "input": { "radius": 5, "method": "getCircumference" },
                "expectedOutput": "31.4159"
              },
              {
                "input": { "radius": 10, "method": "getArea" },
                "expectedOutput": "314.159"
              }
            ]
          },
          {
            "description": "// Create a class named Temperature with constructor taking celsius\n// Add getter fahrenheit that converts celsius to fahrenheit: (C × 9/5) + 32\n// Add setter fahrenheit that converts fahrenheit to celsius: (F - 32) × 5/9\n// Create instance with 0 celsius, access fahrenheit getter and print\n// Your output should be: 32",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "celsius": 0, "operation": "get" },
                "expectedOutput": "32"
              },
              {
                "input": { "celsius": 100, "operation": "get" },
                "expectedOutput": "212"
              },
              {
                "input": { "fahrenheit": 32, "operation": "set" },
                "expectedOutput": "0"
              }
            ]
          },
          {
            "description": "// Create a class named Animal with constructor taking name\n// Add method speak() that returns \"{name} makes a sound\"\n// Create a class Dog that extends Animal\n// Override speak() to return \"{name} barks\"\n// Create Dog instance with name \"Rex\", call speak() and print\n// Your output should be: Rex barks",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "name": "Rex" },
                "expectedOutput": "Rex barks"
              },
              {
                "input": { "name": "Buddy" },
                "expectedOutput": "Buddy barks"
              },
              {
                "input": { "name": "Max" },
                "expectedOutput": "Max barks"
              }
            ]
          },
          {
            "description": "// Create a class Vehicle with constructor taking brand\n// Add method getInfo() that returns \"Brand: {brand}\"\n// Create class Car that extends Vehicle\n// Car constructor takes brand and model, calls super(brand)\n// Override getInfo() to return \"Brand: {brand}, Model: {model}\"\n// Create Car with brand \"Toyota\" and model \"Camry\", print getInfo()\n// Your output should be: Brand: Toyota, Model: Camry",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "brand": "Toyota", "model": "Camry" },
                "expectedOutput": "Brand: Toyota, Model: Camry"
              },
              {
                "input": { "brand": "Honda", "model": "Civic" },
                "expectedOutput": "Brand: Honda, Model: Civic"
              },
              {
                "input": { "brand": "Ford", "model": "Mustang" },
                "expectedOutput": "Brand: Ford, Model: Mustang"
              }
            ]
          },
          {
            "description": "// Create a class Shape with method getArea() that returns 0\n// Create class Square that extends Shape with constructor taking side\n// Override getArea() to return side * side\n// Create class Circle that extends Shape with constructor taking radius\n// Override getArea() to return 3.14159 * radius * radius\n// Create Square with side 4, print getArea()\n// Your output should be: 16",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "type": "Square", "value": 4 },
                "expectedOutput": "16"
              },
              {
                "input": { "type": "Circle", "value": 5 },
                "expectedOutput": "78.53975"
              },
              {
                "input": { "type": "Square", "value": 10 },
                "expectedOutput": "100"
              }
            ]
          },
          {
            "description": "// Create a class Person with constructor taking name\n// Create a class Student that extends Person\n// Create an instance of Student with name \"Alice\"\n// Use instanceof to check if the instance is a Student\n// Print the result\n// Your output should be: true",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "name": "Alice", "checkClass": "Student" },
                "expectedOutput": "true"
              },
              {
                "input": { "name": "Bob", "checkClass": "Person" },
                "expectedOutput": "true"
              }
            ]
          },
          {
            "description": "// Create a class Calculator with static method add(a, b) that returns a + b\n// Add static method multiply(a, b) that returns a * b\n// Call Calculator.add(5, 3) without creating an instance\n// Print the result\n// Your output should be: 8",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "method": "add", "a": 5, "b": 3 },
                "expectedOutput": "8"
              },
              {
                "input": { "method": "multiply", "a": 5, "b": 3 },
                "expectedOutput": "15"
              },
              {
                "input": { "method": "add", "a": 10, "b": 20 },
                "expectedOutput": "30"
              }
            ]
          },
          {
            "description": "// Create a class User with constructor taking username\n// Add private property _password (initialized to empty string)\n// Add setter password that stores the value\n// Add getter password that returns \"*****\" (always hides actual password)\n// Create user, set password to \"secret123\", access password getter and print\n// Your output should be: *****",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "username": "alice", "password": "secret123" },
                "expectedOutput": "*****"
              },
              {
                "input": { "username": "bob", "password": "pass456" },
                "expectedOutput": "*****"
              }
            ]
          },
          {
            "description": "// Create a class Book with constructor taking title, author, pages\n// Add method getSummary() that returns \"{title} by {author}, {pages} pages\"\n// Add static method comparePages(book1, book2) that returns the book with more pages\n// Create two books and use comparePages to find which has more pages\n// Book1: \"1984\", \"Orwell\", 328\n// Book2: \"Dune\", \"Herbert\", 412\n// Print the title of the book with more pages\n// Your output should be: Dune",
            "solution_type": "script",
            "testCases": [
              {
                "input": {
                  "book1": { "title": "1984", "author": "Orwell", "pages": 328 },
                  "book2": { "title": "Dune", "author": "Herbert", "pages": 412 }
                },
                "expectedOutput": "Dune"
              },
              {
                "input": {
                  "book1": { "title": "Hobbit", "author": "Tolkien", "pages": 500 },
                  "book2": { "title": "Harry Potter", "author": "Rowling", "pages": 300 }
                },
                "expectedOutput": "Hobbit"
              }
            ]
          },
          {
            "description": "// Create a class Employee with constructor taking name and salary\n// Create class Manager that extends Employee\n// Manager constructor takes name, salary, and department\n// Add method getDetails() in Manager that returns \"{name}, Salary: {salary}, Department: {department}\"\n// Create Manager with name \"Alice\", salary 80000, department \"IT\"\n// Print getDetails()\n// Your output should be: Alice, Salary: 80000, Department: IT",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "name": "Alice", "salary": 80000, "department": "IT" },
                "expectedOutput": "Alice, Salary: 80000, Department: IT"
              },
              {
                "input": { "name": "Bob", "salary": 90000, "department": "HR" },
                "expectedOutput": "Bob, Salary: 90000, Department: HR"
              }
            ]
          },
          {
            "description": "// Create a class Product with constructor taking name and price\n// Add getter formattedPrice that returns \"$\" + price\n// Add method applyDiscount(percentage) that reduces price by that percentage\n// Create product with name \"Laptop\" and price 1000\n// Apply 10% discount, then print formattedPrice\n// Your output should be: $900",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "name": "Laptop", "price": 1000, "discount": 10 },
                "expectedOutput": "$900"
              },
              {
                "input": { "name": "Phone", "price": 500, "discount": 20 },
                "expectedOutput": "$400"
              },
              {
                "input": { "name": "Tablet", "price": 300, "discount": 15 },
                "expectedOutput": "$255"
              }
            ]
          }
        ]
      },
      {
        "id": "modules",
        "title": "Organizing code with modules",
        "outcomes": [
          "Module Fundamentals: Encapsulation and Code Separation",
          "Named Exports: Sharing Multiple Values per File",
          "Default Exports: Defining the Primary Module Export",
          "Import Logic: Named vs. Default Syntax",
          "Alias Management: Renaming Imports to avoid Conflicts",
          "Namespace Imports: Importing Everything as a Single Object (* as)",
          "Module Scope: Why variables stay private by default",
          "Modern Patterns: Dynamic Imports for Performance"
        ],
        "tasks": [
          {
            "description": "// Create a module that exports a function named greet\n// greet should take a name parameter and return \"Hello, {name}!\"\n// Export using named export syntax\n// In another file, import and call greet(\"Alice\")\n// Print the result\n// Your output should be: Hello, Alice!",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "name": "Alice" },
                "expectedOutput": "Hello, Alice!"
              },
              {
                "input": { "name": "Bob" },
                "expectedOutput": "Hello, Bob!"
              },
              {
                "input": { "name": "Charlie" },
                "expectedOutput": "Hello, Charlie!"
              }
            ]
          },
          {
            "description": "// Create a module that exports two functions: add and subtract\n// add(a, b) returns a + b\n// subtract(a, b) returns a - b\n// Use named exports for both\n// Import both functions and call add(10, 5)\n// Print the result\n// Your output should be: 15",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "function": "add", "a": 10, "b": 5 },
                "expectedOutput": "15"
              },
              {
                "input": { "function": "subtract", "a": 10, "b": 5 },
                "expectedOutput": "5"
              },
              {
                "input": { "function": "add", "a": 20, "b": 30 },
                "expectedOutput": "50"
              }
            ]
          },
          {
            "description": "// Create a module with a default export of a function multiply(a, b)\n// multiply should return a * b\n// Import the default export and call it with arguments 6 and 7\n// Print the result\n// Your output should be: 42",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "a": 6, "b": 7 },
                "expectedOutput": "42"
              },
              {
                "input": { "a": 5, "b": 5 },
                "expectedOutput": "25"
              },
              {
                "input": { "a": 10, "b": 3 },
                "expectedOutput": "30"
              }
            ]
          },
          {
            "description": "// Create a module that exports constant PI = 3.14159\n// Export it as a named export\n// Import PI using an alias: import { PI as pi }\n// Calculate the area of circle with radius 5 using the imported pi\n// Print the result\n// Your output should be: 78.53975",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "radius": 5 },
                "expectedOutput": "78.53975"
              },
              {
                "input": { "radius": 10 },
                "expectedOutput": "314.159"
              },
              {
                "input": { "radius": 2 },
                "expectedOutput": "12.56636"
              }
            ]
          },
          {
            "description": "// Create a module that exports multiple math constants:\n// export const E = 2.71828\n// export const PHI = 1.61803\n// export const SQRT2 = 1.41421\n// Import all exports as a namespace: import * as constants\n// Access constants.E and print it\n// Your output should be: 2.71828",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "constant": "E" },
                "expectedOutput": "2.71828"
              },
              {
                "input": { "constant": "PHI" },
                "expectedOutput": "1.61803"
              },
              {
                "input": { "constant": "SQRT2" },
                "expectedOutput": "1.41421"
              }
            ]
          },
          {
            "description": "// Create a module that exports a class Calculator\n// Calculator has methods add(a, b) and multiply(a, b)\n// Export Calculator as default export\n// Import the class, create an instance, and call add(8, 2)\n// Print the result\n// Your output should be: 10",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "method": "add", "a": 8, "b": 2 },
                "expectedOutput": "10"
              },
              {
                "input": { "method": "multiply", "a": 8, "b": 2 },
                "expectedOutput": "16"
              },
              {
                "input": { "method": "add", "a": 15, "b": 5 },
                "expectedOutput": "20"
              }
            ]
          },
          {
            "description": "// Create a module with both named and default exports\n// Default export: function divide(a, b)\n// Named export: function modulo(a, b)\n// Import both and call divide(20, 4)\n// Print the result\n// Your output should be: 5",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "function": "divide", "a": 20, "b": 4 },
                "expectedOutput": "5"
              },
              {
                "input": { "function": "modulo", "a": 20, "b": 6 },
                "expectedOutput": "2"
              },
              {
                "input": { "function": "divide", "a": 100, "b": 10 },
                "expectedOutput": "10"
              }
            ]
          },
          {
            "description": "// Create a module that has a private variable count = 0\n// Export a function increment() that increases count and returns it\n// Export a function getCount() that returns current count\n// Import both functions, call increment() twice, then getCount()\n// Print the result\n// Your output should be: 2",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "operations": ["increment", "increment", "getCount"] },
                "expectedOutput": "2"
              },
              {
                "input": { "operations": ["increment", "getCount"] },
                "expectedOutput": "1"
              },
              {
                "input": { "operations": ["increment", "increment", "increment", "getCount"] },
                "expectedOutput": "3"
              }
            ]
          },
          {
            "description": "// Create a module utils.js that exports:\n// export function square(n) - returns n * n\n// export function cube(n) - returns n * n * n\n// Import only square using named import\n// Call square(5) and print result\n// Your output should be: 25",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "function": "square", "n": 5 },
                "expectedOutput": "25"
              },
              {
                "input": { "function": "cube", "n": 3 },
                "expectedOutput": "27"
              },
              {
                "input": { "function": "square", "n": 10 },
                "expectedOutput": "100"
              }
            ]
          },
          {
            "description": "// Create a module that exports an object as default:\n// export default { name: \"John\", age: 30, city: \"NYC\" }\n// Import the default object and access the name property\n// Print the name\n// Your output should be: John",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "property": "name" },
                "expectedOutput": "John"
              },
              {
                "input": { "property": "age" },
                "expectedOutput": "30"
              },
              {
                "input": { "property": "city" },
                "expectedOutput": "NYC"
              }
            ]
          }
        ]
      },
      {
        "id": "async-basics",
        "title": "Callbacks, timers, and async concepts",
        "outcomes": [
          "Execution Models: Synchronous vs. Asynchronous",
          "The Single Thread: Why JS can only do one thing at a time",
          "The Event Loop: Managing the Task Queue",
          "Timer Logic: setTimeout() and setInterval() Syntax",
          "Resource Management: Clearing Timers (clearTimeout/clearInterval)",
          "Callback Pattern: Passing logic to the future",
          "Control Flow: Understanding Non-blocking Execution Order",
          "Callback Hell: The limitation of nested callbacks",
          "Evolution: Why we need Promises"
        ],
        "tasks": [
          {
            "description": "// Use setTimeout to print \"Hello\" after 1 second (1000ms)\n// Note: For testing purposes, the delay will be simulated\n// Your output should be: Hello",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "message": "Hello", "delay": 1000 },
                "expectedOutput": "Hello"
              },
              {
                "input": { "message": "World", "delay": 1000 },
                "expectedOutput": "World"
              },
              {
                "input": { "message": "Test", "delay": 500 },
                "expectedOutput": "Test"
              }
            ]
          },
          {
            "description": "// Print \"Start\" immediately\n// Use setTimeout to print \"End\" after 0ms\n// Observe execution order due to event loop\n// Your output should be:\n// Start\n// End",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "Start\nEnd"
              }
            ]
          },
          {
            "description": "// Create a function countdown that takes a number n\n// Use setTimeout to print each number from n down to 1\n// Each number should be printed 1 second apart\n// Call countdown(3)\n// Your output should be:\n// 3\n// 2\n// 1",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "n": 3 },
                "expectedOutput": "3\n2\n1"
              },
              {
                "input": { "n": 2 },
                "expectedOutput": "2\n1"
              },
              {
                "input": { "n": 5 },
                "expectedOutput": "5\n4\n3\n2\n1"
              }
            ]
          },
          {
            "description": "// Use setInterval to print \"Tick\" every 1 second\n// After 3 ticks, use clearInterval to stop it\n// Your output should be:\n// Tick\n// Tick\n// Tick",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "message": "Tick", "times": 3 },
                "expectedOutput": "Tick\nTick\nTick"
              },
              {
                "input": { "message": "Test", "times": 2 },
                "expectedOutput": "Test\nTest"
              },
              {
                "input": { "message": "Count", "times": 4 },
                "expectedOutput": "Count\nCount\nCount\nCount"
              }
            ]
          },
          {
            "description": "// Create a function delayedGreeting that takes name and callback\n// Use setTimeout to call the callback with \"Hello, {name}\" after 1 second\n// Call delayedGreeting(\"Alice\", (msg) => console.log(msg))\n// Your output should be: Hello, Alice",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "name": "Alice" },
                "expectedOutput": "Hello, Alice"
              },
              {
                "input": { "name": "Bob" },
                "expectedOutput": "Hello, Bob"
              },
              {
                "input": { "name": "Charlie" },
                "expectedOutput": "Hello, Charlie"
              }
            ]
          },
          {
            "description": "// Create a function processArray that takes an array and callback\n// Use setTimeout to process each element after a delay\n// Call the callback with each element\n// Test with array [1, 2, 3] and callback that prints each number\n// Your output should be:\n// 1\n// 2\n// 3",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "arr": [1, 2, 3] },
                "expectedOutput": "1\n2\n3"
              },
              {
                "input": { "arr": [5, 10] },
                "expectedOutput": "5\n10"
              },
              {
                "input": { "arr": [7] },
                "expectedOutput": "7"
              }
            ]
          },
          {
            "description": "// Create nested callbacks to simulate callback hell\n// First setTimeout prints \"Step 1\" after 1s\n// Inside its callback, another setTimeout prints \"Step 2\" after 1s\n// Inside that callback, print \"Step 3\"\n// Your output should be:\n// Step 1\n// Step 2\n// Step 3",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "Step 1\nStep 2\nStep 3"
              }
            ]
          },
          {
            "description": "// Create a function executeAfterDelay that takes a callback and delay\n// Use setTimeout to execute the callback after the delay\n// The function should return the timer ID\n// Call it with a callback that prints \"Executed\" and delay 1000\n// Then immediately clear the timeout using clearTimeout\n// If cleared successfully, print \"Cancelled\"\n// Your output should be: Cancelled",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "shouldCancel": true },
                "expectedOutput": "Cancelled"
              },
              {
                "input": { "shouldCancel": false },
                "expectedOutput": "Executed"
              }
            ]
          },
          {
            "description": "// Demonstrate execution order:\n// Print \"1\" immediately\n// Use setTimeout to print \"3\" after 0ms\n// Print \"2\" immediately after setting timeout\n// Your output should be:\n// 1\n// 2\n// 3",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "1\n2\n3"
              }
            ]
          },
          {
            "description": "// Create a function repeat that takes message, times, and interval\n// Use setInterval to print message every interval milliseconds\n// After printing 'times' number of times, clear the interval\n// Call repeat(\"Hello\", 3, 1000)\n// Your output should be:\n// Hello\n// Hello\n// Hello",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "message": "Hello", "times": 3, "interval": 1000 },
                "expectedOutput": "Hello\nHello\nHello"
              },
              {
                "input": { "message": "Test", "times": 2, "interval": 500 },
                "expectedOutput": "Test\nTest"
              }
            ]
          },
          {
            "description": "// Create a function fetchData that takes a callback\n// Simulate async data fetching with setTimeout (1 second)\n// After timeout, call callback with data: {id: 1, name: \"User\"}\n// In the callback, print the name property\n// Your output should be: User",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "data": { "id": 1, "name": "User" } },
                "expectedOutput": "User"
              },
              {
                "input": { "data": { "id": 2, "name": "Alice" } },
                "expectedOutput": "Alice"
              },
              {
                "input": { "data": { "id": 3, "name": "Bob" } },
                "expectedOutput": "Bob"
              }
            ]
          },
          {
            "description": "// Create a stopwatch that counts seconds\n// Use setInterval to increment and print count every 1 second\n// After reaching 5 seconds, clear the interval and print \"Stopped\"\n// Your output should be:\n// 1\n// 2\n// 3\n// 4\n// 5\n// Stopped",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "maxSeconds": 5 },
                "expectedOutput": "1\n2\n3\n4\n5\nStopped"
              },
              {
                "input": { "maxSeconds": 3 },
                "expectedOutput": "1\n2\n3\nStopped"
              }
            ]
          }
        ]
      },
      {
        "id": "promises",
        "title": "Creating and consuming promises",
        "outcomes": [
          "Promise States: Pending, Fulfilled, and Rejected",
          "Constructor Logic: Using resolve and reject",
          "Consumption: Handling values with .then() and .catch()",
          "The finally Handler: Closing the loop",
          "Promise Chaining: Sequential Async Execution",
          "Value Passing: Why returning from .then() creates a new Promise",
          "Static Methods: Promise.all() and allSettled() for concurrency",
          "Optimization: Using Promise.race() for speed-based logic"
        ],
        "tasks": [
          {
            "description": "// Create a Promise that resolves with \"Success\" after 1 second\n// Use .then() to print the resolved value\n// Your output should be: Success",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "value": "Success" },
                "expectedOutput": "Success"
              },
              {
                "input": { "value": "Done" },
                "expectedOutput": "Done"
              },
              {
                "input": { "value": "Complete" },
                "expectedOutput": "Complete"
              }
            ]
          },
          {
            "description": "// Create a Promise that rejects with \"Error occurred\" after 1 second\n// Use .catch() to handle the rejection and print the error message\n// Your output should be: Error occurred",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "error": "Error occurred" },
                "expectedOutput": "Error occurred"
              },
              {
                "input": { "error": "Failed" },
                "expectedOutput": "Failed"
              },
              {
                "input": { "error": "Not found" },
                "expectedOutput": "Not found"
              }
            ]
          },
          {
            "description": "// Create a Promise that resolves with number 5\n// Use .then() to double the value and return it\n// Chain another .then() to print the doubled value\n// Your output should be: 10",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "value": 5 },
                "expectedOutput": "10"
              },
              {
                "input": { "value": 10 },
                "expectedOutput": "20"
              },
              {
                "input": { "value": 7 },
                "expectedOutput": "14"
              }
            ]
          },
          {
            "description": "// Create a Promise that resolves with \"Data\"\n// Add .finally() that prints \"Cleanup\" regardless of outcome\n// Add .then() that prints the resolved value\n// Your output should be:\n// Data\n// Cleanup",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "value": "Data" },
                "expectedOutput": "Data\nCleanup"
              },
              {
                "input": { "value": "Result" },
                "expectedOutput": "Result\nCleanup"
              }
            ]
          },
          {
            "description": "// Create a function that returns a Promise\n// The Promise should resolve with \"Hello\" if input is true\n// Otherwise reject with \"Error\"\n// Call the function with true, handle with .then() and print result\n// Your output should be: Hello",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "condition": true },
                "expectedOutput": "Hello"
              },
              {
                "input": { "condition": false },
                "expectedOutput": "Error"
              }
            ]
          },
          {
            "description": "// Create three Promises that resolve with 1, 2, and 3 respectively\n// Use Promise.all() to wait for all promises\n// Print the array of results\n// Your output should be: [1,2,3]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "values": [1, 2, 3] },
                "expectedOutput": "[1,2,3]"
              },
              {
                "input": { "values": [5, 10, 15] },
                "expectedOutput": "[5,10,15]"
              },
              {
                "input": { "values": [7, 14] },
                "expectedOutput": "[7,14]"
              }
            ]
          },
          {
            "description": "// Create two Promises:\n// First resolves with \"Fast\" after 1 second\n// Second resolves with \"Slow\" after 2 seconds\n// Use Promise.race() to get the fastest result\n// Print the result\n// Your output should be: Fast",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "fast": "Fast", "slow": "Slow" },
                "expectedOutput": "Fast"
              },
              {
                "input": { "fast": "Quick", "slow": "Delayed" },
                "expectedOutput": "Quick"
              }
            ]
          },
          {
            "description": "// Chain three Promises:\n// First resolves with 10\n// Second .then() adds 5 and returns result\n// Third .then() multiplies by 2 and prints result\n// Your output should be: 30",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "initial": 10 },
                "expectedOutput": "30"
              },
              {
                "input": { "initial": 5 },
                "expectedOutput": "20"
              },
              {
                "input": { "initial": 20 },
                "expectedOutput": "50"
              }
            ]
          },
          {
            "description": "// Create a Promise that randomly resolves or rejects\n// If Math.random() > 0.5, resolve with \"Success\"\n// Otherwise reject with \"Failure\"\n// Handle both cases and print the appropriate message\n// For testing: assume it resolves\n// Your output should be: Success",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "shouldResolve": true },
                "expectedOutput": "Success"
              },
              {
                "input": { "shouldResolve": false },
                "expectedOutput": "Failure"
              }
            ]
          },
          {
            "description": "// Create two Promises: one resolves with \"A\", one rejects with \"B\"\n// Use Promise.allSettled() to handle both\n// Print the status and value/reason of each\n// Format: \"fulfilled: A\" and \"rejected: B\"\n// Your output should be:\n// fulfilled: A\n// rejected: B",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "resolveValue": "A", "rejectValue": "B" },
                "expectedOutput": "fulfilled: A\nrejected: B"
              },
              {
                "input": { "resolveValue": "Success", "rejectValue": "Error" },
                "expectedOutput": "fulfilled: Success\nrejected: Error"
              }
            ]
          },
          {
            "description": "// Create a function fetchUser that returns a Promise resolving with {id: 1, name: \"Alice\"}\n// Create a function fetchPosts that takes userId and returns Promise resolving with [\"Post1\", \"Post2\"]\n// Chain them: fetch user, then fetch posts using user id\n// Print the posts array as JSON string\n// Your output should be: [\"Post1\",\"Post2\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "userId": 1, "posts": ["Post1", "Post2"] },
                "expectedOutput": "[\"Post1\",\"Post2\"]"
              },
              {
                "input": { "userId": 2, "posts": ["Article1", "Article2", "Article3"] },
                "expectedOutput": "[\"Article1\",\"Article2\",\"Article3\"]"
              }
            ]
          },
          {
            "description": "// Create a Promise that resolves with \"Step 1\"\n// Chain .then() to print it and return \"Step 2\"\n// Chain another .then() to print it and return \"Step 3\"\n// Chain final .then() to print it\n// Your output should be:\n// Step 1\n// Step 2\n// Step 3",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "Step 1\nStep 2\nStep 3"
              }
            ]
          },
          {
            "description": "// Create three Promises with different delays:\n// Promise 1 resolves with 1 after 3 seconds\n// Promise 2 resolves with 2 after 1 second  \n// Promise 3 resolves with 3 after 2 seconds\n// Use Promise.all() to wait for all\n// Print the results in order (should be [1,2,3] not by completion time)\n// Your output should be: [1,2,3]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "values": [1, 2, 3] },
                "expectedOutput": "[1,2,3]"
              },
              {
                "input": { "values": [5, 10, 15] },
                "expectedOutput": "[5,10,15]"
              }
            ]
          },
          {
            "description": "// Create a Promise chain that can handle errors mid-chain\n// First Promise resolves with 10\n// Second .then() divides by 0 (creates Infinity) and returns it\n// Third .then() checks if value is Infinity, if yes throw error \"Invalid calculation\"\n// Use .catch() to handle the error and print the message\n// Your output should be: Invalid calculation",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "Invalid calculation"
              }
            ]
          },
          {
            "description": "// Use Promise.all() with an array of Promises where one rejects\n// Promise 1 resolves with \"A\"\n// Promise 2 rejects with \"Error\"\n// Promise 3 resolves with \"C\"\n// Handle the rejection with .catch() and print the error\n// Your output should be: Error",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "error": "Error" },
                "expectedOutput": "Error"
              },
              {
                "input": { "error": "Failed" },
                "expectedOutput": "Failed"
              }
            ]
          }
        ]
      },
      {
        "id": "async-await",
        "title": "Writing cleaner asynchronous code",
        "outcomes": [
          "async Keyword: Automatically Wrapping Functions in Promises",
          "await Keyword: Pausing Execution for Asynchronous Values",
          "Context Rules: Why await requires an async environment",
          "Return Logic: Understanding the Implicit Promise wrapper",
          "Error Handling: Integrating try...catch with Async flows",
          "Performance: Sequential vs. Parallel Await execution",
          "Modern Syntax: Async with Arrow Functions",
          "Propagation: How errors bubble through async chains"
        ],
        "tasks": [
          {
            "description": "// Create an async function that returns \"Hello\"\n// Call the function and use .then() to print the result\n// Your output should be: Hello",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "value": "Hello" },
                "expectedOutput": "Hello"
              },
              {
                "input": { "value": "World" },
                "expectedOutput": "World"
              },
              {
                "input": { "value": "Test" },
                "expectedOutput": "Test"
              }
            ]
          },
          {
            "description": "// Create a function that returns a Promise resolving with \"Data\" after 1 second\n// Create an async function that awaits this Promise and prints the result\n// Your output should be: Data",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "value": "Data" },
                "expectedOutput": "Data"
              },
              {
                "input": { "value": "Result" },
                "expectedOutput": "Result"
              },
              {
                "input": { "value": "Info" },
                "expectedOutput": "Info"
              }
            ]
          },
          {
            "description": "// Create an async function that awaits two Promises sequentially\n// First Promise resolves with 5 after 1 second\n// Second Promise resolves with 10 after 1 second\n// Return the sum of both values\n// Print the result\n// Your output should be: 15",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "value1": 5, "value2": 10 },
                "expectedOutput": "15"
              },
              {
                "input": { "value1": 20, "value2": 30 },
                "expectedOutput": "50"
              },
              {
                "input": { "value1": 7, "value2": 3 },
                "expectedOutput": "10"
              }
            ]
          },
          {
            "description": "// Create an async function with try-catch\n// In try block, await a Promise that rejects with \"Error occurred\"\n// In catch block, print the error message\n// Your output should be: Error occurred",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "error": "Error occurred" },
                "expectedOutput": "Error occurred"
              },
              {
                "input": { "error": "Failed" },
                "expectedOutput": "Failed"
              },
              {
                "input": { "error": "Not found" },
                "expectedOutput": "Not found"
              }
            ]
          },
          {
            "description": "// Create an async function that demonstrates sequential execution\n// Await three Promises that resolve with \"First\", \"Second\", \"Third\"\n// Print each result as it arrives\n// Your output should be:\n// First\n// Second\n// Third",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "values": ["First", "Second", "Third"] },
                "expectedOutput": "First\nSecond\nThird"
              },
              {
                "input": { "values": ["A", "B", "C"] },
                "expectedOutput": "A\nB\nC"
              }
            ]
          },
          {
            "description": "// Create an async function that demonstrates parallel execution\n// Create two Promises that resolve with 10 and 20\n// Use Promise.all() with await to get both results simultaneously\n// Print the sum of results\n// Your output should be: 30",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "value1": 10, "value2": 20 },
                "expectedOutput": "30"
              },
              {
                "input": { "value1": 5, "value2": 15 },
                "expectedOutput": "20"
              },
              {
                "input": { "value1": 100, "value2": 200 },
                "expectedOutput": "300"
              }
            ]
          },
          {
            "description": "// Create an async arrow function that awaits a Promise resolving with \"Arrow\"\n// Call it and print the result\n// Your output should be: Arrow",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "value": "Arrow" },
                "expectedOutput": "Arrow"
              },
              {
                "input": { "value": "Function" },
                "expectedOutput": "Function"
              },
              {
                "input": { "value": "Async" },
                "expectedOutput": "Async"
              }
            ]
          },
          {
            "description": "// Create an async function fetchData that returns {id: 1, name: \"User\"}\n// Create an async function processData that awaits fetchData\n// Extract and print the name property\n// Your output should be: User",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "data": { "id": 1, "name": "User" } },
                "expectedOutput": "User"
              },
              {
                "input": { "data": { "id": 2, "name": "Alice" } },
                "expectedOutput": "Alice"
              },
              {
                "input": { "data": { "id": 3, "name": "Bob" } },
                "expectedOutput": "Bob"
              }
            ]
          },
          {
            "description": "// Create an async function with try-catch-finally\n// In try: await a Promise that resolves with \"Success\"\n// In try: print the result\n// In finally: print \"Cleanup\"\n// Your output should be:\n// Success\n// Cleanup",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "value": "Success" },
                "expectedOutput": "Success\nCleanup"
              },
              {
                "input": { "value": "Done" },
                "expectedOutput": "Done\nCleanup"
              }
            ]
          },
          {
            "description": "// Create an async function that chains async operations\n// First await returns 5\n// Second await doubles the previous result\n// Third await adds 10 to the previous result\n// Print final result\n// Your output should be: 20",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "initial": 5 },
                "expectedOutput": "20"
              },
              {
                "input": { "initial": 10 },
                "expectedOutput": "30"
              },
              {
                "input": { "initial": 3 },
                "expectedOutput": "16"
              }
            ]
          },
          {
            "description": "// Create two async functions:\n// fetchUser() returns Promise resolving with {id: 1, name: \"Alice\"}\n// fetchPosts(userId) returns Promise resolving with [\"Post1\", \"Post2\"]\n// Create main async function that awaits both in sequence\n// Print the posts array as JSON string\n// Your output should be: [\"Post1\",\"Post2\"]",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "userId": 1, "posts": ["Post1", "Post2"] },
                "expectedOutput": "[\"Post1\",\"Post2\"]"
              },
              {
                "input": { "userId": 2, "posts": ["Article1", "Article2"] },
                "expectedOutput": "[\"Article1\",\"Article2\"]"
              }
            ]
          },
          {
            "description": "// Create an async function that handles multiple errors\n// Try to await a Promise that rejects with \"Network error\"\n// Catch the error and throw a new error \"Failed to fetch data\"\n// In outer try-catch, catch this new error and print it\n// Your output should be: Failed to fetch data",
            "solution_type": "script",
            "testCases": [
              {
                "input": {},
                "expectedOutput": "Failed to fetch data"
              }
            ]
          },
          {
            "description": "// Create an async function that uses Promise.race() with await\n// First Promise resolves with \"Fast\" after 1 second\n// Second Promise resolves with \"Slow\" after 2 seconds\n// Await Promise.race() and print the fastest result\n// Your output should be: Fast",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "fast": "Fast", "slow": "Slow" },
                "expectedOutput": "Fast"
              },
              {
                "input": { "fast": "Quick", "slow": "Delayed" },
                "expectedOutput": "Quick"
              }
            ]
          },
          {
            "description": "// Create an async function that validates and processes data\n// Await a Promise that resolves with a number\n// If number is negative, throw error \"Invalid number\"\n// Otherwise return number * 2\n// Use try-catch to handle errors\n// Test with number -5\n// Your output should be: Invalid number",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "number": -5 },
                "expectedOutput": "Invalid number"
              },
              {
                "input": { "number": 10 },
                "expectedOutput": "20"
              },
              {
                "input": { "number": -1 },
                "expectedOutput": "Invalid number"
              }
            ]
          },
          {
            "description": "// Create an async function that processes an array of Promises\n// Array contains three Promises resolving with 1, 2, 3\n// Use await with Promise.all() to get all results\n// Use reduce to sum all values\n// Print the sum\n// Your output should be: 6",
            "solution_type": "script",
            "testCases": [
              {
                "input": { "values": [1, 2, 3] },
                "expectedOutput": "6"
              },
              {
                "input": { "values": [5, 10, 15] },
                "expectedOutput": "30"
              },
              {
                "input": { "values": [2, 4, 6, 8] },
                "expectedOutput": "20"
              }
            ]
          }
        ]
      }
    ]
  },
];

export default courses