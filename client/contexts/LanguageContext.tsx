import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SupportedLanguage = 'en' | 'hi' | 'gu';

export const languages = {
  en: { name: "English", flag: "🇺🇸", nativeName: "English" },
  hi: { name: "Hindi", flag: "🇮🇳", nativeName: "हिंदी" },
  gu: { name: "Gujarati", flag: "🇮🇳", nativeName: "ગુજરાતી" },
};

export const translations = {
  en: {
    // Common
    login: "Login",
    register: "Register", 
    logout: "Logout",
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    view: "View",
    back: "Back",
    loading: "Loading...",
    
    // Navigation
    home: "Home",
    marketplace: "Marketplace", 
    orders: "Orders",
    inventory: "Inventory",
    
    // Dashboard
    welcomeBack: "Welcome back",
    findSuppliers: "Find Suppliers",
    myOrders: "My Orders",
    activeOrders: "Active Orders",
    inTransit: "In Transit",
    savedItems: "Saved Items",
    totalProducts: "Total Products",
    pendingOrders: "Pending Orders",
    monthlyRevenue: "Monthly Revenue",
    completedOrders: "Completed Orders",
    
    // Actions
    addToCart: "Add to Cart",
    viewDetails: "View Details",
    contactSupplier: "Contact Supplier",
    trackOrder: "Track Order",
    makePayment: "Make Payment",
    
    // Messages
    loginSuccess: "Login successful",
    profileUpdated: "Profile updated successfully",
    itemAdded: "Item added to cart",
  },
  
  hi: {
    // Common
    login: "लॉगिन",
    register: "पंजीकरण",
    logout: "लॉगआउट",
    dashboard: "डैशबोर्ड",
    profile: "प्रोफाइल",
    settings: "सेटिंग्स",
    save: "सेव करें",
    cancel: "रद्द करें",
    edit: "संपादित करें",
    delete: "हटाएं",
    view: "देखें",
    back: "वापस",
    loading: "लोड हो रहा है...",
    
    // Navigation
    home: "होम",
    marketplace: "मार्केटप्लेस",
    orders: "ऑर्डर",
    inventory: "इन्वेंट्री",
    
    // Dashboard
    welcomeBack: "वापसी पर स्वागत है",
    findSuppliers: "आपूर्तिकर्ता खोजें",
    myOrders: "मेरे ऑर्डर",
    activeOrders: "सक्रिय ऑर्डर",
    inTransit: "ट्रांजिट में",
    savedItems: "सेव किए गए आइटम",
    totalProducts: "कुल उत्पाद",
    pendingOrders: "लंबित ऑर्डर",
    monthlyRevenue: "मासिक आय",
    completedOrders: "पूर्ण ऑर्डर",
    
    // Actions
    addToCart: "कार्ट में जोड़ें",
    viewDetails: "विवरण देखें",
    contactSupplier: "आपूर्तिकर्ता से संपर्क करें",
    trackOrder: "ऑर्डर ट्रैक करें",
    makePayment: "भुगतान करें",
    
    // Messages
    loginSuccess: "लॉगिन सफल",
    profileUpdated: "प्रोफाइ��� सफलतापूर्वक अपडेट किया गया",
    itemAdded: "आइटम कार्ट में जोड़ा गया",
  },
  
  gu: {
    // Common
    login: "લૉગિન",
    register: "નોંધણી",
    logout: "લૉગઆઉટ",
    dashboard: "ડેશબોર્ડ",
    profile: "પ્રોફાઈલ",
    settings: "સેટિંગ્સ",
    save: "સેવ કરો",
    cancel: "રદ કરો",
    edit: "એડિટ કરો",
    delete: "ડિલીટ કરો",
    view: "જુઓ",
    back: "પાછા",
    loading: "લોડ થઈ રહ્યું છે...",
    
    // Navigation
    home: "હોમ",
    marketplace: "માર્કેટપ્લેસ",
    orders: "ઓર્ડર",
    inventory: "ઇન્વેન્ટરી",
    
    // Dashboard
    welcomeBack: "પાછા આવવા બદલ સ્વાગત",
    findSuppliers: "સપ્લાયર શોધો",
    myOrders: "મારા ઓર્ડર",
    activeOrders: "એક્ટિવ ઓર્ડર",
    inTransit: "ટ્રાન્ઝિટમાં",
    savedItems: "સેવ કરેલા આઇટમ",
    totalProducts: "કુલ પ્ર��ડક્ટ",
    pendingOrders: "પેન્ડિંગ ઓર્ડર",
    monthlyRevenue: "માસિક આવક",
    completedOrders: "પૂર્ણ ઓર્ડર",
    
    // Actions
    addToCart: "કાર્ટમાં ઉમેરો",
    viewDetails: "વિગતો જુઓ",
    contactSupplier: "સપ્લાયર સાથે સંપર્ક કરો",
    trackOrder: "ઓર્ડર ટ્રેક કરો",
    makePayment: "પેમેન્ટ કરો",
    
    // Messages
    loginSuccess: "લૉગિન સફળ",
    profileUpdated: "પ્રોફાઈલ સફળતાપૂર્વક અપડેટ થયું",
    itemAdded: "આઇટમ કાર્ટમાં ઉમેરાયું",
  },
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred_language') as SupportedLanguage;
    if (savedLanguage && languages[savedLanguage]) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('preferred_language', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key as keyof typeof translations.en] || 
           translations.en[key as keyof typeof translations.en] || 
           key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
