import { useState } from 'react'
import api from '../api/client'

export default function Apply() {
  const [form, setForm] = useState({ requested_amount: 2000, loan_purpose: 'education', repayment_months: 12 })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    try {
      const { data } = await api.post('/applications', form)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Application failed')
    }
  }

  return (
    <div className="card form-card">
      <form className="stack" onSubmit={submit}>
        <div>
          <h2>Loan application</h2>
          <p className="muted">Submit a request after completing your financial profile.</p>
        </div>
        {error && <div className="error">{error}</div>}
        <div>
          <label>Requested amount</label>
          <input type="number" value={form.requested_amount} onChange={(e) => setForm({ ...form, requested_amount: Number(e.target.value) })} />
        </div>
        <div>
          <label>Loan purpose</label>
          <select value={form.loan_purpose} onChange={(e) => setForm({ ...form, loan_purpose: e.target.value })}>
            <option value="education">Education</option>
            <option value="small_business">Small business</option>
            <option value="housing">Housing</option>
            <option value="medical">Medical</option>
            <option value="family_support">Family support</option>
          </select>
        </div>
        <div>
          <label>Repayment months</label>
          <input type="number" value={form.repayment_months} onChange={(e) => setForm({ ...form, repayment_months: Number(e.target.value) })} />
        </div>
        <button type="submit">Submit application</button>
      </form>

      {result && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <h3>Decision support result</h3>
          <p>Status: <span className={`badge ${result.status}`}>{result.status}</span></p>
          <p>AI recommendation: <span className={`badge ${result.ai_recommendation}`}>{result.ai_recommendation}</span></p>
          <p>Risk score: <strong>{result.ai_score}</strong></p>
          <p className="muted">{result.explanation_summary}</p>
        </div>
      )}
    </div>
  )
}
