import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  PlusCircle, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  ShieldCheck, 
  Sparkles,
  Droplet
} from 'lucide-react';
import { BloodGroup, Language, User } from '../types';
import { BLOOD_GROUPS, BANGLADESH_DISTRICTS, t } from '../i18n';

interface HeroSectionProps {
  currentLang: Language;
  currentUser: User | null;
  totalDonors: number;
  requestsFulfilled: number;
  activeRequests: number;
  onSearch: (bloodGroup: string, district: string) => void;
  onOpenPostRequest: () => void;
  onBecomeDonor: () => void;
  onOpenCompatibilityModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  currentUser,
  totalDonors,
  requestsFulfilled,
  activeRequests,
  onSearch,
  onOpenPostRequest,
  onBecomeDonor,
  onOpenCompatibilityModal,
}) => {
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(selectedBloodGroup, selectedDistrict);
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-rose-50/70 via-white to-slate-50 border-b border-rose-100/70 pt-8 pb-14 sm:pt-12 sm:pb-20">
      {/* Background subtle decorative blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-red-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-rose-100/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200/80 text-red-700 text-xs font-bold mb-5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span>
              {currentLang === 'en' 
                ? 'Voluntary Blood Donation Network Across 64 Districts' 
                : '৬৪ জেলায় সম্পূর্ণ স্বেচ্ছাসেবী রক্তদান নেটওয়ার্ক'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            {currentLang === 'en' ? (
              <>
                Every Drop <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">Connects</span> A Life In Need
              </>
            ) : (
              <>
                প্রতিটি রক্তবিন্দুতে <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">বেঁচে থাকে</span> একটি অমূল্য প্রাণ
              </>
            )}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {t('heroSubtitle', currentLang)}
          </p>

          {/* Quick CTA Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <button
              id="hero-post-request-btn"
              onClick={onOpenPostRequest}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:scale-98 text-white px-6 py-3.5 sm:py-3 rounded-2xl sm:rounded-xl text-base font-bold shadow-lg shadow-red-200 flex items-center justify-center gap-2 transition-all min-h-[48px]"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{t('postRequest', currentLang)}</span>
            </button>

            <button
              id="hero-become-donor-btn"
              onClick={onBecomeDonor}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 active:scale-98 text-slate-800 border border-slate-200 px-6 py-3.5 sm:py-3 rounded-2xl sm:rounded-xl text-base font-bold shadow-xs flex items-center justify-center gap-2 transition-all hover:border-red-300 min-h-[48px]"
            >
              <Heart className="w-5 h-5 text-red-600 fill-red-50" />
              <span>
                {currentUser?.role === 'donor' 
                  ? (currentLang === 'en' ? 'My Donor Status' : 'আমার রক্তদাতার তথ্য')
                  : t('becomeDonor', currentLang)}
              </span>
            </button>
          </div>
        </div>

        {/* Quick Search Card Bar */}
        <div className="mt-10 sm:mt-12 max-w-4xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-rose-100 p-3 sm:p-4 sm:flex items-center gap-3"
          >
            {/* Blood group selector */}
            <div className="flex-1 min-w-[180px] mb-2 sm:mb-0">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1 flex items-center gap-1">
                <Droplet className="w-3 h-3 text-red-600" />
                {t('bloodGroupNeeded', currentLang)}
              </label>
              <select
                id="hero-blood-group-select"
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-base sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 min-h-[44px]"
              >
                <option value="">{t('allBloodGroups', currentLang)}</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg} {currentLang === 'en' ? 'Positive/Negative' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* District selector */}
            <div className="flex-1 min-w-[200px] mb-3 sm:mb-0">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 px-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-600" />
                {t('district', currentLang)}
              </label>
              <select
                id="hero-district-select"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-base sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 min-h-[44px]"
              >
                <option value="">{t('allDistricts', currentLang)}</option>
                {BANGLADESH_DISTRICTS.map((d) => (
                  <option key={d.en} value={d.en}>
                    {currentLang === 'en' ? d.en : d.bn} ({d.en})
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="sm:self-end">
              <button
                id="hero-search-donors-submit"
                type="submit"
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 sm:py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shrink-0 shadow-sm min-h-[44px] active:scale-98"
              >
                <Search className="w-4 h-4 text-red-400" />
                <span>{t('searchBtn', currentLang)}</span>
              </button>
            </div>
          </form>

          {/* Compatibility helper pill */}
          <div className="mt-3 text-center">
            <button
              onClick={onOpenCompatibilityModal}
              className="text-xs text-slate-600 hover:text-red-700 font-medium inline-flex items-center gap-1.5 transition-colors underline decoration-dotted"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              <span>{t('compatibilityTitle', currentLang)} ({currentLang === 'en' ? 'Who can donate to whom?' : 'রক্তের সামঞ্জস্য নির্দেশিকা'})</span>
            </button>
          </div>
        </div>

        {/* Live Counters / Stats Bar */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-xs border border-rose-100 rounded-2xl p-4 text-center shadow-xs">
            <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalDonors > 0 ? `${totalDonors}+` : '0'}</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">{t('totalDonors', currentLang)}</div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs border border-emerald-100 rounded-2xl p-4 text-center shadow-xs">
            <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{requestsFulfilled}</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">{t('requestsFulfilled', currentLang)}</div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs border border-rose-100 rounded-2xl p-4 text-center shadow-xs">
            <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-red-600">{activeRequests}</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">{t('activeRequests', currentLang)}</div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs border border-slate-100 rounded-2xl p-4 text-center shadow-xs">
            <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">64</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">{t('citiesCovered', currentLang)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
