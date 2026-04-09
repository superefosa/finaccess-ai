import { useState } from 'react'
import api from '../api/client'
import { saveToken, saveUserRole } from '../utils/auth'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      saveToken(data.access_token)
      const me = await api.get('/auth/me', { 
        headers: { Authorization: `Bearer ${data.access_token}` } 
      })
      saveUserRole(me.data.role)
      navigate(me.data.role === 'admin' ? '/admin' : '/dashboard')
      window.location.reload()
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = (type) => {
    if (type === 'user') {
      setForm({ email: 'user@example.com', password: 'UserPass123!' })
    } else {
      setForm({ email: 'admin@example.com', password: 'AdminPass123!' })
    }
  }

  return (
    <motion.div 
      className="max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card">
        <div className="bg-gradient-to-r from-primary-50 to-gray-50 -m-6 p-6 rounded-t-2xl border-b border-gray-100">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <motion.span 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              👋
            </motion.span>
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm">Sign in to access your FinAccess AI dashboard</p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div 
                className="bg-red-50 text-red-600 p-3 rounded-xl text-sm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field pl-10"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-field pl-10 pr-10"
                required
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </motion.button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span 
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                Signing in...
              </span>
            ) : 'Sign In'}
          </motion.button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Quick Demo Access:</p>
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                type="button"
                onClick={() => fillDemoCredentials('user')}
                className="btn-secondary text-sm py-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                👤 Demo User
              </motion.button>
              <motion.button
                type="button"
                onClick={() => fillDemoCredentials('admin')}
                className="btn-secondary text-sm py-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                👑 Demo Admin
              </motion.button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Create one now
            </Link>
          </p>
        </form>
      </div>

      <motion.div 
        className="mt-4 p-4 bg-blue-50 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs text-gray-600">
          <strong>Demo Credentials:</strong><br />
          User: user@example.com / UserPass123!<br />
          Admin: admin@example.com / AdminPass123!
        </p>
      </motion.div>
    </motion.div>
  )
}