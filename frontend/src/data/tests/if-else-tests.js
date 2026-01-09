/**
 * Test Functions for if-else statements
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
  id: 'even-odd',
  taskIndex: 0,
  description: 'The number is 17. Print "Even" if divisible by 2, otherwise print "Odd"',
  expected: ['Odd'],
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
  id: 'pass-fail',
  taskIndex: 1,
  description: 'Score is 58. Print "Pass" if 60 or above, otherwise print "Fail"',
  expected: ['Fail'],
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
  id: 'bank-withdrawal',
  taskIndex: 2,
  description: 'Balance is 500, withdrawal is 300. If balance covers the withdrawal, print remaining balance. Otherwise print "Insufficient funds"',
  expected: ['200'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const ifElseTasks = [task1, task2, task3];

export function runTaskTest(taskIndex, userCode) {
  const task = ifElseTasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export const ifElseTopicTests = {
  topicId: 'conditionals',
  subtopicId: 'if-else',
  title: 'if-else statements',
  tasks: ifElseTasks,
  runTest: runTaskTest
};

export default ifElseTopicTests;
