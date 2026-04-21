import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/useAuth';
import { auth, db, storage } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Project, Stats } from '../models/types';
import { LogOut, Plus, Upload, Trash2, Edit2, Check, X } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

const CATEGORIES = ['delivery', 'education', 'social', 'shopping', 'services', 'other'];

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard State
  const [activeTab, setActiveTab] = useState<'projects'|'stats'>('projects');
  
  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [func, setFunc] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [liveLink, setLiveLink] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats State
  const [stats, setStats] = useState<Stats>({ projectsCount: 0, experienceYears: 0, clientsCount: 0 });
  const [isUpdatingStats, setIsUpdatingStats] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdmin) {
      // Load projects
      const unsubP = onSnapshot(collection(db, 'projects'), (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        setProjects(data);
      });
      // Load stats
      const unsubS = onSnapshot(doc(db, 'stats', 'global'), (snap) => {
        if (snap.exists()) setStats(snap.data() as Stats);
      });
      return () => { unsubP(); unsubS(); };
    }
  }, [isAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setLoginError(err.message || 'فشل تسجيل الدخول');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setFunc('');
    setTechnologies('');
    setCategory(CATEGORIES[0]);
    setLiveLink('');
    setImageFiles([]);
    setExistingImages([]);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEdit = (p: Project) => {
    setEditingId(p.id!);
    setName(p.name);
    setDescription(p.description);
    setFunc(p.function);
    setTechnologies(p.technologies.join(', '));
    setCategory(p.category);
    setLiveLink(p.liveLink || '');
    setExistingImages(p.imageUrls);
    setImageFiles([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !func || !technologies || (imageFiles.length === 0 && existingImages.length === 0)) {
      alert('يرجى تعبئة جميع الحقول وإضافة صورة واحدة على الأقل');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const techArray = technologies.split(',').map(t => t.trim()).filter(t => t !== '');
      
      // Upload new images
      const newImageUrls: string[] = [];
      for (const file of imageFiles) {
        const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        newImageUrls.push(url);
      }

      const finalImageUrls = [...existingImages, ...newImageUrls];

      const projectData = {
        name,
        description,
        function: func,
        technologies: techArray,
        category,
        liveLink,
        imageUrls: finalImageUrls,
        order: projects.length, // simple ordering
        createdAt: serverTimestamp()
      };

      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), {
           ...projectData,
           createdAt: projects.find(p => p.id === editingId)?.createdAt || serverTimestamp() // preserve timestamp
        });
      } else {
        await addDoc(collection(db, 'projects'), projectData);
      }

      resetForm();
    } catch (error: any) {
      console.error(error);
      alert('حدث خطأ أثناء الحفظ: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.')) {
      await deleteDoc(doc(db, 'projects', id));
    }
  };

  const updateStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingStats(true);
    try {
      await setDoc(doc(db, 'stats', 'global'), stats);
      alert('تم تحديث الإحصائيات بنجاح');
    } catch (e: any) {
      alert('خطأ: ' + e.message);
    } finally {
      setIsUpdatingStats(false);
    }
  };

  if (authLoading) return <div className="p-20 text-center">Loading...</div>;

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white/5 backdrop-blur-xl rounded-3xl shadow-lg border border-white/10">
        <h2 className="text-2xl font-bold text-center text-white mb-6">{t('adminLogin')}</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">{t('emailAddress')}</label>
            <input 
              type="email" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              className="w-full px-4 py-2 rounded-xl bg-[#020617]/50 border border-white/10 text-white focus:ring-2 focus:ring-cyan-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">{t('password')}</label>
            <input 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              className="w-full px-4 py-2 rounded-xl bg-[#020617]/50 border border-white/10 text-white focus:ring-2 focus:ring-cyan-500" 
              required 
            />
          </div>
          {loginError && <p className="text-red-400 text-sm">{loginError}</p>}
          <button type="submit" className="w-full bg-cyan-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-cyan-400 transition">
            {t('login')}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">{t('adminDashboard')}</h1>
        <button onClick={() => signOut(auth)} className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
          <LogOut className="w-5 h-5"/> {t('logout')}
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <button onClick={() => setActiveTab('projects')} className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'projects' ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 border border-white/10 text-white'}`}>{t('projectsTab')}</button>
        <button onClick={() => setActiveTab('stats')} className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'stats' ? 'bg-cyan-500 text-slate-950' : 'bg-white/5 border border-white/10 text-white'}`}>{t('statsTab')}</button>
        {projects.length === 0 && (
          <button 
            type="button" 
            onClick={async () => {
              const mock1 = { name: "تطبيق متجر الكتروني", description: "تطبيق متجر متكامل يعرض المنتجات بتصميم عصري مع سلة مشتريات ودفع إلكتروني.", function: "تصفح وشراء المنتجات", technologies: ["Flutter", "Firebase", "Stripe"], category: "shopping", imageUrls: ["https://picsum.photos/seed/shop1/800/600", "https://picsum.photos/seed/shop2/800/600"], liveLink: "#", order: 1, createdAt: serverTimestamp() };
              const mock2 = { name: "منصة تعليمية", description: "تطبيق للكورسات التعليمية يحتوي على فيديوهات تفاعلية واختبارات قصيرة.", function: "مشاهدة الدروس التعليمية", technologies: ["Flutter", "GetX", "Video Player"], category: "education", imageUrls: ["https://picsum.photos/seed/edu1/800/600", "https://picsum.photos/seed/edu2/800/600"], liveLink: "#", order: 2, createdAt: serverTimestamp() };
              const mock3 = { name: "توصيل طلبات", description: "تطبيق لتوصيل الطلبات مع تتبع المندوب على الخريطة في الوقت الفعلي.", function: "طلب وتتبع الطلبات", technologies: ["Flutter", "Google Maps", "Firebase RTDB"], category: "delivery", imageUrls: ["https://picsum.photos/seed/del1/800/600"], liveLink: "#", order: 3, createdAt: serverTimestamp() };
              
              await addDoc(collection(db, 'projects'), mock1);
              await addDoc(collection(db, 'projects'), mock2);
              await addDoc(collection(db, 'projects'), mock3);
              alert(t('mockDataSuccess'));
            }}
            className="px-6 py-2 rounded-full font-bold bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition ml-auto"
          >
            {t('insertMockData')}
          </button>
        )}
      </div>

      {activeTab === 'stats' && (
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 max-w-xl">
          <h2 className="text-xl font-bold mb-6 text-white">{t('updateStats')}</h2>
          <form onSubmit={updateStats} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-400">{t('completedProjects')}</label>
              <input type="number" value={stats.projectsCount} onChange={e=>setStats({...stats, projectsCount: parseInt(e.target.value)})} className="w-full px-4 py-2 rounded-xl bg-[#020617]/50 border border-white/10 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-400">{t('yearsExperience')}</label>
              <input type="number" value={stats.experienceYears} onChange={e=>setStats({...stats, experienceYears: parseInt(e.target.value)})} className="w-full px-4 py-2 rounded-xl bg-[#020617]/50 border border-white/10 text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-400">{t('happyClients')}</label>
              <input type="number" value={stats.clientsCount} onChange={e=>setStats({...stats, clientsCount: parseInt(e.target.value)})} className="w-full px-4 py-2 rounded-xl bg-[#020617]/50 border border-white/10 text-white" />
            </div>
            <button type="submit" disabled={isUpdatingStats} className="w-full bg-cyan-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-cyan-400 transition">
              {isUpdatingStats ? t('updating') : t('saveStats')}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 h-fit sticky top-20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">{editingId ? t('editProject') : t('addNewProject')}</h2>
              {editingId && (
                <button onClick={resetForm} className="text-sm text-slate-400 hover:text-white">{t('cancelEdit')}</button>
              )}
            </div>
            
            <form onSubmit={saveProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-400">{t('projectName')}</label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-[#020617]/50 border border-white/10 text-white" required />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-400">{t('coreFunctionInput')}</label>
                <input type="text" value={func} onChange={e=>setFunc(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-[#020617]/50 border border-white/10 text-white" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-400">{t('detailedDescription')}</label>
                <textarea rows={4} value={description} onChange={e=>setDescription(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-[#020617]/50 border border-white/10 text-white resize-none" required />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-400">{t('technologiesInput')}</label>
                <input type="text" placeholder="Flutter, Firebase, GetX" value={technologies} onChange={e=>setTechnologies(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-[#020617]/50 border border-white/10 text-white" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-400">{t('category')}</label>
                  <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full px-4 py-2 rounded-xl bg-[#020617]/50 border border-white/10 text-white">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-400">{t('liveLink')}</label>
                  <input type="url" value={liveLink} onChange={e=>setLiveLink(e.target.value)} placeholder="https://..." className="w-full px-4 py-2 rounded-xl bg-[#020617]/50 border border-white/10 text-white" />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-400">{t('images')}</label>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    {existingImages.map((url, i) => (
                      <div key={'ex'+i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                        <img src={url} className="w-full h-full object-cover" />
                        <button type="button" onClick={()=>removeExistingImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X className="w-3 h-3"/></button>
                      </div>
                    ))}
                    {imageFiles.map((f, i) => (
                      <div key={'nw'+i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                        <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" />
                        <button type="button" onClick={()=>removeFile(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X className="w-3 h-3"/></button>
                      </div>
                    ))}
                  </div>
                  
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 border-2 border-dashed border-white/20 rounded-xl py-4 hover:border-cyan-500 hover:text-cyan-500 transition text-slate-400">
                    <Upload className="w-5 h-5"/> {t('addImages')}
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" multiple className="hidden" />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-cyan-500 text-slate-950 font-bold py-3 rounded-xl hover:bg-cyan-400 transition mt-4">
                {isSubmitting ? <span className="animate-pulse">{t('savingUploading')}</span> : <><Check className="w-5 h-5"/> {t('saveProject')}</>}
              </button>
            </form>
          </div>

          {/* List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">{t('currentProjects')} ({projects.length})</h2>
            {projects.map((p) => (
              <div key={p.id} className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex gap-4 items-center">
                <img src={p.imageUrls[0] || 'https://picsum.photos/100'} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg truncate text-white">{p.name}</h3>
                  <p className="text-sm text-cyan-400 font-bold uppercase tracking-tight">{p.category}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(p)} className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"><Edit2 className="w-5 h-5"/></button>
                  <button onClick={() => deleteProject(p.id!)} className="p-2 bg-white/10 text-red-400 rounded-lg hover:bg-red-500/20 transition"><Trash2 className="w-5 h-5"/></button>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-slate-500 text-center py-10">{t('noProjectsYet')}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
