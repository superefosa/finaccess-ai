import { useEffect, useMemo, useState } from 'react'
import api from '../api/client'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from 'recharts'

const COLORS = ['#0f766e', '#eab308', '#ef4444', '#3b82f6']

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [hoveredCard, setHoveredCard] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [userRes, appsRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/applications/me')
      ])
      setUser(userRes.data)
      setApplications(appsRes.data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [refreshKey])

  const stats = useMemo(() => {
    const total = applications.length
    const approved = applications.filter(a => a.status === 'approved').length
    const pending = applications.filter(a => a.status === 'pending').length
    const rejected = applications.filter(a => a.status === 'rejected').length
    
    const avgScore = total > 0 
      ? (applications.reduce((sum, a) => sum + (a.ai_score || 0), 0) / total).toFixed(2)
      : '0.00'
    
    const totalAmount = applications.filter(a => a.status === 'approved')
      .reduce((sum, a) => sum + (a.requested_amount || 0), 0)

    const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : '0.0'

    const monthlyData = applications.reduce((acc, app) => {
      const month = new Date(app.created_at).toLocaleString('default', { month: 'short' })
      const existing = acc.find(d => d.month === month)
      if (existing) {
        existing.count++
        existing.amount += app.requested_amount
      } else {
        acc.push({ month, count: 1, amount: app.requested_amount })
      }
      return acc
    }, []).sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return months.indexOf(a.month) - months.indexOf(b.month)
    })

    const pieData = [
      { name: 'Approved', value: approved, color: '#10b981' },
      { name: 'Pending', value: pending, color: '#f59e0b' },
      { name: 'Rejected', value: rejected, color: '#ef4444' }
    ]

    // Score distribution data
    const scoreRanges = [
      { range: '0-25', count: applications.filter(a => a.ai_score < 25).length },
      { range: '25-50', count: applications.filter(a => a.ai_score >= 25 && a.ai_score < 50).length },
      { range: '50-75', count: applications.filter(a => a.ai_score >= 50 && a.ai_score < 75).length },
      { range: '75-100', count: applications.filter(a => a.ai_score >= 75).length }
    ]

    return { total, approved, pending, rejected, avgScore, totalAmount, approvalRate, monthlyData, pieData, scoreRanges }
  }, [applications])

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <motion.div 
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-gray-500 animate-pulse">Loading your dashboard...</p>
      </div>
    )
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } })
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome Header */}
      <motion.div 
        className="gradient-bg rounded-2xl p-6 relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div 
          className="absolute -right-10 -top-10 w-40 h-40 bg-primary-200 rounded-full filter blur-2xl opacity-30"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="flex justify-between items-center relative">
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {user?.full_name?.charAt(0) || 'U'}
            </motion.div>
            <div>
              <h2 className="text-xl font-bold">Welcome back, {user?.full_name || 'User'}! 👋</h2>
              <p className="text-gray-600">Here's your financial dashboard overview</p>
            </div>
          </div>
          <motion.button 
            onClick={() => setRefreshKey(k => k + 1)} 
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            🔄
          </motion.button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: stats.total, sub: `${stats.approvalRate}% approval`, icon: '📊', color: 'from-blue-400 to-blue-600', trend: '+12%' },
          { label: 'Pending Review', value: stats.pending, sub: 'Awaiting decision', icon: '⏳', color: 'from-yellow-400 to-orange-500', trend: null },
          { label: 'Approved Loans', value: stats.approved, sub: `$${stats.totalAmount.toLocaleString()}`, icon: '✅', color: 'from-green-400 to-emerald-600', trend: '+8%' },
          { label: 'Average AI Score', value: stats.avgScore, sub: 'Out of 100', icon: '📈', color: 'from-purple-400 to-pink-600', trend: null }
        ].map((card, idx) => (
          <motion.div 
            key={idx} 
            className="card relative overflow-hidden group cursor-pointer"
            custom={idx}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
            onHoverStart={() => setHoveredCard(idx)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            <div className="flex justify-between items-start relative">
              <div>
                <p className="text-gray-500 text-sm">{card.label}</p>
                <motion.p 
                  className="text-3xl font-bold mt-1"
                  animate={{ scale: hoveredCard === idx ? 1.05 : 1 }}
                >
                  {card.value}
                </motion.p>
                {card.sub && <p className="text-sm text-gray-500 mt-1">{card.sub}</p>}
                {card.trend && (
                  <span className="inline-block mt-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {card.trend}
                  </span>
                )}
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-full flex items-center justify-center text-xl shadow-lg`}>
                {card.icon}
              </div>
            </div>
            {idx === 3 && (
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-primary-500 to-primary-700 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${parseFloat(stats.avgScore)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div 
          className="lg:col-span-2 card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">Application Activity</h3>
            <div className="flex gap-2">
              {['week', 'month', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    selectedPeriod === period 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.monthlyData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#475569" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#475569" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                }}
              />
              <Area type="monotone" dataKey="amount" stroke="#0f766e" fill="url(#colorAmount)" strokeWidth={2} />
              <Bar dataKey="count" fill="#475569" radius={[4, 4, 0, 0]} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
        
        {/* Application Status - Enhanced Pie Chart */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-bold text-lg mb-4">Application Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                dataKey="value"
                paddingAngle={3}
                label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                labelLine={false}
              >
                {stats.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color}>
                    <animate attributeName="opacity" from="0" to="1" dur="0.5s" />
                  </Cell>
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [value, name]}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {stats.pieData.map((entry, index) => (
              <motion.div 
                key={index} 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm text-gray-600">{entry.name}: <span className="font-semibold">{entry.value}</span></span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Score Distribution Chart */}
      {stats.scoreRanges.some(s => s.count > 0) && (
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-bold text-lg mb-4">AI Score Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.scoreRanges} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#0f766e" radius={[8, 8, 0, 0]}>
                {stats.scoreRanges.map((entry, index) => (
                  <Cell key={`cell-${index}`}>
                    <animate attributeName="y" from="200" to="0" dur="0.5s" />
                  </Cell>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Recent Applications */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Recent Applications</h3>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/apply" className="text-primary-600 hover:underline flex items-center gap-1">
              New Application →
            </Link>
          </motion.div>
        </div>

        <AnimatePresence>
          {applications.length === 0 ? (
            <motion.div 
              className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 p-6 rounded-xl text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="text-4xl mb-2 block">📝</span>
              <p className="font-medium">No applications yet.</p>
              <p className="text-sm text-blue-600">Complete your profile and apply for a loan to get started!</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((app, idx) => (
                <motion.div 
                  key={app.id} 
                  className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ scale: 1.01, backgroundColor: '#fafafa' }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                    <div>
                      <p className="text-sm text-gray-500">Application #{app.id}</p>
                      <p className="font-bold text-lg">${app.requested_amount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">AI Score: </span>
                      <span className="font-bold">{app.ai_score || 'N/A'}</span>
                      <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${app.ai_score || 0}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(app.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  {app.explanation_summary && (
                    <>
                      <div className="border-t my-3"></div>
                      <p className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-primary-500">💡</span>
                        {app.explanation_summary}
                      </p>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
        
        {applications.length > 5 && (
          <motion.button 
            className="w-full mt-4 text-primary-600 font-medium hover:underline"
            whileHover={{ scale: 1.02 }}
          >
            View All Applications →
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  )
}