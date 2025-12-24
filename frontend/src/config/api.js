import axios from 'axios'

// API configuration for different environments
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api
