/**
 * Test Functions for Array Methods (Functional Approach)
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

// ============ forEach Tests ============
export const forEachTopicTests = {
  topicId: 'array-methods',
  subtopicId: 'foreach',
  title: 'forEach for iteration',
  tasks: [
    {
      id: 'foreach-print',
      taskIndex: 0,
      description: 'Print each element on a new line using forEach',
      testCases: [
        { input: [[1, 2, 3]], expectedOutput: '1\n2\n3' },
        { input: [['a', 'b', 'c']], expectedOutput: 'a\nb\nc' },
        { input: [[10]], expectedOutput: '10' },
        { input: [[]], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'foreach-index',
      taskIndex: 1,
      description: 'Print each element with its index',
      testCases: [
        { input: [['a', 'b', 'c']], expectedOutput: '0: a\n1: b\n2: c' },
        { input: [[10, 20]], expectedOutput: '0: 10\n1: 20' },
        { input: [['only']], expectedOutput: '0: only' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'foreach-sum',
      taskIndex: 2,
      description: 'Sum array using forEach',
      testCases: [
        { input: [[1, 2, 3, 4, 5]], expectedOutput: '15' },
        { input: [[10, -5, 3]], expectedOutput: '8' },
        { input: [[100]], expectedOutput: '100' },
        { input: [[]], expectedOutput: '0' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'foreach-count',
      taskIndex: 3,
      description: 'Count numbers greater than 10',
      testCases: [
        { input: [[5, 15, 8, 20, 3, 12]], expectedOutput: '3' },
        { input: [[1, 2, 3]], expectedOutput: '0' },
        { input: [[100, 200, 300]], expectedOutput: '3' },
        { input: [[]], expectedOutput: '0' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    }
  ]
};

// ============ map Tests ============
export const mapTopicTests = {
  topicId: 'array-methods',
  subtopicId: 'map',
  title: 'map for transformation',
  tasks: [
    {
      id: 'map-double',
      taskIndex: 0,
      description: 'Double each number',
      testCases: [
        { input: [[1, 2, 3, 4]], expectedOutput: '2,4,6,8' },
        { input: [[5, 10, 15]], expectedOutput: '10,20,30' },
        { input: [[-2, 0, 2]], expectedOutput: '-4,0,4' },
        { input: [[]], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'map-square',
      taskIndex: 1,
      description: 'Square each number',
      testCases: [
        { input: [[1, 2, 3, 4]], expectedOutput: '1,4,9,16' },
        { input: [[5, 10]], expectedOutput: '25,100' },
        { input: [[-3, 0, 3]], expectedOutput: '9,0,9' },
        { input: [[]], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'map-uppercase',
      taskIndex: 2,
      description: 'Convert strings to uppercase',
      testCases: [
        { input: [['hello', 'world']], expectedOutput: 'HELLO,WORLD' },
        { input: [['JavaScript', 'is', 'fun']], expectedOutput: 'JAVASCRIPT,IS,FUN' },
        { input: [['ABC']], expectedOutput: 'ABC' },
        { input: [[]], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'map-lengths',
      taskIndex: 3,
      description: 'Get length of each string',
      testCases: [
        { input: [['hello', 'world', 'hi']], expectedOutput: '5,5,2' },
        { input: [['a', 'ab', 'abc']], expectedOutput: '1,2,3' },
        { input: [['', 'test']], expectedOutput: '0,4' },
        { input: [[]], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'map-even-odd',
      taskIndex: 4,
      description: 'Convert numbers to even/odd strings',
      testCases: [
        { input: [[1, 2, 3, 4]], expectedOutput: 'odd,even,odd,even' },
        { input: [[10, 15, 20]], expectedOutput: 'even,odd,even' },
        { input: [[0]], expectedOutput: 'even' },
        { input: [[]], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    }
  ]
};

// ============ filter Tests ============
export const filterTopicTests = {
  topicId: 'array-methods',
  subtopicId: 'filter',
  title: 'filter for selection',
  tasks: [
    {
      id: 'filter-even',
      taskIndex: 0,
      description: 'Filter even numbers',
      testCases: [
        { input: [[1, 2, 3, 4, 5, 6]], expectedOutput: '2,4,6' },
        { input: [[10, 15, 20, 25]], expectedOutput: '10,20' },
        { input: [[1, 3, 5]], expectedOutput: '' },
        { input: [[]], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'filter-threshold',
      taskIndex: 1,
      description: 'Filter numbers greater than threshold',
      testCases: [
        { input: [[1, 5, 10, 15, 20], 10], expectedOutput: '15,20' },
        { input: [[3, 7, 2, 9], 5], expectedOutput: '7,9' },
        { input: [[1, 2, 3], 10], expectedOutput: '' },
        { input: [[], 5], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'filter-long-strings',
      taskIndex: 2,
      description: 'Filter strings longer than 3 chars',
      testCases: [
        { input: [['hi', 'hello', 'hey', 'world']], expectedOutput: 'hello,world' },
        { input: [['a', 'ab', 'abc', 'abcd']], expectedOutput: 'abcd' },
        { input: [['no', 'ok']], expectedOutput: '' },
        { input: [[]], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'filter-positive',
      taskIndex: 3,
      description: 'Filter positive numbers',
      testCases: [
        { input: [[-3, -1, 0, 1, 3]], expectedOutput: '1,3' },
        { input: [[5, -2, 8, -4]], expectedOutput: '5,8' },
        { input: [[-1, -2, -3]], expectedOutput: '' },
        { input: [[0]], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'filter-divisible-2-3',
      taskIndex: 4,
      description: 'Filter numbers divisible by both 2 and 3',
      testCases: [
        { input: [[1, 6, 8, 12, 15, 18]], expectedOutput: '6,12,18' },
        { input: [[2, 3, 4, 5]], expectedOutput: '' },
        { input: [[6, 12, 18, 24]], expectedOutput: '6,12,18,24' },
        { input: [[]], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    }
  ]
};

// ============ find/findIndex Tests ============
export const findTopicTests = {
  topicId: 'array-methods',
  subtopicId: 'find-findindex',
  title: 'find and findIndex',
  tasks: [
    {
      id: 'find-even',
      taskIndex: 0,
      description: 'Find first even number',
      testCases: [
        { input: [[1, 3, 4, 6, 8]], expectedOutput: '4' },
        { input: [[2, 4, 6]], expectedOutput: '2' },
        { input: [[1, 3, 5, 7]], expectedOutput: 'undefined' },
        { input: [[]], expectedOutput: 'undefined' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'findindex-negative',
      taskIndex: 1,
      description: 'Find index of first negative',
      testCases: [
        { input: [[5, 3, -2, 8, -4]], expectedOutput: '2' },
        { input: [[-1, 2, 3]], expectedOutput: '0' },
        { input: [[1, 2, 3]], expectedOutput: '-1' },
        { input: [[]], expectedOutput: '-1' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'find-greater-than',
      taskIndex: 2,
      description: 'Find first number greater than target',
      testCases: [
        { input: [[1, 5, 10, 15], 8], expectedOutput: '10' },
        { input: [[2, 4, 6], 10], expectedOutput: 'undefined' },
        { input: [[100, 200], 50], expectedOutput: '100' },
        { input: [[], 5], expectedOutput: 'undefined' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'findindex-starts-with-a',
      taskIndex: 3,
      description: 'Find index of first string starting with "a"',
      testCases: [
        { input: [['banana', 'Apple', 'cherry']], expectedOutput: '1' },
        { input: [['apple', 'apricot']], expectedOutput: '0' },
        { input: [['banana', 'cherry']], expectedOutput: '-1' },
        { input: [[]], expectedOutput: '-1' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    }
  ]
};

// ============ some/every Tests ============
export const someEveryTopicTests = {
  topicId: 'array-methods',
  subtopicId: 'some-every',
  title: 'some and every',
  tasks: [
    {
      id: 'some-negative',
      taskIndex: 0,
      description: 'Check if any number is negative',
      testCases: [
        { input: [[1, 2, -3, 4]], expectedOutput: 'true' },
        { input: [[1, 2, 3, 4]], expectedOutput: 'false' },
        { input: [[-1]], expectedOutput: 'true' },
        { input: [[]], expectedOutput: 'false' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'every-positive',
      taskIndex: 1,
      description: 'Check if all numbers are positive',
      testCases: [
        { input: [[1, 2, 3, 4]], expectedOutput: 'true' },
        { input: [[1, 2, -3, 4]], expectedOutput: 'false' },
        { input: [[0, 1, 2]], expectedOutput: 'false' },
        { input: [[]], expectedOutput: 'true' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'some-divisible-5',
      taskIndex: 2,
      description: 'Check if any number is divisible by 5',
      testCases: [
        { input: [[3, 7, 10, 12]], expectedOutput: 'true' },
        { input: [[1, 2, 3, 4]], expectedOutput: 'false' },
        { input: [[5]], expectedOutput: 'true' },
        { input: [[]], expectedOutput: 'false' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'every-length-gt-2',
      taskIndex: 3,
      description: 'Check if all strings have length > 2',
      testCases: [
        { input: [['hello', 'world', 'hey']], expectedOutput: 'true' },
        { input: [['hi', 'hello']], expectedOutput: 'false' },
        { input: [['abc']], expectedOutput: 'true' },
        { input: [[]], expectedOutput: 'true' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'every-even',
      taskIndex: 4,
      description: 'Check if all numbers are even',
      testCases: [
        { input: [[2, 4, 6, 8]], expectedOutput: 'true' },
        { input: [[2, 4, 5, 8]], expectedOutput: 'false' },
        { input: [[0]], expectedOutput: 'true' },
        { input: [[]], expectedOutput: 'true' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    }
  ]
};

// ============ reduce Tests ============
export const reduceTopicTests = {
  topicId: 'array-methods',
  subtopicId: 'reduce',
  title: 'reduce for accumulation',
  tasks: [
    {
      id: 'reduce-sum',
      taskIndex: 0,
      description: 'Sum using reduce',
      testCases: [
        { input: [[1, 2, 3, 4, 5]], expectedOutput: '15' },
        { input: [[10, 20, 30]], expectedOutput: '60' },
        { input: [[-5, 5]], expectedOutput: '0' },
        { input: [[]], expectedOutput: '0' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'reduce-product',
      taskIndex: 1,
      description: 'Product using reduce',
      testCases: [
        { input: [[1, 2, 3, 4]], expectedOutput: '24' },
        { input: [[5, 5, 5]], expectedOutput: '125' },
        { input: [[10]], expectedOutput: '10' },
        { input: [[]], expectedOutput: '1' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'reduce-max',
      taskIndex: 2,
      description: 'Maximum using reduce',
      testCases: [
        { input: [[3, 7, 2, 9, 5]], expectedOutput: '9' },
        { input: [[-1, -5, -2]], expectedOutput: '-1' },
        { input: [[42]], expectedOutput: '42' },
        { input: [[5, 5, 5]], expectedOutput: '5' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'reduce-count-even',
      taskIndex: 3,
      description: 'Count even numbers using reduce',
      testCases: [
        { input: [[1, 2, 3, 4, 5, 6]], expectedOutput: '3' },
        { input: [[1, 3, 5]], expectedOutput: '0' },
        { input: [[2, 4, 6]], expectedOutput: '3' },
        { input: [[]], expectedOutput: '0' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'reduce-join',
      taskIndex: 4,
      description: 'Join strings with separator using reduce',
      testCases: [
        { input: [['a', 'b', 'c']], expectedOutput: 'a - b - c' },
        { input: [['hello', 'world']], expectedOutput: 'hello - world' },
        { input: [['single']], expectedOutput: 'single' },
        { input: [[]], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'reduce-object',
      taskIndex: 5,
      description: 'Create object with sum and count using reduce',
      testCases: [
        { input: [[1, 2, 3, 4]], expectedOutput: '{"sum":10,"count":4}' },
        { input: [[10, 20]], expectedOutput: '{"sum":30,"count":2}' },
        { input: [[5]], expectedOutput: '{"sum":5,"count":1}' },
        { input: [[]], expectedOutput: '{"sum":0,"count":0}' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    }
  ]
};

export default {
  forEachTopicTests,
  mapTopicTests,
  filterTopicTests,
  findTopicTests,
  someEveryTopicTests,
  reduceTopicTests
};




