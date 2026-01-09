/**
 * Test Functions for Strings and String Operations
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
  id: 'string-info',
  taskIndex: 0,
  description: 'The word is "JavaScript". Print its length, first character, and last character on separate lines',
  expected: ['10', 'J', 't'],
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
  id: 'full-name',
  taskIndex: 1,
  description: 'First name is "John", last name is "Smith". Print the full name with a space between them',
  expected: ['John Smith'],
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
  id: 'first-last-chars',
  taskIndex: 2,
  description: 'The word is "Programming". Print the first 3 characters on one line, last 3 characters on the next line',
  expected: ['Pro', 'ing'],
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
  id: 'case-convert',
  taskIndex: 3,
  description: 'The text is "hello world". Print it in uppercase on the first line, lowercase on the second line',
  expected: ['HELLO WORLD', 'hello world'],
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
  id: 'initials',
  taskIndex: 4,
  description: 'First name is "Alice", last name is "Brown". Print their initials combined and in uppercase',
  expected: ['AB'],
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
  id: 'each-char',
  taskIndex: 5,
  description: 'The word is "ABCDE". Print each character on a separate line',
  expected: ['A', 'B', 'C', 'D', 'E'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const task7 = {
  id: 'first-mid-last',
  taskIndex: 6,
  description: 'The word is "racecar". Print the first, middle, and last characters separated by dashes on one line',
  expected: ['r-e-r'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const task8 = {
  id: 'username-info',
  taskIndex: 7,
  description: 'Username is "johnDoe42". Print: its length, its first character in uppercase, and its last character',
  expected: ['9', 'J', '2'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const stringsTasks = [task1, task2, task3, task4, task5, task6, task7, task8];

export function runTaskTest(taskIndex, userCode) {
  const task = stringsTasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export const stringsTopicTests = {
  topicId: 'data-types',
  subtopicId: 'strings-operations',
  title: 'Strings and String Operations',
  tasks: stringsTasks,
  runTest: runTaskTest
};

export default stringsTopicTests;
