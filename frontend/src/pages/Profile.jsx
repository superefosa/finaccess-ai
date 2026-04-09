import { useEffect, useState } from 'react'
import api from '../api/client'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const initial = {
  age: 30, employment_status: 'full_time', monthly_income: 3000,
  monthly_expenses: 1500, current_debt: 500, years_employed: 2,
  housing_status: 'renting', dependents: 0,
}

export default function Profile() {
  const [form, setForm] = useState(initial)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [profileComplete, setProfileComplete] = useState(false)

  useEffect(() => { loadProfile() }, [])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const res = await api.get('/profiles/me')
      setForm(res.data)
      setProfileComplete(true)
    } catch (err) {
      console.log('No existing profile')
    } finally {
      setLoading(false)
    }
  }

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      await api.post('/profiles', form)
      setMessage('Profile saved successfully! You can now apply for loans.')
      setProfileComplete(true)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save profile')
    }
  }

  const calculateMetrics = () => {
    const disposableIncome = form.monthly_income - form.monthly_expenses
    return {
      disposableIncome,
      debtToIncome: ((form.current_debt / form.monthly_income) * 100).toFixed(1),
      savingsRate: ((disposableIncome / form.monthly_income) * 100).toFixed(1)
    }
  }

  const metrics = calculateMetrics()
  
  const profileProgress = () => {
    const fields = Object.values(form)
    return (fields.filter(v => v !== null && v !== undefined && v !== '').length / fields.length) * 100
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <motion.div 
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-gray-500 animate-pulse">Loading profile...</p>
      </div>
    )
  }

  const fields = [
    { name: 'age', label: 'Age', type: 'number', placeholder: 'e.g., 30', min: 18, max: 100, step: 1 },
    { name: 'employment_status', label: 'Employment Status', type: 'select', options: [
      { value: 'full_time', label: 'Full Time' }, { value: 'part_time', label: 'Part Time' },
      { value: 'self_employed', label: 'Self-Employed' }, { value: 'unemployed', label: 'Unemployed' }
    ]},
    { name: 'monthly_income', label: 'Monthly Income (€)', type: 'number', placeholder: 'e.g., 3000', min: 0, step: 100 },
    { name: 'monthly_expenses', label: 'Monthly Expenses (€)', type: 'number', placeholder: 'e.g., 1500', min: 0, step: 100 },
    { name: 'current_debt', label: 'Current Debt (€)', type: 'number', placeholder: 'e.g., 500', min: 0, step: 100 },
    { name: 'years_employed', label: 'Years Employed', type: 'number', placeholder: 'e.g., 2', min: 0, max: 50, step: 0.5 },
    { name: 'housing_status', label: 'Housing Status', type: 'select', options: [
      { value: 'renting', label: 'Renting' }, { value: 'own_home', label: 'Own Home' },
      { value: 'living_with_family', label: 'Living with Family' }
    ]},
    { name: 'dependents', label: 'Dependents', type: 'number', placeholder: 'e.g., 0', min: 0, max: 20, step: 1 },
  ]

  return (
    <motion.div 
      className="max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="bg-gradient-to-r from-primary-50 to-gray-50 -m-6 p-6 rounded-t-2xl border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Financial Profile</h2>
                  <p className="text-gray-600 text-sm">Complete your profile to apply for loans</p>
                </div>
                <motion.button 
                  onClick={loadProfile} 
                  className="p-2 hover:bg-gray-100 rounded-full"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.5 }}
                >
                  🔄
                </motion.button>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Profile Completion</span>
                  <span className="text-gray-600">{profileProgress().toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-primary-500 to-primary-700 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${profileProgress()}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              <form onSubmit={submit} className="space-y-4">
                <AnimatePresence>
                  {message && (
                    <motion.div 
                      className="bg-green-50 text-green-600 p-3 rounded-xl text-sm"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {message}
                    </motion.div>
                  )}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fields.map((field, idx) => (
                    <motion.div 
                      key={field.name} 
                      className="space-y-1"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                        {field.type !== 'select' && (
                          <span className="text-gray-400 font-normal ml-1">({field.placeholder})</span>
                        )}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          value={form[field.name]}
                          onChange={(e) => update(field.name, e.target.value)}
                          className="input-field"
                        >
                          {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={form[field.name]}
                          onChange={(e) => update(field.name, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                          className="input-field"
                          min={field.min}
                          max={field.max}
                          step={field.step}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.button 
                  type="submit" 
                  className="btn-primary w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  💾 Save Profile
                </motion.button>
              </form>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-bold text-lg mb-4">Financial Health</h3>
            <div className="space-y-4">
              {[
                { label: 'Disposable Income', value: metrics.disposableIncome, suffix: '€', desc: 'Income minus expenses', color: metrics.disposableIncome > 0 ? 'green' : 'red' },
                { label: 'Debt-to-Income Ratio', value: metrics.debtToIncome, suffix: '%', desc: 'Total debt ÷ Monthly income', 
                  color: parseFloat(metrics.debtToIncome) < 40 ? 'green' : parseFloat(metrics.debtToIncome) < 60 ? 'yellow' : 'red' },
                { label: 'Savings Rate', value: metrics.savingsRate, suffix: '%', desc: 'Disposable income ÷ Monthly income',
                  color: parseFloat(metrics.savingsRate) > 20 ? 'green' : parseFloat(metrics.savingsRate) > 10 ? 'yellow' : 'red' }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold">{item.value}{item.suffix}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div 
                      className={`h-2 rounded-full ${
                        item.color === 'green' ? 'bg-green-600' : item.color === 'yellow' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(parseFloat(item.value) || 0, 100)}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-bold text-lg mb-4">Profile Tips</h3>
            <div className="space-y-3">
              {[
                { icon: '💰', title: 'Keep debt-to-income below 40%', desc: 'Lower debt ratios improve creditworthiness.' },
                { icon: '📈', title: 'Maintain stable employment', desc: 'Longer history demonstrates reliability.' },
                { icon: '🏠', title: 'Housing stability matters', desc: 'Stable housing indicates responsibility.' }
              ].map((tip, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ x: 5 }}
                >
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full mb-1">
                    {tip.icon} {tip.title}
                  </span>
                  <p className="text-sm text-gray-600">{tip.desc}</p>
                  {idx < 2 && <div className="border-t my-3"></div>}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <AnimatePresence>
            {profileComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <Link to="/apply" className="btn-primary w-full text-center block">
                  Apply for a Loan →
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}