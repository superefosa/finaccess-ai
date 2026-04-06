import { Link, useNavigate } from 'react-router-dom'
import { clearAuth, getToken, getUserRole } from '../utils/auth'

export default function NavBar() {
  const navigate = useNavigate()
  const token = getToken()
  const role = getUserRole()

  const logout = () => {
    clearAuth()
    navigate('/login')
    window.location.reload()
  }

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link className="brand" to="/">FinAccess AI</Link>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          {token ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/apply">Apply</Link>
              {role === 'admin' && <Link to="/admin">Admin</Link>}
              <button onClick={logout} className="secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
