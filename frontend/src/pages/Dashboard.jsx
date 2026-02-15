import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { learning, progress } from '../config/api'
import EditorToggle from '../components/EditorToggle'
import SessionPlayground from '../components/SessionPlayground'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [error, setError] = useState(null)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('javascript')
  const [userProgress, setUserProgress] = useState([])
  const [progressSummary, setProgressSummary] = useState({})
  const [lastAccessed, setLastAccessed] = useState(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [unlockedCourseIds, setUnlockedCourseIds] = useState([])
  const [unlockModalCourse, setUnlockModalCourse] = useState(null)
  const [unlocking, setUnlocking] = useState(false)
  // Always show dashboard on load/reload; editor toggle state is not persisted for this page
  const [editorToggleOn, setEditorToggleOn] = useState(false)
  const [playgroundCode, setPlaygroundCode] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Open unlock modal if URL has ?unlock=courseId (e.g. from Learn paywall)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const unlockCourseId = params.get('unlock')
    if (unlockCourseId && courses.length > 0 && courses.some(c => c.id === unlockCourseId)) {
      setUnlockModalCourse(courses.find(c => c.id === unlockCourseId))
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [courses])

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showMobileMenu) {
        setShowMobileMenu(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showMobileMenu])

  // Prevent horizontal scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflowX = 'hidden'
    } else {
      document.body.style.overflowX = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflowX = 'unset'
    }
  }, [showMobileMenu])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Clear any frontend caches
      if (window.clearCache) {
        window.clearCache()
      }

      // Call continue first, then courses and progress (so new users get a progress row before we fetch the list)
      let continueRes = { data: { success: false, data: {} } }
      let coursesRes = { data: { success: false, data: {} } }
      let progressRes = { data: { success: false, data: {} } }

      try {
        continueRes = await learning.getContinueLearning()
      } catch (e) {
      }
      try {
        coursesRes = await learning.getCourses()
      } catch (e) {
      }
      let unlockedRes = { data: { success: false, data: {} } }
      try {
        unlockedRes = await learning.getUnlockedCourses()
      } catch (e) { }
      try {
        progressRes = await progress.getAll()
      } catch (e) {
        throw e
      }

      if (unlockedRes.data.success && Array.isArray(unlockedRes.data.data?.courseIds)) {
        setUnlockedCourseIds(unlockedRes.data.data.courseIds)
      }

      if (progressRes.data.success) {
        const progressData = progressRes.data.data.progress || []
        setUserProgress(progressData)
        setProgressSummary(progressRes.data.data.summary || {})
      }

      const lastAccessedData = continueRes.data.success && continueRes.data.data?.lastAccessed
        ? continueRes.data.data.lastAccessed
        : null
      if (lastAccessedData) {
        setLastAccessed(lastAccessedData)
        // If progress list is empty but continue returned a topic, use it as the only progress so Continue button works
        if (!progressRes.data?.data?.progress?.length && lastAccessedData.topicId) {
          const synthetic = [{
            topic_id: lastAccessedData.topicId,
            phase: lastAccessedData.phase || 'session',
            status: lastAccessedData.status || 'in_progress',
            updated_at: new Date().toISOString()
          }]
          setUserProgress(synthetic)
        }
      }

      if (coursesRes.data.success) {
        setCourses(coursesRes.data.data.courses || [])
      }

    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message
      const status = err.response?.status
      const detail = status ? ` (${status})` : ''
      setError(msg ? `Failed to load dashboard: ${msg}${detail}. Please refresh or try again.` : 'Failed to load dashboard. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  const updateProgressForCourse = (courseId) => {
    const courseTopics = courses.find(c => c.id === courseId)?.topics || []
    const courseProgress = userProgress.filter(p =>
      courseTopics.some(topic => topic.id === p.topic_id)
    )

    // Step 1: Count fully completed topics (topic_completed = true)
    const fullyCompleted = courseProgress.filter(p =>
      p.topic_completed === true
    ).length
    const completedPhases = fullyCompleted * 3

    // Step 2: Find current active topic (most recently updated, not completed)
    const activeTopics = courseProgress.filter(p => p.topic_completed !== true)
    const currentTopic = activeTopics.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))[0]

    // Step 3: Calculate current topic phase progress
    let currentPhaseProgress = 0
    if (currentTopic) {
      if (currentTopic.phase === 'playtime') {
        currentPhaseProgress = 1  // Session completed
      } else if (currentTopic.phase === 'assignment') {
        currentPhaseProgress = 2  // Session + PlayTime completed
      }
      // If phase === 'session', currentPhaseProgress remains 0 (just started)
    }

    // Step 4: Calculate final percentage
    const totalCompletedPhases = completedPhases + currentPhaseProgress
    const totalPossiblePhases = courseTopics.length * 3
    const percentage = totalPossiblePhases > 0 ? Math.round((totalCompletedPhases / totalPossiblePhases) * 100) : 0

    return {
      completed_topics: fullyCompleted,
      total_topics: courseTopics.length,
      completion_percentage: percentage
    }
  }

  const handleContinueLearning = () => {
    // Find the most recent topic with progress
    const recentTopic = userProgress
      .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))[0]

    if (recentTopic) {
      const topicId = recentTopic.topic_id
      const phase = recentTopic.phase
      const status = recentTopic.status
      const currentAssignment = recentTopic.current_assignment || 0
      const topicCompleted = recentTopic.topic_completed

      // If topic is completed, find next topic
      if (topicCompleted === true || (status === 'completed' && phase === 'assignment')) {
        const selectedCourseData = courses.find(c => c.id === selectedCourse)
        const currentTopicIndex = selectedCourseData?.topics?.findIndex(t => t.id === topicId)
        
        if (currentTopicIndex !== -1 && currentTopicIndex < (selectedCourseData?.topics?.length - 1)) {
          // Move to next topic's session phase
          const nextTopic = selectedCourseData.topics[currentTopicIndex + 1]
          navigate(`/learn/${nextTopic.id}`)
          return
        } else {
          // Course completed or no more topics
          navigate(`/learn/${selectedCourseData?.topics?.[0]?.id}`)
          return
        }
      }

      // CORRECTED: Smart phase detection using phase-specific completion flags
      let targetPhase = 'session'
      let targetUrl = `/learn/${topicId}`

      // Playtime removed: session ↔ editor (toggle) → assignment only
      if (phase === 'assignment') {
        targetPhase = 'assignment'
        targetUrl = `/learn/${topicId}?phase=assignment`
      } else {
        // Session or playtime (legacy) → session; practice is inline via Code editor toggle
        targetPhase = 'session'
        targetUrl = `/learn/${topicId}`
      }

      navigate(targetUrl)
      return
    }

    // No progress found - start with first topic of selected course
    const selectedCourseData = courses.find(c => c.id === selectedCourse)
    const firstTopic = selectedCourseData?.topics?.[0]
    if (firstTopic) {
      navigate(`/learn/${firstTopic.id}`)
    }
  }

  const handleCompletedTopicClick = (topicId) => {
    navigate(`/learn/${topicId}`)
  }

  const handleTopicClick = (topicId) => {
    navigate(`/learn/${topicId}`)
  }

  const handleEditProfile = () => {
    navigate('/profile')
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    navigate('/login')
  }

  const getTopicById = (topicId) => {
    for (const course of courses) {
      const topic = course.topics?.find(t => t.id === topicId)
      if (topic) return topic
    }
    return null
  }

  const getTopicStatus = (topicId) => {
    const topicProgress = userProgress.find(p => p.topic_id === topicId)
    if (!topicProgress) return 'not_started'

    // Only consider fully completed if topic_completed is true
    if (topicProgress.status === 'completed' && topicProgress.topic_completed === true) {
      return 'completed'
    }

    // If started but not fully completed, show as in_progress
    if (topicProgress.status === 'in_progress' ||
      (topicProgress.status === 'completed' && topicProgress.topic_completed !== true)) {
      return 'in_progress'
    }

    return topicProgress.status || 'not_started'
  }

  const getTopicPhase = (topicId) => {
    const topicProgress = userProgress.find(p => p.topic_id === topicId)
    return topicProgress?.phase || 'session'
  }

  const getCurrentActiveTopic = () => {
    // Find current active topic (most recently updated, not completed)
    const activeTopics = userProgress.filter(p => p.topic_completed !== true)
    const currentTopicProgress = activeTopics.sort((a, b) =>
      new Date(b.updated_at || 0) - new Date(a.updated_at || 0)
    )[0]

    if (currentTopicProgress) {
      const topic = getTopicById(currentTopicProgress.topic_id)
      return topic ? {
        ...topic,
        phase: currentTopicProgress.phase,
        progress: currentTopicProgress
      } : null
    }

    // Fallback: if no active topics, try to find the most recent topic with any progress
    if (userProgress.length > 0) {
      const mostRecentProgress = userProgress.sort((a, b) =>
        new Date(b.updated_at || 0) - new Date(a.updated_at || 0)
      )[0]
      if (mostRecentProgress) {
        const topic = getTopicById(mostRecentProgress.topic_id)
        return topic ? {
          ...topic,
          phase: mostRecentProgress.phase,
          progress: mostRecentProgress
        } : null
      }
    }

    // Final fallback: if no progress at all, return first topic of selected course
    const selectedCourseData = courses.find(c => c.id === selectedCourse)
    const firstTopic = selectedCourseData?.topics?.[0]
    if (firstTopic) {
      return {
        ...firstTopic,
        phase: 'session',
        progress: null
      }
    }
    return null
  }

  const getPhaseDisplayName = (phase) => {
    switch (phase) {
      case 'session':
        return 'Learning Session'
      case 'playtime':
        return 'Interactive Practice'
      case 'assignment':
        return 'Coding Assignments'
      default:
        return 'Learning Session'
    }
  }

  const getPhaseIcon = (phase) => {
    switch (phase) {
      case 'session':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="phase-icon">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10,9 9,9 8,9" />
          </svg>
        )
      case 'playtime':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="phase-icon">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        )
      case 'assignment':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="phase-icon">
            <polyline points="9,11 12,14 22,4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        )
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="phase-icon">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        )
    }
  }

  if (loggingOut) {
    const loadingOverlayStyle = {
      position: 'fixed',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
      background: 'rgba(255,255,255,0.98)',
      zIndex: 99999
    }
    return createPortal(
      <div className="dashboard-loading" style={loadingOverlayStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div
            className="loading-spinner"
            style={{
              width: 32,
              height: 32,
              border: '3px solid #e5e7eb',
              borderTopColor: '#10a37f',
              borderRadius: '50%',
              animation: 'loadingSpin 1s linear infinite',
              flexShrink: 0
            }}
            aria-hidden
          />
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', fontFamily: 'var(--sara-font)' }}>Logging out...</p>
        </div>
      </div>,
      document.body
    )
  }

  if (loading) {
    const loadingOverlayStyle = {
      position: 'fixed',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 16,
      background: 'rgba(255,255,255,0.98)',
      zIndex: 99999
    }
    return createPortal(
      <div className="dashboard-loading" style={loadingOverlayStyle}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div
            className="loading-spinner"
            style={{
              width: 32,
              height: 32,
              border: '3px solid #e5e7eb',
              borderTopColor: '#10a37f',
              borderRadius: '50%',
              animation: 'loadingSpin 1s linear infinite',
              flexShrink: 0
            }}
            aria-hidden
          />
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, color: '#6b7280', fontFamily: 'var(--sara-font)' }}>Loading your dashboard...</p>
        </div>
      </div>,
      document.body
    )
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={loadDashboardData} className="retry-button">
          Try Again
        </button>
      </div>
    )
  }

  const selectedCourseData = courses.find(c => c.id === selectedCourse)
  const currentProgressSummary = updateProgressForCourse(selectedCourse)

  // Topics where session is completed (can view session chat or do assignments)
  const courseTopicIds = selectedCourseData?.topics?.map(t => t.id) || []
  const sessionCompletedTopics = userProgress
    .filter(p => courseTopicIds.includes(p.topic_id) && (p.phase === 'assignment' || p.topic_completed === true))
    .sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))

  // Only show topics that are FULLY completed (topic_completed = true)
  const completedTopics = userProgress.filter(p =>
    p.status === 'completed' && p.topic_completed === true
  )

  return (
    <div className={`dashboard ${showMobileMenu && !editorToggleOn ? 'mobile-menu-open' : ''}`}>
      {/* Fixed code-editor toggle (shared with Learn session) */}
      <EditorToggle isOn={editorToggleOn} onToggle={setEditorToggleOn} />
      {editorToggleOn ? (
        /* Full-screen playground only — same layout as Learn session (no sidebar, no menu) */
        <div
          className="dashboard-playground-fullscreen"
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            backgroundColor: '#fff'
          }}
        >
<SessionPlayground
              code={playgroundCode}
              onCodeChange={setPlaygroundCode}
              placeholder="Practice here or try something from your lessons!"
            />
        </div>
      ) : (
        <>
      {/* Mobile Menu Toggle */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        aria-label={showMobileMenu ? 'Close menu' : 'Open menu'}
      >
        {showMobileMenu ? (
          // Close (X) icon when menu is open
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          // Hamburger icon when menu is closed
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Sidebar - Desktop always visible, Mobile toggleable */}
      <div className={`sidebar ${showMobileMenu ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="brand">Sara</h1>
          <div className="user-section">
            <div className="user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
            </div>
            <div className="user-actions">
              <button onClick={handleEditProfile} className="action-btn" title="Edit Profile">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
              <button onClick={handleLogout} className="action-btn" title="Logout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16,17 21,12 16,7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="courses-nav">
          <h3>Courses</h3>
          {courses.map(course => {
            const isUnlocked = unlockedCourseIds.includes(course.id)
            return (
              <button
                key={course.id}
                className={`course-item ${selectedCourse === course.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCourse(course.id)
                  setShowMobileMenu(false)
                }}
              >
                {isUnlocked ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9,18 15,12 9,6" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" title="Locked">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}
                {course.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Mobile Overlay - tap to close menu; content stays full width underneath */}
      <div
        className={`mobile-overlay ${showMobileMenu ? 'active' : ''}`}
        onClick={() => setShowMobileMenu(false)}
        aria-hidden="true"
      />

      {/* Main Content - Single flowing page */}
      <div className="main-content">
        {/* Course Header */}
        <div className="course-header">
          <h2>{selectedCourseData?.title || 'Course'}</h2>
          <p>{selectedCourseData?.description || 'Master programming concepts step by step with Sara'}</p>
        </div>

        {/* Course locked: show unlock CTA */}
        {selectedCourseData && !unlockedCourseIds.includes(selectedCourseData.id) && (
          <div className="course-locked-banner">
            <div className="course-locked-banner-inner">
              <span className="course-locked-icon" aria-hidden>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <div className="course-locked-text">
                <strong>This course is locked</strong>
                <p>Unlock it for lifetime access to all topics and assignments.</p>
              </div>
              <button
                type="button"
                className="course-locked-btn"
                onClick={() => setUnlockModalCourse(selectedCourseData)}
              >
                Unlock for lifetime
              </button>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <div className="progress-section">
          <h3>Your Progress</h3>
          <div className="progress-stats">
            <div className="stat">
              <span className="number">{currentProgressSummary.completed_topics || 0}</span>
              <span className="label">Completed</span>
            </div>
            <div className="stat">
              <span className="number">{currentProgressSummary.total_topics || 0}</span>
              <span className="label">Total Topics</span>
            </div>
            <div className="stat">
              <span className="number">{currentProgressSummary.completion_percentage || 0}%</span>
              <span className="label">Overall</span>
            </div>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${currentProgressSummary.completion_percentage || 0}%` }}
            />
          </div>
        </div>

        {/* Continue Learning Section */}
        <div className="continue-section">
          {/* Current Learning Status Card - Above Button */}
          {(() => {
            const currentTopic = getCurrentActiveTopic()
            if (currentTopic) {
              return (
                <div className="current-learning-card">
                  <div className="learning-header">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="learning-icon">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    <span className="learning-label">Currently Learning</span>
                  </div>
                  <div className="topic-info">
                    <h4 className="topic-title">{currentTopic.title}</h4>
                    <div className="phase-info">
                      {getPhaseIcon(currentTopic.phase)}
                      <span className="phase-name">{getPhaseDisplayName(currentTopic.phase)}</span>
                    </div>
                  </div>
                </div>
              )
            } else {
              return null
            }
          })()}

          {/* Continue Learning Button - disabled when current topic's course is locked */}
          {(() => {
            const currentTopic = getCurrentActiveTopic()
            const currentTopicCourseId = currentTopic ? courses.find(c => c.topics?.some(t => t.id === currentTopic.id))?.id : null
            const isContinueDisabled = currentTopicCourseId && !unlockedCourseIds.includes(currentTopicCourseId)
            return (
              <button
                className="continue-btn"
                onClick={handleContinueLearning}
                disabled={isContinueDisabled}
                title={isContinueDisabled ? 'Unlock this course to continue' : undefined}
                style={isContinueDisabled ? { opacity: 0.7, cursor: 'not-allowed' } : undefined}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Continue Learning
              </button>
            )
          })()}

          {/* Session completed: view conversation or try assignments */}
          {sessionCompletedTopics.length > 0 && (
            <div className="session-completed-section">
              <h4 className="session-completed-heading">Session completed</h4>
              <p className="session-completed-hint">View conversation or try assignments again</p>
              <ul className="session-completed-list">
                {sessionCompletedTopics.map((topicProgress) => {
                  const topic = getTopicById(topicProgress.topic_id)
                  if (!topic) return null
                  return (
                    <li key={topicProgress.topic_id} className="session-completed-row">
                      <span className="session-completed-title">{topic.title}</span>
                      <div className="session-completed-actions">
                        <button
                          type="button"
                          className="session-completed-icon-btn"
                          onClick={() => navigate(`/learn/${topicProgress.topic_id}`)}
                          title="View session conversation"
                          aria-label={`View session for ${topic.title}`}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14,2 14,8 20,8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10,9 9,9 8,9" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="session-completed-icon-btn"
                          onClick={() => navigate(`/learn/${topicProgress.topic_id}?phase=assignment&start=1`)}
                          title="Try assignments again (from task 1)"
                          aria-label={`Assignments for ${topic.title}`}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9,11 12,14 22,4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Completed Topics */}
        {completedTopics.length > 0 && (
          <div className="completed-section">
            <h4>Completed Topics</h4>
            <div className="completed-list">
              {completedTopics.map(topicProgress => {
                const topic = getTopicById(topicProgress.topic_id)
                if (!topic) return null

                return (
                  <div key={topicProgress.topic_id} className="completed-topic-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <button
                      className="completed-topic"
                      onClick={() => handleCompletedTopicClick(topicProgress.topic_id)}
                      style={{ flex: 1, textAlign: 'left' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                      {topic.title}
                    </button>
                    <button
                      type="button"
                      className="session-completed-icon-btn"
                      onClick={(e) => { e.stopPropagation(); navigate(`/learn/${topicProgress.topic_id}?phase=assignment&start=1`) }}
                      title="View assignments (from task 1)"
                      aria-label={`Assignments for ${topic.title}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9,11 12,14 22,4" />
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                      </svg>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>

      {/* Unlock course modal (payment flow) */}
      {unlockModalCourse && (
        <div
          className="unlock-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16
          }}
          onClick={() => !unlocking && setUnlockModalCourse(null)}
        >
          <div
            className="unlock-modal"
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 24,
              maxWidth: 400,
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem' }}>Unlock {unlockModalCourse.title}</h3>
            <p style={{ margin: '0 0 20px', color: '#6b7280', fontSize: '0.875rem' }}>
              Complete payment to unlock this course permanently. You’ll get lifetime access to all topics and assignments.
            </p>
            <p style={{ margin: '0 0 20px', fontSize: '0.8rem', color: '#9ca3af' }}>
              Payment integration (Stripe/Razorpay) can be added here. For now, unlock is granted on button click.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                type="button"
                disabled={unlocking}
                onClick={() => setUnlockModalCourse(null)}
                style={{ padding: '10px 16px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: unlocking ? 'not-allowed' : 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={unlocking}
                onClick={async () => {
                  setUnlocking(true)
                  try {
                    await learning.unlockCourse(unlockModalCourse.id)
                    setUnlockedCourseIds(prev => (prev.includes(unlockModalCourse.id) ? prev : [...prev, unlockModalCourse.id]))
                    setUnlockModalCourse(null)
                  } catch (e) {
                    console.error('Unlock failed', e)
                  } finally {
                    setUnlocking(false)
                  }
                }}
                style={{ padding: '10px 20px', background: unlocking ? '#9ca3af' : '#059669', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: unlocking ? 'not-allowed' : 'pointer' }}
              >
                {unlocking ? 'Unlocking…' : 'Pay & Unlock'}
              </button>
            </div>
          </div>
        </div>
      )}

        </>
      )}
    </div>
  )
}

export default Dashboard