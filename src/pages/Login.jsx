import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import './Auth.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="hero-card">
        <div className="hero-top">
          <span>Welcome back</span>
        </div>
        <div className="au-hero-title">Pick up where you left off.</div>
        <div className="hero-sub">Log in to share skills, earn credits, and climb the leaderboard.</div>
      </div>

      <div className="card">
        <form className="au-form" onSubmit={handleLogin}>
          <div className="au-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="au-field">
            <label htmlFor="password">Password</label>
            <div className="au-password">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="au-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary au-submit" type="submit" disabled={loading}>
            <LogIn size={16} /> {loading ? 'Logging in...' : 'Log in'}
          </button>

          {error && <span className="error-text">{error}</span>}
        </form>
      </div>

      <p className="au-switch muted">
        New to SkillHive? <Link to="/signup"><strong>Create an account</strong></Link>
      </p>
    </div>
  )
}

export default Login