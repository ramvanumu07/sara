import { useCallback, useEffect, useRef } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'

export default function CodeEditor({
  value,
  onChange,
  placeholder = "// Write your JavaScript code here...",
  readOnly = false,
  height = "300px",
  onRun,
  showRunButton = false
}) {
  const editorRef = useRef(null)

  const handleKeyDown = useCallback((e) => {
    // Ctrl/Cmd + Enter to run code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && onRun) {
      e.preventDefault()
      onRun()
    }
  }, [onRun])

  return (
    <div style={styles.container} onKeyDown={handleKeyDown}>
      <div style={styles.header}>
        <span style={styles.headerText}>JavaScript</span>
        {showRunButton && onRun && (
          <button onClick={onRun} style={styles.runButton}>
            ▶ Run (Ctrl+Enter)
          </button>
        )}
      </div>
      <CodeMirror
        ref={editorRef}
        value={value}
        height={height}
        theme={oneDark}
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: false,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
          tabSize: 2
        }}
        style={styles.editor}
      />
    </div>
  )
}

const styles = {
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid #2d2d2d',
    background: '#1e1e1e'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 16px',
    background: '#2d2d2d',
    borderBottom: '1px solid #3d3d3d'
  },
  headerText: {
    color: '#888',
    fontSize: '0.8rem',
    fontWeight: 500
  },
  runButton: {
    padding: '4px 12px',
    background: '#10a37f',
    border: 'none',
    borderRadius: 4,
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 4
  },
  editor: {
    fontSize: '0.9rem'
  }
}



















