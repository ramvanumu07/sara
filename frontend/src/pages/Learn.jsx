import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { learning, chat } from '../config/api'
import { ToastContainer } from '../components/Toast'
import { useToast } from '../hooks/useToast'
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
  const phase = searchParams.get('phase') || 'session'
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

  // Playground phase states
  const [playgroundCode, setPlaygroundCode] = useState('')
  const [playgroundOutput, setPlaygroundOutput] = useState('')
  const [playgroundAnalysis, setPlaygroundAnalysis] = useState('')
  const [playgroundReady, setPlaygroundReady] = useState(false)

  // Assignment phase states
  const [assignments, setAssignments] = useState([])
  const [currentAssignment, setCurrentAssignment] = useState(0)
  const [assignmentCode, setAssignmentCode] = useState('')
  const [assignmentOutput, setAssignmentOutput] = useState('')
  const [assignmentReview, setAssignmentReview] = useState('')
  const [assignmentComplete, setAssignmentComplete] = useState(false)

  // Feedback phase states
  const [feedback, setFeedback] = useState(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
        
        setTopic(topicResponse.data.data.topic)

        // Check if user is trying to access advanced phases without completing session
        if ((phase === 'playtime' || phase === 'assignment') && !sessionComplete) {
          // Check if session is actually complete by looking at chat history
          try {
            const historyResponse = await chat.getHistory(topicId)
            if (historyResponse.data.data.messages && historyResponse.data.data.messages.length > 0) {
              const lastMessage = historyResponse.data.data.messages[historyResponse.data.data.messages.length - 1]
              if (lastMessage.role === 'assistant' && lastMessage.content.includes('ready for the playground')) {
                setSessionComplete(true)
                // Delay the success message slightly to let the UI update
                setTimeout(() => {
                  success('🎉 Session completed! Playground and assignments unlocked!', 4000)
                }, 500)
              } else {
                // Session not complete, redirect to session
                navigate(`/learn/${topicId}?phase=session`)
                return
              }
            } else {
              // No chat history, redirect to session
              navigate(`/learn/${topicId}?phase=session`)
              return
            }
          } catch (historyError) {
            // Error loading history, redirect to session
            navigate(`/learn/${topicId}?phase=session`)
            return
          }
        }

        if (phase === 'session') {
          // Load chat history
          try {
            const historyResponse = await chat.getHistory(topicId)
            if (historyResponse.data.data.messages && historyResponse.data.data.messages.length > 0) {
              setMessages(historyResponse.data.data.messages)
              // Check if session is complete
              const lastMessage = historyResponse.data.data.messages[historyResponse.data.data.messages.length - 1]
              if (lastMessage.role === 'assistant' && lastMessage.content.includes('ready for the playground')) {
                setSessionComplete(true)
              }
            } else {
              // Start new session
              const startResponse = await learning.sessionChat(topicId, '')
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
            const startResponse = await learning.sessionChat(topicId, '')
            if (startResponse.data.data.response) {
              const message = {
                role: 'assistant',
                content: startResponse.data.data.response,
                timestamp: new Date().toISOString()
              }
              setMessages([message])
            }
          }
        } else if (phase === 'playtime') {
          // Initialize playground
          setPlaygroundCode(`// Welcome to the ${topicResponse.data.data.topic.title} playground!\n// Try writing some code here\n\nconsole.log("Hello, World!");`)
        } else if (phase === 'assignment') {
          // Load assignments from topic data
          const assignments = topicResponse.data.data.topic.tasks || []
          setAssignments(assignments)
          if (assignments.length > 0) {
            setAssignmentCode(assignments[0].starter_code || '')
          }
        } else if (phase === 'feedback') {
          // Load feedback
          const feedbackResponse = await learning.getFeedback(topicId)
          setFeedback(feedbackResponse.data.data.feedback)
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

        // Check if session is complete
        if (response.data.data.response.includes('ready for the playground')) {
          setSessionComplete(true)
          success('🎉 Session completed! Playground unlocked!', 3000)
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

  // Handle running code in playground
  const handleRunPlayground = async () => {
    try {
      const response = await learning.executeCode(playgroundCode, topicId)
      setPlaygroundOutput(response.data.data.output)

      // Get AI analysis (using getFeedback as a substitute for analysis)
      const analysisResponse = await learning.getFeedback(topicId, playgroundCode, null)
      setPlaygroundAnalysis(analysisResponse.data.data.feedback)
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Code execution failed'
      setPlaygroundOutput(`Error: ${errorMsg}`)
      showError('Code execution failed. Please check your syntax and try again.', 4000)
    }
  }

  // Handle running code in assignment
  const handleRunAssignment = async () => {
    try {
      const response = await learning.executeCode(assignmentCode, topicId, currentAssignment)
      setAssignmentOutput(response.data.data.output)

      // Get code review
      const reviewResponse = await learning.getFeedback(topicId, assignmentCode, assignments[currentAssignment])
      setAssignmentReview(reviewResponse.data.data.feedback)
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Code execution failed'
      setAssignmentOutput(`Error: ${errorMsg}`)
      showError('Assignment execution failed. Please review your code and try again.', 4000)
    }
  }

  // Handle submitting assignment
  const handleSubmitAssignment = async () => {
    try {
      const response = await learning.completeAssignment(topicId, currentAssignment, assignmentCode)

      if (response.data.data.success) {
        if (currentAssignment < assignments.length - 1) {
          // Move to next assignment
          setCurrentAssignment(prev => prev + 1)
          setAssignmentCode(assignments[currentAssignment + 1].starter_code || '')
          setAssignmentOutput('')
          setAssignmentReview('')
          success('Assignment completed! Moving to next one...', 3000)
        } else {
          // All assignments complete
          setAssignmentComplete(true)
          success('🎉 All assignments completed! Excellent work!', 4000)
        }
      }
    } catch (err) {
      console.error('Error submitting assignment:', err)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading topic...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
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
      {/* Header */}
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
            {phase === 'playtime' && 'Practice Mode'}
            {phase === 'assignment' && 'Assignments'}
            {phase === 'feedback' && 'Feedback'}
          </div>
        </div>

        <button
          className="play-btn"
          onClick={() => {
            if (sessionComplete) {
              info('Loading playground...', 1500)
              navigate(`/learn/${topicId}?phase=playtime`)
            } else {
              warning('Complete the learning session first to unlock the playground!', 4000)
            }
          }}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: sessionComplete ? '#10a37f' : '#9ca3af', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: sessionComplete ? 'pointer' : 'not-allowed',
            opacity: sessionComplete ? 1 : 0.7
          }}
          title={sessionComplete ? 'Go to Playground' : 'Complete the session first'}
        >
          Play
        </button>
      </header>

      {/* Session Phase */}
      {phase === 'session' && (
        <div className="session-container">
          <div className="messages-area">
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

          {sessionComplete && (
            <div className="transition-banner">
              <span>🎉 Great job! You're ready for the playground.</span>
              <button
                className="transition-btn"
                onClick={() => navigate(`/learn/${topicId}?phase=playtime`)}
              >
                Go to Playground
              </button>
            </div>
          )}

          <form className="input-form" onSubmit={handleSendMessage}>
            <textarea
              className="text-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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

      {/* Playground Phase */}
      {phase === 'playtime' && (
        <div className="playtime-container">
          <div className="playtime-left">
            <div className="playground-main-content">
              <div className="playground-left-panel">
                <div className="playground-editor-header">
                  <span>Code Editor</span>
                </div>

                <div style={{ display: 'flex', flex: 1 }}>
                  <div className="playground-line-numbers">
                    {playgroundCode.split('\n').map((_, index) => (
                      <div key={index} style={{ height: '19.6px' }}>
                        {index + 1}
                      </div>
                    ))}
                  </div>

                  <textarea
                    className="playground-textarea"
                    value={playgroundCode}
                    onChange={(e) => setPlaygroundCode(e.target.value)}
                    style={{
                      flex: 1,
                      resize: 'none',
                      border: 'none',
                      outline: 'none',
                      padding: '12px 16px',
                      fontFamily: 'Monaco, Consolas, monospace',
                      fontSize: '14px',
                      lineHeight: '19.6px',
                      backgroundColor: '#ffffff',
                      color: '#111827'
                    }}
                  />
                </div>

                <div className="playground-footer">
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      Press Ctrl+Enter to run
                    </span>
                  </div>
                  <div className="playground-footer-actions" style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleRunPlayground}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#374151',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      Run Code
                    </button>
                  </div>
                </div>
              </div>

              <div className="playground-right-panel">
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="playground-output-header">
                    <span>Output</span>
                  </div>

                  <div style={{ flex: 1, padding: '16px', backgroundColor: '#1e1e1e', color: '#e2e8f0', fontFamily: 'Monaco, Consolas, monospace', fontSize: '0.85rem', overflow: 'auto' }}>
                    {playgroundOutput ? (
                      <pre style={{ margin: 0, color: '#6b7280' }}>{playgroundOutput}</pre>
                    ) : (
                      <pre style={{ margin: 0, color: '#6b7280' }}>Click "Run" to execute your code</pre>
                    )}
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderTop: '1px solid #e5e7eb' }}>
                  <div className="playground-ai-header">
                    <span style={{ fontWeight: '500' }}>AI Code Analysis</span>
                  </div>

                  <div style={{ flex: 1, padding: '16px', backgroundColor: '#ffffff', color: '#111827', fontSize: '0.9rem', overflow: 'auto' }}>
                    {playgroundAnalysis ? (
                      <div style={{ color: '#111827', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{playgroundAnalysis}</div>
                    ) : (
                      <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                        Run your code to get AI analysis and suggestions
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="playtime-right">
            <div className="playtime-header">
              <span>Notes & Chat</span>
            </div>

            <div className="playtime-messages">
              {/* Placeholder for playground chat */}
            </div>

            <form className="playtime-input-form">
              <input
                className="playtime-input"
                placeholder="Ask Sara about your code..."
              />
              <button type="submit" className="playtime-send-btn">
                →
              </button>
            </form>

            <button
              className="ready-btn"
              onClick={() => {
                if (sessionComplete) {
                  info('Loading assignments...', 1500)
                  navigate(`/learn/${topicId}?phase=assignment`)
                } else {
                  warning('Complete the learning session first to unlock assignments!', 4000)
                }
              }}
              style={{ 
                backgroundColor: sessionComplete ? '#10a37f' : '#9ca3af',
                cursor: sessionComplete ? 'pointer' : 'not-allowed',
                opacity: sessionComplete ? 1 : 0.7
              }}
              title={sessionComplete ? 'Go to Assignments' : 'Complete the session first'}
            >
              Ready for Assignments
            </button>
          </div>
        </div>
      )}

      {/* Assignment Phase */}
      {phase === 'assignment' && assignments.length > 0 && (
        <div className="assignment-container">
          <div className="assignment-main-content">
            <div className="assignment-left-panel">
              <div className="assignment-header">
                <div style={{ color: '#111827' }}>
                  <span className="assignment-number">Assignment {currentAssignment + 1} of {assignments.length}</span>
                  <h2 className="assignment-title">{assignments[currentAssignment]?.title}</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button className="hint-button">💡 Hint</button>
                  <div className="timer-box">
                    <span>⏱️</span>
                    <span className="timer-text">05:30</span>
                  </div>
                </div>
              </div>

              <div className="assignment-question-section">
                <h3 style={{ margin: '0 0 12px 0', fontWeight: '600', color: '#111827', fontSize: '1rem' }}>
                  Task Description
                </h3>
                <p style={{ margin: '0 0 16px 0', color: '#374151', lineHeight: '1.6', fontSize: '0.9rem' }}>
                  {assignments[currentAssignment]?.description}
                </p>

                {assignments[currentAssignment]?.requirements && (
                  <>
                    <h4 style={{ margin: '16px 0 8px 0', fontWeight: '600', color: '#111827', fontSize: '0.9rem' }}>
                      Requirements:
                    </h4>
                    {assignments[currentAssignment].requirements.map((req, index) => (
                      <div key={index} style={{ margin: '4px 0', fontSize: '0.85rem', color: '#6b7280' }}>
                        • {req}
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
                <div className="assignment-editor-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Code Editor</span>
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', border: '1px solid #e5e7eb', backgroundColor: '#ffffff' }}>
                  <div className="assignment-line-numbers">
                    {assignmentCode.split('\n').map((_, index) => (
                      <div key={index} style={{ height: '19.6px' }}>
                        {index + 1}
                      </div>
                    ))}
                  </div>

                  <textarea
                    className="assignment-textarea"
                    value={assignmentCode}
                    onChange={(e) => setAssignmentCode(e.target.value)}
                    style={{
                      flex: 1,
                      resize: 'none',
                      border: 'none',
                      outline: 'none',
                      padding: '12px 16px',
                      fontFamily: 'Monaco, Consolas, monospace',
                      fontSize: '14px',
                      lineHeight: '19.6px',
                      backgroundColor: '#ffffff',
                      color: '#111827'
                    }}
                  />
                </div>

                <div className="assignment-footer">
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      Press Ctrl+Enter to run • Ctrl+S to save
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                    Last saved: Just now
                  </div>
                </div>
              </div>
            </div>

            <div className="assignment-right-panel">
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="assignment-output-header">
                  <span>Test Results</span>
                </div>

                <div style={{ flex: 1, padding: '16px', backgroundColor: '#1e1e1e', color: '#e2e8f0', fontFamily: 'Monaco, Consolas, monospace', fontSize: '0.85rem', overflow: 'auto' }}>
                  {assignmentOutput ? (
                    <pre style={{ margin: 0, color: '#6b7280' }}>{assignmentOutput}</pre>
                  ) : (
                    <pre style={{ margin: 0, color: '#6b7280' }}>Click "Run" to test your code</pre>
                  )}
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderTop: '1px solid #e5e7eb' }}>
                <div className="assignment-review-header">
                  <span style={{ fontWeight: '500' }}>Code Review & Feedback</span>
                </div>

                <div style={{ flex: 1, padding: '16px', backgroundColor: '#ffffff', color: '#111827', fontSize: '0.9rem', overflow: 'auto' }}>
                  {assignmentReview ? (
                    <div style={{ color: '#111827', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{assignmentReview}</div>
                  ) : (
                    <div style={{ color: '#6b7280', fontStyle: 'italic' }}>
                      Run your code to get detailed feedback and suggestions
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="assignment-sticky-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                Assignment {currentAssignment + 1} of {assignments.length}
              </span>
            </div>

            <div className="assignment-sticky-actions">
              <button
                onClick={handleRunAssignment}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Run & Test
              </button>
              <button
                onClick={handleSubmitAssignment}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#10a37f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {currentAssignment < assignments.length - 1 ? 'Next Assignment' : 'Complete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Phase */}
      {phase === 'feedback' && (
        <div className="feedback-container">
          <div className="feedback-header">
            <h2>🎉 Congratulations!</h2>
            <span className="time-taken">Completed in 25 minutes</span>
          </div>

          <div className="feedback-section">
            <h3 className="section-title">Your Performance</h3>
            <div className="test-results">
              <div className="test-score passed">
                <span className="test-score-number">85%</span>
                <span className="test-score-label">Overall Score</span>
              </div>
            </div>
          </div>

          <div className="feedback-section">
            <h3 className="section-title">What You've Learned</h3>
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                Key Concepts Mastered:
              </h4>
              <ul style={{ paddingLeft: '20px', color: '#6b7280' }}>
                {topic.concepts?.map((concept, index) => (
                  <li key={index} style={{ marginBottom: '8px' }}>
                    {concept}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            className="continue-btn"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      )}

      {/* Completed Phase */}
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
              onClick={() => navigate(`/learn/${topicId}?phase=feedback`)}
            >
              View Feedback
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