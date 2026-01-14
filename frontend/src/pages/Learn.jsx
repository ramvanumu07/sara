import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { courses } from '../data/curriculum'
import api from '../config/api'
import Terminal from '../components/Terminal'
import CodeEditor from '../components/CodeEditor'

const PHASES = {
  SESSION: 'session',
  PLAYTIME: 'playtime',
  ASSIGNMENT: 'assignment',
  FEEDBACK: 'feedback',
  COMPLETED: 'completed'
}

// Local storage keys
const getStorageKey = (topicId, subtopicId, key) =>
  `edubridge_${topicId}_${subtopicId}_${key}`

export default function Learn() {
  const { topicId, subtopicId } = useParams()
  const navigate = useNavigate()

  // Core state
  const [phase, setPhase] = useState(PHASES.SESSION)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [retrying, setRetrying] = useState(false)

  // Chat state
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Session phase
  const [conceptRevealed, setConceptRevealed] = useState(false)
  const [readyForPlaytime, setReadyForPlaytime] = useState(false)
  const [outcomes, setOutcomes] = useState([])
  const [coveredOutcomes, setCoveredOutcomes] = useState([])

  // PlayTime state
  const [terminalHistory, setTerminalHistory] = useState([])
  const [playtimeMessages, setPlaytimeMessages] = useState([])
  const [playtimeInput, setPlaytimeInput] = useState('')
  const [currentCode, setCurrentCode] = useState('')
  const [showMobileChat, setShowMobileChat] = useState(false)

  // Assignment state
  const [assignments, setAssignments] = useState([])
  const [currentAssignment, setCurrentAssignment] = useState(0)
  const [totalAssignments, setTotalAssignments] = useState(0)
  const [assignmentCode, setAssignmentCode] = useState('')
  const [assignmentStartTime, setAssignmentStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [codeOutput, setCodeOutput] = useState('')
  const [codeError, setCodeError] = useState(false)

  // Hints state
  const [showHintPanel, setShowHintPanel] = useState(false)
  const [currentHint, setCurrentHint] = useState('')
  const [hintsUsed, setHintsUsed] = useState(0)
  const [hintLoading, setHintLoading] = useState(false)

  // Feedback state
  const [feedback, setFeedback] = useState(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)

  // Notes state (loaded on demand from backend)
  const [notes, setNotes] = useState(null)
  const [notesLoading, setNotesLoading] = useState(false)
  const [showNotes, setShowNotes] = useState(false)

  // Responsive
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  // Find subtopic
  let subtopic = null, topic = null
  for (const course of courses) {
    for (const t of course.topics) {
      if (t.id === topicId) {
        topic = t
        subtopic = t.subtopics.find(s => s.id === subtopicId)
        break
      }
    }
    if (subtopic) break
  }

  // Auto-save code to localStorage
  const saveCodeLocally = useCallback((code, type = 'playtime') => {
    if (topicId && subtopicId) {
      localStorage.setItem(getStorageKey(topicId, subtopicId, `${type}_code`), code)
    }
  }, [topicId, subtopicId])

  // Load code from localStorage
  const loadLocalCode = useCallback((type = 'playtime') => {
    if (topicId && subtopicId) {
      return localStorage.getItem(getStorageKey(topicId, subtopicId, `${type}_code`)) || ''
    }
    return ''
  }, [topicId, subtopicId])

  useEffect(() => {
    if (subtopic) loadState()
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [topicId, subtopicId])

  // Load notes on demand when entering playtime
  async function fetchNotes() {
    if (notes || notesLoading) return
    setNotesLoading(true)
    try {
      const res = await api.get(`/api/learn/notes/${topicId}/${subtopicId}`)
      if (res.data.success && res.data.notes) {
        setNotes(res.data.notes)
      }
    } catch (err) {
      console.error('Failed to fetch notes:', err)
    } finally {
      setNotesLoading(false)
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, playtimeMessages])

  useEffect(() => {
    if (!sending) inputRef.current?.focus()
  }, [sending, phase])

  // Timer for assignments
  useEffect(() => {
    let interval
    if (phase === PHASES.ASSIGNMENT && assignmentStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - assignmentStartTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [phase, assignmentStartTime])

  // Auto-save code periodically
  useEffect(() => {
    if (phase === PHASES.PLAYTIME && currentCode) {
      const saveTimer = setTimeout(() => {
        saveCodeLocally(currentCode, 'playtime')
        // Also save to server (debounced)
        api.post('/api/learn/playtime/save', { topicId, subtopicId, code: currentCode }).catch(() => { })
      }, 2000)
      return () => clearTimeout(saveTimer)
    }
  }, [currentCode, phase, topicId, subtopicId, saveCodeLocally])

  useEffect(() => {
    if (phase === PHASES.ASSIGNMENT && assignmentCode) {
      const saveTimer = setTimeout(() => {
        saveCodeLocally(assignmentCode, 'assignment')
      }, 1000)
      return () => clearTimeout(saveTimer)
    }
  }, [assignmentCode, phase, saveCodeLocally])

  // API call with retry
  async function apiCall(method, url, data, options = {}) {
    const { retries = 2, showError = true } = options

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        setError(null)
        const response = method === 'get'
          ? await api.get(url)
          : await api.post(url, data)
        return response
      } catch (err) {
        console.error(`API call attempt ${attempt + 1} failed:`, err)

        if (attempt === retries) {
          const errorMsg = err.response?.data?.message || 'Something went wrong. Please try again.'
          if (showError) setError(errorMsg)
          throw err
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
      }
    }
  }

  async function loadState() {
    setLoading(true)
    setError(null)
    try {
      const res = await apiCall('get', `/api/learn/state/${topicId}/${subtopicId}`)

      if (res.data.success) {
        if (!res.data.exists) {
          await startSession()
        } else {
          setPhase(res.data.phase)
          setConceptRevealed(res.data.conceptRevealed)
          setCurrentAssignment(res.data.currentAssignment)
          setTotalAssignments(res.data.totalAssignments)
          setMessages(res.data.messages || [])
          setAssignments(res.data.assignments || [])
          setHintsUsed(res.data.hintsUsed || 0)

          // Load saved code from server or localStorage
          const serverCode = res.data.savedCode
          const localCode = loadLocalCode(res.data.phase === PHASES.ASSIGNMENT ? 'assignment' : 'playtime')
          setCurrentCode(serverCode || localCode)
          setAssignmentCode(serverCode || localCode)

          // If in assignment phase, start timer
          if (res.data.phase === PHASES.ASSIGNMENT) {
            setAssignmentStartTime(Date.now())
          }
        }
      } else {
        await startSession()
      }
    } catch (error) {
      console.error('Failed to load state:', error)
      // Try to recover from localStorage
      const localMessages = localStorage.getItem(getStorageKey(topicId, subtopicId, 'messages'))
      if (localMessages) {
        try {
          setMessages(JSON.parse(localMessages))
          setPhase(PHASES.SESSION)
        } catch {
          await startSession()
        }
      } else {
        await startSession()
      }
    } finally {
      setLoading(false)
    }
  }

  async function startSession() {
    try {
      // Handle empty assignments
      const taskList = subtopic?.tasks && subtopic.tasks.length > 0
        ? subtopic.tasks
        : ['Practice the concept with a simple example']

      const res = await apiCall('post', '/api/learn/session/start', {
        topicId,
        subtopicId,
        subtopicTitle: subtopic.title,
        assignments: taskList
      })

      if (res.data.success) {
        setPhase(PHASES.SESSION)
        const newMessages = [{ role: 'assistant', content: res.data.message }]
        setMessages(newMessages)
        setConceptRevealed(false)
        setReadyForPlaytime(false)
        setTotalAssignments(taskList.length)

        // Set outcomes for tracking
        if (res.data.outcomes) {
          setOutcomes(res.data.outcomes)
        }
        if (res.data.progress?.covered) {
          setCoveredOutcomes(res.data.progress.covered)
        }

        // Save to localStorage for recovery
        localStorage.setItem(getStorageKey(topicId, subtopicId, 'messages'), JSON.stringify(newMessages))
      }
    } catch (error) {
      console.error('Failed to start session:', error)
      setMessages([{
        role: 'assistant',
        content: 'Sorry, there was an error starting the session. Please try again.'
      }])
    }
  }

  async function sendSessionMessage(e) {
    e?.preventDefault()
    if (!input.trim() || sending) return

    const userMessage = input.trim()
    setInput('')
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setSending(true)
    setError(null)

    try {
      const res = await apiCall('post', '/api/learn/session/chat', {
        topicId,
        subtopicId,
        message: userMessage,
        subtopicTitle: subtopic.title
      })

      if (res.data.success) {
        const updatedMessages = [...newMessages, { role: 'assistant', content: res.data.response }]
        setMessages(updatedMessages)
        setConceptRevealed(res.data.conceptRevealed)
        setReadyForPlaytime(res.data.readyForPlaytime || res.data.isComplete)

        // Update outcomes progress
        if (res.data.outcomes) {
          setOutcomes(res.data.outcomes)
        }
        if (res.data.progress?.covered) {
          setCoveredOutcomes(res.data.progress.covered)
        }

        // Save to localStorage
        localStorage.setItem(getStorageKey(topicId, subtopicId, 'messages'), JSON.stringify(updatedMessages))
      }
    } catch {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.'
      }])
    }
    setSending(false)
  }

  async function enterPlaytime() {
    setLoading(true)
    setError(null)
    // Fetch notes in parallel with starting playtime
    fetchNotes()
    try {
      const res = await apiCall('post', '/api/learn/playtime/start', {
        topicId,
        subtopicId,
        subtopicTitle: subtopic.title
      })

      if (res.data.success) {
        setPhase(PHASES.PLAYTIME)
        setPlaytimeMessages([{ role: 'assistant', content: res.data.message }])
        setTerminalHistory(res.data.terminalHistory || [])

        // Load saved code
        const serverCode = res.data.savedCode
        const localCode = loadLocalCode('playtime')
        setCurrentCode(serverCode || localCode)
      }
    } catch (error) {
      console.error('Failed to enter playtime:', error)
    }
    setLoading(false)
  }

  async function executeCode(code) {
    try {
      const res = await api.post('/api/learn/playtime/execute', {
        topicId,
        subtopicId,
        code
      })
      setCurrentCode(code)
      saveCodeLocally(code, 'playtime')
      return { output: res.data.output, isError: res.data.isError }
    } catch {
      return { output: 'Execution failed. Please try again.', isError: true }
    }
  }

  async function sendPlaytimeMessage(e) {
    e?.preventDefault()
    if (!playtimeInput.trim() || sending) return

    const userMessage = playtimeInput.trim()
    setPlaytimeInput('')
    setPlaytimeMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setSending(true)

    try {
      const res = await apiCall('post', '/api/learn/playtime/chat', {
        topicId,
        subtopicId,
        message: userMessage,
        subtopicTitle: subtopic.title,
        currentCode
      })

      if (res.data.success) {
        setPlaytimeMessages(prev => [...prev, { role: 'assistant', content: res.data.response }])
      }
    } catch {
      setPlaytimeMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.'
      }])
    }
    setSending(false)
  }

  async function startAssignments() {
    setLoading(true)
    setError(null)
    try {
      const taskList = subtopic?.tasks && subtopic.tasks.length > 0
        ? subtopic.tasks
        : ['Practice the concept with a simple example']

      const res = await apiCall('post', '/api/learn/assignment/start', {
        topicId,
        subtopicId,
        assignments: taskList
      })

      if (res.data.success) {
        setPhase(PHASES.ASSIGNMENT)
        setCurrentAssignment(res.data.currentAssignment)
        setTotalAssignments(res.data.totalAssignments)
        setAssignmentStartTime(Date.now())
        setElapsedTime(0)
        setAssignmentCode(loadLocalCode('assignment'))
        setCodeOutput('')
        setCodeError(false)
        setHintsUsed(0)
        setCurrentHint('')
        setShowHintPanel(false)
      }
    } catch (error) {
      console.error('Failed to start assignments:', error)
    }
    setLoading(false)
  }

  async function runAssignmentCode() {
    if (!assignmentCode.trim()) return

    try {
      const res = await api.post('/api/learn/assignment/run', {
        topicId,
        subtopicId,
        code: assignmentCode
      })

      setCodeOutput(res.data.output)
      setCodeError(res.data.isError)
    } catch {
      setCodeOutput('Execution failed. Please try again.')
      setCodeError(true)
    }
  }

  async function getHint() {
    if (hintLoading) return

    setHintLoading(true)
    setShowHintPanel(true)

    try {
      const res = await apiCall('post', '/api/learn/assignment/hint', {
        topicId,
        subtopicId,
        assignmentTitle: subtopic?.tasks?.[currentAssignment] || 'Current assignment',
        currentCode: assignmentCode,
        hintLevel: hintsUsed + 1
      })

      if (res.data.success) {
        setCurrentHint(res.data.hint)
        setHintsUsed(res.data.hintsUsed)
      }
    } catch (error) {
      setCurrentHint('Could not get hint. Please try again.')
    }
    setHintLoading(false)
  }

  async function submitAssignment() {
    if (!assignmentCode.trim()) return
    setLoading(true)

    try {
      const res = await apiCall('post', '/api/learn/assignment/submit', {
        topicId,
        subtopicId,
        code: assignmentCode,
        assignmentIndex: currentAssignment
      })

      if (res.data.success) {
        setPhase(PHASES.FEEDBACK)
        await generateFeedback()
      }
    } catch (error) {
      console.error('Failed to submit:', error)
    }
    setLoading(false)
  }

  async function generateFeedback() {
    setFeedbackLoading(true)
    try {
      const res = await apiCall('post', '/api/learn/feedback/generate', {
        topicId,
        subtopicId,
        assignmentIndex: currentAssignment,
        subtopicTitle: subtopic.title,
        assignmentTitle: subtopic?.tasks?.[currentAssignment] || 'Assignment'
      })

      if (res.data.success) {
        setFeedback(res.data.feedback)
      }
    } catch (error) {
      console.error('Failed to generate feedback:', error)
      setFeedback({
        testResults: { passed: 0, total: 1, failedTests: [] },
        codeQuality: {},
        review: 'Could not generate feedback. Please try again.',
        suggestions: []
      })
    }
    setFeedbackLoading(false)
  }

  async function continueToNext() {
    setLoading(true)
    try {
      const res = await apiCall('post', '/api/learn/feedback/continue', {
        topicId,
        subtopicId
      })

      if (res.data.success) {
        if (res.data.completed) {
          setPhase(PHASES.COMPLETED)
          // Clear local storage for this lesson
          localStorage.removeItem(getStorageKey(topicId, subtopicId, 'assignment_code'))
          localStorage.removeItem(getStorageKey(topicId, subtopicId, 'playtime_code'))
        } else {
          setPhase(PHASES.ASSIGNMENT)
          setCurrentAssignment(res.data.currentAssignment)
          setAssignmentStartTime(Date.now())
          setElapsedTime(0)
          setAssignmentCode('')
          setCodeOutput('')
          setCodeError(false)
          setFeedback(null)
          setHintsUsed(0)
          setCurrentHint('')
          setShowHintPanel(false)
        }
      }
    } catch (error) {
      console.error('Failed to continue:', error)
    }
    setLoading(false)
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  async function retryLastAction() {
    setRetrying(true)
    setError(null)
    await loadState()
    setRetrying(false)
  }

  if (!subtopic) {
    return (
      <div style={styles.errorContainer}>
        <p>Lesson not found</p>
        <button onClick={() => navigate('/dashboard')} style={styles.backLink}>Go back</button>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner} />
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Error Banner */}
      {error && (
        <div style={styles.errorBanner}>
          <span>{error}</span>
          <button onClick={retryLastAction} disabled={retrying} style={styles.retryButton}>
            {retrying ? 'Retrying...' : 'Retry'}
          </button>
        </div>
      )}

      {/* Header */}
      <header style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {!isMobile && <span>Dashboard</span>}
        </button>

        <div style={styles.headerCenter}>
          <span style={styles.headerTitle}>{subtopic.title}</span>
          <div style={styles.phaseIndicator}>
            {Object.values(PHASES).filter(p => p !== 'completed').map((p, i) => (
              <div key={p} style={{
                ...styles.phaseDot,
                background: phase === p ? '#10a37f' :
                  Object.values(PHASES).indexOf(phase) > i ? '#a8e6cf' : '#e5e7eb'
              }}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.phaseLabel}>
          {phase === PHASES.SESSION && '📖 Session'}
          {phase === PHASES.PLAYTIME && '🎮 PlayTime'}
          {phase === PHASES.ASSIGNMENT && `📝 ${currentAssignment + 1}/${totalAssignments}`}
          {phase === PHASES.FEEDBACK && '✨ Feedback'}
          {phase === PHASES.COMPLETED && '🎉 Complete'}
        </div>
      </header>

      {/* SESSION PHASE */}
      {phase === PHASES.SESSION && (
        <div style={styles.sessionContainer}>
          <div style={styles.messagesArea}>
            {messages.map((msg, i) => (
              <div key={i} style={styles.messageRow}>
                <div style={{
                  ...styles.avatar,
                  background: msg.role === 'user' ? '#e5e7eb' : '#d1fae5'
                }}>
                  {msg.role === 'user' ? 'Y' : '🌱'}
                </div>
                <div style={styles.messageContent}>
                  <span style={styles.messageRole}>
                    {msg.role === 'user' ? 'You' : 'EduBridge'}
                  </span>
                  <div style={styles.messageText}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {sending && (
              <div style={styles.messageRow}>
                <div style={{ ...styles.avatar, background: '#d1fae5' }}>🌱</div>
                <div style={styles.typingDots}>
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {readyForPlaytime && (
            <div style={styles.transitionBanner}>
              <span>🎮 Ready for hands-on practice?</span>
              <button onClick={enterPlaytime} style={styles.transitionBtn}>
                Enter PlayTime
              </button>
            </div>
          )}

          <form onSubmit={sendSessionMessage} style={styles.inputForm}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendSessionMessage(e)}
              placeholder="Type your message..."
              style={styles.textInput}
              rows={1}
              disabled={sending}
            />
            <button type="submit" disabled={!input.trim() || sending} style={styles.sendBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* PLAYTIME PHASE */}
      {phase === PHASES.PLAYTIME && (
        <div style={{
          ...styles.playtimeContainer,
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          {/* Mobile toggle */}
          {isMobile && (
            <div style={styles.mobileToggle}>
              <button
                onClick={() => setShowMobileChat(false)}
                style={{
                  ...styles.mobileToggleBtn,
                  background: !showMobileChat ? '#10a37f' : '#f3f4f6',
                  color: !showMobileChat ? 'white' : '#374151'
                }}
              >
                💻 Terminal
              </button>
              <button
                onClick={() => setShowMobileChat(true)}
                style={{
                  ...styles.mobileToggleBtn,
                  background: showMobileChat ? '#10a37f' : '#f3f4f6',
                  color: showMobileChat ? 'white' : '#374151'
                }}
              >
                💬 AI Help
              </button>
            </div>
          )}

          {/* Terminal */}
          <div style={{
            ...styles.playtimeLeft,
            display: isMobile && showMobileChat ? 'none' : 'flex'
          }}>
            <Terminal
              onExecute={executeCode}
              history={terminalHistory}
              initialCode={currentCode}
            />
          </div>

          {/* Chat Panel */}
          <div style={{
            ...styles.playtimeRight,
            display: isMobile && !showMobileChat ? 'none' : 'flex',
            width: isMobile ? '100%' : 360,
            borderLeft: isMobile ? 'none' : '1px solid #e5e7eb'
          }}>
            <div style={styles.playtimeHeader}>
              <span>💬 AI Assistant</span>
              <button
                onClick={() => setShowNotes(!showNotes)}
                style={{
                  ...styles.notesToggleBtn,
                  background: showNotes ? '#10a37f' : 'transparent'
                }}
                title="View Notes"
              >
                📝 {notesLoading ? '...' : 'Notes'}
              </button>
            </div>

            {/* Notes Panel */}
            {showNotes && (
              <div style={styles.notesPanel}>
                <div style={styles.notesPanelHeader}>
                  <span>📝 Quick Reference</span>
                  <button onClick={() => setShowNotes(false)} style={styles.notesPanelClose}>×</button>
                </div>
                <div style={styles.notesPanelContent}>
                  {notesLoading ? (
                    <div style={styles.notesLoading}>Loading notes...</div>
                  ) : notes ? (
                    <ReactMarkdown>{notes}</ReactMarkdown>
                  ) : (
                    <p style={styles.noNotes}>No notes available for this topic.</p>
                  )}
                </div>
              </div>
            )}

            <div style={styles.playtimeMessages}>
              {playtimeMessages.map((msg, i) => (
                <div key={i} style={{
                  ...styles.playtimeMessage,
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.role === 'user' ? '#e5e7eb' : '#d1fae5'
                }}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ))}
              {sending && (
                <div style={{ ...styles.playtimeMessage, background: '#d1fae5', alignSelf: 'flex-start' }}>
                  <div style={styles.typingDots}><span /><span /><span /></div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendPlaytimeMessage} style={styles.playtimeInputForm}>
              <input
                value={playtimeInput}
                onChange={e => setPlaytimeInput(e.target.value)}
                placeholder="Ask about your code..."
                style={styles.playtimeInput}
                disabled={sending}
              />
              <button type="submit" disabled={!playtimeInput.trim() || sending} style={styles.playtimeSendBtn}>
                →
              </button>
            </form>

            <button onClick={startAssignments} style={styles.readyBtn}>
              Ready for Assignments →
            </button>
          </div>
        </div>
      )}

      {/* ASSIGNMENT PHASE */}
      {phase === PHASES.ASSIGNMENT && (
        <div style={styles.assignmentContainer}>
          <div style={styles.assignmentHeader}>
            <div style={styles.assignmentInfo}>
              <span style={styles.assignmentNumber}>Assignment {currentAssignment + 1} of {totalAssignments}</span>
              <h2 style={styles.assignmentTitle}>
                {subtopic?.tasks?.[currentAssignment] || 'Complete the task'}
              </h2>
            </div>
            <div style={styles.headerActions}>
              <button onClick={getHint} disabled={hintLoading} style={styles.hintButton}>
                💡 Hint {hintsUsed > 0 && `(${hintsUsed})`}
              </button>
              <div style={styles.timerBox}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span style={styles.timerText}>{formatTime(elapsedTime)}</span>
              </div>
            </div>
          </div>

          {/* Hint Panel */}
          {showHintPanel && (
            <div style={styles.hintPanel}>
              <div style={styles.hintHeader}>
                <span>💡 Hint (Level {Math.min(hintsUsed, 3)})</span>
                <button onClick={() => setShowHintPanel(false)} style={styles.hintCloseBtn}>×</button>
              </div>
              <div style={styles.hintContent}>
                {hintLoading ? (
                  <div style={styles.hintLoading}>
                    <div style={styles.loadingSpinner} />
                    <span>Getting hint...</span>
                  </div>
                ) : (
                  <p>{currentHint}</p>
                )}
              </div>
              {hintsUsed < 3 && !hintLoading && (
                <button onClick={getHint} style={styles.moreHintBtn}>
                  Get More Help →
                </button>
              )}
            </div>
          )}

          <div style={styles.assignmentProgress}>
            {Array.from({ length: totalAssignments }).map((_, i) => (
              <div key={i} style={{
                ...styles.progressDot,
                background: i < currentAssignment ? '#10a37f' :
                  i === currentAssignment ? '#fbbf24' : '#e5e7eb'
              }} />
            ))}
          </div>

          <div style={styles.codeEditorContainer}>
            <CodeEditor
              value={assignmentCode}
              onChange={setAssignmentCode}
              height="250px"
              placeholder="// Write your JavaScript code here..."
              showRunButton={true}
              onRun={runAssignmentCode}
            />
          </div>

          {/* Output Panel */}
          {codeOutput && (
            <div style={{
              ...styles.outputPanel,
              borderColor: codeError ? '#ef4444' : '#10a37f'
            }}>
              <div style={styles.outputHeader}>
                <span>{codeError ? '❌ Error' : '✅ Output'}</span>
              </div>
              <pre style={styles.outputContent}>{codeOutput}</pre>
            </div>
          )}

          <div style={styles.assignmentActions}>
            <button
              onClick={runAssignmentCode}
              disabled={!assignmentCode.trim()}
              style={styles.runBtn}
            >
              ▶ Run Code
            </button>
            <button
              onClick={submitAssignment}
              disabled={!assignmentCode.trim()}
              style={{
                ...styles.submitBtn,
                opacity: !assignmentCode.trim() ? 0.5 : 1
              }}
            >
              Submit Assignment
            </button>
          </div>
        </div>
      )}

      {/* FEEDBACK PHASE */}
      {phase === PHASES.FEEDBACK && (
        <div style={styles.feedbackContainer}>
          {feedbackLoading ? (
            <div style={styles.feedbackLoading}>
              <div style={styles.loadingSpinner} />
              <span>Analyzing your code...</span>
            </div>
          ) : feedback && (
            <>
              <div style={styles.feedbackHeader}>
                <h2>Assignment {currentAssignment + 1} Feedback</h2>
                <span style={styles.timeTaken}>
                  Time: {formatTime(elapsedTime)} | Hints: {hintsUsed}
                </span>
              </div>

              {/* Test Results */}
              <div style={styles.feedbackSection}>
                <h3 style={styles.sectionTitle}>🧪 Test Results</h3>
                <div style={styles.testResults}>
                  <div style={{
                    ...styles.testScore,
                    background: feedback.testResults.passed === feedback.testResults.total
                      ? '#d1fae5' : '#fef3c7'
                  }}>
                    <span style={styles.testScoreNumber}>
                      {feedback.testResults.passed}/{feedback.testResults.total}
                    </span>
                    <span style={styles.testScoreLabel}>Tests Passed</span>
                  </div>

                  {feedback.testResults.failedTests?.length > 0 && (
                    <div style={styles.failedTests}>
                      <span style={styles.failedTestsTitle}>Failed Tests:</span>
                      {feedback.testResults.failedTests.map((test, i) => (
                        <div key={i} style={styles.failedTest}>
                          <span style={styles.testName}>❌ {test.name}</span>
                          <span style={styles.testDetail}>Expected: {test.expected}</span>
                          <span style={styles.testDetail}>Got: {test.actual}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Code Quality Checklist */}
              <div style={styles.feedbackSection}>
                <h3 style={styles.sectionTitle}>✅ Code Quality</h3>
                <div style={{
                  ...styles.checklist,
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)'
                }}>
                  {[
                    { key: 'codeReadability', label: 'Code Readability' },
                    { key: 'usesConstOverLet', label: 'Uses const over let' },
                    { key: 'meaningfulNames', label: 'Meaningful variable names' },
                    { key: 'noRedundantCode', label: 'No redundant code' },
                    { key: 'properIndentation', label: 'Proper indentation' },
                    { key: 'followsConventions', label: 'Follows conventions' },
                    { key: 'optimalSolution', label: 'Optimal solution' }
                  ].map(item => (
                    <div key={item.key} style={styles.checklistItem}>
                      <span style={{
                        ...styles.checkIcon,
                        color: feedback.codeQuality[item.key] ? '#10a37f' : '#ef4444'
                      }}>
                        {feedback.codeQuality[item.key] ? '✓' : '✗'}
                      </span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Review */}
              <div style={styles.feedbackSection}>
                <h3 style={styles.sectionTitle}>💬 Review</h3>
                <p style={styles.reviewText}>{feedback.review}</p>

                {feedback.suggestions?.length > 0 && (
                  <div style={styles.suggestions}>
                    <span style={styles.suggestionsTitle}>Suggestions:</span>
                    <ul style={styles.suggestionsList}>
                      {feedback.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button onClick={continueToNext} style={styles.continueBtn}>
                {currentAssignment + 1 < totalAssignments
                  ? 'Continue to Next Assignment →'
                  : 'Complete Lesson 🎉'}
              </button>
            </>
          )}
        </div>
      )}

      {/* COMPLETED PHASE */}
      {phase === PHASES.COMPLETED && (
        <div style={styles.completedContainer}>
          <div style={styles.completedContent}>
            <span style={styles.completedEmoji}>🎉</span>
            <h2 style={styles.completedTitle}>Congratulations!</h2>
            <p style={styles.completedText}>
              You've completed all assignments for "{subtopic.title}"
            </p>
            <button onClick={() => navigate('/dashboard')} style={styles.backToDashboardBtn}>
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#fafafa'
  },

  // Error Banner
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: '#fef2f2',
    borderBottom: '1px solid #fecaca',
    color: '#dc2626'
  },
  retryButton: {
    padding: '6px 16px',
    background: '#dc2626',
    border: 'none',
    borderRadius: 6,
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer'
  },

  // Header
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: 'white',
    borderBottom: '1px solid #e5e7eb',
    flexShrink: 0
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    background: '#f3f4f6',
    border: 'none',
    borderRadius: 8,
    color: '#374151',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer'
  },
  headerCenter: {
    textAlign: 'center'
  },
  headerTitle: {
    display: 'block',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#111'
  },
  phaseIndicator: {
    display: 'flex',
    gap: 8,
    marginTop: 8,
    justifyContent: 'center'
  },
  phaseDot: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: 'white'
  },
  phaseLabel: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#6b7280'
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },

  // Session Phase
  sessionContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },

  messagesArea: {
    flex: 1,
    overflow: 'auto',
    padding: 20,
    maxWidth: 800,
    margin: '0 auto',
    width: '100%'
  },
  messageRow: {
    display: 'flex',
    gap: 12,
    marginBottom: 16
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    fontWeight: 600,
    flexShrink: 0
  },
  messageContent: {
    flex: 1
  },
  messageRole: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600,
    marginBottom: 4,
    color: '#111'
  },
  messageText: {
    fontSize: '0.925rem',
    lineHeight: 1.6,
    color: '#374151'
  },
  typingDots: {
    display: 'flex',
    gap: 4,
    padding: '8px 0'
  },
  transitionBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
    background: '#d1fae5',
    borderTop: '1px solid #a7f3d0'
  },
  transitionBtn: {
    padding: '10px 24px',
    background: '#10a37f',
    border: 'none',
    borderRadius: 8,
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer'
  },
  inputForm: {
    display: 'flex',
    gap: 8,
    padding: 16,
    background: 'white',
    borderTop: '1px solid #e5e7eb',
    maxWidth: 800,
    margin: '0 auto',
    width: '100%'
  },
  textInput: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    fontSize: '0.925rem',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit'
  },
  sendBtn: {
    padding: '12px 16px',
    background: '#10a37f',
    border: 'none',
    borderRadius: 12,
    color: 'white',
    cursor: 'pointer'
  },

  // Mobile Toggle
  mobileToggle: {
    display: 'flex',
    padding: 8,
    gap: 8,
    background: 'white',
    borderBottom: '1px solid #e5e7eb'
  },
  mobileToggleBtn: {
    flex: 1,
    padding: '10px 16px',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer'
  },

  // PlayTime Phase
  playtimeContainer: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden'
  },
  playtimeLeft: {
    flex: 1,
    padding: 16,
    overflow: 'hidden',
    display: 'flex'
  },
  playtimeRight: {
    width: 360,
    borderLeft: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    background: 'white',
    position: 'relative'
  },
  playtimeHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.9rem',
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  notesToggleBtn: {
    padding: '4px 10px',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    fontSize: '0.75rem',
    cursor: 'pointer',
    color: '#374151',
    transition: 'all 0.2s'
  },
  notesPanel: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    bottom: 120,
    background: 'white',
    borderBottom: '1px solid #e5e7eb',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column'
  },
  notesPanelHeader: {
    padding: '10px 16px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 600,
    fontSize: '0.85rem'
  },
  notesPanelClose: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#6b7280'
  },
  notesPanelContent: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
    fontSize: '0.85rem',
    lineHeight: 1.6
  },
  notesLoading: {
    color: '#6b7280',
    fontStyle: 'italic'
  },
  noNotes: {
    color: '#6b7280',
    fontStyle: 'italic'
  },
  playtimeMessages: {
    flex: 1,
    overflow: 'auto',
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  playtimeMessage: {
    padding: '10px 14px',
    borderRadius: 12,
    maxWidth: '85%',
    fontSize: '0.875rem',
    lineHeight: 1.5
  },
  playtimeInputForm: {
    display: 'flex',
    gap: 8,
    padding: 12,
    borderTop: '1px solid #e5e7eb'
  },
  playtimeInput: {
    flex: 1,
    padding: '10px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: 20,
    fontSize: '0.875rem',
    outline: 'none'
  },
  playtimeSendBtn: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#10a37f',
    border: 'none',
    color: 'white',
    fontSize: '1.1rem',
    cursor: 'pointer'
  },
  readyBtn: {
    margin: 12,
    padding: '14px 20px',
    background: '#10a37f',
    border: 'none',
    borderRadius: 10,
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer'
  },

  // Assignment Phase
  assignmentContainer: {
    flex: 1,
    padding: 24,
    maxWidth: 900,
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto'
  },
  assignmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12
  },
  assignmentInfo: {
    flex: 1
  },
  assignmentNumber: {
    fontSize: '0.8rem',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  assignmentTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#111',
    marginTop: 4
  },
  hintButton: {
    padding: '8px 16px',
    background: '#fef3c7',
    border: '1px solid #fcd34d',
    borderRadius: 8,
    color: '#92400e',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer'
  },
  timerBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 10
  },
  timerText: {
    fontSize: '1.1rem',
    fontWeight: 600,
    fontFamily: 'monospace'
  },

  // Hint Panel
  hintPanel: {
    background: '#fffbeb',
    border: '1px solid #fcd34d',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden'
  },
  hintHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: '#fef3c7',
    borderBottom: '1px solid #fcd34d'
  },
  hintCloseBtn: {
    width: 24,
    height: 24,
    border: 'none',
    background: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#92400e'
  },
  hintContent: {
    padding: 16
  },
  hintLoading: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  moreHintBtn: {
    display: 'block',
    width: '100%',
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    borderTop: '1px solid #fcd34d',
    color: '#92400e',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'center'
  },

  assignmentProgress: {
    display: 'flex',
    gap: 6,
    marginBottom: 20
  },
  progressDot: {
    flex: 1,
    height: 4,
    borderRadius: 2
  },
  codeEditorContainer: {
    marginBottom: 16
  },

  // Output Panel
  outputPanel: {
    background: '#1e1e1e',
    borderRadius: 8,
    marginBottom: 16,
    border: '2px solid',
    overflow: 'hidden'
  },
  outputHeader: {
    padding: '8px 12px',
    background: '#2d2d2d',
    fontSize: '0.8rem',
    color: '#888'
  },
  outputContent: {
    padding: 12,
    margin: 0,
    color: '#d4d4d4',
    fontSize: '0.85rem',
    fontFamily: "'SF Mono', Monaco, 'Courier New', monospace",
    whiteSpace: 'pre-wrap',
    maxHeight: 150,
    overflow: 'auto'
  },

  assignmentActions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end'
  },
  runBtn: {
    padding: '14px 24px',
    background: '#374151',
    border: 'none',
    borderRadius: 10,
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer'
  },
  submitBtn: {
    padding: '14px 32px',
    background: '#10a37f',
    border: 'none',
    borderRadius: 10,
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer'
  },

  // Feedback Phase
  feedbackContainer: {
    flex: 1,
    overflow: 'auto',
    padding: 24,
    maxWidth: 800,
    margin: '0 auto',
    width: '100%'
  },
  feedbackLoading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 16,
    color: '#6b7280'
  },
  feedbackHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 12
  },
  timeTaken: {
    fontSize: '0.9rem',
    color: '#6b7280'
  },
  feedbackSection: {
    background: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    border: '1px solid #e5e7eb'
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    marginBottom: 16
  },
  testResults: {
    display: 'flex',
    gap: 20,
    flexWrap: 'wrap'
  },
  testScore: {
    padding: 20,
    borderRadius: 10,
    textAlign: 'center',
    minWidth: 100
  },
  testScoreNumber: {
    display: 'block',
    fontSize: '2rem',
    fontWeight: 700
  },
  testScoreLabel: {
    fontSize: '0.8rem',
    color: '#6b7280'
  },
  failedTests: {
    flex: 1
  },
  failedTestsTitle: {
    fontSize: '0.85rem',
    fontWeight: 600,
    display: 'block',
    marginBottom: 8
  },
  failedTest: {
    padding: 10,
    background: '#fef2f2',
    borderRadius: 6,
    marginBottom: 8
  },
  testName: {
    display: 'block',
    fontWeight: 500,
    marginBottom: 4
  },
  testDetail: {
    display: 'block',
    fontSize: '0.8rem',
    color: '#6b7280'
  },
  checklist: {
    display: 'grid',
    gap: 12
  },
  checklistItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    background: '#f9fafb',
    borderRadius: 8
  },
  checkIcon: {
    fontSize: '1.1rem',
    fontWeight: 700
  },
  reviewText: {
    lineHeight: 1.7,
    color: '#374151'
  },
  suggestions: {
    marginTop: 16,
    padding: 16,
    background: '#fffbeb',
    borderRadius: 8
  },
  suggestionsTitle: {
    fontWeight: 600,
    marginBottom: 8,
    display: 'block'
  },
  suggestionsList: {
    marginLeft: 20,
    lineHeight: 1.8
  },
  continueBtn: {
    width: '100%',
    padding: '16px 32px',
    background: '#10a37f',
    border: 'none',
    borderRadius: 12,
    color: 'white',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8
  },

  // Completed Phase
  completedContainer: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  completedContent: {
    textAlign: 'center',
    padding: 40
  },
  completedEmoji: {
    fontSize: '4rem',
    marginBottom: 16,
    display: 'block'
  },
  completedTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: 8
  },
  completedText: {
    color: '#6b7280',
    marginBottom: 32
  },
  backToDashboardBtn: {
    padding: '14px 32px',
    background: '#10a37f',
    border: 'none',
    borderRadius: 10,
    color: 'white',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer'
  },

  // Shared
  loadingContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    color: '#6b7280'
  },
  loadingSpinner: {
    width: 32,
    height: 32,
    border: '3px solid #e5e7eb',
    borderTopColor: '#10a37f',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16
  },
  backLink: {
    color: '#10a37f',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: 500
  }
}
