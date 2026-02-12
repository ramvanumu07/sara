/**
 * Vercel serverless entry: forwards all /api requests to the Express app.
 * The rewrite sends /api/:path* -> /api?path=:path* so we must restore req.url
 * for Express to route correctly (e.g. /api/auth/login).
 */
import app from '../backend/server.js'

export default function handler(req, res) {
  const pathParam = req.query?.path
  if (pathParam != null && pathParam !== '') {
    const pathStr = Array.isArray(pathParam) ? pathParam.join('/') : String(pathParam)
    const queryIndex = req.url.indexOf('?')
    const qs = queryIndex >= 0 ? req.url.slice(queryIndex) : ''
    req.url = '/api/' + pathStr.replace(/^\/+/, '') + qs
    req.originalUrl = req.originalUrl || req.url
  }
  return app(req, res)
}
