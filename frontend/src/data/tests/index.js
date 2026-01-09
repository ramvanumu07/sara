/**
 * Test Functions Index
 * Centralizes all test functions for the curriculum
 */

import foundationTopicTests from './foundation-tests.js';
import variablesTopicTests from './variables-tests.js';
import numbersTopicTests from './numbers-tests.js';
import stringsTopicTests from './strings-tests.js';
import undefinedNullTopicTests from './undefined-null-tests.js';
import dateTimeTopicTests from './date-time-tests.js';
import typeCoercionTopicTests from './type-coercion-tests.js';
import mathObjectTopicTests from './math-object-tests.js';
import operatorsTopicTests from './operators-tests.js';
import ifStatementsTopicTests from './if-statements-tests.js';
import ifElseTopicTests from './if-else-tests.js';
import elseIfChainsTopicTests from './else-if-chains-tests.js';
import nestedConditionsTopicTests from './nested-conditions-tests.js';
import whileLoopsTopicTests from './while-loops-tests.js';
import forLoopsTopicTests from './for-loops-tests.js';
import loopControlTopicTests from './loop-control-tests.js';
import nestedLoopsTopicTests from './nested-loops-tests.js';
import arraysTopicTests from './arrays-tests.js';
import functionsTopicTests from './functions-tests.js';
import recursionTopicTests from './recursion-tests.js';
import { forEachTopicTests, mapTopicTests, filterTopicTests, findTopicTests, someEveryTopicTests, reduceTopicTests } from './array-methods-tests.js';
import { stringManipulationsTopicTests, splitJoinTopicTests, substringSliceTopicTests, stringSearchingTopicTests } from './string-methods-tests.js';
import regexTopicTests from './regex-tests.js';
import objectsTopicTests from './objects-tests.js';
import jsonTopicTests from './json-tests.js';
import mapSetTopicTests from './map-set-tests.js';
import destructuringTopicTests from './destructuring-tests.js';
import arrowFunctionsTopicTests from './arrow-functions-tests.js';
import closuresTopicTests from './closures-tests.js';
import arrayAdvancedTopicTests from './array-advanced-tests.js';
import spreadRestTopicTests from './spread-rest-tests.js';
import errorHandlingTopicTests from './error-handling-tests.js';
import asyncBasicsTopicTests from './async-basics-tests.js';
import promisesTopicTests from './promises-tests.js';
import asyncAwaitTopicTests from './async-await-tests.js';
import classesTopicTests from './classes-tests.js';
import modulesTopicTests from './modules-tests.js';

// ============ ALL TOPIC TESTS ============
export const topicTests = {
  'foundation': {
    'first-program': foundationTopicTests
  },
  'variables': {
    'variables-and-constants': variablesTopicTests
  },
  'data-types': {
    'numbers-arithmetic': numbersTopicTests,
    'strings-operations': stringsTopicTests,
    'undefined-null': undefinedNullTopicTests
  },
  'date-time': {
    'date-time': dateTimeTopicTests
  },
  'type-coercion': {
    'type-coercion': typeCoercionTopicTests
  },
  'math-object': {
    'math-object': mathObjectTopicTests
  },
  'operators': {
    'operators': operatorsTopicTests
  },
  'conditionals': {
    'if-statements': ifStatementsTopicTests,
    'if-else': ifElseTopicTests,
    'else-if-chains': elseIfChainsTopicTests,
    'nested-conditions': nestedConditionsTopicTests
  },
  'loops': {
    'while-loops': whileLoopsTopicTests,
    'for-loops': forLoopsTopicTests,
    'loop-control': loopControlTopicTests,
    'nested-loops': nestedLoopsTopicTests
  },
  'arrays': {
    'arrays': arraysTopicTests
  },
  'functions': {
    'functions': functionsTopicTests
  },
  'recursion': {
    'recursion': recursionTopicTests
  },
  'array-methods': {
    'foreach': forEachTopicTests,
    'map': mapTopicTests,
    'filter': filterTopicTests,
    'find-findindex': findTopicTests,
    'some-every': someEveryTopicTests,
    'reduce': reduceTopicTests
  },
  'string-methods': {
    'string-manipulations': stringManipulationsTopicTests,
    'split-join': splitJoinTopicTests,
    'substring-slice': substringSliceTopicTests,
    'string-searching': stringSearchingTopicTests
  },
  'regex': {
    'regex': regexTopicTests
  },
  'objects': {
    'objects': objectsTopicTests
  },
  'json': {
    'json': jsonTopicTests
  },
  'map-set': {
    'map-set': mapSetTopicTests
  },
  'destructuring': {
    'destructuring': destructuringTopicTests
  },
  'arrow-functions': {
    'arrow-functions': arrowFunctionsTopicTests
  },
  'closures': {
    'closures': closuresTopicTests
  },
  'array-advanced': {
    'array-advanced-patterns': arrayAdvancedTopicTests
  },
  'spread-rest': {
    'spread-rest': spreadRestTopicTests
  },
  'error-handling': {
    'error-handling': errorHandlingTopicTests
  },
  'async-basics': {
    'async-basics': asyncBasicsTopicTests
  },
  'promises': {
    'promises': promisesTopicTests
  },
  'async-await': {
    'async-await': asyncAwaitTopicTests
  },
  'classes': {
    'classes': classesTopicTests
  },
  'modules': {
    'modules': modulesTopicTests
  }
  // Add more topics as they are created
};

// ============ GET TEST FOR SPECIFIC TASK ============
export function getTaskTest(topicId, subtopicId, taskIndex) {
    const topic = topicTests[topicId];
    if (!topic) return null;

    const subtopic = topic[subtopicId];
    if (!subtopic) return null;

    return subtopic.tasks[taskIndex] || null;
}

// ============ RUN TEST FOR SPECIFIC TASK ============
export function runTest(topicId, subtopicId, taskIndex, userCode) {
    const taskTest = getTaskTest(topicId, subtopicId, taskIndex);
    if (!taskTest) {
        return { error: 'Task test not found', passed: false };
    }
    return taskTest.testFunction(userCode);
}

// ============ GET ALL TASKS FOR A SUBTOPIC ============
export function getSubtopicTasks(topicId, subtopicId) {
    const topic = topicTests[topicId];
    if (!topic) return [];

    const subtopic = topic[subtopicId];
    if (!subtopic) return [];

    return subtopic.tasks;
}

export default topicTests;
