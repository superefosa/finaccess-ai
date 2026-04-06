import { Navigate } from 'react-router-dom'
import { getToken, getUserRole } from '../utils/auth'

export default function ProtectedRoute({ children, requiredRole = null }) {
  const token = getToken()
  const role = getUserRole()
  if (!token) return <Navigate to="/login" replace />
  if (requiredRole && role !== requiredRole) return <Navigate to="/dashboard" replace />
  return children
}
