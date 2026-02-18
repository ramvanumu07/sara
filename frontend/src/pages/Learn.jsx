import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { learning, chat } from '../config/api'
import EditorToggle from '../components/EditorToggle'
import SessionPlayground from '../components/SessionPlayground'
import CodeExecutor from '../services/CodeExecutor'
import { useToast } from '../hooks/useToast'
import { ToastContainer } from '../components/Toast'
import { copyToClipboard } from '../utils/copyToClipboard'
import './Learn.css'
import './Learn-responsive.css'

const SESSION_COMPLETE_REASON = 'Session completed. You can view the conversation but cannot send new messages.'

// Code block: dark background + light text; horizontal scroll for long lines (inline so Vercel applies)
const codeBlockWrapperStyle = {
  position: 'relative',
  margin: '6px 0',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  overflow: 'hidden',
  boxSizing: 'border-box'
}
const fencedBlockStyle = {
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  backgroundColor: '#1a202c',
  color: '#e2e8f0',
  padding: '8px 12px',
  borderRadius: '6px',
  margin: 0,
  overflowX: 'auto',
  overflowY: 'hidden',
  WebkitOverflowScrolling: 'touch',
  fontFamily: 'Monaco, Consolas, monospace',
  fontSize: '0.8125rem',
  lineHeight: '1.4',
  boxSizing: 'border-box'
}
const preScrollStyle = {
  margin: 0,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  color: '#e2e8f0',
  whiteSpace: 'pre',
  wordBreak: 'normal',
  minWidth: 'min-content'
}

// One-line code snippets in the flow of text: subtle chip (ChatGPT-like)
const inlineStatementStyle = {
  display: 'inline',
  backgroundColor: '#f1f5f9',
  color: '#334155',
  padding: '1px 4px',
  borderRadius: '3px',
  fontFamily: 'Monaco, Consolas, monospace',
  fontSize: '0.85em',
  border: '1px solid #e2e8f0'
}
const inlineCodeStyle = {
  backgroundColor: '#f1f5f9',
  color: '#334155',
  padding: '1px 4px',
  borderRadius: '3px',
  fontSize: '0.85em',
  fontFamily: 'Monaco, Consolas, monospace',
  border: '1px solid #e2e8f0'
}

