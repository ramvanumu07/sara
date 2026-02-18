import React, { useState, useRef } from 'react'
import { copyToClipboard } from '../utils/copyToClipboard'

/**
 * Shared play-phase editor: code panel (playground.js, Run, Copy, code area) + terminal output panel.
 * Same UI used from Dashboard or Learn session. onRun(code) returns { output, isError }.
 */
export default function PlayEditor({ code, onCodeChange, onRun, placeholder = '// Write your code here...' }) {
  const [output, setOutput] = useState('')
  const [outputError, setOutputError] = useState(false)
  const [running, setRunning] = useState(false)
  const outputRef = useRef(null)
  const lineNumbersRef = useRef(null)

  const handleRun = async () => {
    if (!code.trim() || running || !onRun) return
    setRunning(true)
    setOutput('Running...')
    setOutputError(false)
    try {
      const result = await onRun(code.trim())
      const out = result?.output ?? ''
      const err = !!result?.isError
      setOutput(out || 'Code executed (no output)')
      setOutputError(err)
      if (outputRef.current) {
        const lines = (out || '').split('\n')
        const color = err ? '#ef4444' : '#10a37f'
        outputRef.current.innerHTML = lines
          .map((line) => `<div style="line-height:1.4;color:${color};white-space:pre;padding-left:2px;font-size:0.875rem;">${escapeHtml(line || ' ')}</div>`)
          .join('')
      }
      if (lineNumbersRef.current) {
        const lines = (out || '').split('\n')
        lineNumbersRef.current.innerHTML = lines
          .map((_, i) => `<div style="line-height:1.4;color:#6b7280;text-align:right;padding-right:8px;font-size:0.875rem;">${i + 1}</div>`)
          .join('')
      }
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Execution failed'
      setOutput(msg)
      setOutputError(true)
      if (outputRef.current) {
        outputRef.current.innerHTML = `<div style="line-height:1.4;color:#ef4444;white-space:pre;padding-left:2px;font-size:0.875rem;">${escapeHtml(msg)}</div>`
      }
      if (lineNumbersRef.current) lineNumbersRef.current.innerHTML = '<div style="line-height:1.4;color:#6b7280;text-align:right;padding-right:8px;font-size:0.875rem;">1</div>'
    } finally {
      setRunning(false)
    }
  }

  const handleCopy = () => {
    if (!code.trim()) return
    copyToClipboard(code)
  }

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleRun()
    }
  }

  const lineCount = (code || '').split('\n').length
  const outputLineCount = Math.max(1, (output || '').split('\n').length)

  return (
    <div className="playground-main-content" style={{ flex: 1, display: 'flex', flexDirection: 'row', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      {/* Editor Panel */}
      <div className="playground-editor-panel" style={{ width: '60%', height: '100%', minWidth: 300, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="playground-editor-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', minHeight: 52, backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#6b7280', boxSizing: 'border-box' }}>
          <div style={{ padding: '6px 12px', height: 32, minHeight: 32, display: 'inline-flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '4px 4px 0 0', borderBottom: '2px solid #10a37f', color: '#111827', fontWeight: 500, fontSize: '0.875rem', boxSizing: 'border-box' }}>playground.js</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="button" onClick={handleRun} disabled={!code.trim() || running} title="Run (Ctrl+Enter)" style={{ height: 32, minHeight: 32, padding: '0 12px', background: code.trim() && !running ? '#10a37f' : '#d1d5db', color: code.trim() && !running ? '#fff' : '#9ca3af', border: 'none', borderRadius: 6, fontSize: '0.875rem', fontWeight: 500, cursor: code.trim() && !running ? 'pointer' : 'not-allowed', minWidth: 60, boxSizing: 'border-box' }}>Run</button>
            <button type="button" onClick={handleCopy} disabled={!code.trim()} title="Copy code" style={{ height: 32, minHeight: 32, padding: '0 12px', background: code.trim() ? '#3b82f6' : '#d1d5db', color: code.trim() ? '#fff' : '#9ca3af', border: 'none', borderRadius: 6, fontSize: '0.875rem', fontWeight: 500, cursor: code.trim() ? 'pointer' : 'not-allowed', minWidth: 60, boxSizing: 'border-box' }}>Copy</button>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 300, display: 'flex', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 6, overflow: 'hidden' }}>
          <div className="playground-line-numbers" style={{ width: 32, minWidth: 32, background: '#f9fafb', borderRight: '1px solid #e5e7eb', padding: '16px 4px', fontSize: '0.875rem', color: '#9ca3af', fontFamily: 'Monaco, Consolas, monospace', lineHeight: 1.4, textAlign: 'right', userSelect: 'none', overflow: 'hidden', flexShrink: 0 }}>
            {Array.from({ length: lineCount }, (_, i) => <div key={i} style={{ lineHeight: 1.4, fontSize: '0.875rem' }}>{i + 1}</div>)}
          </div>
          <textarea value={code} onChange={(e) => onCodeChange(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder} style={{ flex: 1, minWidth: 0, padding: 16, border: 'none', outline: 'none', fontFamily: 'Monaco, Consolas, monospace', fontSize: '0.875rem', lineHeight: 1.4, resize: 'none' }} />
        </div>
      </div>
      {/* Terminal Output Panel */}
      <div className="playground-output-panel" style={{ width: '40%', height: '100%', minWidth: 200, display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden' }}>
        <div className="playground-output-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', minHeight: 52, backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#6b7280', boxSizing: 'border-box' }}>
          <div style={{ padding: '6px 12px', height: 32, minHeight: 32, display: 'inline-flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '4px 4px 0 0', fontSize: '0.875rem', fontWeight: 500, color: '#111827', border: '1px solid #e5e7eb', borderBottom: '2px solid #10a37f', marginBottom: -1, boxSizing: 'border-box' }}>Terminal Output</div>
        </div>
        <div style={{ flex: 1, backgroundColor: '#1e1e1e', border: '1px solid #333', borderTop: 'none', display: 'flex', minHeight: 0 }}>
          <div ref={lineNumbersRef} className="terminal-line-numbers" style={{ width: 32, minWidth: 32, backgroundColor: '#2d2d2d', borderRight: '1px solid #404040', padding: '16px 4px', fontSize: '0.875rem', color: '#6b7280', fontFamily: 'Monaco, Consolas, monospace', lineHeight: 1.4, textAlign: 'right', userSelect: 'none', overflow: 'hidden', flexShrink: 0 }} />
          <div ref={outputRef} className="playground-output" style={{ flex: 1, padding: 16, backgroundColor: '#1e1e1e', color: '#10a37f', fontFamily: 'Monaco, Consolas, monospace', fontSize: '0.875rem', lineHeight: 1.4, overflow: 'auto', minHeight: 0 }}><div style={{ color: '#6b7280', fontStyle: 'italic' }}>Click &quot;Run&quot; to execute your code</div></div>
        </div>
      </div>
    </div>
  )
}

function escapeHtml (text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
