/**
 * Privacy Policy Page - Sara Learning Platform
 */

import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Privacy.css'

const Privacy = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="privacy-container">
      <header className="privacy-header">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-sara">Sara</span>
          </Link>
          <nav className="header-nav">
            <Link to="/" className="nav-link">Back to Home</Link>
          </nav>
        </div>
      </header>

      <main className="privacy-main">
        <div className="privacy-content">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last updated: February 7, 2026</p>

          <section className="privacy-section">
            <h2>1. Introduction</h2>
            <p>
              Sara Learning Platform ("Sara," "we," "our," or "us") is committed to protecting 
              your privacy. This Privacy Policy explains how we collect, use, disclose, and 
              safeguard your information when you use our AI-powered learning platform.
            </p>
            <p>
              By using Sara, you consent to the data practices described in this policy. 
              If you do not agree with our policies and practices, please do not use our service.
            </p>
          </section>

          <section className="privacy-section">
            <h2>2. Information We Collect</h2>
            
            <h3>Personal Information</h3>
            <p>We collect information you provide directly to us, including:</p>
            <ul>
              <li><strong>Account Information:</strong> Username, email address, password, and profile details</li>
              <li><strong>Learning Data:</strong> Your progress, completed assignments, code submissions, and learning preferences</li>
              <li><strong>Communication Data:</strong> Messages and interactions with our AI tutoring system</li>
              <li><strong>Support Data:</strong> Information you provide when contacting customer support</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>We automatically collect certain information when you use Sara:</p>
            <ul>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform, and learning patterns</li>
              <li><strong>Device Information:</strong> Browser type, operating system, IP address, and device identifiers</li>
              <li><strong>Performance Data:</strong> System performance metrics and error logs for service improvement</li>
              <li><strong>Cookies and Tracking:</strong> Session cookies, preference cookies, and analytics data</li>
            </ul>

            <h3>AI Interaction Data</h3>
            <p>Our AI tutoring system processes:</p>
            <ul>
              <li>Your questions and responses during learning sessions</li>
              <li>Code you write and submit for feedback</li>
              <li>Learning progress and difficulty patterns</li>
              <li>Conversation history for context and personalization</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            
            <h3>Educational Services</h3>
            <ul>
              <li>Provide personalized AI tutoring and learning experiences</li>
              <li>Track your learning progress and adapt content to your needs</li>
              <li>Generate feedback and recommendations for improvement</li>
              <li>Create and maintain your learning profile and achievements</li>
            </ul>

            <h3>Platform Operations</h3>
            <ul>
              <li>Maintain and improve our service functionality</li>
              <li>Authenticate users and maintain account security</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Monitor system performance and prevent technical issues</li>
            </ul>

            <h3>Communication</h3>
            <ul>
              <li>Send important service updates and notifications</li>
              <li>Respond to your questions and support requests</li>
              <li>Share educational content and learning tips (with your consent)</li>
            </ul>

            <h3>Analytics and Improvement</h3>
            <ul>
              <li>Analyze usage patterns to improve our educational content</li>
              <li>Enhance AI tutoring capabilities and accuracy</li>
              <li>Develop new features and learning methodologies</li>
              <li>Ensure platform security and prevent abuse</li>
            </ul>
          </section>

          <section className="privacy-section">
            <h2>4. Information Sharing and Disclosure</h2>
            <p>We do not sell, trade, or rent your personal information. We may share information in the following circumstances:</p>
            
            <h3>Service Providers</h3>
            <p>
              We may share information with trusted third-party service providers who assist us in 
              operating our platform, such as cloud hosting, analytics, and customer support services. 
              These providers are bound by confidentiality agreements and may only use your information 
              to provide services to us.
            </p>

            <h3>Legal Requirements</h3>
            <p>We may disclose information if required by law or in response to:</p>
            <ul>
              <li>Valid legal process (subpoenas, court orders)</li>
              <li>Government investigations or regulatory requests</li>
              <li>Protection of our rights, property, or safety</li>
              <li>Prevention of fraud or illegal activities</li>
            </ul>

            <h3>Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your information may be 
              transferred as part of the transaction. We will notify you of any such change in 
              ownership or control of your personal information.
            </p>
          </section>

          <section className="privacy-section">
            <h2>5. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your information:</p>
            <ul>
              <li><strong>Encryption:</strong> Data is encrypted in transit and at rest using industry-standard protocols</li>
              <li><strong>Access Controls:</strong> Strict access controls limit who can view your information</li>
              <li><strong>Regular Audits:</strong> We conduct regular security assessments and updates</li>
              <li><strong>Secure Infrastructure:</strong> Our systems are hosted on secure, monitored platforms</li>
              <li><strong>Data Minimization:</strong> We collect and retain only necessary information</li>
            </ul>
            <p>
              While we strive to protect your information, no method of transmission over the internet 
              or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="privacy-section">
            <h2>6. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal information:</p>
            
            <h3>Access and Portability</h3>
            <ul>
              <li>Request access to your personal information</li>
              <li>Receive a copy of your data in a portable format</li>
              <li>View your learning progress and history</li>
            </ul>

            <h3>Correction and Updates</h3>
            <ul>
              <li>Update your profile information and preferences</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Modify your communication preferences</li>
            </ul>

            <h3>Deletion and Restriction</h3>
            <ul>
              <li>Request deletion of your account and associated data</li>
              <li>Restrict processing of your information</li>
              <li>Object to certain uses of your data</li>
            </ul>

            <p>
              To exercise these rights, please contact us at 
              <a href="mailto:sara4code@gmail.com"> sara4code@gmail.com</a>. 
              We will respond to your request within a reasonable timeframe.
            </p>
          </section>

          <section className="privacy-section">
            <h2>7. Data Retention</h2>
            <p>We retain your information for as long as necessary to:</p>
            <ul>
              <li>Provide our educational services to you</li>
              <li>Maintain your learning progress and achievements</li>
              <li>Comply with legal obligations and resolve disputes</li>
              <li>Improve our AI tutoring capabilities</li>
            </ul>
            <p>
              When you delete your account, we will delete or anonymize your personal information 
              within 30 days, except where retention is required by law or for legitimate business purposes.
            </p>
          </section>

          <section className="privacy-section">
            <h2>8. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies to enhance your experience:</p>
            
            <h3>Essential Cookies</h3>
            <p>Required for basic platform functionality, authentication, and security.</p>
            
            <h3>Preference Cookies</h3>
            <p>Remember your settings and preferences for a personalized experience.</p>
            
            <h3>Analytics Cookies</h3>
            <p>Help us understand how you use our platform to improve our services.</p>
            
            <p>
              You can control cookies through your browser settings, but disabling certain cookies 
              may affect platform functionality.
            </p>
          </section>

          <section className="privacy-section">
            <h2>9. Children's Privacy</h2>
            <p>
              Sara is designed to be safe for users of all ages. If you are under 13, please have 
              a parent or guardian review this Privacy Policy with you. We do not knowingly collect 
              personal information from children under 13 without parental consent.
            </p>
            <p>
              If we become aware that we have collected information from a child under 13 without 
              parental consent, we will take steps to delete such information promptly.
            </p>
          </section>

          <section className="privacy-section">
            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your own. 
              We ensure that such transfers comply with applicable data protection laws and implement 
              appropriate safeguards to protect your information.
            </p>
          </section>

          <section className="privacy-section">
            <h2>11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons. We will notify you of any material 
              changes by:
            </p>
            <ul>
              <li>Posting the updated policy on our platform</li>
              <li>Sending you an email notification (if you have an account)</li>
              <li>Displaying a prominent notice on our website</li>
            </ul>
            <p>Your continued use of Sara after changes become effective constitutes acceptance of the updated policy.</p>
          </section>

          <section className="privacy-section">
            <h2>12. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our 
              data practices, please contact us:
            </p>
            <div className="contact-info">
              <p><strong>Email:</strong> <a href="mailto:sara4code@gmail.com">sara4code@gmail.com</a></p>
              <p><strong>Subject Line:</strong> Privacy Policy Inquiry</p>
            </div>
            <p>
              We are committed to resolving any privacy concerns you may have and will respond to 
              your inquiry within 5 business days.
            </p>
          </section>
        </div>
      </main>

      <footer className="privacy-footer">
        <div className="footer-content">
          <p>&copy; 2026 Sara Learning Platform. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/terms">Terms of Service</Link>
            <span>•</span>
            <a href="mailto:sara4code@gmail.com">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Privacy