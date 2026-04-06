import { useEffect, useMemo, useState } from 'react'
import api from '../api/client'

export default function Admin() {
  const [applications, setApplications] = useState([])
  const [error, setError] = useState('')

  const load = () => {
    api.get('/admin/applications')
      .then((res) => setApplications(res.data))
      .catch((err) => setError(err.response?.data?.detail || 'Admin access failed'))
  }

  useEffect(() => { load() }, [])

  const decide = async (id, final_decision) => {
    await api.patch(`/admin/applications/${id}/decision`, { final_decision })
    load()
  }

  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  }), [applications])

  return (
    <div className="stack">
      <section className="card">
        <h2>Admin review dashboard</h2>
        <p className="muted">Review AI-assessed applications and make final lending decisions.</p>
        {error && <div className="error">{error}</div>}
      </section>

      <section className="grid grid-2">
        <div className="card"><div className="muted small">Total</div><div className="kpi">{stats.total}</div></div>
        <div className="card"><div className="muted small">Pending</div><div className="kpi">{stats.pending}</div></div>
        <div className="card"><div className="muted small">Approved</div><div className="kpi">{stats.approved}</div></div>
        <div className="card"><div className="muted small">Rejected</div><div className="kpi">{stats.rejected}</div></div>
      </section>

      <section className="card">
        <h3>Applications</h3>
        {applications.length === 0 ? <p className="muted">No applications yet.</p> : applications.map((app) => (
          <div key={app.id} className="card" style={{ marginTop: '1rem' }}>
            <div className="actions" style={{ justifyContent: 'space-between' }}>
              <div>
                <strong>Application #{app.id}</strong>
                <div className="small muted">Requested amount: €{app.requested_amount} • Repayment: {app.repayment_months} months</div>
              </div>
              <div className="actions">
                <span className={`badge ${app.ai_recommendation}`}>{app.ai_recommendation}</span>
                <span className={`badge ${app.status}`}>{app.status}</span>
              </div>
            </div>
            <p className="small">Risk score: <strong>{app.ai_score}</strong></p>
            <p className="muted">{app.explanation_summary}</p>
            <p className="small">Final decision: <strong>{app.final_decision || 'not set'}</strong></p>
            <div className="actions">
              <button onClick={() => decide(app.id, 'approved')}>Approve</button>
              <button className="danger" onClick={() => decide(app.id, 'rejected')}>Reject</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
