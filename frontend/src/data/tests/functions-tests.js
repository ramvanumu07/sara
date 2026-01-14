/**
 * Test Functions for Functions (The Turning Point)
 * 
 * This is where we introduce multiple test cases with different inputs!
 * User code should define a function, which we then call with various inputs.
 */

// Execute user code and extract the defined function, then test with multiple inputs
function testFunctionWithInputs(userCode, testCases) {
  const results = [];

  for (const testCase of testCases) {
    try {
      // Execute user code in a controlled scope
      const fn = new Function(`
        ${userCode}
        // Return all function definitions
        return { ${userCode.match(/function\s+(\w+)/g)?.map(m => m.split(' ')[1]).join(', ') || ''} };
      `);

      const funcs = fn();
      const funcName = Object.keys(funcs)[0];
      const userFunction = funcs[funcName];

      if (!userFunction) {
        results.push({
          input: testCase.input,
          expected: testCase.expectedOutput,
          actual: 'Function not defined',
          passed: false
        });
        continue;
      }

      const result = String(userFunction(...testCase.input));
      const passed = result === testCase.expectedOutput;

      results.push({
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: result,
        passed
      });
    } catch (error) {
      results.push({
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: `Error: ${error.message}`,
        passed: false
      });
    }
  }

  const allPassed = results.every(r => r.passed);
  return { passed: allPassed, results };
}

export const task1 = {
  id: 'sum-two-numbers',
  taskIndex: 0,
  description: 'Create a function that takes two numbers and returns their sum',
  testCases: [
    { input: [5, 3], expectedOutput: '8' },
    { input: [10, 20], expectedOutput: '30' },
    { input: [-5, 15], expectedOutput: '10' },
    { input: [0, 0], expectedOutput: '0' },
    { input: [-5, -3], expectedOutput: '-8' },
    { input: [5, 0], expectedOutput: '5' }
  ],
  testFunction: function (userCode) {
    return testFunctionWithInputs(userCode, this.testCases);
  }
};

export const task2 = {
  id: 'is-even',
  taskIndex: 1,
  description: 'Create a function that takes a number and returns true if it is even, false otherwise',
  testCases: [
    { input: [4], expectedOutput: 'true' },
    { input: [7], expectedOutput: 'false' },
    { input: [0], expectedOutput: 'true' },
    { input: [-6], expectedOutput: 'true' },
    { input: [-7], expectedOutput: 'false' },
    { input: [1], expectedOutput: 'false' }
  ],
  testFunction: function (userCode) {
    return testFunctionWithInputs(userCode, this.testCases);
  }
};

export const task3 = {
  id: 'absolute-value',
  taskIndex: 2,
  description: 'Create a function that takes a number and returns its absolute value',
  testCases: [
    { input: [5], expectedOutput: '5' },
    { input: [-8], expectedOutput: '8' },
    { input: [0], expectedOutput: '0' },
    { input: [-100], expectedOutput: '100' },
    { input: [-1], expectedOutput: '1' }
  ],
  testFunction: function (userCode) {
    return testFunctionWithInputs(userCode, this.testCases);
  }
};

export const task4 = {
  id: 'max-of-three',
  taskIndex: 3,
  description: 'Create a function that takes three numbers and returns the largest one',
  testCases: [
    { input: [5, 9, 3], expectedOutput: '9' },
    { input: [9, 5, 3], expectedOutput: '9' },
    { input: [3, 5, 9], expectedOutput: '9' },
    { input: [10, 10, 5], expectedOutput: '10' },
    { input: [-1, -5, -2], expectedOutput: '-1' },
    { input: [7, 7, 7], expectedOutput: '7' },
    { input: [0, -5, 5], expectedOutput: '5' }
  ],
  testFunction: function (userCode) {
    return testFunctionWithInputs(userCode, this.testCases);
  }
};

export const task5 = {
  id: 'string-length',
  taskIndex: 4,
  description: 'Create a function that takes a string and returns its length',
  testCases: [
    { input: ['hello'], expectedOutput: '5' },
    { input: ['JavaScript'], expectedOutput: '10' },
    { input: [''], expectedOutput: '0' },
    { input: ['a'], expectedOutput: '1' },
    { input: ['hello world'], expectedOutput: '11' }
  ],
  testFunction: function (userCode) {
    return testFunctionWithInputs(userCode, this.testCases);
  }
};

export const task6 = {
  id: 'day-name',
  taskIndex: 5,
  description: 'Create a function that takes a number (1-7) and returns the day name',
  testCases: [
    { input: [1], expectedOutput: 'Monday' },
    { input: [2], expectedOutput: 'Tuesday' },
    { input: [3], expectedOutput: 'Wednesday' },
    { input: [5], expectedOutput: 'Friday' },
    { input: [7], expectedOutput: 'Sunday' },
    { input: [0], expectedOutput: 'Invalid' },
    { input: [8], expectedOutput: 'Invalid' },
    { input: [-1], expectedOutput: 'Invalid' }
  ],
  testFunction: function (userCode) {
    return testFunctionWithInputs(userCode, this.testCases);
  }
};

