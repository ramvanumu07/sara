// Spread and Rest Operators Tests
// Tests for spread and rest operators

export const spreadRestTopicTests = {
  'spread-rest': {
    title: 'Spread and rest operators',
    tests: [
      // Task 1: Add element to array end using spread
      {
        description: 'Create a function that takes an array and returns a new array with all elements plus a new element added at the end (without modifying the original)',
        testCases: [
          { input: [[1, 2, 3], 4], expectedOutput: '1,2,3,4' },           // Normal case
          { input: [[], 'first'], expectedOutput: 'first' },              // Empty array
          { input: [[5], 10], expectedOutput: '5,10' },                   // Single element array
          { input: [['a', 'b'], null], expectedOutput: 'a,b,' },          // Adding null
          { input: [[true, false], 0], expectedOutput: 'true,false,0' }   // Mixed types + zero
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2, 3], 4], expectedOutput: '1,2,3,4' },
            { input: [[], 'first'], expectedOutput: 'first' },
            { input: [[5], 10], expectedOutput: '5,10' },
            { input: [['a', 'b'], null], expectedOutput: 'a,b,' },
            { input: [[true, false], 0], expectedOutput: 'true,false,0' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', 'element', `${code}\nreturn addElement(arr, element);`);
              const result = func([...input[0]], input[1]);
              const resultStr = Array.isArray(result) ? result.join(',') : String(result);
              results.push({
                input: `[${input[0]}], ${JSON.stringify(input[1])}`,
                expectedOutput,
                actualOutput: resultStr,
                passed: resultStr === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `[${input[0]}], ${JSON.stringify(input[1])}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 2: Merge two arrays
      {
        description: 'Create a function that takes two arrays and returns a new array with all elements from both arrays combined',
        testCases: [
          { input: [[1, 2], [3, 4]], expectedOutput: '1,2,3,4' },         // Normal case
          { input: [[], [1, 2]], expectedOutput: '1,2' },                 // First empty
          { input: [[1, 2], []], expectedOutput: '1,2' },                 // Second empty
          { input: [[], []], expectedOutput: '' },                        // Both empty
          { input: [[-1, 0], [1]], expectedOutput: '-1,0,1' }             // Negative, zero, positive
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2], [3, 4]], expectedOutput: '1,2,3,4' },
            { input: [[], [1, 2]], expectedOutput: '1,2' },
            { input: [[1, 2], []], expectedOutput: '1,2' },
            { input: [[], []], expectedOutput: '' },
            { input: [[-1, 0], [1]], expectedOutput: '-1,0,1' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr1', 'arr2', `${code}\nreturn mergeArrays(arr1, arr2);`);
              const result = func([...input[0]], [...input[1]]);
              const resultStr = Array.isArray(result) ? result.join(',') : String(result);
              results.push({
                input: `[${input[0]}], [${input[1]}]`,
                expectedOutput,
                actualOutput: resultStr,
                passed: resultStr === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `[${input[0]}], [${input[1]}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 3: Find max using spread with Math.max
      {
        description: 'Create a function that takes an array of numbers and returns the maximum value using Math.max with spread',
        testCases: [
          { input: [[1, 5, 3, 9, 2]], expectedOutput: '9' },              // Normal positive
          { input: [[-5, -2, -10]], expectedOutput: '-2' },               // All negative
          { input: [[42]], expectedOutput: '42' },                        // Single element
          { input: [[0, -1, 1]], expectedOutput: '1' },                   // Zero included
          { input: [[7, 7, 7]], expectedOutput: '7' }                     // All same value
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 5, 3, 9, 2]], expectedOutput: '9' },
            { input: [[-5, -2, -10]], expectedOutput: '-2' },
            { input: [[42]], expectedOutput: '42' },
            { input: [[0, -1, 1]], expectedOutput: '1' },
            { input: [[7, 7, 7]], expectedOutput: '7' }
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
      // Task 4: Add/update object property using spread
      {
        description: 'Create a function that takes an object and a key-value pair, and returns a new object with the property added or updated (without modifying the original)',
        testCases: [
          { input: [{ name: 'John' }, 'age', 25], expectedOutput: '{"name":"John","age":25}' },  // Add new property
          { input: [{ x: 10 }, 'x', 20], expectedOutput: '{"x":20}' },                           // Override existing
          { input: [{}, 'key', 'value'], expectedOutput: '{"key":"value"}' },                  // Empty object
          { input: [{ a: 1 }, 'b', null], expectedOutput: '{"a":1,"b":null}' },                  // Add null value
          { input: [{ a: 1 }, 'b', 0], expectedOutput: '{"a":1,"b":0}' }                         // Add zero (falsy)
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [{ name: 'John' }, 'age', 25], expectedOutput: '{"name":"John","age":25}' },
            { input: [{ x: 10 }, 'x', 20], expectedOutput: '{"x":20}' },
            { input: [{}, 'key', 'value'], expectedOutput: '{"key":"value"}' },
            { input: [{ a: 1 }, 'b', null], expectedOutput: '{"a":1,"b":null}' },
            { input: [{ a: 1 }, 'b', 0], expectedOutput: '{"a":1,"b":0}' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('obj', 'key', 'value', `${code}\nreturn setProperty(obj, key, value);`);
              const result = JSON.stringify(func({ ...input[0] }, input[1], input[2]));
              results.push({
                input: `${JSON.stringify(input[0])}, "${input[1]}", ${JSON.stringify(input[2])}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${JSON.stringify(input[0])}, "${input[1]}", ${JSON.stringify(input[2])}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 5: Merge two objects
      {
        description: 'Create a function that takes two objects and returns a new object with all properties from both (second object properties override first if keys match)',
        testCases: [
          { input: [{ a: 1 }, { b: 2 }], expectedOutput: '{"a":1,"b":2}' },                        // No overlap
          { input: [{ a: 1, b: 2 }, { b: 99 }], expectedOutput: '{"a":1,"b":99}' },                // Override
          { input: [{}, { a: 1 }], expectedOutput: '{"a":1}' },                                  // First empty
          { input: [{ a: 1 }, {}], expectedOutput: '{"a":1}' },                                  // Second empty
          { input: [{}, {}], expectedOutput: '{}' }                                            // Both empty
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [{ a: 1 }, { b: 2 }], expectedOutput: '{"a":1,"b":2}' },
            { input: [{ a: 1, b: 2 }, { b: 99 }], expectedOutput: '{"a":1,"b":99}' },
            { input: [{}, { a: 1 }], expectedOutput: '{"a":1}' },
            { input: [{ a: 1 }, {}], expectedOutput: '{"a":1}' },
            { input: [{}, {}], expectedOutput: '{}' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('obj1', 'obj2', `${code}\nreturn mergeObjects(obj1, obj2);`);
              const result = JSON.stringify(func({ ...input[0] }, { ...input[1] }));
              results.push({
                input: `${JSON.stringify(input[0])}, ${JSON.stringify(input[1])}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${JSON.stringify(input[0])}, ${JSON.stringify(input[1])}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 6: Sum using rest parameters
      {
        description: 'Create a function using rest parameters that takes any number of arguments and returns their sum',
        testCases: [
          { input: [1, 2, 3], expectedOutput: '6' },                      // Normal case
          { input: [], expectedOutput: '0' },                             // No arguments
          { input: [42], expectedOutput: '42' },                          // Single argument
          { input: [-5, 5], expectedOutput: '0' },                        // Sum to zero
          { input: [0, 0, 0], expectedOutput: '0' }                       // All zeros
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [1, 2, 3], expectedOutput: '6' },
            { input: [], expectedOutput: '0' },
            { input: [42], expectedOutput: '42' },
            { input: [-5, 5], expectedOutput: '0' },
            { input: [0, 0, 0], expectedOutput: '0' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function(`${code}\nreturn sumAll(${input.join(', ')});`);
              const result = String(func());
              results.push({
                input: `${input.join(', ') || '(no arguments)'}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${input.join(', ') || '(no arguments)'}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 7: Count arguments using rest
      {
        description: 'Create a function using rest parameters that takes any number of arguments and returns the count of arguments passed',
        testCases: [
          { input: [1, 2, 3], expectedOutput: '3' },                      // Numbers
          { input: [], expectedOutput: '0' },                             // No arguments
          { input: ['single'], expectedOutput: '1' },                     // Single argument
          { input: [null, undefined, 0, '', false], expectedOutput: '5' }, // Falsy values
          { input: ['a', 'b'], expectedOutput: '2' }                      // Strings
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [1, 2, 3], expectedOutput: '3' },
            { input: [], expectedOutput: '0' },
            { input: ['single'], expectedOutput: '1' },
            { input: [null, undefined, 0, '', false], expectedOutput: '5' },
            { input: ['a', 'b'], expectedOutput: '2' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const inputStr = input.map(v => {
                if (v === null) return 'null';
                if (v === undefined) return 'undefined';
                if (typeof v === 'string') return `"${v}"`;
                return v;
              }).join(', ');
              const func = new Function(`${code}\nreturn countArgs(${inputStr});`);
              const result = String(func());
              results.push({
                input: `${inputStr || '(no arguments)'}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${input.join(', ') || '(no arguments)'}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 8: Multiplier with rest parameters
      {
        description: 'Create a function that takes a multiplier as first argument and rest parameters for numbers, and returns an array with each number multiplied by the multiplier',
        testCases: [
          { input: [2, 1, 2, 3], expectedOutput: '2,4,6' },               // Normal case
          { input: [5], expectedOutput: '' },                             // No numbers to multiply
          { input: [0, 5, 10], expectedOutput: '0,0' },                   // Multiply by zero
          { input: [-1, 3, 4], expectedOutput: '-3,-4' },                 // Negative multiplier
          { input: [10, 0], expectedOutput: '0' }                         // Multiply zero
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [2, 1, 2, 3], expectedOutput: '2,4,6' },
            { input: [5], expectedOutput: '' },
            { input: [0, 5, 10], expectedOutput: '0,0' },
            { input: [-1, 3, 4], expectedOutput: '-3,-4' },
            { input: [10, 0], expectedOutput: '0' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function(`${code}\nreturn multiplyAll(${input.join(', ')});`);
              const result = func();
              const resultStr = Array.isArray(result) ? result.join(',') : String(result);
              results.push({
                input: `${input.join(', ')}`,
                expectedOutput,
                actualOutput: resultStr,
                passed: resultStr === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${input.join(', ')}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 9: Full name with rest for middle names
      {
        description: 'Create a function that takes a required first name, required last name, and any number of middle names using rest, and returns the full name joined by spaces',
        testCases: [
          { input: ['John', 'Doe'], expectedOutput: 'John Doe' },                          // No middle name
          { input: ['Mary', 'Jane', 'Smith'], expectedOutput: 'Mary Jane Smith' },         // One middle name
          { input: ['A', 'B', 'C', 'D'], expectedOutput: 'A B C D' },                       // Multiple middle names
          { input: ['First', 'Last'], expectedOutput: 'First Last' },                      // Basic case
          { input: ['X', 'M1', 'M2', 'M3', 'Y'], expectedOutput: 'X M1 M2 M3 Y' }          // Many middle names
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['John', 'Doe'], expectedOutput: 'John Doe' },
            { input: ['Mary', 'Jane', 'Smith'], expectedOutput: 'Mary Jane Smith' },
            { input: ['A', 'B', 'C', 'D'], expectedOutput: 'A B C D' },
            { input: ['First', 'Last'], expectedOutput: 'First Last' },
            { input: ['X', 'M1', 'M2', 'M3', 'Y'], expectedOutput: 'X M1 M2 M3 Y' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const inputStr = input.map(v => `"${v}"`).join(', ');
              const func = new Function(`${code}\nreturn fullName(${inputStr});`);
              const result = String(func());
              results.push({
                input: inputStr,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: input.map(v => `"${v}"`).join(', '),
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 10: Clone and reverse array
      {
        description: 'Create a function that clones an array, reverses the clone, and returns both original order and reversed order as a string separated by " | "',
        testCases: [
          { input: [[1, 2, 3]], expectedOutput: '1,2,3 | 3,2,1' },                 // Normal case
          { input: [[5]], expectedOutput: '5 | 5' },                               // Single element (palindrome)
          { input: [['a', 'b']], expectedOutput: 'a,b | b,a' },                    // Two elements
          { input: [[1, 2, 1]], expectedOutput: '1,2,1 | 1,2,1' },                 // Palindrome array
          { input: [[-1, 0, 1]], expectedOutput: '-1,0,1 | 1,0,-1' }               // Negative, zero, positive
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2, 3]], expectedOutput: '1,2,3 | 3,2,1' },
            { input: [[5]], expectedOutput: '5 | 5' },
            { input: [['a', 'b']], expectedOutput: 'a,b | b,a' },
            { input: [[1, 2, 1]], expectedOutput: '1,2,1 | 1,2,1' },
            { input: [[-1, 0, 1]], expectedOutput: '-1,0,1 | 1,0,-1' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', `${code}\nreturn cloneAndReverse(arr);`);
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
      // Task 11: Array stats using spread
      {
        description: 'Create a function that takes an array of numbers and returns an object with min, max, and sum properties using spread with Math.min and Math.max',
        testCases: [
          { input: [[1, 5, 3, 9, 2]], expectedOutput: '{"min":1,"max":9,"sum":20}' },    // Normal case
          { input: [[7]], expectedOutput: '{"min":7,"max":7,"sum":7}' },                  // Single element
          { input: [[-5, 0, 5]], expectedOutput: '{"min":-5,"max":5,"sum":0}' },          // Sum to zero
          { input: [[-10, -5, -1]], expectedOutput: '{"min":-10,"max":-1,"sum":-16}' },   // All negative
          { input: [[0, 0, 0]], expectedOutput: '{"min":0,"max":0,"sum":0}' }             // All zeros
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 5, 3, 9, 2]], expectedOutput: '{"min":1,"max":9,"sum":20}' },
            { input: [[7]], expectedOutput: '{"min":7,"max":7,"sum":7}' },
            { input: [[-5, 0, 5]], expectedOutput: '{"min":-5,"max":5,"sum":0}' },
            { input: [[-10, -5, -1]], expectedOutput: '{"min":-10,"max":-1,"sum":-16}' },
            { input: [[0, 0, 0]], expectedOutput: '{"min":0,"max":0,"sum":0}' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', `${code}\nreturn arrayStats(arr);`);
              const result = JSON.stringify(func([...input[0]]));
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
      }
    ]
  }
};

export default spreadRestTopicTests;
