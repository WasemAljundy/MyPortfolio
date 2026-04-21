import React, { createContext, useContext, useEffect, useState } from 'react';

type Language = 'ar' | 'en';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

export const translations: Translations = {
  ar: {
    home: 'الرئيسية',
    portfolio: 'معرض الأعمال',
    contact: 'تواصل معي',
    admin: 'المشرف',
    logoText: 'وسيم',
    logoHighlight: 'الجندي',
    greeting: 'مرحباً، أنا وسيم الجندي 👋',
    availableForHire: 'متاح للعمل',
    expertArchitect: 'خبير تصميم وبناء تطبيقات فلاتر و',
    uiUxSpecialist: 'متخصص واجهات المستخدم',
    heroDescription: 'بناء تجارب متعددة المنصات بدقة استثنائية باستخدام فلاتر، فايربيس، وهندسة برمجية عالية الأداء.',
    completedProjects: 'مشاريع منجزة',
    yearsExperience: 'سنوات خبرة',
    happyClients: 'عملاء سعداء',
    all: 'الكل',
    addNewProject: 'إضافة مشروع جديد',
    viewLiveApp: 'عرض التطبيق',
    coreFunctionality: 'الوظيفة الأساسية',
    projectDetails: 'تفاصيل المشروع',
    technologiesUsed: 'التقنيات المستخدمة',
    contactMeTitle: 'تواصل معي',
    contactSubtitle: 'هل لديك مشروع مذهل في ذهنك؟ دعنا نحوله إلى واقع معاً.',
    contactInfo: 'معلومات التواصل',
    whatsappMessage: 'مراسلة عبر واتساب',
    sendEmail: 'إرسال بريد إلكتروني',
    socialNetworks: 'الشبكات الاجتماعية',
    name: 'الاسم',
    yourNamePlaceholder: 'اسمك الكريم',
    emailAddress: 'البريد الإلكتروني',
    message: 'الرسالة',
    messagePlaceholder: 'اكتب رسالتك هنا...',
    sendingMessage: 'إرسال الرسالة...',
    sendMessage: 'إرسال الرسالة',
    messageSentSuccess: 'تم إرسال الرسالة بنجاح!',
    messageSentError: 'عذراً، حدث خطأ. حاول مرة أخرى.',
    mockSuccessNote: 'ملاحظة: هذا محاكاة للنجاح لأن مفاتيح EmailJS لم يتم إعدادها بعد. يرجى إضافة المفاتيح في ملف src/pages/Contact.tsx',
    adminLogin: 'تسجيل دخول المشرف',
    password: 'كلمة المرور',
    login: 'دخول',
    projectsTab: 'المشاريع',
    statsTab: 'الإحصائيات',
    updateStats: 'تحديث الإحصائيات',
    updating: 'جاري التحديث...',
    saveStats: 'حفظ الإحصائيات',
    editProject: 'تعديل مشروع',
    cancelEdit: 'إلغاء التعديل',
    projectName: 'اسم المشروع *',
    coreFunctionInput: 'الوظيفة الأساسية (نص قصير) *',
    detailedDescription: 'الوصف التفصيلي *',
    technologiesInput: 'التقنيات (مفصولة بفواصل) *',
    category: 'التصنيف *',
    liveLink: 'رابط مباشر (اختياري)',
    images: 'الصور *',
    addImages: 'إضافة صور',
    savingUploading: 'جاري الحفظ والرفع...',
    saveProject: 'حفظ المشروع',
    currentProjects: 'المشاريع الحالية',
    noProjectsYet: 'لا توجد مشاريع مضافة بعد.',
    insertMockData: 'إدراج بيانات وهمية',
    mockDataSuccess: 'تمت إضافة البيانات الوهمية بنجاح!',
    adminDashboard: 'لوحة تحكم المشرف',
    logout: 'تسجيل الخروج',
  },
  en: {
    home: 'Home',
    portfolio: 'Portfolio',
    contact: 'Contact',
    admin: 'Admin',
    logoText: 'Wasem',
    logoHighlight: 'Aljundy',
    greeting: 'Hi, I\'m Wasem Aljundy 👋',
    availableForHire: 'Available for Hire',
    expertArchitect: 'Expert Flutter Architect &',
    uiUxSpecialist: 'UI/UX Specialist',
    heroDescription: 'Building cross-platform experiences with pixel-perfection using Flutter, Firebase, and scalable architecture.',
    completedProjects: 'Completed Projects',
    yearsExperience: 'Years Experience',
    happyClients: 'Happy Clients',
    all: 'All',
    addNewProject: 'Add New Project',
    viewLiveApp: 'View Live App',
    coreFunctionality: 'Core Functionality',
    projectDetails: 'Project Details',
    technologiesUsed: 'Technologies Used',
    contactMeTitle: 'Contact Me',
    contactSubtitle: 'Have an amazing project in mind? Let\'s turn it into reality together.',
    contactInfo: 'Contact Information',
    whatsappMessage: 'Message on WhatsApp',
    sendEmail: 'Send Email',
    socialNetworks: 'Social Networks',
    name: 'Name',
    yourNamePlaceholder: 'Your Name',
    emailAddress: 'Email Address',
    message: 'Message',
    messagePlaceholder: 'Write your message here...',
    sendingMessage: 'Sending Message...',
    sendMessage: 'Send Message',
    messageSentSuccess: 'Message sent successfully!',
    messageSentError: 'Sorry, an error occurred. Please try again.',
    mockSuccessNote: 'Note: This is a simulated success because EmailJS keys are not configured yet. Please add them in src/pages/Contact.tsx',
    adminLogin: 'Admin Login',
    password: 'Password',
    login: 'Login',
    projectsTab: 'Projects',
    statsTab: 'Statistics',
    updateStats: 'Update Statistics',
    updating: 'Updating...',
    saveStats: 'Save Statistics',
    editProject: 'Edit Project',
    cancelEdit: 'Cancel Edit',
    projectName: 'Project Name *',
    coreFunctionInput: 'Core Function (Short Text) *',
    detailedDescription: 'Detailed Description *',
    technologiesInput: 'Technologies (Comma separated) *',
    category: 'Category *',
    liveLink: 'Live Link (Optional)',
    images: 'Images *',
    addImages: 'Add Images',
    savingUploading: 'Saving and Uploading...',
    saveProject: 'Save Project',
    currentProjects: 'Current Projects',
    noProjectsYet: 'No projects added yet.',
    insertMockData: 'Insert Mock Data',
    mockDataSuccess: 'Mock data added successfully!',
    adminDashboard: 'Admin Dashboard',
    logout: 'Logout',
  }
};

const LanguageContext = createContext<{
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}>({
  language: 'ar',
  toggleLanguage: () => {},
  t: () => '',
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem('language') as Language) || 'ar'
  );

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
