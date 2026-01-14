/**
 * Test Functions for Operators
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
  id: 'game-score',
  taskIndex: 0,
  description: 'A game score starts at 0. Player earns 100, then earns 50 more, then loses 30, then doubles their score. Print the final score',
  expected: ['240'],
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
  id: 'loan-eligibility',
  taskIndex: 1,
  description: 'Check loan eligibility. Age is 28, income is 55000, credit score is 720. Print whether each requirement passes, then whether ALL pass',
  expected: ['true', 'true', 'true', 'true'],
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
  id: 'movie-ticket',
  taskIndex: 2,
  description: 'Movie ticket: customer age is 15. Print whether each discount applies (child, senior, regular)',
  expected: ['false', 'false', 'true'],
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
  id: 'number-analysis',
  taskIndex: 3,
  description: 'Analyze the number 156. Print whether positive, even, three-digit, and whether ALL are true',
  expected: ['true', 'true', 'true', 'true'],
  testFunction: function (userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const operatorsTasks = [task1, task2, task3, task4];

export function runTaskTest(taskIndex, userCode) {
  const task = operatorsTasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export const operatorsTopicTests = {
  topicId: 'operators',
  subtopicId: 'operators',
  title: 'Operators',
  tasks: operatorsTasks,
  runTest: runTaskTest
};

export default operatorsTopicTests;
