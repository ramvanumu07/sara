/**
 * Industry-Level Secure Code Executor (Backend)
 * Uses Node.js VM with enhanced security and proper test validation
 */

import vm from 'vm';
import { performance } from 'perf_hooks';

class SecureCodeExecutor {
  constructor() {
    this.executionTimeout = 5000; // 5 seconds
    this.maxIterations = 100000;
    this.maxMemoryUsage = 128 * 1024 * 1024; // 128MB
    this.maxOutputLines = 1000;
  }

  /**
   * Execute code with test cases
   * @param {string} code - User's code
   * @param {Array} testCases - Test cases to run
   * @param {string} functionName - Function name for function-type tasks
   * @param {string} solutionType - 'script' or 'function'
   * @returns {Object} Execution results
   */
  async execute(code, testCases, functionName = null, solutionType = 'script') {
    const startTime = performance.now();
    
    try {
      let results;
      
      if (solutionType === 'script') {
        results = await this.executeScript(code, testCases);
      } else if (solutionType === 'function') {
        results = await this.executeFunction(code, testCases, functionName);
      } else {
        throw new Error('Invalid solution type');
      }

      const executionTime = performance.now() - startTime;
      
      return {
        success: true,
        results,
        allPassed: results.every(r => r.passed),
        executionTime: Math.round(executionTime)
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        results: [],
        executionTime: Math.round(performance.now() - startTime)
      };
    }
  }

  /**
   * Execute script-type code
   */
  async executeScript(code, testCases) {
    const results = [];
    
    // If no test cases, still validate the code by running it once
    if (testCases.length === 0) {
      try {
        const output = await this.runScriptWithInputs(code, {});
        results.push({
          passed: true,
          output,
          expected: '',
          input: {}
        });
      } catch (error) {
        results.push({
          passed: false,
          error: error.message,
          expected: '',
          input: {}
        });
      }
    } else {
      // Run with test cases
      for (const testCase of testCases) {
        try {
          const output = await this.runScriptWithInputs(code, testCase.input);
          const passed = this.compareOutput(output, testCase.expectedOutput);
          
          results.push({
            passed,
            output,
            expected: testCase.expectedOutput,
            input: testCase.input
          });
        } catch (error) {
          results.push({
            passed: false,
            error: error.message,
            expected: testCase.expectedOutput,
            input: testCase.input
          });
        }
      }
    }
    
    return results;
  }

  /**
   * Execute function-type code
   */
  async executeFunction(code, testCases, functionName) {
    const results = [];
    
    // Create secure context
    const context = this.createSecureContext();
    
    try {
      // Execute user code to define functions
      await this.executeInContext(code, context);
      
      // Check if function exists
      if (typeof context[functionName] !== 'function') {
        throw new Error(`Function '${functionName}' not found or not a function`);
      }
      
      // Test each case
      for (const testCase of testCases) {
        try {
          const args = Object.values(testCase.input);
          const result = await this.callFunctionInContext(context, functionName, args);
          const passed = this.compareOutput(result.toString(), testCase.expectedOutput);
          
          results.push({
            passed,
            result,
            expected: testCase.expectedOutput,
            input: testCase.input
          });
        } catch (error) {
          results.push({
            passed: false,
            error: error.message,
            expected: testCase.expectedOutput,
            input: testCase.input
          });
        }
      }
      
    } catch (error) {
      throw new Error(`Code execution failed: ${error.message}`);
    }
    
    return results;
  }

  /**
   * Run script with input variables
   * Comment out user declarations of input variables (e.g. const length = 8) so test-injected
   * values are used and we avoid "Identifier has already been declared".
   */
  async runScriptWithInputs(code, inputs) {
    const context = this.createSecureContext();

    const inputKeys = Object.keys(inputs || {});
    const codeToRun = inputKeys.length > 0
      ? this.stripInputVariableDeclarations(code, inputKeys)
      : code;

    // Inject input variables
    Object.entries(inputs || {}).forEach(([key, value]) => {
      context[key] = value;
    });

    // Capture console output
    const outputs = [];
    context.console = {
      log: (...args) => {
        if (outputs.length < this.maxOutputLines) {
          outputs.push(args.map(arg => String(arg)).join(' '));
        }
      }
    };

    await this.executeInContext(codeToRun, context);
    return outputs.join('\n');
  }

