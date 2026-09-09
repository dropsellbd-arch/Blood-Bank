import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Save, 
  Calendar, 
  Heart, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  MapPin, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { User, BloodGroup, Language } from '../types';
import { calculateEligibility, RedLinkStorage } from '../services/storage';
import { BLOOD_GROUPS, BANGLADESH_DISTRICTS, getUpazilasForDistrict, t } from '../i18n';

interface DonorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  currentLang: Language;
  onProfileUpdated: (updatedUser: User) => void;
}

export const DonorProfileModal: React.FC<DonorProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentLang,
  onProfileUpdated,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(currentUser.bloodGroup || 'O+');
  const [age, setAge] = useState<number>(currentUser.age || 25);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(currentUser.gender || 'Male');
  const [district, setDistrict] = useState(currentUser.district || 'Dhaka');
  const [upazila, setUpazila] = useState(currentUser.upazila || '');
  const [city, setCity] = useState(currentUser.city || 'Dhaka');
  const [address, setAddress] = useState(currentUser.address || '');
  const [isAvailable, setIsAvailable] = useState<boolean>(currentUser.isAvailable);
  const [lastDonationDate, setLastDonationDate] = useState<string>(currentUser.lastDonationDate || '');
  const [medicalNotes, setMedicalNotes] = useState(currentUser.medicalNotes || '');
  const [photoUrl, setPhotoUrl] = useState(currentUser.photoUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const upazilas = getUpazilasForDistrict(district);

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    setUpazila('');
  };

  if (!isOpen) return null;

  const eligibility = calculateEligibility(lastDonationDate);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: User = {
      ...currentUser,
      name,
      email,
      phone,
      bloodGroup,
      age: Number(age) || undefined,
      gender,
      district,
      upazila,
      city: city || district,
      address,
      isAvailable,
      lastDonationDate: lastDonationDate || undefined,
      medicalNotes,
      photoUrl,
    };

    RedLinkStorage.saveUser(updated);
    onProfileUpdated(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-rose-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Heart className="w-4 h-4 fill-white" />
            <span>{t('profileTitle', currentLang)}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {t('editProfile', currentLang)}
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 mt-0.5">
            {currentLang === 'en'
              ? 'Keep your location and availability updated so emergency patients can reach you.'
              : 'জরুরি মুহূর্তে রোগীরা যাতে সহজে আপনার সাথে যোগাযোগ করতে পারে সেজন্য তথ্য হালনাগাদ রাখুন।'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {savedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{currentLang === 'en' ? 'Profile saved successfully!' : 'প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!'}</span>
            </div>
          )}

          {/* Photo upload section & Quick stats */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="relative">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-rose-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-rose-100 text-red-700 font-black text-2xl flex items-center justify-center">
                  {name[0] || 'U'}
                </div>
              )}
              <label
                htmlFor="profile-photo-input"
                className="absolute bottom-0 right-0 bg-slate-900 hover:bg-red-600 text-white p-1.5 rounded-full cursor-pointer shadow-md transition-colors"
                title={t('uploadPhoto', currentLang)}
              >
                <Camera className="w-4 h-4" />
                <input
                  id="profile-photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h4 className="font-bold text-slate-900 text-base">{name}</h4>
              <p className="text-xs text-slate-500">{email} • {phone}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded-full">
                  {bloodGroup}
                </span>
                {currentUser.isVerified && (
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {t('donorVerified', currentLang)}
                  </span>
                )}
                <span className="text-[11px] text-slate-500 font-medium">
                  {currentUser.totalDonations || 0} {t('totalDonationsCount', currentLang)}
                </span>
              </div>
            </div>
          </div>

          {/* Availability Toggle Switch */}
          <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-100 flex items-center justify-between gap-4">
            <div>
              <label htmlFor="avail-toggle" className="font-bold text-sm text-slate-900 flex items-center gap-2 cursor-pointer">
                <span>{t('availabilityStatus', currentLang)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  {isAvailable ? t('availableToDonate', currentLang) : t('unavailable', currentLang)}
                </span>
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('availabilityHelper', currentLang)}
              </p>
            </div>

            <input
              id="avail-toggle"
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-6 h-6 rounded-md accent-red-600 cursor-pointer"
            />
          </div>

          {/* 90-Day Cooldown & Eligibility Live Calculator */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-red-600" />
                <span>{t('eligibilityCardTitle', currentLang)} (90 Days)</span>
              </div>

              {eligibility.isEligible ? (
                <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {t('eligibleNow', currentLang)}
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-600" />
                  {t('eligibleInDays', currentLang, { days: eligibility.daysRemaining })}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {t('lastDonationDateLabel', currentLang)}
                </label>
                <input
                  type="date"
                  value={lastDonationDate}
                  onChange={(e) => setLastDonationDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  {t('nextEligible', currentLang)}
                </label>
                <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700">
                  {eligibility.nextEligibleDateStr}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal flex items-start gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{t('daysWaitNotice', currentLang)}</span>
            </p>
          </div>

          {/* Core Profile Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('fullName', currentLang)} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('phone', currentLang)} *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('bloodGroup', currentLang)} *
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              >
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('age', currentLang)}
              </label>
              <input
                type="number"
                min="18"
                max="65"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('gender', currentLang)}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              >
                <option value="Male">{t('male', currentLang)}</option>
                <option value="Female">{t('female', currentLang)}</option>
                <option value="Other">{t('other', currentLang)}</option>
              </select>
            </div>
          </div>

          {/* Location details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('district', currentLang)} *
              </label>
              <select
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              >
                {BANGLADESH_DISTRICTS.map((d) => (
                  <option key={d.en} value={d.en}>
                    {currentLang === 'en' ? d.en : d.bn} ({d.en})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('upazila', currentLang)}
              </label>
              <select
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              >
                <option value="">{t('selectUpazila', currentLang)}</option>
                {upazilas.map((u) => (
                  <option key={u.en} value={u.en}>
                    {currentLang === 'en' ? u.en : u.bn}
                  </option>
                ))}
                {upazila && !upazilas.some((u) => u.en.toLowerCase() === upazila.toLowerCase() || u.bn === upazila) && (
                  <option value={upazila}>{upazila}</option>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('address', currentLang)}
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={currentLang === 'en' ? 'Road, House, Area details' : 'বাড়ি, রোড ও এলাকা'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>

          {/* Medical Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('medicalNotes', currentLang)}
            </label>
            <textarea
              rows={2}
              value={medicalNotes}
              onChange={(e) => setMedicalNotes(e.target.value)}
              placeholder={currentLang === 'en' ? 'e.g. No chronic conditions, healthy and regular donor...' : 'শারীরিক অবস্থা, কোনো ওষুধ সেবন করছেন কিনা ইত্যাদি...'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              {currentLang === 'en' ? 'Cancel' : 'বাতিল'}
            </button>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 active:scale-98 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-red-200 flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{t('saveChanges', currentLang)}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
