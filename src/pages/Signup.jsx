import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import './Auth.css'

function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username.trim().toLowerCase() },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Account created! You are now signed up.')
      setUsername('')
      setEmail('')
      setPassword('')
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="hero-card">
        <div className="hero-top">
          <span>Join the hive</span>
        </div>
        <div className="au-hero-title">Share what you know. Learn what you love.</div>
        <div className="hero-sub">Create a free account to start earning hive credits.</div>
      </div>

      <div className="card">
        <form className="au-form" onSubmit={handleSignup}>
          <div className="au-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="e.g. peter_codes"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={20}
              pattern="[A-Za-z0-9_]+"
              title="3 to 20 characters: letters, numbers, and underscores only"
              autoComplete="username"
            />
            <span className="muted">3 to 20 characters: letters, numbers, and underscores.</span>
          </div>

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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
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
            <UserPlus size={16} /> {loading ? 'Creating account...' : 'Create account'}
          </button>

          {error && <span className="error-text">{error}</span>}
          {message && <span className="success-text">{message}</span>}
        </form>
      </div>

      <p className="au-switch muted">
        Already a member? <Link to="/login"><strong>Log in</strong></Link>
      </p>
    </div>
  )
}

export default Signup