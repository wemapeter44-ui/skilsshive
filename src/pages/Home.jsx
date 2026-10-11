import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function Home({ session }) {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, credits')
        .eq('id', session.user.id)
        .single()

      if (error) setError(error.message)
      else setProfile(data)
    }
    loadProfile()
  }, [session.user.id])

  return (
    <div style={{ maxWidth: '480px', margin: '3rem auto', fontFamily: 'sans-serif' }}>
      <h2>Welcome to the hive 🐝</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {profile ? (
        <>
          <p>Username: <strong>{profile.username}</strong></p>
          <p>Credits: <strong>{profile.credits}</strong></p>
        </>
      ) : (
        !error && <p>Loading your profile...</p>
      )}
      <p style={{ color: 'gray' }}>
        (Placeholder page. We'll replace it with the real feed in Phase 2.)
      </p>
    </div>
  )
}

export default Home
