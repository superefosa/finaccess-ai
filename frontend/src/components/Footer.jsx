import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Footer() {
  const FooterSection = ({ title, links }) => (
    <div>
      <h4 className="font-semibold mb-4">{title}</h4>
      <ul className="space-y-2">
        {links.map((link, idx) => (
          <motion.li key={idx} whileHover={{ x: 5 }}>
            <Link to={link.to} className="text-gray-600 hover:text-primary-600 transition-colors">
              {link.label}
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  )

  const socialIcons = ['🐦', '💼', '🐙', '📧']

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-primary-600 mb-4">FinAccess AI</h3>
            <p className="text-gray-600 mb-4 max-w-sm">
              AI-powered lending platform making credit accessible and transparent for everyone.
            </p>
            <div className="flex gap-4">
              {socialIcons.map((icon, i) => (
                <motion.a 
                  key={i} 
                  href="#" 
                  className="text-gray-400 hover:text-primary-600 text-xl transition-colors"
                  whileHover={{ scale: 1.2, y: -3 }}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </div>
          
          <FooterSection 
            title="Product" 
            links={[
              { to: "/", label: "Home" },
              { to: "/dashboard", label: "Dashboard" },
              { to: "/apply", label: "Apply" }
            ]} 
          />
          
          <FooterSection 
            title="Company" 
            links={[
              { to: "/about", label: "About Us" },
              { to: "/careers", label: "Careers" },
              { to: "/contact", label: "Contact" }
            ]} 
          />
          
          <FooterSection 
            title="Legal" 
            links={[
              { to: "/privacy", label: "Privacy" },
              { to: "/terms", label: "Terms" },
              { to: "/security", label: "Security" }
            ]} 
          />
        </div>
        
        <div className="border-t border-gray-100 mt-8 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} FinAccess AI. All rights reserved. Capstone Project - MSSE Program.
        </div>
      </div>
    </footer>
  )
}