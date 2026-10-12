import { NavLink } from 'react-router-dom'
import { Home, Sparkles, Plus, Trophy, User } from 'lucide-react'

const items = [
  { to: '/home', label: 'Home', Icon: Home },
  { to: '/skills', label: 'Skills', Icon: Sparkles },
  { to: '/create', label: 'New post', Icon: Plus },
  { to: '/leaderboard', label: 'Leaderboard', Icon: Trophy },
  { to: '/profile', label: 'Profile', Icon: User },
]

function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          title={label}
          aria-label={label}
          className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
        >
          <Icon size={22} strokeWidth={1.8} />
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav