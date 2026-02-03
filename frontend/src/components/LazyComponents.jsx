/**
 * Lazy Loaded Components - Performance optimization
 * Components that are loaded only when needed
 */

import { lazy } from 'react'

// Lazy load heavy dashboard components
export const RecentActivity = lazy(() => import('./RecentActivity'))
export const ProgressChart = lazy(() => import('./ProgressChart'))
export const AchievementBadges = lazy(() => import('./AchievementBadges'))
export const LearningStreak = lazy(() => import('./LearningStreak'))

// Loading fallback component
export const ComponentLoader = ({ height = '200px', text = 'Loading...' }) => (
  <div className="component-loader" style={{ height }}>
    <div className="loader-content">
      <div className="loader-spinner"></div>
      <p>{text}</p>
    </div>
    
    <style jsx>{`
      .component-loader {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f9fafb;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
      }
      
      .loader-content {
        text-align: center;
      }
      
      .loader-spinner {
        width: 24px;
        height: 24px;
        border: 2px solid #e5e7eb;
        border-top: 2px solid #10a37f;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 12px;
      }
      
      .loader-content p {
        color: #6b7280;
        font-size: 0.875rem;
        margin: 0;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)