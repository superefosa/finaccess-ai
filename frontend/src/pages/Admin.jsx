import { useEffect, useMemo, useState } from 'react'
import api from '../api/client'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts'

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6']

export default function Admin() {
  const [applications, setApplications] = useState([])
  const [filteredApps, setFilteredApps] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const [selectedApp, setSelectedApp] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [hoveredCard, setHoveredCard] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const load = async () => {
    setIsRefreshing(true)
    setLoading(true)
    try {
      const res = await api.get('/admin/applications')
      setApplications(res.data)
      filterApplications(res.data, searchTerm, statusFilter)
    } catch (err) {
      setError(err.response?.data?.detail || 'Admin access failed')
    } finally {
      setLoading(false)
      setTimeout(() => setIsRefreshing(false), 500)
    }
  }

  useEffect(() => { 
    load() 
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  const filterApplications = (apps, search, status) => {
    let filtered = apps
    if (search) {
      filtered = filtered.filter(app => 
        app.id.toString().includes(search) ||
        app.ai_recommendation?.toLowerCase().includes(search.toLowerCase()) ||
        app.loan_purpose?.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (status !== 'all') {
      filtered = filtered.filter(app => app.status === status)
    }
    setFilteredApps(filtered)
  }

  useEffect(() => {
    filterApplications(applications, searchTerm, statusFilter)
  }, [searchTerm, statusFilter, applications])

  const decide = async (id, final_decision) => {
    try {
      await api.patch(`/admin/applications/${id}/decision`, { final_decision })
      load()
      setDialogOpen(false)
    } catch (err) {
      setError(err.response?.data?.detail || 'Decision failed')
    }
  }

  const stats = useMemo(() => {
    const total = applications.length
    const pending = applications.filter(a => a.status === 'pending').length
    const approved = applications.filter(a => a.status === 'approved').length
    const rejected = applications.filter(a => a.status === 'rejected').length
    
    const totalAmount = applications.filter(a => a.status === 'approved')
      .reduce((sum, a) => sum + (a.requested_amount || 0), 0)
    
    const pendingAmount = applications.filter(a => a.status === 'pending')
      .reduce((sum, a) => sum + (a.requested_amount || 0), 0)
    
    const rejectedAmount = applications.filter(a => a.status === 'rejected')
      .reduce((sum, a) => sum + (a.requested_amount || 0), 0)
    
    const avgScore = total > 0 
      ? (applications.reduce((sum, a) => sum + (a.ai_score || 0), 0) / total).toFixed(2)
      : '0.00'

    const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : '0.0'

    const chartData = [
      { name: 'Approved', value: approved, amount: totalAmount, color: '#10b981' },
      { name: 'Pending', value: pending, amount: pendingAmount, color: '#f59e0b' },
      { name: 'Rejected', value: rejected, amount: rejectedAmount, color: '#ef4444' }
    ]

    // Daily trend data
    const dailyTrend = applications.reduce((acc, app) => {
      const date = new Date(app.created_at).toLocaleDateString()
      const existing = acc.find(d => d.date === date)
      if (existing) {
        existing.count++
        if (app.status === 'approved') existing.approved++
        if (app.status === 'rejected') existing.rejected++
      } else {
        acc.push({ 
          date, 
          count: 1, 
          approved: app.status === 'approved' ? 1 : 0,
          rejected: app.status === 'rejected' ? 1 : 0
        })
      }
      return acc
    }, []).slice(-7)

    // Score distribution
    const scoreDistribution = [
      { range: '0-25', count: applications.filter(a => a.ai_score < 25).length },
      { range: '25-50', count: applications.filter(a => a.ai_score >= 25 && a.ai_score < 50).length },
      { range: '50-75', count: applications.filter(a => a.ai_score >= 50 && a.ai_score < 75).length },
      { range: '75-100', count: applications.filter(a => a.ai_score >= 75).length }
    ]

    // Purpose breakdown
    const purposeBreakdown = applications.reduce((acc, app) => {
      const purpose = app.loan_purpose || 'other'
      const existing = acc.find(p => p.purpose === purpose)
      if (existing) {
        existing.count++
        existing.amount += app.requested_amount || 0
      } else {
        acc.push({ purpose, count: 1, amount: app.requested_amount || 0 })
      }
      return acc
    }, [])

    return { 
      total, pending, approved, rejected, totalAmount, pendingAmount, rejectedAmount,
      avgScore, approvalRate, chartData, dailyTrend, scoreDistribution, purposeBreakdown
    }
  }, [applications])

  const getScoreColor = (score) => {
    if (score >= 70) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const exportToCSV = () => {
    const headers = ['ID', 'Amount', 'Purpose', 'Status', 'AI Score', 'AI Recommendation', 'Date']
    const data = filteredApps.map(app => [
      app.id, app.requested_amount, app.loan_purpose, app.status,
      app.ai_score, app.ai_recommendation, new Date(app.created_at).toLocaleDateString()
    ])
    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `applications_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading && applications.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <motion.div 
          className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p 
          className="text-gray-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading admin dashboard...
        </motion.p>
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
      {/* Header */}
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
        <motion.div 
          className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-200 rounded-full filter blur-2xl opacity-20"
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <div className="flex justify-between items-center relative">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <motion.span 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                👑
              </motion.span>
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Review AI-assessed applications and make final lending decisions</p>
          </div>
          <div className="flex gap-2">
            <motion.button 
              onClick={exportToCSV} 
              className="p-2 hover:bg-white/50 rounded-full transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Export CSV"
            >
              📥
            </motion.button>
            <motion.button 
              onClick={load} 
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              animate={isRefreshing ? { rotate: 360 } : {}}
              title="Refresh"
            >
              🔄
            </motion.button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div 
            className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: stats.total, sub: `↑ ${stats.approvalRate}% approval`, icon: '📊', color: 'from-blue-400 to-blue-600', trend: '+12%' },
          { label: 'Pending Review', value: stats.pending, sub: `€${stats.pendingAmount.toLocaleString()}`, icon: '⏳', color: 'from-yellow-400 to-orange-500', trend: null },
          { label: 'Total Approved', value: stats.approved, sub: `€${stats.totalAmount.toLocaleString()}`, icon: '✅', color: 'from-green-400 to-emerald-600', trend: '+8%' },
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
                  className={`text-3xl font-bold mt-1 ${idx === 1 ? 'text-yellow-600' : idx === 2 ? 'text-green-600' : ''}`}
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
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Distribution - Enhanced Donut Chart */}
        <motion.div 
          className="card overflow-visible"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-bold text-lg mb-4">Application Distribution</h3>
          <div className="overflow-visible">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={stats.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  dataKey="value"
                  paddingAngle={3}
                  label={({ percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                  labelLine={false}
                >
                  {stats.chartData.map((entry, index) => (
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
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {stats.chartData.map((entry, index) => (
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

        {/* Amount by Status - Enhanced Bar Chart */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-bold text-lg mb-4">Amount by Status</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`€${value.toLocaleString()}`, 'Amount']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {stats.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color}>
                    <animate attributeName="height" from="0" to={entry.amount} dur="0.5s" />
                  </Cell>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {stats.chartData.map((entry, index) => (
              <motion.div 
                key={index} 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-sm text-gray-600">{entry.name}: <span className="font-semibold">€{entry.amount.toLocaleString()}</span></span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Daily Trend Chart */}
      {stats.dailyTrend.length > 0 && (
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-bold text-lg mb-4">Daily Application Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.dailyTrend}>
              <defs>
                <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="approved" stroke="#10b981" fill="url(#colorApproved)" strokeWidth={2} />
              <Area type="monotone" dataKey="rejected" stroke="#ef4444" fill="url(#colorRejected)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Applications Table */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <h3 className="font-bold text-lg">Applications</h3>
          <div className="flex gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search ID, purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 py-2 text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-4">
          {['All', 'Pending', 'Approved', 'Rejected'].map((tab, idx) => (
            <motion.button
              key={idx}
              onClick={() => setTabValue(idx)}
              className={`pb-2 px-2 text-sm font-medium transition-colors relative ${
                tabValue === idx 
                  ? 'text-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              {tab} ({idx === 0 ? stats.total : idx === 1 ? stats.pending : idx === 2 ? stats.approved : stats.rejected})
              {tabValue === idx && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
                  layoutId="activeTab"
                />
              )}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {filteredApps.length === 0 ? (
            <motion.p 
              className="text-gray-500 text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="text-4xl block mb-2">📭</span>
              No applications found
            </motion.p>
          ) : (
            <motion.div 
              className="overflow-x-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">ID</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Amount</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Purpose</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">AI Score</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Recommendation</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(tabValue === 0 ? filteredApps : filteredApps.filter(a => 
                    tabValue === 1 ? a.status === 'pending' :
                    tabValue === 2 ? a.status === 'approved' : a.status === 'rejected'
                  )).map((app, idx) => (
                    <motion.tr 
                      key={app.id} 
                      className="border-b hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      whileHover={{ backgroundColor: '#f9fafb' }}
                    >
                      <td className="py-3 px-2 font-mono">#{app.id}</td>
                      <td className="py-3 px-2 font-medium">€{app.requested_amount?.toLocaleString()}</td>
                      <td className="py-3 px-2 capitalize">{app.loan_purpose?.replace(/_/g, ' ')}</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getScoreColor(app.ai_score)}`}>
                            {app.ai_score || 'N/A'}
                          </span>
                          <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-primary-600 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${app.ai_score || 0}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          app.ai_recommendation === 'approve' ? 'bg-green-100 text-green-800 border-green-200' :
                          app.ai_recommendation === 'reject' ? 'bg-red-100 text-red-800 border-red-200' : 
                          'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}>
                          {app.ai_recommendation || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-1">
                          <motion.button
                            onClick={() => { setSelectedApp(app); setDialogOpen(true) }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="View Details"
                          >
                            👁️
                          </motion.button>
                          {app.status === 'pending' && (
                            <>
                              <motion.button
                                onClick={() => decide(app.id, 'approved')}
                                className="p-2 hover:bg-green-100 rounded-full text-green-600 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Approve"
                              >
                                ✅
                              </motion.button>
                              <motion.button
                                onClick={() => decide(app.id, 'rejected')}
                                className="p-2 hover:bg-red-100 rounded-full text-red-600 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                title="Reject"
                              >
                                ❌
                              </motion.button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Details Dialog */}
      <AnimatePresence>
        {dialogOpen && selectedApp && (
          <motion.div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDialogOpen(false)}
          >
            <motion.div 
              className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b bg-gradient-to-r from-primary-50 to-gray-50">
                <h3 className="text-xl font-bold">Application #{selectedApp.id} Details</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-gray-500 text-xs">Amount</p>
                    <p className="font-bold text-lg">€{selectedApp.requested_amount?.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-gray-500 text-xs">Purpose</p>
                    <p className="font-bold text-lg capitalize">{selectedApp.loan_purpose?.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-gray-500 text-xs">Repayment</p>
                    <p className="font-bold text-lg">{selectedApp.repayment_months} months</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-gray-500 text-xs">AI Score</p>
                    <p className={`font-bold text-lg ${getScoreColor(selectedApp.ai_score).replace('bg-', 'text-').replace('-100', '-600').split(' ')[0]}`}>
                      {selectedApp.ai_score}/100
                    </p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-gray-500 text-sm mb-2">AI Recommendation</p>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                    selectedApp.ai_recommendation === 'approve' ? 'bg-green-100 text-green-800 border-green-200' :
                    selectedApp.ai_recommendation === 'reject' ? 'bg-red-100 text-red-800 border-red-200' : 
                    'bg-yellow-100 text-yellow-800 border-yellow-200'
                  }`}>
                    {selectedApp.ai_recommendation || 'pending'}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-2">Explanation</p>
                  <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100">
                    <p className="text-sm leading-relaxed">{selectedApp.explanation_summary || 'No explanation available.'}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                <motion.button 
                  onClick={() => setDialogOpen(false)} 
                  className="btn-secondary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
                {selectedApp.status === 'pending' && (
                  <>
                    <motion.button 
                      onClick={() => decide(selectedApp.id, 'rejected')} 
                      className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Reject
                    </motion.button>
                    <motion.button 
                      onClick={() => decide(selectedApp.id, 'approved')} 
                      className="btn-primary"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Approve
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}