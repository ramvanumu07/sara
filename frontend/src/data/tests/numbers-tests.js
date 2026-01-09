/**
 * Test Functions for Numbers and Basic Arithmetic
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
  id: 'rectangle-calc',
  taskIndex: 0,
  description: 'A rectangle has length 24 and width 15. Print its area on the first line and perimeter on the second line',
  expected: ['360', '78'],
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
  id: 'minutes-convert',
  taskIndex: 1,
  description: 'Convert 185 minutes to hours and remaining minutes. Print hours on the first line, remaining minutes on the second line',
  expected: ['3', '5'],
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
  id: 'average-calc',
  taskIndex: 2,
  description: 'Three test scores are 78, 85, and 92. Print their average',
  expected: ['85'],
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
  id: 'discount-calc',
  taskIndex: 3,
  description: 'An item costs 1250 with a 20% discount. Print the discount amount on the first line, final price on the second line',
  expected: ['250', '1000'],
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
  id: 'digit-extract',
  taskIndex: 4,
  description: 'Given the number 9472, print its last digit on the first line, and the number without the last digit on the second line',
  expected: ['2', '947'],
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
  id: 'celsius-fahrenheit',
  taskIndex: 5,
  description: 'Convert 25 Celsius to Fahrenheit. Formula: (celsius × 9 / 5) + 32. Print the result',
  expected: ['77'],
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
  id: 'four-operations',
  taskIndex: 6,
  description: 'Given two numbers 37 and 58, print their sum, difference, product, and quotient on separate lines',
  expected: ['95', '21', '2146', '1.5675675675675675'],
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
  id: 'seconds-convert',
  taskIndex: 7,
  description: 'Convert 7384 seconds to hours, minutes, and remaining seconds. Print each on separate lines',
  expected: ['2', '3', '4'],
  testFunction: function(userCode) {
    const result = captureConsoleLog(userCode);
    if (!result.success) {
      return { passed: false, error: result.error, expected: this.expected, actual: null };
    }
    const passed = compareOutputs(result.outputs, this.expected);
    return { passed, expected: this.expected.join('\n'), actual: result.outputs.join('\n') };
  }
};

export const numbersTasks = [task1, task2, task3, task4, task5, task6, task7, task8];

export function runTaskTest(taskIndex, userCode) {
  const task = numbersTasks[taskIndex];
  if (!task) return { error: 'Task not found', passed: false };
  return task.testFunction(userCode);
}

export const numbersTopicTests = {
  topicId: 'data-types',
  subtopicId: 'numbers-arithmetic',
  title: 'Numbers and Basic Arithmetic',
  tasks: numbersTasks,
  runTest: runTaskTest
};

export default numbersTopicTests;
