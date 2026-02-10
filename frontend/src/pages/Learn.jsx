import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { learning, chat } from '../config/api'
import { ToastContainer } from '../components/Toast'
import { useToast } from '../hooks/useToast'
import EditorToggle from '../components/EditorToggle'
import CodeExecutor from '../services/CodeExecutor'
import './Learn.css'
import './Learn-responsive.css'

// Component to render message content with proper code block formatting
const MessageContent = ({ content, role }) => {
  const renderContent = (text) => {
    // First handle code blocks (```javascript ... ```)
    const codeBlockParts = text.split(/(```[\s\S]*?```)/g)

    return codeBlockParts.map((part, blockIndex) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract language and code
        const lines = part.slice(3, -3).split('\n')
        const language = lines[0].trim()
        const code = lines.slice(1).join('\n').trim()

        return (
          <div key={blockIndex} className="code-block" style={{
            backgroundColor: '#1e1e1e',
            color: '#e2e8f0',
            padding: '12px 16px',
            borderRadius: '8px',
            margin: '8px 0',
            overflow: 'auto',
            fontFamily: 'Monaco, Consolas, monospace',
            fontSize: '0.85rem',
            lineHeight: '1.4',
            border: '1px solid #2d3748'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {language || 'code'}
            </div>
            <div style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              <pre style={{
                margin: 0,
                fontFamily: 'inherit',
                fontSize: 'inherit',
                color: 'inherit',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {code}
              </pre>
            </div>
          </div>
        )
      } else {
        // Handle inline code and regular text
        const inlineCodeParts = part.split(/(`[^`]+`)/g)

        return inlineCodeParts.map((inlinePart, inlineIndex) => {
          if (inlinePart.startsWith('`') && inlinePart.endsWith('`')) {
            const inlineCode = inlinePart.slice(1, -1)
            return (
              <code key={`${blockIndex}-${inlineIndex}`} style={{
                backgroundColor: '#f7fafc',
                color: '#2d3748',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '0.85rem',
                fontFamily: 'Monaco, Consolas, monospace',
                border: '1px solid #e2e8f0'
              }}>
                {inlineCode}
              </code>
            )
          } else {
            return (
              <span key={`${blockIndex}-${inlineIndex}`} style={{ whiteSpace: 'pre-wrap' }}>
                {inlinePart}
              </span>
            )
          }
        })
      }
    })
  }

  return (
    <div className="message-content">
      <span className="message-role">
        {role === 'user' ? 'You' : 'Sara'}
      </span>
      <div className="message-text">
        {renderContent(content)}
      </div>
    </div>
  )
}

const Learn = () => {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // Playtime removed: practice is inline in session via toggle; playtime URL treated as session
  const phaseParam = searchParams.get('phase') || 'session'
  const phase = phaseParam === 'playtime' ? 'session' : phaseParam
  const { toasts, warning, error: showError, success, info } = useToast()

  const [topic, setTopic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Session phase states
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const messagesEndRef = useRef(null)

  // Session: code editor visibility — synced with fixed toggle and localStorage
  const [showEditorInSession, setShowEditorInSession] = useState(() =>
    typeof window !== 'undefined' && localStorage.getItem('sara_editor_toggle') === 'on'
  )

  const [userCode, setUserCode] = useState('')
  const [playgroundOutput, setPlaygroundOutput] = useState('')
  const [playgroundReady, setPlaygroundReady] = useState(false)
  const [editorHeight, setEditorHeight] = useState(60) // 60% editor, 40% terminal (mobile)
  const [editorWidth, setEditorWidth] = useState(60) // 60% editor, 40% terminal (desktop)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768)
  const [isDragging, setIsDragging] = useState(false)

  // Assignment phase states
  const [assignments, setAssignments] = useState([])
  const [currentAssignment, setCurrentAssignment] = useState(0)
  const [assignmentCode, setAssignmentCode] = useState('')
  const [assignmentOutput, setAssignmentOutput] = useState('')
  const [assignmentReview, setAssignmentReview] = useState('')
  const [assignmentComplete, setAssignmentComplete] = useState(false)

  // Feedback phase states

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Load topic and initialize based on phase
  useEffect(() => {
    const loadTopic = async () => {
      try {
        setLoading(true)
        setError(null)

        const topicResponse = await learning.getTopic(topicId)

        // Validate response structure
        if (!topicResponse.data?.success || !topicResponse.data?.data?.topic) {
          throw new Error('Invalid topic response structure')
        }

        const topicData = topicResponse.data.data.topic
        setTopic(topicData)

        // Session complete if progress is playtime (legacy) or assignment
        const progressPhase = topicData?.phase || phase
        if (progressPhase === 'playtime' || progressPhase === 'assignment') {
          setSessionComplete(true)
        }

        if (phase === 'session') {
          // Load chat history
          try {
            const historyResponse = await chat.getHistory(topicId)
            console.log('Chat history response:', historyResponse.data)

            if (historyResponse.data.data.messages && historyResponse.data.data.messages.length > 0) {
              setMessages(historyResponse.data.data.messages)
              // Check if session is complete based on message content
              const lastMessage = historyResponse.data.data.messages[historyResponse.data.data.messages.length - 1]
              if (lastMessage.role === 'assistant' &&
                (lastMessage.content.includes('ready for the playground') ||
                  lastMessage.content.includes('Congratulations! You\'ve mastered') ||
                  lastMessage.content.includes('🏆'))) {
                setSessionComplete(true)
              }
            } else {
              // Start new session
              const startResponse = await learning.sessionChat(topicId, '')
              console.log('Start session response:', startResponse.data)

              if (startResponse.data.data.response) {
                const message = {
                  role: 'assistant',
                  content: startResponse.data.data.response,
                  timestamp: new Date().toISOString()
                }
                setMessages([message])
              }
            }
          } catch (historyError) {
            console.error('Error loading chat history:', historyError)
            // Start new session on error
            try {
              const startResponse = await learning.sessionChat(topicId, '')
              if (startResponse.data.data.response) {
                const message = {
                  role: 'assistant',
                  content: startResponse.data.data.response,
                  timestamp: new Date().toISOString()
                }
                setMessages([message])
              }
            } catch (startError) {
              console.error('Error starting new session:', startError)
              setError('Failed to initialize chat session')
            }
          }
        } else if (phase === 'assignment') {
          // Load assignments from topic data
          const assignments = topicResponse.data.data.topic.tasks || []
          setAssignments(assignments)
          if (assignments.length > 0) {
            // Create assignment code with question in comments
            const assignment = assignments[0]
            const description = assignment.description || 'Complete the assignment below'
            let codeWithComments = description.startsWith('//') ? `${description}\n` : `// ${description}\n`

            if (assignment.requirements && assignment.requirements.length > 0) {
              assignment.requirements.forEach(req => {
                const requirement = req.startsWith('//') ? `${req}\n` : `// ${req}\n`
                codeWithComments += requirement
              })
            }

            codeWithComments += `// START YOUR CODE AFTER THIS LINE. DO NOT REMOVE THIS LINE\n`
            codeWithComments += assignment.starter_code || ''

            setAssignmentCode(codeWithComments)
          }
        }

      } catch (err) {
        console.error('Error loading topic:', err)
        setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load topic')
      } finally {
        setLoading(false)
      }
    }

    if (topicId) {
      loadTopic()
    }
  }, [topicId, phase])

  // Handle sending messages in session phase
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isTyping) return

    const userMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      const response = await learning.sessionChat(topicId, userMessage.content)

      if (response.data.data.response) {
        const message = {
          role: 'assistant',
          content: response.data.data.response,
          timestamp: new Date().toISOString()
        }
        setMessages(prev => [...prev, message])

        // Check if session is complete (using backend flag or text detection)
        if (response.data.data.sessionComplete ||
          response.data.data.response.includes('ready for the playground') ||
          response.data.data.response.includes('Congratulations! You\'ve mastered') ||
          response.data.data.response.includes('🏆')) {
          setSessionComplete(true)
          success('Session completed! Playground unlocked!', 3000)
        }
      }
    } catch (err) {
      console.error('Error sending message:', err)
      showError('Failed to send message. Please check your connection and try again.', 4000)
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // Industry-level secure code execution system
  const handleRunPlayground = async () => {
    const outputDiv = document.getElementById('terminal-output')
    if (!outputDiv) return

    try {
      // Clear previous output
      outputDiv.innerHTML = '<div style="color: #10a37f; font-family: Monaco, Consolas, monospace; padding: 8px;">🔄 Executing code securely...</div>'

      const startTime = Date.now()

      // Execute code using secure Web Worker
      const result = await CodeExecutor.executeForTesting(
        userCode, 
        [], // No test cases for playground
        null, // No function name for playground
        'script' // Always script type for playground
      )

      const executionTime = Date.now() - startTime

      // Process results with enhanced output handling
      let outputText = ''
      let outputColor = '#10a37f'

      if (result.success) {
        if (result.results && result.results.length > 0) {
          // Extract output from results
          const outputs = result.results.map(r => {
            if (r.error) {
              return `Error: ${r.error}`
            }
            return r.output || r.result || ''
          }).filter(output => output !== '')
          
          if (outputs.length > 0) {
            outputText = outputs.join('\n')
          } else {
            outputText = 'Code executed successfully (no output)'
          }
        } else {
          outputText = 'Code executed successfully (no output)'
        }
        
        // Add execution time for longer operations
        if (executionTime > 1000) {
          outputText += `\n✅ Execution completed in ${executionTime}ms`
        } else if (executionTime > 100) {
          outputText += `\n✅ Execution completed in ${executionTime}ms`
        }
      } else {
        outputText = `Error: ${result.error || 'Code execution failed'}`
        outputColor = '#ef4444'
      }

      const outputLines = outputText.split('\n')

      // Update line numbers
      const lineNumbersDiv = outputDiv.parentElement.querySelector('.terminal-line-numbers')
      if (lineNumbersDiv) {
        let lineNumbersHTML = ''
        outputLines.forEach((_, index) => {
          lineNumbersHTML += `<div style="line-height: 1.4; color: #6b7280; text-align: right; padding-right: 8px; font-size: 0.875rem;">${index + 1}</div>`
        })
        lineNumbersDiv.innerHTML = lineNumbersHTML
      }

      // Update output content
      let formattedOutput = ''
      outputLines.forEach((line) => {
        const color = line.includes('Error:') ? '#ef4444' : 
                     line.includes('⚠️') ? '#f59e0b' : 
                     line.includes('✅') ? '#10a37f' : outputColor
        formattedOutput += `<div style="line-height: 1.4; color: ${color}; white-space: pre; padding-left: 2px; font-size: 0.875rem;">${line || ' '}</div>`
      })

      outputDiv.innerHTML = `
        <div style="font-family: Monaco, Consolas, 'SF Mono', 'Courier New', monospace; line-height: 1.4;">
          ${formattedOutput}
        </div>
      `

      // Set output for reference
      setPlaygroundOutput(outputText)

      if (!result.success) {
        showError('Code execution failed. Check the output for details.', 3000)
      }

    } catch (error) {
      console.error('Code execution failed:', error)
      const errorDiv = `<div style="color: #ef4444; font-family: Monaco, Consolas, monospace; padding: 16px;">Error: ${error.message}</div>`
      outputDiv.innerHTML = errorDiv
      showError('Code execution failed. Please check your syntax.', 3000)
    }
  }

  // Handle splitter dragging (mouse)
  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)
    const container = e.currentTarget.parentElement

    if (isDesktop) {
      // Horizontal resizing for desktop
      const startX = e.clientX
      const startWidth = editorWidth
      const containerWidth = container.clientWidth

      const handleMouseMove = (e) => {
        const deltaX = e.clientX - startX
        const deltaPercent = (deltaX / containerWidth) * 100
        const newWidth = Math.min(Math.max(startWidth + deltaPercent, 30), 70)
        setEditorWidth(newWidth)
      }

      const handleMouseUp = () => {
        setIsDragging(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } else {
      // Vertical resizing for mobile
      const startY = e.clientY
      const startHeight = editorHeight
      const containerHeight = container.clientHeight

      const handleMouseMove = (e) => {
        const deltaY = e.clientY - startY
        const deltaPercent = (deltaY / containerHeight) * 100
        const newHeight = Math.min(Math.max(startHeight + deltaPercent, 30), 70)
        setEditorHeight(newHeight)
      }

      const handleMouseUp = () => {
        setIsDragging(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
  }

  // Handle splitter dragging (touch)
  const handleTouchStart = (e) => {
    e.preventDefault()
    setIsDragging(true)
    const touch = e.touches[0]
    const container = e.currentTarget.parentElement

    if (isDesktop) {
      // Horizontal resizing for desktop
      const startX = touch.clientX
      const startWidth = editorWidth
      const containerWidth = container.clientWidth

      const handleTouchMove = (e) => {
        e.preventDefault()
        const touch = e.touches[0]
        const deltaX = touch.clientX - startX
        const deltaPercent = (deltaX / containerWidth) * 100
        const newWidth = Math.min(Math.max(startWidth + deltaPercent, 30), 70)
        setEditorWidth(newWidth)
      }

      const handleTouchEnd = () => {
        setIsDragging(false)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }

      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
    } else {
      // Vertical resizing for mobile
      const startY = touch.clientY
      const startHeight = editorHeight
      const containerHeight = container.clientHeight

      const handleTouchMove = (e) => {
        e.preventDefault()
        const touch = e.touches[0]
        const deltaY = touch.clientY - startY
        const deltaPercent = (deltaY / containerHeight) * 100
        const newHeight = Math.min(Math.max(startHeight + deltaPercent, 30), 70)
        setEditorHeight(newHeight)
      }

      const handleTouchEnd = () => {
        setIsDragging(false)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }

      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
    }
  }

  // Copy code to clipboard (replaces Reset in session editor)
  const handleCopyCode = async () => {
    if (!userCode.trim()) return
    try {
      await navigator.clipboard.writeText(userCode)
      success('Code copied to clipboard.', 1500)
    } catch (e) {
      showError('Copy failed.', 2000)
    }
  }

  // Industry-level secure assignment code execution (uses assignment-only output area)
  const handleRunAssignment = async () => {
    const outputDiv = document.getElementById('assignment-output')
    if (!outputDiv) return

    try {
      // Clear previous output
      outputDiv.innerHTML = '<div style="color: #10a37f; font-family: Monaco, Consolas, monospace; padding: 8px;">🔄 Executing assignment code securely...</div>'

      const startTime = Date.now()

      // Get current assignment details
      const currentTask = assignments[currentAssignment]
      const testCases = currentTask?.testCases || []
      const solutionType = currentTask?.solution_type || 'script'
      const functionName = currentTask?.function_name || null

      // Execute code using secure Web Worker with test cases
      const result = await CodeExecutor.executeForTesting(
        assignmentCode,
        testCases,
        functionName,
        solutionType
      )

      const executionTime = Date.now() - startTime

      // Process results
      let outputText = ''
      let outputColor = '#10a37f'
      let allTestsPassed = false

      if (result.success) {
        allTestsPassed = result.allPassed
        
        if (testCases.length > 0) {
          // Show test results
          const passedTests = result.results.filter(r => r.passed).length
          const totalTests = result.results.length
          
          outputText = `Test Results: ${passedTests}/${totalTests} passed\n\n`
          
          result.results.forEach((testResult, index) => {
            const status = testResult.passed ? '✅' : '❌'
            const input = JSON.stringify(testResult.input || {})
            const expected = testResult.expected
            const actual = testResult.output || testResult.result || testResult.error || 'No output'
            
            outputText += `${status} Test ${index + 1}: Input: ${input}\n`
            outputText += `   Expected: ${expected}\n`
            outputText += `   Actual: ${actual}\n`
            if (!testResult.passed && testResult.error) {
              outputText += `   Error: ${testResult.error}\n`
            }
            outputText += '\n'
          })
          
          if (allTestsPassed) {
            outputText += '🎉 All tests passed! Ready to submit.'
            outputColor = '#10a37f'
          } else {
            outputText += '❌ Some tests failed. Please review your code.'
            outputColor = '#ef4444'
          }
        } else {
          // No test cases, just show execution output
          if (result.results && result.results.length > 0) {
            outputText = result.results.map(r => r.output || r.result || '').join('\n')
          } else {
            outputText = 'Code executed successfully (no output)'
          }
          allTestsPassed = true // No tests to fail
        }
        
        if (executionTime > 1000) {
          outputText += `\n✅ Execution completed in ${executionTime}ms`
        }
      } else {
        outputText = `Error: ${result.error || 'Code execution failed'}`
        outputColor = '#ef4444'
        allTestsPassed = false
      }

      const outputLines = outputText.split('\n')

      // Update line numbers (assignment panel)
      const lineNumbersDiv = outputDiv.parentElement.querySelector('.assignment-terminal-line-numbers')
      if (lineNumbersDiv) {
        let lineNumbersHTML = ''
        outputLines.forEach((_, index) => {
          lineNumbersHTML += `<div style="line-height: 1.4; color: #6b7280; text-align: right; padding-right: 8px; font-size: 0.875rem;">${index + 1}</div>`
        })
        lineNumbersDiv.innerHTML = lineNumbersHTML
      }

      // Update output content with color coding
      let formattedOutput = ''
      outputLines.forEach((line) => {
        let color = outputColor
        if (line.includes('✅')) color = '#10a37f'
        else if (line.includes('❌') || line.includes('Error:')) color = '#ef4444'
        else if (line.includes('Test Results:')) color = '#3b82f6'
        else if (line.includes('Expected:') || line.includes('Actual:')) color = '#6b7280'
        
        formattedOutput += `<div style="line-height: 1.4; color: ${color}; white-space: pre; padding-left: 2px; font-size: 0.875rem;">${line || ' '}</div>`
      })

      outputDiv.innerHTML = `
        <div style="font-family: Monaco, Consolas, 'SF Mono', 'Courier New', monospace; line-height: 1.4;">
          ${formattedOutput}
        </div>
      `

      // Set output for reference
      setAssignmentOutput(outputText)
      
      if (result.success && allTestsPassed) {
        success('Assignment code executed successfully! All tests passed.', 2000)
      } else if (result.success) {
        showError('Code executed but some tests failed. Please review the output.', 3000)
      } else {
        showError('Assignment code execution failed. Check the output for details.', 3000)
      }

    } catch (error) {
      console.error('Assignment code execution failed:', error)
      const errorDiv = `<div style="color: #ef4444; font-family: Monaco, Consolas, monospace; padding: 16px;">Error: ${error.message}</div>`
      outputDiv.innerHTML = errorDiv
      showError('Assignment code execution failed. Please check your syntax.', 3000)
    }
  }

  // Handle submitting assignment with enhanced validation
  const handleSubmitAssignment = async () => {
    try {
      // First validate code locally before submission
      const currentTask = assignments[currentAssignment]
      const testCases = currentTask?.testCases || []
      const solutionType = currentTask?.solution_type || 'script'
      const functionName = currentTask?.function_name || null

      if (testCases.length > 0) {
        // Run local validation first
        const localResult = await CodeExecutor.executeForTesting(
          assignmentCode,
          testCases,
          functionName,
          solutionType
        )

        if (!localResult.success || !localResult.allPassed) {
          showError('Please fix the failing tests before submitting.', 3000)
          return
        }
      }

      // Submit to backend with enhanced validation
      const response = await learning.completeAssignment(topicId, currentAssignment, assignmentCode)

      if (response.data.data.success) {
        if (currentAssignment < assignments.length - 1) {
          // Move to next assignment
          const nextAssignmentIndex = currentAssignment + 1
          setCurrentAssignment(nextAssignmentIndex)

          // Create next assignment code with question in comments
          const nextAssignment = assignments[nextAssignmentIndex]
          const description = nextAssignment.description || 'Complete the assignment below'
          let codeWithComments = description.startsWith('//') ? `${description}\n` : `// ${description}\n`

          if (nextAssignment.requirements && nextAssignment.requirements.length > 0) {
            nextAssignment.requirements.forEach(req => {
              const requirement = req.startsWith('//') ? `${req}\n` : `// ${req}\n`
              codeWithComments += requirement
            })
          }

          codeWithComments += `// START YOUR CODE AFTER THIS LINE. DO NOT REMOVE THIS LINE\n`
          codeWithComments += nextAssignment.starter_code || ''

          setAssignmentCode(codeWithComments)
          setAssignmentOutput('')
          setAssignmentReview('')
          success('Assignment completed! Moving to next one...', 3000)
        } else {
          // All assignments complete
          setAssignmentComplete(true)
          success('🎉 All assignments completed! Excellent work!', 4000)
        }
      } else {
        // Handle backend validation failure
        const errorMessage = response.data.data.execution?.error || 'Assignment validation failed'
        showError(errorMessage, 4000)
      }
    } catch (err) {
      console.error('Error submitting assignment:', err)
      const errorMessage = err.response?.data?.message || 'Failed to submit assignment'
      showError(errorMessage, 3000)
    }
  }

  // Get AI review for current assignment code (assignment phase only)
  const [reviewLoading, setReviewLoading] = useState(false)
  const handleGetReview = async () => {
    if (!assignmentCode.trim() || !assignments.length) return
    setReviewLoading(true)
    setAssignmentReview('')
    try {
      const currentTask = assignments[currentAssignment]
      const res = await learning.getFeedback(topicId, assignmentCode, currentTask)
      const text = res?.data?.data?.feedback || ''
      setAssignmentReview(text)
      if (text) success('Review loaded.', 2000)
    } catch (err) {
      console.error('Get review error:', err)
      showError(err.response?.data?.message || 'Failed to get review', 3000)
    } finally {
      setReviewLoading(false)
    }
  }

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Cleanup CodeExecutor resources
      CodeExecutor.destroy()
    }
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading topic...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2 style={{ color: '#dc2626', marginBottom: '8px' }}>Topic Not Found</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          The topic you're looking for doesn't exist or you don't have access to it.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#10a37f',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  if (!topic) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b7280'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px'
        }}>
          <h2 style={{ color: '#dc2626', marginBottom: '8px' }}>Topic Not Found</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            The topic you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#10a37f',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="learn-container">
      {/* Session: fixed toggle only; editor view has no header */}
      {phase === 'session' && (
        <EditorToggle
          isOn={showEditorInSession}
          onToggle={setShowEditorInSession}
        />
      )}

      {/* Header only where needed (chat view, assignment view); editor view has no header */}
      {((phase === 'session' && !showEditorInSession) || phase === 'assignment') && (
        <header className="learn-header">
          <button
            className="back-btn"
            onClick={() => navigate('/dashboard')}
          >
            Back
          </button>

          <div className="header-center">
            <span className="header-title">{topic.title}</span>
            <div className="phase-text">
              {phase === 'session' && 'Learning Session'}
              {phase === 'assignment' && `Assignment ${currentAssignment + 1} of ${assignments.length}`}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {phase === 'session' && sessionComplete && (
              <button
                type="button"
                onClick={() => { info('Loading assignments...', 1500); navigate(`/learn/${topicId}?phase=assignment`) }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10a37f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
                title="Go to Assignments"
              >
                Assignments
              </button>
            )}
            {phase === 'assignment' && (
              <button
                type="button"
                onClick={() => navigate(`/learn/${topicId}`)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
                title="Back to Session"
              >
                Session
              </button>
            )}
          </div>
        </header>
      )}

      {/* Session chat view */}
      {phase === 'session' && !showEditorInSession && (
        <div className="session-container" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="messages-area" style={{ flex: 1, minHeight: 0 }}>
            {messages.map((message, index) => (
              <div key={index} className="message-row">
                <div className={`avatar ${message.role === 'user' ? 'avatar-user' : 'avatar-assistant'}`}>
                  {message.role === 'user' ? 'U' : 'S'}
                </div>
                <MessageContent content={message.content} role={message.role} />
              </div>
            ))}

            {isTyping && (
              <div className="message-row">
                <div className="avatar avatar-assistant">S</div>
                <div className="message-content">
                  <span className="message-role">Sara</span>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="input-form" onSubmit={handleSendMessage}>
            <textarea
              className="text-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
              placeholder="Type your message..."
              rows="1"
              disabled={isTyping}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={!inputValue.trim() || isTyping}
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Code editor + terminal: same full-screen layout as before; only visible when toggle on in session */}
      {phase === 'session' && showEditorInSession && (
        <div className="playground-main-content" style={{
          flex: 1,
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}>
          {/* Editor Panel */}
          <div className="playground-editor-panel" style={{
            ...(isDesktop ? {
              width: `${editorWidth}%`,
              height: '100%',
              minWidth: '300px'
            } : {
              height: `${editorHeight}%`,
              minHeight: '200px'
            }),
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Editor Header */}
            <div className="playground-editor-header" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '0.8rem',
              color: '#6b7280',
              minHeight: '56px'
            }}>
              {/* File Tab */}
              <div style={{
                padding: '4px 12px',
                backgroundColor: '#ffffff',
                borderRadius: '4px 4px 0 0',
                borderBottom: '2px solid #10a37f',
                color: '#111827',
                fontWeight: '500',
                fontSize: '0.75rem'
              }}>
                playground.js
              </div>

              {/* Action Buttons */}
              <div className="playground-header-actions" style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <button
                  onClick={handleRunPlayground}
                  className="playground-run-btn"
                  style={{
                    backgroundColor: userCode.trim() ? '#10a37f' : '#d1d5db',
                    color: userCode.trim() ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: userCode.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    boxShadow: userCode.trim() ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                    minWidth: '60px',
                    height: '28px',
                    alignSelf: 'flex-start'
                  }}
                  title="Run Code (Ctrl+Enter)"
                >
                  Run
                </button>
                <button
                  onClick={handleCopyCode}
                  className="playground-copy-btn"
                  style={{
                    backgroundColor: userCode.trim() ? '#3b82f6' : '#d1d5db',
                    color: userCode.trim() ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: userCode.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    minWidth: '60px',
                    height: '28px',
                    alignSelf: 'flex-start'
                  }}
                  title="Copy code to clipboard"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Editor Content */}
            <div style={{
              flex: 1,
              minHeight: '300px',
              display: 'flex',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              {/* Line Numbers */}
              <div className="playground-line-numbers" style={{
                width: '50px',
                backgroundColor: '#f9fafb',
                borderRight: '1px solid #e5e7eb',
                padding: '16px 8px',
                fontSize: '0.875rem',
                color: '#9ca3af',
                fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                lineHeight: '1.4',
                textAlign: 'right',
                userSelect: 'none',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative'
              }}>
                {userCode.split('\n').map((_, index) => (
                  <div key={index} style={{
                    lineHeight: '1.4',
                    fontSize: '0.875rem'
                  }}>
                    {index + 1}
                  </div>
                ))}
              </div>

              {/* Code Textarea */}
              <textarea
                className="playground-textarea"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                onScroll={(e) => {
                  // Sync line numbers with textarea scroll
                  const lineNumbers = e.target.parentElement.querySelector('.playground-line-numbers')
                  if (lineNumbers) {
                    lineNumbers.scrollTop = e.target.scrollTop
                  }
                }}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === 'Enter') {
                    e.preventDefault()
                    handleRunPlayground()
                  }

                  // Handle Tab key for indentation
                  if (e.key === 'Tab') {
                    e.preventDefault()
                    const textarea = e.target
                    const start = textarea.selectionStart
                    const end = textarea.selectionEnd
                    const value = textarea.value

                    // Insert 4 spaces at cursor position
                    const newValue = value.substring(0, start) + '    ' + value.substring(end)
                    setUserCode(newValue)

                    // Move cursor after the inserted spaces
                    setTimeout(() => {
                      textarea.selectionStart = textarea.selectionEnd = start + 4
                    }, 0)
                  }

                  // Handle auto-closing brackets, braces, parentheses, and quotes
                  const autoClosingPairs = {
                    '(': ')',
                    '[': ']',
                    '{': '}',
                    '"': '"',
                    "'": "'",
                    '`': '`'
                  }

                  if (autoClosingPairs[e.key]) {
                    const textarea = e.target
                    const start = textarea.selectionStart
                    const end = textarea.selectionEnd
                    const value = textarea.value
                    const selectedText = value.substring(start, end)

                    // Get the character after cursor
                    const nextChar = value.charAt(start)

                    // For quotes, check if we should close or just move cursor
                    if (['"', "'", '`'].includes(e.key)) {
                      // If next character is the same quote, just move cursor (don't add another)
                      if (nextChar === e.key) {
                        e.preventDefault()
                        setTimeout(() => {
                          textarea.selectionStart = textarea.selectionEnd = start + 1
                        }, 0)
                        return
                      }

                      // Check if we're inside a string (basic check)
                      const beforeCursor = value.substring(0, start)
                      const quoteCount = (beforeCursor.match(new RegExp('\\' + e.key, 'g')) || []).length

                      // If odd number of quotes before cursor, we're closing a string
                      if (quoteCount % 2 === 1) {
                        // Let the default behavior happen (just add the closing quote)
                        return
                      }
                    }

                    e.preventDefault()

                    const openChar = e.key
                    const closeChar = autoClosingPairs[e.key]

                    if (selectedText) {
                      // If text is selected, wrap it with the pair
                      const newValue = value.substring(0, start) + openChar + selectedText + closeChar + value.substring(end)
                      setUserCode(newValue)

                      // Select the wrapped text
                      setTimeout(() => {
                        textarea.selectionStart = start + 1
                        textarea.selectionEnd = start + 1 + selectedText.length
                      }, 0)
                    } else {
                      // Insert the pair and position cursor between them
                      const newValue = value.substring(0, start) + openChar + closeChar + value.substring(start)
                      setUserCode(newValue)

                      // Position cursor between the pair
                      setTimeout(() => {
                        textarea.selectionStart = textarea.selectionEnd = start + 1
                      }, 0)
                    }
                  }

                  // Handle closing bracket navigation (skip over closing bracket if it's already there)
                  if ([')', ']', '}'].includes(e.key)) {
                    const textarea = e.target
                    const start = textarea.selectionStart
                    const value = textarea.value
                    const nextChar = value.charAt(start)

                    // If the next character is the same closing bracket, just move cursor
                    if (nextChar === e.key) {
                      e.preventDefault()
                      setTimeout(() => {
                        textarea.selectionStart = textarea.selectionEnd = start + 1
                      }, 0)
                    }
                  }

                  // Handle Backspace key for smart indentation removal
                  if (e.key === 'Backspace') {
                    const textarea = e.target
                    const start = textarea.selectionStart
                    const end = textarea.selectionEnd
                    const value = textarea.value

                    // Only handle smart backspace if no text is selected
                    if (start === end) {
                      // Get the current line
                      const beforeCursor = value.substring(0, start)
                      const currentLineStart = beforeCursor.lastIndexOf('\n') + 1
                      const currentLine = beforeCursor.substring(currentLineStart)

                      // Check if cursor is at the end of indentation (only spaces before cursor on current line)
                      const isAtIndentEnd = /^\s+$/.test(currentLine) && currentLine.length > 0

                      // Check if we have at least 4 spaces to remove
                      const hasEnoughSpaces = currentLine.length >= 4 && currentLine.endsWith('    ')

                      if (isAtIndentEnd && hasEnoughSpaces) {
                        e.preventDefault()

                        // Remove 4 spaces
                        const newValue = value.substring(0, start - 4) + value.substring(start)
                        setUserCode(newValue)

                        // Position cursor
                        setTimeout(() => {
                          textarea.selectionStart = textarea.selectionEnd = start - 4
                        }, 0)
                      }
                      // If not at indent end or not enough spaces, let default backspace behavior happen
                    }
                  }

                  // Handle Enter key for smart auto-indentation
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const textarea = e.target
                    const start = textarea.selectionStart
                    const value = textarea.value

                    // Get the current line
                    const beforeCursor = value.substring(0, start)
                    const currentLineStart = beforeCursor.lastIndexOf('\n') + 1
                    const currentLine = beforeCursor.substring(currentLineStart)

                    // Calculate current indentation
                    const currentIndent = currentLine.match(/^(\s*)/)[1]

                    // Check if we need to increase indentation
                    let newIndent = currentIndent

                    // Increase indentation after opening braces or certain keywords
                    if (currentLine.trim().endsWith('{') ||
                      currentLine.trim().match(/\b(if|else|for|while|do|switch|case|function|try|catch|finally)\s*\([^)]*\)\s*$/) ||
                      currentLine.trim().match(/\b(else|try|finally)\s*$/) ||
                      currentLine.trim().match(/\bcase\s+.+:\s*$/) ||
                      currentLine.trim().match(/\bdefault\s*:\s*$/)) {
                      newIndent += '    ' // Add 4 spaces
                    }

                    // Check if the next character is a closing brace
                    const afterCursor = value.substring(start)
                    const nextChar = afterCursor.charAt(0)

                    if (nextChar === '}') {
                      // If next char is closing brace, add extra line with reduced indent
                      const reducedIndent = newIndent.length >= 4 ? newIndent.substring(4) : ''
                      const newValue = value.substring(0, start) + '\n' + newIndent + '\n' + reducedIndent + value.substring(start)
                      setUserCode(newValue)

                      // Position cursor on the middle line
                      setTimeout(() => {
                        textarea.selectionStart = textarea.selectionEnd = start + 1 + newIndent.length
                      }, 0)
                    } else {
                      // Normal case - just add new line with proper indentation
                      const newValue = value.substring(0, start) + '\n' + newIndent + value.substring(start)
                      setUserCode(newValue)

                      // Position cursor after the indentation
                      setTimeout(() => {
                        textarea.selectionStart = textarea.selectionEnd = start + 1 + newIndent.length
                      }, 0)
                    }
                  }
                }}
                placeholder="Practice what you learned in the session - try out the concepts here!"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  padding: '16px',
                  fontSize: '0.875rem',
                  fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                  lineHeight: '1.4',
                  backgroundColor: 'transparent',
                  color: '#111827',
                  overflow: 'auto',
                  whiteSpace: 'pre',
                  tabSize: 4
                }}
                spellCheck={false}
              />
            </div>
          </div>

          {/* Resizable Splitter */}
          <div
            className="playground-splitter"
            style={{
              ...(isDesktop ? {
                width: '8px',
                height: '100%',
                cursor: 'col-resize'
              } : {
                height: '8px',
                width: '100%',
                cursor: 'row-resize'
              }),
              backgroundColor: isDragging ? '#e5e7eb' : 'transparent',
              position: 'relative',
              flexShrink: 0,
              transition: isDragging ? 'none' : 'background-color 0.2s ease'
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              ...(isDesktop ? {
                width: '2px',
                height: '40px'
              } : {
                width: '40px',
                height: '2px'
              }),
              backgroundColor: '#9ca3af',
              borderRadius: '1px',
              opacity: isDragging ? 1 : 0.5
            }} />
          </div>

          {/* Terminal Panel */}
          <div className="playground-output-panel" style={{
            ...(isDesktop ? {
              width: `${100 - editorWidth}%`,
              height: '100%',
              minWidth: '200px'
            } : {
              height: `${100 - editorHeight}%`,
              minHeight: '100px'
            }),
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            overflow: 'hidden'
          }}>
            {/* Terminal Header */}
            <div className="playground-output-header" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '0.8rem',
              color: '#6b7280',
              minHeight: '56px'
            }}>
              <div style={{
                padding: '4px 12px',
                backgroundColor: '#ffffff',
                borderRadius: '4px 4px 0 0',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#111827',
                border: '1px solid #e5e7eb',
                borderBottom: '2px solid #10a37f',
                marginBottom: '-1px'
              }}>
                Terminal Output
              </div>
            </div>

            {/* Terminal Content */}
            <div style={{
              flex: 1,
              backgroundColor: '#1e1e1e',
              border: '1px solid #333',
              borderTop: 'none',
              display: 'flex',
              minHeight: 0
            }}>
              {/* Terminal Line Numbers */}
              <div className="terminal-line-numbers" style={{
                width: '50px',
                backgroundColor: '#2d2d2d',
                borderRight: '1px solid #404040',
                padding: '16px 8px',
                fontSize: '0.875rem',
                color: '#6b7280',
                fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                lineHeight: '1.4',
                textAlign: 'right',
                userSelect: 'none',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative'
              }}>
              </div>

              {/* Terminal Output */}
              <div
                id="terminal-output"
                className="playground-output"
                onScroll={(e) => {
                  const lineNumbers = e.target.parentElement.querySelector('.terminal-line-numbers')
                  if (lineNumbers) {
                    lineNumbers.scrollTop = e.target.scrollTop
                  }
                }}
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#1e1e1e',
                  color: '#10a37f',
                  fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                  fontSize: '0.875rem',
                  lineHeight: '1.4',
                  overflow: 'auto',
                  minHeight: 0,
                  height: '100%'
                }}
              >
                <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                  Click "Run" to execute your code
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Phase - Same Structure as Playground */}
      {phase === 'assignment' && assignments.length > 0 && (
        <div className="playground-main-content" style={{
          flex: 1,
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          height: '100%',
          minHeight: 0,
          overflow: 'hidden'
        }}>
          {/* Editor Panel */}
          <div className="playground-editor-panel" style={{
            ...(isDesktop ? {
              width: `${editorWidth}%`,
              height: '100%',
              minWidth: '300px'
            } : {
              height: `${editorHeight}%`,
              minHeight: '200px'
            }),
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Editor Header */}
            <div className="playground-editor-header" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '0.8rem',
              color: '#6b7280',
              minHeight: '56px'
            }}>
              {/* File Tab */}
              <div style={{
                padding: '4px 12px',
                backgroundColor: '#ffffff',
                borderRadius: '4px 4px 0 0',
                borderBottom: '2px solid #10a37f',
                color: '#111827',
                fontWeight: '500',
                fontSize: '0.75rem'
              }}>
                assignment.js
              </div>

              {/* Action Buttons */}
              <div className="playground-header-actions" style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <button
                  onClick={handleRunAssignment}
                  className="playground-run-btn"
                  style={{
                    backgroundColor: assignmentCode.trim() ? '#10a37f' : '#d1d5db',
                    color: assignmentCode.trim() ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: assignmentCode.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    boxShadow: assignmentCode.trim() ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                    minWidth: '60px',
                    height: '28px',
                    alignSelf: 'flex-start'
                  }}
                  title="Run Code (Ctrl+Enter)"
                >
                  Run
                </button>
                <button
                  onClick={handleSubmitAssignment}
                  className="playground-reset-btn"
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    minWidth: '60px',
                    height: '28px',
                    alignSelf: 'flex-start'
                  }}
                  title="Submit Assignment"
                >
                  Submit
                </button>
                <button
                  onClick={handleGetReview}
                  disabled={!assignmentCode.trim() || reviewLoading}
                  className="playground-review-btn"
                  style={{
                    backgroundColor: assignmentCode.trim() && !reviewLoading ? '#3b82f6' : '#d1d5db',
                    color: assignmentCode.trim() && !reviewLoading ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    cursor: assignmentCode.trim() && !reviewLoading ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    minWidth: '72px',
                    height: '28px',
                    alignSelf: 'flex-start'
                  }}
                  title="Get AI review of your code"
                >
                  {reviewLoading ? '...' : 'Get review'}
                </button>
              </div>
            </div>

            {/* Editor Content */}
            <div style={{
              flex: 1,
              minHeight: '300px',
              display: 'flex',
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              overflow: 'hidden'
            }}>
              {/* Line Numbers */}
              <div className="playground-line-numbers" style={{
                width: '50px',
                backgroundColor: '#f9fafb',
                borderRight: '1px solid #e5e7eb',
                padding: '16px 8px',
                fontSize: '0.875rem',
                color: '#9ca3af',
                fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                lineHeight: '1.4',
                textAlign: 'right',
                userSelect: 'none',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative'
              }}>
                {assignmentCode.split('\n').map((_, index) => (
                  <div key={index} style={{
                    lineHeight: '1.4',
                    fontSize: '0.875rem'
                  }}>
                    {index + 1}
                  </div>
                ))}
              </div>

              {/* Code Textarea */}
              <textarea
                className="playground-textarea"
                value={assignmentCode}
                onChange={(e) => setAssignmentCode(e.target.value)}
                onScroll={(e) => {
                  // Sync line numbers with textarea scroll
                  const lineNumbers = e.target.parentElement.querySelector('.playground-line-numbers')
                  if (lineNumbers) {
                    lineNumbers.scrollTop = e.target.scrollTop
                  }
                }}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === 'Enter') {
                    e.preventDefault()
                    handleRunAssignment()
                  }

                  // Handle Tab key for indentation
                  if (e.key === 'Tab') {
                    e.preventDefault()
                    const textarea = e.target
                    const start = textarea.selectionStart
                    const end = textarea.selectionEnd
                    const value = textarea.value

                    // Insert 4 spaces at cursor position
                    const newValue = value.substring(0, start) + '    ' + value.substring(end)
                    setAssignmentCode(newValue)

                    // Move cursor after the inserted spaces
                    setTimeout(() => {
                      textarea.selectionStart = textarea.selectionEnd = start + 4
                    }, 0)
                  }

                  // Handle auto-closing brackets, braces, parentheses, and quotes
                  const autoClosingPairs = {
                    '(': ')',
                    '[': ']',
                    '{': '}',
                    '"': '"',
                    "'": "'",
                    '`': '`'
                  }

                  if (autoClosingPairs[e.key]) {
                    const textarea = e.target
                    const start = textarea.selectionStart
                    const end = textarea.selectionEnd
                    const value = textarea.value
                    const selectedText = value.substring(start, end)

                    // Get the character after cursor
                    const nextChar = value.charAt(start)

                    // For quotes, check if we should close or just move cursor
                    if (['"', "'", '`'].includes(e.key)) {
                      // If next character is the same quote, just move cursor (don't add another)
                      if (nextChar === e.key) {
                        e.preventDefault()
                        setTimeout(() => {
                          textarea.selectionStart = textarea.selectionEnd = start + 1
                        }, 0)
                        return
                      }

                      // Check if we're inside a string (basic check)
                      const beforeCursor = value.substring(0, start)
                      const quoteCount = (beforeCursor.match(new RegExp('\\' + e.key, 'g')) || []).length

                      // If odd number of quotes before cursor, we're closing a string
                      if (quoteCount % 2 === 1) {
                        // Let the default behavior happen (just add the closing quote)
                        return
                      }
                    }

                    e.preventDefault()

                    const openChar = e.key
                    const closeChar = autoClosingPairs[e.key]

                    if (selectedText) {
                      // If text is selected, wrap it with the pair
                      const newValue = value.substring(0, start) + openChar + selectedText + closeChar + value.substring(end)
                      setAssignmentCode(newValue)

                      // Select the wrapped text
                      setTimeout(() => {
                        textarea.selectionStart = start + 1
                        textarea.selectionEnd = start + 1 + selectedText.length
                      }, 0)
                    } else {
                      // Insert the pair and position cursor between them
                      const newValue = value.substring(0, start) + openChar + closeChar + value.substring(start)
                      setAssignmentCode(newValue)

                      // Position cursor between the pair
                      setTimeout(() => {
                        textarea.selectionStart = textarea.selectionEnd = start + 1
                      }, 0)
                    }
                  }

                  // Handle closing bracket navigation (skip over closing bracket if it's already there)
                  if ([')', ']', '}'].includes(e.key)) {
                    const textarea = e.target
                    const start = textarea.selectionStart
                    const value = textarea.value
                    const nextChar = value.charAt(start)

                    // If the next character is the same closing bracket, just move cursor
                    if (nextChar === e.key) {
                      e.preventDefault()
                      setTimeout(() => {
                        textarea.selectionStart = textarea.selectionEnd = start + 1
                      }, 0)
                    }
                  }

                  // Handle Backspace key for smart indentation removal
                  if (e.key === 'Backspace') {
                    const textarea = e.target
                    const start = textarea.selectionStart
                    const end = textarea.selectionEnd
                    const value = textarea.value

                    // Only handle smart backspace if no text is selected
                    if (start === end) {
                      // Get the current line
                      const beforeCursor = value.substring(0, start)
                      const currentLineStart = beforeCursor.lastIndexOf('\n') + 1
                      const currentLine = beforeCursor.substring(currentLineStart)

                      // Check if cursor is at the end of indentation (only spaces before cursor on current line)
                      const isAtIndentEnd = /^\s+$/.test(currentLine) && currentLine.length > 0

                      // Check if we have at least 4 spaces to remove
                      const hasEnoughSpaces = currentLine.length >= 4 && currentLine.endsWith('    ')

                      if (isAtIndentEnd && hasEnoughSpaces) {
                        e.preventDefault()

                        // Remove 4 spaces
                        const newValue = value.substring(0, start - 4) + value.substring(start)
                        setAssignmentCode(newValue)

                        // Position cursor
                        setTimeout(() => {
                          textarea.selectionStart = textarea.selectionEnd = start - 4
                        }, 0)
                      }
                      // If not at indent end or not enough spaces, let default backspace behavior happen
                    }
                  }

                  // Handle Enter key for smart auto-indentation
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const textarea = e.target
                    const start = textarea.selectionStart
                    const value = textarea.value

                    // Get the current line
                    const beforeCursor = value.substring(0, start)
                    const currentLineStart = beforeCursor.lastIndexOf('\n') + 1
                    const currentLine = beforeCursor.substring(currentLineStart)

                    // Calculate current indentation
                    const currentIndent = currentLine.match(/^(\s*)/)[1]

                    // Check if we need to increase indentation
                    let newIndent = currentIndent

                    // Increase indentation after opening braces or certain keywords
                    if (currentLine.trim().endsWith('{') ||
                      currentLine.trim().match(/\b(if|else|for|while|do|switch|case|function|try|catch|finally)\s*\([^)]*\)\s*$/) ||
                      currentLine.trim().match(/\b(else|try|finally)\s*$/) ||
                      currentLine.trim().match(/\bcase\s+.+:\s*$/) ||
                      currentLine.trim().match(/\bdefault\s*:\s*$/)) {
                      newIndent += '    ' // Add 4 spaces
                    }

                    // Check if the next character is a closing brace
                    const afterCursor = value.substring(start)
                    const nextChar = afterCursor.charAt(0)

                    if (nextChar === '}') {
                      // If next char is closing brace, add extra line with reduced indent
                      const reducedIndent = newIndent.length >= 4 ? newIndent.substring(4) : ''
                      const newValue = value.substring(0, start) + '\n' + newIndent + '\n' + reducedIndent + value.substring(start)
                      setAssignmentCode(newValue)

                      // Position cursor on the middle line
                      setTimeout(() => {
                        textarea.selectionStart = textarea.selectionEnd = start + 1 + newIndent.length
                      }, 0)
                    } else {
                      // Normal case - just add new line with proper indentation
                      const newValue = value.substring(0, start) + '\n' + newIndent + value.substring(start)
                      setAssignmentCode(newValue)

                      // Position cursor after the indentation
                      setTimeout(() => {
                        textarea.selectionStart = textarea.selectionEnd = start + 1 + newIndent.length
                      }, 0)
                    }
                  }
                }}
                placeholder="// Write your assignment code here..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  padding: '16px',
                  fontSize: '0.875rem',
                  fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                  lineHeight: '1.4',
                  backgroundColor: 'transparent',
                  color: '#111827',
                  overflow: 'auto',
                  whiteSpace: 'pre',
                  tabSize: 4
                }}
                spellCheck={false}
              />
            </div>
          </div>

          {/* Resizable Splitter */}
          <div
            className="playground-splitter"
            style={{
              ...(isDesktop ? {
                width: '8px',
                height: '100%',
                cursor: 'col-resize'
              } : {
                height: '8px',
                width: '100%',
                cursor: 'row-resize'
              }),
              backgroundColor: isDragging ? '#e5e7eb' : 'transparent',
              position: 'relative',
              flexShrink: 0,
              transition: isDragging ? 'none' : 'background-color 0.2s ease'
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              ...(isDesktop ? {
                width: '2px',
                height: '40px'
              } : {
                width: '40px',
                height: '2px'
              }),
              backgroundColor: '#9ca3af',
              borderRadius: '1px',
              opacity: isDragging ? 1 : 0.5
            }} />
          </div>

          {/* Terminal Panel */}
          <div className="playground-output-panel" style={{
            ...(isDesktop ? {
              width: `${100 - editorWidth}%`,
              height: '100%',
              minWidth: '200px'
            } : {
              height: `${100 - editorHeight}%`,
              minHeight: '100px'
            }),
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            overflow: 'hidden'
          }}>
            {/* Terminal Header */}
            <div className="playground-output-header" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '0.8rem',
              color: '#6b7280',
              minHeight: '56px'
            }}>
              <div style={{
                padding: '4px 12px',
                backgroundColor: '#ffffff',
                borderRadius: '4px 4px 0 0',
                fontSize: '0.75rem',
                fontWeight: '500',
                color: '#111827',
                border: '1px solid #e5e7eb',
                borderBottom: '2px solid #10a37f',
                marginBottom: '-1px'
              }}>
                Test Results
              </div>
            </div>

            {/* Terminal Content (assignment only — shared run terminal is id="terminal-output") */}
            <div style={{
              flex: 1,
              backgroundColor: '#1e1e1e',
              border: '1px solid #333',
              borderTop: 'none',
              display: 'flex',
              minHeight: 0
            }}>
              <div className="assignment-terminal-line-numbers" style={{
                width: '50px',
                backgroundColor: '#2d2d2d',
                borderRight: '1px solid #404040',
                padding: '16px 8px',
                fontSize: '0.875rem',
                color: '#6b7280',
                fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                lineHeight: '1.4',
                textAlign: 'right',
                userSelect: 'none',
                overflow: 'hidden',
                flexShrink: 0,
                position: 'relative'
              }}>
              </div>

              <div
                id="assignment-output"
                className="playground-output"
                onScroll={(e) => {
                  const lineNumbers = e.target.parentElement.querySelector('.assignment-terminal-line-numbers')
                  if (lineNumbers) {
                    lineNumbers.scrollTop = e.target.scrollTop
                  }
                }}
                style={{
                  flex: 1,
                  padding: '16px',
                  backgroundColor: '#1e1e1e',
                  color: '#10a37f',
                  fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
                  fontSize: '0.875rem',
                  lineHeight: '1.4',
                  overflow: 'auto',
                  minHeight: 0,
                  height: '100%'
                }}
              >
                <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                  {assignmentOutput ? (
                    <pre style={{ margin: 0, color: '#10a37f', whiteSpace: 'pre-wrap' }}>{assignmentOutput}</pre>
                  ) : (
                    'Click "Run" to test your assignment code'
                  )}
                </div>
              </div>
            </div>
            {assignmentReview && (
              <div style={{
                marginTop: '12px',
                padding: '12px 16px',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '8px',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                color: '#0c4a6e',
                whiteSpace: 'pre-wrap'
              }}>
                <strong>AI Review</strong>
                <div style={{ marginTop: '8px' }}>{assignmentReview}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completed Phase — 3 phases only: session → play → assignment */}
      {assignmentComplete && (
        <div className="completed-container">
          <div className="completed-content">
            <span className="completed-emoji">🎉</span>
            <h2 className="completed-title">All Done!</h2>
            <p className="completed-text">
              You've completed all assignments for {topic.title}
            </p>
            <button
              className="back-to-dashboard-btn"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Professional Toast Notifications */}
      <ToastContainer toasts={toasts} />
    </div>
  )
}

export default Learn