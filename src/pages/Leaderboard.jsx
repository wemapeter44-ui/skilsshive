import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function Leaderboard({ session }) {
  const [rows, setRows] = useState([])
  const [country, setCountry] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadLeaderboard() {
      setLoading(true)
      setError('')

      let query = supabase
        .from('profiles')
        .select('id, username, country, credits')
        .gt('credits', 0)
        .order('credits', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(50)

      if (country.trim()) {
        query = query.ilike('country', country.trim())
      }

      const { data, error } = await query

      if (error) setError(error.message)
      else setRows(data)
      setLoading(false)
    }
    loadLeaderboard()
  }, [country])

  function medal(rank) {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank
  }

  return (
    <div style={{ maxWidth: '520px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Hive leaderboard 🏆</h2>

      <input
        type="text"
        placeholder="Filter by country (e.g. Kenya), or leave empty for the world"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && rows.length === 0 && (
        <p style={{ color: 'gray' }}>No one on the board yet. Share a post to earn credits!</p>
      )}

      <ol style={{ listStyle: 'none', padding: 0 }}>
        {rows.map((r, i) => (
          <li
            key={r.id}
            style={{
              display: 'flex',
              gap: '1rem',
              padding: '0.6rem 0.75rem',
              borderBottom: '1px solid #eee',
              background: r.id === session.user.id ? '#fff8dc' : 'transparent',
            }}
          >
            <span style={{ width: '2rem' }}>{medal(i + 1)}</span>
            <span style={{ flex: 1 }}>
              <strong>{r.username}</strong>
              {r.country && <small style={{ color: 'gray' }}> · {r.country}</small>}
            </span>
            <span>🍯 {r.credits}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default Leaderboard