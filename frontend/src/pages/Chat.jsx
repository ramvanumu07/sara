import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courses } from '../data/curriculum'
import api from '../config/api'

export default function Chat() {
  const { topicId, subtopicId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState('session')
  const [currentTask, setCurrentTask] = useState(0)
  const [totalTasks, setTotalTasks] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Find subtopic across all courses
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

  useEffect(() => {
    if (subtopic) loadChat()
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [topicId, subtopicId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [loading])

  async function loadChat() {
    try {
      const res = await api.get(`/api/chat/history/${topicId}/${subtopicId}`)
      if (res.data.success && res.data.messages.length > 0) {
        setMessages(res.data.messages)
        setPhase(res.data.phase)
        setCurrentTask(res.data.currentTask || 0)
        setTotalTasks(subtopic.tasks?.length || 0)
      } else {
        startNewLesson()
      }
    } catch {
      startNewLesson()
    }
  }

  async function startNewLesson() {
    setLoading(true)
    try {
      const res = await api.post('/api/chat/start', { 
        topicId, 
        subtopicId, 
        subtopicTitle: subtopic.title,
        tasks: subtopic.tasks 
      })
      if (res.data.success) {
        setMessages([{ role: 'assistant', content: res.data.message }])
        setPhase('session')
        setCurrentTask(0)
        setTotalTasks(res.data.totalTasks || subtopic.tasks?.length || 0)
      }
    } catch (err) {
      console.error('Failed to start lesson:', err)
    }
    setLoading(false)
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await api.post('/api/chat/message', {
        topicId, subtopicId, message: userMessage,
        subtopicTitle: subtopic.title, tasks: subtopic.tasks
      })
      if (res.data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }])
        setPhase(res.data.phase)
        setCurrentTask(res.data.currentTask || 0)
        setTotalTasks(res.data.totalTasks || subtopic.tasks?.length || 0)
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    }
    setLoading(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(e)
    }
  }

  if (!subtopic) {
    return (
      <div style={styles.errorContainer}>
        <p>Lesson not found</p>
        <button onClick={() => navigate('/dashboard')} style={styles.backLink}>Go back</button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {!isMobile && <span>Back</span>}
        </button>
        <div style={styles.headerCenter}>
          <span style={styles.headerTitle}>{subtopic.title}</span>
          <span style={styles.headerPhase}>
            {phase === 'session' ? '📖 Session Phase' : phase === 'completed' ? '✅ Completed' : `📝 Task ${currentTask + 1}/${totalTasks}`}
          </span>
        </div>
        <button onClick={startNewLesson} style={styles.restartBtn} title="Restart">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
          </svg>
          {!isMobile && <span>Restart</span>}
        </button>
      </header>

      {/* Messages */}
      <div style={styles.messagesContainer}>
        <div style={{ ...styles.messagesInner, maxWidth: isMobile ? '100%' : 800 }}>
          {messages.map((msg, i) => (
            <div key={i} style={styles.messageRow}>
              <div style={styles.messageWrapper}>
                <div style={{
                  ...styles.avatar,
                  background: msg.role === 'user' ? '#e5e7eb' : '#d1fae5',
                  color: msg.role === 'user' ? '#6b7280' : '#10a37f'
                }}>
                  {msg.role === 'user' ? 'Y' : '🌱'}
                </div>
                <div style={styles.messageContent}>
                  <span style={styles.messageRole}>{msg.role === 'user' ? 'You' : 'EduBridge'}</span>
                  <div style={styles.messageText}>{msg.content}</div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div style={styles.messageRow}>
              <div style={styles.messageWrapper}>
                <div style={{ ...styles.avatar, background: '#d1fae5', color: '#10a37f' }}>🌱</div>
                <div style={styles.messageContent}>
                  <span style={styles.messageRole}>EduBridge</span>
                  <div style={styles.typingIndicator}>
                    <span style={styles.dot} />
                    <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
                    <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Tasks Progress */}
      {phase === 'assignment' && subtopic.tasks && (
        <div style={styles.tasksPanel}>
          <div style={{ ...styles.tasksPanelInner, maxWidth: isMobile ? '100%' : 800 }}>
            <span style={styles.tasksLabel}>Progress: {currentTask}/{totalTasks} tasks</span>
            <div style={styles.tasksList}>
              {subtopic.tasks.map((task, i) => (
                <span key={i} style={{
                  ...styles.taskChip,
                  background: i < currentTask ? '#d1fae5' : i === currentTask ? '#fef3c7' : 'var(--sidebar-bg)',
                  color: i < currentTask ? '#047857' : i === currentTask ? '#92400e' : 'var(--text-secondary)',
                  borderColor: i < currentTask ? '#a7f3d0' : i === currentTask ? '#fcd34d' : 'var(--border-color)',
                  fontWeight: i === currentTask ? 600 : 500
                }}>
                  {i < currentTask ? '✓' : (i + 1)}. {task.length > 30 ? task.substring(0, 30) + '...' : task}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div style={styles.inputContainer}>
        <form onSubmit={sendMessage} style={{ ...styles.inputForm, maxWidth: isMobile ? '100%' : 800 }}>
          <div style={styles.inputWrapper}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              style={styles.input}
              rows={1}
              disabled={loading}
            />
            <button
              type="submit"
              style={{
                ...styles.sendBtn,
                background: input.trim() && !loading ? 'var(--accent)' : 'var(--border-color)',
                color: input.trim() && !loading ? 'white' : 'var(--text-muted)',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed'
              }}
              disabled={!input.trim() || loading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: { height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--main-bg)' },

  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-color)', background: 'white'
  },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 0.75rem',
    background: 'var(--sidebar-bg)', border: '1px solid var(--border-color)',
    borderRadius: 8, color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500
  },
  headerCenter: { textAlign: 'center', flex: 1, minWidth: 0, padding: '0 0.5rem' },
  headerTitle: {
    display: 'block', fontSize: '0.95rem', fontWeight: 600,
    color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
  },
  headerPhase: { fontSize: '0.75rem', color: 'var(--text-muted)' },
  restartBtn: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '0.5rem 0.75rem',
    background: 'var(--sidebar-bg)', border: '1px solid var(--border-color)',
    borderRadius: 8, color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500
  },

  messagesContainer: { flex: 1, overflow: 'auto', background: '#fafafa' },
  messagesInner: { margin: '0 auto', padding: '1.25rem' },
  messageRow: { marginBottom: '1.25rem', animation: 'fadeIn 0.3s ease' },
  messageWrapper: { display: 'flex', gap: '0.875rem', alignItems: 'flex-start' },
  avatar: {
    width: 34, height: 34, borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600, flexShrink: 0
  },
  messageContent: { flex: 1, minWidth: 0 },
  messageRole: { display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-primary)' },
  messageText: {
    fontSize: '0.925rem', lineHeight: 1.7, color: 'var(--text-primary)',
    whiteSpace: 'pre-wrap', wordBreak: 'break-word'
  },
  typingIndicator: { display: 'flex', gap: 5, padding: '0.5rem 0' },
  dot: {
    width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', animation: 'pulse 1s infinite'
  },

  tasksPanel: { borderTop: '1px solid var(--border-color)', background: 'white', padding: '0.875rem 1rem' },
  tasksPanelInner: { margin: '0 auto' },
  tasksLabel: { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginRight: '0.75rem' },
  tasksList: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' },
  taskChip: {
    padding: '0.35rem 0.75rem', borderRadius: 16, fontSize: '0.75rem',
    fontWeight: 500, border: '1px solid'
  },

  inputContainer: { padding: '0.875rem 1rem 1.25rem', background: 'white', borderTop: '1px solid var(--border-color)' },
  inputForm: { margin: '0 auto' },
  inputWrapper: {
    display: 'flex', alignItems: 'center', gap: '0.625rem',
    padding: '0.75rem 0.875rem', background: 'var(--sidebar-bg)',
    border: '1px solid var(--border-color)', borderRadius: 12
  },
  input: {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: 'var(--text-primary)', fontSize: '0.925rem', lineHeight: 1.5,
    resize: 'none', maxHeight: 120, fontFamily: 'inherit'
  },
  sendBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 34, height: 34, border: 'none', borderRadius: 8, flexShrink: 0, transition: 'all 0.2s'
  },

  errorContainer: {
    height: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '1rem', color: 'var(--text-secondary)'
  },
  backLink: { color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 500 }
}
