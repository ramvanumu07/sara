// Map and Set Tests
// Tests for specialized collections

export const mapSetTopicTests = {
  'map-set': {
    title: 'Specialized collections',
    tests: [
      // Task 1: Count occurrences with Map
      {
        description: 'Create a function that counts how many times each element appears in an array using a Map',
        testCases: [
          { input: [['a', 'b', 'a', 'c', 'b', 'a']], expectedOutput: 'a:3,b:2,c:1' },
          { input: [['x']], expectedOutput: 'x:1' },
          { input: [[1, 1, 1]], expectedOutput: '1:3' },
          { input: [['a', 'b', 'c']], expectedOutput: 'a:1,b:1,c:1' },
          { input: [[]], expectedOutput: '' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [['a', 'b', 'a', 'c', 'b', 'a']], expectedOutput: 'a:3,b:2,c:1' },
            { input: [['x']], expectedOutput: 'x:1' },
            { input: [[1, 1, 1]], expectedOutput: '1:3' },
            { input: [['a', 'b', 'c']], expectedOutput: 'a:1,b:1,c:1' },
            { input: [[]], expectedOutput: '' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', `
                ${code}
                const result = countOccurrences(arr);
                return [...result].map(([k, v]) => k + ':' + v).join(',');
              `);
              const result = func([...input[0]]);
              results.push({
                input: `[${input[0].map(x => typeof x === 'string' ? `"${x}"` : x).join(', ')}]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `[${input[0].map(x => typeof x === 'string' ? `"${x}"` : x).join(', ')}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 2: Remove duplicates with Set
      {
        description: 'Create a function that removes all duplicate values from an array using a Set',
        testCases: [
          { input: [[1, 2, 2, 3, 3, 3]], expectedOutput: '1,2,3' },
          { input: [[1, 1, 1]], expectedOutput: '1' },
          { input: [[1, 2, 3]], expectedOutput: '1,2,3' },
          { input: [[]], expectedOutput: '' },
          { input: [['a', 'b', 'a']], expectedOutput: 'a,b' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2, 2, 3, 3, 3]], expectedOutput: '1,2,3' },
            { input: [[1, 1, 1]], expectedOutput: '1' },
            { input: [[1, 2, 3]], expectedOutput: '1,2,3' },
            { input: [[]], expectedOutput: '' },
            { input: [['a', 'b', 'a']], expectedOutput: 'a,b' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', `
                ${code}
                return removeDuplicates(arr).join(',');
              `);
              const result = func([...input[0]]);
              results.push({
                input: `[${input[0]}]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `[${input[0]}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 3: Check common elements
      {
        description: 'Create a function that checks if two arrays have any common elements using a Set',
        testCases: [
          { input: [[1, 2, 3], [3, 4, 5]], expectedOutput: 'true' },
          { input: [[1, 2], [3, 4]], expectedOutput: 'false' },
          { input: [[], [1, 2]], expectedOutput: 'false' },
          { input: [[1], [1]], expectedOutput: 'true' },
          { input: [['a', 'b'], ['b', 'c']], expectedOutput: 'true' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2, 3], [3, 4, 5]], expectedOutput: 'true' },
            { input: [[1, 2], [3, 4]], expectedOutput: 'false' },
            { input: [[], [1, 2]], expectedOutput: 'false' },
            { input: [[1], [1]], expectedOutput: 'true' },
            { input: [['a', 'b'], ['b', 'c']], expectedOutput: 'true' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr1', 'arr2', `
                ${code}
                return String(hasCommonElements(arr1, arr2));
              `);
              const result = func([...input[0]], [...input[1]]);
              results.push({
                input: `[${input[0]}], [${input[1]}]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `[${input[0]}], [${input[1]}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 4: Intersection
      {
        description: 'Create a function that finds the intersection of two arrays (elements in both) using Sets',
        testCases: [
          { input: [[1, 2, 3, 4], [3, 4, 5, 6]], expectedOutput: '3,4' },
          { input: [[1, 2], [3, 4]], expectedOutput: '' },
          { input: [[1, 1, 2], [2, 2, 3]], expectedOutput: '2' },
          { input: [[], [1, 2]], expectedOutput: '' },
          { input: [[5], [5]], expectedOutput: '5' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2, 3, 4], [3, 4, 5, 6]], expectedOutput: '3,4' },
            { input: [[1, 2], [3, 4]], expectedOutput: '' },
            { input: [[1, 1, 2], [2, 2, 3]], expectedOutput: '2' },
            { input: [[], [1, 2]], expectedOutput: '' },
            { input: [[5], [5]], expectedOutput: '5' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr1', 'arr2', `
                ${code}
                return intersection(arr1, arr2).join(',');
              `);
              const result = func([...input[0]], [...input[1]]);
              results.push({
                input: `[${input[0]}], [${input[1]}]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `[${input[0]}], [${input[1]}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 5: Union
      {
        description: 'Create a function that finds the union of two arrays (all unique elements from both) using Sets',
        testCases: [
          { input: [[1, 2, 3], [3, 4, 5]], expectedOutput: '1,2,3,4,5' },
          { input: [[1, 1], [2, 2]], expectedOutput: '1,2' },
          { input: [[], [1, 2]], expectedOutput: '1,2' },
          { input: [[1, 2], []], expectedOutput: '1,2' },
          { input: [['a'], ['b']], expectedOutput: 'a,b' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2, 3], [3, 4, 5]], expectedOutput: '1,2,3,4,5' },
            { input: [[1, 1], [2, 2]], expectedOutput: '1,2' },
            { input: [[], [1, 2]], expectedOutput: '1,2' },
            { input: [[1, 2], []], expectedOutput: '1,2' },
            { input: [['a'], ['b']], expectedOutput: 'a,b' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr1', 'arr2', `
                ${code}
                return union(arr1, arr2).join(',');
              `);
              const result = func([...input[0]], [...input[1]]);
              results.push({
                input: `[${input[0]}], [${input[1]}]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `[${input[0]}], [${input[1]}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 6: Group by property
      {
        description: 'Create a function that groups an array of objects by a property value using a Map',
        testCases: [
          { input: [[{ type: 'a', val: 1 }, { type: 'b', val: 2 }, { type: 'a', val: 3 }], 'type'], expectedOutput: 'a:2,b:1' },
          { input: [[{ cat: 'x', n: 1 }], 'cat'], expectedOutput: 'x:1' },
          { input: [[], 'type'], expectedOutput: '' },
          { input: [[{ g: 1 }, { g: 1 }, { g: 2 }], 'g'], expectedOutput: '1:2,2:1' },
          { input: [[{ k: 'a' }, { k: 'a' }, { k: 'a' }], 'k'], expectedOutput: 'a:3' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[{ type: 'a', val: 1 }, { type: 'b', val: 2 }, { type: 'a', val: 3 }], 'type'], expectedOutput: 'a:2,b:1' },
            { input: [[{ cat: 'x', n: 1 }], 'cat'], expectedOutput: 'x:1' },
            { input: [[], 'type'], expectedOutput: '' },
            { input: [[{ g: 1 }, { g: 1 }, { g: 2 }], 'g'], expectedOutput: '1:2,2:1' },
            { input: [[{ k: 'a' }, { k: 'a' }, { k: 'a' }], 'k'], expectedOutput: 'a:3' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', 'prop', `
                ${code}
                const result = groupBy(arr, prop);
                return [...result].map(([k, v]) => k + ':' + v.length).join(',');
              `);
              const result = func(JSON.parse(JSON.stringify(input[0])), input[1]);
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
      // Task 7: First duplicate
      {
        description: 'Create a function that returns the first duplicate value in an array using a Set, or null if none',
        testCases: [
          { input: [[1, 2, 3, 2, 4]], expectedOutput: '2' },
          { input: [[1, 2, 3]], expectedOutput: 'null' },
          { input: [[5, 5]], expectedOutput: '5' },
          { input: [[]], expectedOutput: 'null' },
          { input: [['a', 'b', 'c', 'a']], expectedOutput: 'a' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[1, 2, 3, 2, 4]], expectedOutput: '2' },
            { input: [[1, 2, 3]], expectedOutput: 'null' },
            { input: [[5, 5]], expectedOutput: '5' },
            { input: [[]], expectedOutput: 'null' },
            { input: [['a', 'b', 'c', 'a']], expectedOutput: 'a' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('arr', `
                ${code}
                return String(firstDuplicate(arr));
              `);
              const result = func([...input[0]]);
              results.push({
                input: `[${input[0]}]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `[${input[0]}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 8: Map to sorted array
      {
        description: 'Create a function that converts a Map to an array of [key, value] pairs sorted by key',
        testCases: [
          { input: [[['c', 3], ['a', 1], ['b', 2]]], expectedOutput: 'a:1,b:2,c:3' },
          { input: [[['z', 1]]], expectedOutput: 'z:1' },
          { input: [[]], expectedOutput: '' },
          { input: [[['b', 2], ['a', 1]]], expectedOutput: 'a:1,b:2' },
          { input: [[['x', 10], ['y', 20], ['w', 5]]], expectedOutput: 'w:5,x:10,y:20' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[['c', 3], ['a', 1], ['b', 2]]], expectedOutput: 'a:1,b:2,c:3' },
            { input: [[['z', 1]]], expectedOutput: 'z:1' },
            { input: [[]], expectedOutput: '' },
            { input: [[['b', 2], ['a', 1]]], expectedOutput: 'a:1,b:2' },
            { input: [[['x', 10], ['y', 20], ['w', 5]]], expectedOutput: 'w:5,x:10,y:20' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('entries', `
                ${code}
                const map = new Map(entries);
                return mapToSortedArray(map).map(([k, v]) => k + ':' + v).join(',');
              `);
              const result = func([...input[0]]);
              results.push({
                input: `Map from ${JSON.stringify(input[0])}`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `Map from ${JSON.stringify(input[0])}`,
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

export default mapSetTopicTests;




