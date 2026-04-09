import { motion } from 'framer-motion'
import { useState } from 'react'

const faqs = [
  { q: 'How does AI credit assessment work?', a: 'Our AI analyzes your financial profile, income, expenses, debt, and employment history to generate a fair and transparent risk score.' },
  { q: 'How long does the application process take?', a: 'Most applications receive an AI recommendation within seconds. Final decisions are typically made within 24 hours.' },
  { q: 'Is my financial data secure?', a: 'Yes, we use bank-grade encryption and security protocols to protect all your personal and financial information.' },
  { q: 'Can I apply if I have no credit history?', a: 'Absolutely! FinAccess AI is designed to assess creditworthiness beyond traditional credit scores.' }
]

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaq, setOpenFaq] = useState(null)

  const supportOptions = [
    { icon: '❓', title: 'Knowledge Base', desc: 'Browse articles and tutorials' },
    { icon: '📧', title: 'Email Support', desc: 'Get help within 24 hours' },
    { icon: '💬', title: 'Live Chat', desc: 'Chat with our support team' },
    { icon: '📞', title: 'Phone Support', desc: 'Call Mon-Fri, 9am-6pm EST' }
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
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <h1 className="text-3xl font-bold mb-2 relative">How can we help you?</h1>
        <p className="text-gray-600 mb-4 relative">Search our knowledge base or contact our support team</p>
        <div className="max-w-md mx-auto relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search for answers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 bg-white" 
          />
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {supportOptions.map((i, idx) => (
          <motion.div 
            key={i.title} 
            className="card text-center group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <motion.span 
              className="text-3xl mb-2 block"
              whileHover={{ scale: 1.2 }}
            >
              {i.icon}
            </motion.span>
            <h3 className="font-bold">{i.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{i.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <motion.div 
              key={idx} 
              className="card cursor-pointer"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div className="font-semibold flex justify-between items-center">
                {faq.q}
                <motion.span 
                  animate={{ rotate: openFaq === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </div>
              <AnimatePresence>
                {openFaq === idx && (
                  <motion.p 
                    className="text-gray-600 mt-3 pt-3 border-t"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {faq.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}