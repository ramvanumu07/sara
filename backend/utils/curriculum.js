/**
 * Curriculum utility functions for processing learning objectives
 * Industry-level reusable functions to eliminate code duplication
 */

/**
 * Format learning objectives for system prompts
 * All topics now use standardized array of strings format
 * 
 * @param {Array<string>} outcomes - Array of learning objective strings
 * @returns {string} - Formatted numbered list of learning objectives
 */
export function formatLearningObjectives(outcomes) {
  if (!outcomes || !Array.isArray(outcomes) || outcomes.length === 0) {
    return 'Master fundamental programming concepts through hands-on practice'
  }

  return outcomes.map((outcome, index) => {
    return `${index + 1}. ${outcome}`
  }).join('\n')
}

/**
 * Find a topic by ID across all courses
 * @param {Array} courses - Array of course objects
 * @param {string} topicId - Topic ID to find
 * @returns {Object|null} - Topic object or null if not found
 */
export function findTopicById(courses, topicId) {
  for (const course of courses) {
    const topic = course.topics.find(t => t.id === topicId)
    if (topic) {
      return { ...topic, courseId: course.id, courseTitle: course.title }
    }
  }
  return null
}

/**
 * Get all topics from all courses
 * @param {Array} courses - Array of course objects
 * @returns {Array} - Array of all topics with course info
 */
export function getAllTopics(courses) {
  return courses.flatMap(course =>
    course.topics.map(topic => ({
      ...topic,
      courseId: course.id,
      courseTitle: course.title
    }))
  )
}