function looksLikeCodeStatement(str) {
  const s = (str || '').trim()
  if (s.length < 3) return false
  return (
    /console\.\s*log|;\s*$|function\s*\(|=>|\.log\s*\(|\.log\(/.test(s) ||
    (s.includes('(') && s.includes(')') && s.length > 15)
  )
}

// Renders text with markdown-style **bold** parsed
function renderTextWithBold(text, keyPrefix) {
  if (!text || typeof text !== 'string') return null
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    const match = part.match(/^\*\*(.*?)\*\*$/)
    if (match) return <strong key={`${keyPrefix}-${i}`}>{match[1]}</strong>
    return <span key={`${keyPrefix}-${i}`} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>
  })
}

const MessageContent = ({ content, role }) => {
  const [copiedBlockId, setCopiedBlockId] = useState(null)
  const handleCopyCode = (code, blockId) => {
    copyToClipboard(code).then((ok) => {
      if (ok) {
        setCopiedBlockId(blockId)
        setTimeout(() => setCopiedBlockId(null), 2000)
      }
    })
  }

  const renderContent = (text) => {
    if (!text || typeof text !== 'string') return null
    // First handle fenced code blocks (```javascript ... ```)
    const codeBlockParts = text.split(/(```[\s\S]*?```)/g)

    return codeBlockParts.map((part, blockIndex) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const raw = part.slice(3, -3).trim()
        const firstLineEnd = raw.indexOf('\n')
        const looksLikeLang = (s) => /^[a-z0-9+#-]+$/i.test((s || '').trim()) && (s || '').trim().length < 20
        const firstLine = firstLineEnd === -1 ? raw : raw.slice(0, firstLineEnd).trim()
        const rest = firstLineEnd === -1 ? '' : raw.slice(firstLineEnd + 1).trim()
        const code = looksLikeLang(firstLine) ? rest : raw
        const blockId = `b-${blockIndex}`

        return (
          <div key={blockId} className="code-block-wrapper" style={codeBlockWrapperStyle}>
            <button
              type="button"
              onClick={() => handleCopyCode(code, blockId)}
              className="code-block-copy-btn"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 1,
                width: 28,
                height: 28,
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: copiedBlockId === blockId ? '#059669' : '#374151',
                color: '#e2e8f0',
                border: '1px solid #4a5568',
                borderRadius: 6,
                cursor: 'pointer'
              }}
              title={copiedBlockId === blockId ? 'Copied' : 'Copy code'}
            >
              {copiedBlockId === blockId ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              )}
            </button>
            <div className="code-block" style={fencedBlockStyle}>
              <pre style={preScrollStyle}>{code}</pre>
            </div>
          </div>
        )
      }

      // Handle inline code and regular text; statement-like code: multi-line → block, one-line → chip
      const inlineCodeParts = part.split(/(`[^`]+`)/g)
      return (
        <React.Fragment key={`f-${blockIndex}`}>
          {inlineCodeParts.map((inlinePart, inlineIndex) => {
            if (inlinePart.startsWith('`') && inlinePart.endsWith('`')) {
              const inlineCode = inlinePart.slice(1, -1)
              if (looksLikeCodeStatement(inlineCode)) {
                const isMultiline = inlineCode.includes('\n')
                if (isMultiline) {
                  const blockId = `ib-${blockIndex}-${inlineIndex}`
                  return (
                    <div key={blockId} className="code-block-wrapper" style={codeBlockWrapperStyle}>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(inlineCode, blockId)}
                        className="code-block-copy-btn"
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          zIndex: 1,
                          width: 28,
                          height: 28,
                          padding: 0,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: copiedBlockId === blockId ? '#059669' : '#374151',
                          color: '#e2e8f0',
                          border: '1px solid #4a5568',
                          borderRadius: 6,
                          cursor: 'pointer'
                        }}
                        title={copiedBlockId === blockId ? 'Copied' : 'Copy code'}
                      >
                        {copiedBlockId === blockId ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                        )}
                      </button>
                      <div className="code-block" style={fencedBlockStyle}>
                        <pre style={preScrollStyle}>{inlineCode}</pre>
                      </div>
                    </div>
                  )
                }
                return (
                  <span key={`${blockIndex}-${inlineIndex}`} style={inlineStatementStyle}>
                    {inlineCode}
                  </span>
                )
              }
              return (
                <code key={`${blockIndex}-${inlineIndex}`} style={inlineCodeStyle}>
                  {inlineCode}
                </code>
              )
            }
            return (
              <React.Fragment key={`${blockIndex}-${inlineIndex}`}>
                {renderTextWithBold(inlinePart, `t-${blockIndex}-${inlineIndex}`)}
              </React.Fragment>
            )
          })}
        </React.Fragment>
      )
    })
  }

  const isUser = role === 'user'
  return (
    <div
      className={isUser ? 'message-content message-content--bubble' : 'message-content message-content--plain'}
      style={{
        minWidth: 0,
        maxWidth: isUser ? '85%' : '100%',
        ...(isUser ? {
          background: '#d1f0e8',
          borderRadius: '16px',
          padding: '12px 16px',
          boxShadow: '0 1px 2px rgba(16,163,127,0.15)'
        } : {})
      }}
    >
      <div className="message-text" style={{ minWidth: 0, maxWidth: '100%', overflowX: 'hidden' }}>
        {renderContent(content)}
      </div>
    </div>
  )
}

// Same formatting as MessageContent (bold, fenced and inline code) for assignment AI review
function renderFormattedReview(text) {
  if (!text || typeof text !== 'string') return null
  const codeBlockParts = text.split(/(```[\s\S]*?```)/g)
  return codeBlockParts.map((part, blockIndex) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      const raw = part.slice(3, -3).trim()
      const firstLineEnd = raw.indexOf('\n')
      const looksLikeLang = (s) => /^[a-z0-9+#-]+$/i.test((s || '').trim()) && (s || '').trim().length < 20
      const firstLine = firstLineEnd === -1 ? raw : raw.slice(0, firstLineEnd).trim()
      const rest = firstLineEnd === -1 ? '' : raw.slice(firstLineEnd + 1).trim()
      const code = looksLikeLang(firstLine) ? rest : raw
      return (
        <div key={`rb-${blockIndex}`} style={fencedBlockStyle}>
          <pre style={preScrollStyle}>{code}</pre>
        </div>
      )
    }
    const inlineCodeParts = part.split(/(`[^`]+`)/g)
    return (
      <React.Fragment key={`rf-${blockIndex}`}>
        {inlineCodeParts.map((inlinePart, inlineIndex) => {
          if (inlinePart.startsWith('`') && inlinePart.endsWith('`')) {
            const inlineCode = inlinePart.slice(1, -1)
            if (looksLikeCodeStatement(inlineCode)) {
              const isMultiline = inlineCode.includes('\n')
              if (isMultiline) {
                return (
                  <div key={`r-${blockIndex}-${inlineIndex}`} style={fencedBlockStyle}>
                    <pre style={preScrollStyle}>{inlineCode}</pre>
                  </div>
                )
              }
              return <span key={`r-${blockIndex}-${inlineIndex}`} style={inlineStatementStyle}>{inlineCode}</span>
            }
            return (
              <code key={`r-${blockIndex}-${inlineIndex}`} style={inlineCodeStyle}>{inlineCode}</code>
            )
          }
          return <React.Fragment key={`r-${blockIndex}-${inlineIndex}`}>{renderTextWithBold(inlinePart, `r-${blockIndex}-${inlineIndex}`)}</React.Fragment>
        })}
      </React.Fragment>
    )
  })
}

