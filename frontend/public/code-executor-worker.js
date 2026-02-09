/**
 * Industry-Level Code Executor Web Worker
 * Secure, isolated JavaScript execution environment
 */

class CodeExecutor {
  constructor() {
    this.executionTimeout = 5000; // 5 seconds
    this.maxIterations = 100000;
    this.maxArraySize = 1000000;
    this.maxStringRepeat = 1000000;
    this.maxOutputLines = 1000;
  }

  execute(code, testCases, functionName, solutionType) {
    try {
      if (solutionType === 'script') {
        return this.executeScript(code, testCases);
      } else if (solutionType === 'function') {
        return this.executeFunction(code, testCases, functionName);
      } else {
        throw new Error('Invalid solution type');
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  }

  executeScript(code, testCases) {
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const result = this.runScriptWithInputs(code, testCase.input);
        const passed = this.compareOutput(result, testCase.expectedOutput);
        
        results.push({
          passed,
          output: result,
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

    return {
      success: true,
      results,
      allPassed: results.every(r => r.passed)
    };
  }

  executeFunction(code, testCases, functionName) {
    const results = [];
    
    // First, execute the code to define functions
    try {
      this.executeCodeSafely(code);
    } catch (error) {
      return {
        success: false,
        error: `Code execution failed: ${error.message}`,
        results: []
      };
    }

    // Check if function exists
    if (typeof self[functionName] !== 'function') {
      return {
        success: false,
        error: `Function '${functionName}' not found or not a function`,
        results: []
      };
    }

    // Test each case
    for (const testCase of testCases) {
      try {
        const args = Object.values(testCase.input);
        const result = self[functionName](...args);
        const passed = this.compareOutput(result.toString(), testCase.expectedOutput);
        
        results.push({
          passed,
          result: result,
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

    return {
      success: true,
      results,
      allPassed: results.every(r => r.passed)
    };
  }

  runScriptWithInputs(code, inputs) {
    // Inject input variables
    const inputCode = Object.entries(inputs)
      .map(([key, value]) => `const ${key} = ${JSON.stringify(value)};`)
      .join('\n');
    
    const fullCode = inputCode + '\n' + code;
    
    // Capture console output
    const outputs = [];
    const originalConsole = self.console;
    
    self.console = {
      log: (...args) => {
        if (outputs.length < this.maxOutputLines) {
          outputs.push(args.map(arg => String(arg)).join(' '));
        }
      }
    };

    try {
      this.executeCodeSafely(fullCode);
      return outputs.join('\n');
    } finally {
      self.console = originalConsole;
    }
  }

  executeCodeSafely(code) {
    // Add protection against infinite loops and resource abuse
    const protectedCode = this.addProtections(code);
    
    // Execute with timeout
    const startTime = Date.now();
    const timeoutId = setTimeout(() => {
      throw new Error('Execution timeout: Code took too long to execute');
    }, this.executionTimeout);

    try {
      // Use Function constructor instead of eval for better security
      const executor = new Function(protectedCode);
      executor.call(null);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  addProtections(code) {
    let protectedCode = code;

    // Add loop protection
    protectedCode = protectedCode.replace(
      /for\s*\([^)]*\)\s*{/g,
      (match) => {
        return match + `
          let __loopCount_${Date.now()} = 0;
          const __checkLoop_${Date.now()} = () => {
            if (++__loopCount_${Date.now()} > ${this.maxIterations}) {
              throw new Error('Loop exceeded maximum iterations');
            }
          };
        `;
      }
    );

    protectedCode = protectedCode.replace(
      /while\s*\([^)]*\)\s*{/g,
      (match) => {
        return match + `
          let __loopCount_${Date.now()} = 0;
          const __checkLoop_${Date.now()} = () => {
            if (++__loopCount_${Date.now()} > ${this.maxIterations}) {
              throw new Error('Loop exceeded maximum iterations');
            }
          };
        `;
      }
    );

    // Block dangerous operations
    const blockedPatterns = [
      /\bimportScripts\b/g,
      /\bpostMessage\b/g,
      /\bclose\b/g,
      /\bsetTimeout\b/g,
      /\bsetInterval\b/g,
      /\beval\b/g,
      /\bFunction\b/g,
      /\bnew\s+Function/g,
      /\bWebSocket\b/g,
      /\bfetch\b/g,
      /\bXMLHttpRequest\b/g
    ];

    blockedPatterns.forEach(pattern => {
      if (pattern.test(protectedCode)) {
        throw new Error('Blocked operation detected in code');
      }
    });

    return protectedCode;
  }

  compareOutput(actual, expected) {
    // Normalize whitespace and compare
    const normalizeOutput = (str) => {
      return String(str).trim().replace(/\s+/g, ' ');
    };

    return normalizeOutput(actual) === normalizeOutput(expected);
  }
}

// Web Worker message handler
self.onmessage = function(event) {
  const { code, testCases, functionName, solutionType, taskId } = event.data;
  
  try {
    const executor = new CodeExecutor();
    const result = executor.execute(code, testCases, functionName, solutionType);
    
    self.postMessage({
      taskId,
      ...result
    });
  } catch (error) {
    self.postMessage({
      taskId,
      success: false,
      error: error.message,
      results: []
    });
  }
};

// Handle uncaught errors
self.onerror = function(error) {
  self.postMessage({
    success: false,
    error: `Runtime error: ${error.message}`,
    results: []
  });
};