export const task7 = {
  id: 'celsius-to-fahrenheit',
  taskIndex: 6,
  description: 'Create a function that converts Celsius to Fahrenheit',
  testCases: [
    { input: [0], expectedOutput: '32' },
    { input: [100], expectedOutput: '212' },
    { input: [25], expectedOutput: '77' },
    { input: [-40], expectedOutput: '-40' },
    { input: [-10], expectedOutput: '14' },
    { input: [50], expectedOutput: '122' }
  ],
  testFunction: function (userCode) {
    return testFunctionWithInputs(userCode, this.testCases);
  }
};

export const task8 = {
  id: 'is-divisible',
  taskIndex: 7,
  description: 'Create a function that checks if first number is divisible by second',
  testCases: [
    { input: [10, 5], expectedOutput: 'true' },
    { input: [10, 3], expectedOutput: 'false' },
    { input: [15, 5], expectedOutput: 'true' },
    { input: [7, 2], expectedOutput: 'false' },
    { input: [5, 5], expectedOutput: 'true' },
    { input: [7, 1], expectedOutput: 'true' },
    { input: [0, 5], expectedOutput: 'true' }
  ],
  testFunction: function (userCode) {
    return testFunctionWithInputs(userCode, this.testCases);
  }
};

export const task9 = {
  id: 'number-sign',
  taskIndex: 8,
  description: 'Create a function that returns "positive", "negative", or "zero"',
  testCases: [
    { input: [5], expectedOutput: 'positive' },
    { input: [-3], expectedOutput: 'negative' },
    { input: [0], expectedOutput: 'zero' },
    { input: [100], expectedOutput: 'positive' },
    { input: [-100], expectedOutput: 'negative' },
    { input: [1], expectedOutput: 'positive' },
    { input: [-1], expectedOutput: 'negative' }
  ],
  testFunction: function (userCode) {
    return testFunctionWithInputs(userCode, this.testCases);
  }
};

export const task10 = {
  id: 'array-sum',
  taskIndex: 9,
  description: 'Create a function that takes an array of numbers and returns their sum',
  testCases: [
    { input: [[1, 2, 3, 4, 5]], expectedOutput: '15' },
    { input: [[10, 20, 30]], expectedOutput: '60' },
    { input: [[-5, 5, -10, 10]], expectedOutput: '0' },
    { input: [[100]], expectedOutput: '100' },
    { input: [[-1, -2, -3]], expectedOutput: '-6' },
    { input: [[0, 5, 0, 3]], expectedOutput: '8' },
    { input: [[]], expectedOutput: '0' }
  ],
  testFunction: function (userCode) {
    return testFunctionWithInputs(userCode, this.testCases);
  }
};

export const task11 = {
  id: 'array-max',
  taskIndex: 10,
  description: 'Create a function that takes an array and returns the largest number',
  testCases: [
    { input: [[3, 7, 2, 9, 5]], expectedOutput: '9' },
    { input: [[-1, -5, -2]], expectedOutput: '-1' },
    { input: [[42]], expectedOutput: '42' },
    { input: [[5, 5, 5, 5]], expectedOutput: '5' },
    { input: [[9, 3, 5, 2]], expectedOutput: '9' },
    { input: [[3, 5, 2, 9]], expectedOutput: '9' },
    { input: [[0, -5, -3]], expectedOutput: '0' }
  ],
  testFunction: function (userCode) {
    return testFunctionWithInputs(userCode, this.testCases);
  }
};

export const task12 = {
  id: 'array-contains',
  taskIndex: 11,
  description: 'Create a function that checks if target exists in array',
  testCases: [
    { input: [[1, 2, 3, 4, 5], 3], expectedOutput: 'true' },
    { input: [[1, 2, 3, 4, 5], 6], expectedOutput: 'false' },
    { input: [[10, 20, 30], 20], expectedOutput: 'true' },
    { input: [[], 5], expectedOutput: 'false' },
    { input: [[1, 2, 3], 1], expectedOutput: 'true' },
    { input: [[1, 2, 3], 3], expectedOutput: 'true' },
    { input: [[0, 1, 2], 0], expectedOutput: 'true' },
    { input: [[-1, 0, 1], -1], expectedOutput: 'true' }
  ],
  testFunction: function (userCode) {
    return testFunctionWithInputs(userCode, this.testCases);
  }
};

export const functionsTasks = [task1, task2, task3, task4, task5, task6, task7, task8, task9, task10, task11, task12];

export function runTaskTest(taskIndex, userCode) {
  const task = functionsTasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export const functionsTopicTests = {
  topicId: 'functions',
  subtopicId: 'functions',
  title: 'Functions',
  tasks: functionsTasks,
  runTest: runTaskTest
};

export default functionsTopicTests;
