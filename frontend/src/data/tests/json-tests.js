// JSON Tests
// Tests for data serialization with JSON

export const jsonTopicTests = {
  'json': {
    title: 'Data serialization',
    tests: [
      // Task 1: Object to JSON string
      {
        description: 'Create a function that converts an object to a JSON string',
        testCases: [
          { input: [{name: 'Alice', age: 25}], expectedOutput: '{"name":"Alice","age":25}' },
          { input: [{x: 1, y: 2}], expectedOutput: '{"x":1,"y":2}' },
          { input: [{}], expectedOutput: '{}' },
          { input: [{active: true}], expectedOutput: '{"active":true}' },
          { input: [{items: [1, 2, 3]}], expectedOutput: '{"items":[1,2,3]}' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [{name: 'Alice', age: 25}], expectedOutput: '{"name":"Alice","age":25}' },
            { input: [{x: 1, y: 2}], expectedOutput: '{"x":1,"y":2}' },
            { input: [{}], expectedOutput: '{}' },
            { input: [{active: true}], expectedOutput: '{"active":true}' },
            { input: [{items: [1, 2, 3]}], expectedOutput: '{"items":[1,2,3]}' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('obj', `
                ${code}
                return toJSON(obj);
              `);
              const result = func(JSON.parse(JSON.stringify(input[0])));
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
      // Task 2: Parse JSON and get key value
      {
        description: 'Create a function that parses a JSON string and returns the value of a specific key',
        testCases: [
          { input: ['{"name":"Bob","age":30}', 'name'], expectedOutput: 'Bob' },
          { input: ['{"x":100,"y":200}', 'y'], expectedOutput: '200' },
          { input: ['{"active":true}', 'active'], expectedOutput: 'true' },
          { input: ['{"data":null}', 'data'], expectedOutput: 'null' },
          { input: ['{"missing":"value"}', 'other'], expectedOutput: 'undefined' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['{"name":"Bob","age":30}', 'name'], expectedOutput: 'Bob' },
            { input: ['{"x":100,"y":200}', 'y'], expectedOutput: '200' },
            { input: ['{"active":true}', 'active'], expectedOutput: 'true' },
            { input: ['{"data":null}', 'data'], expectedOutput: 'null' },
            { input: ['{"missing":"value"}', 'other'], expectedOutput: 'undefined' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('jsonStr', 'key', `
                ${code}
                return String(getValueFromJSON(jsonStr, key));
              `);
              const result = func(input[0], input[1]);
              results.push({
                input: `'${input[0]}', '${input[1]}'`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `'${input[0]}', '${input[1]}'`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 3: Pretty print JSON
      {
        description: 'Create a function that pretty prints an object as JSON with 2-space indentation (return the string)',
        testCases: [
          { input: [{a: 1}], expectedOutput: '{\n  "a": 1\n}' },
          { input: [{x: 1, y: 2}], expectedOutput: '{\n  "x": 1,\n  "y": 2\n}' },
          { input: [{}], expectedOutput: '{}' },
          { input: [{name: "test"}], expectedOutput: '{\n  "name": "test"\n}' },
          { input: [{arr: [1]}], expectedOutput: '{\n  "arr": [\n    1\n  ]\n}' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [{a: 1}], expectedOutput: '{\n  "a": 1\n}' },
            { input: [{x: 1, y: 2}], expectedOutput: '{\n  "x": 1,\n  "y": 2\n}' },
            { input: [{}], expectedOutput: '{}' },
            { input: [{name: "test"}], expectedOutput: '{\n  "name": "test"\n}' },
            { input: [{arr: [1]}], expectedOutput: '{\n  "arr": [\n    1\n  ]\n}' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('obj', `
                ${code}
                return prettyPrintJSON(obj);
              `);
              const result = func(JSON.parse(JSON.stringify(input[0])));
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
      // Task 4: Deep clone with JSON
      {
        description: 'Create a function that deep clones an object using JSON methods',
        testCases: [
          { input: [{a: 1, b: {c: 2}}], expectedOutput: 'true' },
          { input: [{arr: [1, 2, 3]}], expectedOutput: 'true' },
          { input: [{x: {y: {z: 1}}}], expectedOutput: 'true' },
          { input: [{}], expectedOutput: 'true' },
          { input: [{data: [1, {nested: true}]}], expectedOutput: 'true' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [{a: 1, b: {c: 2}}], expectedOutput: 'true' },
            { input: [{arr: [1, 2, 3]}], expectedOutput: 'true' },
            { input: [{x: {y: {z: 1}}}], expectedOutput: 'true' },
            { input: [{}], expectedOutput: 'true' },
            { input: [{data: [1, {nested: true}]}], expectedOutput: 'true' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('obj', `
                ${code}
                const clone = deepClone(obj);
                // Verify it's a true clone (different reference but same content)
                const isDifferentRef = clone !== obj;
                const hasSameContent = JSON.stringify(clone) === JSON.stringify(obj);
                // For nested objects, verify nested refs are different too
                let nestedDiff = true;
                if (obj.b) nestedDiff = clone.b !== obj.b;
                if (obj.arr) nestedDiff = clone.arr !== obj.arr;
                if (obj.x) nestedDiff = clone.x !== obj.x;
                if (obj.data) nestedDiff = clone.data !== obj.data;
                return isDifferentRef && hasSameContent && nestedDiff;
              `);
              const result = String(func(JSON.parse(JSON.stringify(input[0]))));
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
      // Task 5: Count keys in JSON
      {
        description: 'Create a function that converts a JSON string to an object and returns the count of keys',
        testCases: [
          { input: ['{"a":1,"b":2,"c":3}'], expectedOutput: '3' },
          { input: ['{}'], expectedOutput: '0' },
          { input: ['{"single":1}'], expectedOutput: '1' },
          { input: ['{"x":1,"y":2}'], expectedOutput: '2' },
          { input: ['{"a":1,"b":2,"c":3,"d":4,"e":5}'], expectedOutput: '5' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['{"a":1,"b":2,"c":3}'], expectedOutput: '3' },
            { input: ['{}'], expectedOutput: '0' },
            { input: ['{"single":1}'], expectedOutput: '1' },
            { input: ['{"x":1,"y":2}'], expectedOutput: '2' },
            { input: ['{"a":1,"b":2,"c":3,"d":4,"e":5}'], expectedOutput: '5' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('jsonStr', `
                ${code}
                return countKeys(jsonStr);
              `);
              const result = String(func(input[0]));
              results.push({
                input: `'${input[0]}'`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `'${input[0]}'`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 6: Validate JSON
      {
        description: 'Create a function that checks if a string is valid JSON (returns true/false)',
        testCases: [
          { input: ['{"valid":true}'], expectedOutput: 'true' },
          { input: ['not json'], expectedOutput: 'false' },
          { input: ['{"incomplete":'], expectedOutput: 'false' },
          { input: ['[]'], expectedOutput: 'true' },
          { input: ['null'], expectedOutput: 'true' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['{"valid":true}'], expectedOutput: 'true' },
            { input: ['not json'], expectedOutput: 'false' },
            { input: ['{"incomplete":'], expectedOutput: 'false' },
            { input: ['[]'], expectedOutput: 'true' },
            { input: ['null'], expectedOutput: 'true' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('str', `
                ${code}
                return String(isValidJSON(str));
              `);
              const result = func(input[0]);
              results.push({
                input: `'${input[0]}'`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `'${input[0]}'`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 7: Merge JSON strings
      {
        description: 'Create a function that merges two JSON strings into one object and returns as JSON string',
        testCases: [
          { input: ['{"a":1}', '{"b":2}'], expectedOutput: '{"a":1,"b":2}' },
          { input: ['{}', '{"x":1}'], expectedOutput: '{"x":1}' },
          { input: ['{"a":1}', '{"a":2}'], expectedOutput: '{"a":2}' },
          { input: ['{}', '{}'], expectedOutput: '{}' },
          { input: ['{"x":1,"y":2}', '{"z":3}'], expectedOutput: '{"x":1,"y":2,"z":3}' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['{"a":1}', '{"b":2}'], expectedOutput: '{"a":1,"b":2}' },
            { input: ['{}', '{"x":1}'], expectedOutput: '{"x":1}' },
            { input: ['{"a":1}', '{"a":2}'], expectedOutput: '{"a":2}' },
            { input: ['{}', '{}'], expectedOutput: '{}' },
            { input: ['{"x":1,"y":2}', '{"z":3}'], expectedOutput: '{"x":1,"y":2,"z":3}' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('json1', 'json2', `
                ${code}
                return mergeJSON(json1, json2);
              `);
              const result = func(input[0], input[1]);
              results.push({
                input: `'${input[0]}', '${input[1]}'`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `'${input[0]}', '${input[1]}'`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 8: Extract string values
      {
        description: 'Create a function that extracts all string values from a JSON object into an array',
        testCases: [
          { input: ['{"name":"Alice","city":"NYC","age":25}'], expectedOutput: 'Alice,NYC' },
          { input: ['{"a":"x","b":"y","c":"z"}'], expectedOutput: 'x,y,z' },
          { input: ['{"num":123}'], expectedOutput: '' },
          { input: ['{}'], expectedOutput: '' },
          { input: ['{"mixed":"text","number":42,"bool":true}'], expectedOutput: 'text' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['{"name":"Alice","city":"NYC","age":25}'], expectedOutput: 'Alice,NYC' },
            { input: ['{"a":"x","b":"y","c":"z"}'], expectedOutput: 'x,y,z' },
            { input: ['{"num":123}'], expectedOutput: '' },
            { input: ['{}'], expectedOutput: '' },
            { input: ['{"mixed":"text","number":42,"bool":true}'], expectedOutput: 'text' }
          ];
          
          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('jsonStr', `
                ${code}
                return extractStrings(jsonStr).join(',');
              `);
              const result = func(input[0]);
              results.push({
                input: `'${input[0]}'`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `'${input[0]}'`,
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

export default jsonTopicTests;



