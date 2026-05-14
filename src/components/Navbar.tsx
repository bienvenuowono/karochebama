import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, Globe, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Boutique', path: '/marketplace' },
    { name: 'Activités', path: '/nos-activites' },
    { name: 'Projets', path: '/projets' },
    { 
      name: 'Médias', 
      path: '#',
      submenu: [
        { name: 'Images', path: '/mediatheque/images' },
        { name: 'Vidéos', path: '/mediatheque/videos' },
      ]
    },
    { name: 'Actualité', path: '/actualite' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-full flex flex-col sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="bg-[#1a2b3c] text-white text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              Support en direct
            </span>
            <span className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer">
              <Phone className="h-3.5 w-3.5" />
              +237 677 11 80 81
            </span>
            <span className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer">
              <Mail className="h-3.5 w-3.5" />
              contact@karochebama.com
            </span>
          </div>
          <div className="flex items-center">
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium border border-emerald-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              nous sommes une entreprise légale et verifié
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex flex-col items-center justify-center group">
                <div className="flex items-center justify-center relative">
                  <span className="text-4xl font-serif font-black text-gray-900 tracking-tighter group-hover:text-emerald-800 transition-colors">
                    GTK
                  </span>
                  {/* Decorative leaf element to mimic the logo's leaves */}
                  <svg className="absolute -left-3 -bottom-1 h-5 w-5 text-emerald-600 opacity-80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5,11.4c1.7-2.9,2.2-6.4,1.1-9.5c-3.1,1.1-6.6,2.6-9.5,4.3C6.2,8.9,3.8,12.5,3.1,16.3c-0.7,3.8,0.3,7.7,2.8,10.6 c1.1-3.1,2.6-6.6,4.3-9.5C13.1,14.5,15.5,10.9,17.5,11.4z"/>
                  </svg>
                </div>
                <div className="flex flex-col items-center mt-0.5">
                  <span className="text-[8px] sm:text-[9px] font-medium text-gray-900 tracking-wide border-b-[1px] border-gray-900 pb-0.5 mb-0.5">
                    Groupe Trebor Karochebama
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-serif italic text-emerald-700">
                    Feeding the world
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center justify-center flex-1 px-8">
              <div className="flex space-x-8">
                {navLinks.map((link) => (
                  link.submenu ? (
                    <div key={link.name} className="relative group">
                      <button
                        className={`inline-flex items-center text-sm font-semibold transition-colors py-8 ${
                          location.pathname.startsWith('/mediatheque')
                            ? 'text-emerald-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {link.name}
                        <svg className="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      <div className="absolute left-0 top-full -mt-2 w-48 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-left scale-95 group-hover:scale-100">
                        <div className="py-2 p-1">
                          {link.submenu.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              className={`block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                isActive(subItem.path)
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`inline-flex items-center text-sm font-semibold transition-colors py-8 ${
                        isActive(link.path)
                          ? 'text-emerald-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )
                ))}
              </div>
            </div>
            
            {/* Right Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
                <Globe className="h-4 w-4" />
                <span>Français</span>
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
                <a 
                  href="/admin/login"
                  className="ml-2 inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-[#1a2b3c] hover:bg-gray-800 shadow-sm transition-all hover:shadow-md active:scale-95"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Connexion
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden space-x-4">

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors"
              >
                {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="pt-2 pb-4 space-y-1 px-4">
                {navLinks.map((link) => (
                  link.submenu ? (
                    <div key={link.name} className="py-3 border-b border-gray-50">
                      <button
                        onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
                        className={`w-full flex items-center justify-between text-base font-semibold ${
                          location.pathname.startsWith('/mediatheque')
                            ? 'text-emerald-600'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {link.name}
                        <svg className={`h-5 w-5 transition-transform ${mobileSubmenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {mobileSubmenuOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 pt-4 space-y-4">
                              {link.submenu.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.path}
                                  className={`block text-sm font-medium ${
                                    isActive(subItem.path)
                                      ? 'text-emerald-600'
                                      : 'text-gray-500 hover:text-gray-900'
                                  }`}
                                  onClick={() => setIsOpen(false)}
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`block py-3 border-b border-gray-50 text-base font-semibold ${
                        isActive(link.path)
                          ? 'text-emerald-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )
                ))}
                <div className="pt-4 flex flex-col gap-3">
                  <a 
                    href="/admin/login"
                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-bold rounded-xl text-white bg-[#1a2b3c] hover:bg-gray-800 shadow-sm transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Connexion
                  </a>
                  <Link 
                    to="/signup"
                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-200 text-base font-bold rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Créer un compte
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}
