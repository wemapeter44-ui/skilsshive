import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function Profile({ session }) {
  const [fullName, setFullName] = useState('')
  const [bio, setBio] = useState('')
  const [country, setCountry] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, bio, country')
        .eq('id', session.user.id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setUsername(data.username)
        setFullName(data.full_name || '')
        setBio(data.bio || '')
        setCountry(data.country || '')
      }
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
    else setMessage('Profile saved ✅')
    setSaving(false)
  }

  if (loading) return <p style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Loading profile...</p>

  return (
    <div style={{ maxWidth: '420px', margin: '3rem auto', fontFamily: 'sans-serif' }}>
      <h2>Your profile</h2>
      <p>Username: <strong>{username}</strong></p>

      <form onSubmit={handleSave} style={{ display: 'grid', gap: '0.75rem' }}>
        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Country (e.g. Kenya)"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <textarea
          placeholder="Short bio: tell people about yourself"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          maxLength={300}
        />
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
    </div>
  )
}

export default Profile