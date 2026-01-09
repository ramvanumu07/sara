import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { courses } from '../data/curriculum'
import api from '../config/api'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [progress, setProgress] = useState({})
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || null)
  const [expandedTopic, setExpandedTopic] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const currentCourse = courses.find(c => c.id === selectedCourse)
  const curriculum = currentCourse?.topics || []

  useEffect(() => {
    loadProgress()
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  async function loadProgress() {
    try {
      const res = await api.get('/api/progress')
      if (res.data.success) setProgress(res.data.progress)
    } catch (err) {
      console.error('Failed to load progress:', err)
    }
  }

  function getSubtopicStatus(topicId, subtopicId) {
    const key = `${topicId}-${subtopicId}`
    return progress[key]?.status || 'not_started'
  }

  function startLesson(topicId, subtopicId) {
    setSidebarOpen(false)
    navigate(`/learn/${topicId}/${subtopicId}`)
  }

  function getStats() {
    let total = 0, completed = 0
    curriculum.forEach(topic => {
      topic.subtopics.forEach(sub => {
        total++
        if (getSubtopicStatus(topic.id, sub.id) === 'completed') completed++
      })
    })
    return { total, completed, percent: total ? Math.round((completed / total) * 100) : 0 }
  }

  const stats = getStats()

  return (
    <div style={styles.container}>
      {/* Mobile Header */}
      {isMobile && (
        <header style={styles.mobileHeader}>
          <button onClick={() => setSidebarOpen(true)} style={styles.menuBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
          <span style={styles.mobileTitle}>EduBridge</span>
          <button onClick={() => setProfileOpen(!profileOpen)} style={styles.profileBtn}>
            <div style={styles.mobileAvatar}>{user?.name?.charAt(0) || 'U'}</div>
          </button>
        </header>
      )}

      {/* Overlay */}
      {isMobile && sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Profile Dropdown Overlay */}
      {profileOpen && (
        <div style={styles.overlay} onClick={() => setProfileOpen(false)} />
      )}

      {/* Profile Dropdown */}
      {profileOpen && (
        <div style={{ ...styles.profileDropdown, ...(isMobile ? styles.profileDropdownMobile : {}) }}>
          <div style={styles.profileHeader}>
            <div style={styles.profileAvatar}>{user?.name?.charAt(0) || 'U'}</div>
            <div style={styles.profileInfo}>
              <span style={styles.profileName}>{user?.name}</span>
              <span style={styles.profileId}>{user?.studentId}</span>
            </div>
          </div>
          <div style={styles.profileDivider} />
          <button onClick={() => { logout(); setProfileOpen(false); }} style={styles.logoutBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Log out
          </button>
        </div>
      )}

      {/* Sidebar - Courses List */}
      <aside style={{
        ...styles.sidebar,
        ...(isMobile ? styles.sidebarMobile : {}),
        ...(isMobile && sidebarOpen ? styles.sidebarMobileOpen : {})
      }}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#10a37f" strokeWidth="2" />
              <path d="M2 17L12 22L22 17" stroke="#10a37f" strokeWidth="2" />
              <path d="M2 12L12 17L22 12" stroke="#10a37f" strokeWidth="2" />
            </svg>
            <span style={styles.logoText}>EduBridge</span>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={styles.closeBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Courses List */}
        <nav style={styles.nav}>
          <span style={styles.navLabel}>Courses</span>
          {courses.map(course => (
            <button
              key={course.id}
              style={{
                ...styles.courseItem,
                ...(selectedCourse === course.id ? styles.courseItemActive : {})
              }}
              onClick={() => { setSelectedCourse(course.id); setExpandedTopic(null); setSidebarOpen(false); }}
            >
              <span style={styles.courseTitle}>{course.title}</span>
              {selectedCourse === course.id && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </button>
          ))}
        </nav>

        {/* Desktop Profile Button */}
        {!isMobile && (
          <div style={styles.sidebarFooter}>
            <button onClick={() => setProfileOpen(!profileOpen)} style={styles.profileBtnDesktop}>
              <div style={styles.avatar}>{user?.name?.charAt(0) || 'U'}</div>
              <span style={styles.userNameText}>{user?.name}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
        )}
      </aside>

      {/* Main - Topics List */}
      <main style={{ ...styles.main, ...(isMobile ? { paddingTop: 72 } : {}) }}>
        <div style={styles.content}>
          {/* Header */}
          <div style={styles.headerSection}>
            <div style={styles.logoLarge}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#10a37f" strokeWidth="2" />
                <path d="M2 17L12 22L22 17" stroke="#10a37f" strokeWidth="2" />
                <path d="M2 12L12 17L22 12" stroke="#10a37f" strokeWidth="2" />
              </svg>
            </div>
            <h1 style={styles.title}>{currentCourse?.title}</h1>
          </div>

          {/* Stats */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>{stats.completed}</span>
              <span style={styles.statLabel}>Completed</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>{stats.total - stats.completed}</span>
              <span style={styles.statLabel}>Remaining</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>{stats.percent}%</span>
              <span style={styles.statLabel}>Progress</span>
            </div>
          </div>

          {/* Topics List */}
          <div style={styles.topicsSection}>
            <span style={styles.topicsLabel}>Topics</span>
            <div style={styles.topicsList}>
              {curriculum.map(topic => (
                <div key={topic.id} style={styles.topicCard}>
                  <button
                    style={{
                      ...styles.topicHeader,
                      ...(expandedTopic === topic.id ? styles.topicHeaderActive : {})
                    }}
                    onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                  >
                    <span style={styles.topicTitle}>{topic.title}</span>
                    <span style={styles.chevron}>{expandedTopic === topic.id ? '▼' : '▶'}</span>
                  </button>

                  {expandedTopic === topic.id && (
                    <div style={styles.subtopicList}>
                      {topic.subtopics.map(subtopic => {
                        const status = getSubtopicStatus(topic.id, subtopic.id)
                        return (
                          <button
                            key={subtopic.id}
                            style={styles.subtopicItem}
                            onClick={() => startLesson(topic.id, subtopic.id)}
                          >
                            <span style={{
                              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                              background: status === 'completed' ? '#10a37f' : status === 'in_progress' ? '#10a37f' : '#d1d5db'
                            }} />
                            <span style={styles.subtopicTitle}>{subtopic.title}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const styles = {
  container: { display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' },

  // Mobile
  mobileHeader: {
    position: 'fixed', top: 0, left: 0, right: 0, height: 56,
    background: 'white', borderBottom: '1px solid var(--border-color)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 1rem', zIndex: 100
  },
  menuBtn: { padding: 8, background: 'transparent', border: 'none', color: 'var(--text-primary)' },
  mobileTitle: { fontWeight: 600, fontSize: '1.1rem' },
  profileBtn: { padding: 0, background: 'transparent', border: 'none' },
  mobileAvatar: {
    width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontSize: '0.875rem', fontWeight: 600
  },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 199 },

  // Profile Dropdown
  profileDropdown: {
    position: 'fixed', bottom: 70, left: 16, width: 240,
    background: 'white', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    border: '1px solid var(--border-color)', zIndex: 300, overflow: 'hidden'
  },
  profileDropdownMobile: { bottom: 'auto', top: 64, left: 'auto', right: 16 },
  profileHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem' },
  profileAvatar: {
    width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontSize: '1rem', fontWeight: 600
  },
  profileInfo: { display: 'flex', flexDirection: 'column' },
  profileName: { fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' },
  profileId: { fontSize: '0.8rem', color: 'var(--text-muted)' },
  profileDivider: { height: 1, background: 'var(--border-color)' },
  logoutBtn: {
    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.875rem 1rem', background: 'transparent', border: 'none',
    color: '#dc2626', fontSize: '0.9rem', textAlign: 'left'
  },

  // Sidebar
  sidebar: {
    width: 260, background: 'var(--sidebar-bg)', display: 'flex',
    flexDirection: 'column', borderRight: '1px solid var(--border-color)', flexShrink: 0
  },
  sidebarMobile: { position: 'fixed', left: '-100%', top: 0, bottom: 0, zIndex: 200, transition: 'left 0.3s ease' },
  sidebarMobileOpen: { left: 0 },
  sidebarHeader: {
    padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  },
  logo: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  logoText: { fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' },
  closeBtn: { padding: 4, background: 'transparent', border: 'none', color: 'var(--text-muted)' },

  nav: { flex: 1, overflow: 'auto', padding: '0.75rem' },
  navLabel: {
    display: 'block', padding: '0.5rem 0.75rem', fontSize: '0.7rem',
    color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600
  },
  courseItem: {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0.75rem', background: 'transparent', border: 'none', borderRadius: 8,
    color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'left', transition: 'all 0.15s'
  },
  courseItemActive: { background: '#f0fdf9', color: 'var(--accent)' },
  courseTitle: { fontWeight: 500 },

  sidebarFooter: { padding: '0.75rem', borderTop: '1px solid var(--border-color)' },
  profileBtnDesktop: {
    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.75rem', background: 'transparent', border: '1px solid var(--border-color)',
    borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.9rem', textAlign: 'left'
  },
  avatar: {
    width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.85rem', fontWeight: 600, color: 'white'
  },
  userNameText: { flex: 1, fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' },

  // Main
  main: { flex: 1, overflow: 'auto', padding: '3rem 1.5rem', background: 'var(--main-bg)' },
  content: { maxWidth: 600, margin: '0 auto' },

  // Header
  headerSection: { textAlign: 'center', marginBottom: '1.5rem' },
  logoLarge: {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 56, height: 56, borderRadius: 14, background: 'var(--sidebar-bg)',
    border: '1px solid var(--border-color)', marginBottom: '0.875rem'
  },
  title: { fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' },

  // Stats
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' },
  statCard: {
    padding: '1.125rem 0.875rem', background: 'white', border: '1px solid var(--border-color)',
    borderRadius: 10, display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'center'
  },
  statNumber: { fontSize: '1.35rem', fontWeight: 700, color: 'var(--accent)' },
  statLabel: { fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 },

  // Topics
  topicsSection: {},
  topicsLabel: {
    display: 'block', marginBottom: '0.75rem', fontSize: '0.75rem',
    color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600
  },
  topicsList: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  topicCard: {
    background: 'white', border: '1px solid var(--border-color)', borderRadius: 10, overflow: 'hidden'
  },
  topicHeader: {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0.875rem 1rem', background: 'transparent', border: 'none',
    color: 'var(--text-primary)', fontSize: '0.95rem', textAlign: 'left', transition: 'all 0.15s'
  },
  topicHeaderActive: { background: 'var(--sidebar-bg)' },
  topicTitle: { fontWeight: 500 },
  chevron: { fontSize: '0.6rem', color: 'var(--text-muted)' },

  subtopicList: { borderTop: '1px solid var(--border-color)', padding: '0.5rem' },
  subtopicItem: {
    width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.625rem 0.75rem', background: 'transparent', border: 'none', borderRadius: 6,
    color: 'var(--text-secondary)', fontSize: '0.875rem', textAlign: 'left', transition: 'all 0.15s'
  },
  subtopicTitle: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
}
