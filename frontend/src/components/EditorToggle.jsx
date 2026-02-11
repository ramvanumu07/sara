import React from 'react'

const STORAGE_KEY = 'sara_editor_toggle'

export function getEditorToggleFromStorage() {
  return typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'on'
}

export function setEditorToggleInStorage(on) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
  }
}

// Pill / stadium shape (rounded, not semicircle) – same on desktop and mobile
const PILL_HEIGHT = 44
const PILL_WIDTH = 52
const PILL_RADIUS = PILL_HEIGHT / 2

/**
 * Fixed-position toggle: pill shape attached to right edge.
 * Book = editor on (back to chat), Keyboard = editor off (open editor).
 */
const EditorToggle = ({ isOn, onToggle }) => {
  const handleClick = () => {
    const next = !isOn
    setEditorToggleInStorage(next)
    onToggle(next)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isOn ? 'Back to chat' : 'Open code editor'}
      title={isOn ? 'Back to chat' : 'Open code editor'}
      style={{
        position: 'fixed',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 9999,
        width: PILL_WIDTH,
        height: PILL_HEIGHT,
        padding: 0,
        backgroundColor: '#374151',
        color: 'white',
        border: 'none',
        borderRadius: `${PILL_RADIUS}px 0 0 ${PILL_RADIUS}px`,
        cursor: 'pointer',
        boxShadow: '-2px 0 8px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(-90deg)'
        }}
        aria-hidden
      >
        {isOn ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <path d="M8 7h8" />
            <path d="M8 11h8" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
            <path d="M6 8h.001" />
            <path d="M10 8h.001" />
            <path d="M14 8h.001" />
            <path d="M18 8h.001" />
            <path d="M8 12h.001" />
            <path d="M12 12h.001" />
            <path d="M16 12h.001" />
            <path d="M7 16h10" />
          </svg>
        )}
      </span>
    </button>
  )
}

export default EditorToggle
