/**
 * Test Functions for for loops
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
  id: 'even-numbers-2-to-20',
  taskIndex: 0,
  description: 'Print all even numbers from 2 to 20, each on a new line',
  expected: ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20'],
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
  id: 'factorial-6',
  taskIndex: 1,
  description: 'Calculate and print 6 factorial (6! = 6 × 5 × 4 × 3 × 2 × 1)',
  expected: ['720'],
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
  id: 'countdown-20-to-1',
  taskIndex: 2,
  description: 'Print a countdown from 20 to 1, each number on a new line',
  expected: ['20', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
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
  id: 'sum-odd-1-to-100',
  taskIndex: 3,
  description: 'Calculate and print the sum of all odd numbers from 1 to 100',
  expected: ['2500'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const forLoopsTasks = [task1, task2, task3, task4];

export function runTaskTest(taskIndex, userCode) {
  const task = forLoopsTasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export const forLoopsTopicTests = {
  topicId: 'loops',
  subtopicId: 'for-loops',
  title: 'for loops',
  tasks: forLoopsTasks,
  runTest: runTaskTest
};

export default forLoopsTopicTests;
