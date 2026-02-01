// Asynchronous JavaScript Basics Tests
// Tests for callbacks, timers concepts, and async patterns

export const asyncBasicsTopicTests = {
  'async-basics': {
    title: 'Callbacks, timers, and async concepts',
    tests: [
      // Task 1: Callback with doubled number
      {
        description: 'Create a function that takes a number and a callback, then calls the callback with the number doubled',
        testCases: [
          { input: [5], expectedOutput: '10' },
          { input: [0], expectedOutput: '0' },
          { input: [-3], expectedOutput: '-6' },
          { input: [100], expectedOutput: '200' },
          { input: [0.5], expectedOutput: '1' }
        ],
        testFunction: (code) => {
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
              let callbackResult = null;
              const callback = (result) => { callbackResult = result; };
              const func = new Function('num', 'callback', `${code}\ndoubleWithCallback(num, callback);`);
              func(input[0], callback);
              const result = String(callbackResult);
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
      // Task 2: Callback with math operations object
      {
        description: 'Create a function that takes two numbers and a callback, calls the callback with an object containing sum, difference, and product',
        testCases: [
          { input: [10, 3], expectedOutput: '{"sum":13,"difference":7,"product":30}' },
          { input: [5, 5], expectedOutput: '{"sum":10,"difference":0,"product":25}' },
          { input: [0, 7], expectedOutput: '{"sum":7,"difference":-7,"product":0}' },
          { input: [-2, 3], expectedOutput: '{"sum":1,"difference":-5,"product":-6}' },
          { input: [1, 1], expectedOutput: '{"sum":2,"difference":0,"product":1}' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [10, 3], expectedOutput: '{"sum":13,"difference":7,"product":30}' },
            { input: [5, 5], expectedOutput: '{"sum":10,"difference":0,"product":25}' },
            { input: [0, 7], expectedOutput: '{"sum":7,"difference":-7,"product":0}' },
            { input: [-2, 3], expectedOutput: '{"sum":1,"difference":-5,"product":-6}' },
            { input: [1, 1], expectedOutput: '{"sum":2,"difference":0,"product":1}' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              let callbackResult = null;
              const callback = (result) => { callbackResult = result; };
              const func = new Function('a', 'b', 'callback', `${code}\nmathOperations(a, b, callback);`);
              func(input[0], input[1], callback);
              const result = JSON.stringify(callbackResult);
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
      // Task 3: Filter evens with callback
      {
        description: 'Create a function that takes an array and a callback, calls the callback with the array filtered to only even numbers',
        testCases: [
          { input: [[1, 2, 3, 4, 5, 6]], expectedOutput: '2,4,6' },
          { input: [[1, 3, 5]], expectedOutput: '' },
          { input: [[2, 4, 6]], expectedOutput: '2,4,6' },
          { input: [[]], expectedOutput: '' },
          { input: [[-2, -1, 0, 1, 2]], expectedOutput: '-2,0,2' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2, 3, 4, 5, 6]], expectedOutput: '2,4,6' },
            { input: [[1, 3, 5]], expectedOutput: '' },
            { input: [[2, 4, 6]], expectedOutput: '2,4,6' },
            { input: [[]], expectedOutput: '' },
            { input: [[-2, -1, 0, 1, 2]], expectedOutput: '-2,0,2' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              let callbackResult = null;
              const callback = (result) => { callbackResult = result; };
              const func = new Function('arr', 'callback', `${code}\nfilterEvens(arr, callback);`);
              func([...input[0]], callback);
              const result = Array.isArray(callbackResult) ? callbackResult.join(',') : String(callbackResult);
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
      // Task 4: Success/Error callbacks
      {
        description: 'Create a function that takes a string and two callbacks (onSuccess, onError). If string is not empty, call onSuccess with uppercase string. If empty, call onError with "Empty string"',
        testCases: [
          { input: ['hello'], expectedOutput: 'success: HELLO' },
          { input: [''], expectedOutput: 'error: Empty string' },
          { input: ['JavaScript'], expectedOutput: 'success: JAVASCRIPT' },
          { input: ['a'], expectedOutput: 'success: A' },
          { input: ['  '], expectedOutput: 'success:   ' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['hello'], expectedOutput: 'success: HELLO' },
            { input: [''], expectedOutput: 'error: Empty string' },
            { input: ['JavaScript'], expectedOutput: 'success: JAVASCRIPT' },
            { input: ['a'], expectedOutput: 'success: A' },
            { input: ['  '], expectedOutput: 'success:   ' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              let result = '';
              const onSuccess = (val) => { result = `success: ${val}`; };
              const onError = (err) => { result = `error: ${err}`; };
              const func = new Function('str', 'onSuccess', 'onError', `${code}\nprocessString(str, onSuccess, onError);`);
              func(input[0], onSuccess, onError);
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
      // Task 5: Array stats with callback
      {
        description: 'Create a function that takes an array of numbers and a callback. Call the callback with an object containing min, max, and average',
        testCases: [
          { input: [[1, 2, 3, 4, 5]], expectedOutput: '{"min":1,"max":5,"avg":3}' },
          { input: [[10]], expectedOutput: '{"min":10,"max":10,"avg":10}' },
          { input: [[-5, 0, 5]], expectedOutput: '{"min":-5,"max":5,"avg":0}' },
          { input: [[2, 2, 2]], expectedOutput: '{"min":2,"max":2,"avg":2}' },
          { input: [[1, 100]], expectedOutput: '{"min":1,"max":100,"avg":50.5}' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2, 3, 4, 5]], expectedOutput: '{"min":1,"max":5,"avg":3}' },
            { input: [[10]], expectedOutput: '{"min":10,"max":10,"avg":10}' },
            { input: [[-5, 0, 5]], expectedOutput: '{"min":-5,"max":5,"avg":0}' },
            { input: [[2, 2, 2]], expectedOutput: '{"min":2,"max":2,"avg":2}' },
            { input: [[1, 100]], expectedOutput: '{"min":1,"max":100,"avg":50.5}' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              let callbackResult = null;
              const callback = (result) => { callbackResult = result; };
              const func = new Function('arr', 'callback', `${code}\narrayStats(arr, callback);`);
              func([...input[0]], callback);
              const result = JSON.stringify(callbackResult);
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
      // Task 6: Transform with callback
      {
        description: 'Create a function that simulates async flow: takes a value, a transform function, and a callback. Apply transform to value, then pass result to callback',
        testCases: [
          { input: [5, 'double'], expectedOutput: '10' },
          { input: [5, 'square'], expectedOutput: '25' },
          { input: [5, 'negate'], expectedOutput: '-5' },
          { input: [0, 'double'], expectedOutput: '0' },
          { input: [-3, 'square'], expectedOutput: '9' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [5, 'double'], expectedOutput: '10' },
            { input: [5, 'square'], expectedOutput: '25' },
            { input: [5, 'negate'], expectedOutput: '-5' },
            { input: [0, 'double'], expectedOutput: '0' },
            { input: [-3, 'square'], expectedOutput: '9' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              let callbackResult = null;
              const callback = (result) => { callbackResult = result; };
              const func = new Function('value', 'transformType', 'callback', `${code}\ntransformValue(value, transformType, callback);`);
              func(input[0], input[1], callback);
              const result = String(callbackResult);
              results.push({
                input: `${input[0]}, "${input[1]}"`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${input[0]}, "${input[1]}"`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 7: Sort strings with callback
      {
        description: 'Create a function that takes an array of strings and a callback. Sort alphabetically, then call callback with the sorted array joined by comma',
        testCases: [
          { input: [['banana', 'apple', 'cherry']], expectedOutput: 'apple,banana,cherry' },
          { input: [['z', 'a', 'm']], expectedOutput: 'a,m,z' },
          { input: [['only']], expectedOutput: 'only' },
          { input: [[]], expectedOutput: '' },
          { input: [['B', 'a', 'C']], expectedOutput: 'B,C,a' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [['banana', 'apple', 'cherry']], expectedOutput: 'apple,banana,cherry' },
            { input: [['z', 'a', 'm']], expectedOutput: 'a,m,z' },
            { input: [['only']], expectedOutput: 'only' },
            { input: [[]], expectedOutput: '' },
            { input: [['B', 'a', 'C']], expectedOutput: 'B,C,a' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              let callbackResult = null;
              const callback = (result) => { callbackResult = result; };
              const func = new Function('arr', 'callback', `${code}\nsortAndJoin(arr, callback);`);
              func([...input[0]], callback);
              const result = String(callbackResult);
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
      // Task 8: Event loop order understanding
      {
        description: 'Given: console.log("A"); setTimeout(() => console.log("B"), 0); console.log("C"); - What is the output order? Return as string "X,Y,Z"',
        testCases: [
          { input: [], expectedOutput: 'A,C,B' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [], expectedOutput: 'A,C,B' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function(`${code}\nreturn getExecutionOrder();`);
              const result = String(func());
              results.push({
                input: '(no input - predict execution order)',
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: '(no input - predict execution order)',
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

export default asyncBasicsTopicTests;




