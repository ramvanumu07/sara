// Date and Time Tests
// Tests for working with dates

export const dateTimeTopicTests = {
  'date-time': {
    title: 'Working with dates',
    tests: [
      // Task 1: Format date as YYYY-MM-DD
      {
        description: 'Create a function that takes year, month (1-12), day and returns formatted as "YYYY-MM-DD"',
        testCases: [
          { input: [2024, 1, 15], expectedOutput: '2024-01-15' },
          { input: [2023, 12, 25], expectedOutput: '2023-12-25' },
          { input: [2000, 6, 1], expectedOutput: '2000-06-01' },
          { input: [1999, 10, 31], expectedOutput: '1999-10-31' },
          { input: [2024, 2, 29], expectedOutput: '2024-02-29' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [2024, 1, 15], expectedOutput: '2024-01-15' },
            { input: [2023, 12, 25], expectedOutput: '2023-12-25' },
            { input: [2000, 6, 1], expectedOutput: '2000-06-01' },
            { input: [1999, 10, 31], expectedOutput: '1999-10-31' },
            { input: [2024, 2, 29], expectedOutput: '2024-02-29' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('year', 'month', 'day', `
                ${code}
                return formatDate(year, month, day);
              `);
              const result = func(input[0], input[1], input[2]);
              results.push({
                input: `${input[0]}, ${input[1]}, ${input[2]}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${input[0]}, ${input[1]}, ${input[2]}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 2: Get day of week
      {
        description: 'Create a function that takes a date string and returns the day of the week (Sunday, Monday, etc.)',
        testCases: [
          { input: ['2024-01-01'], expectedOutput: 'Monday' },
          { input: ['2024-01-07'], expectedOutput: 'Sunday' },
          { input: ['2024-12-25'], expectedOutput: 'Wednesday' },
          { input: ['2000-01-01'], expectedOutput: 'Saturday' },
          { input: ['2024-07-04'], expectedOutput: 'Thursday' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['2024-01-01'], expectedOutput: 'Monday' },
            { input: ['2024-01-07'], expectedOutput: 'Sunday' },
            { input: ['2024-12-25'], expectedOutput: 'Wednesday' },
            { input: ['2000-01-01'], expectedOutput: 'Saturday' },
            { input: ['2024-07-04'], expectedOutput: 'Thursday' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('dateStr', `
                ${code}
                return getDayOfWeek(dateStr);
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
      // Task 3: Days between dates
      {
        description: 'Create a function that calculates the number of days between two date strings',
        testCases: [
          { input: ['2024-01-01', '2024-01-10'], expectedOutput: '9' },
          { input: ['2024-01-01', '2024-01-01'], expectedOutput: '0' },
          { input: ['2024-01-01', '2024-02-01'], expectedOutput: '31' },
          { input: ['2024-01-10', '2024-01-01'], expectedOutput: '9' },
          { input: ['2023-12-25', '2024-01-01'], expectedOutput: '7' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['2024-01-01', '2024-01-10'], expectedOutput: '9' },
            { input: ['2024-01-01', '2024-01-01'], expectedOutput: '0' },
            { input: ['2024-01-01', '2024-02-01'], expectedOutput: '31' },
            { input: ['2024-01-10', '2024-01-01'], expectedOutput: '9' },
            { input: ['2023-12-25', '2024-01-01'], expectedOutput: '7' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('date1', 'date2', `
                ${code}
                return String(daysBetween(date1, date2));
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
      // Task 4: Add days to date
      {
        description: 'Create a function that adds a given number of days to a date string and returns the new date as "YYYY-MM-DD"',
        testCases: [
          { input: ['2024-01-01', 10], expectedOutput: '2024-01-11' },
          { input: ['2024-01-31', 1], expectedOutput: '2024-02-01' },
          { input: ['2024-12-31', 1], expectedOutput: '2025-01-01' },
          { input: ['2024-02-28', 1], expectedOutput: '2024-02-29' },
          { input: ['2024-01-15', 0], expectedOutput: '2024-01-15' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['2024-01-01', 10], expectedOutput: '2024-01-11' },
            { input: ['2024-01-31', 1], expectedOutput: '2024-02-01' },
            { input: ['2024-12-31', 1], expectedOutput: '2025-01-01' },
            { input: ['2024-02-28', 1], expectedOutput: '2024-02-29' },
            { input: ['2024-01-15', 0], expectedOutput: '2024-01-15' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('dateStr', 'days', `
                ${code}
                return addDays(dateStr, days);
              `);
              const result = func(input[0], input[1]);
              results.push({
                input: `"${input[0]}", ${input[1]}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `"${input[0]}", ${input[1]}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 5: Leap year check
      {
        description: 'Create a function that checks if a given year is a leap year',
        testCases: [
          { input: [2024], expectedOutput: 'true' },
          { input: [2023], expectedOutput: 'false' },
          { input: [2000], expectedOutput: 'true' },
          { input: [1900], expectedOutput: 'false' },
          { input: [2020], expectedOutput: 'true' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [2024], expectedOutput: 'true' },
            { input: [2023], expectedOutput: 'false' },
            { input: [2000], expectedOutput: 'true' },
            { input: [1900], expectedOutput: 'false' },
            { input: [2020], expectedOutput: 'true' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('year', `
                ${code}
                return String(isLeapYear(year));
              `);
              const result = func(input[0]);
              results.push({
                input: `${input[0]}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${input[0]}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 6: Days in month
      {
        description: 'Create a function that returns the number of days in a given month (1-12) and year',
        testCases: [
          { input: [2024, 2], expectedOutput: '29' },
          { input: [2023, 2], expectedOutput: '28' },
          { input: [2024, 1], expectedOutput: '31' },
          { input: [2024, 4], expectedOutput: '30' },
          { input: [2024, 12], expectedOutput: '31' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [2024, 2], expectedOutput: '29' },
            { input: [2023, 2], expectedOutput: '28' },
            { input: [2024, 1], expectedOutput: '31' },
            { input: [2024, 4], expectedOutput: '30' },
            { input: [2024, 12], expectedOutput: '31' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('year', 'month', `
                ${code}
                return String(daysInMonth(year, month));
              `);
              const result = func(input[0], input[1]);
              results.push({
                input: `${input[0]}, ${input[1]}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `${input[0]}, ${input[1]}`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 7: Earlier date
      {
        description: 'Create a function that takes two date strings and returns which one is earlier (return the earlier date string)',
        testCases: [
          { input: ['2024-01-15', '2024-01-10'], expectedOutput: '2024-01-10' },
          { input: ['2023-06-01', '2024-01-01'], expectedOutput: '2023-06-01' },
          { input: ['2024-12-31', '2024-01-01'], expectedOutput: '2024-01-01' },
          { input: ['2020-01-01', '2020-01-01'], expectedOutput: '2020-01-01' },
          { input: ['1999-12-31', '2000-01-01'], expectedOutput: '1999-12-31' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['2024-01-15', '2024-01-10'], expectedOutput: '2024-01-10' },
            { input: ['2023-06-01', '2024-01-01'], expectedOutput: '2023-06-01' },
            { input: ['2024-12-31', '2024-01-01'], expectedOutput: '2024-01-01' },
            { input: ['2020-01-01', '2020-01-01'], expectedOutput: '2020-01-01' },
            { input: ['1999-12-31', '2000-01-01'], expectedOutput: '1999-12-31' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('date1', 'date2', `
                ${code}
                return getEarlierDate(date1, date2);
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
      // Task 8: Extract date parts
      {
        description: 'Create a function that extracts year, month, and day from a date string and returns as "Day: X, Month: Y, Year: Z"',
        testCases: [
          { input: ['2024-03-15'], expectedOutput: 'Day: 15, Month: 3, Year: 2024' },
          { input: ['2000-01-01'], expectedOutput: 'Day: 1, Month: 1, Year: 2000' },
          { input: ['1999-12-31'], expectedOutput: 'Day: 31, Month: 12, Year: 1999' },
          { input: ['2024-07-04'], expectedOutput: 'Day: 4, Month: 7, Year: 2024' },
          { input: ['2024-11-28'], expectedOutput: 'Day: 28, Month: 11, Year: 2024' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['2024-03-15'], expectedOutput: 'Day: 15, Month: 3, Year: 2024' },
            { input: ['2000-01-01'], expectedOutput: 'Day: 1, Month: 1, Year: 2000' },
            { input: ['1999-12-31'], expectedOutput: 'Day: 31, Month: 12, Year: 1999' },
            { input: ['2024-07-04'], expectedOutput: 'Day: 4, Month: 7, Year: 2024' },
            { input: ['2024-11-28'], expectedOutput: 'Day: 28, Month: 11, Year: 2024' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('dateStr', `
                ${code}
                return extractDateParts(dateStr);
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

export default dateTimeTopicTests;




