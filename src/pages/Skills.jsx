import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

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

  if (loading) return <p style={{ padding: '2rem', fontFamily: 'sans-serif' }}>Loading skills...</p>

  return (
    <div style={{ maxWidth: '480px', margin: '3rem auto', fontFamily: 'sans-serif' }}>
      <h2>Your skills</h2>

      <form onSubmit={handleAdd} style={{ display: 'grid', gap: '0.75rem' }}>
        <input
          type="text"
          placeholder="Skill name (e.g. Guitar, Excel, Cooking)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={60}
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="offer">I can teach this</option>
          <option value="learn">I want to learn this</option>
        </select>
        {type === 'offer' && (
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        )}
        <button type="submit" disabled={saving}>
          {saving ? 'Adding...' : 'Add skill'}
        </button>
      </form>

      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <h3>I can teach</h3>
      {offered.length === 0 && <p style={{ color: 'gray' }}>Nothing added yet.</p>}
      <ul>
        {offered.map((s) => (
          <li key={s.id}>
            {s.name} ({s.level}){' '}
            <button onClick={() => handleDelete(s.id)}>Remove</button>
          </li>
        ))}
      </ul>

      <h3>I want to learn</h3>
      {wanted.length === 0 && <p style={{ color: 'gray' }}>Nothing added yet.</p>}
      <ul>
        {wanted.map((s) => (
          <li key={s.id}>
            {s.name}{' '}
            <button onClick={() => handleDelete(s.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Skills