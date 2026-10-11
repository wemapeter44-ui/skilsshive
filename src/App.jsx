import { useEffect, useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Skills from './pages/Skills'

function App() {
  const [session, setSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoadingSession(false)
    })

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
          <>
            <Link to="/home">Home</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/skills">Skills</Link>
            <button onClick={handleLogout}>Log out</button>
          </>
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
        <Route path="/profile" element={session ? <Profile session={session} /> : <Navigate to="/login" replace />} />
        <Route path="/skills" element={session ? <Skills session={session} /> : <Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default App