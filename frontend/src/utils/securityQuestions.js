/**
 * Security Questions - Sara Learning Platform
 * Predefined security questions for password recovery
 */

export const SECURITY_QUESTIONS = [
  {
    id: 'childhood_pet',
    question: 'What was your first pet\'s name?',
    shortQuestion: 'First pet\'s name'
  },
  {
    id: 'birth_city',
    question: 'In which city were you born?',
    shortQuestion: 'Birth city'
  },
  {
    id: 'first_school',
    question: 'What was your first school\'s name?',
    shortQuestion: 'First school name'
  },
  {
    id: 'favorite_teacher',
    question: 'What was your favorite teacher\'s name?',
    shortQuestion: 'Favorite teacher\'s name'
  },
  {
    id: 'childhood_friend',
    question: 'What was your best friend\'s name?',
    shortQuestion: 'Best friend\'s name'
  },
  {
    id: 'favorite_food',
    question: 'What is your favorite food?',
    shortQuestion: 'Favorite food'
  },
  {
    id: 'childhood_nickname',
    question: 'What was your childhood nickname?',
    shortQuestion: 'Childhood nickname'
  }
]

/**
 * Get security question by ID
 * @param {string} questionId - The question ID
 * @returns {object|null} - The question object or null if not found
 */
export function getSecurityQuestionById(questionId) {
  return SECURITY_QUESTIONS.find(q => q.id === questionId) || null
}

/**
 * Get all security questions for dropdown
 * @returns {Array} - Array of security questions
 */
export function getAllSecurityQuestions() {
  return SECURITY_QUESTIONS
}

export default {
  SECURITY_QUESTIONS,
  getSecurityQuestionById,
  getAllSecurityQuestions
}