import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [isRegister, setIsRegister] = useState(false)
  const [studentId, setStudentId] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isRegister) {
        const result = await register(studentId, password, name)
        if (result.success) {
          setSuccess('Registration successful! Wait for admin to grant access.')
          setIsRegister(false)
          setPassword('')
        } else {
          setError(result.message)
        }
      } else {
        const result = await login(studentId, password)
        if (result.success) {
          navigate('/dashboard')
        } else {
          setError(result.message)
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#10a37f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="#10a37f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="#10a37f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 style={styles.title}>Welcome to EduBridge</h1>
          <p style={styles.subtitle}>{isRegister ? 'Create your account' : 'Log in to continue learning'}</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {isRegister && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                style={styles.input}
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Student ID</label>
            <input
              type="text"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              style={styles.input}
              placeholder="Enter your student ID"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Continue')}
          </button>
        </form>

        <p style={styles.switchText}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); setSuccess(''); }}
            style={styles.switchBtn}
          >
            {isRegister ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    background: '#f9fafb'
  },
  card: {
    width: '100%',
    maxWidth: '380px',
    padding: '2rem',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '1.75rem'
  },
  logo: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    background: '#f0fdf9',
    marginBottom: '1rem'
  },
  title: {
    fontSize: '1.35rem',
    fontWeight: '600',
    marginBottom: '0.25rem',
    color: 'var(--text-primary)'
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '500',
    color: 'var(--text-primary)'
  },
  input: {
    width: '100%',
    padding: '0.8rem 0.9rem',
    background: 'white',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    transition: 'border-color 0.2s'
  },
  submitBtn: {
    width: '100%',
    padding: '0.875rem',
    background: 'var(--accent)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontWeight: '600',
    marginTop: '0.5rem',
    cursor: 'pointer',
    transition: 'opacity 0.2s'
  },
  error: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    marginBottom: '1rem',
    fontSize: '0.875rem'
  },
  success: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#16a34a',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    marginBottom: '1rem',
    fontSize: '0.875rem'
  },
  switchText: {
    marginTop: '1.5rem',
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '0.875rem'
  },
  switchBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent)',
    fontWeight: '600',
    marginLeft: '0.4rem',
    cursor: 'pointer'
  }
}
