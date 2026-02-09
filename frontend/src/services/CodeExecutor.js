/**
 * Industry-Level Code Execution Service
 * Manages secure code execution using Web Workers and backend validation
 */

class CodeExecutionService {
  constructor() {
    this.worker = null;
    this.pendingExecutions = new Map();
    this.executionTimeout = 10000; // 10 seconds total timeout
  }

  /**
   * Execute code with test cases
   * @param {string} code - User's code
   * @param {Array} testCases - Test cases to run
   * @param {string} functionName - Function name for function-type tasks
   * @param {string} solutionType - 'script' or 'function'
   * @returns {Promise} Execution results
   */
  async executeCode(code, testCases, functionName = null, solutionType = 'script') {
    return new Promise((resolve, reject) => {
      const taskId = this.generateTaskId();
      const timeoutId = setTimeout(() => {
        this.cleanup(taskId);
        reject(new Error('Code execution timeout'));
      }, this.executionTimeout);

      // Store pending execution
      this.pendingExecutions.set(taskId, {
        resolve,
        reject,
        timeoutId
      });

      try {
        // Create new worker for each execution (isolation)
        this.worker = new Worker('/code-executor-worker.js');
        
        this.worker.onmessage = (event) => {
          this.handleWorkerMessage(event.data);
        };

        this.worker.onerror = (error) => {
          this.handleWorkerError(taskId, error);
        };

        // Send execution request
        this.worker.postMessage({
          taskId,
          code,
          testCases,
          functionName,
          solutionType
        });

      } catch (error) {
        this.cleanup(taskId);
        reject(error);
      }
    });
  }

  /**
   * Execute code for quick testing (frontend only)
   */
  async executeForTesting(code, testCases, functionName, solutionType) {
    try {
      const result = await this.executeCode(code, testCases, functionName, solutionType);
      return {
        success: true,
        results: result.results,
        allPassed: result.allPassed,
        executionTime: result.executionTime || 0
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  }

  /**
   * Execute and validate code (frontend + backend validation)
   */
  async executeAndValidate(code, testCases, functionName, solutionType, topicId, assignmentIndex) {
    try {
      // First, run on frontend for immediate feedback
      const frontendResult = await this.executeCode(code, testCases, functionName, solutionType);
      
      if (!frontendResult.success) {
        return frontendResult;
      }

      // If frontend passes, validate on backend for security
      const backendResult = await this.validateOnBackend(code, testCases, functionName, solutionType, topicId, assignmentIndex);
      
      return {
        ...frontendResult,
        backendValidated: backendResult.success,
        backendError: backendResult.error
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  }

  /**
   * Validate code execution on backend
   */
  async validateOnBackend(code, testCases, functionName, solutionType, topicId, assignmentIndex) {
    try {
      const response = await fetch('/api/learn/execute-secure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          code,
          testCases,
          functionName,
          solutionType,
          topicId,
          assignmentIndex
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: `Backend validation failed: ${error.message}`
      };
    }
  }

  /**
   * Handle worker message
   */
  handleWorkerMessage(data) {
    const { taskId } = data;
    const execution = this.pendingExecutions.get(taskId);
    
    if (execution) {
      clearTimeout(execution.timeoutId);
      this.pendingExecutions.delete(taskId);
      
      if (data.success) {
        execution.resolve(data);
      } else {
        execution.reject(new Error(data.error || 'Code execution failed'));
      }
      
      this.cleanup(taskId);
    }
  }

  /**
   * Handle worker error
   */
  handleWorkerError(taskId, error) {
    const execution = this.pendingExecutions.get(taskId);
    
    if (execution) {
      clearTimeout(execution.timeoutId);
      this.pendingExecutions.delete(taskId);
      execution.reject(new Error(`Worker error: ${error.message}`));
      this.cleanup(taskId);
    }
  }

  /**
   * Cleanup worker and resources
   */
  cleanup(taskId) {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    
    const execution = this.pendingExecutions.get(taskId);
    if (execution) {
      clearTimeout(execution.timeoutId);
      this.pendingExecutions.delete(taskId);
    }
  }

  /**
   * Generate unique task ID
   */
  generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup all pending executions
   */
  destroy() {
    this.pendingExecutions.forEach(execution => {
      clearTimeout(execution.timeoutId);
      execution.reject(new Error('Service destroyed'));
    });
    
    this.pendingExecutions.clear();
    
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// Export singleton instance
export default new CodeExecutionService();