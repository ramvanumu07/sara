/**
 * Test Functions for String Methods
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

// ============ String Manipulations Tests ============
export const stringManipulationsTopicTests = {
  topicId: 'string-methods',
  subtopicId: 'string-manipulations',
  title: 'Common string manipulations',
  tasks: [
    {
      id: 'trim',
      taskIndex: 0,
      description: 'Trim whitespace',
      testCases: [
        { input: ['  hello  '], expectedOutput: 'hello' },
        { input: ['   spaces   '], expectedOutput: 'spaces' },
        { input: ['no-spaces'], expectedOutput: 'no-spaces' },
        { input: ['  '], expectedOutput: '' },
        { input: [''], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'replace-spaces',
      taskIndex: 1,
      description: 'Replace spaces with dashes',
      testCases: [
        { input: ['hello world'], expectedOutput: 'hello-world' },
        { input: ['one two three'], expectedOutput: 'one-two-three' },
        { input: ['no spaces'], expectedOutput: 'no-spaces' },
        { input: ['nospace'], expectedOutput: 'nospace' },
        { input: [''], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'repeat',
      taskIndex: 2,
      description: 'Repeat string n times',
      testCases: [
        { input: ['ab', 3], expectedOutput: 'ababab' },
        { input: ['*', 5], expectedOutput: '*****' },
        { input: ['hello', 1], expectedOutput: 'hello' },
        { input: ['x', 0], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'pad-zeros',
      taskIndex: 3,
      description: 'Pad with leading zeros to 5 digits',
      testCases: [
        { input: [42], expectedOutput: '00042' },
        { input: [123], expectedOutput: '00123' },
        { input: [12345], expectedOutput: '12345' },
        { input: [0], expectedOutput: '00000' },
        { input: [999999], expectedOutput: '999999' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'title-case',
      taskIndex: 4,
      description: 'Capitalize first letter of each word',
      testCases: [
        { input: ['hello world'], expectedOutput: 'Hello World' },
        { input: ['javascript is fun'], expectedOutput: 'Javascript Is Fun' },
        { input: ['ALREADY CAPS'], expectedOutput: 'Already Caps' },
        { input: ['a'], expectedOutput: 'A' },
        { input: [''], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    }
  ]
};

// ============ Split/Join Tests ============
export const splitJoinTopicTests = {
  topicId: 'string-methods',
  subtopicId: 'split-join',
  title: 'split and join',
  tasks: [
    {
      id: 'split-words',
      taskIndex: 0,
      description: 'Split sentence into words',
      testCases: [
        { input: ['hello world'], expectedOutput: 'hello,world' },
        { input: ['one two three four'], expectedOutput: 'one,two,three,four' },
        { input: ['single'], expectedOutput: 'single' },
        { input: [''], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'join-words',
      taskIndex: 1,
      description: 'Join words into sentence',
      testCases: [
        { input: [['hello', 'world']], expectedOutput: 'hello world' },
        { input: [['JavaScript', 'is', 'awesome']], expectedOutput: 'JavaScript is awesome' },
        { input: [['single']], expectedOutput: 'single' },
        { input: [[]], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'reverse-string',
      taskIndex: 2,
      description: 'Reverse a string',
      testCases: [
        { input: ['hello'], expectedOutput: 'olleh' },
        { input: ['JavaScript'], expectedOutput: 'tpircSavaJ' },
        { input: ['a'], expectedOutput: 'a' },
        { input: ['ab'], expectedOutput: 'ba' },
        { input: [''], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'count-words',
      taskIndex: 3,
      description: 'Count words in sentence',
      testCases: [
        { input: ['hello world'], expectedOutput: '2' },
        { input: ['one two three four five'], expectedOutput: '5' },
        { input: ['single'], expectedOutput: '1' },
        { input: [''], expectedOutput: '0' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'csv-to-pipe',
      taskIndex: 4,
      description: 'Convert CSV to pipe-separated',
      testCases: [
        { input: ['a,b,c'], expectedOutput: 'a | b | c' },
        { input: ['one,two'], expectedOutput: 'one | two' },
        { input: ['single'], expectedOutput: 'single' },
        { input: [''], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    }
  ]
};

// ============ Substring/Slice Tests ============
export const substringSliceTopicTests = {
  topicId: 'string-methods',
  subtopicId: 'substring-slice',
  title: 'substring and slice',
  tasks: [
    {
      id: 'first-3',
      taskIndex: 0,
      description: 'Get first 3 characters',
      testCases: [
        { input: ['hello'], expectedOutput: 'hel' },
        { input: ['JavaScript'], expectedOutput: 'Jav' },
        { input: ['ab'], expectedOutput: 'ab' },
        { input: ['a'], expectedOutput: 'a' },
        { input: [''], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'last-3',
      taskIndex: 1,
      description: 'Get last 3 characters',
      testCases: [
        { input: ['hello'], expectedOutput: 'llo' },
        { input: ['JavaScript'], expectedOutput: 'ipt' },
        { input: ['ab'], expectedOutput: 'ab' },
        { input: ['a'], expectedOutput: 'a' },
        { input: [''], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'remove-first-last',
      taskIndex: 2,
      description: 'Remove first and last characters',
      testCases: [
        { input: ['hello'], expectedOutput: 'ell' },
        { input: ['JavaScript'], expectedOutput: 'avaScrip' },
        { input: ['ab'], expectedOutput: '' },
        { input: ['abc'], expectedOutput: 'b' },
        { input: ['a'], expectedOutput: '' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'substring-range',
      taskIndex: 3,
      description: 'Get substring between indices',
      testCases: [
        { input: ['hello world', 0, 5], expectedOutput: 'hello' },
        { input: ['hello world', 6, 11], expectedOutput: 'world' },
        { input: ['JavaScript', 4, 10], expectedOutput: 'Script' },
        { input: ['test', 1, 3], expectedOutput: 'es' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'middle-chars',
      taskIndex: 4,
      description: 'Get middle character(s)',
      testCases: [
        { input: ['hello'], expectedOutput: 'l' },
        { input: ['test'], expectedOutput: 'es' },
        { input: ['a'], expectedOutput: 'a' },
        { input: ['ab'], expectedOutput: 'ab' },
        { input: ['abc'], expectedOutput: 'b' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    }
  ]
};

// ============ String Searching Tests ============
export const stringSearchingTopicTests = {
  topicId: 'string-methods',
  subtopicId: 'string-searching',
  title: 'String searching and matching',
  tasks: [
    {
      id: 'includes',
      taskIndex: 0,
      description: 'Check if string contains term',
      testCases: [
        { input: ['hello world', 'world'], expectedOutput: 'true' },
        { input: ['hello world', 'planet'], expectedOutput: 'false' },
        { input: ['JavaScript', 'Script'], expectedOutput: 'true' },
        { input: ['', 'test'], expectedOutput: 'false' },
        { input: ['test', ''], expectedOutput: 'true' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'indexof',
      taskIndex: 1,
      description: 'Find index of first occurrence',
      testCases: [
        { input: ['hello world', 'o'], expectedOutput: '4' },
        { input: ['hello world', 'world'], expectedOutput: '6' },
        { input: ['hello world', 'x'], expectedOutput: '-1' },
        { input: ['banana', 'a'], expectedOutput: '1' },
        { input: ['', 'test'], expectedOutput: '-1' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'ends-with-js',
      taskIndex: 2,
      description: 'Check if filename ends with .js',
      testCases: [
        { input: ['app.js'], expectedOutput: 'true' },
        { input: ['index.html'], expectedOutput: 'false' },
        { input: ['script.min.js'], expectedOutput: 'true' },
        { input: ['js'], expectedOutput: 'false' },
        { input: [''], expectedOutput: 'false' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'starts-with-https',
      taskIndex: 3,
      description: 'Check if URL starts with https://',
      testCases: [
        { input: ['https://example.com'], expectedOutput: 'true' },
        { input: ['http://example.com'], expectedOutput: 'false' },
        { input: ['https://'], expectedOutput: 'true' },
        { input: ['ftp://files.com'], expectedOutput: 'false' },
        { input: [''], expectedOutput: 'false' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'count-char',
      taskIndex: 4,
      description: 'Count character occurrences',
      testCases: [
        { input: ['hello', 'l'], expectedOutput: '2' },
        { input: ['mississippi', 's'], expectedOutput: '4' },
        { input: ['test', 'x'], expectedOutput: '0' },
        { input: ['aaa', 'a'], expectedOutput: '3' },
        { input: ['', 'a'], expectedOutput: '0' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    },
    {
      id: 'lastindexof',
      taskIndex: 5,
      description: 'Find index of last occurrence',
      testCases: [
        { input: ['hello world', 'o'], expectedOutput: '7' },
        { input: ['banana', 'a'], expectedOutput: '5' },
        { input: ['hello', 'l'], expectedOutput: '3' },
        { input: ['test', 'x'], expectedOutput: '-1' },
        { input: ['', 'a'], expectedOutput: '-1' }
      ],
      testFunction: function (userCode) { return testFunctionWithInputs(userCode, this.testCases); }
    }
  ]
};

export default {
  stringManipulationsTopicTests,
  splitJoinTopicTests,
  substringSliceTopicTests,
  stringSearchingTopicTests
};




