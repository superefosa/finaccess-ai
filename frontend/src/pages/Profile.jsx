import { useEffect, useState } from 'react'
import api from '../api/client'

const initial = {
  age: 30,
  employment_status: 'full_time',
  monthly_income: 3000,
  monthly_expenses: 1500,
  current_debt: 500,
  years_employed: 2,
  housing_status: 'renting',
  dependents: 0,
}

export default function Profile() {
  const [form, setForm] = useState(initial)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/profiles/me').then((res) => setForm(res.data)).catch(() => {})
  }, [])

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      await api.post('/profiles', form)
      setMessage('Profile saved successfully.')
    } catch (err) {
      setError(err.response?.data?.detail || 'Profile save failed')
    }
  }

  return (
    <div className="card">
      <form className="stack" onSubmit={submit}>
        <div>
          <h2>Financial profile</h2>
          <p className="muted">Complete this before you apply for a loan. The scoring model uses these inputs to estimate risk.</p>
        </div>
        {message && <div className="success">{message}</div>}
        {error && <div className="error">{error}</div>}
        <div className="form-grid">
          <div>
            <label>Age</label>
            <input type="number" value={form.age} onChange={(e) => update('age', Number(e.target.value))} />
          </div>
          <div>
            <label>Employment status</label>
            <select value={form.employment_status} onChange={(e) => update('employment_status', e.target.value)}>
              <option value="unemployed">Unemployed</option>
              <option value="part_time">Part time</option>
              <option value="full_time">Full time</option>
              <option value="self_employed">Self-employed</option>
            </select>
          </div>
          <div>
            <label>Monthly income</label>
            <input type="number" value={form.monthly_income} onChange={(e) => update('monthly_income', Number(e.target.value))} />
          </div>
          <div>
            <label>Monthly expenses</label>
            <input type="number" value={form.monthly_expenses} onChange={(e) => update('monthly_expenses', Number(e.target.value))} />
          </div>
          <div>
            <label>Current debt</label>
            <input type="number" value={form.current_debt} onChange={(e) => update('current_debt', Number(e.target.value))} />
          </div>
          <div>
            <label>Years employed</label>
            <input type="number" value={form.years_employed} onChange={(e) => update('years_employed', Number(e.target.value))} />
          </div>
          <div>
            <label>Housing status</label>
            <select value={form.housing_status} onChange={(e) => update('housing_status', e.target.value)}>
              <option value="renting">Renting</option>
              <option value="family">Living with family</option>
              <option value="owning">Owning</option>
            </select>
          </div>
          <div>
            <label>Dependents</label>
            <input type="number" value={form.dependents} onChange={(e) => update('dependents', Number(e.target.value))} />
          </div>
        </div>
        <button type="submit">Save profile</button>
      </form>
    </div>
  )
}
