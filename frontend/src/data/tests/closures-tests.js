// Closures Tests
// Tests for functions remembering their scope

export const closuresTopicTests = {
  'closures': {
    title: 'Functions remembering their scope',
    tests: [
      // Task 1: Adder function factory
      {
        description: 'Create a function that returns another function. The inner function should add a fixed number (from outer scope) to its argument',
        testCases: [
          { input: [5, 3], expectedOutput: '8' },
          { input: [10, 7], expectedOutput: '17' },
          { input: [0, 5], expectedOutput: '5' },
          { input: [-5, 10], expectedOutput: '5' },
          { input: [100, 1], expectedOutput: '101' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [5, 3], expectedOutput: '8' },
            { input: [10, 7], expectedOutput: '17' },
            { input: [0, 5], expectedOutput: '5' },
            { input: [-5, 10], expectedOutput: '5' },
            { input: [100, 1], expectedOutput: '101' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('fixedNum', 'arg', `
                ${code}
                const adder = createAdder(fixedNum);
                return adder(arg);
              `);
              const result = String(func(input[0], input[1]));
              results.push({
                input: `createAdder(${input[0]})(${input[1]})`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `createAdder(${input[0]})(${input[1]})`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 2: Counter with methods
      {
        description: 'Create a counter function that returns an object with increment, decrement, and getValue methods sharing a private count variable',
        testCases: [
          { input: ['increment', 'increment', 'getValue'], expectedOutput: '2' },
          { input: ['increment', 'decrement', 'getValue'], expectedOutput: '0' },
          { input: ['decrement', 'decrement', 'getValue'], expectedOutput: '-2' },
          { input: ['getValue'], expectedOutput: '0' },
          { input: ['increment', 'increment', 'increment', 'getValue'], expectedOutput: '3' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['increment', 'increment', 'getValue'], expectedOutput: '2' },
            { input: ['increment', 'decrement', 'getValue'], expectedOutput: '0' },
            { input: ['decrement', 'decrement', 'getValue'], expectedOutput: '-2' },
            { input: ['getValue'], expectedOutput: '0' },
            { input: ['increment', 'increment', 'increment', 'getValue'], expectedOutput: '3' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('operations', `
                ${code}
                const counter = createCounter();
                let result;
                for (const op of operations) {
                  result = counter[op]();
                }
                return result;
              `);
              const result = String(func(input));
              results.push({
                input: `[${input.map(s => `"${s}"`).join(', ')}]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `[${input.map(s => `"${s}"`).join(', ')}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 3: Multiplier factory
      {
        description: 'Create a function that takes a multiplier and returns a function that multiplies any number by that multiplier',
        testCases: [
          { input: [2, 5], expectedOutput: '10' },
          { input: [3, 4], expectedOutput: '12' },
          { input: [0, 100], expectedOutput: '0' },
          { input: [10, 10], expectedOutput: '100' },
          { input: [-2, 5], expectedOutput: '-10' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [2, 5], expectedOutput: '10' },
            { input: [3, 4], expectedOutput: '12' },
            { input: [0, 100], expectedOutput: '0' },
            { input: [10, 10], expectedOutput: '100' },
            { input: [-2, 5], expectedOutput: '-10' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('mult', 'num', `
                ${code}
                const multiply = createMultiplier(mult);
                return multiply(num);
              `);
              const result = String(func(input[0], input[1]));
              results.push({
                input: `createMultiplier(${input[0]})(${input[1]})`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `createMultiplier(${input[0]})(${input[1]})`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 4: Greeting factory
      {
        description: 'Create a function that creates a greeting function with a fixed greeting prefix (e.g., "Hello" or "Hi")',
        testCases: [
          { input: ['Hello', 'World'], expectedOutput: 'Hello, World!' },
          { input: ['Hi', 'Alice'], expectedOutput: 'Hi, Alice!' },
          { input: ['Welcome', 'User'], expectedOutput: 'Welcome, User!' },
          { input: ['Hey', 'Bob'], expectedOutput: 'Hey, Bob!' },
          { input: ['Greetings', 'Friend'], expectedOutput: 'Greetings, Friend!' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['Hello', 'World'], expectedOutput: 'Hello, World!' },
            { input: ['Hi', 'Alice'], expectedOutput: 'Hi, Alice!' },
            { input: ['Welcome', 'User'], expectedOutput: 'Welcome, User!' },
            { input: ['Hey', 'Bob'], expectedOutput: 'Hey, Bob!' },
            { input: ['Greetings', 'Friend'], expectedOutput: 'Greetings, Friend!' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('prefix', 'name', `
                ${code}
                const greet = createGreeter(prefix);
                return greet(name);
              `);
              const result = func(input[0], input[1]);
              results.push({
                input: `createGreeter("${input[0]}")("${input[1]}")`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `createGreeter("${input[0]}")("${input[1]}")`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 5: Range checker factory
      {
        description: 'Create a function that returns a function to check if a number is within a fixed range (min and max from outer scope)',
        testCases: [
          { input: [1, 10, 5], expectedOutput: 'true' },
          { input: [1, 10, 15], expectedOutput: 'false' },
          { input: [0, 100, 0], expectedOutput: 'true' },
          { input: [0, 100, 100], expectedOutput: 'true' },
          { input: [-10, 10, 0], expectedOutput: 'true' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [1, 10, 5], expectedOutput: 'true' },
            { input: [1, 10, 15], expectedOutput: 'false' },
            { input: [0, 100, 0], expectedOutput: 'true' },
            { input: [0, 100, 100], expectedOutput: 'true' },
            { input: [-10, 10, 0], expectedOutput: 'true' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('min', 'max', 'num', `
                ${code}
                const inRange = createRangeChecker(min, max);
                return inRange(num);
              `);
              const result = String(func(input[0], input[1], input[2]));
              results.push({
                input: `createRangeChecker(${input[0]}, ${input[1]})(${input[2]})`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `createRangeChecker(${input[0]}, ${input[1]})(${input[2]})`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 6: Running total
      {
        description: 'Create a function that maintains a running total. Each call adds to the total and returns the new sum',
        testCases: [
          { input: [[5, 3, 2]], expectedOutput: '10' },
          { input: [[10]], expectedOutput: '10' },
          { input: [[1, 1, 1, 1]], expectedOutput: '4' },
          { input: [[-5, 10]], expectedOutput: '5' },
          { input: [[0, 0, 0]], expectedOutput: '0' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[5, 3, 2]], expectedOutput: '10' },
            { input: [[10]], expectedOutput: '10' },
            { input: [[1, 1, 1, 1]], expectedOutput: '4' },
            { input: [[-5, 10]], expectedOutput: '5' },
            { input: [[0, 0, 0]], expectedOutput: '0' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('values', `
                ${code}
                const addToTotal = createRunningTotal();
                let result;
                for (const val of values) {
                  result = addToTotal(val);
                }
                return result;
              `);
              const result = String(func([...input[0]]));
              results.push({
                input: `calls with [${input[0]}]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `calls with [${input[0]}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 7: ID generator
      {
        description: 'Create a function that generates unique IDs. Each call returns the next number in sequence starting from 1',
        testCases: [
          { input: [3], expectedOutput: '1,2,3' },
          { input: [1], expectedOutput: '1' },
          { input: [5], expectedOutput: '1,2,3,4,5' },
          { input: [2], expectedOutput: '1,2' },
          { input: [4], expectedOutput: '1,2,3,4' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [3], expectedOutput: '1,2,3' },
            { input: [1], expectedOutput: '1' },
            { input: [5], expectedOutput: '1,2,3,4,5' },
            { input: [2], expectedOutput: '1,2' },
            { input: [4], expectedOutput: '1,2,3,4' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('count', `
                ${code}
                const getId = createIdGenerator();
                const ids = [];
                for (let i = 0; i < count; i++) {
                  ids.push(getId());
                }
                return ids.join(',');
              `);
              const result = func(input[0]);
              results.push({
                input: `${input[0]} calls`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${input[0]} calls`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 8: Once function
      {
        description: 'Create a once function that ensures a given function can only be executed once, returning the cached result on subsequent calls',
        testCases: [
          { input: [5, 3], expectedOutput: '8,8,8' },
          { input: [10, 20], expectedOutput: '30,30,30' },
          { input: [0, 0], expectedOutput: '0,0,0' },
          { input: [-5, 5], expectedOutput: '0,0,0' },
          { input: [100, 1], expectedOutput: '101,101,101' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [5, 3], expectedOutput: '8,8,8' },
            { input: [10, 20], expectedOutput: '30,30,30' },
            { input: [0, 0], expectedOutput: '0,0,0' },
            { input: [-5, 5], expectedOutput: '0,0,0' },
            { input: [100, 1], expectedOutput: '101,101,101' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('a', 'b', `
                ${code}
                const add = (x, y) => x + y;
                const addOnce = once(add);
                const r1 = addOnce(a, b);
                const r2 = addOnce(99, 99);
                const r3 = addOnce(1, 1);
                return r1 + ',' + r2 + ',' + r3;
              `);
              const result = func(input[0], input[1]);
              results.push({
                input: `once(add)(${input[0]}, ${input[1]}) called 3 times`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `once(add)(${input[0]}, ${input[1]}) called 3 times`,
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

export default closuresTopicTests;



