import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function Home({ session }) {
  const [posts, setPosts] = useState([])
  const [drafts, setDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  if (loading) return <p style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Loading feed...</p>

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>The hive feed 🐝</h2>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {posts.length === 0 && (
        <p style={{ color: 'gray' }}>
          No posts yet. <Link to="/create">Be the first to share something!</Link>
        </p>
      )}

      {posts.map((post) => {
        const likedByMe = post.likes.some((l) => l.user_id === session.user.id)

        return (
          <div
            key={post.id}
            style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}
          >
            <h3 style={{ margin: '0 0 0.25rem' }}>{post.title}</h3>
            <small style={{ color: 'gray' }}>
              by <strong>{post.profiles?.username || 'unknown'}</strong> ·{' '}
              {new Date(post.created_at).toLocaleString()}
              {post.skill_tag && <> · 🏷️ {post.skill_tag}</>}
            </small>
            <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button onClick={() => handleLike(post)}>
                {likedByMe ? '❤️ Liked' : '🤍 Like'}
              </button>
              <span>{post.likes.length}</span>

              {post.user_id === session.user.id && (
                <button onClick={() => handleDelete(post.id)} style={{ marginLeft: 'auto' }}>
                  Delete my post
                </button>
              )}
            </div>

            <div style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
              <strong>Comments ({post.comments.length})</strong>

              {post.comments.map((c) => (
                <div key={c.id} style={{ margin: '0.5rem 0', fontSize: '0.95rem' }}>
                  <strong>{c.profiles?.username || 'unknown'}</strong>: {c.content}{' '}
                  {c.user_id === session.user.id && (
                    <button onClick={() => handleDeleteComment(c.id)}>✕</button>
                  )}
                </div>
              ))}

              <form
                onSubmit={(e) => handleComment(e, post.id)}
                style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}
              >
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={drafts[post.id] || ''}
                  onChange={(e) => setDrafts({ ...drafts, [post.id]: e.target.value })}
                  maxLength={500}
                  style={{ flex: 1 }}
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Home