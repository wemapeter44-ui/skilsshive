import { useEffect, useState } from 'react'
import { GraduationCap, BookOpen, Plus, X } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import './Skills.css'

const LEVEL_LABELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  expert: 'Expert',
}

function Skills({ session }) {
  const [skills, setSkills] = useState([])
  const [name, setName] = useState('')
  const [type, setType] = useState('offer')
  const [level, setLevel] = useState('beginner')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadSkills() {
    const { data, error } = await supabase
      .from('skills')
      .select('id, name, type, level')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setSkills(data)
    setLoading(false)
  }

  useEffect(() => {
    loadSkills()
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const { error } = await supabase.from('skills').insert({
      user_id: session.user.id,
      name: name.trim(),
      type,
      level: type === 'offer' ? level : null,
    })

    if (error) {
      setError(error.message)
    } else {
      setName('')
      await loadSkills()
    }
    setSaving(false)
  }

  async function handleDelete(id) {
    setError('')
    const { error } = await supabase.from('skills').delete().eq('id', id)
    if (error) setError(error.message)
    else await loadSkills()
  }

  const offered = skills.filter((s) => s.type === 'offer')
  const wanted = skills.filter((s) => s.type === 'learn')

  if (loading) return <p className="muted">Loading skills...</p>

  return (
    <div>
      <div className="card">
        <h2 style={{ margin: 0 }}>Your skills</h2>
        <p className="muted" style={{ margin: '0.25rem 0 0' }}>
          Tell the hive what you can teach and what you want to learn.
        </p>
      </div>

      <div className="card">
        <h3>Add a skill</h3>
        <form className="sk-form" onSubmit={handleAdd}>
          <div className="sk-toggle">
            <button
              type="button"
              className={'sk-toggle-btn' + (type === 'offer' ? ' active' : '')}
              onClick={() => setType('offer')}
            >
              <GraduationCap size={16} /> I can teach
            </button>
            <button
              type="button"
              className={'sk-toggle-btn' + (type === 'learn' ? ' active' : '')}
              onClick={() => setType('learn')}
            >
              <BookOpen size={16} /> I want to learn
            </button>
          </div>

          <input
            type="text"
            placeholder="Skill name (e.g. Guitar, Excel, Cooking)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={60}
          />

          {type === 'offer' && (
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          )}

          <button className="btn btn-primary sk-add" type="submit" disabled={saving}>
            <Plus size={16} /> {saving ? 'Adding...' : 'Add skill'}
          </button>

          {error && <span className="error-text">{error}</span>}
        </form>
      </div>

      <div className="section-title">
        <span>I can teach</span>
        <span className="muted">{offered.length}</span>
      </div>

      {offered.length === 0 && (
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>Nothing added yet.</p>
        </div>
      )}

      {offered.map((s) => (
        <div key={s.id} className="sk-row">
          <div className="sk-icon">
            <GraduationCap size={18} />
          </div>
          <div className="sk-name">{s.name}</div>
          {s.level && <span className="chip sk-chip">{LEVEL_LABELS[s.level]}</span>}
          <button
            className="sk-remove"
            onClick={() => handleDelete(s.id)}
            aria-label={'Remove ' + s.name}
            title="Remove"
          >
            <X size={16} />
          </button>
        </div>
      ))}

      <div className="section-title">
        <span>I want to learn</span>
        <span className="muted">{wanted.length}</span>
      </div>

      {wanted.length === 0 && (
        <div className="card">
          <p className="muted" style={{ margin: 0 }}>Nothing added yet.</p>
        </div>
      )}

      {wanted.map((s) => (
        <div key={s.id} className="sk-row">
          <div className="sk-icon learn">
            <BookOpen size={18} />
          </div>
          <div className="sk-name">{s.name}</div>
          <button
            className="sk-remove"
            onClick={() => handleDelete(s.id)}
            aria-label={'Remove ' + s.name}
            title="Remove"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default Skills