import { useEffect, useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Skills from './pages/Skills'
import CreatePost from './pages/CreatePost'
import Leaderboard from './pages/Leaderboard'
import BottomNav from './components/BottomNav'

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
    return <p style={{ padding: '2rem' }}>Loading...</p>
  }

  return (
    <div>
      <header className="top-bar">
        <span className="brand">SkillHive 🐝</span>
        {session ? (
          <button className="btn" onClick={handleLogout}>Log out</button>
        ) : (
          <div className="top-links">
            <Link className="btn" to="/login">Log in</Link>
            <Link className="btn btn-primary" to="/signup">Sign up</Link>
          </div>
        )}
      </header>

      <main className="page">
        <Routes>
          <Route path="/" element={<Navigate to={session ? '/home' : '/login'} replace />} />
          <Route path="/login" element={session ? <Navigate to="/home" replace /> : <Login />} />
          <Route path="/signup" element={session ? <Navigate to="/home" replace /> : <Signup />} />
          <Route path="/home" element={session ? <Home session={session} /> : <Navigate to="/login" replace />} />
          <Route path="/create" element={session ? <CreatePost session={session} /> : <Navigate to="/login" replace />} />
          <Route path="/leaderboard" element={session ? <Leaderboard session={session} /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={session ? <Profile session={session} /> : <Navigate to="/login" replace />} />
          <Route path="/skills" element={session ? <Skills session={session} /> : <Navigate to="/login" replace />} />
        </Routes>
      </main>

      {session && <BottomNav />}
    </div>
  )
}

export default App