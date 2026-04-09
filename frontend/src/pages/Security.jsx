import { motion } from 'framer-motion'

export default function Security() {
  const features = [
    { icon: '🔐', title: 'End-to-End Encryption', desc: 'All data encrypted in transit and at rest using AES-256' },
    { icon: '✅', title: 'Identity Verification', desc: 'Multi-factor authentication and identity verification' },
    { icon: '🛡️', title: 'Regular Audits', desc: 'Third-party security audits and penetration testing' },
    { icon: '🔑', title: 'Secure Authentication', desc: 'JWT tokens with short expiration and refresh' },
    { icon: '📋', title: 'Compliance', desc: 'GDPR, CCPA, and financial industry compliance' }
  ]

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
        <motion.div 
          className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg"
          whileHover={{ scale: 1.1, rotate: 10 }}
        >
          🔒
        </motion.div>
        <h1 className="text-3xl font-bold mb-2 relative">Security at FinAccess AI</h1>
        <p className="text-gray-600 max-w-2xl mx-auto relative">Your financial data security is our top priority</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, idx) => (
          <motion.div 
            key={f.title} 
            className="card group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <motion.span 
              className="text-3xl mb-3 block"
              whileHover={{ scale: 1.2 }}
            >
              {f.icon}
            </motion.span>
            <h3 className="font-bold mb-1">{f.title}</h3>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-xl font-bold mb-3">Report a Security Issue</h2>
        <p className="text-gray-600">
          If you discover a security vulnerability, please email us at{' '}
          <a href="mailto:security@finaccess.ai" className="text-primary-600 font-medium hover:underline">
            security@finaccess.ai
          </a>
        </p>
      </motion.div>
    </motion.div>
  )
}