/**
 * Test Functions for Nested conditions
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
  id: 'login-check',
  taskIndex: 0,
  description: 'Login check: userExists is true, passwordCorrect is true. First check if user exists, then check password. Print "Login successful", "Wrong password", or "User not found"',
  expected: ['Login successful'],
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
  id: 'driving-eligibility',
  taskIndex: 1,
  description: 'Driving check: age is 25, hasLicense is true. First check if age >= 18, then check license. Print "Can drive", "Need license", or "Too young"',
  expected: ['Can drive'],
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
  id: 'number-classification',
  taskIndex: 2,
  description: 'Number is -15. First check if positive or negative, then check even or odd. Print the combined result (e.g., "Positive Even", "Negative Odd")',
  expected: ['Negative Odd'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const nestedConditionsTasks = [task1, task2, task3];

export function runTaskTest(taskIndex, userCode) {
  const task = nestedConditionsTasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export const nestedConditionsTopicTests = {
  topicId: 'conditionals',
  subtopicId: 'nested-conditions',
  title: 'Nested conditions',
  tasks: nestedConditionsTasks,
  runTest: runTaskTest
};

export default nestedConditionsTopicTests;
