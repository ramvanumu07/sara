/**
 * Test Functions for while loops
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
  id: 'count-1-to-10',
  taskIndex: 0,
  description: 'Print numbers from 1 to 10, each on a new line',
  expected: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
  testFunction: function (userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const task2 = {
  id: 'double-until-100',
  taskIndex: 1,
  description: 'Start with 5. Keep doubling and printing until the value exceeds 100',
  expected: ['5', '10', '20', '40', '80', '160'],
  testFunction: function (userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const task3 = {
  id: 'sum-1-to-50',
  taskIndex: 2,
  description: 'Calculate and print the sum of all numbers from 1 to 50',
  expected: ['1275'],
  testFunction: function (userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const task4 = {
  id: 'multiplication-table-7',
  taskIndex: 3,
  description: 'Print the multiplication results of 7 (7×1 through 7×10), each result on a new line',
  expected: ['7', '14', '21', '28', '35', '42', '49', '56', '63', '70'],
  testFunction: function (userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const whileLoopsTasks = [task1, task2, task3, task4];

export function runTaskTest(taskIndex, userCode) {
  const task = whileLoopsTasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export const whileLoopsTopicTests = {
  topicId: 'loops',
  subtopicId: 'while-loops',
  title: 'while loops',
  tasks: whileLoopsTasks,
  runTest: runTaskTest
};

export default whileLoopsTopicTests;
