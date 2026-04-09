import { Link, useNavigate } from 'react-router-dom'
import { clearAuth, getToken, getUserRole } from '../utils/auth'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function NavBar() {
  const navigate = useNavigate()
  const token = getToken()
  const role = getUserRole()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const logout = () => {
    clearAuth()
    navigate('/login')
    window.location.reload()
  }

  const NavLink = ({ to, children }) => (
    <Link to={to} className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
      {children}
    </Link>
  )

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Icon and Text */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Link to="/" className="flex items-center gap-2">
              {/* Logo Icon - Circular F */}
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-extrabold text-lg">F</span>
              </div>
              {/* Logo Text */}
              <span className="text-xl font-bold text-primary-600">
                FinAccess
              </span>
              <span className="text-xl font-bold text-gray-700">
                AI
              </span>
            </Link>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/">Home</NavLink>
            
            {token ? (
              <>
                {role !== 'admin' && (
                  <>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/profile">Profile</NavLink>
                    <NavLink to="/apply">Apply</NavLink>
                  </>
                )}
                
                {role === 'admin' && (
                  <NavLink to="/admin">Admin Dashboard</NavLink>
                )}
                
                <motion.button
                  onClick={logout}
                  className="bg-gray-900 text-white px-5 py-2 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <NavLink to="/register">Register</NavLink>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/login" className="bg-primary-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-primary-700 transition-colors">
                    Login
                  </Link>
                </motion.div>
              </>
            )}
          </div>
          
          <motion.button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>
        
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden py-4 border-t border-gray-100 space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <NavLink to="/">Home</NavLink>
              {token ? (
                <>
                  {role !== 'admin' && (
                    <>
                      <NavLink to="/dashboard">Dashboard</NavLink>
                      <NavLink to="/profile">Profile</NavLink>
                      <NavLink to="/apply">Apply</NavLink>
                    </>
                  )}
                  {role === 'admin' && (
                    <NavLink to="/admin">Admin Dashboard</NavLink>
                  )}
                  <motion.button
                    onClick={logout}
                    className="w-full bg-gray-900 text-white px-5 py-2 rounded-xl font-semibold hover:bg-gray-800"
                    whileTap={{ scale: 0.95 }}
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <NavLink to="/register">Register</NavLink>
                  <Link to="/login" className="block w-full bg-primary-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-primary-700 text-center">
                    Login
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}