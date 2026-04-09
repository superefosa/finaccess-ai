import { useState } from 'react'
import api from '../api/client'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const steps = ['Loan Details', 'Review Terms', 'Submit']

export default function Apply() {
  const [activeStep, setActiveStep] = useState(0)
  const [form, setForm] = useState({ requested_amount: 5000, loan_purpose: 'education', repayment_months: 12 })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const calculateMonthlyPayment = () => {
    const interestRate = 0.085
    const monthlyRate = interestRate / 12
    return (form.requested_amount * monthlyRate * Math.pow(1 + monthlyRate, form.repayment_months) / 
      (Math.pow(1 + monthlyRate, form.repayment_months) - 1)).toFixed(2)
  }

  const monthlyPayment = calculateMonthlyPayment()
  const totalRepayment = (monthlyPayment * form.repayment_months).toFixed(2)

  const submit = async (e) => {
    e.preventDefault()
    if (activeStep < 2) {
      setActiveStep(activeStep + 1)
      return
    }
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const { data } = await api.post('/applications', form)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Application failed')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <motion.div 
      className="max-w-3xl mx-auto"
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
              💰
            </motion.span>
            Loan Application
          </h2>
          <p className="text-gray-600 text-sm">Complete your application in 3 simple steps</p>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-center mb-6">
            {steps.map((label, idx) => (
              <div key={idx} className="flex items-center">
                <motion.div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    ${idx <= activeStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}
                  animate={idx === activeStep ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {idx + 1}
                </motion.div>
                <span className={`ml-2 text-sm hidden sm:inline ${idx <= activeStep ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  {label}
                </span>
                {idx < 2 && <div className="w-8 sm:w-12 h-px bg-gray-200 mx-2"></div>}
              </div>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="bg-red-50 text-red-600 p-4 rounded-xl"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <div>
                    <h3 className="text-lg font-semibold mb-2">How much would you like to borrow?</h3>
                    <motion.p 
                      className="text-4xl font-bold text-primary-600 mb-4"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 0.3 }}
                      key={form.requested_amount}
                    >
                      €{form.requested_amount.toLocaleString()}
                    </motion.p>
                    <input
                      type="range"
                      min="1000"
                      max="50000"
                      step="500"
                      value={form.requested_amount}
                      onChange={(e) => setForm({ ...form, requested_amount: Number(e.target.value) })}
                      className="w-full accent-primary-600"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>€1K</span>
                      <span>€25K</span>
                      <span>€50K</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loan Purpose</label>
                    <select
                      value={form.loan_purpose}
                      onChange={(e) => setForm({ ...form, loan_purpose: e.target.value })}
                      className="input-field"
                    >
                      <option value="education">📚 Education</option>
                      <option value="small_business">💼 Small Business</option>
                      <option value="housing">🏠 Housing</option>
                      <option value="medical">🏥 Medical</option>
                      <option value="family_support">👨‍👩‍👧 Family Support</option>
                      <option value="debt_consolidation">💰 Debt Consolidation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Repayment Period: {form.repayment_months} months
                    </label>
                    <input
                      type="range"
                      min="6"
                      max="60"
                      step="6"
                      value={form.repayment_months}
                      onChange={(e) => setForm({ ...form, repayment_months: Number(e.target.value) })}
                      className="w-full accent-primary-600"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>6m</span>
                      <span>1y</span>
                      <span>2y</span>
                      <span>3y</span>
                      <span>5y</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  <motion.div 
                    className="bg-primary-50 p-6 rounded-xl"
                    whileHover={{ scale: 1.01 }}
                  >
                    <h3 className="text-lg font-bold mb-4">Loan Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-gray-500 text-sm">Loan Amount</p><p className="font-bold">€{form.requested_amount.toLocaleString()}</p></div>
                      <div><p className="text-gray-500 text-sm">Purpose</p><p className="font-bold capitalize">{form.loan_purpose.replace('_', ' ')}</p></div>
                      <div><p className="text-gray-500 text-sm">Monthly Payment</p><p className="font-bold text-primary-600">€{monthlyPayment}</p></div>
                      <div><p className="text-gray-500 text-sm">Total Repayment</p><p className="font-bold">€{totalRepayment}</p></div>
                    </div>
                    <div className="border-t mt-4 pt-4 flex items-center gap-2 text-sm text-gray-500">
                      <span>ℹ️</span> Interest Rate: 8.5% APR • No hidden fees
                    </div>
                  </motion.div>
                  <div className="bg-blue-50 p-4 rounded-xl text-sm">
                    By continuing, you agree to our credit assessment process.
                  </div>
                </motion.div>
              )}

              {activeStep === 2 && !result && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-6"
                >
                  <h3 className="text-lg font-bold mb-2">Ready to Submit</h3>
                  <p className="text-gray-600">Click submit to process your application</p>
                  {loading && (
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className="bg-primary-600 h-2 rounded-full"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{ width: '75%' }}
                      />
                    </div>
                  )}
                </motion.div>
              )}

              {result && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-6 rounded-xl ${
                    result.ai_recommendation === 'approve' ? 'bg-green-50' :
                    result.ai_recommendation === 'review' ? 'bg-yellow-50' : 'bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        result.ai_recommendation === 'approve' ? 'bg-green-600' :
                        result.ai_recommendation === 'review' ? 'bg-yellow-600' : 'bg-red-600'
                      } text-white`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {result.ai_recommendation === 'approve' ? '✅' : '⚠️'}
                    </motion.div>
                    <div>
                      <h3 className="font-bold">Application {result.status}</h3>
                      <p className="text-sm">AI Recommendation: {result.ai_recommendation}</p>
                    </div>
                  </div>
                  <div className="border-t pt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-sm">Risk Score</p>
                      <p className={`text-2xl font-bold ${getScoreColor(result.ai_score)}`}>{result.ai_score}/100</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Assessment</p>
                      <p className="text-sm">{result.explanation_summary || 'Processing...'}</p>
                    </div>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link to="/dashboard" className="btn-primary w-full mt-4 block text-center">
                      View in Dashboard
                    </Link>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {!result && (
              <div className="flex gap-3">
                {activeStep > 0 && (
                  <motion.button 
                    type="button" 
                    onClick={() => setActiveStep(activeStep - 1)} 
                    className="btn-secondary flex-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                )}
                <motion.button 
                  type="submit" 
                  disabled={loading} 
                  className="btn-primary flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? 'Processing...' : activeStep === 2 ? 'Submit Application' : 'Continue'}
                </motion.button>
              </div>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  )
}