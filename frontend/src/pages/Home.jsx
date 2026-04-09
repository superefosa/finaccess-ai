import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { getToken, getUserRole } from '../utils/auth'
import { motion, useAnimation, useInView } from 'framer-motion'

// Install framer-motion first: npm install framer-motion

export default function Home() {
  const [amount, setAmount] = useState(5000)
  const [months, setMonths] = useState(12)
  const [countUpStats, setCountUpStats] = useState({ apps: 0, accuracy: 0, time: 0, rating: 0 })
  const interestRate = 8.5
  
  const token = getToken()
  const role = getUserRole()
  const isLoggedIn = !!token
  const isAdmin = role === 'admin'
  const isUser = role === 'user'
  
  const monthlyPayment = (amount * (1 + interestRate/100)) / months
  const totalRepayment = amount * (1 + interestRate/100)

  // Refs for scroll animations
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const howItWorksRef = useRef(null)
  
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 })
  const statsInView = useInView(statsRef, { once: true })
  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.3 })
  
  const controls = useAnimation()

  // Count up animation for stats
  useEffect(() => {
    if (statsInView) {
      const duration = 2000
      const steps = 60
      const interval = duration / steps
      
      let step = 0
      const timer = setInterval(() => {
        step++
        setCountUpStats({
          apps: Math.min(Math.floor((10000 / steps) * step), 10000),
          accuracy: Math.min(Math.floor((98 / steps) * step), 98),
          time: 24,
          rating: Math.min(Number(((4.9 / steps) * step).toFixed(1)), 4.9)
        })
        
        if (step >= steps) clearInterval(timer)
      }, interval)
      
      return () => clearInterval(timer)
    }
  }, [statsInView])

  const features = [
    { 
      icon: '⚡', 
      title: 'Lightning Fast', 
      desc: 'AI-powered decisions in minutes, not days. Get instant feedback on your application.',
      color: 'from-yellow-400 to-orange-500'
    },
    { 
      icon: '🔍', 
      title: 'Explainable AI', 
      desc: 'Clear, interpretable scoring with detailed breakdowns of all decision factors.',
      color: 'from-blue-400 to-cyan-500'
    },
    { 
      icon: '🔒', 
      title: 'Bank-Grade Security', 
      desc: 'Enterprise-level encryption and security protocols protect your data 24/7.',
      color: 'from-green-400 to-emerald-500'
    },
    { 
      icon: '👥', 
      title: 'Human-in-the-Loop', 
      desc: 'AI recommendations with final human decision authority for optimal outcomes.',
      color: 'from-purple-400 to-pink-500'
    }
  ]

  const stats = [
    { value: countUpStats.apps.toLocaleString() + '+', label: 'Applications Processed', icon: '📈' },
    { value: countUpStats.accuracy + '%', label: 'Accuracy Rate', icon: '🎯' },
    { value: countUpStats.time + 'h', label: 'Decision Time', icon: '⚡' },
    { value: countUpStats.rating.toFixed(1), label: 'User Rating', icon: '⭐' }
  ]

  // Floating particles background
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 10
  }))

  return (
    <div className="space-y-16 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary-200/20"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden gradient-bg rounded-3xl p-8 md:p-12"
      >
        {/* Animated gradient orbs */}
        <motion.div 
          className="absolute top-0 right-0 w-64 h-64 bg-primary-200 rounded-full filter blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-10"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/4 w-48 h-48 bg-blue-200 rounded-full filter blur-3xl opacity-15"
          animate={{
            scale: [1, 1.4, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.span 
              className="inline-block bg-primary-100 text-primary-800 text-sm font-semibold px-4 py-2 rounded-full mb-6"
              whileHover={{ scale: 1.05 }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🚀 Trusted by 10,000+ users
            </motion.span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              AI-Powered Lending for{' '}
              <motion.span 
                className="text-primary-600 inline-block"
                animate={{ 
                  textShadow: ["0 0 0px #0f766e", "0 0 20px #0f766e40", "0 0 0px #0f766e"],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Everyone
              </motion.span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              FinAccess AI breaks down traditional lending barriers with intelligent credit assessment. 
              Get fair, transparent loan decisions in minutes, not weeks.
            </p>
            
            {/* Conditional CTA buttons */}
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {!isLoggedIn ? (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/register" className="btn-primary shadow-lg hover:shadow-xl">
                      Get Started Free
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/login" className="btn-secondary">
                      Sign In
                    </Link>
                  </motion.div>
                </>
              ) : isAdmin ? (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/admin" className="btn-primary">
                    Go to Admin Dashboard →
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/dashboard" className="btn-primary">
                      Go to Dashboard →
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/apply" className="btn-secondary">
                      Apply for Loan
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
            
            <motion.div 
              className="flex gap-4 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {['✓ No hidden fees', '✓ Secure & Encrypted', '✓ 24/7 Support'].map((text, i) => (
                <motion.span 
                  key={i}
                  className="text-sm text-gray-500"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  {text}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Loan Calculator Card with 3D tilt effect */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 transform perspective-1000"
            style={{ transformStyle: "preserve-3d" }}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">💰</span> Loan Calculator
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Loan Amount: <span className="font-bold text-primary-600">${amount.toLocaleString()}</span>
                </label>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="500"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-primary-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$1K</span>
                  <span>$25K</span>
                  <span>$50K</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Repayment: <span className="font-bold text-primary-600">{months} months</span>
                </label>
                <input
                  type="range"
                  min="6"
                  max="60"
                  step="6"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full accent-primary-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>6m</span>
                  <span>1y</span>
                  <span>2y</span>
                  <span>3y</span>
                  <span>5y</span>
                </div>
              </div>
              <div className="border-t pt-4 grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <p className="text-sm text-gray-500">Monthly Payment</p>
                  <p className="text-2xl font-bold text-primary-600">
                    ${monthlyPayment.toFixed(2)}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                >
                  <p className="text-sm text-gray-500">Total Repayment</p>
                  <p className="text-2xl font-bold text-primary-600">
                    ${totalRepayment.toFixed(2)}
                  </p>
                </motion.div>
              </div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {!isLoggedIn ? (
                  <Link to="/register" className="btn-primary w-full text-center block">
                    Apply Now →
                  </Link>
                ) : isAdmin ? (
                  <Link to="/admin" className="btn-primary w-full text-center block">
                    View Applications →
                  </Link>
                ) : (
                  <Link to="/apply" className="btn-primary w-full text-center block">
                    Apply Now →
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section with Count Up */}
      <motion.section 
        ref={statsRef}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
      >
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx} 
            className="card text-center"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { delay: idx * 0.1 } }
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
          >
            <div className="text-4xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
            <div className="text-gray-600 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </motion.section>

      {/* Features Section */}
      <section ref={featuresRef}>
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Why Choose FinAccess AI?
        </motion.h2>
        <motion.p 
          className="section-subtitle"
          initial={{ opacity: 0 }}
          animate={featuresInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          Revolutionizing lending with cutting-edge AI technology
        </motion.p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx} 
              className="card card-hover text-center relative overflow-hidden group"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1, transition: { delay: idx * 0.1 } }
              }}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              whileHover={{ y: -8 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <motion.div 
                className="text-5xl mb-4 relative"
                whileHover={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works with Animated Timeline */}
      <motion.section 
        ref={howItWorksRef}
        className="bg-gradient-to-br from-primary-50 via-white to-purple-50 rounded-3xl p-8 md:p-12 relative overflow-hidden"
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-primary-100/20 to-purple-100/20"
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
        <h2 className="section-title relative">How It Works</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {[
            { step: '01', title: 'Create Profile', desc: 'Sign up in under 5 minutes', icon: '📝' },
            { step: '02', title: 'Apply for Loan', desc: 'Choose your terms', icon: '💵' },
            { step: '03', title: 'AI Assessment', desc: 'Fair, transparent scoring', icon: '🤖' },
            { step: '04', title: 'Get Decision', desc: 'Instant recommendations', icon: '✅' }
          ].map((item, idx) => (
            <motion.div 
              key={item.step} 
              className="text-center relative"
              initial={{ opacity: 0, y: 30 }}
              animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {item.icon}
              </motion.div>
              <div className="text-5xl font-bold text-primary-200 mb-2">{item.step}</div>
              <h4 className="text-xl font-bold mb-2">{item.title}</h4>
              <p className="text-gray-600">{item.desc}</p>
              {idx < 3 && (
                <motion.div 
                  className="hidden lg:block absolute top-10 -right-4 text-2xl text-primary-300"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  →
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute -top-20 -right-20 w-64 h-64 bg-white rounded-full filter blur-3xl opacity-10"
          animate={{ scale: [1, 1.5, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-300 rounded-full filter blur-3xl opacity-10"
          animate={{ scale: [1, 1.3, 1], rotate: [360, 180, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        
        <h2 className="text-3xl md:text-4xl font-bold mb-4 relative">
          {isLoggedIn 
            ? (isAdmin ? 'Manage Applications with Ease' : 'Ready for Your Next Step?')
            : 'Ready to Get Started?'
          }
        </h2>
        <p className="text-lg mb-8 text-primary-50 max-w-2xl mx-auto relative">
          {isLoggedIn 
            ? (isAdmin 
                ? 'Review pending applications and make informed lending decisions with AI-powered insights.'
                : 'Complete your profile and apply for a loan today. Our AI-powered system gives you instant feedback!'
              )
            : 'Join thousands of satisfied users who\'ve found fair lending solutions with FinAccess AI'
          }
        </p>
        <div className="flex flex-wrap gap-4 justify-center relative">
          {!isLoggedIn ? (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                  Create Free Account
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                  Sign In
                </Link>
              </motion.div>
            </>
          ) : isAdmin ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/admin" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                Go to Admin Dashboard →
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/profile" className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                  Complete Profile
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/apply" className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                  Apply Now
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </motion.section>
    </div>
  )
}