import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (en: string, ar?: string | null) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('nabdh-language');
    return (saved as Language) || 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('nabdh-language', language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (en: string, ar?: string | null) => {
    if (language === 'ar' && ar) {
      return ar;
    }
    return en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Common translations
// eslint-disable-next-line react-refresh/only-export-components
export const translations = {
  // Header
  searchPlaceholder: { en: 'Search prompts...', ar: 'البحث في الموجهات...' },
  submitPrompt: { en: 'Submit Prompt', ar: 'إرسال موجه' },
  submit: { en: 'Submit', ar: 'إرسال' },

  // Hero
  heroTitle1: { en: 'Find the ', ar: 'اكتشف ' },
  heroPulse: { en: 'Pulse', ar: 'نبض' },
  heroTitle2: { en: 'of Creativity', ar: ' الإبداع' },
  heroSubtitle: { en: 'Discover, copy, and use curated AI prompts for ChatGPT, Midjourney, Claude, and more.', ar: 'اكتشف وانسخ واستخدم موجهات الذكاء الاصطناعي المختارة لـ ChatGPT و Midjourney و Claude والمزيد.' },
  boostProductivity: { en: 'Boost your productivity with proven prompts.', ar: 'عزز إنتاجيتك مع موجهات مجربة.' },
  prompts: { en: 'Prompts', ar: 'موجهات' },
  aiModels: { en: 'AI Models', ar: 'نماذج الذكاء' },
  users: { en: 'Users', ar: 'مستخدمين' },
  explorePrompts: { en: 'Explore Prompts', ar: 'استكشف الموجهات' },

  // Filters
  allPrompts: { en: 'All Prompts', ar: 'كل الموجهات' },
  all: { en: 'All', ar: 'الكل' },
  coding: { en: 'Coding', ar: 'البرمجة' },
  writing: { en: 'Writing', ar: 'الكتابة' },
  art: { en: 'Art', ar: 'الفن' },
  marketing: { en: 'Marketing', ar: 'التسويق' },
  allModels: { en: 'All Models', ar: 'كل النماذج' },
  selectModel: { en: 'Select Model', ar: 'اختر النموذج' },

  // Prompt Card
  showMore: { en: 'Show more', ar: 'عرض المزيد' },
  showLess: { en: 'Show less', ar: 'عرض أقل' },
  copy: { en: 'Copy', ar: 'نسخ' },
  copied: { en: 'Copied!', ar: 'تم النسخ!' },

  // Empty state
  noPromptsFound: { en: 'No prompts found', ar: 'لم يتم العثور على موجهات' },
  adjustFilters: { en: 'Try adjusting your filters or search query', ar: 'حاول تعديل الفلاتر أو البحث' },

  // Footer
  footerText: { en: 'Built with passion for the AI community.', ar: 'صُنع بشغف لمجتمع الذكاء الاصطناعي.' },

  // Admin Navigation
  dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
  addPrompt: { en: 'Add Prompt', ar: 'إضافة موجه' },
  settings: { en: 'Settings', ar: 'الإعدادات' },
  adminPanel: { en: 'Admin Panel', ar: 'لوحة الإدارة' },
  admin: { en: 'Admin', ar: 'المسؤول' },

  // Dashboard
  addNewPrompt: { en: 'Add New Prompt', ar: 'إضافة موجه جديد' },
  manageLibrary: { en: 'Manage your prompt library', ar: 'إدارة مكتبة الموجهات' },
  totalPrompts: { en: 'Total Prompts', ar: 'إجمالي الموجهات' },
  totalLikes: { en: 'Total Likes', ar: 'إجمالي الإعجابات' },

  // Table
  title: { en: 'Title', ar: 'العنوان' },
  category: { en: 'Category', ar: 'الفئة' },
  aiModel: { en: 'AI Model', ar: 'نموذج الذكاء' },
  tags: { en: 'Tags', ar: 'الوسوم' },
  actions: { en: 'Actions', ar: 'الإجراءات' },

  // Form Labels
  promptTitle: { en: 'Title', ar: 'العنوان' },
  arabicTitle: { en: 'Arabic Title', ar: 'العنوان بالعربية' },
  promptContent: { en: 'Prompt Content', ar: 'محتوى الموجه' },
  selectCategory: { en: 'Select category', ar: 'اختر الفئة' },
  selectAiModel: { en: 'Select AI model', ar: 'اختر نموذج الذكاء' },

  // Form Placeholders
  enterTitle: { en: 'Enter prompt title...', ar: 'أدخل عنوان الموجه...' },
  enterArabicTitle: { en: 'Enter Arabic title...', ar: 'أدخل العنوان بالعربية...' },
  writePrompt: { en: 'Write your AI prompt here...', ar: 'اكتب موجه الذكاء الاصطناعي هنا...' },
  enterTags: { en: 'Enter comma-separated tags (e.g., SEO, Marketing, AI)', ar: 'أدخل الوسوم مفصولة بفواصل (مثال: تسويق، ذكاء اصطناعي)' },
  separateTags: { en: 'Separate tags with commas', ar: 'افصل الوسوم بفواصل' },

  // Buttons
  savePulse: { en: 'Save Pulse', ar: 'حفظ النبضة' },
  updatePulse: { en: 'Update Pulse', ar: 'تحديث النبضة' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  saving: { en: 'Saving...', ar: 'جاري الحفظ...' },
  delete: { en: 'Delete', ar: 'حذف' },
  edit: { en: 'Edit', ar: 'تعديل' },

  // Dialogs
  editPrompt: { en: 'Edit Prompt', ar: 'تعديل الموجه' },
  deletePrompt: { en: 'Delete Prompt?', ar: 'حذف الموجه؟' },
  deleteConfirmation: { en: 'This action cannot be undone. This will permanently delete', ar: 'لا يمكن التراجع عن هذا الإجراء. سيتم حذف' },
  fromLibrary: { en: 'from the library.', ar: 'من المكتبة نهائياً.' },

  // Create Page
  createNewPrompt: { en: 'Create New Prompt', ar: 'إنشاء موجه جديد' },
  addPulseToLibrary: { en: 'Add a new pulse to your library', ar: 'أضف نبضة جديدة لمكتبتك' },

  // Settings
  appearance: { en: 'Appearance', ar: 'المظهر' },
  rtlMode: { en: 'RTL Mode', ar: 'وضع RTL' },
  rtlDescription: { en: 'Enable right-to-left layout for Arabic content', ar: 'تفعيل التخطيط من اليمين إلى اليسار للمحتوى العربي' },
  showArabicTitles: { en: 'Show Arabic Titles', ar: 'عرض العناوين العربية' },
  showArabicDescription: { en: 'Display Arabic translations when available', ar: 'عرض الترجمات العربية عند توفرها' },
  notifications: { en: 'Notifications', ar: 'الإشعارات' },
  newSubmissionAlerts: { en: 'New Submission Alerts', ar: 'تنبيهات الإرسال الجديدة' },
  notifySubmissions: { en: 'Get notified when users submit new prompts', ar: 'تلقي إشعارات عند إرسال موجهات جديدة' },
  saveChanges: { en: 'Save Changes', ar: 'حفظ التغييرات' },
  resetDefaults: { en: 'Reset to Defaults', ar: 'إعادة التعيين' },

  // Misc
  required: { en: 'Required', ar: 'مطلوب' },
  loading: { en: 'Loading...', ar: 'جاري التحميل...' },
  error: { en: 'Error', ar: 'خطأ' },
  success: { en: 'Success', ar: 'نجاح' },
  promptCreated: { en: 'Prompt Created', ar: 'تم إنشاء الموجه' },
  promptUpdated: { en: 'Prompt Updated', ar: 'تم تحديث الموجه' },
  promptDeleted: { en: 'Prompt Deleted', ar: 'تم حذف الموجه' },
  newPulseAdded: { en: 'New pulse added to the library!', ar: 'تمت إضافة نبضة جديدة للمكتبة!' },
  pulseUpdated: { en: 'The pulse has been updated successfully!', ar: 'تم تحديث النبضة بنجاح!' },
  pulseRemoved: { en: 'The pulse has been removed from the library.', ar: 'تمت إزالة النبضة من المكتبة.' },
  missingFields: { en: 'Missing Fields', ar: 'حقول مفقودة' },
  fillRequired: { en: 'Please fill in all required fields', ar: 'يرجى ملء جميع الحقول المطلوبة' },
  failedToSave: { en: 'Failed to save prompt. Please try again.', ar: 'فشل في حفظ الموجه. حاول مرة أخرى.' },
  failedToDelete: { en: 'Failed to delete prompt. Please try again.', ar: 'فشل في حذف الموجه. حاول مرة أخرى.' },
};
