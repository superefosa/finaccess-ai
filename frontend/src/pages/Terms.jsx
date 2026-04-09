import { motion } from 'framer-motion'

export default function Terms() {
  const sections = [
    'Acceptance of Terms',
    'Account Registration',
    'Loan Applications',
    'User Conduct',
    'Intellectual Property',
    'Limitation of Liability'
  ]

  return (
    <motion.div 
      className="max-w-4xl mx-auto space-y-6"
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
        <h1 className="text-3xl font-bold mb-2 relative">Terms of Service</h1>
        <p className="text-gray-600 relative">Last updated: {new Date().toLocaleDateString()}</p>
      </motion.div>

      <motion.div 
        className="card space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {sections.map((title, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <h3 className="font-bold text-lg mb-2">{i+1}. {title}</h3>
            <p className="text-gray-600 leading-relaxed">
              By using FinAccess AI, you agree to these terms. Provide accurate information and 
              maintain account security. Final loan decisions are made by authorized administrators.
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}