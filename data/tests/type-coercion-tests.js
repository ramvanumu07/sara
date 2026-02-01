// Type Coercion Tests
// Tests for type conversion in JavaScript

export const typeCoercionTopicTests = {
  'type-coercion': {
    title: 'Type conversion in JavaScript',
    tests: [
      // Task 1: Convert to string
      {
        description: 'Create a function that converts any value to a string using explicit conversion',
        testCases: [
          { input: [123], expectedOutput: '123' },
          { input: [true], expectedOutput: 'true' },
          { input: [null], expectedOutput: 'null' },
          { input: [undefined], expectedOutput: 'undefined' },
          { input: [[1, 2, 3]], expectedOutput: '1,2,3' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [123], expectedOutput: '123' },
            { input: [true], expectedOutput: 'true' },
            { input: [null], expectedOutput: 'null' },
            { input: [undefined], expectedOutput: 'undefined' },
            { input: [[1, 2, 3]], expectedOutput: '1,2,3' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('value', `
                ${code}
                return toString(value);
              `);
              const result = func(input[0]);
              results.push({
                input: JSON.stringify(input[0]),
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: JSON.stringify(input[0]),
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 2: String to number safely
      {
        description: 'Create a function that converts a string to a number, returning 0 if conversion fails',
        testCases: [
          { input: ['123'], expectedOutput: '123' },
          { input: ['45.67'], expectedOutput: '45.67' },
          { input: ['abc'], expectedOutput: '0' },
          { input: [''], expectedOutput: '0' },
          { input: ['  42  '], expectedOutput: '42' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['123'], expectedOutput: '123' },
            { input: ['45.67'], expectedOutput: '45.67' },
            { input: ['abc'], expectedOutput: '0' },
            { input: [''], expectedOutput: '0' },
            { input: ['  42  '], expectedOutput: '42' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('str', `
                ${code}
                return String(toNumber(str));
              `);
              const result = func(input[0]);
              results.push({
                input: `"${input[0]}"`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `"${input[0]}"`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 3: Truthy/falsy check
      {
        description: 'Create a function that returns whether a value is truthy or falsy (return "truthy" or "falsy")',
        testCases: [
          { input: [0], expectedOutput: 'falsy' },
          { input: [''], expectedOutput: 'falsy' },
          { input: [null], expectedOutput: 'falsy' },
          { input: ['hello'], expectedOutput: 'truthy' },
          { input: [1], expectedOutput: 'truthy' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [0], expectedOutput: 'falsy' },
            { input: [''], expectedOutput: 'falsy' },
            { input: [null], expectedOutput: 'falsy' },
            { input: ['hello'], expectedOutput: 'truthy' },
            { input: [1], expectedOutput: 'truthy' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('value', `
                ${code}
                return isTruthyOrFalsy(value);
              `);
              const result = func(input[0]);
              results.push({
                input: JSON.stringify(input[0]),
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: JSON.stringify(input[0]),
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 4: Strict equality
      {
        description: 'Create a function that compares two values using strict equality (===) and returns true/false',
        testCases: [
          { input: [5, '5'], expectedOutput: 'false' },
          { input: [5, 5], expectedOutput: 'true' },
          { input: [null, undefined], expectedOutput: 'false' },
          { input: [true, 1], expectedOutput: 'false' },
          { input: ['hello', 'hello'], expectedOutput: 'true' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [5, '5'], expectedOutput: 'false' },
            { input: [5, 5], expectedOutput: 'true' },
            { input: [null, undefined], expectedOutput: 'false' },
            { input: [true, 1], expectedOutput: 'false' },
            { input: ['hello', 'hello'], expectedOutput: 'true' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('a', 'b', `
                ${code}
                return String(strictEquals(a, b));
              `);
              const result = func(input[0], input[1]);
              results.push({
                input: `${JSON.stringify(input[0])}, ${JSON.stringify(input[1])}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${JSON.stringify(input[0])}, ${JSON.stringify(input[1])}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 5: Plus operator behavior
      {
        description: 'Create a function that demonstrates + operator behavior: if either is string, concatenate; otherwise add',
        testCases: [
          { input: [5, '3'], expectedOutput: '53' },
          { input: [5, 3], expectedOutput: '8' },
          { input: ['hello', 'world'], expectedOutput: 'helloworld' },
          { input: ['', 5], expectedOutput: '5' },
          { input: [true, 1], expectedOutput: '2' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [5, '3'], expectedOutput: '53' },
            { input: [5, 3], expectedOutput: '8' },
            { input: ['hello', 'world'], expectedOutput: 'helloworld' },
            { input: ['', 5], expectedOutput: '5' },
            { input: [true, 1], expectedOutput: '2' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('a', 'b', `
                ${code}
                return String(addOrConcat(a, b));
              `);
              const result = func(input[0], input[1]);
              results.push({
                input: `${JSON.stringify(input[0])}, ${JSON.stringify(input[1])}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${JSON.stringify(input[0])}, ${JSON.stringify(input[1])}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 6: Safe parseInt
      {
        description: 'Create a function that safely parses an integer from a string, returning null if invalid',
        testCases: [
          { input: ['42'], expectedOutput: '42' },
          { input: ['42px'], expectedOutput: '42' },
          { input: ['abc'], expectedOutput: 'null' },
          { input: ['3.14'], expectedOutput: '3' },
          { input: [''], expectedOutput: 'null' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['42'], expectedOutput: '42' },
            { input: ['42px'], expectedOutput: '42' },
            { input: ['abc'], expectedOutput: 'null' },
            { input: ['3.14'], expectedOutput: '3' },
            { input: [''], expectedOutput: 'null' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('str', `
                ${code}
                return String(safeParseInt(str));
              `);
              const result = func(input[0]);
              results.push({
                input: `"${input[0]}"`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `"${input[0]}"`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 7: Count truthy values
      {
        description: 'Create a function that counts how many truthy values are in an array',
        testCases: [
          { input: [[1, 0, 'hello', '', null, true]], expectedOutput: '3' },
          { input: [[false, 0, '', null, undefined]], expectedOutput: '0' },
          { input: [[1, 2, 3]], expectedOutput: '3' },
          { input: [[]], expectedOutput: '0' },
          { input: [['', 0, false, 'a']], expectedOutput: '1' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 0, 'hello', '', null, true]], expectedOutput: '3' },
            { input: [[false, 0, '', null, undefined]], expectedOutput: '0' },
            { input: [[1, 2, 3]], expectedOutput: '3' },
            { input: [[]], expectedOutput: '0' },
            { input: [['', 0, false, 'a']], expectedOutput: '1' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', `
                ${code}
                return String(countTruthy(arr));
              `);
              const result = func([...input[0]]);
              results.push({
                input: JSON.stringify(input[0]),
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: JSON.stringify(input[0]),
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 8: Boolean to yes/no
      {
        description: 'Create a function that converts a value to boolean and returns "yes" if true, "no" if false',
        testCases: [
          { input: [1], expectedOutput: 'yes' },
          { input: [0], expectedOutput: 'no' },
          { input: ['text'], expectedOutput: 'yes' },
          { input: [''], expectedOutput: 'no' },
          { input: [null], expectedOutput: 'no' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [1], expectedOutput: 'yes' },
            { input: [0], expectedOutput: 'no' },
            { input: ['text'], expectedOutput: 'yes' },
            { input: [''], expectedOutput: 'no' },
            { input: [null], expectedOutput: 'no' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('value', `
                ${code}
                return boolToYesNo(value);
              `);
              const result = func(input[0]);
              results.push({
                input: JSON.stringify(input[0]),
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: JSON.stringify(input[0]),
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      }
    ]
  }
};

export default typeCoercionTopicTests;




