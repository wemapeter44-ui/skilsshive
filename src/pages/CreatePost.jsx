import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function CreatePost({ session }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [skillTag, setSkillTag] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { error } = await supabase.from('posts').insert({
      user_id: session.user.id,
      title: title.trim(),
      content: content.trim(),
      skill_tag: skillTag.trim() || null,
    })

    if (error) {
      setError(error.message)
      setSaving(false)
    } else {
      navigate('/home')
    }
  }

  return (
    <div style={{ maxWidth: '520px', margin: '3rem auto', fontFamily: 'sans-serif' }}>
      <h2>Share something with the hive 🐝</h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <input
          type="text"
          placeholder="Title (e.g. 3 tips for learning guitar chords)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={3}
          maxLength={120}
        />
        <input
          type="text"
          placeholder="Skill tag (optional, e.g. Guitar)"
          value={skillTag}
          onChange={(e) => setSkillTag(e.target.value)}
          maxLength={40}
        />
        <textarea
          placeholder="Write your tip, tutorial, or question..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={8}
          maxLength={2000}
        />
        <button type="submit" disabled={saving}>
          {saving ? 'Posting...' : 'Post'}
        </button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}
    </div>
  )
}

export default CreatePost