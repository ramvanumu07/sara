/**
 * Admin page: generate unlock codes (id of user_course_unlocks row).
 * Admin copies the code and sends to user after payment; user redeems on Dashboard.
 */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { learning } from '../config/api'
import { copyToClipboard } from '../utils/copyToClipboard'

const Admin = () => {
  const { user } = useAuth()
  const [generatedCode, setGeneratedCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setError('')
    setGeneratedCode('')
    setLoading(true)
    try {
      const res = await learning.generateUnlockCode()
      if (res?.data?.success && res?.data?.data?.code) {
        setGeneratedCode(res.data.data.code)
      } else {
        setError('No code returned')
      }
    } catch (e) {
      const msg = e?.response?.data?.message ?? e?.message ?? 'Failed to generate code'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!generatedCode) return
    const ok = await copyToClipboard(generatedCode)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const containerStyle = {
    minHeight: '100vh',
    background: '#f9fafb',
    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: '2rem'
  }

  return (
    <div style={containerStyle}>
      <header style={{ maxWidth: 800, margin: '0 auto 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#111827' }}>Admin – Unlock codes</h1>
        <Link to="/dashboard" style={{ color: '#059669', fontWeight: 500, textDecoration: 'none' }}>Back to Dashboard</Link>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto' }}>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Generate a code after the user pays. Send the code to the user; they paste it on the Dashboard unlock modal to get access.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            style={{
              padding: '12px 20px',
              background: loading ? '#9ca3af' : '#059669',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              alignSelf: 'flex-start'
            }}
          >
            {loading ? 'Generating…' : 'Generate code'}
          </button>

          {error && (
            <p style={{ margin: 0, color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>
          )}

          {generatedCode && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                readOnly
                value={generatedCode}
                style={{
                  flex: '1 1 280px',
                  minWidth: 0,
                  padding: '10px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  fontSize: '0.875rem',
                  fontFamily: 'monospace'
                }}
              />
              <button
                type="button"
                onClick={handleCopy}
                style={{
                  padding: '10px 16px',
                  background: copied ? '#059669' : '#f3f4f6',
                  color: copied ? 'white' : '#374151',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Admin
