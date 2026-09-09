import React, { useState } from 'react';
import { X, ShieldCheck, Heart, Info, ArrowRight } from 'lucide-react';
import { BloodGroup, Language } from '../types';
import { BLOOD_GROUPS, BLOOD_COMPATIBILITY, t } from '../i18n';

interface BloodCompatibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const BloodCompatibilityModal: React.FC<BloodCompatibilityModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup>('O+');

  if (!isOpen) return null;

  const info = BLOOD_COMPATIBILITY[selectedGroup];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-rose-200 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('compatibilityTitle', currentLang)}</span>
          </div>

          <h3 className="text-xl font-black">{t('compatibilityTitle', currentLang)}</h3>
          <p className="text-xs text-rose-100 mt-1 max-w-lg">
            {t('compatibilityDesc', currentLang)}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick blood type pill selector */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              {currentLang === 'en' ? 'Select Blood Group to Inspect' : 'রক্তের গ্রুপ নির্বাচন করে যাচাই করুন'}:
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setSelectedGroup(bg)}
                  className={`py-2 rounded-xl text-sm font-black transition-all ${
                    selectedGroup === bg
                      ? 'bg-red-600 text-white shadow-md shadow-red-200 scale-105 ring-2 ring-red-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Active selection compatibility card */}
          <div className="bg-rose-50/60 rounded-2xl border border-rose-100 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-black text-xl flex items-center justify-center shadow-xs">
                {selectedGroup}
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">
                  {selectedGroup} {currentLang === 'en' ? 'Blood Compatibility' : 'সামঞ্জস্য'}
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedGroup === 'O-' && (
                    <strong className="text-red-700">★ Universal Donor (সার্বজনীন দাতা)</strong>
                  )}
                  {selectedGroup === 'AB+' && (
                    <strong className="text-red-700">★ Universal Recipient (সার্বজনীন গ্রহীতা)</strong>
                  )}
                  {selectedGroup !== 'O-' && selectedGroup !== 'AB+' && (
                    <span>Rh Antigens & ABO System</span>
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Can Donate to */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
                <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-2">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('canDonateTo', currentLang)}:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {info.donateTo.map((target) => (
                    <span
                      key={target}
                      className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-xs px-2.5 py-1 rounded-lg"
                    >
                      {target}
                    </span>
                  ))}
                </div>
              </div>

              {/* Can Receive from */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
                <div className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-2">
                  <Heart className="w-3.5 h-3.5 text-rose-600" />
                  <span>{t('canReceiveFrom', currentLang)}:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {info.receiveFrom.map((src) => (
                    <span
                      key={src}
                      className="bg-rose-50 text-rose-800 border border-rose-200 font-extrabold text-xs px-2.5 py-1 rounded-lg"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              {currentLang === 'en'
                ? 'Important: In clinical emergencies, cross-matching is always conducted at the hospital blood bank before transfusion.'
                : 'জরুরি সতর্কতাঃ যেকোনো রক্ত সঞ্চালনের পূর্বে হাসপাতালের ব্লাড ব্যাংকে বাধ্যতামূলক ক্রস-ম্যাচিং ও স্ক্রিনিং পরীক্ষা নিশ্চিত করুন।'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
