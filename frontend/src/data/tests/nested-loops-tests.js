/**
 * Test Functions for Nested loops
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
  id: 'multiplication-table-5x5',
  taskIndex: 0,
  description: 'Print a 5-row multiplication table. Each row i shows: i×1, i×2, i×3, i×4, i×5 separated by spaces',
  expected: [
    '1 2 3 4 5',
    '2 4 6 8 10',
    '3 6 9 12 15',
    '4 8 12 16 20',
    '5 10 15 20 25'
  ],
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
  id: 'right-triangle-stars',
  taskIndex: 1,
  description: 'Print a right triangle of asterisks with 5 rows. Row 1 has 1 star, row 2 has 2 stars, and so on',
  expected: ['*', '**', '***', '****', '*****'],
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
  id: 'number-grid-4x6',
  taskIndex: 2,
  description: 'Print a grid with 4 rows and 6 columns. Each cell shows row × column, columns separated by spaces',
  expected: [
    '1 2 3 4 5 6',
    '2 4 6 8 10 12',
    '3 6 9 12 15 18',
    '4 8 12 16 20 24'
  ],
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
  id: 'all-pairs',
  taskIndex: 3,
  description: 'Print all coordinate pairs where row goes 1 to 3 and column goes 1 to 4. Format: "row,column" each on a new line',
  expected: [
    '1,1', '1,2', '1,3', '1,4',
    '2,1', '2,2', '2,3', '2,4',
    '3,1', '3,2', '3,3', '3,4'
  ],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const nestedLoopsTasks = [task1, task2, task3, task4];

export function runTaskTest(taskIndex, userCode) {
  const task = nestedLoopsTasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export const nestedLoopsTopicTests = {
  topicId: 'loops',
  subtopicId: 'nested-loops',
  title: 'Nested loops',
  tasks: nestedLoopsTasks,
  runTest: runTaskTest
};

export default nestedLoopsTopicTests;
