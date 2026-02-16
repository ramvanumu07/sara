/**
 * Products & Services Page - Sara Learning Platform
 */

import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Products = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  const containerStyle = {
    minHeight: '100vh',
    background: '#ffffff',
    color: '#1a1a1a',
    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.6
  }
  return (
    <div className="terms-container" style={containerStyle}>
      <header className="terms-header" style={{ background: '#ffffff', borderBottom: '1px solid #e5e5e5', padding: '1.5rem 0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div className="header-content" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
            <span className="logo-sara" style={{ fontSize: '2rem', fontWeight: 700, color: '#44a08d' }}>Sara</span>
          </Link>
          <Link to="/" className="nav-link" style={{ color: '#5a5a5a', textDecoration: 'none', fontWeight: 500, padding: '0.5rem 1rem', borderRadius: '0.375rem', background: '#f0f0f0', border: '1px solid #e0e0e0' }}>Back to Home</Link>
        </div>
      </header>

      <main className="terms-main" style={{ flex: 1, padding: '1rem 0' }}>
        <div className="terms-content" style={{ maxWidth: 800, margin: '0 auto', padding: '1.25rem 2rem 3rem 2rem', background: '#ffffff' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#10a37f' }}>Products &amp; Services</h1>
          <p className="last-updated">All prices are in Indian Rupees (INR). Last updated: February 2026.</p>

          <section className="terms-section">
            <h2>Sara Learning Course</h2>
            <p><strong>Description:</strong> Full access to the Sara learning platform. Includes AI-powered tutoring sessions (chat with Sara to learn concepts), an interactive code playground to run and try code, and coding assignments with run-and-test and AI feedback. Progress is saved so you can continue from where you left off. Topics are structured so you learn step by step.</p>
            <p><strong>Price (INR):</strong> ₹499</p>
          </section>

          <section className="terms-section">
            <h2>Contact</h2>
            <p>For pricing or custom requirements: <a href="mailto:codewithsara@proton.me">codewithsara@proton.me</a></p>
            <p><strong>Legal name:</strong> Vanumu Lakshmi Sai Ram</p>
            <p><strong>Registered address:</strong> 1-79, VALASAPAKALA, KAKINADA, ANDHRA PRADESH, INDIA</p>
          </section>
        </div>
      </main>

      <footer className="terms-footer" style={{ background: '#f9f9f9', borderTop: '1px solid #e5e5e5', padding: '2rem 0', marginTop: 'auto' }}>
        <div className="footer-content" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p>&copy; 2026 Sara. All rights reserved.</p>
          <div className="footer-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/terms" className="footer-link" style={{ color: '#5a5a5a', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Terms</Link>
            <span style={{ color: '#8e8e8e' }}>•</span>
            <Link to="/privacy" className="footer-link" style={{ color: '#5a5a5a', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Privacy</Link>
            <span style={{ color: '#8e8e8e' }}>•</span>
            <a href="mailto:codewithsara@proton.me" className="footer-link" style={{ color: '#5a5a5a', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Products
