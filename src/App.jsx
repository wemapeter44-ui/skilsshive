import { useEffect, useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'

function App() {
  const [session, setSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)

  useEffect(() => {
    // Check if someone is already logged in when the app opens
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoadingSession(false)
    })

    // Listen for future logins and logouts
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  if (loadingSession) {
    return <p style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Loading...</p>
  }

  return (
    <div>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', fontFamily: 'sans-serif' }}>
        <strong>SkillHive 🐝</strong>
        {session ? (
          <button onClick={handleLogout}>Log out</button>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to={session ? '/home' : '/login'} replace />} />
        <Route path="/login" element={session ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/signup" element={session ? <Navigate to="/home" replace /> : <Signup />} />
        <Route path="/home" element={session ? <Home session={session} /> : <Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App