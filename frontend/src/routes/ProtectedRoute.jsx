import { Navigate } from 'react-router-dom'
import { getToken, getUserRole } from '../utils/auth'

export default function ProtectedRoute({ children, requiredRole = null }) {
  const token = getToken()
  const role = getUserRole()
  
  // Not logged in - redirect to login
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  // Role-specific protection
  if (requiredRole) {
    // If route requires 'user' but user is admin, redirect to admin
    if (requiredRole === 'user' && role === 'admin') {
      return <Navigate to="/admin" replace />
    }
    // If route requires 'admin' but user is not admin, redirect to dashboard
    if (requiredRole === 'admin' && role !== 'admin') {
      return <Navigate to="/dashboard" replace />
    }
  }
  
  return children
}