import { useState, useRef, useEffect } from 'react'

export default function Terminal({ onExecute, history = [], disabled = false, initialCode = '' }) {
  const [code, setCode] = useState(initialCode)
  const [localHistory, setLocalHistory] = useState([])
  const terminalRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (history.length > 0) {
      setLocalHistory(history)
    }
  }, [history])

  // Set initial code when provided
  useEffect(() => {
    if (initialCode && !code) {
      setCode(initialCode)
    }
  }, [initialCode])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [localHistory])

  const handleExecute = async () => {
    if (!code.trim() || disabled) return

    const command = code.trim()
    setCode('')

    // Add command to local history
    setLocalHistory(prev => [...prev, { command, output: null, isError: false, pending: true }])

    try {
      const result = await onExecute(command)
      setLocalHistory(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          command,
          output: result.output,
          isError: result.isError,
          pending: false
        }
        return updated
      })
    } catch (error) {
      setLocalHistory(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          command,
          output: 'Error executing code',
          isError: true,
          pending: false
        }
        return updated
      })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleExecute()
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerDots}>
          <span style={{ ...styles.dot, background: '#ff5f57' }} />
          <span style={{ ...styles.dot, background: '#ffbd2e' }} />
          <span style={{ ...styles.dot, background: '#28ca42' }} />
        </div>
        <span style={styles.headerTitle}>JavaScript Terminal</span>
      </div>

      <div ref={terminalRef} style={styles.output}>
        <div style={styles.welcome}>
          <span style={styles.welcomeText}>🎮 EduBridge Playground</span>
          <span style={styles.welcomeHint}>Type JavaScript code and press Enter to run</span>
        </div>

        {localHistory.map((item, i) => (
          <div key={i} style={styles.historyItem}>
            <div style={styles.commandLine}>
              <span style={styles.prompt}>›</span>
              <pre style={styles.command}>{item.command}</pre>
            </div>
            {item.pending ? (
              <div style={styles.pending}>Running...</div>
            ) : item.output && (
              <pre style={{
                ...styles.outputText,
                color: item.isError ? '#ff6b6b' : '#a8e6cf'
              }}>
                {item.output}
              </pre>
            )}
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <span style={styles.inputPrompt}>›</span>
        <textarea
          ref={inputRef}
          value={code}
          onChange={e => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your code here..."
          style={styles.input}
          disabled={disabled}
          rows={3}
        />
        <button
          onClick={handleExecute}
          disabled={!code.trim() || disabled}
          style={{
            ...styles.runBtn,
            opacity: !code.trim() || disabled ? 0.5 : 1,
            cursor: !code.trim() || disabled ? 'not-allowed' : 'pointer'
          }}
        >
          Run
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: '#1a1a2e',
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid #2d2d44'
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 14px',
    background: '#16162a',
    borderBottom: '1px solid #2d2d44'
  },
  headerDots: {
    display: 'flex',
    gap: 6
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%'
  },
  headerTitle: {
    fontSize: '0.8rem',
    color: '#6b6b8d',
    fontWeight: 500
  },

  output: {
    flex: 1,
    overflow: 'auto',
    padding: 16,
    fontFamily: "'SF Mono', Monaco, 'Courier New', monospace",
    fontSize: '0.875rem'
  },

  welcome: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1px solid #2d2d44'
  },
  welcomeText: {
    color: '#a8e6cf',
    fontSize: '0.9rem',
    fontWeight: 600
  },
  welcomeHint: {
    color: '#6b6b8d',
    fontSize: '0.75rem'
  },

  historyItem: {
    marginBottom: 12
  },
  commandLine: {
    display: 'flex',
    gap: 8,
    alignItems: 'flex-start'
  },
  prompt: {
    color: '#a8e6cf',
    fontWeight: 700,
    flexShrink: 0
  },
  command: {
    margin: 0,
    color: '#e8e8f0',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all'
  },
  pending: {
    color: '#6b6b8d',
    fontStyle: 'italic',
    paddingLeft: 20,
    marginTop: 4
  },
  outputText: {
    margin: 0,
    paddingLeft: 20,
    marginTop: 4,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all'
  },

  inputArea: {
    display: 'flex',
    gap: 8,
    padding: 12,
    background: '#16162a',
    borderTop: '1px solid #2d2d44',
    alignItems: 'flex-start'
  },
  inputPrompt: {
    color: '#a8e6cf',
    fontWeight: 700,
    fontFamily: "'SF Mono', Monaco, 'Courier New', monospace",
    paddingTop: 8
  },
  input: {
    flex: 1,
    background: '#1a1a2e',
    border: '1px solid #2d2d44',
    borderRadius: 6,
    padding: '8px 12px',
    color: '#e8e8f0',
    fontFamily: "'SF Mono', Monaco, 'Courier New', monospace",
    fontSize: '0.875rem',
    resize: 'none',
    outline: 'none'
  },
  runBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    background: '#10a37f',
    border: 'none',
    borderRadius: 6,
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: 600,
    transition: 'all 0.2s'
  }
}





