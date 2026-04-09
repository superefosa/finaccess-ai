import { motion } from 'framer-motion'

const jobs = [
  { title: 'Senior ML Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time' },
  { title: 'Full Stack Developer', department: 'Engineering', location: 'New York', type: 'Full-time' },
  { title: 'Product Manager', department: 'Product', location: 'Remote', type: 'Full-time' },
  { title: 'Data Scientist', department: 'AI/ML', location: 'San Francisco', type: 'Full-time' },
  { title: 'UX Designer', department: 'Design', location: 'Remote', type: 'Contract' },
  { title: 'Customer Success Manager', department: 'Operations', location: 'London', type: 'Full-time' }
]

export default function Careers() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
        <h1 className="text-3xl font-bold mb-2 relative">Join Our Team</h1>
        <p className="text-gray-600 max-w-2xl mx-auto relative">
          Help us revolutionize lending with AI and make credit accessible to everyone
        </p>
      </motion.div>

      <motion.div 
        className="grid md:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {[
          { icon: '💼', title: 'Meaningful Work', desc: 'Make a real difference in people\'s financial lives' },
          { icon: '📍', title: 'Flexible Work', desc: 'Remote-first culture with global offices' },
          { icon: '💰', title: 'Great Benefits', desc: 'Competitive salary, equity, and perks' }
        ].map((i, idx) => (
          <motion.div 
            key={i.title} 
            className="card text-center group"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
          >
            <motion.div 
              className="text-4xl mb-3"
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              {i.icon}
            </motion.div>
            <h3 className="font-bold mb-1">{i.title}</h3>
            <p className="text-sm text-gray-600">{i.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold mb-4">Open Positions</h2>
        <div className="space-y-3">
          {jobs.map((job, idx) => (
            <motion.div 
              key={idx} 
              className="card group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.01, backgroundColor: '#fafafa' }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold">{job.title}</h4>
                  <p className="text-sm text-gray-500">{job.department}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">📍 {job.location}</span>
                  <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs rounded-full font-medium">
                    {job.type}
                  </span>
                  <motion.button 
                    className="text-primary-600 font-medium hover:underline"
                    whileHover={{ x: 5 }}
                  >
                    Apply →
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}