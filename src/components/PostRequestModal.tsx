import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Building2, 
  MapPin, 
  Phone, 
  User as UserIcon, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Users,
  Flame,
  Send
} from 'lucide-react';
import { BloodGroup, UrgencyLevel, BloodRequest, Language, User } from '../types';
import { RedLinkStorage } from '../services/storage';
import { BLOOD_GROUPS, BANGLADESH_DISTRICTS, getUpazilasForDistrict, formatLocation, t } from '../i18n';

interface PostRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  currentLang: Language;
  onOpenAuth: () => void;
  onRequestCreated: (newRequest: BloodRequest) => void;
}

export const PostRequestModal: React.FC<PostRequestModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentLang,
  onOpenAuth,
  onRequestCreated,
}) => {
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [units, setUnits] = useState<number>(1);
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [district, setDistrict] = useState<string>('Dhaka');
  const [upazila, setUpazila] = useState<string>('');
  const [city, setCity] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('urgent');
  const [neededBy, setNeededBy] = useState('');
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const upazilas = getUpazilasForDistrict(district);

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    setUpazila('');
  };
  
  // Post-submission matching donors modal view
  const [createdRequest, setCreatedRequest] = useState<BloodRequest | null>(null);
  const [matchingDonors, setMatchingDonors] = useState<User[]>([]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!patientName.trim()) {
      setErrorMsg(currentLang === 'en' ? 'Please enter the patient name' : 'দয়া করে রোগীর নাম লিখুন');
      return;
    }
    if (!hospitalName.trim()) {
      setErrorMsg(currentLang === 'en' ? 'Please specify the hospital name' : 'হাসপাতালের নাম লিখুন');
      return;
    }
    if (!contactPhone.trim()) {
      setErrorMsg(currentLang === 'en' ? 'Contact phone number is required' : 'যোগাযোগের মোবাইল নম্বর প্রদান করুন');
      return;
    }

    const requesterId = currentUser ? currentUser.id : `guest_${Date.now()}`;
    const requesterName = currentUser ? currentUser.name : contactName || 'Guest Requester';

    const newReq = RedLinkStorage.createRequest({
      requesterId,
      requesterName,
      requesterPhone: contactPhone,
      patientName,
      bloodGroup,
      units: Number(units) || 1,
      hospitalName,
      hospitalAddress: hospitalAddress || hospitalName,
      district,
      upazila: upazila || undefined,
      city: upazila || city || district,
      neededBy: neededBy || (urgency === 'critical' ? 'Immediately within 2-4 hours' : 'Within 24 hours'),
      urgency,
      contactName: contactName || requesterName,
      contactPhone,
      description,
      status: 'open',
    });

    // Auto-suggest matching donors (prioritizing same upazila)
    const matched = RedLinkStorage.getMatchingDonors(bloodGroup, district, upazila);
    setMatchingDonors(matched);
    setCreatedRequest(newReq);
    onRequestCreated(newReq);
  };

  const handleCloseAndReset = () => {
    setCreatedRequest(null);
    setMatchingDonors([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden my-8">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 relative">
          <button
            onClick={handleCloseAndReset}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-rose-200 text-xs font-bold uppercase tracking-wider mb-1">
            <PlusCircle className="w-4 h-4" />
            <span>{t('createRequestTitle', currentLang)}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            {currentLang === 'en' ? 'Create Urgent Blood Requisition' : 'রক্তের জরুরি আবেদন প্রকাশ করুন'}
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-lg">
            {t('createRequestSubtitle', currentLang)}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {/* Post-submission matched donors view */}
          {createdRequest ? (
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-900 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg">
                  {currentLang === 'en' ? 'Blood Request Published Successfully!' : 'আবেদনটি সফলভাবে প্রকাশ করা হয়েছে!'}
                </h3>
                <p className="text-xs text-emerald-700 mt-1 max-w-md mx-auto">
                  {currentLang === 'en' 
                    ? `Your request for ${createdRequest.units} bag(s) of ${createdRequest.bloodGroup} at ${createdRequest.hospitalName} is live on the emergency feed.` 
                    : `${createdRequest.hospitalName}-এ ${createdRequest.bloodGroup} গ্রুপের ${createdRequest.units} ব্যাগ রক্তের আবেদনটি লাইভ ফিডে যুক্ত হয়েছে।`}
                </p>
              </div>

              {/* Auto-suggest matching donors section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-600" />
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {t('autoSuggestTitle', currentLang)} ({matchingDonors.length})
                    </h4>
                  </div>
                  <span className="text-xs font-semibold text-rose-600">
                    {createdRequest.bloodGroup} • {formatLocation(createdRequest.district, createdRequest.upazila, currentLang)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  {t('autoSuggestDesc', currentLang)}
                </p>

                {matchingDonors.length === 0 ? (
                  <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                    {currentLang === 'en'
                      ? 'No available donors currently registered in this exact district. Your request is visible publicly to all volunteers nationwide.'
                      : 'এই মুহূর্তে এই নির্দিষ্ট জেলায় সরাসরি কোনো প্রস্তুত রক্তদাতা পাওয়া যায়নি। আপনার আবেদনটি সারাদেশের সকল স্বেচ্ছাসেবীর জন্য ফিডে উন্মুক্ত করা হয়েছে।'}
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {matchingDonors.map((donor) => (
                      <div
                        key={donor.id}
                        className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-2xs hover:border-red-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 font-bold flex items-center justify-center text-sm shrink-0">
                            {donor.bloodGroup}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              {donor.name}
                              {donor.isAvailable && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {formatLocation(donor.district, donor.upazila, currentLang)} • {donor.totalDonations} donations
                            </div>
                          </div>
                        </div>

                        <a
                          href={`tel:${donor.phone}`}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shrink-0"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{currentLang === 'en' ? 'Call Donor' : 'কল করুন'}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleCloseAndReset}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors"
                >
                  {currentLang === 'en' ? 'Done & View Feed' : 'সম্পন্ন ও ফিড দেখুন'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Patient Name & Units Required */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('patientName', currentLang)} *
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={currentLang === 'en' ? 'e.g. Rafiqul Islam' : 'যেমনঃ রফিকুল ইসলাম'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('units', currentLang)} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={units}
                    onChange={(e) => setUnits(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Blood Group & Urgency Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('bloodGroupNeeded', currentLang)} *
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {BLOOD_GROUPS.map((bg) => (
                      <button
                        type="button"
                        key={bg}
                        onClick={() => setBloodGroup(bg)}
                        className={`py-1.5 rounded-lg text-xs font-black transition-all ${
                          bloodGroup === bg
                            ? 'bg-red-600 text-white shadow-xs scale-102'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('urgencyLevel', currentLang)} *
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setUrgency('normal')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                        urgency === 'normal'
                          ? 'bg-slate-800 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t('urgencyNormal', currentLang)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrgency('urgent')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                        urgency === 'urgent'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t('urgencyUrgent', currentLang)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setUrgency('critical')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                        urgency === 'critical'
                          ? 'bg-red-600 text-white shadow-xs animate-pulse'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t('urgencyCritical', currentLang)}
                    </button>
                  </div>
                </div>
              </div>

              {/* Hospital Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('hospitalName', currentLang)} *
                </label>
                <input
                  type="text"
                  required
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  placeholder={currentLang === 'en' ? 'e.g. Dhaka Medical College Hospital' : 'যেমনঃ ঢাকা মেডিকেল কলেজ হাসপাতাল'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>

              {/* District & Upazila */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  </select>
                </div>
              </div>

              {/* Hospital Address & Needed by Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('hospitalAddress', currentLang)}
                  </label>
                  <input
                    type="text"
                    value={hospitalAddress}
                    onChange={(e) => setHospitalAddress(e.target.value)}
                    placeholder={currentLang === 'en' ? 'Ward/Cabin/Floor details' : 'কেবিন নং / ওয়ার্ড / ফ্লোর'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('requiredDateTime', currentLang)} *
                  </label>
                  <input
                    type="text"
                    required
                    value={neededBy}
                    onChange={(e) => setNeededBy(e.target.value)}
                    placeholder={currentLang === 'en' ? 'e.g. Today by 4 PM / Tomorrow morning' : 'যেমনঃ আজ বিকেল ৪টা / কাল সকাল ১০টা'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('contactPersonName', currentLang)} *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder={currentLang === 'en' ? 'Attendant name' : 'অভিভাবক বা যোগাযোগকারীর নাম'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('contactPhone', currentLang)} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+880 17XXXXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Medical reason / Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('reasonDescription', currentLang)}
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={currentLang === 'en' ? 'e.g. Surgery, Accident, Thalassemia, C-Section...' : 'যেমনঃ জরুরি অপারেশন, দুর্ঘটনা, থ্যালাসেমিয়া, সিজারিয়ান...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseAndReset}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {currentLang === 'en' ? 'Cancel' : 'বাতিল'}
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 active:scale-98 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-red-200 flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('submitRequestBtn', currentLang)}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
