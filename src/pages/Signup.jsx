import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function Signup() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <div style={{ maxWidth: '360px', margin: '3rem auto', fontFamily: 'sans-serif' }}>
      <h2>Join SkillHive 🐝</h2>

      <form onSubmit={handleSignup} style={{ display: 'grid', gap: '0.75rem' }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={3}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  )
}

export default Signup