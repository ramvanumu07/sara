/**
 * Test Functions for Loop control (break, continue)
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
  id: 'first-divisible-by-7',
  taskIndex: 0,
  description: 'Find the first number between 50 and 100 that is divisible by 7. Print it and stop searching',
  expected: ['56'],
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
  id: 'skip-multiples-of-4',
  taskIndex: 1,
  description: 'Print numbers from 1 to 30, but skip all multiples of 4',
  expected: ['1', '2', '3', '5', '6', '7', '9', '10', '11', '13', '14', '15', '17', '18', '19', '21', '22', '23', '25', '26', '27', '29', '30'],
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
  id: 'sum-until-exceeds-200',
  taskIndex: 2,
  description: 'Add numbers starting from 1 until the sum exceeds 200. Print the final sum, then print how many numbers were added',
  expected: ['210', '20'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const loopControlTasks = [task1, task2, task3];

export function runTaskTest(taskIndex, userCode) {
  const task = loopControlTasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export const loopControlTopicTests = {
  topicId: 'loops',
  subtopicId: 'loop-control',
  title: 'Loop control (break, continue)',
  tasks: loopControlTasks,
  runTest: runTaskTest
};

export default loopControlTopicTests;
