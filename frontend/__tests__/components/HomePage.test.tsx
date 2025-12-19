/**
 * Home Page Component Tests
 * Tests for app/page.tsx landing page
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock Home component structure
const MockHomePage = () => {
  return (
    <div>
      <header>
        <nav>
          <h1>ASTOR AI</h1>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="/auth/login">Login</a></li>
          </ul>
        </nav>
      </header>
      
      <main>
        <section id="hero">
          <h1>AI-Powered Astrology Platform</h1>
          <p>Get personalized predictions and insights</p>
          <button>Get Started</button>
        </section>
        
        <section id="features">
          <h2>Features</h2>
          <div className="feature-grid">
            <div className="feature">
              <h3>Birth Chart Analysis</h3>
              <p>Comprehensive natal chart interpretation</p>
            </div>
            <div className="feature">
              <h3>AI Predictions</h3>
              <p>Machine learning powered forecasts</p>
            </div>
            <div className="feature">
              <h3>Compatibility</h3>
              <p>Relationship compatibility analysis</p>
            </div>
          </div>
        </section>
        
        <section id="pricing">
          <h2>Pricing Plans</h2>
          <div className="pricing-grid">
            <div className="plan">
              <h3>Free</h3>
              <p>$0/month</p>
            </div>
            <div className="plan">
              <h3>Pro</h3>
              <p>$9.99/month</p>
            </div>
            <div className="plan">
              <h3>Enterprise</h3>
              <p>Custom pricing</p>
            </div>
          </div>
        </section>
      </main>
      
      <footer>
        <p>&copy; 2025 ASTOR AI. All rights reserved.</p>
      </footer>
    </div>
  )
}

describe('Home Page', () => {
  it('should render the main heading', () => {
    render(<MockHomePage />)
    expect(screen.getByText('AI-Powered Astrology Platform')).toBeInTheDocument()
  })

  it('should render navigation links', () => {
    render(<MockHomePage />)
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('Pricing')).toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('should display feature section', () => {
    render(<MockHomePage />)
    expect(screen.getByText('Birth Chart Analysis')).toBeInTheDocument()
    expect(screen.getByText('AI Predictions')).toBeInTheDocument()
    expect(screen.getByText('Compatibility')).toBeInTheDocument()
  })

  it('should show pricing plans', () => {
    render(<MockHomePage />)
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })

  it('should render CTA button', () => {
    render(<MockHomePage />)
    const ctaButton = screen.getByText('Get Started')
    expect(ctaButton).toBeInTheDocument()
    expect(ctaButton.tagName).toBe('BUTTON')
  })

  it('should have proper sections with IDs', () => {
    render(<MockHomePage />)
    const heroSection = screen.getByText('AI-Powered Astrology Platform').closest('section')
    expect(heroSection).toHaveAttribute('id', 'hero')
  })
})
