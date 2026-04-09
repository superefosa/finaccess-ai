import { useState } from 'react'
import api from '../api/client'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export default function Register() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [form, setForm] = useState({ 
    full_name: '', email: '', password: '', confirmPassword: '', role: 'user' 
  })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const validateStep = () => {
    if (activeStep === 0) {
      if (!form.full_name || form.full_name.length < 2) { setError('Please enter your full name'); return false }
      if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Please enter a valid email address'); return false }
      if (!form.password || form.password.length < 8) { setError('Password must be at least 8 characters'); return false }
      if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return false }
    }
    setError('')
    return true
  }

  const handleNext = () => { if (validateStep()) setActiveStep((prev) => prev + 1) }
  const handleBack = () => { setActiveStep((prev) => prev - 1); setError('') }

  const getPasswordStrength = (password) => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]/)) strength++
    if (password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++
    return strength
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validateStep()) return
    setError('')
    setLoading(true)
    try {
      const { confirmPassword, ...submitData } = form
      await api.post('/auth/register', submitData)
      setActiveStep(2)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
      setLoading(false)
    }
  }

  const passwordStrength = getPasswordStrength(form.password)
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600']
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']

  return (
    <motion.div 
      className="max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card">
        <div className="bg-gradient-to-r from-primary-50 to-gray-50 -m-6 p-6 rounded-t-2xl border-b border-gray-100">
          <h2 className="text-2xl font-bold">Create Your Account</h2>
          <p className="text-gray-600 text-sm">Join FinAccess AI and get access to fair lending solutions</p>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-center mb-6">
            {['Account Details', 'Role Selection', 'Confirmation'].map((label, idx) => (
              <div key={idx} className="flex items-center">
                <motion.div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    ${idx <= activeStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                  animate={idx === activeStep ? { scale: [1, 1.2, 1] } : {}}
                >
                  {idx + 1}
                </motion.div>
                <span className={`ml-2 text-sm ${idx <= activeStep ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  {label}
                </span>
                {idx < 2 && <div className="w-8 h-px bg-gray-200 mx-2"></div>}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeStep === 2 ? (
              <motion.div 
                key="success"
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="text-6xl mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  ✅
                </motion.div>
                <h3 className="text-xl font-bold mb-2">Registration Successful!</h3>
                <p className="text-gray-600 mb-4">Redirecting you to login...</p>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    className="bg-primary-600 h-2 rounded-full"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, ease: "linear" }}
                    style={{ width: '100%' }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                onSubmit={activeStep === 1 ? submit : (e) => { e.preventDefault(); handleNext(); }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
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

                {activeStep === 0 && (
                  <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                        <input type="text" value={form.full_name} onChange={e => update('full_name', e.target.value)} className="input-field pl-10" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
                        <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="input-field pl-10" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                        <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} className="input-field pl-10 pr-10" required />
                        <motion.button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </motion.button>
                      </div>
                      {form.password && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <motion.div 
                              className={`${strengthColors[passwordStrength]} h-2 rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Strength: {strengthLabels[passwordStrength]}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                      <input type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} className={`input-field ${form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-300' : ''}`} required />
                      {form.confirmPassword && form.password !== form.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                      )}
                    </div>
                    <motion.button type="submit" className="btn-primary w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Continue</motion.button>
                  </motion.div>
                )}

                {activeStep === 1 && (
                  <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Role</label>
                      <select value={form.role} onChange={e => update('role', e.target.value)} className="input-field">
                        <option value="user">👤 User Account - Apply for loans</option>
                        <option value="admin">👑 Admin Account - Review applications</option>
                      </select>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-700"><strong>Summary:</strong><br />Name: {form.full_name}<br />Email: {form.email}<br />Role: {form.role}</p>
                    </div>
                    <div className="flex gap-3">
                      <motion.button type="button" onClick={handleBack} className="btn-secondary flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Back</motion.button>
                      <motion.button type="submit" disabled={loading} className="btn-primary flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        {loading ? <span className="flex items-center justify-center gap-2"><motion.span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity }} />Creating...</span> : 'Create Account'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}