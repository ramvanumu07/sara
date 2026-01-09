// Math Object Tests
// Tests for built-in Math utilities (pre-functions phase - console.log based)

// Helper function to capture console.log output
function captureConsoleLog(code) {
  const outputs = [];
  const originalLog = console.log;
  console.log = (...args) => outputs.push(args.join(' '));
  
  try {
    const func = new Function(code);
    func();
  } catch (error) {
    console.log = originalLog;
    throw error;
  }
  
  console.log = originalLog;
  return outputs.join('\n');
}

export const mathObjectTopicTests = {
  'math-object': {
    title: 'Built-in math utilities',
    tests: [
      // Task 1: Round, floor, ceil
      {
        description: 'The number is 7.6. Print the result of rounding it normally, rounding down, and rounding up (each on a separate line)',
        testCases: [{ input: null, expectedOutput: '8\n7\n8' }],
        testFunction: (code) => {
          const results = [];
          try {
            const actualOutput = captureConsoleLog(code);
            const expectedOutput = '8\n7\n8';
            results.push({
              input: 'N/A',
              expectedOutput,
              actualOutput,
              passed: actualOutput === expectedOutput
            });
          } catch (error) {
            results.push({
              input: 'N/A',
              expectedOutput: '8\n7\n8',
              actualOutput: `Error: ${error.message}`,
              passed: false
            });
          }
          return results;
        }
      },
      // Task 2: Absolute value
      {
        description: 'The number is -15. Print its absolute value',
        testCases: [{ input: null, expectedOutput: '15' }],
        testFunction: (code) => {
          const results = [];
          try {
            const actualOutput = captureConsoleLog(code);
            const expectedOutput = '15';
            results.push({
              input: 'N/A',
              expectedOutput,
              actualOutput,
              passed: actualOutput === expectedOutput
            });
          } catch (error) {
            results.push({
              input: 'N/A',
              expectedOutput: '15',
              actualOutput: `Error: ${error.message}`,
              passed: false
            });
          }
          return results;
        }
      },
      // Task 3: Power
      {
        description: 'Calculate and print 2 raised to the power of 8',
        testCases: [{ input: null, expectedOutput: '256' }],
        testFunction: (code) => {
          const results = [];
          try {
            const actualOutput = captureConsoleLog(code);
            const expectedOutput = '256';
            results.push({
              input: 'N/A',
              expectedOutput,
              actualOutput,
              passed: actualOutput === expectedOutput
            });
          } catch (error) {
            results.push({
              input: 'N/A',
              expectedOutput: '256',
              actualOutput: `Error: ${error.message}`,
              passed: false
            });
          }
          return results;
        }
      },
      // Task 4: Square root
      {
        description: 'The number is 144. Print its square root',
        testCases: [{ input: null, expectedOutput: '12' }],
        testFunction: (code) => {
          const results = [];
          try {
            const actualOutput = captureConsoleLog(code);
            const expectedOutput = '12';
            results.push({
              input: 'N/A',
              expectedOutput,
              actualOutput,
              passed: actualOutput === expectedOutput
            });
          } catch (error) {
            results.push({
              input: 'N/A',
              expectedOutput: '12',
              actualOutput: `Error: ${error.message}`,
              passed: false
            });
          }
          return results;
        }
      },
      // Task 5: Min and Max
      {
        description: 'Given the numbers 45, 12, 78, 23, 56, print the minimum on the first line and maximum on the second line',
        testCases: [{ input: null, expectedOutput: '12\n78' }],
        testFunction: (code) => {
          const results = [];
          try {
            const actualOutput = captureConsoleLog(code);
            const expectedOutput = '12\n78';
            results.push({
              input: 'N/A',
              expectedOutput,
              actualOutput,
              passed: actualOutput === expectedOutput
            });
          } catch (error) {
            results.push({
              input: 'N/A',
              expectedOutput: '12\n78',
              actualOutput: `Error: ${error.message}`,
              passed: false
            });
          }
          return results;
        }
      },
      // Task 6: Truncate
      {
        description: 'The decimal number is 9.87. Print the result of truncating it (removing decimal without rounding)',
        testCases: [{ input: null, expectedOutput: '9' }],
        testFunction: (code) => {
          const results = [];
          try {
            const actualOutput = captureConsoleLog(code);
            const expectedOutput = '9';
            results.push({
              input: 'N/A',
              expectedOutput,
              actualOutput,
              passed: actualOutput === expectedOutput
            });
          } catch (error) {
            results.push({
              input: 'N/A',
              expectedOutput: '9',
              actualOutput: `Error: ${error.message}`,
              passed: false
            });
          }
          return results;
        }
      },
      // Task 7: Circle area with PI
      {
        description: 'Calculate the area of a circle with radius 7. Use Math.PI. Print the result rounded to 2 decimal places (multiply by 100, round, divide by 100)',
        testCases: [{ input: null, expectedOutput: '153.94' }],
        testFunction: (code) => {
          const results = [];
          try {
            const actualOutput = captureConsoleLog(code);
            const expectedOutput = '153.94';
            results.push({
              input: 'N/A',
              expectedOutput,
              actualOutput,
              passed: actualOutput === expectedOutput
            });
          } catch (error) {
            results.push({
              input: 'N/A',
              expectedOutput: '153.94',
              actualOutput: `Error: ${error.message}`,
              passed: false
            });
          }
          return results;
        }
      },
      // Task 8: PI to 4 decimal places
      {
        description: 'Print the value of Math.PI rounded to 4 decimal places',
        testCases: [{ input: null, expectedOutput: '3.1416' }],
        testFunction: (code) => {
          const results = [];
          try {
            const actualOutput = captureConsoleLog(code);
            const expectedOutput = '3.1416';
            results.push({
              input: 'N/A',
              expectedOutput,
              actualOutput,
              passed: actualOutput === expectedOutput
            });
          } catch (error) {
            results.push({
              input: 'N/A',
              expectedOutput: '3.1416',
              actualOutput: `Error: ${error.message}`,
              passed: false
            });
          }
          return results;
        }
      }
    ]
  }
};

export default mathObjectTopicTests;



