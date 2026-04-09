import { Navigate } from 'react-router-dom'
import { getToken, getUserRole } from '../utils/auth'

// Redirects to appropriate dashboard if already logged in
export default function PublicRoute({ children }) {
  const token = getToken()
  const role = getUserRole()
  
  if (token) {
    // If already logged in, redirect to appropriate dashboard
    return <Navigate to={role === 'admin' ? '/admin' : '/dashboard'} replace />
  }
  
  return children
}