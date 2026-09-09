import React from 'react';
import { Heart, Phone, Shield, Mail, Globe, MapPin } from 'lucide-react';
import { Language } from '../types';
import { t } from '../i18n';

interface FooterProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenCompatibilityModal: () => void;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onLanguageChange,
  onOpenCompatibilityModal,
  setActiveTab,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                Red<span className="text-red-500">Link</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              {currentLang === 'en'
                ? 'RedLink is a humanitarian blood donation platform dedicated to reducing emergency donor search times across all 64 districts in Bangladesh.'
                : 'রেডলিঙ্ক একটি মানবিক উদ্যোগ, যার লক্ষ্য বাংলাদেশের ৬৪টি জেলায় জরুরি মুহূর্তে রক্তের সন্ধান ও রক্তদানের সময়সীমা কমিয়ে আনা।'}
            </p>

            <div className="pt-2 text-xs text-rose-300 font-semibold flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>{t('emergencyHotline', currentLang)}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-3">
              {currentLang === 'en' ? 'Quick Navigation' : 'দ্রুত লিংক'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">
                  {t('home', currentLang)}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('donors')} className="hover:text-white transition-colors">
                  {t('findDonors', currentLang)}
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('requests')} className="hover:text-white transition-colors">
                  {t('requests', currentLang)}
                </button>
              </li>
              <li>
                <button onClick={onOpenCompatibilityModal} className="hover:text-white transition-colors">
                  {t('compatibilityTitle', currentLang)}
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-white mb-3">
              {currentLang === 'en' ? 'Emergency Info' : 'জরুরি তথ্য'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>National Emergency: <strong className="text-white">999</strong></li>
              <li>Govt. Health Line: <strong className="text-white">16263</strong></li>
              <li>Red Crescent Society: <strong className="text-white">02-9330188</strong></li>
              <li className="pt-2">
                <button
                  onClick={() => onLanguageChange(currentLang === 'en' ? 'bn' : 'en')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-red-400" />
                  <span>Language: {currentLang === 'en' ? 'বাংলা' : 'English'}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} RedLink Bangladesh. {currentLang === 'en' ? 'Voluntary blood donation platform. Free & non-profit.' : 'স্বেচ্ছাসেবী রক্তদান প্ল্যাটফর্ম। সম্পূর্ণ বিনামূল্যে সেবামূলক।'}
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified Donors & Safe Privacy</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
