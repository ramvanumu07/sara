/**
 * Recent Activity Component - Shows user's learning history
 * Displays recent topics, time spent, and learning patterns
 */

import React, { useState, useEffect } from 'react'
import { useCache } from '../hooks/useCache'
import { progress } from '../config/api'

const RecentActivity = ({ userId }) => {
  const [activities, setActivities] = useState([])
  
  // Cache recent activity data
  const { data: recentData, loading, error } = useCache(
    `recent-activity-${userId}`,
    () => progress.getRecent(7), // Last 7 days
    { ttl: 2 * 60 * 1000 } // 2 minutes cache
  )

  useEffect(() => {
    if (recentData) {
      setActivities(recentData.activities || [])
    }
  }, [recentData])

  const getActivityIcon = (type) => {
    switch (type) {
      case 'completed':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22,4 12,14.01 9,11.01"/>
          </svg>
        )
      case 'started':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5,3 19,12 5,21"/>
          </svg>
        )
      case 'practice':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
          </svg>
        )
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        )
    }
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffMs = now - time
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return time.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="recent-activity loading">
        <div className="activity-skeleton">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-item">
              <div className="skeleton-icon"></div>
              <div className="skeleton-content">
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="recent-activity error">
        <p>Unable to load recent activity</p>
      </div>
    )
  }

  if (!activities.length) {
    return (
      <div className="recent-activity empty">
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
          </svg>
          <h4>No recent activity</h4>
          <p>Start learning to see your progress here!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <h4>Recent Activity</h4>
        <span className="activity-count">{activities.length} activities</span>
      </div>
      
      <div className="activity-list">
        {activities.map((activity, index) => (
          <div key={activity.id || index} className={`activity-item ${activity.type}`}>
            <div className="activity-icon">
              {getActivityIcon(activity.type)}
            </div>
            <div className="activity-content">
              <div className="activity-title">{activity.title}</div>
              <div className="activity-details">
                <span className="activity-topic">{activity.topic}</span>
                {activity.duration && (
                  <span className="activity-duration">{activity.duration}m</span>
                )}
                <span className="activity-time">{getTimeAgo(activity.timestamp)}</span>
              </div>
            </div>
            {activity.score && (
              <div className="activity-score">
                {activity.score}%
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .recent-activity {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .activity-header h4 {
          margin: 0;
          color: #111827;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .activity-count {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .activity-item:hover {
          background: #f9fafb;
        }

        .activity-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .activity-item.completed .activity-icon {
          background: #dcfce7;
          color: #16a34a;
        }

        .activity-item.started .activity-icon {
          background: #dbeafe;
          color: #2563eb;
        }

        .activity-item.practice .activity-icon {
          background: #fef3c7;
          color: #d97706;
        }

        .activity-content {
          flex: 1;
          min-width: 0;
        }

        .activity-title {
          font-weight: 500;
          color: #111827;
          margin-bottom: 4px;
        }

        .activity-details {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .activity-topic {
          font-weight: 500;
        }

        .activity-duration::before {
          content: "•";
          margin-right: 8px;
        }

        .activity-time::before {
          content: "•";
          margin-right: 8px;
        }

        .activity-score {
          font-weight: 600;
          color: #16a34a;
          font-size: 0.875rem;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
        }

        .empty-state svg {
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state h4 {
          margin: 0 0 8px;
          color: #374151;
        }

        .empty-state p {
          margin: 0;
          font-size: 0.875rem;
        }

        /* Loading skeleton */
        .activity-skeleton {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .skeleton-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
        }

        .skeleton-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: #e5e7eb;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .skeleton-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .skeleton-line {
          height: 16px;
          background: #e5e7eb;
          border-radius: 4px;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .skeleton-line.short {
          width: 60%;
          height: 12px;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .error {
          text-align: center;
          padding: 40px 20px;
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .recent-activity {
            padding: 16px;
          }

          .activity-details {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .activity-duration::before,
          .activity-time::before {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

export default RecentActivity