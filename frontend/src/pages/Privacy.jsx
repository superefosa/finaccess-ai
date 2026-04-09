import { motion } from 'framer-motion'

export default function Privacy() {
  const sections = [
    'Information We Collect',
    'How We Use Your Information',
    'Data Security',
    'Data Sharing',
    'Your Rights',
    'Contact Us'
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
        <h1 className="text-3xl font-bold mb-2 relative">Privacy Policy</h1>
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
              We collect and use your information to provide our services, process applications, 
              and communicate with you. We implement industry-standard security measures and 
              never sell your data.
            </p>
          </motion.div>
        ))}
        <p className="text-gray-600 pt-2 border-t">
          <strong>Contact:</strong> privacy@finaccess.ai
        </p>
      </motion.div>
    </motion.div>
  )
}