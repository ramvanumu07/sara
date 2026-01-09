/**
 * Test Functions for Foundation: Your first program (console.log)
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
  id: 'hello-world',
  taskIndex: 0,
  description: 'Print the text: Hello, World!',
  expected: ['Hello, World!'],
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
  id: 'print-number',
  taskIndex: 1,
  description: 'Print the number 42',
  expected: ['42'],
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
  id: 'print-decimal',
  taskIndex: 2,
  description: 'Print the decimal number 3.14159',
  expected: ['3.14159'],
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
  id: 'print-negative',
  taskIndex: 3,
  description: 'Print the negative number -50',
  expected: ['-50'],
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
  id: 'print-multiple',
  taskIndex: 4,
  description: 'Print "Result:" and 100 together, separated by a space',
  expected: ['Result: 100'],
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
  id: 'print-math',
  taskIndex: 5,
  description: 'Print the result of 8 multiplied by 5',
  expected: ['40'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const foundationTasks = [task1, task2, task3, task4, task5, task6];

export function runTaskTest(taskIndex, userCode) {
  const task = foundationTasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export const foundationTopicTests = {
  topicId: 'foundation',
  subtopicId: 'first-program',
  title: 'Your first program (console.log)',
  tasks: foundationTasks,
  runTest: runTaskTest
};

export default foundationTopicTests;
