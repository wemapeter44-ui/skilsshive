import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

function StatTiles({ userId, credits }) {
  const [posts, setPosts] = useState('…')
  const [likes, setLikes] = useState('…')
  const [comments, setComments] = useState('…')
  const [rank, setRank] = useState('…')

  useEffect(() => {
    async function loadCounts() {
      // How many posts I wrote
      const postsRes = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)

      // Likes on my posts, from other members (self-likes earn nothing, so we skip them)
      const likesRes = await supabase
        .from('likes')
        .select('post_id, posts!inner(user_id)', { count: 'exact', head: true })
        .eq('posts.user_id', userId)
        .neq('user_id', userId)

      // Comments on my posts, from other members
      const commentsRes = await supabase
        .from('comments')
        .select('id, posts!inner(user_id)', { count: 'exact', head: true })
        .eq('posts.user_id', userId)
        .neq('user_id', userId)

      setPosts(postsRes.error ? '–' : postsRes.count)
      setLikes(likesRes.error ? '–' : likesRes.count)
      setComments(commentsRes.error ? '–' : commentsRes.count)
    }
    loadCounts()
  }, [userId])

  useEffect(() => {
    async function loadRank() {
      if (credits === undefined || credits === null) return

      // Members with 0 credits are not on the leaderboard
      if (credits === 0) {
        setRank('–')
        return
      }

      // Rank = how many members have MORE credits than me, plus one
      const { count, error } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .gt('credits', credits)

      setRank(error ? '–' : `#${count + 1}`)
    }
    loadRank()
  }, [credits])

  return (
    <div className="stat-grid">
      <div className="stat-tile">
        <div className="stat-number">{posts}</div>
        <div className="muted">posts you shared</div>
      </div>

      <div className="stat-tile">
        <div className="stat-number">{likes}</div>
        <div className="muted">likes received</div>
      </div>

      <div className="stat-tile">
        <div className="stat-number">{comments}</div>
        <div className="muted">comments received</div>
      </div>

      <Link to="/leaderboard" className="stat-tile">
        <ArrowUpRight size={18} className="stat-arrow" />
        <div className="stat-number">{rank}</div>
        <div className="muted">your leaderboard rank</div>
      </Link>
    </div>
  )
}

export default StatTiles