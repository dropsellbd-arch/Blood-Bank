import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Heart,
  Droplet,
  ExternalLink
} from 'lucide-react';
import { User, Language } from '../types';
import { calculateEligibility, RedLinkStorage } from '../services/storage';
import { t } from '../i18n';

interface ContactDonorModalProps {
  donor: User | null;
  currentUser: User | null;
  currentLang: Language;
  onClose: () => void;
}

export const ContactDonorModal: React.FC<ContactDonorModalProps> = ({
  donor,
  currentUser,
  currentLang,
  onClose,
}) => {
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [customMsg, setCustomMsg] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  if (!donor) return null;

  const eligibility = calculateEligibility(donor.lastDonationDate);
  const cleanPhone = donor.phone.replace(/[^0-9+]/g, '');

  const handleSendInAppAlert = (e: React.FormEvent) => {
    e.preventDefault();

    const requesterName = currentUser ? currentUser.name : 'A requester in need';
    RedLinkStorage.addNotification({
      userId: donor.id,
      title: `Blood Requisition from ${requesterName}`,
      message: `${requesterName} is requesting blood for ${patientName || 'a patient'} at ${hospitalName || 'a local hospital'}. Message: "${customMsg || 'Urgent blood needed, please reach out.'}".`,
      type: 'urgent_match',
    });

    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              {donor.photoUrl ? (
                <img
                  src={donor.photoUrl}
                  alt={donor.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-rose-400"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-rose-100 text-red-700 font-extrabold flex items-center justify-center text-xl">
                  {donor.name[0]}
                </div>
              )}
              {donor.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{donor.name}</h3>
                <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded-full">
                  {donor.bloodGroup}
                </span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>{donor.upazila ? `${donor.upazila}, ` : ''}{donor.district}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Quick status cards */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">{t('availabilityStatus', currentLang)}</span>
              <span className={`font-bold ${donor.isAvailable ? 'text-emerald-700' : 'text-slate-500'}`}>
                {donor.isAvailable ? t('availableToDonate', currentLang) : t('unavailable', currentLang)}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">{t('nextEligible', currentLang)}</span>
              <span className="font-bold text-slate-800">
                {eligibility.isEligible ? t('eligibleNow', currentLang) : eligibility.nextEligibleDateStr}
              </span>
            </div>
          </div>

          {/* Direct Communication Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${cleanPhone}`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{currentLang === 'en' ? 'Direct Phone Call' : 'সরাসরি ফোন কল'}</span>
            </a>

            <a
              href={`https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(
                currentLang === 'en'
                  ? `Hello ${donor.name}, I found your profile on RedLink Blood Donation platform. We urgently need ${donor.bloodGroup} blood.`
                  : `আসসালামু আলাইকুম ${donor.name}, রেডলিঙ্ক প্ল্যাটফর্ম থেকে আপনার তথ্য পেয়েছি। আমাদের জরুরিভিত্তিতে ${donor.bloodGroup} গ্রুপের রক্ত প্রয়োজন।`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* In-App Direct Donation Request Form */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-red-600" />
              <span>{currentLang === 'en' ? 'Send In-App Emergency Alert to Donor' : 'রক্তদাতাকে ইন-অ্যাপ জরুরি বার্তা পাঠান'}</span>
            </h4>

            {requestSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  {currentLang === 'en'
                    ? 'Emergency alert dispatched to donor! They will receive a notification immediately.'
                    : 'রক্তদাতার কাছে সফলভাবে নোটিফিকেশন পাঠানো হয়েছে!'}
                </span>
              </div>
            ) : (
              <form onSubmit={handleSendInAppAlert} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={currentLang === 'en' ? 'Patient Name' : 'রোগীর নাম'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <input
                    type="text"
                    required
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder={currentLang === 'en' ? 'Hospital / Clinic' : 'হাসপাতালের নাম'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <textarea
                  rows={2}
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder={currentLang === 'en' ? 'Short note or contact number for the donor...' : 'রক্তদাতার উদ্দেশ্যে সংক্ষিপ্ত বার্তা বা ফোন নম্বর...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                />

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{currentLang === 'en' ? 'Send Request Alert' : 'অনুরোধ বার্তা পাঠান'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