const Learn = () => {
  const { topicId } = useParams()
  const topicIdRef = useRef(topicId)
  topicIdRef.current = topicId
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toasts, info: showInfo } = useToast()
  // Playtime removed: practice is inline in session via toggle; playtime URL treated as session
  const phaseParam = searchParams.get('phase') || 'session'
  const phase = phaseParam === 'playtime' ? 'session' : phaseParam
  const startFromFirst = searchParams.get('start') === '1'
  const [topic, setTopic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [courseLocked, setCourseLocked] = useState(false)
  const [lockedCourseId, setLockedCourseId] = useState(null)

  // Session phase states
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const messagesEndRef = useRef(null)

  // Session: code editor visibility — synced with fixed toggle and localStorage
  // Always show chat on load/reload; editor toggle state is not persisted for session phase
  const [showEditorInSession, setShowEditorInSession] = useState(false)

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
  const [assignmentTestResults, setAssignmentTestResults] = useState(null) // [{ passed, expected, actual, error, input }]
  const assignmentTestResultsRef = useRef(null) // persist so test block stays visible when AI review is shown
  const [assignmentReview, setAssignmentReview] = useState('')
  const [assignmentComplete, setAssignmentComplete] = useState(false)
  const [assignmentsCompletedCount, setAssignmentsCompletedCount] = useState(0)
  const [showIncompleteModal, setShowIncompleteModal] = useState(false)
  const [incompleteModalMessage, setIncompleteModalMessage] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const assignmentTextareaRef = useRef(null)

  // Feedback phase states

  // Do not auto-scroll when AI responds: user stays at message start to read from top

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
    const requestedTopicId = topicId
    const loadTopic = async () => {
      try {
        setLoading(true)
        setError(null)
        setCourseLocked(false)
        setLockedCourseId(null)

        const topicResponse = await learning.getTopic(requestedTopicId)

        // Ignore response if user navigated to a different topic (avoid stale UI / wrong topic)
        if (topicIdRef.current !== requestedTopicId) return

        // Validate response structure
        if (!topicResponse.data?.success || !topicResponse.data?.data?.topic) {
          throw new Error('Invalid topic response structure')
        }

        const topicData = topicResponse.data.data.topic
        setTopic(topicData)

        const progressPhase = topicData?.phase || phase
        if (phase === 'session') {
          setSessionComplete(false)
        }
        if (progressPhase === 'playtime' || progressPhase === 'assignment') {
          setSessionComplete(true)
        }

        if (phase === 'session') {
          // Load chat history (use requestedTopicId for the topic we're showing)
          try {
            const historyResponse = await chat.getHistory(requestedTopicId)

            if (topicIdRef.current !== requestedTopicId) return

            if (historyResponse.data.data.messages && historyResponse.data.data.messages.length > 0) {
              setMessages(historyResponse.data.data.messages)
              // Check if session is complete based on message content
              const lastMessage = historyResponse.data.data.messages[historyResponse.data.data.messages.length - 1]
              if (lastMessage.role === 'assistant' &&
                (lastMessage.content.includes('ready for the playground') ||
                  lastMessage.content.includes('Congratulations') ||
                  lastMessage.content.includes('SESSION_COMPLETE_SIGNAL'))) {
                setSessionComplete(true)
              }
            } else {
              // Start new session (backend ensures progress row exists for this topic)
              const startResponse = await learning.sessionChat(requestedTopicId, '')
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
            // Start new session on error
            try {
              const startResponse = await learning.sessionChat(requestedTopicId, '')
              if (startResponse.data.data.response) {
                const message = {
                  role: 'assistant',
                  content: startResponse.data.data.response,
                  timestamp: new Date().toISOString()
                }
                setMessages([message])
              }
            } catch (startError) {
              setError('Failed to initialize chat session')
            }
          }
        } else if (phase === 'assignment') {
          // Load assignments from topic data; resume at next task or start from 1st
          const assignmentsList = topicResponse.data.data.topic.tasks || []
          setAssignments(assignmentsList)
          const topicCompleted = topicData?.topic_completed === true
          const assignmentsCompleted = topicData?.assignments_completed ?? 0
          setAssignmentsCompletedCount(assignmentsCompleted)
          // current_task is 1-based (next task number); convert to 0-based index for assignments array
          const currentTaskOneBased = topicData?.current_task ?? 1
          const currentTaskIndex = Math.max(0, currentTaskOneBased - 1)
          // If coming from "assignment icon" on completed topic, or start=1, show 1st task
          const startIndex = (startFromFirst || topicCompleted) ? 0 : Math.min(currentTaskIndex, Math.max(0, assignmentsList.length - 1))
          setCurrentAssignment(startIndex)
          setAssignmentComplete(topicCompleted && assignmentsCompleted >= assignmentsList.length)
          if (assignmentsList.length > 0) {
            const assignment = assignmentsList[startIndex]
            const description = assignment.description || 'Complete the assignment below'
            let codeWithComments = description.startsWith('//') ? `${description}\n` : `// ${description}\n`
            if (assignment.requirements && assignment.requirements.length > 0) {
              assignment.requirements.forEach(req => {
                codeWithComments += req.startsWith('//') ? `${req}\n` : `// ${req}\n`
              })
            }
            if (assignment.solution_type !== 'function') {
              codeWithComments += `// START YOUR CODE AFTER THIS LINE. DO NOT REMOVE THIS LINE\n`
            }
            codeWithComments += assignment.starter_code || ''
            setAssignmentCode(codeWithComments)
          }
          setAssignmentOutput('')
          assignmentTestResultsRef.current = null
          setAssignmentTestResults(null)
          setAssignmentReview('')
        }

      } catch (err) {
        const status = err.response?.status
        const data = err.response?.data
        if (status === 403 && data?.code === 'COURSE_LOCKED') {
          setCourseLocked(true)
          setLockedCourseId(data?.details?.courseId || null)
          setError(null)
        } else {
          setError(data?.error || data?.message || 'Failed to load topic')
        }
      } finally {
        setLoading(false)
      }
    }

    if (topicId) {
      loadTopic()
    }
  }, [topicId, phase, startFromFirst])

  // Handle sending messages in session phase (no new messages once session is completed)
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (sessionComplete) {
      showInfo(SESSION_COMPLETE_REASON, 4000)
      return
    }
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
          response.data.data.response.includes('Congratulations') ||
          response.data.data.response.includes('SESSION_COMPLETE_SIGNAL')) {
          setSessionComplete(true)
        }
      }
    } catch (err) {
      const code = err.response?.data?.code
      const status = err.response?.status
      if ((status === 400 || status === 403) && code === 'SESSION_ALREADY_COMPLETE') {
        setMessages(prev => prev.slice(0, -1))
        setSessionComplete(true)
        showInfo(SESSION_COMPLETE_REASON, 4000)
        return
      }
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
      outputDiv.innerHTML = '<div style="color: #10a37f; font-family: Monaco, Consolas, monospace; padding: 8px;">Executing code securely...</div>'

      // Execute code using secure Web Worker
      const result = await CodeExecutor.executeForTesting(
        userCode,
        [], // No test cases for playground
        null, // No function name for playground
        'script' // Always script type for playground
      )

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
          line.includes('Warning') ? '#f59e0b' :
            line.includes('Execution completed') ? '#10a37f' : outputColor
        formattedOutput += `<div style="line-height: 1.4; color: ${color}; white-space: pre; padding-left: 2px; font-size: 0.875rem;">${line || ' '}</div>`
      })

      outputDiv.innerHTML = `
        <div style="font-family: Monaco, Consolas, 'SF Mono', 'Courier New', monospace; line-height: 1.4;">
          ${formattedOutput}
        </div>
      `

      // Set output for reference
      setPlaygroundOutput(outputText)
    } catch (error) {
      const errorDiv = `<div style="color: #ef4444; font-family: Monaco, Consolas, monospace; padding: 16px;">Error: ${error.message}</div>`
      outputDiv.innerHTML = errorDiv
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
    await copyToClipboard(userCode)
  }

  // Run: execute code and show output in terminal. Clear Submit view (test results + AI review).
  const handleRunAssignment = async () => {
    assignmentTestResultsRef.current = null
    setAssignmentTestResults(null)
    setAssignmentReview('')
    setAssignmentOutput('Executing code securely...')

    try {
      const currentTask = assignments[currentAssignment]
      const solutionType = currentTask?.solution_type || 'script'
      const functionName = currentTask?.function_name || null
      const result = await CodeExecutor.executeForTesting(
        assignmentCode,
        [],
        functionName,
        solutionType
      )

      let outputText = ''
      if (result.success) {
        const first = result.results?.[0]
        if (first && !first.passed && first.error) {
          outputText = `Error: ${first.error}`
        } else if (result.results && result.results.length > 0) {
          outputText = result.results.map(r => r.output || r.result || '').filter(Boolean).join('\n') || 'Code executed (no output)'
        } else {
          outputText = 'Code executed (no output)'
        }
      } else {
        outputText = `Error: ${result.error || 'Code execution failed'}`
      }

      setAssignmentOutput(outputText)
    } catch (error) {
      setAssignmentOutput(`Error: ${error.message}`)
    }
  }

  // Mobile: soft keyboards often don't fire keydown with correct e.key; beforeInput fires with e.data
  const AUTO_CLOSE_PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' }
  const handleAssignmentBeforeInput = (e) => {
    if (!e.data || e.data.length !== 1) return
    const ch = e.data
    if (!AUTO_CLOSE_PAIRS[ch]) return
    const textarea = e.target
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const value = assignmentCode || ''
    if (['"', "'", '`'].includes(ch)) {
      if (value.charAt(start) === ch) {
        e.preventDefault()
        requestAnimationFrame(() => {
          const ta = assignmentTextareaRef.current
          if (ta) ta.selectionStart = ta.selectionEnd = start + 1
        })
        return
      }
      const beforeCursor = value.substring(0, start)
      const quoteCount = (beforeCursor.match(new RegExp('\\' + ch, 'g')) || []).length
      if (quoteCount % 2 === 1) return
    }
    e.preventDefault()
    const closeChar = AUTO_CLOSE_PAIRS[ch]
    const selectedText = value.substring(start, end)
    const newValue = selectedText
      ? value.substring(0, start) + ch + selectedText + closeChar + value.substring(end)
      : value.substring(0, start) + ch + closeChar + value.substring(start)
    setAssignmentCode(newValue)
    const cursorPos = start + 1 + (selectedText ? selectedText.length : 0)
    requestAnimationFrame(() => {
      const ta = assignmentTextareaRef.current
      if (ta) {
        ta.focus()
        ta.selectionStart = start + 1
        ta.selectionEnd = selectedText ? cursorPos : start + 1
      }
    })
  }

  // Format test input for display: show key-value list instead of raw object
  const formatTestInput = (input) => {
    if (input == null) return null
    if (typeof input !== 'object') return [{ key: '', value: String(input) }]
    const entries = Object.entries(input)
    if (entries.length === 0) return null
    return entries.map(([k, v]) => ({
      key: k,
      value: typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v)
    }))
  }

  // Build test results text from results array (local or backend shape)
  const buildTestResultsText = (results, allPassed) => {
    if (!results?.length) return ''
    const passed = results.filter(r => r.passed).length
    const total = results.length
    let text = `Test Results: ${passed}/${total} passed\n\n`
    results.forEach((r, i) => {
      const status = r.passed ? '[PASS]' : '[FAIL]'
      const expected = r.expected ?? r.expectedOutput ?? ''
      const actual = r.output ?? r.result ?? r.error ?? 'No output'
      text += `${status} Test ${i + 1}: Input: ${JSON.stringify(r.input || {})}\n`
      text += `   Expected: ${expected}\n   Actual: ${actual}\n`
      if (!r.passed && r.error) text += `   Error: ${r.error}\n`
      text += '\n'
    })
    if (allPassed) text += 'All tests passed!\n'
    return text
  }

  // Submit: run tests (show pass/fail), persist progress when all pass. No AI review — use Review button for that.
  const handleSubmitAssignment = async () => {
    const currentTask = assignments[currentAssignment]
    const testCases = currentTask?.testCases || []
    const solutionType = currentTask?.solution_type || 'script'
    const functionName = currentTask?.function_name || null

    setAssignmentReview('') // show test results, not previous review
    try {
      setSubmitLoading(true)

      // 1. Run tests and display test case results in a clear structured format
      if (testCases.length > 0) {
        const localResult = await CodeExecutor.executeForTesting(
          assignmentCode,
          testCases,
          functionName,
          solutionType
        )
        if (localResult.error && !localResult.results?.length) {
          assignmentTestResultsRef.current = null
          setAssignmentTestResults(null)
          setAssignmentOutput(`Error: ${localResult.error}`)
          setSubmitLoading(false)
          return
        }
        const results = localResult.results || []
        const passedCount = results.filter(r => r.passed).length
        const testResultsList = results.map(r => ({
          passed: r.passed,
          expected: r.expected ?? r.expectedOutput ?? '',
          actual: r.output ?? r.result ?? r.error ?? 'No output',
          error: r.error,
          input: r.input
        }))
        setAssignmentOutput(`Test Results: ${passedCount}/${results.length} passed`)
        setAssignmentTestResults(testResultsList)
        assignmentTestResultsRef.current = testResultsList

        if (!localResult.success || !localResult.allPassed) {
          setSubmitLoading(false)
          return
        }
      } else {
        assignmentTestResultsRef.current = null
        setAssignmentTestResults(null)
        setAssignmentOutput('No test cases for this assignment.')
      }

      // 1b. Persist progress (current_task, assignments_completed) so dashboard and topic stay in sync
      try {
        await learning.completeAssignment(topicId, currentAssignment, assignmentCode)
        // Advance local count only when this was the next task in sequence (backend enforces same rule)
        if (currentAssignment === assignmentsCompletedCount) {
          setAssignmentsCompletedCount(prev => {
            const next = prev + 1
            if (next >= assignments.length) setAssignmentComplete(true)
            return next
          })
        }
      } catch (completeErr) {
        setAssignmentOutput((prev) => (prev ? `${prev}\n(Progress could not be saved: ${completeErr?.response?.data?.message || completeErr.message})` : `Progress could not be saved: ${completeErr?.response?.data?.message || completeErr.message}`))
      }
    } catch (err) {
      const body = err.response?.data
      const msg = body?.message ?? body?.error ?? (typeof body === 'string' ? body : err.message) ?? 'Request failed'
      assignmentTestResultsRef.current = null
      setAssignmentTestResults(null)
      setAssignmentOutput(`Error: ${msg}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  // Review: generate AI review only when user clicks Review (enabled only after all tests pass)
  const handleReviewAssignment = async () => {
    const currentTask = assignments[currentAssignment]
    if (!currentTask) return
    try {
      setReviewLoading(true)
      setAssignmentReview('')
      const feedbackRes = await learning.getFeedback(topicId, assignmentCode, currentTask)
      const reviewText = feedbackRes?.data?.data?.feedback || ''
      setAssignmentReview(reviewText)
    } catch (feedbackErr) {
      setAssignmentReview('Could not load AI review. Please try again.')
    } finally {
      setReviewLoading(false)
    }
  }

  // Review button: enabled only when all test cases passed (for current assignment)
  const assignmentTestResultsForReview = assignmentTestResults ?? assignmentTestResultsRef.current
  const allTestsPassedForReview = assignmentTestResultsForReview?.length > 0 && assignmentTestResultsForReview.every(r => r.passed)

  // Next: go to next assignment in topic, or next topic's session phase. When topic not complete, can only go forward if current assignment is completed.
  const canGoToNextAssignment = assignmentComplete || (currentAssignment < assignmentsCompletedCount)
  const handleNext = async () => {
    if (currentAssignment < assignments.length - 1) {
      if (!canGoToNextAssignment) {
        setIncompleteModalMessage('You need to complete and submit the current assignment before you can go to the next one. Click Submit after your code passes the tests.')
        setShowIncompleteModal(true)
        return
      }
      // More assignments in this topic — load next assignment
      const nextAssignmentIndex = currentAssignment + 1
      setCurrentAssignment(nextAssignmentIndex)
      const nextAssignment = assignments[nextAssignmentIndex]
      const description = nextAssignment.description || 'Complete the assignment below'
      let codeWithComments = description.startsWith('//') ? `${description}\n` : `// ${description}\n`
      if (nextAssignment.requirements && nextAssignment.requirements.length > 0) {
        nextAssignment.requirements.forEach(req => {
          codeWithComments += req.startsWith('//') ? `${req}\n` : `// ${req}\n`
        })
      }
      if (nextAssignment.solution_type !== 'function') {
        codeWithComments += `// START YOUR CODE AFTER THIS LINE. DO NOT REMOVE THIS LINE\n`
      }
      codeWithComments += nextAssignment.starter_code || ''
      setAssignmentCode(codeWithComments)
      setAssignmentOutput('')
      assignmentTestResultsRef.current = null
      setAssignmentTestResults(null)
      setAssignmentReview('')
    } else {
      // Last assignment — only allow next topic if all assignments completed
      if (!assignmentComplete) {
        setIncompleteModalMessage('Please complete all assignments in this topic before moving to the next topic. Submit each assignment after your code passes the tests.')
        setShowIncompleteModal(true)
        return
      }
      try {
        const coursesRes = await learning.getCourses()
        if (!coursesRes.data?.success || !coursesRes.data?.data?.courses?.length) {
          navigate('/dashboard')
          return
        }
        const courses = coursesRes.data.data.courses
        let nextTopicId = null
        for (const course of courses) {
          const topics = course.topics || []
          const idx = topics.findIndex(t => String(t.id) === String(topicId))
          if (idx !== -1 && idx < topics.length - 1) {
            nextTopicId = topics[idx + 1].id
            break
          }
        }
        if (nextTopicId) {
          navigate(`/learn/${nextTopicId}`)
        } else {
          navigate('/dashboard')
        }
      } catch (err) {
        navigate('/dashboard')
      }
    }
  }

  // Back in assignment: previous assignment or session phase if on 1st
  const handleAssignmentBack = () => {
    if (currentAssignment > 0) {
      const prevIndex = currentAssignment - 1
      setCurrentAssignment(prevIndex)
      const prevAssignment = assignments[prevIndex]
      const description = prevAssignment.description || 'Complete the assignment below'
      let codeWithComments = description.startsWith('//') ? `${description}\n` : `// ${description}\n`
      if (prevAssignment.requirements && prevAssignment.requirements.length > 0) {
        prevAssignment.requirements.forEach(req => {
          codeWithComments += req.startsWith('//') ? `${req}\n` : `// ${req}\n`
        })
      }
      if (prevAssignment.solution_type !== 'function') {
        codeWithComments += `// START YOUR CODE AFTER THIS LINE. DO NOT REMOVE THIS LINE\n`
      }
      codeWithComments += prevAssignment.starter_code || ''
      setAssignmentCode(codeWithComments)
      setAssignmentOutput('')
      assignmentTestResultsRef.current = null
      setAssignmentTestResults(null)
      setAssignmentReview('')
    } else {
      navigate(`/learn/${topicId}`)
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
    const loadingOverlayStyle = {
      position: 'fixed',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
      background: 'rgba(255,255,255,0.98)',
      zIndex: 99999
    }
    return createPortal(
      <div className="loading-container" style={loadingOverlayStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div
            className="loading-spinner"
            style={{
              width: 32,
              height: 32,
              border: '3px solid #e5e7eb',
              borderTopColor: '#10a37f',
              borderRadius: '50%',
              animation: 'loadingSpin 1s linear infinite',
              flexShrink: 0
            }}
            aria-hidden
          />
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', fontFamily: 'var(--sara-font)' }}>Loading topic...</p>
        </div>
      </div>,
      document.body
    )
  }

  if (courseLocked) {
    const unlockUrl = lockedCourseId ? `/dashboard?unlock=${encodeURIComponent(lockedCourseId)}` : '/dashboard'
    return (
      <div className="error-container" style={{ padding: 40, textAlign: 'center', maxWidth: 420, margin: '60px auto' }}>
        <div style={{ marginBottom: 16 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" style={{ margin: '0 auto' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h2 style={{ color: '#92400e', marginBottom: '8px' }}>Full access requires purchase</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Purchase the course to access this topic and all content.
        </p>
        <button
          onClick={() => navigate(unlockUrl)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Get full access
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            marginLeft: 12,
            padding: '12px 24px',
            backgroundColor: 'transparent',
            color: '#6b7280',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
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
      {/* Modal: complete all assignments before next topic */}
      {showIncompleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
          onClick={() => setShowIncompleteModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '24px',
              borderRadius: '12px',
              maxWidth: '360px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              textAlign: 'center'
            }}
            onClick={e => e.stopPropagation()}
          >
            <p style={{ margin: '0 0 16px', fontSize: '1rem', color: '#374151' }}>
              {incompleteModalMessage || 'Complete and submit the current assignment before going to the next one.'}
            </p>
            <button
              type="button"
              onClick={() => setShowIncompleteModal(false)}
              style={{
                padding: '10px 24px',
                backgroundColor: '#10a37f',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

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
            type="button"
            className="back-btn learn-sara-brand"
            onClick={() => navigate('/dashboard')}
            title="Back to Dashboard"
            aria-label="Back to Dashboard"
          >
            Sara
          </button>

          <div className="header-center">
            <span className="header-title">{topic.title}</span>
            <div className="phase-text">
              {phase === 'session' && 'Learning Session'}
              {phase === 'assignment' && `Assignment ${currentAssignment + 1} of ${assignments.length}`}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {phase === 'session' && (
              <button
                type="button"
                disabled={!sessionComplete}
                onClick={() => navigate(`/learn/${topicId}?phase=assignment`)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: sessionComplete ? '#10a37f' : '#d1d5db',
                  color: sessionComplete ? 'white' : '#9ca3af',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: sessionComplete ? 'pointer' : 'not-allowed',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--sara-font)'
                }}
                title={sessionComplete ? 'Go to code tasks' : 'Complete the session to unlock code tasks'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16,18 22,12 16,6" />
                  <polyline points="8,6 2,12 8,18" />
                </svg>
                Code
              </button>
            )}
            {phase === 'assignment' && (
              <>
                <button
                  type="button"
                  className="assignment-nav-btn assignment-back-btn"
                  onClick={handleAssignmentBack}
                  title={currentAssignment > 0 ? 'Previous assignment' : 'Back to session'}
                  aria-label={currentAssignment > 0 ? 'Previous assignment' : 'Back to session'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15,18 9,12 15,6" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="assignment-nav-btn assignment-next-btn"
                  onClick={handleNext}
                  title={
                    currentAssignment < assignments.length - 1
                      ? 'Next assignment'
                      : assignments.length > 0
                        ? 'Next topic'
                        : 'Next'
                  }
                  aria-label={
                    currentAssignment < assignments.length - 1
                      ? 'Next assignment'
                      : assignments.length > 0
                        ? 'Next topic'
                        : 'Next'
                  }
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </header>
      )}

      {/* Session chat view */}
      {phase === 'session' && !showEditorInSession && (
        <div className="session-container" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="messages-area" style={{ flex: 1, minHeight: 0, padding: '12px 16px' }}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message-row message-row--${message.role}`}
                style={{ justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}
              >
                <MessageContent content={message.content} role={message.role} />
              </div>
            ))}

            {isTyping && (
              <div className="message-row message-row--assistant" style={{ justifyContent: 'flex-start' }}>
                <div className="message-content message-content--plain">
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
            <div className="session-complete-readonly" style={{ padding: '12px 16px', background: '#f0fdf4', borderTop: '1px solid #bbf7d0', color: '#166534', fontSize: '0.875rem', textAlign: 'center' }}>
              {SESSION_COMPLETE_REASON} You can go to Assignments to practice.
            </div>
          )}
          <form className="input-form" onSubmit={handleSendMessage}>
            <textarea
              className="text-input"
              value={inputValue}
              onChange={(e) => !sessionComplete && setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (sessionComplete) {
                  e.preventDefault()
                  return
                }
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
              placeholder={sessionComplete ? 'Session completed' : 'Type your message...'}
              rows="1"
              disabled={isTyping || sessionComplete}
              readOnly={sessionComplete}
              style={sessionComplete ? { cursor: 'not-allowed', opacity: 0.8 } : undefined}
            />
            <button
              type="submit"
              className="send-btn"
              disabled={!inputValue.trim() || isTyping || sessionComplete}
              style={sessionComplete ? { cursor: 'not-allowed', opacity: 0.8 } : undefined}
            >
              Send
            </button>
          </form>
        </div>
      )}

      {phase === 'session' && showEditorInSession && (
        <SessionPlayground
          code={userCode}
          onCodeChange={setUserCode}
          onCopySuccess={() => { }}
          onRunError={() => { }}
        />
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
            {/* Editor Header - inline styles so they apply on Vercel */}
            <div className="playground-editor-header" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              minHeight: 52,
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '0.875rem',
              color: '#6b7280',
              boxSizing: 'border-box'
            }}>
              {/* File Tab */}
              <div className="assignment-js-tab" style={{
                padding: '6px 12px',
                height: 32,
                minHeight: 32,
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                borderRadius: '4px 4px 0 0',
                borderBottom: '2px solid #10a37f',
                color: '#111827',
                fontWeight: '500',
                fontSize: '0.875rem',
                fontFamily: 'var(--sara-font)',
                boxSizing: 'border-box'
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
                    height: 32,
                    minHeight: 32,
                    padding: '0 12px',
                    backgroundColor: assignmentCode.trim() ? '#10a37f' : '#d1d5db',
                    color: assignmentCode.trim() ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    fontFamily: 'var(--sara-font)',
                    cursor: assignmentCode.trim() ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    boxShadow: assignmentCode.trim() ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
                    minWidth: '60px',
                    boxSizing: 'border-box'
                  }}
                  title="Run Code (Ctrl+Enter)"
                >
                  Run
                </button>
                <button
                  onClick={handleSubmitAssignment}
                  disabled={submitLoading}
                  className="playground-reset-btn"
                  style={{
                    height: 32,
                    minHeight: 32,
                    padding: '0 12px',
                    backgroundColor: submitLoading ? '#9ca3af' : '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    fontFamily: 'var(--sara-font)',
                    cursor: submitLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    minWidth: '72px',
                    boxSizing: 'border-box'
                  }}
                  title="Run tests and save progress when all pass"
                >
                  Test
                </button>
                <button
                  onClick={handleReviewAssignment}
                  disabled={reviewLoading || !allTestsPassedForReview}
                  className="playground-review-btn"
                  style={{
                    height: 32,
                    minHeight: 32,
                    padding: '0 12px',
                    backgroundColor: (reviewLoading || !allTestsPassedForReview) ? '#d1d5db' : '#059669',
                    color: (reviewLoading || !allTestsPassedForReview) ? '#9ca3af' : 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    fontFamily: 'var(--sara-font)',
                    cursor: (reviewLoading || !allTestsPassedForReview) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: (reviewLoading || !allTestsPassedForReview) ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.1)',
                    minWidth: '72px',
                    boxSizing: 'border-box'
                  }}
                  title="Get AI review (available after all tests pass)"
                >
                  Review
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
              {/* Line Numbers - narrow width for ~4 digits (Vercel + localhost) */}
              <div className="playground-line-numbers" style={{
                width: '32px',
                minWidth: '32px',
                backgroundColor: '#f9fafb',
                borderRight: '1px solid #e5e7eb',
                padding: '16px 4px',
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
                ref={assignmentTextareaRef}
                className="playground-textarea"
                value={assignmentCode}
                onBeforeInput={handleAssignmentBeforeInput}
                onChange={(e) => {
                  const newVal = e.target.value
                  const oldVal = assignmentCode
                  // Mobile fallback: soft keyboards often don't fire keydown with e.key, so auto-close in onChange
                  if (newVal.length === oldVal.length + 1) {
                    const AUTO_CLOSE_PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' }
                    let insertIndex = -1
                    let insertedChar = ''
                    for (let i = 0; i < newVal.length; i++) {
                      if (oldVal === newVal.slice(0, i) + newVal.slice(i + 1)) {
                        insertIndex = i
                        insertedChar = newVal[i]
                        break
                      }
                    }
                    if (insertIndex !== -1 && AUTO_CLOSE_PAIRS[insertedChar]) {
                      // For quotes: don't insert closing quote if next char is already that quote (skip-over case)
                      if (['"', "'", '`'].includes(insertedChar) && newVal[insertIndex + 1] === insertedChar) {
                        setAssignmentCode(newVal)
                        requestAnimationFrame(() => {
                          const ta = assignmentTextareaRef.current
                          if (ta) {
                            ta.selectionStart = ta.selectionEnd = insertIndex + 1
                          }
                        })
                        return
                      }
                      const closeChar = AUTO_CLOSE_PAIRS[insertedChar]
                      const finalVal = newVal.slice(0, insertIndex + 1) + closeChar + newVal.slice(insertIndex + 1)
                      setAssignmentCode(finalVal)
                      const cursorPos = insertIndex + 1
                      requestAnimationFrame(() => {
                        const ta = assignmentTextareaRef.current
                        if (ta) {
                          ta.focus()
                          ta.selectionStart = ta.selectionEnd = cursorPos
                        }
                      })
                      return
                    }
                  }
                  setAssignmentCode(newVal)
                }}
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
            {/* Terminal Header - inline styles so they apply on Vercel */}
            <div className="playground-output-header" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              minHeight: 52,
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '0.875rem',
              color: '#6b7280',
              boxSizing: 'border-box'
            }}>
              <div style={{
                padding: '6px 12px',
                height: 32,
                minHeight: 32,
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                borderRadius: '4px 4px 0 0',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: '#111827',
                border: '1px solid #e5e7eb',
                borderBottom: '2px solid #10a37f',
                marginBottom: -1,
                fontFamily: 'var(--sara-font)',
                boxSizing: 'border-box'
              }}>
                {assignmentReview ? 'AI Review' : 'Test Results'}
              </div>
            </div>

            {/* Run = terminal. Test = document (test results only). Review = document (review only). */}
            {(() => {
              const testResults = assignmentTestResults ?? assignmentTestResultsRef.current
              const hasTestResults = testResults && Array.isArray(testResults) && testResults.length > 0
              const showReviewOnly = !!assignmentReview
              const isDocumentMode = hasTestResults || showReviewOnly

              if (isDocumentMode) {
                return (
                  <div
                    id="assignment-output"
                    className="assignment-review-panel"
                    style={{
                      flex: 1,
                      overflow: 'auto',
                      minHeight: 0,
                      backgroundColor: '#fafafa',
                      border: '1px solid #e5e7eb',
                      borderTop: 'none',
                      padding: '20px 24px',
                      fontSize: '0.9375rem',
                      lineHeight: 1.6,
                      color: '#374151',
                      fontFamily: 'var(--sara-font)'
                    }}
                  >
                    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
                      {showReviewOnly ? (
                        <>
                          <div style={{ color: '#111827', fontWeight: 600, marginBottom: '12px', fontSize: '0.9375rem', fontFamily: 'var(--sara-font)' }}>AI Review</div>
                          <div className="message-text" style={{ color: '#374151', fontSize: '0.9375rem', lineHeight: 1.7, fontFamily: 'var(--sara-font)' }}>
                            {renderFormattedReview(assignmentReview)}
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ color: '#6b7280', marginBottom: '16px', fontSize: '0.8125rem' }}>
                            {testResults.filter(r => r.passed).length}/{testResults.length} passed
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {testResults.map((t, i) => {
                              const inputEntries = formatTestInput(t.input)
                              return (
                                <div key={i} style={{
                                  display: 'grid',
                                  gridTemplateColumns: '24px 1fr',
                                  gap: '8px 12px',
                                  alignItems: 'start',
                                  padding: '10px 12px',
                                  backgroundColor: '#fff',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '6px',
                                  fontSize: '0.8125rem'
                                }}>
                                  <span style={{ color: t.passed ? '#10a37f' : '#ef4444', fontWeight: 600 }}>{t.passed ? '✅' : '❌'}</span>
                                  <div style={{ minWidth: 0 }}>
                                    {inputEntries && inputEntries.length > 0 && (
                                      <div style={{ color: '#6b7280', marginBottom: '6px' }}>
                                        <div style={{ marginBottom: '2px' }}>Input:</div>
                                        <div style={{ marginLeft: '8px', fontFamily: 'Monaco, Consolas, monospace', color: '#111827' }}>
                                          {inputEntries.map(({ key, value }, j) => (
                                            <div key={j}>{key ? `${key}: ${value}` : value}</div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    <div style={{ color: '#6b7280', marginBottom: '2px' }}>Expected: <span style={{ color: '#111827', fontFamily: 'Monaco, Consolas, monospace' }}>{String(t.expected ?? '')}</span></div>
                                    <div style={{ color: '#6b7280' }}>Actual: <span style={{ color: t.passed ? '#10a37f' : '#dc2626', fontFamily: 'Monaco, Consolas, monospace' }}>{String(t.actual ?? '')}</span></div>
                                    {!t.passed && t.error && <div style={{ color: '#dc2626', marginTop: '4px' }}>{t.error}</div>}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )
              }

              const outputLines = (assignmentOutput || '').split('\n')
              const isError = assignmentOutput && (assignmentOutput.startsWith('Error:') || assignmentOutput.includes('[FAIL]'))
              const lineHeightPx = 22
              const padV = 16
              const padH = 12
              return (
                <div style={{ flex: 1, display: 'flex', minHeight: 0, backgroundColor: '#1e1e1e', border: '1px solid #333', borderTop: 'none' }}>
                  <div
                    className="assignment-terminal-line-numbers"
                    style={{
                      width: '32px',
                      minWidth: '32px',
                      backgroundColor: '#2d2d2d',
                      borderRight: '1px solid #404040',
                      padding: `${padV}px 4px`,
                      fontSize: '0.8125rem',
                      color: '#6b7280',
                      fontFamily: 'Monaco, Consolas, monospace',
                      lineHeight: `${lineHeightPx}px`,
                      textAlign: 'right',
                      userSelect: 'none',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    {outputLines.map((_, i) => (
                      <div key={i} style={{ height: lineHeightPx, lineHeight: `${lineHeightPx}px` }}>{i + 1}</div>
                    ))}
                    {outputLines.length === 0 && <div style={{ height: lineHeightPx, lineHeight: `${lineHeightPx}px` }}>1</div>}
                  </div>
                  <div
                    id="assignment-output"
                    className="playground-output"
                    onScroll={(e) => {
                      const ln = e.target.parentElement.querySelector('.assignment-terminal-line-numbers')
                      if (ln) ln.scrollTop = e.target.scrollTop
                    }}
                    style={{
                      flex: 1,
                      padding: `${padV}px ${padH}px`,
                      backgroundColor: '#1e1e1e',
                      color: isError ? '#ef4444' : '#10a37f',
                      fontFamily: 'Monaco, Consolas, monospace',
                      fontSize: '0.875rem',
                      lineHeight: `${lineHeightPx}px`,
                      overflow: 'auto',
                      minHeight: 0
                    }}
                  >
                    {assignmentOutput ? (
                      outputLines.map((line, i) => (
                        <div key={i} style={{ minHeight: lineHeightPx, lineHeight: `${lineHeightPx}px`, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                          {line || ' '}
                        </div>
                      ))
                    ) : (
                      <span style={{ fontStyle: 'italic', color: '#6b7280' }}>Click &quot;Run&quot; to test your assignment code</span>
                    )}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} />
    </div>
  )
}

export default Learn