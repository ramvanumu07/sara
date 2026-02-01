// Error Handling Tests
// Tests for try-catch, throw, and error management

export const errorHandlingTopicTests = {
  'error-handling': {
    title: 'Error handling with try-catch',
    tests: [
      // Task 1: Safe JSON parsing
      {
        description: 'Create a function that takes a JSON string and returns the parsed object, or null if parsing fails',
        testCases: [
          { input: ['{"name":"John","age":30}'], expectedOutput: '{"name":"John","age":30}' },
          { input: ['invalid json'], expectedOutput: 'null' },
          { input: ['{"valid":true}'], expectedOutput: '{"valid":true}' },
          { input: [''], expectedOutput: 'null' },
          { input: ['null'], expectedOutput: 'null' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['{"name":"John","age":30}'], expectedOutput: '{"name":"John","age":30}' },
            { input: ['invalid json'], expectedOutput: 'null' },
            { input: ['{"valid":true}'], expectedOutput: '{"valid":true}' },
            { input: [''], expectedOutput: 'null' },
            { input: ['null'], expectedOutput: 'null' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('str', `${code}\nreturn safeJsonParse(str);`);
              const result = func(input[0]);
              const resultStr = result === null ? 'null' : JSON.stringify(result);
              results.push({
                input: `"${input[0]}"`,
                expectedOutput,
                actualOutput: resultStr,
                passed: resultStr === expectedOutput
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
      // Task 2: Safe division with error throwing
      {
        description: 'Create a function that divides two numbers but throws an error with message "Cannot divide by zero" if the divisor is zero',
        testCases: [
          { input: [10, 2], expectedOutput: '5' },
          { input: [10, 0], expectedOutput: 'Error: Cannot divide by zero' },
          { input: [0, 5], expectedOutput: '0' },
          { input: [-10, 2], expectedOutput: '-5' },
          { input: [7, 2], expectedOutput: '3.5' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [10, 2], expectedOutput: '5' },
            { input: [10, 0], expectedOutput: 'Error: Cannot divide by zero' },
            { input: [0, 5], expectedOutput: '0' },
            { input: [-10, 2], expectedOutput: '-5' },
            { input: [7, 2], expectedOutput: '3.5' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('a', 'b', `${code}\nreturn safeDivide(a, b);`);
              const result = String(func(input[0], input[1]));
              results.push({
                input: `${input[0]}, ${input[1]}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              const actualOutput = `Error: ${error.message}`;
              results.push({
                input: `${input[0]}, ${input[1]}`,
                expectedOutput,
                actualOutput,
                passed: actualOutput === expectedOutput
              });
            }
          }
          return results;
        }
      },
      // Task 3: Age validation with custom errors
      {
        description: 'Create a function that validates age: throws "Age cannot be negative" if negative, "Age cannot exceed 150" if over 150, otherwise returns the age',
        testCases: [
          { input: [25], expectedOutput: '25' },
          { input: [-5], expectedOutput: 'Error: Age cannot be negative' },
          { input: [200], expectedOutput: 'Error: Age cannot exceed 150' },
          { input: [0], expectedOutput: '0' },
          { input: [150], expectedOutput: '150' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [25], expectedOutput: '25' },
            { input: [-5], expectedOutput: 'Error: Age cannot be negative' },
            { input: [200], expectedOutput: 'Error: Age cannot exceed 150' },
            { input: [0], expectedOutput: '0' },
            { input: [150], expectedOutput: '150' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('age', `${code}\nreturn validateAge(age);`);
              const result = String(func(input[0]));
              results.push({
                input: `${input[0]}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              const actualOutput = `Error: ${error.message}`;
              results.push({
                input: `${input[0]}`,
                expectedOutput,
                actualOutput,
                passed: actualOutput === expectedOutput
              });
            }
          }
          return results;
        }
      },
      // Task 4: Safe nested property access
      {
        description: 'Create a function that takes an object and a dot-notation path string, returns the value or "Property not found" if path is invalid',
        testCases: [
          { input: [{ user: { name: 'Alice' } }, 'user.name'], expectedOutput: 'Alice' },
          { input: [{ a: { b: { c: 42 } } }, 'a.b.c'], expectedOutput: '42' },
          { input: [{ x: 10 }, 'y'], expectedOutput: 'Property not found' },
          { input: [{}, 'any.path'], expectedOutput: 'Property not found' },
          { input: [{ val: 0 }, 'val'], expectedOutput: '0' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [{ user: { name: 'Alice' } }, 'user.name'], expectedOutput: 'Alice' },
            { input: [{ a: { b: { c: 42 } } }, 'a.b.c'], expectedOutput: '42' },
            { input: [{ x: 10 }, 'y'], expectedOutput: 'Property not found' },
            { input: [{}, 'any.path'], expectedOutput: 'Property not found' },
            { input: [{ val: 0 }, 'val'], expectedOutput: '0' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('obj', 'path', `${code}\nreturn getNestedValue(obj, path);`);
              const result = String(func(input[0], input[1]));
              results.push({
                input: `${JSON.stringify(input[0])}, "${input[1]}"`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${JSON.stringify(input[0])}, "${input[1]}"`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 5: String to integer conversion
      {
        description: 'Create a function that converts a string to an integer, throws "Invalid number" if the string is not a valid integer',
        testCases: [
          { input: ['42'], expectedOutput: '42' },
          { input: ['abc'], expectedOutput: 'Error: Invalid number' },
          { input: ['-10'], expectedOutput: '-10' },
          { input: ['3.14'], expectedOutput: '3' },
          { input: [''], expectedOutput: 'Error: Invalid number' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['42'], expectedOutput: '42' },
            { input: ['abc'], expectedOutput: 'Error: Invalid number' },
            { input: ['-10'], expectedOutput: '-10' },
            { input: ['3.14'], expectedOutput: '3' },
            { input: [''], expectedOutput: 'Error: Invalid number' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('str', `${code}\nreturn toInteger(str);`);
              const result = String(func(input[0]));
              results.push({
                input: `"${input[0]}"`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              const actualOutput = `Error: ${error.message}`;
              results.push({
                input: `"${input[0]}"`,
                expectedOutput,
                actualOutput,
                passed: actualOutput === expectedOutput
              });
            }
          }
          return results;
        }
      },
      // Task 6: Safe array access
      {
        description: 'Create a function that takes an array and index, returns the element or throws "Index out of bounds" if index is invalid',
        testCases: [
          { input: [[1, 2, 3], 1], expectedOutput: '2' },
          { input: [[1, 2, 3], 5], expectedOutput: 'Error: Index out of bounds' },
          { input: [[1, 2, 3], -1], expectedOutput: 'Error: Index out of bounds' },
          { input: [['a', 'b'], 0], expectedOutput: 'a' },
          { input: [[], 0], expectedOutput: 'Error: Index out of bounds' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2, 3], 1], expectedOutput: '2' },
            { input: [[1, 2, 3], 5], expectedOutput: 'Error: Index out of bounds' },
            { input: [[1, 2, 3], -1], expectedOutput: 'Error: Index out of bounds' },
            { input: [['a', 'b'], 0], expectedOutput: 'a' },
            { input: [[], 0], expectedOutput: 'Error: Index out of bounds' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', 'index', `${code}\nreturn safeGet(arr, index);`);
              const result = String(func([...input[0]], input[1]));
              results.push({
                input: `[${input[0]}], ${input[1]}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              const actualOutput = `Error: ${error.message}`;
              results.push({
                input: `[${input[0]}], ${input[1]}`,
                expectedOutput,
                actualOutput,
                passed: actualOutput === expectedOutput
              });
            }
          }
          return results;
        }
      },
      // Task 7: Proper type detection (handling null)
      {
        description: 'Create a function that takes a value and returns its type, but if the value is null returns "null" (not "object")',
        testCases: [
          { input: [42], expectedOutput: 'number' },
          { input: ['hello'], expectedOutput: 'string' },
          { input: [null], expectedOutput: 'null' },
          { input: [undefined], expectedOutput: 'undefined' },
          { input: [[1, 2]], expectedOutput: 'object' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [42], expectedOutput: 'number' },
            { input: ['hello'], expectedOutput: 'string' },
            { input: [null], expectedOutput: 'null' },
            { input: [undefined], expectedOutput: 'undefined' },
            { input: [[1, 2]], expectedOutput: 'object' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('val', `${code}\nreturn getType(val);`);
              const result = String(func(input[0]));
              results.push({
                input: `${JSON.stringify(input[0])}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${JSON.stringify(input[0])}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 8: Safe square root
      {
        description: 'Create a function that calculates square root, throws "Cannot calculate square root of negative number" for negative inputs',
        testCases: [
          { input: [16], expectedOutput: '4' },
          { input: [0], expectedOutput: '0' },
          { input: [-4], expectedOutput: 'Error: Cannot calculate square root of negative number' },
          { input: [2], expectedOutput: '1.4142135623730951' },
          { input: [1], expectedOutput: '1' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [16], expectedOutput: '4' },
            { input: [0], expectedOutput: '0' },
            { input: [-4], expectedOutput: 'Error: Cannot calculate square root of negative number' },
            { input: [2], expectedOutput: '1.4142135623730951' },
            { input: [1], expectedOutput: '1' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('n', `${code}\nreturn safeSqrt(n);`);
              const result = String(func(input[0]));
              results.push({
                input: `${input[0]}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              const actualOutput = `Error: ${error.message}`;
              results.push({
                input: `${input[0]}`,
                expectedOutput,
                actualOutput,
                passed: actualOutput === expectedOutput
              });
            }
          }
          return results;
        }
      }
    ]
  }
};

export default errorHandlingTopicTests;




