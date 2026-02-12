import React, { createContext, useContext, useState, useCallback } from 'react';

type Language = 'en' | 'bn';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // App
  'app.name': { en: 'AgroSmart Assistant', bn: 'এগ্রোস্মার্ট সহকারী' },
  'app.tagline': { en: 'Smart Farming, Better Harvest', bn: 'স্মার্ট চাষ, ভালো ফসল' },

  // Navigation
  'nav.dashboard': { en: 'Dashboard', bn: 'ড্যাশবোর্ড' },
  'nav.weather': { en: 'Weather', bn: 'আবহাওয়া' },
  'nav.sensors': { en: 'Sensors', bn: 'সেন্সর' },
  'nav.crops': { en: 'Crops', bn: 'ফসল' },
  'nav.settings': { en: 'Settings', bn: 'সেটিংস' },
  'nav.alerts': { en: 'Alerts', bn: 'সতর্কতা' },
  'nav.irrigation': { en: 'Irrigation', bn: 'সেচ' },

  // Dashboard
  'dashboard.greeting': { en: 'Good Morning, Farmer!', bn: 'সুপ্রভাত, কৃষক!' },
  'dashboard.today': { en: "Today's Overview", bn: 'আজকের সারসংক্ষেপ' },
  'dashboard.weather': { en: 'Weather', bn: 'আবহাওয়া' },
  'dashboard.soil': { en: 'Soil Moisture', bn: 'মাটির আর্দ্রতা' },
  'dashboard.water': { en: 'Water Needed', bn: 'পানি প্রয়োজন' },
  'dashboard.tasks': { en: "Today's Tasks", bn: 'আজকের কাজ' },
  'dashboard.voice.hint': { en: 'Tap mic to ask anything', bn: 'যেকোনো কিছু জিজ্ঞাসা করতে মাইকে ট্যাপ করুন' },
  'dashboard.listen': { en: 'Listen to Summary', bn: 'সারাংশ শুনুন' },

  // Weather
  'weather.title': { en: 'Weather Forecast', bn: 'আবহাওয়ার পূর্বাভাস' },
  'weather.temp': { en: 'Temperature', bn: 'তাপমাত্রা' },
  'weather.humidity': { en: 'Humidity', bn: 'আর্দ্রতা' },
  'weather.rain': { en: 'Rain Chance', bn: 'বৃষ্টির সম্ভাবনা' },
  'weather.wind': { en: 'Wind Speed', bn: 'বাতাসের গতি' },
  'weather.uv': { en: 'UV Index', bn: 'ইউভি সূচক' },
  'weather.forecast': { en: '7-Day Forecast', bn: '৭ দিনের পূর্বাভাস' },
  'weather.advice': { en: 'Weather Advice', bn: 'আবহাওয়া পরামর্শ' },
  'weather.advice.text': { en: 'Moderate rain expected tomorrow. Consider postponing fertilizer application.', bn: 'আগামীকাল মাঝারি বৃষ্টির সম্ভাবনা। সার প্রয়োগ স্থগিত রাখুন।' },

  // Sensors
  'sensors.title': { en: 'Sensor Monitoring', bn: 'সেন্সর পর্যবেক্ষণ' },
  'sensors.soil.moisture': { en: 'Soil Moisture', bn: 'মাটির আর্দ্রতা' },
  'sensors.soil.temp': { en: 'Soil Temperature', bn: 'মাটির তাপমাত্রা' },
  'sensors.air.temp': { en: 'Air Temperature', bn: 'বায়ু তাপমাত্রা' },
  'sensors.humidity': { en: 'Air Humidity', bn: 'বায়ু আর্দ্রতা' },
  'sensors.rain': { en: 'Rain Detection', bn: 'বৃষ্টি শনাক্তকরণ' },
  'sensors.light': { en: 'Light Intensity', bn: 'আলোর তীব্রতা' },
  'sensors.status': { en: 'Sensor Status', bn: 'সেন্সরের অবস্থা' },
  'sensors.online': { en: 'Online', bn: 'অনলাইন' },
  'sensors.offline': { en: 'Offline', bn: 'অফলাইন' },
  'sensors.lastUpdate': { en: 'Last updated', bn: 'সর্বশেষ আপডেট' },
  'sensors.minutes.ago': { en: 'min ago', bn: 'মিনিট আগে' },

  // Irrigation
  'irrigation.title': { en: 'Irrigation Calculator', bn: 'সেচ ক্যালকুলেটর' },
  'irrigation.needed': { en: 'Water Required', bn: 'পানি প্রয়োজন' },
  'irrigation.liters': { en: 'liters/decimal', bn: 'লিটার/শতাংশ' },
  'irrigation.noNeed': { en: 'No irrigation needed today!', bn: 'আজ সেচের প্রয়োজন নেই!' },
  'irrigation.warning': { en: 'Overwatering Warning!', bn: 'অতিরিক্ত পানি দেওয়ার সতর্কতা!' },
  'irrigation.schedule': { en: 'Irrigation Schedule', bn: 'সেচের সময়সূচি' },
  'irrigation.morning': { en: 'Morning (6-8 AM)', bn: 'সকাল (৬-৮ টা)' },
  'irrigation.evening': { en: 'Evening (5-6 PM)', bn: 'বিকেল (৫-৬ টা)' },

  // Crops
  'crops.title': { en: 'Crop Management', bn: 'ফসল ব্যবস্থাপনা' },
  'crops.select': { en: 'Select Your Crop', bn: 'আপনার ফসল নির্বাচন করুন' },
  'crops.rice': { en: 'Rice', bn: 'ধান' },
  'crops.wheat': { en: 'Wheat', bn: 'গম' },
  'crops.corn': { en: 'Corn', bn: 'ভুট্টা' },
  'crops.vegetables': { en: 'Vegetables', bn: 'সবজি' },
  'crops.custom': { en: 'Custom Crop', bn: 'কাস্টম ফসল' },
  'crops.stage': { en: 'Growth Stage', bn: 'বৃদ্ধির পর্যায়' },
  'crops.fertilizer': { en: 'Fertilizer Reminder', bn: 'সার প্রয়োগের অনুস্মারক' },
  'crops.disease': { en: 'Disease Risk', bn: 'রোগের ঝুঁকি' },
  'crops.harvest': { en: 'Harvest Prediction', bn: 'ফসল কাটার পূর্বাভাস' },
  'crops.days': { en: 'days', bn: 'দিন' },

  // Alerts
  'alerts.title': { en: 'Emergency Alerts', bn: 'জরুরি সতর্কতা' },
  'alerts.flood': { en: 'Flood Warning', bn: 'বন্যা সতর্কতা' },
  'alerts.storm': { en: 'Storm Alert', bn: 'ঝড়ের সতর্কতা' },
  'alerts.drought': { en: 'Drought Risk', bn: 'খরার ঝুঁকি' },
  'alerts.heatwave': { en: 'Heatwave Alert', bn: 'তাপপ্রবাহ সতর্কতা' },
  'alerts.none': { en: 'No active alerts', bn: 'কোনো সক্রিয় সতর্কতা নেই' },
  'alerts.disease': { en: 'Disease Alert', bn: 'রোগ সতর্কতা' },
  'alerts.disease.desc': { en: 'High humidity increases blast disease risk for rice. Apply fungicide.', bn: 'উচ্চ আর্দ্রতায় ধানের ব্লাস্ট রোগের ঝুঁকি বেড়েছে। ছত্রাকনাশক দিন।' },

  // Settings
  'settings.title': { en: 'Settings', bn: 'সেটিংস' },
  'settings.language': { en: 'Language', bn: 'ভাষা' },
  'settings.english': { en: 'English', bn: 'ইংরেজি' },
  'settings.bangla': { en: 'Bangla', bn: 'বাংলা' },
  'settings.notifications': { en: 'Notifications', bn: 'বিজ্ঞপ্তি' },
  'settings.voice': { en: 'Voice Alerts', bn: 'ভয়েস সতর্কতা' },
  'settings.offline': { en: 'Offline Mode', bn: 'অফলাইন মোড' },
  'settings.profile': { en: 'Farmer Profile', bn: 'কৃষক প্রোফাইল' },
  'settings.about': { en: 'About', bn: 'সম্পর্কে' },

  // Common
  'common.today': { en: 'Today', bn: 'আজ' },
  'common.ok': { en: 'OK', bn: 'ঠিক আছে' },
  'common.cancel': { en: 'Cancel', bn: 'বাতিল' },
  'common.low': { en: 'Low', bn: 'কম' },
  'common.medium': { en: 'Medium', bn: 'মাঝারি' },
  'common.high': { en: 'High', bn: 'বেশি' },
  'common.good': { en: 'Good', bn: 'ভালো' },
  'common.active': { en: 'Active', bn: 'সক্রিয়' },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('agrosmart-lang') as Language) || 'en';
  });

  const handleSetLang = useCallback((newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('agrosmart-lang', newLang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[key]?.[lang] || key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
};
