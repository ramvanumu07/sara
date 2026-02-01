// Classes and OOP Tests
// Tests for object-oriented programming concepts

export const classesTopicTests = {
  'classes': {
    title: 'Object-oriented programming',
    tests: [
      // Task 1: Rectangle class
      {
        description: 'Create a Rectangle class with width and height properties, and a method that returns the area',
        testCases: [
          { input: [5, 3], expectedOutput: '15' },
          { input: [10, 10], expectedOutput: '100' },
          { input: [1, 1], expectedOutput: '1' },
          { input: [7, 4], expectedOutput: '28' },
          { input: [0, 5], expectedOutput: '0' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [5, 3], expectedOutput: '15' },
            { input: [10, 10], expectedOutput: '100' },
            { input: [1, 1], expectedOutput: '1' },
            { input: [7, 4], expectedOutput: '28' },
            { input: [0, 5], expectedOutput: '0' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('w', 'h', `
                ${code}
                const rect = new Rectangle(w, h);
                return rect.getArea();
              `);
              const result = String(func(input[0], input[1]));
              results.push({
                input: `new Rectangle(${input[0]}, ${input[1]}).getArea()`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `new Rectangle(${input[0]}, ${input[1]}).getArea()`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 2: Counter class
      {
        description: 'Create a Counter class with increment, decrement, and getValue methods. Start at 0',
        testCases: [
          { input: [['increment', 'increment', 'getValue']], expectedOutput: '2' },
          { input: [['decrement', 'getValue']], expectedOutput: '-1' },
          { input: [['getValue']], expectedOutput: '0' },
          { input: [['increment', 'decrement', 'increment', 'getValue']], expectedOutput: '1' },
          { input: [['decrement', 'decrement', 'decrement', 'getValue']], expectedOutput: '-3' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [['increment', 'increment', 'getValue']], expectedOutput: '2' },
            { input: [['decrement', 'getValue']], expectedOutput: '-1' },
            { input: [['getValue']], expectedOutput: '0' },
            { input: [['increment', 'decrement', 'increment', 'getValue']], expectedOutput: '1' },
            { input: [['decrement', 'decrement', 'decrement', 'getValue']], expectedOutput: '-3' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('operations', `
                ${code}
                const counter = new Counter();
                let result;
                for (const op of operations) {
                  result = counter[op]();
                }
                return result;
              `);
              const result = String(func([...input[0]]));
              results.push({
                input: `operations: [${input[0].map(s => `"${s}"`).join(', ')}]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `operations: [${input[0].map(s => `"${s}"`).join(', ')}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 3: BankAccount class
      {
        description: 'Create a BankAccount class with deposit, withdraw, and getBalance methods. Withdraw should not allow negative balance',
        testCases: [
          { input: [[['deposit', 100], ['withdraw', 30], ['getBalance']]], expectedOutput: '70' },
          { input: [[['deposit', 50], ['withdraw', 100], ['getBalance']]], expectedOutput: '50' },
          { input: [[['getBalance']]], expectedOutput: '0' },
          { input: [[['deposit', 200], ['deposit', 100], ['getBalance']]], expectedOutput: '300' },
          { input: [[['withdraw', 50], ['getBalance']]], expectedOutput: '0' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[['deposit', 100], ['withdraw', 30], ['getBalance']]], expectedOutput: '70' },
            { input: [[['deposit', 50], ['withdraw', 100], ['getBalance']]], expectedOutput: '50' },
            { input: [[['getBalance']]], expectedOutput: '0' },
            { input: [[['deposit', 200], ['deposit', 100], ['getBalance']]], expectedOutput: '300' },
            { input: [[['withdraw', 50], ['getBalance']]], expectedOutput: '0' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('operations', `
                ${code}
                const account = new BankAccount();
                let result;
                for (const [method, arg] of operations) {
                  if (arg !== undefined) {
                    result = account[method](arg);
                  } else {
                    result = account[method]();
                  }
                }
                return result;
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
      // Task 4: Person class with static counter
      {
        description: 'Create a Person class with name property and a static method that returns how many Person instances have been created',
        testCases: [
          { input: [['Alice']], expectedOutput: '1' },
          { input: [['Alice', 'Bob']], expectedOutput: '2' },
          { input: [['A', 'B', 'C']], expectedOutput: '3' },
          { input: [[]], expectedOutput: '0' },
          { input: [['Single']], expectedOutput: '1' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [['Alice']], expectedOutput: '1' },
            { input: [['Alice', 'Bob']], expectedOutput: '2' },
            { input: [['A', 'B', 'C']], expectedOutput: '3' },
            { input: [[]], expectedOutput: '0' },
            { input: [['Single']], expectedOutput: '1' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              // Each test case needs fresh class definition to reset static count
              const func = new Function('names', `
                ${code}
                // Reset static counter if exists
                if (typeof Person.count !== 'undefined') Person.count = 0;
                if (typeof Person.instanceCount !== 'undefined') Person.instanceCount = 0;
                for (const name of names) {
                  new Person(name);
                }
                return Person.getCount ? Person.getCount() : Person.count || Person.instanceCount || 0;
              `);
              const result = String(func([...input[0]]));
              results.push({
                input: `names: [${input[0].map(s => `"${s}"`).join(', ')}]`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `names: [${input[0].map(s => `"${s}"`).join(', ')}]`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 5: Temperature class with getter
      {
        description: 'Create a Temperature class with celsius property and a getter for fahrenheit (celsius * 9/5 + 32)',
        testCases: [
          { input: [0], expectedOutput: '32' },
          { input: [100], expectedOutput: '212' },
          { input: [-40], expectedOutput: '-40' },
          { input: [25], expectedOutput: '77' },
          { input: [37], expectedOutput: '98.6' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [0], expectedOutput: '32' },
            { input: [100], expectedOutput: '212' },
            { input: [-40], expectedOutput: '-40' },
            { input: [25], expectedOutput: '77' },
            { input: [37], expectedOutput: '98.6' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('celsius', `
                ${code}
                const temp = new Temperature(celsius);
                return temp.fahrenheit;
              `);
              const result = String(func(input[0]));
              results.push({
                input: `new Temperature(${input[0]}).fahrenheit`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `new Temperature(${input[0]}).fahrenheit`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 6: Animal and Dog classes (inheritance)
      {
        description: 'Create an Animal class with name and a speak method. Create a Dog class that extends Animal and overrides speak to return "Woof!"',
        testCases: [
          { input: ['Buddy', 'dog'], expectedOutput: 'Woof!' },
          { input: ['Rex', 'dog'], expectedOutput: 'Woof!' },
          { input: ['Generic', 'animal'], expectedOutput: '...' },
          { input: ['Max', 'dog'], expectedOutput: 'Woof!' },
          { input: ['Pet', 'animal'], expectedOutput: '...' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['Buddy', 'dog'], expectedOutput: 'Woof!' },
            { input: ['Rex', 'dog'], expectedOutput: 'Woof!' },
            { input: ['Generic', 'animal'], expectedOutput: '...' },
            { input: ['Max', 'dog'], expectedOutput: 'Woof!' },
            { input: ['Pet', 'animal'], expectedOutput: '...' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('name', 'type', `
                ${code}
                const creature = type === 'dog' ? new Dog(name) : new Animal(name);
                return creature.speak();
              `);
              const result = func(input[0], input[1]);
              results.push({
                input: `new ${input[1] === 'dog' ? 'Dog' : 'Animal'}("${input[0]}").speak()`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `new ${input[1] === 'dog' ? 'Dog' : 'Animal'}("${input[0]}").speak()`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 7: Shape, Circle, Square classes
      {
        description: 'Create a Shape class with a getArea method returning 0. Create Circle and Square classes that extend Shape with proper area calculations',
        testCases: [
          { input: ['circle', 5], expectedOutput: '78.54' },
          { input: ['square', 4], expectedOutput: '16' },
          { input: ['circle', 1], expectedOutput: '3.14' },
          { input: ['square', 10], expectedOutput: '100' },
          { input: ['circle', 0], expectedOutput: '0' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: ['circle', 5], expectedOutput: '78.54' },
            { input: ['square', 4], expectedOutput: '16' },
            { input: ['circle', 1], expectedOutput: '3.14' },
            { input: ['square', 10], expectedOutput: '100' },
            { input: ['circle', 0], expectedOutput: '0' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('type', 'size', `
                ${code}
                let shape;
                if (type === 'circle') {
                  shape = new Circle(size);
                } else {
                  shape = new Square(size);
                }
                const area = shape.getArea();
                return type === 'circle' ? (Math.round(area * 100) / 100).toFixed(2) : String(area);
              `);
              const result = func(input[0], input[1]);
              results.push({
                input: `new ${input[0] === 'circle' ? 'Circle' : 'Square'}(${input[1]}).getArea()`,
                expectedOutput,
                actualOutput: result,
                passed: result === expectedOutput
              });
            } catch (error) {
              results.push({
                input: `new ${input[0] === 'circle' ? 'Circle' : 'Square'}(${input[1]}).getArea()`,
                expectedOutput,
                actualOutput: `Error: ${error.message}`,
                passed: false
              });
            }
          }
          return results;
        }
      },
      // Task 8: TodoList class
      {
        description: 'Create a TodoList class with add, remove, and getAll methods. Items should be stored in an array',
        testCases: [
          { input: [[['add', 'Task 1'], ['add', 'Task 2'], ['getAll']]], expectedOutput: 'Task 1,Task 2' },
          { input: [[['add', 'A'], ['remove', 'A'], ['getAll']]], expectedOutput: '' },
          { input: [[['getAll']]], expectedOutput: '' },
          { input: [[['add', 'X'], ['add', 'Y'], ['remove', 'X'], ['getAll']]], expectedOutput: 'Y' },
          { input: [[['add', 'One'], ['getAll']]], expectedOutput: 'One' }
        ],
        testFunction: (code) => {
          const results = [];
          const testCases = [
            { input: [[['add', 'Task 1'], ['add', 'Task 2'], ['getAll']]], expectedOutput: 'Task 1,Task 2' },
            { input: [[['add', 'A'], ['remove', 'A'], ['getAll']]], expectedOutput: '' },
            { input: [[['getAll']]], expectedOutput: '' },
            { input: [[['add', 'X'], ['add', 'Y'], ['remove', 'X'], ['getAll']]], expectedOutput: 'Y' },
            { input: [[['add', 'One'], ['getAll']]], expectedOutput: 'One' }
          ];

          for (const { input, expectedOutput } of testCases) {
            try {
              const func = new Function('operations', `
                ${code}
                const todo = new TodoList();
                let result;
                for (const [method, arg] of operations) {
                  if (arg !== undefined) {
                    result = todo[method](arg);
                  } else {
                    result = todo[method]();
                  }
                }
                return Array.isArray(result) ? result.join(',') : result;
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
      }
    ]
  }
};

export default classesTopicTests;




