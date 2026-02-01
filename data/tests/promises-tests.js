// Promises Tests
// Tests for creating, consuming, and chaining promises

export const promisesTopicTests = {
  'promises': {
    title: 'Creating and consuming promises',
    tests: [
      // Task 1: Promise that resolves with doubled number
      {
        description: 'Create a function that returns a promise which resolves with the number doubled after a simulated delay',
        testCases: [
          { input: [5], expectedOutput: '10' },
          { input: [0], expectedOutput: '0' },
          { input: [-3], expectedOutput: '-6' },
          { input: [100], expectedOutput: '200' },
          { input: [0.5], expectedOutput: '1' }
        ],
        testFunction: async (code) => {
          const results = [];
          const testCases = [
            { input: [5], expectedOutput: '10' },
            { input: [0], expectedOutput: '0' },
            { input: [-3], expectedOutput: '-6' },
            { input: [100], expectedOutput: '200' },
            { input: [0.5], expectedOutput: '1' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
              const func = new AsyncFunction('num', `${code}\nreturn await doubleAsync(num);`);
              const result = String(await func(input[0]));
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
      // Task 2: Promise that resolves/rejects based on positive check
      {
        description: 'Create a function that returns a promise which resolves if number is positive, rejects with "Number must be positive" if zero or negative',
        testCases: [
          { input: [5], expectedOutput: 'resolved: 5' },
          { input: [0], expectedOutput: 'rejected: Number must be positive' },
          { input: [-10], expectedOutput: 'rejected: Number must be positive' },
          { input: [1], expectedOutput: 'resolved: 1' },
          { input: [100], expectedOutput: 'resolved: 100' }
        ],
        testFunction: async (code) => {
          const results = [];
          const testCases = [
            { input: [5], expectedOutput: 'resolved: 5' },
            { input: [0], expectedOutput: 'rejected: Number must be positive' },
            { input: [-10], expectedOutput: 'rejected: Number must be positive' },
            { input: [1], expectedOutput: 'resolved: 1' },
            { input: [100], expectedOutput: 'resolved: 100' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
              const func = new AsyncFunction('num', `
                ${code}
                try {
                  const result = await validatePositive(num);
                  return 'resolved: ' + result;
                } catch (err) {
                  return 'rejected: ' + err;
                }
              `);
              const result = await func(input[0]);
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
      // Task 3: Promise based on string length
      {
        description: 'Create a function that takes a string and returns a promise. Resolve with uppercase if length > 3, reject with "Too short" otherwise',
        testCases: [
          { input: ['hello'], expectedOutput: 'resolved: HELLO' },
          { input: ['hi'], expectedOutput: 'rejected: Too short' },
          { input: ['abc'], expectedOutput: 'rejected: Too short' },
          { input: ['test'], expectedOutput: 'resolved: TEST' },
          { input: [''], expectedOutput: 'rejected: Too short' }
        ],
        testFunction: async (code) => {
          const results = [];
          const testCases = [
            { input: ['hello'], expectedOutput: 'resolved: HELLO' },
            { input: ['hi'], expectedOutput: 'rejected: Too short' },
            { input: ['abc'], expectedOutput: 'rejected: Too short' },
            { input: ['test'], expectedOutput: 'resolved: TEST' },
            { input: [''], expectedOutput: 'rejected: Too short' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
              const func = new AsyncFunction('str', `
                ${code}
                try {
                  const result = await processString(str);
                  return 'resolved: ' + result;
                } catch (err) {
                  return 'rejected: ' + err;
                }
              `);
              const result = await func(input[0]);
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
      // Task 4: Chained promises (double then add 10)
      {
        description: 'Create a function that chains promises: takes a number, doubles it, then adds 10, returns the final result',
        testCases: [
          { input: [5], expectedOutput: '20' },
          { input: [0], expectedOutput: '10' },
          { input: [-5], expectedOutput: '0' },
          { input: [10], expectedOutput: '30' },
          { input: [1], expectedOutput: '12' }
        ],
        testFunction: async (code) => {
          const results = [];
          const testCases = [
            { input: [5], expectedOutput: '20' },
            { input: [0], expectedOutput: '10' },
            { input: [-5], expectedOutput: '0' },
            { input: [10], expectedOutput: '30' },
            { input: [1], expectedOutput: '12' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
              const func = new AsyncFunction('num', `${code}\nreturn await chainedOperation(num);`);
              const result = String(await func(input[0]));
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
      // Task 5: Promise.resolve/reject based on even/odd
      {
        description: 'Create a function using Promise.resolve or Promise.reject: return resolved promise with "even" if number is even, rejected with "odd" if odd',
        testCases: [
          { input: [4], expectedOutput: 'resolved: even' },
          { input: [3], expectedOutput: 'rejected: odd' },
          { input: [0], expectedOutput: 'resolved: even' },
          { input: [-2], expectedOutput: 'resolved: even' },
          { input: [1], expectedOutput: 'rejected: odd' }
        ],
        testFunction: async (code) => {
          const results = [];
          const testCases = [
            { input: [4], expectedOutput: 'resolved: even' },
            { input: [3], expectedOutput: 'rejected: odd' },
            { input: [0], expectedOutput: 'resolved: even' },
            { input: [-2], expectedOutput: 'resolved: even' },
            { input: [1], expectedOutput: 'rejected: odd' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
              const func = new AsyncFunction('num', `
                ${code}
                try {
                  const result = await checkEvenOdd(num);
                  return 'resolved: ' + result;
                } catch (err) {
                  return 'rejected: ' + err;
                }
              `);
              const result = await func(input[0]);
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
      // Task 6: Promise.resolve with array sum
      {
        description: 'Create a function that takes an array of numbers, returns a promise that resolves with their sum (using Promise.resolve)',
        testCases: [
          { input: [[1, 2, 3]], expectedOutput: '6' },
          { input: [[]], expectedOutput: '0' },
          { input: [[10]], expectedOutput: '10' },
          { input: [[-1, 1]], expectedOutput: '0' },
          { input: [[5, 5, 5, 5]], expectedOutput: '20' }
        ],
        testFunction: async (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2, 3]], expectedOutput: '6' },
            { input: [[]], expectedOutput: '0' },
            { input: [[10]], expectedOutput: '10' },
            { input: [[-1, 1]], expectedOutput: '0' },
            { input: [[5, 5, 5, 5]], expectedOutput: '20' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
              const func = new AsyncFunction('arr', `${code}\nreturn await sumArray(arr);`);
              const result = String(await func([...input[0]]));
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
      // Task 7: Promise.all-like behavior
      {
        description: 'Create a function that simulates Promise.all behavior: takes array of values, returns promise resolving with array of doubled values',
        testCases: [
          { input: [[1, 2, 3]], expectedOutput: '2,4,6' },
          { input: [[5]], expectedOutput: '10' },
          { input: [[0, 10]], expectedOutput: '0,20' },
          { input: [[-1, 0, 1]], expectedOutput: '-2,0,2' },
          { input: [[]], expectedOutput: '' }
        ],
        testFunction: async (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2, 3]], expectedOutput: '2,4,6' },
            { input: [[5]], expectedOutput: '10' },
            { input: [[0, 10]], expectedOutput: '0,20' },
            { input: [[-1, 0, 1]], expectedOutput: '-2,0,2' },
            { input: [[]], expectedOutput: '' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
              const func = new AsyncFunction('arr', `${code}\nreturn await doubleAll(arr);`);
              const result = await func([...input[0]]);
              const resultStr = Array.isArray(result) ? result.join(',') : String(result);
              results.push({
                input: `[${input[0]}]`,
                expectedOutput,
                actualOutput: resultStr,
                passed: resultStr === expectedOutput
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
      // Task 8: Complex promise chain with validation
      {
        description: 'Create a function that returns a promise chain: validate number is positive, then double it, then convert to string with "Result: " prefix',
        testCases: [
          { input: [5], expectedOutput: 'Result: 10' },
          { input: [1], expectedOutput: 'Result: 2' },
          { input: [0], expectedOutput: 'rejected: Not positive' },
          { input: [-5], expectedOutput: 'rejected: Not positive' },
          { input: [50], expectedOutput: 'Result: 100' }
        ],
        testFunction: async (code) => {
          const results = [];
          const testCases = [
            { input: [5], expectedOutput: 'Result: 10' },
            { input: [1], expectedOutput: 'Result: 2' },
            { input: [0], expectedOutput: 'rejected: Not positive' },
            { input: [-5], expectedOutput: 'rejected: Not positive' },
            { input: [50], expectedOutput: 'Result: 100' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
              const func = new AsyncFunction('num', `
                ${code}
                try {
                  const result = await processNumber(num);
                  return result;
                } catch (err) {
                  return 'rejected: ' + err;
                }
              `);
              const result = await func(input[0]);
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
      }
    ]
  }
};

export default promisesTopicTests;




