/**
 * Test Functions for Objects
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

export const objectsTopicTests = {
  topicId: 'objects',
  subtopicId: 'objects',
  title: 'Objects',
  tasks: [
    {
      id: 'person-greeting',
      taskIndex: 0,
      description: 'Create greeting from person object',
      testCases: [
        { input: [{ name: 'Alice', age: 25 }], expectedOutput: 'Hello, I am Alice and I am 25 years old' },
        { input: [{ name: 'Bob', age: 30 }], expectedOutput: 'Hello, I am Bob and I am 30 years old' },
        { input: [{ name: 'Charlie', age: 0 }], expectedOutput: 'Hello, I am Charlie and I am 0 years old' }
      ],
      testFunction: function(userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'bracket-access',
      taskIndex: 1,
      description: 'Access property using bracket notation',
      testCases: [
        { input: [{ name: 'Alice', age: 25 }, 'name'], expectedOutput: 'Alice' },
        { input: [{ x: 10, y: 20 }, 'y'], expectedOutput: '20' },
        { input: [{ a: 1 }, 'b'], expectedOutput: 'undefined' },
        { input: [{}, 'any'], expectedOutput: 'undefined' }
      ],
      testFunction: function(userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'count-properties',
      taskIndex: 2,
      description: 'Count number of properties',
      testCases: [
        { input: [{ a: 1, b: 2, c: 3 }], expectedOutput: '3' },
        { input: [{ name: 'test' }], expectedOutput: '1' },
        { input: [{}], expectedOutput: '0' },
        { input: [{ x: 1, y: 2, z: 3, w: 4 }], expectedOutput: '4' }
      ],
      testFunction: function(userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'get-keys',
      taskIndex: 3,
      description: 'Get array of keys',
      testCases: [
        { input: [{ a: 1, b: 2, c: 3 }], expectedOutput: 'a,b,c' },
        { input: [{ name: 'Alice', age: 25 }], expectedOutput: 'name,age' },
        { input: [{ single: 1 }], expectedOutput: 'single' },
        { input: [{}], expectedOutput: '' }
      ],
      testFunction: function(userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'get-values',
      taskIndex: 4,
      description: 'Get array of values',
      testCases: [
        { input: [{ a: 1, b: 2, c: 3 }], expectedOutput: '1,2,3' },
        { input: [{ name: 'Alice', age: 25 }], expectedOutput: 'Alice,25' },
        { input: [{ single: 100 }], expectedOutput: '100' },
        { input: [{}], expectedOutput: '' }
      ],
      testFunction: function(userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'has-key',
      taskIndex: 5,
      description: 'Check if key exists',
      testCases: [
        { input: [{ name: 'Alice', age: 25 }, 'name'], expectedOutput: 'true' },
        { input: [{ name: 'Alice', age: 25 }, 'email'], expectedOutput: 'false' },
        { input: [{}, 'any'], expectedOutput: 'false' },
        { input: [{ a: undefined }, 'a'], expectedOutput: 'true' }
      ],
      testFunction: function(userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'sum-values',
      taskIndex: 6,
      description: 'Sum all numeric values',
      testCases: [
        { input: [{ a: 10, b: 20, c: 30 }], expectedOutput: '60' },
        { input: [{ x: 5 }], expectedOutput: '5' },
        { input: [{ p: -10, q: 10 }], expectedOutput: '0' },
        { input: [{}], expectedOutput: '0' }
      ],
      testFunction: function(userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'nested-path',
      taskIndex: 7,
      description: 'Access nested property by path',
      testCases: [
        { input: [{ person: { name: 'Alice' } }, 'person.name'], expectedOutput: 'Alice' },
        { input: [{ a: { b: { c: 42 } } }, 'a.b.c'], expectedOutput: '42' },
        { input: [{ x: 10 }, 'x'], expectedOutput: '10' },
        { input: [{ a: { b: 1 } }, 'a.c'], expectedOutput: 'undefined' }
      ],
      testFunction: function(userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'double-values',
      taskIndex: 8,
      description: 'Double all values in object',
      testCases: [
        { input: [{ a: 1, b: 2, c: 3 }], expectedOutput: '{"a":2,"b":4,"c":6}' },
        { input: [{ x: 10, y: 5 }], expectedOutput: '{"x":20,"y":10}' },
        { input: [{ single: 50 }], expectedOutput: '{"single":100}' },
        { input: [{}], expectedOutput: '{}' }
      ],
      testFunction: function(userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'filter-by-value',
      taskIndex: 9,
      description: 'Filter properties by minimum value',
      testCases: [
        { input: [{ a: 10, b: 5, c: 15, d: 3 }, 10], expectedOutput: '{"a":10,"c":15}' },
        { input: [{ x: 100, y: 50 }, 60], expectedOutput: '{"x":100}' },
        { input: [{ a: 1, b: 2 }, 10], expectedOutput: '{}' },
        { input: [{}, 5], expectedOutput: '{}' }
      ],
      testFunction: function(userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'merge-objects',
      taskIndex: 10,
      description: 'Merge two objects',
      testCases: [
        { input: [{ a: 1, b: 2 }, { b: 3, c: 4 }], expectedOutput: '{"a":1,"b":3,"c":4}' },
        { input: [{ x: 10 }, { y: 20 }], expectedOutput: '{"x":10,"y":20}' },
        { input: [{}, { a: 1 }], expectedOutput: '{"a":1}' },
        { input: [{ a: 1 }, {}], expectedOutput: '{"a":1}' }
      ],
      testFunction: function(userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'highest-score',
      taskIndex: 11,
      description: 'Find person with highest score',
      testCases: [
        { input: [[{ name: 'Alice', score: 85 }, { name: 'Bob', score: 92 }, { name: 'Charlie', score: 78 }]], expectedOutput: 'Bob' },
        { input: [[{ name: 'Single', score: 100 }]], expectedOutput: 'Single' },
        { input: [[{ name: 'A', score: 50 }, { name: 'B', score: 50 }]], expectedOutput: 'A' },
        { input: [[{ name: 'Low', score: 10 }, { name: 'High', score: 99 }]], expectedOutput: 'High' }
      ],
      testFunction: function(userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    }
  ]
};

export function runTaskTest(taskIndex, userCode) {
  const task = objectsTopicTests.tasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export default objectsTopicTests;



