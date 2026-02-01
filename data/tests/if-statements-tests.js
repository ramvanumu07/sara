/**
 * Test Functions for if statements
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
  id: 'equality-check',
  taskIndex: 0,
  description: 'The number is 42. If it equals 42, print "The answer"',
  expected: ['The answer'],
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
  id: 'divisibility-check',
  taskIndex: 1,
  description: 'The number is 15. If it is divisible by 5 (remainder is 0), print "Multiple of 5"',
  expected: ['Multiple of 5'],
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
  id: 'compound-condition',
  taskIndex: 2,
  description: 'Age is 25 and hasID is true. If age >= 18 AND hasID is true, print "Entry allowed"',
  expected: ['Entry allowed'],
  testFunction: function (userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const ifStatementsTasks = [task1, task2, task3];

export function runTaskTest(taskIndex, userCode) {
  const task = ifStatementsTasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export const ifStatementsTopicTests = {
  topicId: 'conditionals',
  subtopicId: 'if-statements',
  title: 'if statements',
  tasks: ifStatementsTasks,
  runTest: runTaskTest
};

export default ifStatementsTopicTests;
