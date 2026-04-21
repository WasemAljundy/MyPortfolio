import React, { useEffect, useState } from 'react';
import Background3D from '../components/Background3D';
import { AnimatedDigit } from '../components/AnimatedDigit';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Stats } from '../models/types';
import { useLanguage } from '../lib/LanguageContext';

export default function Home() {
  const [stats, setStats] = useState<Stats>({ projectsCount: 13, experienceYears: 4, clientsCount: 10 });
  const { t } = useLanguage();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'stats', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setStats(docSnap.data() as Stats);
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden">
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12 mb-8">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.5 }}
           className="mb-8"
        >
          <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
            <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
            <img 
              src="/profile.jpg" 
              alt="Wasem Aljundy" 
              className="relative w-full h-full object-cover rounded-full border-4 border-white/10 shadow-2xl"
              onError={(e) => {
                // If user doesn't upload image yet, fallback to placeholder
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent('Wasem Aljundy')}&background=0D9488&color=fff&size=200`;
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            {t('greeting')}
          </h2>
          <span className="text-cyan-400 font-mono mb-4 uppercase tracking-widest text-sm inline-block">{t('availableForHire')}</span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            {t('expertArchitect')} <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
               {t('uiUxSpecialist')}
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10">
            {t('heroDescription')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <Link
            to="/portfolio"
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-8 py-3 rounded-xl font-bold shadow-lg shadow-cyan-500/30 transition-all"
          >
            <Briefcase className="w-5 h-5" />
            {t('portfolio')}
          </Link>
          <Link
            to="/contact"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 rounded-xl font-bold transition-all text-white"
          >
            <Mail className="w-5 h-5" />
            {t('contactMeTitle')}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
        >
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold text-white mb-2">
              +<AnimatedDigit value={stats.projectsCount} />
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">{t('completedProjects')}</span>
          </div>
          <div className="flex flex-col items-center md:border-x border-white/10">
            <span className="text-4xl md:text-5xl font-bold text-white mb-2">
              +<AnimatedDigit value={stats.experienceYears} />
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">{t('yearsExperience')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl md:text-5xl font-bold text-white mb-2">
              +<AnimatedDigit value={stats.clientsCount} />
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">{t('happyClients')}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
