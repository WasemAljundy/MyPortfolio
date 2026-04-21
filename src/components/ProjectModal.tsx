import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../models/types';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!project) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.imageUrls.length) % project.imageUrls.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl bg-[#020617]/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Carousel */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-white/5 border-b border-white/10 shrink-0">
            {project.imageUrls.length > 0 ? (
              <>
                <img 
                  src={project.imageUrls[currentImageIndex]} 
                  alt={project.name}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                
                {project.imageUrls.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 hover:bg-white/90 text-slate-900 rounded-full flex items-center justify-center backdrop-blur-md transition-all"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 hover:bg-white/90 text-slate-900 rounded-full flex items-center justify-center backdrop-blur-md transition-all"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {project.imageUrls.map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 rounded-full ${i === currentImageIndex ? 'bg-cyan-400' : 'bg-white/30'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                No images available
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{project.name}</h2>
                <div className="inline-block bg-white/10 border border-white/5 text-cyan-400 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-tight">
                  {project.category}
                </div>
              </div>
              
              {project.liveLink && (
                <a 
                  href={project.liveLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2.5 rounded-full font-semibold transition-colors shrink-0"
                >
                  {t('viewLiveApp')}
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{t('coreFunctionality')}</h3>
                <p className="text-slate-400">{project.function}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{t('projectDetails')}</h3>
                <p className="text-slate-400 whitespace-pre-wrap leading-relaxed">{project.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-white mb-3">{t('technologiesUsed')}</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-white/10 border border-white/5 text-cyan-400 rounded-lg text-[12px] font-bold tracking-wide uppercase">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
