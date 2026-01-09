/**
 * Test Functions for else-if chains
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
  id: 'grade-calculator',
  taskIndex: 0,
  description: 'Score is 73. Print the grade: A (90+), B (80-89), C (70-79), D (60-69), F (below 60)',
  expected: ['C'],
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
  id: 'age-category',
  taskIndex: 1,
  description: 'Age is 45. Print the category: Child (0-12), Teen (13-19), Adult (20-59), Senior (60+)',
  expected: ['Adult'],
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
  id: 'temperature-description',
  taskIndex: 2,
  description: 'Temperature is 28°C. Print: Freezing (below 0), Cold (0-14), Warm (15-29), Hot (30+)',
  expected: ['Warm'],
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
  id: 'time-greeting',
  taskIndex: 3,
  description: 'Hour is 14 (24-hour format). Print greeting: Good morning (5-11), Good afternoon (12-17), Good evening (18-21), Good night (others)',
  expected: ['Good afternoon'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const elseIfChainsTasks = [task1, task2, task3, task4];

export function runTaskTest(taskIndex, userCode) {
  const task = elseIfChainsTasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export const elseIfChainsTopicTests = {
  topicId: 'conditionals',
  subtopicId: 'else-if-chains',
  title: 'else-if chains',
  tasks: elseIfChainsTasks,
  runTest: runTaskTest
};

export default elseIfChainsTopicTests;
