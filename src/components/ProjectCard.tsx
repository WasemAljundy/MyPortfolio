import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../models/types';
import { ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  key?: React.Key;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const thumb = project.imageUrls.length > 0 ? project.imageUrls[0] : 'https://picsum.photos/seed/flutter/400/300';
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-white/10 cursor-pointer transition-all duration-300 flex flex-col h-full group relative"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-900 border-b border-white/10">
        <img 
          src={thumb} 
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded text-[10px] font-bold text-cyan-400 border border-white/10 uppercase tracking-tight">
          {project.category}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col relative z-10">
        <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
        <p className="text-[14px] text-slate-400 line-clamp-2 mb-4 flex-1">
          {project.function}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech, i) => (
            <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-white/10 border border-white/5 text-cyan-400 rounded uppercase tracking-tight">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-[10px] font-bold px-2 py-0.5 bg-white/10 border border-white/5 text-cyan-400 rounded uppercase tracking-tight">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
