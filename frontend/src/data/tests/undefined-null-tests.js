/**
 * Test Functions for Understanding undefined and null
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
  id: 'undefined-check',
  taskIndex: 0,
  description: 'Declare a variable without assigning any value. Print the variable on the first line, its type (using typeof) on the second line',
  expected: ['undefined', 'undefined'],
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
  id: 'null-check',
  taskIndex: 1,
  description: 'Create a variable and assign null to it. Print the variable on the first line, its type (using typeof) on the second line',
  expected: ['null', 'object'],
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
  id: 'value-to-null',
  taskIndex: 2,
  description: 'Create a variable with value 100. Print the value and its type. Then reassign it to null and print the value and its type again',
  expected: ['100', 'number', 'null', 'object'],
  testFunction: function (userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const undefinedNullTasks = [task1, task2, task3];

export function runTaskTest(taskIndex, userCode) {
  const task = undefinedNullTasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export const undefinedNullTopicTests = {
  topicId: 'data-types',
  subtopicId: 'undefined-null',
  title: 'Understanding undefined and null',
  tasks: undefinedNullTasks,
  runTest: runTaskTest
};

export default undefinedNullTopicTests;