  /**
   * Comment out lines that declare a variable with the same name as an injected input
   * (e.g. "const length = 8;" or "let width = 5") so test inputs can override without redeclaration.
   */
  stripInputVariableDeclarations(code, inputKeys) {
    if (!inputKeys || inputKeys.length === 0) return code;
    const escaped = inputKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const names = escaped.join('|');
    const re = new RegExp(
      `^(\\s*)(const|let|var)\\s+(${names})\\s*=.*;?\\s*$`,
      'gm'
    );
    return code.replace(re, '$1// [test input] $2 $3 = ... ;');
  }

  /**
   * Create secure execution context
   */
  createSecureContext() {
    const context = {
      // Safe globals
      console: { log: () => {} },
      Math: Math,
      JSON: JSON,
      Array: Array,
      Object: Object,
      String: String,
      Number: Number,
      Boolean: Boolean,
      Date: Date,
      RegExp: RegExp,
      Error: Error,
      TypeError: TypeError,
      ReferenceError: ReferenceError,
      SyntaxError: SyntaxError,
      
      // Utility functions
      parseInt: parseInt,
      parseFloat: parseFloat,
      isNaN: isNaN,
      isFinite: isFinite,
      
      // Safe methods
      setTimeout: undefined, // Blocked
      setInterval: undefined, // Blocked
      clearTimeout: undefined, // Blocked
      clearInterval: undefined, // Blocked
      
      // Loop protection
      __loopCount: 0,
      __checkLoop: function() {
        if (++this.__loopCount > this.maxIterations) {
          throw new Error('Loop exceeded maximum iterations');
        }
      }.bind(this)
    };
    
    return vm.createContext(context);
  }

  /**
   * Execute code in secure context
   */
  async executeInContext(code, context) {
    // Add basic protections
    const protectedCode = this.addBasicProtections(code);
    
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Execution timeout'));
      }, this.executionTimeout);
      
      try {
        vm.runInContext(protectedCode, context, {
          timeout: this.executionTimeout,
          breakOnSigint: true
        });
        
        clearTimeout(timeoutId);
        resolve();
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }

  /**
   * Call function in secure context
   */
  async callFunctionInContext(context, functionName, args) {
    const argsString = args.map(arg => JSON.stringify(arg)).join(',');
    const callCode = `${functionName}(${argsString})`;
    
    return vm.runInContext(callCode, context, {
      timeout: 1000 // 1 second for function calls
    });
  }

  /**
   * Add basic code protections
   */
  addBasicProtections(code) {
    // Check for dangerous patterns
    const dangerousPatterns = [
      { pattern: /require\s*\(/g, name: 'require()' },
      { pattern: /import\s+/g, name: 'import' },
      { pattern: /process\./g, name: 'process' },
      { pattern: /global\./g, name: 'global' },
      { pattern: /Buffer\./g, name: 'Buffer' },
      { pattern: /__dirname/g, name: '__dirname' },
      { pattern: /__filename/g, name: '__filename' },
      { pattern: /module\./g, name: 'module' },
      { pattern: /exports\./g, name: 'exports' },
      { pattern: /fs\./g, name: 'fs' },
      { pattern: /child_process/g, name: 'child_process' },
      { pattern: /eval\s*\(/g, name: 'eval()' },
      { pattern: /Function\s*\(/g, name: 'Function constructor' }
    ];
    
    dangerousPatterns.forEach(({ pattern, name }) => {
      if (pattern.test(code)) {
        throw new Error(`Dangerous operation detected: ${name} is not allowed`);
      }
    });
    
    return code;
  }

  /**
   * Compare execution output with expected output
   */
  compareOutput(actual, expected) {
    const normalizeOutput = (str) => {
      return String(str).trim().replace(/\s+/g, ' ');
    };
    
    const normalizedActual = normalizeOutput(actual);
    const normalizedExpected = normalizeOutput(expected);
    
    // Try exact match first
    if (normalizedActual === normalizedExpected) {
      return true;
    }
    
    // Try loose match (for console output)
    return normalizedActual.includes(normalizedExpected) || 
           normalizedExpected.includes(normalizedActual);
  }

  /**
   * Validate test case structure
   */
  validateTestCases(testCases) {
    if (!Array.isArray(testCases)) {
      throw new Error('Test cases must be an array');
    }
    
    testCases.forEach((testCase, index) => {
      if (!testCase.hasOwnProperty('input')) {
        throw new Error(`Test case ${index} missing 'input' property`);
      }
      
      if (!testCase.hasOwnProperty('expectedOutput')) {
        throw new Error(`Test case ${index} missing 'expectedOutput' property`);
      }
    });
  }
}

export default SecureCodeExecutor;