/**
 * Vercel serverless entry: forwards all /api requests to the Express app.
 * Do not call app.listen(); Vercel invokes this handler with (req, res).
 */
import app from '../backend/server.js'

export default function handler(req, res) {
  return app(req, res)
}
