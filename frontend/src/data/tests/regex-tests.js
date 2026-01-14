// Regular Expressions Tests
// Tests for pattern matching

export const regexTopicTests = {
  'regex': {
    title: 'Pattern matching',
    tests: [
      // Task 1: Only digits
      {
        description: 'Create a function that checks if a string contains only digits using regex',
        testCases: [
          { input: ['12345'], expectedOutput: 'true' },
          { input: ['123abc'], expectedOutput: 'false' },
          { input: [''], expectedOutput: 'false' },
          { input: ['0'], expectedOutput: 'true' },
          { input: ['12 34'], expectedOutput: 'false' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['12345'], expectedOutput: 'true' },
            { input: ['123abc'], expectedOutput: 'false' },
            { input: [''], expectedOutput: 'false' },
            { input: ['0'], expectedOutput: 'true' },
            { input: ['12 34'], expectedOutput: 'false' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('str', `
                ${code}
                return String(isOnlyDigits(str));
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
      // Task 2: Count pattern occurrences
      {
        description: 'Create a function that counts how many times a pattern appears in a string (case insensitive)',
        testCases: [
          { input: ['Hello hello HELLO', 'hello'], expectedOutput: '3' },
          { input: ['abcabc', 'abc'], expectedOutput: '2' },
          { input: ['test', 'xyz'], expectedOutput: '0' },
          { input: ['', 'a'], expectedOutput: '0' },
          { input: ['AaAaA', 'a'], expectedOutput: '5' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['Hello hello HELLO', 'hello'], expectedOutput: '3' },
            { input: ['abcabc', 'abc'], expectedOutput: '2' },
            { input: ['test', 'xyz'], expectedOutput: '0' },
            { input: ['', 'a'], expectedOutput: '0' },
            { input: ['AaAaA', 'a'], expectedOutput: '5' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('str', 'pattern', `
                ${code}
                return String(countPattern(str, pattern));
              `);
              const result = func(input[0], input[1]);
              results.push({
                input: `"${input[0]}", "${input[1]}"`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `"${input[0]}", "${input[1]}"`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 3: Replace whitespace with dash
      {
        description: 'Create a function that replaces all whitespace characters with a single dash',
        testCases: [
          { input: ['hello world'], expectedOutput: 'hello-world' },
          { input: ['a  b  c'], expectedOutput: 'a-b-c' },
          { input: ['no spaces'], expectedOutput: 'no-spaces' },
          { input: ['   '], expectedOutput: '-' },
          { input: ['hello'], expectedOutput: 'hello' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['hello world'], expectedOutput: 'hello-world' },
            { input: ['a  b  c'], expectedOutput: 'a-b-c' },
            { input: ['no spaces'], expectedOutput: 'no-spaces' },
            { input: ['   '], expectedOutput: '-' },
            { input: ['hello'], expectedOutput: 'hello' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('str', `
                ${code}
                return replaceWhitespace(str);
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
      // Task 4: Extract all numbers
      {
        description: 'Create a function that extracts all numbers from a string and returns them as an array',
        testCases: [
          { input: ['abc123def456'], expectedOutput: '123,456' },
          { input: ['no numbers'], expectedOutput: '' },
          { input: ['12 34 56'], expectedOutput: '12,34,56' },
          { input: ['a1b2c3'], expectedOutput: '1,2,3' },
          { input: ['100'], expectedOutput: '100' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['abc123def456'], expectedOutput: '123,456' },
            { input: ['no numbers'], expectedOutput: '' },
            { input: ['12 34 56'], expectedOutput: '12,34,56' },
            { input: ['a1b2c3'], expectedOutput: '1,2,3' },
            { input: ['100'], expectedOutput: '100' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('str', `
                ${code}
                return extractNumbers(str).join(',');
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
      // Task 5: Validate email format
      {
        description: 'Create a function that validates if a string is a valid email format (simple: word@word.word)',
        testCases: [
          { input: ['test@example.com'], expectedOutput: 'true' },
          { input: ['invalid'], expectedOutput: 'false' },
          { input: ['no@dot'], expectedOutput: 'false' },
          { input: ['a@b.c'], expectedOutput: 'true' },
          { input: ['@test.com'], expectedOutput: 'false' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['test@example.com'], expectedOutput: 'true' },
            { input: ['invalid'], expectedOutput: 'false' },
            { input: ['no@dot'], expectedOutput: 'false' },
            { input: ['a@b.c'], expectedOutput: 'true' },
            { input: ['@test.com'], expectedOutput: 'false' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('str', `
                ${code}
                return String(isValidEmail(str));
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
      // Task 6: Starts with capital
      {
        description: 'Create a function that checks if a string starts with a capital letter',
        testCases: [
          { input: ['Hello'], expectedOutput: 'true' },
          { input: ['hello'], expectedOutput: 'false' },
          { input: ['123abc'], expectedOutput: 'false' },
          { input: ['A'], expectedOutput: 'true' },
          { input: [''], expectedOutput: 'false' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['Hello'], expectedOutput: 'true' },
            { input: ['hello'], expectedOutput: 'false' },
            { input: ['123abc'], expectedOutput: 'false' },
            { input: ['A'], expectedOutput: 'true' },
            { input: [''], expectedOutput: 'false' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('str', `
                ${code}
                return String(startsWithCapital(str));
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
      // Task 7: Replace vowels
      {
        description: 'Create a function that replaces all vowels with asterisks',
        testCases: [
          { input: ['hello'], expectedOutput: 'h*ll*' },
          { input: ['AEIOU'], expectedOutput: '*****' },
          { input: ['xyz'], expectedOutput: 'xyz' },
          { input: [''], expectedOutput: '' },
          { input: ['aEiOu'], expectedOutput: '*****' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['hello'], expectedOutput: 'h*ll*' },
            { input: ['AEIOU'], expectedOutput: '*****' },
            { input: ['xyz'], expectedOutput: 'xyz' },
            { input: [''], expectedOutput: '' },
            { input: ['aEiOu'], expectedOutput: '*****' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('str', `
                ${code}
                return replaceVowels(str);
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
      // Task 8: Extract capitalized words
      {
        description: 'Create a function that extracts words that start with a capital letter from a string',
        testCases: [
          { input: ['Hello World from JavaScript'], expectedOutput: 'Hello,World,JavaScript' },
          { input: ['no capitals here'], expectedOutput: '' },
          { input: ['One Two Three'], expectedOutput: 'One,Two,Three' },
          { input: ['ABC'], expectedOutput: 'ABC' },
          { input: ['aA bB cC'], expectedOutput: '' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['Hello World from JavaScript'], expectedOutput: 'Hello,World,JavaScript' },
            { input: ['no capitals here'], expectedOutput: '' },
            { input: ['One Two Three'], expectedOutput: 'One,Two,Three' },
            { input: ['ABC'], expectedOutput: 'ABC' },
            { input: ['aA bB cC'], expectedOutput: '' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('str', `
                ${code}
                return extractCapitalizedWords(str).join(',');
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
      }
    ]
  }
};

export default regexTopicTests;




