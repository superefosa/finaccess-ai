import { useState } from 'react'
import api from '../api/client'
import { saveToken, saveUserRole } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      saveToken(data.access_token)
      const me = await api.get('/auth/me', { headers: { Authorization: `Bearer ${data.access_token}` } })
      saveUserRole(me.data.role)
      navigate(me.data.role === 'admin' ? '/admin' : '/dashboard')
      window.location.reload()
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div className="card form-card">
      <form className="stack" onSubmit={submit}>
        <div>
          <h2>Log in</h2>
          <p className="muted">Use the seeded demo credentials or log in with an account you created.</p>
        </div>
        {error && <div className="error">{error}</div>}
        <div>
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
