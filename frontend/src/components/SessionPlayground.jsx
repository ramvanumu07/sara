/**
 * Full session playground: same layout and features as Learn session editor.
 * - Resizable splitter (desktop: side-by-side, mobile: stacked)
 * - Indentation (Tab, Enter, Backspace), auto-closing brackets/quotes
 * - Scroll sync for line numbers, formatted terminal output with error styling
 * - Run via CodeExecutor, Copy with optional toast
 */
import React, { useState, useRef, useEffect } from 'react'
import CodeExecutor from '../services/CodeExecutor'

const AUTO_CLOSING_PAIRS = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' }

export default function SessionPlayground({
  code,
  onCodeChange,
  placeholder = "Practice what you learned in the session - try out the concepts here!",
  onCopySuccess,
  onRunError
}) {
  const terminalOutputRef = useRef(null)
  const editorTextareaRef = useRef(null)
  const [editorHeight, setEditorHeight] = useState(60)
  const [editorWidth, setEditorWidth] = useState(60)
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' && window.innerWidth >= 768)
  const [isDragging, setIsDragging] = useState(false)
  const [copyButtonLabel, setCopyButtonLabel] = useState('Copy')
  const resetCode = () => {
    if (onCodeChange) onCodeChange('')
    setCopyButtonLabel('Copy')
  }

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Reset "Copied!" back to "Copy" when code changes
  useEffect(() => {
    setCopyButtonLabel('Copy')
  }, [code])

  const runPlayground = async () => {
    const outputDiv = terminalOutputRef.current
    if (!outputDiv || !code?.trim()) return
    try {
      // Pre-run syntax check: show syntax errors in terminal (engine would throw same error)
      try {
        new Function(code)
      } catch (parseErr) {
        if (parseErr instanceof SyntaxError) {
          const lineNumDiv = outputDiv.parentElement?.querySelector('.terminal-line-numbers')
          if (lineNumDiv) lineNumDiv.innerHTML = '<div style="line-height: 1.4; color: #6b7280; text-align: right; padding-right: 8px; font-size: 0.875rem;">1</div>'
          outputDiv.innerHTML = `<div style="font-family: Monaco, Consolas, monospace; line-height: 1.4;"><div style="color: #ef4444; white-space: pre; padding-left: 2px; font-size: 0.875rem;">Syntax error: ${escapeHtml(parseErr.message)}</div></div>`
          if (onRunError) onRunError(parseErr.message)
          return
        }
        throw parseErr
      }

      outputDiv.innerHTML = '<div style="color: #10a37f; font-family: Monaco, Consolas, monospace; padding: 8px;">Executing code securely...</div>'
      const lineNumDiv = outputDiv.parentElement?.querySelector('.terminal-line-numbers')
      if (lineNumDiv) lineNumDiv.innerHTML = ''

      const result = await CodeExecutor.executeForTesting(code, [], null, 'script')

      let outputText = ''
      let outputColor = '#10a37f'
      if (result.success) {
        if (result.results?.length > 0) {
          const outputs = result.results.map(r => (r.error ? `Error: ${r.error}` : (r.output || r.result || ''))).filter(Boolean)
          outputText = outputs.length ? outputs.join('\n') : 'Code executed successfully (no output)'
        } else {
          outputText = 'Code executed successfully (no output)'
        }
      } else {
        outputText = `Error: ${result.error || 'Code execution failed'}`
        outputColor = '#ef4444'
      }

      const outputLines = outputText.split('\n')
      if (lineNumDiv) {
        lineNumDiv.innerHTML = outputLines.map((_, i) =>
          `<div style="line-height: 1.4; color: #6b7280; text-align: right; padding-right: 8px; font-size: 0.875rem;">${i + 1}</div>`
        ).join('')
      }
      const formatted = outputLines.map(line => {
        const color = line.includes('Error:') ? '#ef4444' : line.includes('Warning') ? '#f59e0b' : outputColor
        return `<div style="line-height: 1.4; color: ${color}; white-space: pre; padding-left: 2px; font-size: 0.875rem;">${escapeHtml(String(line || ' '))}</div>`
      }).join('')
      outputDiv.innerHTML = `<div style="font-family: Monaco, Consolas, 'SF Mono', 'Courier New', monospace; line-height: 1.4;">${formatted}</div>`

      if (!result.success && onRunError) onRunError('Code execution failed. Check the output for details.')
    } catch (err) {
      const msg = err?.message || 'Code execution failed'
      outputDiv.innerHTML = `<div style="color: #ef4444; font-family: Monaco, Consolas, monospace; padding: 16px;">Error: ${escapeHtml(msg)}</div>`
      const lineNumDiv = outputDiv.parentElement?.querySelector('.terminal-line-numbers')
      if (lineNumDiv) lineNumDiv.innerHTML = '<div style="line-height: 1.4; color: #6b7280; text-align: right; padding-right: 8px; font-size: 0.875rem;">1</div>'
      if (onRunError) onRunError('Code execution failed. Please check your syntax.')
    }
  }

  const copyCode = async () => {
    if (!code?.trim()) return
    try {
      await navigator.clipboard.writeText(code)
      setCopyButtonLabel('Copied!')
      if (onCopySuccess) onCopySuccess()
    } catch (e) {
      if (onRunError) onRunError('Copy failed.')
    }
  }

  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)
    const container = e.currentTarget.parentElement
    if (isDesktop) {
      const startX = e.clientX
      const startWidth = editorWidth
      const containerWidth = container.clientWidth
      const handleMouseMove = (ev) => {
        const deltaPercent = ((ev.clientX - startX) / containerWidth) * 100
        setEditorWidth(Math.min(Math.max(startWidth + deltaPercent, 30), 70))
      }
      const handleMouseUp = () => {
        setIsDragging(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    } else {
      const startY = e.clientY
      const startHeight = editorHeight
      const containerHeight = container.clientHeight
      const handleMouseMove = (ev) => {
        const deltaPercent = ((ev.clientY - startY) / containerHeight) * 100
        setEditorHeight(Math.min(Math.max(startHeight + deltaPercent, 30), 70))
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

  const handleTouchStart = (e) => {
    e.preventDefault()
    setIsDragging(true)
    const touch = e.touches[0]
    const container = e.currentTarget.parentElement
    if (isDesktop) {
      const startX = touch.clientX
      const startWidth = editorWidth
      const containerWidth = container.clientWidth
      const handleTouchMove = (ev) => {
        ev.preventDefault()
        const deltaPercent = ((ev.touches[0].clientX - startX) / containerWidth) * 100
        setEditorWidth(Math.min(Math.max(startWidth + deltaPercent, 30), 70))
      }
      const handleTouchEnd = () => {
        setIsDragging(false)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
      }
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
    } else {
      const startY = touch.clientY
      const startHeight = editorHeight
      const containerHeight = container.clientHeight
      const handleTouchMove = (ev) => {
        ev.preventDefault()
        const deltaPercent = ((ev.touches[0].clientY - startY) / containerHeight) * 100
        setEditorHeight(Math.min(Math.max(startHeight + deltaPercent, 30), 70))
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

  // Mobile: many soft keyboards don't fire keydown with correct e.key; beforeInput fires with e.data
  const handleBeforeInput = (e) => {
    if (!e.data || e.data.length !== 1) return
    const ch = e.data
    if (!AUTO_CLOSING_PAIRS[ch]) return
    const textarea = e.target
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const value = code || ''
    // Quotes: skip over if next char is already that quote
    if (['"', "'", '`'].includes(ch)) {
      if (value.charAt(start) === ch) {
        e.preventDefault()
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1
        })
        return
      }
      const beforeCursor = value.substring(0, start)
      const quoteCount = (beforeCursor.match(new RegExp('\\' + ch, 'g')) || []).length
      if (quoteCount % 2 === 1) return // closing, let default
    }
    e.preventDefault()
    const closeChar = AUTO_CLOSING_PAIRS[ch]
    const selectedText = value.substring(start, end)
    const newValue = selectedText
      ? value.substring(0, start) + ch + selectedText + closeChar + value.substring(end)
      : value.substring(0, start) + ch + closeChar + value.substring(start)
    onCodeChange(newValue)
    const cursorPos = start + 1 + (selectedText ? selectedText.length : 0)
    requestAnimationFrame(() => {
      const ta = editorTextareaRef.current
      if (ta) {
        ta.focus()
        ta.selectionStart = start + 1
        ta.selectionEnd = selectedText ? cursorPos : start + 1
      }
    })
  }

  const handleKeyDown = (e) => {
    const textarea = e.target
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const value = code || ''

    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault()
      runPlayground()
      return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      const newValue = value.substring(0, start) + '    ' + value.substring(end)
      onCodeChange(newValue)
      setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start + 4 }, 0)
      return
    }
    if (AUTO_CLOSING_PAIRS[e.key]) {
      const nextChar = value.charAt(start)
      if (['"', "'", '`'].includes(e.key)) {
        if (nextChar === e.key) {
          e.preventDefault()
          setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start + 1 }, 0)
          return
        }
        const beforeCursor = value.substring(0, start)
        const quoteCount = (beforeCursor.match(new RegExp('\\' + e.key, 'g')) || []).length
        if (quoteCount % 2 === 1) return
      }
      e.preventDefault()
      const openChar = e.key
      const closeChar = AUTO_CLOSING_PAIRS[e.key]
      const selectedText = value.substring(start, end)
      if (selectedText) {
        const newValue = value.substring(0, start) + openChar + selectedText + closeChar + value.substring(end)
        onCodeChange(newValue)
        setTimeout(() => {
          textarea.selectionStart = start + 1
          textarea.selectionEnd = start + 1 + selectedText.length
        }, 0)
      } else {
        const newValue = value.substring(0, start) + openChar + closeChar + value.substring(start)
        onCodeChange(newValue)
        setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start + 1 }, 0)
      }
      return
    }
    if ([')', ']', '}'].includes(e.key)) {
      const nextChar = value.charAt(start)
      if (nextChar === e.key) {
        e.preventDefault()
        setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start + 1 }, 0)
      }
      return
    }
    if (e.key === 'Backspace' && start === end) {
      const beforeCursor = value.substring(0, start)
      const currentLineStart = beforeCursor.lastIndexOf('\n') + 1
      const currentLine = beforeCursor.substring(currentLineStart)
      const isAtIndentEnd = /^\s+$/.test(currentLine) && currentLine.length > 0
      const hasEnoughSpaces = currentLine.length >= 4 && currentLine.endsWith('    ')
      if (isAtIndentEnd && hasEnoughSpaces) {
        e.preventDefault()
        const newValue = value.substring(0, start - 4) + value.substring(start)
        onCodeChange(newValue)
        setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start - 4 }, 0)
      }
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      const beforeCursor = value.substring(0, start)
      const currentLineStart = beforeCursor.lastIndexOf('\n') + 1
      const currentLine = beforeCursor.substring(currentLineStart)
      const currentIndent = (currentLine.match(/^(\s*)/) || ['', ''])[1]
      let newIndent = currentIndent
      if (currentLine.trim().endsWith('{') ||
        /\b(if|else|for|while|do|switch|case|function|try|catch|finally)\s*\([^)]*\)\s*$/.test(currentLine.trim()) ||
        /\b(else|try|finally)\s*$/.test(currentLine.trim()) ||
        /\bcase\s+.+:\s*$/.test(currentLine.trim()) ||
        /\bdefault\s*:\s*$/.test(currentLine.trim())) {
        newIndent += '    '
      }
      const afterCursor = value.substring(start)
      const nextChar = afterCursor.charAt(0)
      if (nextChar === '}') {
        const reducedIndent = newIndent.length >= 4 ? newIndent.substring(4) : ''
        const newValue = value.substring(0, start) + '\n' + newIndent + '\n' + reducedIndent + value.substring(start)
        onCodeChange(newValue)
        setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start + 1 + newIndent.length }, 0)
      } else {
        const newValue = value.substring(0, start) + '\n' + newIndent + value.substring(start)
        onCodeChange(newValue)
        setTimeout(() => { textarea.selectionStart = textarea.selectionEnd = start + 1 + newIndent.length }, 0)
      }
    }
  }

  const lineCount = (code || '').split('\n').length

  return (
    <div
      className="playground-main-content"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: isDesktop ? 'row' : 'column',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden'
      }}
    >
      {/* Editor Panel */}
      <div
        className="playground-editor-panel"
        style={{
          ...(isDesktop ? { width: `${editorWidth}%`, height: '100%', minWidth: '300px' } : { height: `${editorHeight}%`, minHeight: '200px' }),
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div
          className="playground-editor-header"
          style={{
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
          }}
        >
          <div className="playground-editor-header-tab" style={{ padding: '6px 12px', height: 32, minHeight: 32, display: 'inline-flex', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: '4px 4px 0 0', borderBottom: '2px solid #10a37f', color: '#111827', fontWeight: 500, fontSize: '0.875rem', boxSizing: 'border-box' }}>
            playground.js
          </div>
          <div className="playground-header-actions" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={runPlayground}
              className="playground-run-btn"
              disabled={!code?.trim()}
              title="Run (Ctrl+Enter)"
              style={{
                width: 32,
                height: 32,
                minWidth: 32,
                minHeight: 32,
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: code?.trim() ? '#10a37f' : '#e5e7eb',
                color: code?.trim() ? 'white' : '#9ca3af',
                border: 'none',
                borderRadius: '6px',
                cursor: code?.trim() ? 'pointer' : 'not-allowed',
                boxSizing: 'border-box'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <button
              type="button"
              onClick={copyCode}
              className="playground-copy-btn"
              disabled={!code?.trim()}
              title={copyButtonLabel === 'Copied!' ? 'Copied!' : 'Copy code'}
              style={{
                width: 32,
                height: 32,
                minWidth: 32,
                minHeight: 32,
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: copyButtonLabel === 'Copied!' ? '#d1fae5' : '#f3f4f6',
                color: copyButtonLabel === 'Copied!' ? '#059669' : (code?.trim() ? '#374151' : '#9ca3af'),
                border: 'none',
                borderRadius: '6px',
                cursor: code?.trim() ? 'pointer' : 'not-allowed',
                boxSizing: 'border-box'
              }}
            >
              {copyButtonLabel === 'Copied!' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              )}
            </button>
            <button
              type="button"
              onClick={resetCode}
              className="playground-reset-btn"
              title="Reset (clear code)"
              style={{
                width: 32,
                height: 32,
                minWidth: 32,
                minHeight: 32,
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: '300px', display: 'flex', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
          <div
            className="playground-line-numbers"
            style={{
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
              flexShrink: 0
            }}
          >
            {(code || '').split('\n').map((_, index) => (
              <div key={index} style={{ lineHeight: '1.4', fontSize: '0.875rem' }}>{index + 1}</div>
            ))}
          </div>
          <textarea
            ref={editorTextareaRef}
            className="playground-textarea"
            value={code || ''}
            onBeforeInput={handleBeforeInput}
            onChange={(e) => {
              const newVal = e.target.value
              const oldVal = code || ''
              // Mobile: soft keyboards often don't fire keydown with e.key, so auto-close in onChange
              if (newVal.length === oldVal.length + 1) {
                let insertIndex = -1
                let insertedChar = ''
                for (let i = 0; i < newVal.length; i++) {
                  if (oldVal === newVal.slice(0, i) + newVal.slice(i + 1)) {
                    insertIndex = i
                    insertedChar = newVal[i]
                    break
                  }
                }
                if (insertIndex !== -1 && AUTO_CLOSING_PAIRS[insertedChar]) {
                  if (['"', "'", '`'].includes(insertedChar) && newVal[insertIndex + 1] === insertedChar) {
                    onCodeChange(newVal)
                    requestAnimationFrame(() => {
                      const ta = editorTextareaRef.current
                      if (ta) ta.selectionStart = ta.selectionEnd = insertIndex + 1
                    })
                    return
                  }
                  const closeChar = AUTO_CLOSING_PAIRS[insertedChar]
                  const finalVal = newVal.slice(0, insertIndex + 1) + closeChar + newVal.slice(insertIndex + 1)
                  onCodeChange(finalVal)
                  requestAnimationFrame(() => {
                    const ta = editorTextareaRef.current
                    if (ta) {
                      ta.focus()
                      ta.selectionStart = ta.selectionEnd = insertIndex + 1
                    }
                  })
                  return
                }
              }
              onCodeChange(newVal)
            }}
            onScroll={(e) => {
              const lineNumbers = e.target.parentElement?.querySelector('.playground-line-numbers')
              if (lineNumbers) lineNumbers.scrollTop = e.target.scrollTop
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
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
          ...(isDesktop ? { width: '8px', height: '100%', cursor: 'col-resize' } : { height: '8px', width: '100%', cursor: 'row-resize' }),
          backgroundColor: isDragging ? '#e5e7eb' : 'transparent',
          position: 'relative',
          flexShrink: 0,
          transition: isDragging ? 'none' : 'background-color 0.2s ease'
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            ...(isDesktop ? { width: '2px', height: '40px' } : { width: '40px', height: '2px' }),
            backgroundColor: '#9ca3af',
            borderRadius: '1px',
            opacity: isDragging ? 1 : 0.5
          }}
        />
      </div>

      {/* Terminal Panel */}
      <div
        className="playground-output-panel"
        style={{
          ...(isDesktop ? { width: `${100 - editorWidth}%`, height: '100%', minWidth: '200px' } : { height: `${100 - editorHeight}%`, minHeight: '100px' }),
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#ffffff',
          overflow: 'hidden'
        }}
      >
        <div
          className="playground-output-header"
          style={{
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
          }}
        >
          <div className="playground-output-header-tab" style={{ padding: '6px 12px', height: 32, minHeight: 32, display: 'inline-flex', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: '4px 4px 0 0', fontSize: '0.875rem', fontWeight: 500, color: '#111827', border: '1px solid #e5e7eb', borderBottom: '2px solid #10a37f', marginBottom: -1, boxSizing: 'border-box' }}>
            Terminal Output
          </div>
        </div>

        <div style={{ flex: 1, backgroundColor: '#1e1e1e', border: '1px solid #333', borderTop: 'none', display: 'flex', minHeight: 0 }}>
          <div
            className="terminal-line-numbers"
            style={{
              width: '32px',
              minWidth: '32px',
              backgroundColor: '#2d2d2d',
              borderRight: '1px solid #404040',
              padding: '16px 4px',
              fontSize: '0.875rem',
              color: '#6b7280',
              fontFamily: 'Monaco, Consolas, "SF Mono", "Courier New", monospace',
              lineHeight: '1.4',
              textAlign: 'right',
              userSelect: 'none',
              overflow: 'hidden',
              flexShrink: 0
            }}
          />
          <div
            ref={terminalOutputRef}
            className="playground-output"
            onScroll={(e) => {
              const lineNumbers = e.target.parentElement?.querySelector('.terminal-line-numbers')
              if (lineNumbers) lineNumbers.scrollTop = e.target.scrollTop
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
            <div style={{ color: '#6b7280', fontStyle: 'italic' }}>Click "Run" to execute your code. Syntax errors will appear here when you run invalid code.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
