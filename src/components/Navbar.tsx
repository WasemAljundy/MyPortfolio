import { NavLink } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { key: 'home', path: '/' },
    { key: 'portfolio', path: '/portfolio' },
    { key: 'contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 relative">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 sm:px-6">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/20 text-white">
              {t('logoText').charAt(0)}
            </div>
            <span className="text-xl font-bold tracking-tight text-white">{t('logoText')} <span className="text-cyan-400 font-medium">{t('logoHighlight')}</span></span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse space-x-reverse">
            {navLinks.map((link) => (
              <NavLink
                key={link.key}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "text-sm font-medium transition-colors border-b-2 py-5",
                    isActive ? "text-white border-cyan-400" : "text-slate-400 border-transparent hover:text-white"
                  )
                }
              >
                {t(link.key)}
              </NavLink>
            ))}
            
            <div className="flex items-center gap-4 mr-4 rtl:mr-4 ltr:ml-4">
               <button
                 onClick={toggleLanguage}
                 className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm font-medium"
                 title="Toggle Language"
               >
                 <Globe className="w-4 h-4" />
                 {language === 'ar' ? 'EN' : 'عربي'}
               </button>
               <NavLink to="/admin" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold border border-white/10 transition-all text-white">
                 {t('admin')}
               </NavLink>
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button
               onClick={toggleLanguage}
               className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm font-medium uppercase"
             >
               <Globe className="w-4 h-4" />
               <span className="sr-only">Toggle Language</span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-100"
            >
             {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full mt-2 w-full bg-[#020617]/95 border border-white/10 rounded-2xl p-4 space-y-1 backdrop-blur-xl shadow-2xl z-50">
          {navLinks.map((link) => (
            <NavLink
              key={link.key}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  isActive 
                    ? "bg-cyan-500/20 text-cyan-400" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )
              }
            >
              {t(link.key)}
            </NavLink>
          ))}
          <NavLink
            to="/admin"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-400 hover:bg-white/5 hover:text-white mt-4 border-t border-white/10 pt-4"
          >
            {t('admin')}
          </NavLink>
        </div>
      )}
    </nav>
  );
}
