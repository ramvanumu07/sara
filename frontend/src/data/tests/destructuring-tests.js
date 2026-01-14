/**
 * Test Functions for Destructuring
 */

function testFunctionWithInputs(userCode, testCases) {
  const results = [];

  for (const testCase of testCases) {
    try {
      const fn = new Function(`
        ${userCode}
        return { ${userCode.match(/function\s+(\w+)/g)?.map(m => m.split(' ')[1]).join(', ') || ''} };
      `);

      const funcs = fn();
      const funcName = Object.keys(funcs)[0];
      const userFunction = funcs[funcName];

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

export const destructuringTopicTests = {
  topicId: 'destructuring',
  subtopicId: 'destructuring',
  title: 'Destructuring',
  tasks: [
    {
      id: 'array-first-two',
      taskIndex: 0,
      description: 'Extract first two elements from array',
      testCases: [
        { input: [[1, 2, 3, 4]], expectedOutput: '1, 2' },
        { input: [['a', 'b', 'c']], expectedOutput: 'a, b' },
        { input: [[10, 20]], expectedOutput: '10, 20' },
        { input: [['only', 'two']], expectedOutput: 'only, two' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'array-skip-second',
      taskIndex: 1,
      description: 'Extract first and third (skip second)',
      testCases: [
        { input: [[1, 2, 3, 4]], expectedOutput: '1, 3' },
        { input: [['a', 'b', 'c', 'd']], expectedOutput: 'a, c' },
        { input: [[10, 20, 30]], expectedOutput: '10, 30' },
        { input: [['x', 'skip', 'z']], expectedOutput: 'x, z' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'array-rest',
      taskIndex: 2,
      description: 'Extract first and count remaining',
      testCases: [
        { input: [[1, 2, 3, 4, 5]], expectedOutput: 'first: 1, remaining: 4' },
        { input: [['a', 'b', 'c']], expectedOutput: 'first: a, remaining: 2' },
        { input: [[10]], expectedOutput: 'first: 10, remaining: 0' },
        { input: [[1, 2]], expectedOutput: 'first: 1, remaining: 1' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'object-basic',
      taskIndex: 3,
      description: 'Destructure person object',
      testCases: [
        { input: [{ name: 'Alice', age: 25 }], expectedOutput: 'Name: Alice, Age: 25' },
        { input: [{ name: 'Bob', age: 30 }], expectedOutput: 'Name: Bob, Age: 30' },
        { input: [{ name: 'Charlie', age: 0 }], expectedOutput: 'Name: Charlie, Age: 0' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'object-rename',
      taskIndex: 4,
      description: 'Rename while destructuring',
      testCases: [
        { input: [{ name: 'Alice' }], expectedOutput: 'User: Alice' },
        { input: [{ name: 'Bob' }], expectedOutput: 'User: Bob' },
        { input: [{ name: 'Admin' }], expectedOutput: 'User: Admin' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'object-defaults',
      taskIndex: 5,
      description: 'Destructure with default values',
      testCases: [
        { input: [{ name: 'Alice', country: 'USA' }], expectedOutput: 'Name: Alice, Country: USA' },
        { input: [{ name: 'Bob' }], expectedOutput: 'Name: Bob, Country: Unknown' },
        { input: [{ name: 'Charlie', country: 'UK' }], expectedOutput: 'Name: Charlie, Country: UK' },
        { input: [{ name: 'David', country: undefined }], expectedOutput: 'Name: David, Country: Unknown' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'nested-destructuring',
      taskIndex: 6,
      description: 'Nested object destructuring',
      testCases: [
        { input: [{ user: { name: 'Alice', address: { city: 'NYC' } } }], expectedOutput: 'Name: Alice, City: NYC' },
        { input: [{ user: { name: 'Bob', address: { city: 'LA' } } }], expectedOutput: 'Name: Bob, City: LA' },
        { input: [{ user: { name: 'Charlie', address: { city: 'Chicago' } } }], expectedOutput: 'Name: Charlie, City: Chicago' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'param-destructuring',
      taskIndex: 7,
      description: 'Destructure in function parameters',
      testCases: [
        { input: [{ x: 5, y: 3 }], expectedOutput: '8' },
        { input: [{ x: 10, y: 20 }], expectedOutput: '30' },
        { input: [{ x: -5, y: 5 }], expectedOutput: '0' },
        { input: [{ x: 0, y: 0 }], expectedOutput: '0' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'swap-values',
      taskIndex: 8,
      description: 'Swap values using destructuring',
      testCases: [
        { input: [[1, 2]], expectedOutput: '2, 1' },
        { input: [['a', 'b']], expectedOutput: 'b, a' },
        { input: [[10, 20]], expectedOutput: '20, 10' },
        { input: [['first', 'second']], expectedOutput: 'second, first' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'array-of-objects',
      taskIndex: 9,
      description: 'Sum coordinates from array of objects',
      testCases: [
        { input: [[{ x: 1, y: 2 }, { x: 3, y: 4 }]], expectedOutput: 'sumX: 4, sumY: 6' },
        { input: [[{ x: 10, y: 20 }, { x: 30, y: 40 }]], expectedOutput: 'sumX: 40, sumY: 60' },
        { input: [[{ x: 0, y: 0 }, { x: 5, y: 5 }]], expectedOutput: 'sumX: 5, sumY: 5' },
        { input: [[{ x: -1, y: 1 }, { x: 1, y: -1 }]], expectedOutput: 'sumX: 0, sumY: 0' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'mixed-array',
      taskIndex: 10,
      description: 'Extract name and calculate average of scores',
      testCases: [
        { input: [['Alice', 80, 90, 100]], expectedOutput: 'Name: Alice, Average: 90' },
        { input: [['Bob', 70, 80]], expectedOutput: 'Name: Bob, Average: 75' },
        { input: [['Charlie', 100]], expectedOutput: 'Name: Charlie, Average: 100' },
        { input: [['David', 60, 70, 80, 90]], expectedOutput: 'Name: David, Average: 75' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    }
  ]
};

export function runTaskTest(taskIndex, userCode) {
  const task = destructuringTopicTests.tasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export default destructuringTopicTests;




