// Recursion Tests
// Tests for recursive function implementations

export const recursionTopicTests = {
  'recursion': {
    title: 'Functions calling themselves',
    tests: [
      // Task 1: Sum from 1 to n
      {
        description: 'Create a function that returns the sum of numbers from 1 to n using recursion',
        testCases: [
          { input: [5], expectedOutput: '15' },
          { input: [1], expectedOutput: '1' },
          { input: [0], expectedOutput: '0' },
          { input: [10], expectedOutput: '55' },
          { input: [100], expectedOutput: '5050' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [5], expectedOutput: '15' },
            { input: [1], expectedOutput: '1' },
            { input: [0], expectedOutput: '0' },
            { input: [10], expectedOutput: '55' },
            { input: [100], expectedOutput: '5050' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('n', `${code}\nreturn sumToN(n);`);
              const result = String(func(input[0]));
              results.push({
                input: `${input[0]}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${input[0]}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 2: Factorial
      {
        description: 'Create a function that returns the factorial of n using recursion (0! = 1)',
        testCases: [
          { input: [5], expectedOutput: '120' },
          { input: [0], expectedOutput: '1' },
          { input: [1], expectedOutput: '1' },
          { input: [7], expectedOutput: '5040' },
          { input: [3], expectedOutput: '6' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [5], expectedOutput: '120' },
            { input: [0], expectedOutput: '1' },
            { input: [1], expectedOutput: '1' },
            { input: [7], expectedOutput: '5040' },
            { input: [3], expectedOutput: '6' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('n', `${code}\nreturn factorial(n);`);
              const result = String(func(input[0]));
              results.push({
                input: `${input[0]}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${input[0]}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 3: Fibonacci
      {
        description: 'Create a function that returns the nth Fibonacci number using recursion (F(0)=0, F(1)=1)',
        testCases: [
          { input: [6], expectedOutput: '8' },
          { input: [0], expectedOutput: '0' },
          { input: [1], expectedOutput: '1' },
          { input: [10], expectedOutput: '55' },
          { input: [2], expectedOutput: '1' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [6], expectedOutput: '8' },
            { input: [0], expectedOutput: '0' },
            { input: [1], expectedOutput: '1' },
            { input: [10], expectedOutput: '55' },
            { input: [2], expectedOutput: '1' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('n', `${code}\nreturn fibonacci(n);`);
              const result = String(func(input[0]));
              results.push({
                input: `${input[0]}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${input[0]}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 4: Sum array elements
      {
        description: 'Create a function that returns the sum of all elements in an array using recursion',
        testCases: [
          { input: [[1, 2, 3, 4]], expectedOutput: '10' },
          { input: [[]], expectedOutput: '0' },
          { input: [[5]], expectedOutput: '5' },
          { input: [[-1, 0, 1]], expectedOutput: '0' },
          { input: [[10, 20, 30]], expectedOutput: '60' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2, 3, 4]], expectedOutput: '10' },
            { input: [[]], expectedOutput: '0' },
            { input: [[5]], expectedOutput: '5' },
            { input: [[-1, 0, 1]], expectedOutput: '0' },
            { input: [[10, 20, 30]], expectedOutput: '60' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', `${code}\nreturn sumArray(arr);`);
              const result = String(func([...input[0]]));
              results.push({
                input: `[${input[0]}]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `[${input[0]}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 5: Count occurrences
      {
        description: 'Create a function that counts how many times a value appears in an array using recursion',
        testCases: [
          { input: [[1, 2, 1, 3, 1], 1], expectedOutput: '3' },
          { input: [[1, 2, 3], 5], expectedOutput: '0' },
          { input: [[], 1], expectedOutput: '0' },
          { input: [[7, 7, 7], 7], expectedOutput: '3' },
          { input: [[1], 1], expectedOutput: '1' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2, 1, 3, 1], 1], expectedOutput: '3' },
            { input: [[1, 2, 3], 5], expectedOutput: '0' },
            { input: [[], 1], expectedOutput: '0' },
            { input: [[7, 7, 7], 7], expectedOutput: '3' },
            { input: [[1], 1], expectedOutput: '1' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', 'val', `${code}\nreturn countOccurrences(arr, val);`);
              const result = String(func([...input[0]], input[1]));
              results.push({
                input: `[${input[0]}], ${input[1]}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `[${input[0]}], ${input[1]}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 6: Reverse string
      {
        description: 'Create a function that reverses a string using recursion',
        testCases: [
          { input: ['hello'], expectedOutput: 'olleh' },
          { input: [''], expectedOutput: '' },
          { input: ['a'], expectedOutput: 'a' },
          { input: ['ab'], expectedOutput: 'ba' },
          { input: ['12345'], expectedOutput: '54321' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['hello'], expectedOutput: 'olleh' },
            { input: [''], expectedOutput: '' },
            { input: ['a'], expectedOutput: 'a' },
            { input: ['ab'], expectedOutput: 'ba' },
            { input: ['12345'], expectedOutput: '54321' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('str', `${code}\nreturn reverseString(str);`);
              const result = func(input[0]);
              results.push({
                input: `"${input[0]}"`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `"${input[0]}"`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 7: Palindrome check
      {
        description: 'Create a function that checks if a string is a palindrome using recursion',
        testCases: [
          { input: ['racecar'], expectedOutput: 'true' },
          { input: ['hello'], expectedOutput: 'false' },
          { input: [''], expectedOutput: 'true' },
          { input: ['a'], expectedOutput: 'true' },
          { input: ['abba'], expectedOutput: 'true' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['racecar'], expectedOutput: 'true' },
            { input: ['hello'], expectedOutput: 'false' },
            { input: [''], expectedOutput: 'true' },
            { input: ['a'], expectedOutput: 'true' },
            { input: ['abba'], expectedOutput: 'true' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('str', `${code}\nreturn isPalindrome(str);`);
              const result = String(func(input[0]));
              results.push({
                input: `"${input[0]}"`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `"${input[0]}"`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 8: Find maximum
      {
        description: 'Create a function that returns the maximum value in an array using recursion',
        testCases: [
          { input: [[3, 1, 4, 1, 5]], expectedOutput: '5' },
          { input: [[1]], expectedOutput: '1' },
          { input: [[-5, -2, -8]], expectedOutput: '-2' },
          { input: [[10, 10, 10]], expectedOutput: '10' },
          { input: [[1, 100, 50]], expectedOutput: '100' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[3, 1, 4, 1, 5]], expectedOutput: '5' },
            { input: [[1]], expectedOutput: '1' },
            { input: [[-5, -2, -8]], expectedOutput: '-2' },
            { input: [[10, 10, 10]], expectedOutput: '10' },
            { input: [[1, 100, 50]], expectedOutput: '100' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', `${code}\nreturn findMax(arr);`);
              const result = String(func([...input[0]]));
              results.push({
                input: `[${input[0]}]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `[${input[0]}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 9: Power function
      {
        description: 'Create a function that raises a number to a power using recursion (handle power of 0)',
        testCases: [
          { input: [2, 3], expectedOutput: '8' },
          { input: [5, 0], expectedOutput: '1' },
          { input: [3, 4], expectedOutput: '81' },
          { input: [10, 2], expectedOutput: '100' },
          { input: [2, 10], expectedOutput: '1024' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [2, 3], expectedOutput: '8' },
            { input: [5, 0], expectedOutput: '1' },
            { input: [3, 4], expectedOutput: '81' },
            { input: [10, 2], expectedOutput: '100' },
            { input: [2, 10], expectedOutput: '1024' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('base', 'exp', `${code}\nreturn power(base, exp);`);
              const result = String(func(input[0], input[1]));
              results.push({
                input: `${input[0]}, ${input[1]}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${input[0]}, ${input[1]}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 10: Flatten array one level
      {
        description: 'Create a function that flattens a nested array one level deep using recursion',
        testCases: [
          { input: [[[1, 2], [3, 4]]], expectedOutput: '1,2,3,4' },
          { input: [[1, [2, 3], 4]], expectedOutput: '1,2,3,4' },
          { input: [[]], expectedOutput: '' },
          { input: [[[1]]], expectedOutput: '1' },
          { input: [[1, 2, 3]], expectedOutput: '1,2,3' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[[1, 2], [3, 4]]], expectedOutput: '1,2,3,4' },
            { input: [[1, [2, 3], 4]], expectedOutput: '1,2,3,4' },
            { input: [[]], expectedOutput: '' },
            { input: [[[1]]], expectedOutput: '1' },
            { input: [[1, 2, 3]], expectedOutput: '1,2,3' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', `${code}\nreturn flatten(arr);`);
              const result = func(JSON.parse(JSON.stringify(input[0])));
              const resultStr = Array.isArray(result) ? result.join(',') : String(result);
              results.push({
                input: JSON.stringify(input[0]),
                expectedOutput,
                actualOutput: resultStr,
                passed: resultStr === expectedOutput
              });
            } catch (error) {
              results.push({
                input: JSON.stringify(input[0]),
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      }
    ]
  }
};

export default recursionTopicTests;



