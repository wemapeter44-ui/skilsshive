import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import './CreatePost.css'

function CreatePost({ session }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [skillTag, setSkillTag] = useState('')
  const [mySkills, setMySkills] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function loadMySkills() {
      const { data } = await supabase
        .from('skills')
        .select('id, name')
        .eq('user_id', session.user.id)
        .eq('type', 'offer')
        .order('created_at', { ascending: false })
        .limit(8)

      setMySkills(data || [])
    }
    loadMySkills()
  }, [session.user.id])

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
    <div>
      <div className="hero-card">
        <div className="hero-top">
          <span>Share with the hive</span>
        </div>
        <div className="cp-hero-text">
          Post a tip, a mini tutorial, or a question. Posts earn hive credits, up to a daily limit.
        </div>
      </div>

      <div className="card">
        <form className="cp-form" onSubmit={handleSubmit}>
          <div className="cp-field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="e.g. 3 tips for learning guitar chords"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              maxLength={120}
            />
            <span className="muted cp-counter">{title.length}/120</span>
          </div>

          <div className="cp-field">
            <label htmlFor="skillTag">Skill tag (optional)</label>
            <input
              id="skillTag"
              type="text"
              placeholder="e.g. Guitar"
              value={skillTag}
              onChange={(e) => setSkillTag(e.target.value)}
              maxLength={40}
            />
            {mySkills.length > 0 && (
              <div className="cp-suggestions">
                {mySkills.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className={'cp-suggest' + (skillTag === s.name ? ' active' : '')}
                    onClick={() => setSkillTag(s.name)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="cp-field">
            <label htmlFor="content">Your post</label>
            <textarea
              id="content"
              placeholder="Write your tip, tutorial, or question..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={8}
              maxLength={2000}
            />
            <span className="muted cp-counter">{content.length}/2000</span>
          </div>

          <button className="btn btn-primary cp-submit" type="submit" disabled={saving}>
            <Send size={16} /> {saving ? 'Posting...' : 'Publish post'}
          </button>

          {error && <span className="error-text">{error}</span>}
        </form>
      </div>
    </div>
  )
}

export default CreatePost