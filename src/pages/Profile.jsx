import { useEffect, useState } from 'react'
import { FileText, Heart, MessageCircle, Coins } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import './Profile.css'

const REASONS = {
  post_created: { label: 'You shared a post', Icon: FileText },
  like_received: { label: 'Someone liked your post', Icon: Heart },
  comment_received: { label: 'Someone commented on your post', Icon: MessageCircle },
}

function Profile({ session }) {
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [country, setCountry] = useState('')
  const [username, setUsername] = useState('')
  const [credits, setCredits] = useState(0)
  const [memberSince, setMemberSince] = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, bio, country, credits, created_at')
        .eq('id', session.user.id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setUsername(data.username)
        setFullName(data.full_name || '')
        setBio(data.bio || '')
        setCountry(data.country || '')
        setCredits(data.credits)
        setMemberSince(
          new Date(data.created_at).toLocaleDateString(undefined, {
            month: 'short',
            year: 'numeric',
          })
        )
      }

      const { data: txs } = await supabase
        .from('credit_transactions')
        .select('id, amount, reason, created_at')
        .order('created_at', { ascending: false })
        .limit(10)

      setHistory(txs || [])
      setLoading(false)
    }
    loadProfile()
  }, [session.user.id])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        bio: bio.trim(),
        country: country.trim(),
      })
      .eq('id', session.user.id)

    if (error) setError(error.message)
    else setMessage('Profile saved')
    setSaving(false)
  }

  if (loading) return <p className="muted">Loading profile...</p>

  return (
    <div>
      <div className="hero-card">
        <div className="pf-hero">
          <div className="pf-avatar">{username.charAt(0)}</div>
          <div>
            <div className="pf-name">{fullName || username}</div>
            <div className="pf-sub">
              @{username}
              {country && ` · ${country}`}
              {memberSince && ` · Joined ${memberSince}`}
            </div>
          </div>
        </div>

        <div className="pf-credits">
          <span className="big-number">{credits}</span>
          <span className="pf-credits-label">hive credits</span>
        </div>
      </div>

      <div className="card">
        <h3>Edit profile</h3>
        <form className="pf-form" onSubmit={handleSave}>
          <div className="pf-field">
            <label htmlFor="username">Username</label>
            <input id="username" className="pf-readonly" type="text" value={username} readOnly />
          </div>

          <div className="pf-field">
            <label htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={80}
            />
          </div>

          <div className="pf-field">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              type="text"
              placeholder="e.g. Kenya"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              maxLength={60}
            />
          </div>

          <div className="pf-field">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              placeholder="Tell people what you can teach and what you want to learn"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={300}
            />
            <span className="muted pf-counter">{bio.length}/300</span>
          </div>

          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save profile'}
          </button>

          {error && <span className="error-text">{error}</span>}
          {message && <span className="success-text">{message}</span>}
        </form>
      </div>

      <div className="card">
        <h3>Recent credits</h3>

        {history.length === 0 && (
          <p className="muted" style={{ margin: 0 }}>
            No credits earned yet. Share a post to start!
          </p>
        )}

        {history.map((t) => {
          const reason = REASONS[t.reason] || { label: t.reason, Icon: Coins }
          const Icon = reason.Icon

          return (
            <div key={t.id} className="pf-history-row">
              <div className="pf-icon">
                <Icon size={18} />
              </div>
              <div className="pf-history-text">
                <div className="pf-history-title">{reason.label}</div>
                <div className="muted">{new Date(t.created_at).toLocaleString()}</div>
              </div>
              <span className="pf-amount">+{t.amount}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Profile