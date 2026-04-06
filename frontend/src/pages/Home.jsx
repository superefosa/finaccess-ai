import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="stack">
      <section className="hero">
        <h1>AI-powered lending workflow for underserved applicants</h1>
        <p className="muted">
          FinAccess AI lets applicants create a financial profile, apply for a loan, and receive an
          AI-assisted risk recommendation while administrators retain final decision authority.
        </p>
        <div className="actions" style={{ marginTop: '1rem' }}>
          <Link to="/register"><button>Create account</button></Link>
          <Link to="/login"><button className="secondary">Log in</button></Link>
        </div>
      </section>

      <section className="grid grid-2">
        <div className="card">
          <h3>Applicant workflow</h3>
          <p className="muted">Register, complete a profile, apply for a loan, and monitor the application status end to end.</p>
        </div>
        <div className="card">
          <h3>Admin oversight</h3>
          <p className="muted">Review AI-generated recommendations, inspect application details, and make the final human decision.</p>
        </div>
        <div className="card">
          <h3>Explainable scoring</h3>
          <p className="muted">The prototype highlights contributing risk factors to make decisions easier to interpret during demos.</p>
        </div>
        <div className="card">
          <h3>Capstone-ready stack</h3>
          <p className="muted">FastAPI, React, PostgreSQL, Docker, CI, and a trainable credit-risk model form a strong full-stack Capstone foundation.</p>
        </div>
      </section>
    </div>
  )
}
