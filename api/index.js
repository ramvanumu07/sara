/**
 * Vercel serverless entry: forwards all /api requests to the Express app.
 * Uses dynamic import so backend load failures return the real error instead of FUNCTION_INVOCATION_FAILED.
 * The rewrite sends /api/:path* -> /api?path=:path* so we must restore req.url for Express.
 */
let appPromise = null

function loadApp() {
  if (appPromise) return appPromise
  appPromise = import('../backend/server.js').then((m) => m.default)
  return appPromise
}

export default async function handler(req, res) {
  const pathParam = req.query?.path
  if (pathParam != null && pathParam !== '') {
    const pathStr = Array.isArray(pathParam) ? pathParam.join('/') : String(pathParam)
    const queryIndex = req.url.indexOf('?')
    const qs = queryIndex >= 0 ? req.url.slice(queryIndex) : ''
    req.url = '/api/' + pathStr.replace(/^\/+/, '') + qs
    req.originalUrl = req.originalUrl || req.url
  }
  try {
    const app = await loadApp()
    return app(req, res)
  } catch (loadErr) {
    const msg = (loadErr && typeof loadErr.message === 'string') ? loadErr.message : (loadErr && loadErr.message != null ? String(loadErr.message) : 'Server error')
    if (!res.headersSent) {
      res.status(500).setHeader('Content-Type', 'application/json').end(JSON.stringify({ success: false, message: msg, code: 'SERVER_ERROR' }))
    }
  }
}
