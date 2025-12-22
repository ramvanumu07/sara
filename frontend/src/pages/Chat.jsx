import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { getTopicById, getSubtopicById, calculateProgress } from '../data/curriculum'
import axios from 'axios'
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  Circle,
  RotateCcw,
  Menu,
  X,
  HelpCircle,
  BookOpen,
  Code2
} from 'lucide-react'

export default function Chat() {
  const { topicId, subtopicId } = useParams()
  const navigate = useNavigate()
  const { user, updateProgress } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [lessonStarted, setLessonStarted] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  // Phase tracking state
  const [currentPhase, setCurrentPhase] = useState('learning')
  const [assignmentCount, setAssignmentCount] = useState({ completed: 0, total: 0 })

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const topic = getTopicById(topicId)
  const subtopic = getSubtopicById(topicId, subtopicId)
  const progress = calculateProgress(user?.progress || {})

  const isSubtopicCompleted = (tId, sId) => {
    return user?.progress?.[tId]?.subtopics?.[sId] || false
  }

  const currentSubtopicIndex = topic?.subtopics?.findIndex(s => s.id === subtopicId) || 0
  const nextSubtopic = topic?.subtopics?.[currentSubtopicIndex + 1]
  const prevSubtopic = topic?.subtopics?.[currentSubtopicIndex - 1]

  // Load existing chat history when subtopic changes
  useEffect(() => {
    if (subtopic && user?.studentId) {
      loadChatHistory()
    }
  }, [subtopicId, user?.studentId])

  const loadChatHistory = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/api/chat/history/${user.studentId}/${topicId}/${subtopicId}`)

      if (response.data.history && response.data.history.length > 0) {
        // Has existing history - resume session
        setMessages(response.data.history)
        setCurrentPhase(response.data.phase || 'learning')
        setAssignmentCount(response.data.assignmentCount || { completed: 0, total: 0 })
        setLessonStarted(true)
      } else {
        // No history - start fresh lesson
        startLesson()
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
      // Fallback to starting fresh
      startLesson()
    }
    setIsLoading(false)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const startLesson = async (isRestart = false) => {
    setLessonStarted(true)
    setMessages([])
    setCurrentPhase('learning')
    setAssignmentCount({ completed: 0, total: 0 })
    if (!isRestart) setIsLoading(true)

    try {
      const response = await axios.post('/api/chat', {
        studentId: user?.studentId,
        topicId,
        subtopicId,
        action: 'start_lesson',
        // New flexible context format
        concepts: subtopic?.concepts || [],
        prerequisites: subtopic?.prerequisites || [],
        teachingGoal: subtopic?.teachingGoal || '',
        // Legacy format (backward compatibility)
        learningPoints: subtopic?.learningPoints || [],
        tasks: subtopic?.tasks || [],
        subtopicTitle: subtopic?.title
      })

      setMessages([{
        role: 'assistant',
        content: response.data.message || getDefaultWelcomeMessage(),
        timestamp: new Date().toISOString()
      }])

      if (response.data.phase) {
        setCurrentPhase(response.data.phase)
      }
      if (response.data.assignmentCount) {
        setAssignmentCount(response.data.assignmentCount)
      }
    } catch (error) {
      console.error('Failed to start lesson:', error)
      setMessages([{
        role: 'assistant',
        content: getDefaultWelcomeMessage(),
        timestamp: new Date().toISOString()
      }])
    }

    setIsLoading(false)
  }

  const restartLesson = () => {
    startLesson(true)
  }

  const getDefaultWelcomeMessage = () => {
    return `Let's learn **${subtopic?.title}** together! I'll teach you step by step.

(If you see this message, please refresh - the AI service is still starting up.)`
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')

    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }])

    setIsLoading(true)

    try {
      const response = await axios.post('/api/chat', {
        studentId: user?.studentId,
        topicId,
        subtopicId,
        message: userMessage,
        history: messages.filter(m => m.role !== 'system'),
        // New flexible context format
        concepts: subtopic?.concepts || [],
        prerequisites: subtopic?.prerequisites || [],
        teachingGoal: subtopic?.teachingGoal || '',
        // Legacy format (backward compatibility)
        learningPoints: subtopic?.learningPoints || [],
        tasks: subtopic?.tasks || [],
        subtopicTitle: subtopic?.title
      })

      // Handle phase change
      if (response.data.phaseChanged) {
        setCurrentPhase(response.data.phase)
        // Show phase transition message
        setMessages(prev => [...prev, {
          role: 'system',
          content: response.data.phase === 'assignment'
            ? '🎯 **Moving to Assignment Phase!** Time to practice what you learned.'
            : '📚 **Back to Learning Phase**',
          timestamp: new Date().toISOString()
        }])
      }

      // Update assignment count
      if (response.data.assignmentCount) {
        const prevCompleted = assignmentCount.completed
        setAssignmentCount(response.data.assignmentCount)

        // Show assignment completion message
        if (response.data.assignmentCount.completed > prevCompleted) {
          setMessages(prev => [...prev, {
            role: 'system',
            content: `✅ **Assignment ${response.data.assignmentCount.completed} Complete!**`,
            timestamp: new Date().toISOString()
          }])
        }
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date().toISOString()
      }])

      // Auto-complete subtopic
      if (response.data.subtopicComplete && !isSubtopicCompleted(topicId, subtopicId)) {
        updateProgress(topicId, subtopicId, true)
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'system',
            content: '🎉 **Subtopic Mastered!** You\'ve demonstrated real understanding and clean code skills!',
            timestamp: new Date().toISOString()
          }])
        }, 500)
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting. Please try again.",
        timestamp: new Date().toISOString()
      }])
    }

    setIsLoading(false)
    inputRef.current?.focus()
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const navigateToSubtopic = (newSubtopicId) => {
    setLessonStarted(false)
    navigate(`/learn/${topicId}/${newSubtopicId}`)
  }

  if (!topic || !subtopic) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6e6e6e]">Topic not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-[#0d0d0d] text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-white flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#f9f9f9] border-r border-[#e5e5e5] transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-[#e5e5e5] flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-[#6e6e6e] hover:text-[#0d0d0d] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </button>
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden p-1 hover:bg-[#e5e5e5] rounded"
            >
              <X className="w-5 h-5 text-[#6e6e6e]" />
            </button>
          </div>

          {/* Topic Title */}
          <div className="p-4 border-b border-[#e5e5e5]">
            <span className="text-[#0d0d0d] font-medium">{topic.title}</span>
          </div>

          {/* Subtopics */}
          <div className="flex-1 overflow-y-auto p-2">
            {topic.subtopics.map((sub) => {
              const completed = isSubtopicCompleted(topicId, sub.id)
              const isCurrent = sub.id === subtopicId

              return (
                <button
                  key={sub.id}
                  onClick={() => navigateToSubtopic(sub.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${isCurrent ? 'bg-[#e5e5e5] text-[#0d0d0d]' : 'text-[#6e6e6e] hover:bg-[#e5e5e5]'
                    }`}
                >
                  {completed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#0d0d0d] flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="truncate">{sub.title}</span>
                </button>
              )
            })}
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-[#e5e5e5]">
            {isSubtopicCompleted(topicId, subtopicId) && (
              <div className="flex items-center gap-2 text-sm text-[#0d0d0d] bg-[#e5e5e5] px-3 py-2 rounded-lg mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Completed</span>
              </div>
            )}
            <button
              onClick={restartLesson}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#f0f0f0] text-[#6e6e6e] text-sm rounded-lg hover:bg-[#e5e5e5] transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restart Lesson
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-[#e5e5e5] px-4 flex items-center gap-4">
          <button
            onClick={() => setShowSidebar(true)}
            className="lg:hidden p-2 hover:bg-[#f5f5f5] rounded-lg"
          >
            <Menu className="w-5 h-5 text-[#0d0d0d]" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-[#0d0d0d] font-medium truncate">{subtopic.title}</h1>
          </div>

          {/* Phase Indicator */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${currentPhase === 'learning'
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
            {currentPhase === 'learning' ? (
              <>
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Learning</span>
              </>
            ) : (
              <>
                <Code2 className="w-4 h-4" />
                <span className="hidden sm:inline">Assignment</span>
                {assignmentCount.completed > 0 && (
                  <span className="bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded text-xs">
                    {assignmentCount.completed}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Help Button */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowHelp(true)}
              onMouseLeave={() => setShowHelp(false)}
              onClick={() => setShowHelp(!showHelp)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#6e6e6e] hover:text-[#0d0d0d] hover:bg-[#f5f5f5] rounded-lg transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">How to run JS?</span>
            </button>

            {/* Help Tooltip */}
            <AnimatePresence>
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 top-full mt-2 w-72 bg-[#0d0d0d] text-white rounded-xl p-4 shadow-xl z-50"
                  onMouseEnter={() => setShowHelp(true)}
                  onMouseLeave={() => setShowHelp(false)}
                >
                  <p className="font-medium mb-3">How to run JavaScript</p>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div>
                      <p className="text-white font-medium mb-1">1. Create a file</p>
                      <code className="block bg-white/10 rounded px-2 py-1 text-xs">hello.js</code>
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">2. Write your code</p>
                      <code className="block bg-white/10 rounded px-2 py-1 text-xs">console.log("Hello!");</code>
                    </div>
                    <div>
                      <p className="text-white font-medium mb-1">3. Run in terminal</p>
                      <code className="block bg-white/10 rounded px-2 py-1 text-xs">node hello.js</code>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/20 text-xs text-gray-400">
                    Make sure Node.js is installed on your computer
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-[#f9f9f9]">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 ${message.role === 'user' ? 'flex justify-end' : ''} ${message.role === 'system' ? 'flex justify-center' : ''}`}
                >
                  {message.role === 'system' ? (
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className={`px-4 py-3 rounded-xl text-center text-sm font-medium ${message.content.includes('Complete') || message.content.includes('Mastered')
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : message.content.includes('Assignment Phase')
                          ? 'bg-amber-50 border border-amber-200 text-amber-800'
                          : 'bg-blue-50 border border-blue-200 text-blue-800'
                        }`}
                    >
                      <MessageContent content={message.content} />
                    </motion.div>
                  ) : (
                    <div className={`${message.role === 'user' ? 'max-w-[80%]' : 'w-full'}`}>
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentPhase === 'learning' ? 'bg-blue-600' : 'bg-amber-600'
                            }`}>
                            {currentPhase === 'learning' ? (
                              <BookOpen className="w-3 h-3 text-white" />
                            ) : (
                              <Code2 className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-sm text-[#6e6e6e]">
                            {currentPhase === 'learning' ? 'Mentor' : 'Reviewer'}
                          </span>
                        </div>
                      )}
                      <div className={`rounded-2xl px-4 py-3 ${message.role === 'user'
                        ? 'bg-[#0d0d0d] text-white'
                        : 'bg-white border border-[#e5e5e5] text-[#0d0d0d]'
                        }`}>
                        {message.role === 'user' ? (
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        ) : (
                          <MessageContent content={message.content} />
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Loading indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 mb-6"
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${currentPhase === 'learning' ? 'bg-blue-600' : 'bg-amber-600'
                  }`}>
                  {currentPhase === 'learning' ? (
                    <BookOpen className="w-3 h-3 text-white" />
                  ) : (
                    <Code2 className="w-3 h-3 text-white" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-[#c5c5c5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#c5c5c5] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#c5c5c5] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-[#e5e5e5] p-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={currentPhase === 'learning'
                    ? "Share your thoughts or answer the question..."
                    : "Paste your code here..."
                  }
                  rows={1}
                  className="w-full bg-white border border-[#c5c5c5] rounded-xl py-3 px-4 text-[#0d0d0d] placeholder:text-[#8e8e8e] focus:outline-none focus:border-[#0d0d0d] focus:ring-1 focus:ring-[#0d0d0d] transition-colors resize-none"
                  style={{ minHeight: '48px', maxHeight: '200px' }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-4 bg-[#0d0d0d] text-white rounded-xl flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2d2d2d] transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-3 text-sm">
              <button
                onClick={() => prevSubtopic && navigateToSubtopic(prevSubtopic.id)}
                disabled={!prevSubtopic}
                className="text-[#6e6e6e] hover:text-[#0d0d0d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <button
                onClick={() => nextSubtopic && navigateToSubtopic(nextSubtopic.id)}
                disabled={!nextSubtopic}
                className="text-[#6e6e6e] hover:text-[#0d0d0d] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Message content renderer
function MessageContent({ content }) {
  const parseContent = (text) => {
    const lines = text.split('\n')
    const elements = []
    let inCodeBlock = false
    let codeContent = []
    let codeLanguage = ''

    lines.forEach((line, i) => {
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true
          codeLanguage = line.slice(3).trim()
          codeContent = []
        } else {
          inCodeBlock = false
          elements.push(
            <div key={i} className="my-3 bg-[#f7f7f8] rounded-lg overflow-hidden border border-[#e5e5e5]">
              {codeLanguage && (
                <div className="px-3 py-1 bg-[#efefef] text-xs text-[#6e6e6e] border-b border-[#e5e5e5]">
                  {codeLanguage}
                </div>
              )}
              <pre className="p-3 overflow-x-auto">
                <code className="text-sm text-[#0d0d0d]">
                  {codeContent.join('\n')}
                </code>
              </pre>
            </div>
          )
        }
        return
      }

      if (inCodeBlock) {
        codeContent.push(line)
        return
      }

      if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-xl font-semibold text-[#0d0d0d] mt-4 mb-2">{formatInline(line.slice(2))}</h1>)
        return
      }
      if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-lg font-semibold text-[#0d0d0d] mt-3 mb-2">{formatInline(line.slice(3))}</h2>)
        return
      }
      if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-base font-semibold text-[#0d0d0d] mt-2 mb-1">{formatInline(line.slice(4))}</h3>)
        return
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <div key={i} className="flex items-start gap-2 my-1">
            <span className="text-[#6e6e6e] mt-1">•</span>
            <span className="text-[#0d0d0d]">{formatInline(line.slice(2))}</span>
          </div>
        )
        return
      }
      // Numbered list
      const numberedMatch = line.match(/^(\d+)\.\s(.+)/)
      if (numberedMatch) {
        elements.push(
          <div key={i} className="flex items-start gap-2 my-1">
            <span className="text-[#6e6e6e] min-w-[1.5rem]">{numberedMatch[1]}.</span>
            <span className="text-[#0d0d0d]">{formatInline(numberedMatch[2])}</span>
          </div>
        )
        return
      }
      if (line.trim() === '') {
        elements.push(<div key={i} className="h-2" />)
        return
      }
      elements.push(<p key={i} className="text-[#0d0d0d] my-1">{formatInline(line)}</p>)
    })

    return elements
  }

  const formatInline = (text) => {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    text = text.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    text = text.replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-[#f7f7f8] border border-[#e5e5e5] rounded text-[#0d0d0d] text-sm font-mono">$1</code>')
    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }

  return <div className="prose">{parseContent(content)}</div>
}
