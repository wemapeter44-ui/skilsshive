import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Heart, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import StatTiles from '../components/StatTiles'
import CreditIcon from '../components/CreditIcon'
import { FeedSkeleton } from '../components/Skeleton'

function Home({ session }) {
  const [posts, setPosts] = useState([])
  const [me, setMe] = useState(null)
  const [drafts, setDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadMe() {
    const { data } = await supabase
      .from('profiles')
      .select('username, credits')
      .eq('id', session.user.id)
      .single()
    setMe(data)
  }

  async function loadPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select(
        'id, user_id, title, content, skill_tag, created_at, ' +
        'profiles!posts_user_id_fkey(username), ' +
        'likes(user_id), ' +
        'comments(id, user_id, content, created_at, profiles!comments_user_id_fkey(username))'
      )
      .order('created_at', { ascending: false })
      .order('created_at', { referencedTable: 'comments', ascending: true })
      .limit(50)

    if (error) setError(error.message)
    else setPosts(data)
    setLoading(false)
  }

  useEffect(() => {
    loadMe()
    loadPosts()
  }, [])

  async function handleDelete(id) {
    setError('')
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) setError(error.message)
    else await loadPosts()
  }

  async function handleLike(post) {
    setError('')
    const alreadyLiked = post.likes.some((l) => l.user_id === session.user.id)

    const { error } = alreadyLiked
      ? await supabase
          .from('likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', session.user.id)
      : await supabase
          .from('likes')
          .insert({ post_id: post.id, user_id: session.user.id })

    if (error) setError(error.message)
    else await loadPosts()
  }

  async function handleComment(e, postId) {
    e.preventDefault()
    setError('')
    const text = (drafts[postId] || '').trim()
    if (!text) return

    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: session.user.id,
      content: text,
    })

    if (error) {
      setError(error.message)
    } else {
      setDrafts({ ...drafts, [postId]: '' })
      await loadPosts()
    }
  }

  async function handleDeleteComment(id) {
    setError('')
    const { error } = await supabase.from('comments').delete().eq('id', id)
    if (error) setError(error.message)
    else await loadPosts()
  }

  if (loading) return <FeedSkeleton />

  return (
    <div>
      <div className="hero-card">
        <div className="hero-top">
          <span>Your hive credits</span>
          <Link to="/profile" className="hero-link" title="See your credit history">
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="big-number" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CreditIcon size={36} />
          {me ? me.credits : '...'}
        </div>
        <div className="hero-sub">
          {me ? `Welcome back, ${me.username}` : 'Loading your profile...'}
        </div>
      </div>

      <StatTiles userId={session.user.id} credits={me?.credits} />

      <div className="section-title">
        <span>The hive feed</span>
        <Link to="/create" className="btn btn-primary">+ New post</Link>
      </div>

      {error && <p className="error-text">{error}</p>}

      {posts.length === 0 && (
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>
            No posts yet. <Link to="/create"><strong>Be the first to share something!</strong></Link>
          </p>
        </div>
      )}

      {posts.map((post) => {
        const likedByMe = post.likes.some((l) => l.user_id === session.user.id)
        const author = post.profiles?.username || 'unknown'

        return (
          <div key={post.id} className="card">
            <div className="post-head">
              <div className="avatar">{author.charAt(0)}</div>
              <div>
                <div className="post-author">{author}</div>
                <div className="muted">{new Date(post.created_at).toLocaleString()}</div>
              </div>
            </div>

            <h3 className="post-title">{post.title}</h3>
            {post.skill_tag && <span className="chip">{post.skill_tag}</span>}
            <p className="post-body">{post.content}</p>

            <div className="action-row">
              <button
                className={'icon-btn' + (likedByMe ? ' liked' : '')}
                onClick={() => handleLike(post)}
              >
                <Heart size={16} fill={likedByMe ? 'currentColor' : 'none'} />
                {post.likes.length}
              </button>

              {post.user_id === session.user.id && (
                <button className="icon-btn danger" onClick={() => handleDelete(post.id)}>
                  <Trash2 size={16} /> Delete
                </button>
              )}
            </div>

            <div className="comments">
              <strong>Comments ({post.comments.length})</strong>

              {post.comments.map((c) => (
                <div key={c.id} className="comment">
                  <span>
                    <strong>{c.profiles?.username || 'unknown'}</strong> {c.content}
                  </span>
                  {c.user_id === session.user.id && (
                    <button className="comment-x" onClick={() => handleDeleteComment(c.id)}>x</button>
                  )}
                </div>
              ))}

              <form className="comment-form" onSubmit={(e) => handleComment(e, post.id)}>
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={drafts[post.id] || ''}
                  onChange={(e) => setDrafts({ ...drafts, [post.id]: e.target.value })}
                  maxLength={500}
                />
                <button className="btn btn-primary" type="submit">Send</button>
              </form>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Home