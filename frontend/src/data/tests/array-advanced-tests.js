// Array Advanced Patterns Tests
// Tests for method chaining and nested arrays

export const arrayAdvancedTests = {
  'array-advanced-patterns': {
    title: 'Method chaining and nested arrays',
    tests: [
      // Task 1: Sum of even numbers doubled
      {
        description: 'Create a function that takes an array of numbers and returns the sum of all even numbers doubled',
        testCases: [
          { input: [[1, 2, 3, 4]], expectedOutput: '12' },               // Normal mixed
          { input: [[1, 3, 5]], expectedOutput: '0' },                   // No evens
          { input: [[]], expectedOutput: '0' },                          // Empty array
          { input: [[2]], expectedOutput: '4' },                         // Single even
          { input: [[-2, -4, 0]], expectedOutput: '-12' }                // Negative evens + zero
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2, 3, 4]], expectedOutput: '12' },
            { input: [[1, 3, 5]], expectedOutput: '0' },
            { input: [[]], expectedOutput: '0' },
            { input: [[2]], expectedOutput: '4' },
            { input: [[-2, -4, 0]], expectedOutput: '-12' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', `${code}\nreturn sumEvenDoubled(arr);`);
              const result = String(func([...input[0]]));
              results.push({
                input: `[${input[0].join(', ')}]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `[${input[0].join(', ')}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 2: Product of positive numbers incremented by 1
      {
        description: 'Create a function that takes an array of numbers and returns the product of all positive numbers incremented by 1',
        testCases: [
          { input: [[1, 2, 3]], expectedOutput: '24' },                  // Normal: (2)*(3)*(4)=24
          { input: [[-1, -2, -3]], expectedOutput: '1' },                // No positives
          { input: [[]], expectedOutput: '1' },                          // Empty array
          { input: [[5]], expectedOutput: '6' },                         // Single positive
          { input: [[0, 1, 2]], expectedOutput: '6' }                    // Zero not positive: (2)*(3)=6
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2, 3]], expectedOutput: '24' },
            { input: [[-1, -2, -3]], expectedOutput: '1' },
            { input: [[]], expectedOutput: '1' },
            { input: [[5]], expectedOutput: '6' },
            { input: [[0, 1, 2]], expectedOutput: '6' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', `${code}\nreturn productPositiveIncremented(arr);`);
              const result = String(func([...input[0]]));
              results.push({
                input: `[${input[0].join(', ')}]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `[${input[0].join(', ')}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 3: Filter, uppercase, join words longer than 3 chars
      {
        description: 'Create a function that takes an array of strings and returns a single string of all words longer than 3 characters, uppercased and joined by hyphens',
        testCases: [
          { input: [['the', 'quick', 'fox']], expectedOutput: 'QUICK' },  // One word passes
          { input: [['hi', 'to', 'go']], expectedOutput: '' },            // None pass
          { input: [[]], expectedOutput: '' },                            // Empty array
          { input: [['hello', 'world']], expectedOutput: 'HELLO-WORLD' }, // Multiple pass
          { input: [['Test']], expectedOutput: 'TEST' }                   // Exactly 4 chars (boundary)
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [['the', 'quick', 'fox']], expectedOutput: 'QUICK' },
            { input: [['hi', 'to', 'go']], expectedOutput: '' },
            { input: [[]], expectedOutput: '' },
            { input: [['hello', 'world']], expectedOutput: 'HELLO-WORLD' },
            { input: [['Test']], expectedOutput: 'TEST' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', `${code}\nreturn filterUpperJoin(arr);`);
              const result = String(func([...input[0]]));
              results.push({
                input: `["${input[0].join('", "')}"]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `["${input[0].join('", "')}"]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 4: Access element in 2D array
      {
        description: 'Create a function that takes a 2D array (matrix) and row and column indices, and returns the element at that position',
        testCases: [
          { input: [[[1, 2, 3], [4, 5, 6]], 1, 2], expectedOutput: '6' }, // Normal case
          { input: [[[1, 2], [3, 4]], 0, 0], expectedOutput: '1' },       // First element [0][0]
          { input: [[['a', 'b'], ['c', 'd']], 1, 1], expectedOutput: 'd' }, // Last of 2x2
          { input: [[[42]], 0, 0], expectedOutput: '42' },                // Single element matrix
          { input: [[[1, 2, 3, 4, 5]], 0, 4], expectedOutput: '5' }       // Single row, last col
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[[1, 2, 3], [4, 5, 6]], 1, 2], expectedOutput: '6' },
            { input: [[[1, 2], [3, 4]], 0, 0], expectedOutput: '1' },
            { input: [[['a', 'b'], ['c', 'd']], 1, 1], expectedOutput: 'd' },
            { input: [[[42]], 0, 0], expectedOutput: '42' },
            { input: [[[1, 2, 3, 4, 5]], 0, 4], expectedOutput: '5' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('matrix', 'row', 'col', `${code}\nreturn getElement(matrix, row, col);`);
              const result = String(func(input[0], input[1], input[2]));
              results.push({
                input: `matrix, row: ${input[1]}, col: ${input[2]}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `matrix, row: ${input[1]}, col: ${input[2]}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 5: Sum all elements in 2D array
      {
        description: 'Create a function that takes a 2D array of numbers and returns the sum of all elements',
        testCases: [
          { input: [[[1, 2], [3, 4]]], expectedOutput: '10' },            // Normal case
          { input: [[[5]]], expectedOutput: '5' },                        // Single element
          { input: [[[]]], expectedOutput: '0' },                         // Empty inner array
          { input: [[[1, -1], [2, -2]]], expectedOutput: '0' },           // Sum to zero
          { input: [[[-5, -3], [-2]]], expectedOutput: '-10' }            // All negative
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[[1, 2], [3, 4]]], expectedOutput: '10' },
            { input: [[[5]]], expectedOutput: '5' },
            { input: [[[]]], expectedOutput: '0' },
            { input: [[[1, -1], [2, -2]]], expectedOutput: '0' },
            { input: [[[-5, -3], [-2]]], expectedOutput: '-10' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('matrix', `${code}\nreturn sumMatrix(matrix);`);
              const result = String(func(input[0]));
              results.push({
                input: `${JSON.stringify(input[0])}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${JSON.stringify(input[0])}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 6: Flatten nested array one level
      {
        description: 'Create a function that takes a nested array and returns a flattened array (one level deep)',
        testCases: [
          { input: [[[1, 2], [3, 4]]], expectedOutput: '1,2,3,4' },       // Normal case
          { input: [[[1]]], expectedOutput: '1' },                        // Single element nested
          { input: [[[], [1], []]], expectedOutput: '1' },                // Empty arrays mixed
          { input: [[[1, [2, 3]], [4]]], expectedOutput: '1,2,3,4' },     // Deeper nesting (flat 1 level)
          { input: [[['a'], ['b']]], expectedOutput: 'a,b' }              // Strings
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[[1, 2], [3, 4]]], expectedOutput: '1,2,3,4' },
            { input: [[[1]]], expectedOutput: '1' },
            { input: [[[], [1], []]], expectedOutput: '1' },
            { input: [[[1, [2, 3]], [4]]], expectedOutput: '1,2,3,4' },
            { input: [[['a'], ['b']]], expectedOutput: 'a,b' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', `${code}\nreturn flattenArray(arr);`);
              const result = func(JSON.parse(JSON.stringify(input[0])));
              const resultStr = Array.isArray(result) ? result.join(',') : String(result);
              results.push({
                input: `${JSON.stringify(input[0])}`,
                expectedOutput,
                actualOutput: resultStr,
                passed: resultStr === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${JSON.stringify(input[0])}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 7: flatMap to square numbers
      {
        description: 'Create a function that takes an array of arrays of numbers and returns a flat array with each number squared',
        testCases: [
          { input: [[[1, 2], [3]]], expectedOutput: '1,4,9' },            // Normal case
          { input: [[[]]], expectedOutput: '' },                          // Empty inner
          { input: [[[-2], [3]]], expectedOutput: '4,9' },                // Negative squared
          { input: [[[0, 1]]], expectedOutput: '0,1' },                   // Zero squared
          { input: [[[5]]], expectedOutput: '25' }                        // Single element
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[[1, 2], [3]]], expectedOutput: '1,4,9' },
            { input: [[[]]], expectedOutput: '' },
            { input: [[[-2], [3]]], expectedOutput: '4,9' },
            { input: [[[0, 1]]], expectedOutput: '0,1' },
            { input: [[[5]]], expectedOutput: '25' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', `${code}\nreturn flatMapSquare(arr);`);
              const result = func(JSON.parse(JSON.stringify(input[0])));
              const resultStr = Array.isArray(result) ? result.join(',') : String(result);
              results.push({
                input: `${JSON.stringify(input[0])}`,
                expectedOutput,
                actualOutput: resultStr,
                passed: resultStr === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${JSON.stringify(input[0])}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 8: Index of row with maximum sum
      {
        description: 'Create a function that takes a 2D array of numbers and returns the index of the row with the maximum sum',
        testCases: [
          { input: [[[1, 2], [5, 6], [3, 4]]], expectedOutput: '1' },     // Middle row max
          { input: [[[10, 20], [5, 5]]], expectedOutput: '0' },           // First row max
          { input: [[[1], [2], [3]]], expectedOutput: '2' },              // Last row max
          { input: [[[-1, -2], [-3, -4]]], expectedOutput: '0' },         // All negative, first wins
          { input: [[[100]]], expectedOutput: '0' }                       // Single row
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[[1, 2], [5, 6], [3, 4]]], expectedOutput: '1' },
            { input: [[[10, 20], [5, 5]]], expectedOutput: '0' },
            { input: [[[1], [2], [3]]], expectedOutput: '2' },
            { input: [[[-1, -2], [-3, -4]]], expectedOutput: '0' },
            { input: [[[100]]], expectedOutput: '0' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('matrix', `${code}\nreturn maxSumRowIndex(matrix);`);
              const result = String(func(input[0]));
              results.push({
                input: `${JSON.stringify(input[0])}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${JSON.stringify(input[0])}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 9: Average score of entries above 50
      {
        description: 'Create a function that takes an array of objects with name and score properties, and returns the average score of entries with scores above 50',
        testCases: [
          { input: [[{name: 'A', score: 60}, {name: 'B', score: 80}]], expectedOutput: '70' },  // Normal
          { input: [[{name: 'A', score: 30}, {name: 'B', score: 40}]], expectedOutput: '0' },   // None above 50
          { input: [[]], expectedOutput: '0' },                                                 // Empty array
          { input: [[{name: 'Solo', score: 100}]], expectedOutput: '100' },                     // Single above 50
          { input: [[{name: 'A', score: 51}, {name: 'B', score: 49}]], expectedOutput: '51' }   // Boundary (51 passes, 49 not)
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[{name: 'A', score: 60}, {name: 'B', score: 80}]], expectedOutput: '70' },
            { input: [[{name: 'A', score: 30}, {name: 'B', score: 40}]], expectedOutput: '0' },
            { input: [[]], expectedOutput: '0' },
            { input: [[{name: 'Solo', score: 100}]], expectedOutput: '100' },
            { input: [[{name: 'A', score: 51}, {name: 'B', score: 49}]], expectedOutput: '51' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('entries', `${code}\nreturn averageAbove50(entries);`);
              const result = String(func(JSON.parse(JSON.stringify(input[0]))));
              results.push({
                input: `${JSON.stringify(input[0])}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${JSON.stringify(input[0])}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 10: Transpose a 2D matrix
      {
        description: 'Create a function that takes a 2D array (square matrix) and returns its transpose (rows become columns)',
        testCases: [
          { input: [[[1, 2], [3, 4]]], expectedOutput: '1,3|2,4' },                  // 2x2
          { input: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expectedOutput: '1,4,7|2,5,8|3,6,9' }, // 3x3
          { input: [[[1]]], expectedOutput: '1' },                                   // 1x1
          { input: [[[0, 1], [1, 0]]], expectedOutput: '0,1|1,0' },                  // Identity-like
          { input: [[['a', 'b'], ['c', 'd']]], expectedOutput: 'a,c|b,d' }           // Strings
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[[1, 2], [3, 4]]], expectedOutput: '1,3|2,4' },
            { input: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expectedOutput: '1,4,7|2,5,8|3,6,9' },
            { input: [[[1]]], expectedOutput: '1' },
            { input: [[[0, 1], [1, 0]]], expectedOutput: '0,1|1,0' },
            { input: [[['a', 'b'], ['c', 'd']]], expectedOutput: 'a,c|b,d' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('matrix', `${code}\nreturn transpose(matrix);`);
              const result = func(JSON.parse(JSON.stringify(input[0])));
              const resultStr = Array.isArray(result) ? result.map(row => row.join(',')).join('|') : String(result);
              results.push({
                input: `${JSON.stringify(input[0])}`,
                expectedOutput,
                actualOutput: resultStr,
                passed: resultStr === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${JSON.stringify(input[0])}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 11: Total char count of words starting with vowel
      {
        description: 'Create a function that takes an array of words and returns the total character count of words that start with a vowel',
        testCases: [
          { input: [['apple', 'banana', 'orange']], expectedOutput: '11' },  // a(5) + o(6) = 11
          { input: [['cat', 'dog', 'fish']], expectedOutput: '0' },          // None start with vowel
          { input: [[]], expectedOutput: '0' },                              // Empty array
          { input: [['a', 'e', 'i']], expectedOutput: '3' },                 // Single char vowels
          { input: [['Apple', 'UMBRELLA']], expectedOutput: '13' }           // Case insensitive
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [['apple', 'banana', 'orange']], expectedOutput: '11' },
            { input: [['cat', 'dog', 'fish']], expectedOutput: '0' },
            { input: [[]], expectedOutput: '0' },
            { input: [['a', 'e', 'i']], expectedOutput: '3' },
            { input: [['Apple', 'UMBRELLA']], expectedOutput: '13' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('words', `${code}\nreturn vowelWordCharCount(words);`);
              const result = String(func([...input[0]]));
              results.push({
                input: `["${input[0].join('", "')}"]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `["${input[0].join('", "')}"]`,
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

export default arrayAdvancedTests;
