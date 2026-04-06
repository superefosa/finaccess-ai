import { useState } from 'react'
import api from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'user' })
  const [error, setError] = useState('')

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/auth/register', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    }
  }

  return (
    <div className="card form-card">
      <form className="stack" onSubmit={submit}>
        <div>
          <h2>Create account</h2>
          <p className="muted">Use a normal user account for applicant testing. Create an admin account only for review workflows.</p>
        </div>
        {error && <div className="error">{error}</div>}
        <div>
          <label>Full name</label>
          <input value={form.full_name} onChange={(e) => update('full_name', e.target.value)} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
        </div>
        <div>
          <label>Role</label>
          <select value={form.role} onChange={(e) => update('role', e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Create account</button>
      </form>
    </div>
  )
}
