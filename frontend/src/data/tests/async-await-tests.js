// Async/Await Tests
// Tests for writing cleaner asynchronous code with async/await

export const asyncAwaitTopicTests = {
  'async-await': {
    title: 'Writing cleaner asynchronous code',
    tests: [
      // Task 1: Basic async function returning doubled number
      {
        description: 'Create an async function that takes a number and returns it doubled (the function should return, not log)',
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
              const func = new AsyncFunction('num', `${code}\nreturn await doubleNumber(num);`);
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
      // Task 2: Await promise and return uppercase
      {
        description: 'Create an async function that awaits a promise and returns the uppercase version of the resolved string',
        testCases: [
          { input: ['hello'], expectedOutput: 'HELLO' },
          { input: ['world'], expectedOutput: 'WORLD' },
          { input: ['JavaScript'], expectedOutput: 'JAVASCRIPT' },
          { input: [''], expectedOutput: '' },
          { input: ['ABC'], expectedOutput: 'ABC' }
        ],
        testFunction: async (code) => {
          const results = [];
          const testCases = [
            { input: ['hello'], expectedOutput: 'HELLO' },
            { input: ['world'], expectedOutput: 'WORLD' },
            { input: ['JavaScript'], expectedOutput: 'JAVASCRIPT' },
            { input: [''], expectedOutput: '' },
            { input: ['ABC'], expectedOutput: 'ABC' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
              // Provide a helper promise that resolves with the input string
              const func = new AsyncFunction('str', `
                const getStringPromise = (s) => Promise.resolve(s);
                ${code}
                return await toUpperAsync(str);
              `);
              const result = String(await func(input[0]));
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
      // Task 3: Async function with throw for validation
      {
        description: 'Create an async function that takes a number. If positive, return doubled value. If zero or negative, throw "Must be positive"',
        testCases: [
          { input: [5], expectedOutput: 'success: 10' },
          { input: [0], expectedOutput: 'error: Must be positive' },
          { input: [-5], expectedOutput: 'error: Must be positive' },
          { input: [1], expectedOutput: 'success: 2' },
          { input: [50], expectedOutput: 'success: 100' }
        ],
        testFunction: async (code) => {
          const results = [];
          const testCases = [
            { input: [5], expectedOutput: 'success: 10' },
            { input: [0], expectedOutput: 'error: Must be positive' },
            { input: [-5], expectedOutput: 'error: Must be positive' },
            { input: [1], expectedOutput: 'success: 2' },
            { input: [50], expectedOutput: 'success: 100' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
              const func = new AsyncFunction('num', `
                ${code}
                try {
                  const result = await validateAndDouble(num);
                  return 'success: ' + result;
                } catch (err) {
                  return 'error: ' + err.message;
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
      // Task 4: Try-catch with await
      {
        description: 'Create an async function that uses try-catch: await a promise that may reject, return "success" or "failed" based on outcome',
        testCases: [
          { input: [true], expectedOutput: 'success' },
          { input: [false], expectedOutput: 'failed' },
          { input: [true], expectedOutput: 'success' },
          { input: [false], expectedOutput: 'failed' }
        ],
        testFunction: async (code) => {
          const results = [];
          const testCases = [
            { input: [true], expectedOutput: 'success' },
            { input: [false], expectedOutput: 'failed' },
            { input: [true], expectedOutput: 'success' },
            { input: [false], expectedOutput: 'failed' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
              const func = new AsyncFunction('shouldSucceed', `
                const maybeReject = (success) => success ? Promise.resolve('ok') : Promise.reject('error');
                ${code}
                return await handleMaybeReject(shouldSucceed);
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
      // Task 5: Async function with array sum
      {
        description: 'Create an async function that takes an array of numbers and returns their sum by awaiting a summing promise',
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
              const func = new AsyncFunction('arr', `
                const sumPromise = (numbers) => Promise.resolve(numbers.reduce((a, b) => a + b, 0));
                ${code}
                return await sumArray(arr);
              `);
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
      // Task 6: Sequential awaits
      {
        description: 'Create an async function that sequentially awaits two promises: first doubles a number, then adds 10 to the result',
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
              const func = new AsyncFunction('num', `
                const doublePromise = (n) => Promise.resolve(n * 2);
                const addTenPromise = (n) => Promise.resolve(n + 10);
                ${code}
                return await sequentialOps(num);
              `);
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
      // Task 7: Promise.all with await
      {
        description: 'Create an async function that uses Promise.all with await to double all numbers in an array in parallel',
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
              const func = new AsyncFunction('arr', `
                const doubleAsync = (n) => Promise.resolve(n * 2);
                ${code}
                return await doubleAllParallel(arr);
              `);
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
      // Task 8: Async arrow function
      {
        description: 'Create an async arrow function that takes two numbers and returns their product',
        testCases: [
          { input: [3, 4], expectedOutput: '12' },
          { input: [0, 5], expectedOutput: '0' },
          { input: [-2, 3], expectedOutput: '-6' },
          { input: [7, 7], expectedOutput: '49' },
          { input: [1, 1], expectedOutput: '1' }
        ],
        testFunction: async (code) => {
          const results = [];
          const testCases = [
            { input: [3, 4], expectedOutput: '12' },
            { input: [0, 5], expectedOutput: '0' },
            { input: [-2, 3], expectedOutput: '-6' },
            { input: [7, 7], expectedOutput: '49' },
            { input: [1, 1], expectedOutput: '1' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;
              const func = new AsyncFunction('a', 'b', `${code}\nreturn await multiply(a, b);`);
              const result = String(await func(input[0], input[1]));
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
      }
    ]
  }
};

export default asyncAwaitTopicTests;




