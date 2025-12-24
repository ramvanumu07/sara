import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { curriculum, calculateProgress } from '../data/curriculum'
import api from '../config/api'
import { 
  ChevronRight, 
  User, 
  LogOut, 
  CheckCircle2, 
  Circle,
  BookOpen,
  Sprout,
  Lock,
  Crown
} from 'lucide-react'

export default function Dashboard() {
  const { user, logout, hasActiveSubscription } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [expandedTopics, setExpandedTopics] = useState([])
  const [progressData, setProgressData] = useState({})
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null)
  
  const isSubscribed = hasActiveSubscription()

  // Load progress from server
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const response = await api.get('/api/progress')
        if (response.data.success) {
          setProgressData(response.data.progress || {})
        }
      } catch (err) {
        console.log('Progress load failed:', err.message)
      }
    }

    if (isSubscribed) {
      loadProgress()
    }
  }, [isSubscribed])

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  const progress = calculateProgress(progressData)

  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    )
  }

  const isSubtopicCompleted = (topicId, subtopicId) => {
    const key = `${topicId}-${subtopicId}`
    return progressData[key]?.status === 'completed'
  }

  const isTopicCompleted = (topicId) => {
    const topic = curriculum.find(t => t.id === topicId)
    if (!topic) return false
    return topic.subtopics.every(sub => isSubtopicCompleted(topicId, sub.id))
  }

  const handleStartSubtopic = (topicId, subtopicId) => {
    if (!isSubscribed) {
      navigate('/subscribe')
      return
    }
    navigate(`/learn/${topicId}/${subtopicId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="h-16 border-b border-slate-700/50 px-4 flex items-center justify-between backdrop-blur bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold text-white">DevSprout</h1>
        </div>
          
        <div className="flex items-center gap-3">
          {/* Subscription Badge */}
          {isSubscribed ? (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">
              <Crown className="w-4 h-4" />
              <span>Pro</span>
            </div>
          ) : (
            <button
              onClick={() => navigate('/subscribe')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-full text-sm transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span>Subscribe</span>
            </button>
          )}
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <User className="w-4 h-4 text-slate-300" />
            </div>
            <span className="text-sm text-slate-300 hidden sm:block">{user?.name || user?.email}</span>
          </div>
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto p-6">
        {/* Success Message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400"
          >
            {successMessage}
          </motion.div>
        )}

        {/* Subscription Banner (if not subscribed) */}
        {!isSubscribed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">Unlock Full Access</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Subscribe to get AI-powered personalized learning, unlimited lessons, and track your progress.
                </p>
                <button
                  onClick={() => navigate('/subscribe')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-lg transition-colors"
                >
                  Subscribe for ₹200/month
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Progress Bar (if subscribed) */}
        {isSubscribed && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Course Progress</span>
              <span>{progress.overall}%</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress.overall}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Topics List */}
        <div className="space-y-2">
          {curriculum.map((topic, index) => {
            const topicCompleted = isTopicCompleted(topic.id)
            const topicProgress = progress.byTopic[topic.id] || { completed: 0, total: topic.subtopics.length }
            const isExpanded = expandedTopics.includes(topic.id)

            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border border-slate-700/50 rounded-xl overflow-hidden bg-slate-800/30 backdrop-blur"
              >
                {/* Topic Header */}
                <button
                  onClick={() => toggleTopic(topic.id)}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-slate-700/30 ${topicCompleted ? 'bg-slate-700/20' : ''}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-slate-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">{topic.title}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {isSubscribed && (
                      <span className="text-sm text-slate-400">
                        {topicProgress.completed}/{topicProgress.total}
                      </span>
                    )}
                    {topicCompleted && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                    <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {/* Subtopics List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-700/50 bg-slate-800/50">
                        {topic.subtopics.map((subtopic) => {
                          const completed = isSubtopicCompleted(topic.id, subtopic.id)
                          
                          return (
                            <button
                              key={subtopic.id}
                              onClick={() => handleStartSubtopic(topic.id, subtopic.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700/30 transition-colors border-b border-slate-700/30 last:border-b-0"
                            >
                              {completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                              ) : isSubscribed ? (
                                <Circle className="w-5 h-5 text-slate-600 flex-shrink-0" />
                              ) : (
                                <Lock className="w-5 h-5 text-slate-600 flex-shrink-0" />
                              )}
                              <p className={`text-sm ${completed ? 'text-white' : 'text-slate-400'}`}>
                                {subtopic.title}
                              </p>
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
