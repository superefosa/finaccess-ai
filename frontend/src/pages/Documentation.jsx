import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Documentation() {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard?.writeText(`curl -X POST https://api.finaccess.ai/applications \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"requested_amount": 5000, "loan_purpose": "education"}'`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div 
      className="max-w-5xl mx-auto space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="gradient-bg rounded-2xl p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div 
          className="absolute -right-10 -top-10 w-40 h-40 bg-primary-200 rounded-full filter blur-2xl opacity-30"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <h1 className="text-3xl font-bold mb-2 relative">Documentation</h1>
        <p className="text-gray-600 relative">Everything you need to integrate with FinAccess AI</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '📡', title: 'API Reference', desc: 'REST API documentation', color: 'from-blue-400 to-cyan-500' },
          { icon: '💻', title: 'SDK & Libraries', desc: 'Python, JavaScript', color: 'from-green-400 to-emerald-500' },
          { icon: '🗄️', title: 'Data Models', desc: 'Database schemas', color: 'from-purple-400 to-pink-500' },
          { icon: '🔐', title: 'Authentication', desc: 'JWT auth guides', color: 'from-orange-400 to-red-500' }
        ].map((s, idx) => (
          <motion.div 
            key={s.title} 
            className="card text-center group relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <motion.span 
              className="text-3xl mb-3 block"
              whileHover={{ scale: 1.2 }}
            >
              {s.icon}
            </motion.span>
            <h3 className="font-bold mb-1">{s.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{s.desc}</p>
            <motion.button 
              className="text-primary-600 text-sm font-medium hover:underline"
              whileHover={{ x: 5 }}
            >
              Learn More →
            </motion.button>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>📚</span> Quick Start Guide
        </h2>
        <div className="space-y-6">
          {[
            { step: '1', title: 'Create an Account', desc: 'Register for a free account to get your API credentials.' },
            { step: '2', title: 'Authentication', desc: 'Use JWT tokens for authentication. Include in Authorization header.' }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <h3 className="font-semibold flex items-center gap-2">
                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm">
                  {item.step}
                </span>
                {item.title}
              </h3>
              <p className="text-gray-600 ml-8">{item.desc}</p>
            </motion.div>
          ))}
          
          <div>
            <h3 className="font-semibold flex items-center gap-2">
              <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm">3</span>
              Make Your First Request
            </h3>
            <div className="ml-8 mt-2 relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl text-sm overflow-x-auto">
{`curl -X POST https://api.finaccess.ai/applications \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"requested_amount": 5000, "loan_purpose": "education"}'`}
              </pre>
              <motion.button
                onClick={copyCode}
                className="absolute top-2 right-2 px-3 py-1 bg-gray-700 text-white text-xs rounded-lg hover:bg-gray-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </motion.button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <motion.a 
            href="https://github.com" 
            target="_blank" 
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View on GitHub
          </motion.a>
          <motion.a 
            href="http://localhost:8000/docs" 
            target="_blank" 
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            API Reference
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  )
}