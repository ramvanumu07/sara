import { findTopicById } from './curriculum.js'

/**
 * Route helper: get topic by ID or send 404 and return null.
 * Reduces repeated "Topic not found" handling across learning and chat routes.
 *
 * @param {Object} res - Express response object
 * @param {Array} courses - Curriculum courses array
 * @param {string} topicId - Topic ID to find
 * @param {Function} createErrorResponse - createErrorResponse from utils/responses.js
 * @returns {Object|null} - Topic object or null (and 404 already sent)
 */
export function getTopicOrRespond(res, courses, topicId, createErrorResponse) {
  const topic = findTopicById(courses, topicId)
  if (!topic) {
    res.status(404).json(createErrorResponse('Topic not found'))
    return null
  }
  return topic
}
