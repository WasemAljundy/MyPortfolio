import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle, Github, Linkedin, Mail } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useLanguage } from '../lib/LanguageContext';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { t } = useLanguage();

  // User should replace these with actual EmailJS keys
  const SERVICE_ID = 'YOUR_SERVICE_ID';
  const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
  const WHATSAPP_NUMBER = '972592463727'; // your whatsapp number

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsSubmitting(true);
    try {
      if (SERVICE_ID === 'YOUR_SERVICE_ID') {
        // Mock success if not configured
        setTimeout(() => {
          setStatus('success');
          setFormData({ name: '', email: '', message: '' });
          setIsSubmitting(false);
        }, 1000);
        return;
      }

      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, e.target as HTMLFormElement, PUBLIC_KEY);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Email error:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-4">{t('contactMeTitle')}</h1>
        <p className="text-lg text-slate-400">
          {t('contactSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-sm">
            <h3 className="text-2xl font-bold text-white mb-6">{t('contactInfo')}</h3>
            
            <div className="space-y-6">
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=مرحباً، أود التواصل معك بخصوص مشروع`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-slate-400 hover:text-green-400 transition-colors group"
              >
                <div className="w-12 h-12 bg-white/5 border border-white/10 text-green-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="text-lg font-medium">{t('whatsappMessage')}</span>
              </a>

              <a 
                href="mailto:wasemaljundy22@gmail.com"
                className="flex items-center gap-4 text-slate-400 hover:text-cyan-400 transition-colors group"
              >
                <div className="w-12 h-12 bg-white/5 border border-white/10 text-cyan-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="text-lg font-medium">{t('sendEmail')}</span>
              </a>
            </div>

            <hr className="my-8 border-white/10" />

            <div>
              <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">{t('socialNetworks')}</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 text-slate-400 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-white transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 text-slate-400 rounded-full flex items-center justify-center hover:bg-white/10 hover:text-cyan-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-2">
                {t('name')}
              </label>
              <input
                type="text"
                id="name"
                name="user_name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#020617]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                placeholder={t('yourNamePlaceholder')}
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">
                {t('emailAddress')}
              </label>
              <input
                type="email"
                id="email"
                name="user_email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#020617]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                placeholder="email@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-2">
                {t('message')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className="w-full bg-[#020617]/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow resize-none"
                placeholder={t('messagePlaceholder')}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-6 py-4 rounded-xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {t('sendMessage')}
                  <Send className="w-5 h-5 rtl:-scale-x-100" />
                </>
              )}
            </button>

            {status === 'success' && (
              <p className="text-green-400 text-center font-medium mt-4">
                {t('messageSentSuccess')}
              </p>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-center font-medium mt-4">
                {t('messageSentError')}
              </p>
            )}
            {SERVICE_ID === 'YOUR_SERVICE_ID' && status === 'success' && (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2">
                {t('mockSuccessNote')}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
