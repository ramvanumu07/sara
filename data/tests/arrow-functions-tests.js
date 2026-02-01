/**
 * Test Functions for Arrow Functions
 */

function testFunctionWithInputs(userCode, testCases) {
  const results = [];

  for (const testCase of testCases) {
    try {
      // For arrow functions, we need to handle both named and anonymous assignments
      const fn = new Function(`
        ${userCode}
        // Try to find arrow function - could be const name = () => or function name()
        const arrowMatch = \`${userCode.replace(/`/g, '\\`')}\`.match(/(?:const|let|var)\\s+(\\w+)\\s*=/);
        const funcMatch = \`${userCode.replace(/`/g, '\\`')}\`.match(/function\\s+(\\w+)/);
        const name = arrowMatch ? arrowMatch[1] : (funcMatch ? funcMatch[1] : null);
        if (name && typeof eval(name) === 'function') {
          return eval(name);
        }
        return null;
      `);

      const userFunction = fn();

      if (!userFunction) {
        results.push({ input: testCase.input, expected: testCase.expectedOutput, actual: 'Function not defined', passed: false });
        continue;
      }

      const result = String(userFunction(...testCase.input));
      const passed = result === testCase.expectedOutput;
      results.push({ input: testCase.input, expected: testCase.expectedOutput, actual: result, passed });
    } catch (error) {
      results.push({ input: testCase.input, expected: testCase.expectedOutput, actual: `Error: ${error.message}`, passed: false });
    }
  }

  return { passed: results.every(r => r.passed), results };
}

export const arrowFunctionsTopicTests = {
  topicId: 'arrow-functions',
  subtopicId: 'arrow-functions',
  title: 'Arrow Functions',
  tasks: [
    {
      id: 'double-number',
      taskIndex: 0,
      description: 'Arrow function to double a number',
      testCases: [
        { input: [5], expectedOutput: '10' },
        { input: [0], expectedOutput: '0' },
        { input: [-3], expectedOutput: '-6' },
        { input: [100], expectedOutput: '200' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'sum-two',
      taskIndex: 1,
      description: 'Arrow function to sum two numbers',
      testCases: [
        { input: [3, 5], expectedOutput: '8' },
        { input: [10, 20], expectedOutput: '30' },
        { input: [-5, 5], expectedOutput: '0' },
        { input: [0, 0], expectedOutput: '0' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'no-params',
      taskIndex: 2,
      description: 'Arrow function with no parameters',
      testCases: [
        { input: [], expectedOutput: 'Hello, World!' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'return-object',
      taskIndex: 3,
      description: 'Arrow function returning an object',
      testCases: [
        { input: [5], expectedOutput: '{"original":5,"squared":25}' },
        { input: [3], expectedOutput: '{"original":3,"squared":9}' },
        { input: [0], expectedOutput: '{"original":0,"squared":0}' },
        { input: [-4], expectedOutput: '{"original":-4,"squared":16}' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'uppercase',
      taskIndex: 4,
      description: 'Arrow function for uppercase',
      testCases: [
        { input: ['hello'], expectedOutput: 'HELLO' },
        { input: ['JavaScript'], expectedOutput: 'JAVASCRIPT' },
        { input: ['a'], expectedOutput: 'A' },
        { input: [''], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'triple-with-map',
      taskIndex: 5,
      description: 'Triple array elements with map',
      testCases: [
        { input: [[1, 2, 3]], expectedOutput: '3,6,9' },
        { input: [[5, 10]], expectedOutput: '15,30' },
        { input: [[0, -1, 1]], expectedOutput: '0,-3,3' },
        { input: [[]], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'filter-greater-5',
      taskIndex: 6,
      description: 'Filter numbers greater than 5',
      testCases: [
        { input: [[1, 6, 3, 8, 2, 10]], expectedOutput: '6,8,10' },
        { input: [[1, 2, 3]], expectedOutput: '' },
        { input: [[10, 20, 30]], expectedOutput: '10,20,30' },
        { input: [[]], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'product-reduce',
      taskIndex: 7,
      description: 'Product with reduce',
      testCases: [
        { input: [[1, 2, 3, 4]], expectedOutput: '24' },
        { input: [[5, 5]], expectedOutput: '25' },
        { input: [[10]], expectedOutput: '10' },
        { input: [[]], expectedOutput: '1' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'filter-sum-chain',
      taskIndex: 8,
      description: 'Filter negatives and sum (chaining)',
      testCases: [
        { input: [[-1, 2, -3, 4, 5]], expectedOutput: '11' },
        { input: [[1, 2, 3]], expectedOutput: '6' },
        { input: [[-1, -2, -3]], expectedOutput: '0' },
        { input: [[]], expectedOutput: '0' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'total-string-length',
      taskIndex: 9,
      description: 'Total length of all strings',
      testCases: [
        { input: [['hello', 'world']], expectedOutput: '10' },
        { input: [['a', 'ab', 'abc']], expectedOutput: '6' },
        { input: [['test']], expectedOutput: '4' },
        { input: [[]], expectedOutput: '0' },
        { input: [['', 'hi', '']], expectedOutput: '2' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'unique-values',
      taskIndex: 10,
      description: 'Get unique values from array',
      testCases: [
        { input: [[1, 2, 2, 3, 3, 3]], expectedOutput: '1,2,3' },
        { input: [[5, 5, 5]], expectedOutput: '5' },
        { input: [[1, 2, 3]], expectedOutput: '1,2,3' },
        { input: [[]], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    }
  ]
};

export function runTaskTest(taskIndex, userCode) {
  const task = arrowFunctionsTopicTests.tasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export default arrowFunctionsTopicTests;




