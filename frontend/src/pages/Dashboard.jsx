import { useEffect, useMemo, useState } from 'react'
import api from '../api/client'

function badgeClass(value) {
  return `badge ${value || 'pending'}`
}

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [applications, setApplications] = useState([])

  useEffect(() => {
    api.get('/auth/me').then((res) => setUser(res.data)).catch(() => {})
    api.get('/applications/me').then((res) => setApplications(res.data)).catch(() => {})
  }, [])

  const summary = useMemo(() => ({
    total: applications.length,
    approved: applications.filter((a) => a.status === 'approved').length,
    pending: applications.filter((a) => a.status === 'pending').length,
    avgScore: applications.length ? (applications.reduce((sum, a) => sum + (a.ai_score || 0), 0) / applications.length).toFixed(2) : '0.00',
  }), [applications])

  return (
    <div className="stack">
      <section className="card">
        <h2>Applicant dashboard</h2>
        {user && <p className="muted">Welcome back, <strong>{user.full_name}</strong>. Role: {user.role}</p>}
      </section>

      <section className="grid grid-2">
        <div className="card"><div className="muted small">Applications</div><div className="kpi">{summary.total}</div></div>
        <div className="card"><div className="muted small">Pending</div><div className="kpi">{summary.pending}</div></div>
        <div className="card"><div className="muted small">Approved</div><div className="kpi">{summary.approved}</div></div>
        <div className="card"><div className="muted small">Average AI score</div><div className="kpi">{summary.avgScore}</div></div>
      </section>

      <section className="card">
        <h3>Your applications</h3>
        {applications.length === 0 ? <p className="muted">No applications yet. Create a profile and submit one from the Apply page.</p> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>AI recommendation</th>
                  <th>Risk score</th>
                  <th>Explanation</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>#{app.id}</td>
                    <td>€{app.requested_amount}</td>
                    <td><span className={badgeClass(app.status)}>{app.status}</span></td>
                    <td><span className={badgeClass(app.ai_recommendation)}>{app.ai_recommendation || 'n/a'}</span></td>
                    <td>{app.ai_score ?? 'n/a'}</td>
                    <td className="small">{app.explanation_summary || 'No explanation yet.'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
