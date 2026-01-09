/**
 * Test Functions for Arrays
 */

function captureConsoleLog(userCode) {
  const outputs = [];
  const originalLog = console.log;
  
  console.log = (...args) => {
    outputs.push(args.map(arg => String(arg)).join(' '));
  };
  
  try {
    const fn = new Function(userCode);
    fn();
    console.log = originalLog;
    return { success: true, outputs };
  } catch (error) {
    console.log = originalLog;
    return { success: false, error: error.message, outputs };
  }
}

function compareOutputs(actual, expected) {
  if (actual.length !== expected.length) return false;
  return expected.every((exp, i) => actual[i] === exp);
}

export const task1 = {
  id: 'array-basics',
  taskIndex: 0,
  description: 'Numbers are [10, 25, 8, 17, 42, 3]. Print the first element, last element, and total count on separate lines',
  expected: ['10', '3', '6'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const task2 = {
  id: 'array-sum',
  taskIndex: 1,
  description: 'Numbers are [4, 9, 2, 7, 5, 1, 8, 3]. Calculate and print the sum of all elements',
  expected: ['39'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const task3 = {
  id: 'array-max',
  taskIndex: 2,
  description: 'Numbers are [23, 67, 12, 89, 45, 34, 91, 56]. Find and print the largest number',
  expected: ['91'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const task4 = {
  id: 'array-count-condition',
  taskIndex: 3,
  description: 'Numbers are [3, 8, 12, 5, 17, 9, 14, 6, 11]. Count and print how many numbers are greater than 10',
  expected: ['4'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const task5 = {
  id: 'array-min-index',
  taskIndex: 4,
  description: 'Numbers are [7, 3, 9, 1, 5, 8, 2, 6, 4]. Find the smallest number and its position (index). Print the number first, then its index',
  expected: ['1', '3'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const task6 = {
  id: 'array-average',
  taskIndex: 5,
  description: 'Numbers are [15, 22, 8, 36, 14, 42, 19]. Calculate and print the average (sum divided by count)',
  expected: ['22.285714285714285'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const task7 = {
  id: 'array-first-match',
  taskIndex: 6,
  description: 'Numbers are [5, 12, 8, 19, 3, 15, 7, 22, 11]. Find the first number greater than 10 and print it. If none found, print -1',
  expected: ['12'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const task8 = {
  id: 'array-reverse',
  taskIndex: 7,
  description: 'Numbers are [4, 7, 2, 9, 1, 8, 5]. Print all elements in reverse order (last to first), each on a new line',
  expected: ['5', '8', '1', '9', '2', '7', '4'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const task9 = {
  id: 'array-min-max-diff',
  taskIndex: 8,
  description: 'Numbers are [3, 7, 2, 8, 5, 9, 1, 6, 4]. Find both the largest and smallest numbers. Print the largest first, then the smallest, then their difference',
  expected: ['9', '1', '8'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const task10 = {
  id: 'array-even-odd-count',
  taskIndex: 9,
  description: 'Numbers are [12, 5, 8, 19, 3, 15, 7, 22, 11, 6]. Count how many are even and how many are odd. Print even count first, then odd count',
  expected: ['5', '5'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const arraysTasks = [task1, task2, task3, task4, task5, task6, task7, task8, task9, task10];

export function runTaskTest(taskIndex, userCode) {
  const task = arraysTasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export const arraysTopicTests = {
  topicId: 'arrays',
  subtopicId: 'arrays',
  title: 'Arrays',
  tasks: arraysTasks,
  runTest: runTaskTest
};

export default arraysTopicTests;



