import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'

export default function About() {
  const [countUpStats, setCountUpStats] = useState({ founded: 0, apps: 0, accuracy: 0, team: 0 })
  const statsRef = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const interval = duration / steps
      let step = 0
      const timer = setInterval(() => {
        step++
        setCountUpStats({
          founded: 2024,
          apps: Math.min(Math.floor((10000 / steps) * step), 10000),
          accuracy: Math.min(Math.floor((98 / steps) * step), 98),
          team: Math.min(Math.floor((15 / steps) * step), 15)
        })
        if (step >= steps) clearInterval(timer)
      }, interval)
      return () => clearInterval(timer)
    }
  }, [isInView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.div 
      className="max-w-5xl mx-auto space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="gradient-bg rounded-2xl p-8 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div 
          className="absolute -right-10 -top-10 w-40 h-40 bg-primary-200 rounded-full filter blur-2xl opacity-30"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <h1 className="text-3xl font-bold mb-2 relative">About FinAccess AI</h1>
        <p className="text-gray-600 max-w-2xl mx-auto relative">
          Revolutionizing lending through artificial intelligence and fair credit assessment
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            FinAccess AI was founded with a simple yet powerful mission: to democratize access to credit 
            through transparent, AI-powered lending decisions. We believe that everyone deserves a fair 
            chance at financial opportunity, regardless of their traditional credit history.
          </p>
          <p className="text-gray-600 leading-relaxed">
            By leveraging advanced machine learning algorithms and explainable AI, we provide lenders 
            with deeper insights while giving applicants clear, actionable feedback on their financial health.
          </p>
        </motion.div>
        
        <motion.div 
          ref={statsRef}
          className="card relative overflow-hidden"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-transparent" />
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <motion.span 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              📊
            </motion.span>
            Key Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Founded', value: countUpStats.founded, suffix: '' },
              { label: 'Applications', value: countUpStats.apps.toLocaleString() + '+', suffix: '' },
              { label: 'Accuracy', value: countUpStats.accuracy, suffix: '%' },
              { label: 'Team', value: countUpStats.team, suffix: '+' }
            ].map((s, idx) => (
              <motion.div 
                key={s.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 rounded-xl p-3"
              >
                <p className="text-gray-500 text-xs">{s.label}</p>
                <p className="text-2xl font-bold text-primary-600">{s.value}{s.suffix}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 
          className="text-2xl font-bold text-center mb-6"
          variants={itemVariants}
        >
          Our Values
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: '🛡️', title: 'Transparency', desc: 'Clear, explainable decisions every time', color: 'from-blue-400 to-cyan-500' },
            { icon: '🎯', title: 'Fairness', desc: 'Eliminating bias in lending decisions', color: 'from-green-400 to-emerald-500' },
            { icon: '💡', title: 'Innovation', desc: 'Cutting-edge AI technology', color: 'from-purple-400 to-pink-500' },
            { icon: '👥', title: 'Inclusivity', desc: 'Serving underserved communities', color: 'from-orange-400 to-red-500' }
          ].map((v, idx) => (
            <motion.div 
              key={v.title} 
              className="card text-center group relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${v.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <motion.div 
                className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {v.icon}
              </motion.div>
              <h4 className="font-bold mb-1">{v.title}</h4>
              <p className="text-sm text-gray-600">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}