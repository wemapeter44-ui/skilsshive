import { useEffect, useState } from 'react'
import { Search, Trophy } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import CreditIcon from '../components/CreditIcon'
import { RowsSkeleton } from '../components/Skeleton'
import './Leaderboard.css'

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

  function rankClass(rank) {
    if (rank === 1) return ' gold'
    if (rank === 2) return ' silver'
    if (rank === 3) return ' bronze'
    return ''
  }

  // The leader's credits are the 100% mark for every bar
  const topCredits = rows.length > 0 ? rows[0].credits : 0

  return (
    <div>
      <div className="card lb-header">
        <h2 className="lb-title">
          <Trophy size={22} /> Hive leaderboard
        </h2>
        <span className="muted">
          Top members by credits. Filter by country, or leave it empty for the whole world.
        </span>
        <div className="lb-search">
          <Search size={16} className="lb-search-icon" />
          <input
            type="text"
            placeholder="Country (e.g. Kenya)"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading && rows.length === 0 && <RowsSkeleton />}

      {!loading && rows.length === 0 && (
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            No one on the board yet. Share a post to earn credits!
          </p>
        </div>
      )}

      {rows.map((r, i) => {
        const percent = topCredits > 0 ? Math.max(4, Math.round((r.credits / topCredits) * 100)) : 0

        return (
          <div key={r.id} className={'lb-row' + (r.id === session.user.id ? ' me' : '')}>
            <span className={'lb-rank' + rankClass(i + 1)}>{i + 1}</span>
            <div className="avatar">{r.username.charAt(0)}</div>
            <div className="lb-info">
              <div className="lb-name">{r.username}</div>
              <div className="muted">{r.country || 'No country set'}</div>
            </div>
            <span className="lb-credits">
              <CreditIcon size={18} /> {r.credits}
            </span>

            <div className="lb-bar">
              <div className="lb-bar-fill" style={{ width: percent + '%' }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Leaderboard