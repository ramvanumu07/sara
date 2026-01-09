// Modules Tests
// Tests for module patterns and code organization

export const modulesTopicTests = {
  'modules': {
    title: 'Organizing code with modules',
    tests: [
      // Task 1: Counter module
      {
        description: 'Create a module pattern (using IIFE) that has a private counter and exposes increment, decrement, and getValue methods',
        testCases: [
          { input: [['increment', 'increment', 'getValue']], expectedOutput: '2' },
          { input: [['decrement', 'getValue']], expectedOutput: '-1' },
          { input: [['getValue']], expectedOutput: '0' },
          { input: [['increment', 'decrement', 'increment', 'getValue']], expectedOutput: '1' },
          { input: [['increment', 'increment', 'increment', 'decrement', 'getValue']], expectedOutput: '2' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [['increment', 'increment', 'getValue']], expectedOutput: '2' },
            { input: [['decrement', 'getValue']], expectedOutput: '-1' },
            { input: [['getValue']], expectedOutput: '0' },
            { input: [['increment', 'decrement', 'increment', 'getValue']], expectedOutput: '1' },
            { input: [['increment', 'increment', 'increment', 'decrement', 'getValue']], expectedOutput: '2' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('operations', `
                ${code}
                let result;
                for (const op of operations) {
                  result = counterModule[op]();
                }
                return result;
              `);
              const result = String(func([...input[0]]));
              results.push({
                input: `operations: [${input[0].map(s => `"${s}"`).join(', ')}]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `operations: [${input[0].map(s => `"${s}"`).join(', ')}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 2: Calculator module
      {
        description: 'Create a calculator module with add, subtract, multiply, divide methods that operate on a result value (starts at 0)',
        testCases: [
          { input: [[['add', 10], ['subtract', 3], ['getResult']]], expectedOutput: '7' },
          { input: [[['add', 5], ['multiply', 2], ['getResult']]], expectedOutput: '10' },
          { input: [[['add', 20], ['divide', 4], ['getResult']]], expectedOutput: '5' },
          { input: [[['getResult']]], expectedOutput: '0' },
          { input: [[['subtract', 5], ['getResult']]], expectedOutput: '-5' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[['add', 10], ['subtract', 3], ['getResult']]], expectedOutput: '7' },
            { input: [[['add', 5], ['multiply', 2], ['getResult']]], expectedOutput: '10' },
            { input: [[['add', 20], ['divide', 4], ['getResult']]], expectedOutput: '5' },
            { input: [[['getResult']]], expectedOutput: '0' },
            { input: [[['subtract', 5], ['getResult']]], expectedOutput: '-5' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('operations', `
                ${code}
                let result;
                for (const [method, arg] of operations) {
                  if (arg !== undefined) {
                    result = calculatorModule[method](arg);
                  } else {
                    result = calculatorModule[method]();
                  }
                }
                return result;
              `);
              const result = String(func(JSON.parse(JSON.stringify(input[0]))));
              results.push({
                input: JSON.stringify(input[0]),
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
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
      },
      // Task 3: User module
      {
        description: 'Create a user module with private data and public methods: setName, getName, setAge, getAge',
        testCases: [
          { input: [[['setName', 'Alice'], ['getName']]], expectedOutput: 'Alice' },
          { input: [[['setAge', 25], ['getAge']]], expectedOutput: '25' },
          { input: [[['setName', 'Bob'], ['setAge', 30], ['getName']]], expectedOutput: 'Bob' },
          { input: [[['getName']]], expectedOutput: '' },
          { input: [[['setName', 'Test'], ['setName', 'Final'], ['getName']]], expectedOutput: 'Final' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[['setName', 'Alice'], ['getName']]], expectedOutput: 'Alice' },
            { input: [[['setAge', 25], ['getAge']]], expectedOutput: '25' },
            { input: [[['setName', 'Bob'], ['setAge', 30], ['getName']]], expectedOutput: 'Bob' },
            { input: [[['getName']]], expectedOutput: '' },
            { input: [[['setName', 'Test'], ['setName', 'Final'], ['getName']]], expectedOutput: 'Final' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('operations', `
                ${code}
                let result;
                for (const [method, arg] of operations) {
                  if (arg !== undefined) {
                    result = userModule[method](arg);
                  } else {
                    result = userModule[method]();
                  }
                }
                return String(result);
              `);
              const result = func(JSON.parse(JSON.stringify(input[0])));
              results.push({
                input: JSON.stringify(input[0]),
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
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
      },
      // Task 4: Logger module
      {
        description: 'Create a logger module with log, warn, error methods that store messages, and a getAll method returning all messages as array',
        testCases: [
          { input: [[['log', 'info'], ['warn', 'warning'], ['getAll']]], expectedOutput: '[LOG] info,[WARN] warning' },
          { input: [[['error', 'oops'], ['getAll']]], expectedOutput: '[ERROR] oops' },
          { input: [[['getAll']]], expectedOutput: '' },
          { input: [[['log', 'a'], ['log', 'b'], ['getAll']]], expectedOutput: '[LOG] a,[LOG] b' },
          { input: [[['warn', 'x'], ['error', 'y'], ['log', 'z'], ['getAll']]], expectedOutput: '[WARN] x,[ERROR] y,[LOG] z' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[['log', 'info'], ['warn', 'warning'], ['getAll']]], expectedOutput: '[LOG] info,[WARN] warning' },
            { input: [[['error', 'oops'], ['getAll']]], expectedOutput: '[ERROR] oops' },
            { input: [[['getAll']]], expectedOutput: '' },
            { input: [[['log', 'a'], ['log', 'b'], ['getAll']]], expectedOutput: '[LOG] a,[LOG] b' },
            { input: [[['warn', 'x'], ['error', 'y'], ['log', 'z'], ['getAll']]], expectedOutput: '[WARN] x,[ERROR] y,[LOG] z' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('operations', `
                ${code}
                let result;
                for (const [method, arg] of operations) {
                  if (arg !== undefined) {
                    result = loggerModule[method](arg);
                  } else {
                    result = loggerModule[method]();
                  }
                }
                return Array.isArray(result) ? result.join(',') : result;
              `);
              const result = func(JSON.parse(JSON.stringify(input[0])));
              results.push({
                input: JSON.stringify(input[0]),
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
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
      },
      // Task 5: Storage module
      {
        description: 'Create a storage module with set(key, value), get(key), remove(key), and clear() methods',
        testCases: [
          { input: [[['set', 'a', 1], ['get', 'a']]], expectedOutput: '1' },
          { input: [[['set', 'x', 10], ['set', 'y', 20], ['get', 'y']]], expectedOutput: '20' },
          { input: [[['set', 'k', 5], ['remove', 'k'], ['get', 'k']]], expectedOutput: 'undefined' },
          { input: [[['set', 'a', 1], ['clear'], ['get', 'a']]], expectedOutput: 'undefined' },
          { input: [[['get', 'missing']]], expectedOutput: 'undefined' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[['set', 'a', 1], ['get', 'a']]], expectedOutput: '1' },
            { input: [[['set', 'x', 10], ['set', 'y', 20], ['get', 'y']]], expectedOutput: '20' },
            { input: [[['set', 'k', 5], ['remove', 'k'], ['get', 'k']]], expectedOutput: 'undefined' },
            { input: [[['set', 'a', 1], ['clear'], ['get', 'a']]], expectedOutput: 'undefined' },
            { input: [[['get', 'missing']]], expectedOutput: 'undefined' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('operations', `
                ${code}
                let result;
                for (const op of operations) {
                  const [method, ...args] = op;
                  result = storageModule[method](...args);
                }
                return String(result);
              `);
              const result = func(JSON.parse(JSON.stringify(input[0])));
              results.push({
                input: JSON.stringify(input[0]),
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
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
      },
      // Task 6: ID generator module
      {
        description: 'Create an ID generator module with getNextId() method that returns incrementing IDs starting from 1, and reset() to start over',
        testCases: [
          { input: [['getNextId', 'getNextId', 'getNextId']], expectedOutput: '1,2,3' },
          { input: [['getNextId']], expectedOutput: '1' },
          { input: [['getNextId', 'getNextId', 'reset', 'getNextId']], expectedOutput: '1,2,1' },
          { input: [['reset', 'getNextId']], expectedOutput: '1' },
          { input: [['getNextId', 'getNextId', 'getNextId', 'getNextId', 'getNextId']], expectedOutput: '1,2,3,4,5' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [['getNextId', 'getNextId', 'getNextId']], expectedOutput: '1,2,3' },
            { input: [['getNextId']], expectedOutput: '1' },
            { input: [['getNextId', 'getNextId', 'reset', 'getNextId']], expectedOutput: '1,2,1' },
            { input: [['reset', 'getNextId']], expectedOutput: '1' },
            { input: [['getNextId', 'getNextId', 'getNextId', 'getNextId', 'getNextId']], expectedOutput: '1,2,3,4,5' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('operations', `
                ${code}
                const results = [];
                for (const op of operations) {
                  const result = idGeneratorModule[op]();
                  if (op === 'getNextId') {
                    results.push(result);
                  }
                }
                return results.join(',');
              `);
              const result = func([...input[0]]);
              results.push({
                input: `operations: [${input[0].map(s => `"${s}"`).join(', ')}]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `operations: [${input[0].map(s => `"${s}"`).join(', ')}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 7: Validator module
      {
        description: 'Create a validator module with isEmail(str), isNumber(str), isEmpty(str) methods returning boolean',
        testCases: [
          { input: ['isEmail', 'test@example.com'], expectedOutput: 'true' },
          { input: ['isEmail', 'invalid'], expectedOutput: 'false' },
          { input: ['isNumber', '123'], expectedOutput: 'true' },
          { input: ['isNumber', 'abc'], expectedOutput: 'false' },
          { input: ['isEmpty', ''], expectedOutput: 'true' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['isEmail', 'test@example.com'], expectedOutput: 'true' },
            { input: ['isEmail', 'invalid'], expectedOutput: 'false' },
            { input: ['isNumber', '123'], expectedOutput: 'true' },
            { input: ['isNumber', 'abc'], expectedOutput: 'false' },
            { input: ['isEmpty', ''], expectedOutput: 'true' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('method', 'value', `
                ${code}
                return String(validatorModule[method](value));
              `);
              const result = func(input[0], input[1]);
              results.push({
                input: `validatorModule.${input[0]}("${input[1]}")`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `validatorModule.${input[0]}("${input[1]}")`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 8: Queue module
      {
        description: 'Create a queue module with enqueue(item), dequeue(), peek(), and size() methods',
        testCases: [
          { input: [[['enqueue', 'a'], ['enqueue', 'b'], ['dequeue']]], expectedOutput: 'a' },
          { input: [[['enqueue', 1], ['enqueue', 2], ['peek']]], expectedOutput: '1' },
          { input: [[['enqueue', 'x'], ['size']]], expectedOutput: '1' },
          { input: [[['dequeue']]], expectedOutput: 'undefined' },
          { input: [[['enqueue', 'a'], ['enqueue', 'b'], ['dequeue'], ['dequeue'], ['size']]], expectedOutput: '0' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[['enqueue', 'a'], ['enqueue', 'b'], ['dequeue']]], expectedOutput: 'a' },
            { input: [[['enqueue', 1], ['enqueue', 2], ['peek']]], expectedOutput: '1' },
            { input: [[['enqueue', 'x'], ['size']]], expectedOutput: '1' },
            { input: [[['dequeue']]], expectedOutput: 'undefined' },
            { input: [[['enqueue', 'a'], ['enqueue', 'b'], ['dequeue'], ['dequeue'], ['size']]], expectedOutput: '0' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('operations', `
                ${code}
                let result;
                for (const [method, arg] of operations) {
                  if (arg !== undefined) {
                    result = queueModule[method](arg);
                  } else {
                    result = queueModule[method]();
                  }
                }
                return String(result);
              `);
              const result = func(JSON.parse(JSON.stringify(input[0])));
              results.push({
                input: JSON.stringify(input[0]),
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
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

export default modulesTopicTests;



