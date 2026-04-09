import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const contactCards = [
    { icon: '📧', title: 'Email Us', info: 'support@finaccess.ai' },
    { icon: '📞', title: 'Call Us', info: '+1 (555) 123-4567' },
    { icon: '📍', title: 'Visit Us', info: '123 AI Avenue, Tech City' },
    { icon: '🕐', title: 'Hours', info: 'Mon-Fri: 9am-6pm EST' }
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
        <h1 className="text-3xl font-bold mb-2 relative">Get in Touch</h1>
        <p className="text-gray-600 relative">Have questions? We're here to help</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-3">
          {contactCards.map((c, idx) => (
            <motion.div 
              key={c.title} 
              className="card group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-3">
                <motion.span 
                  className="text-2xl"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {c.icon}
                </motion.span>
                <div>
                  <p className="font-semibold">{c.title}</p>
                  <p className="text-sm text-gray-600">{c.info}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="md:col-span-2">
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>💬</span> Send us a message
            </h2>
            
            <AnimatePresence>
              {submitted && (
                <motion.div 
                  className="bg-green-50 text-green-600 p-4 rounded-xl mb-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  ✅ Message sent successfully! We'll get back to you soon.
                </motion.div>
              )}
            </AnimatePresence>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  className="input-field" 
                  required 
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                  className="input-field" 
                  required 
                />
              </div>
              <input 
                type="text" 
                placeholder="Subject" 
                value={form.subject} 
                onChange={e => setForm({...form, subject: e.target.value})} 
                className="input-field" 
                required 
              />
              <textarea 
                placeholder="Message" 
                rows={6} 
                value={form.message} 
                onChange={e => setForm({...form, message: e.target.value})} 
                className="input-field" 
                required 
              />
              <motion.button 
                type="submit" 
                className="btn-primary w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📤 Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}