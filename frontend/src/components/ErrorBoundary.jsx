/**
 * Error Boundary Component - Production-ready error handling
 * Catches JavaScript errors anywhere in the child component tree
 */

import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
    
    // Store error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // In production, you could send this to an error reporting service
    // Example: Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // reportErrorToService(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    })
  }

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2>Something went wrong</h2>
            <p>We're sorry, but something unexpected happened. Please try refreshing the page.</p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development)</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
            
            <div className="error-actions">
              <button onClick={this.handleRetry} className="retry-btn">
                Try Again
              </button>
              <button onClick={() => window.location.reload()} className="reload-btn">
                Reload Page
              </button>
            </div>
          </div>
          
          <style jsx>{`
            .error-boundary {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 20px;
              background: #f9fafb;
            }
            
            .error-boundary-content {
              text-align: center;
              max-width: 500px;
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }
            
            .error-icon {
              color: #ef4444;
              margin-bottom: 20px;
            }
            
            .error-boundary h2 {
              color: #111827;
              font-size: 1.5rem;
              font-weight: 600;
              margin-bottom: 12px;
            }
            
            .error-boundary p {
              color: #6b7280;
              margin-bottom: 24px;
              line-height: 1.5;
            }
            
            .error-details {
              text-align: left;
              margin: 20px 0;
              padding: 16px;
              background: #f3f4f6;
              border-radius: 8px;
              font-size: 0.875rem;
            }
            
            .error-details pre {
              white-space: pre-wrap;
              word-break: break-word;
              margin: 8px 0;
            }
            
            .error-actions {
              display: flex;
              gap: 12px;
              justify-content: center;
            }
            
            .retry-btn, .reload-btn {
              padding: 10px 20px;
              border: none;
              border-radius: 6px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.2s;
            }
            
            .retry-btn {
              background: #10a37f;
              color: white;
            }
            
            .retry-btn:hover {
              background: #0d8f6c;
            }
            
            .reload-btn {
              background: #f3f4f6;
              color: #374151;
            }
            
            .reload-btn:hover {
              background: #e5e7eb;
            }
          `}</style>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary