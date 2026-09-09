import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  ShieldCheck, 
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { User, BloodGroup, Language } from '../types';
import { calculateEligibility } from '../services/storage';
import { BLOOD_GROUPS, BANGLADESH_DISTRICTS, t } from '../i18n';

interface DonorSearchSectionProps {
  donors: User[];
  currentLang: Language;
  initialBloodGroup?: string;
  initialDistrict?: string;
  onContactDonor: (donor: User) => void;
}

export const DonorSearchSection: React.FC<DonorSearchSectionProps> = ({
  donors,
  currentLang,
  initialBloodGroup = '',
  initialDistrict = '',
  onContactDonor,
}) => {
  const [bloodGroup, setBloodGroup] = useState<string>(initialBloodGroup);
  const [district, setDistrict] = useState<string>(initialDistrict);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [eligibleOnly, setEligibleOnly] = useState<boolean>(false);

  const resetFilters = () => {
    setBloodGroup('');
    setDistrict('');
    setSearchQuery('');
    setAvailableOnly(false);
    setEligibleOnly(false);
  };

  const filteredDonors = donors.filter((donor) => {
    // Only donors (or admins who can donate)
    if (donor.role !== 'donor' && donor.role !== 'admin') return false;
    if (donor.isBanned) return false;

    // Blood group filter
    if (bloodGroup && donor.bloodGroup !== bloodGroup) return false;

    // District filter
    if (district && donor.district.toLowerCase() !== district.toLowerCase()) return false;

    // Availability filter
    if (availableOnly && !donor.isAvailable) return false;

    // Eligibility (90-day cooldown)
    const eligibility = calculateEligibility(donor.lastDonationDate);
    if (eligibleOnly && !eligibility.isEligible) return false;

    // Free-text query filter (name, city, upazila, hospital)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = donor.name.toLowerCase().includes(q);
      const matchCity = donor.city.toLowerCase().includes(q);
      const matchUpazila = donor.upazila?.toLowerCase().includes(q) || false;
      const matchAddress = donor.address.toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchUpazila && !matchAddress) return false;
    }

    return true;
  });

  return (
    <section className="py-10 bg-slate-50 min-h-[70vh]" id="donor-search-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-bold mb-2">
            <HeartHandshake className="w-3.5 h-3.5 text-red-600" />
            <span>{t('donorSearchTitle', currentLang)}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {currentLang === 'en' ? 'Verified Voluntary Blood Donors' : 'যাচাইকৃত স্বেচ্ছাসেবী রক্তদাতাবৃন্দ'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t('donorSearchSubtitle', currentLang)}
          </p>
        </div>

        {/* Filter Controls Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Free text search */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                {currentLang === 'en' ? 'Search by Area / Name' : 'নাম বা এলাকা অনুসন্ধান'}
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={currentLang === 'en' ? 'e.g. Dhanmondi, Mirpur, Tanvir...' : 'যেমনঃ ধানমন্ডি, মিরপুর, তানভীর...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            </div>

            {/* Blood group selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                {t('bloodGroup', currentLang)}
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              >
                <option value="">{t('allBloodGroups', currentLang)}</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            {/* District selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                {t('district', currentLang)}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              >
                <option value="">{t('allDistricts', currentLang)}</option>
                {BANGLADESH_DISTRICTS.map((d) => (
                  <option key={d.en} value={d.en}>
                    {currentLang === 'en' ? d.en : d.bn}
                  </option>
                ))}
              </select>
            </div>

            {/* Checkbox Toggles & Reset */}
            <div className="flex flex-col justify-end gap-1.5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4 accent-red-600"
                />
                <span>{t('availableOnly', currentLang)}</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={eligibleOnly}
                  onChange={(e) => setEligibleOnly(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4 accent-red-600"
                />
                <span>{t('eligibleOnly', currentLang)} (90-day cooldown)</span>
              </label>
            </div>
          </div>

          {/* Active filter count & reset button */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div>
              <strong className="text-slate-900 font-bold">{filteredDonors.length}</strong> {t('matchingDonorsFound', currentLang)}
            </div>

            {(bloodGroup || district || searchQuery || availableOnly || eligibleOnly) && (
              <button
                onClick={resetFilters}
                className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('resetFilters', currentLang)}</span>
              </button>
            )}
          </div>
        </div>

        {/* Donors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-200">
              <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <div className="text-slate-800 font-bold text-base">
                {currentLang === 'en' ? 'No donors matched your filter criteria.' : 'কোনো রক্তদাতা পাওয়া যায়নি।'}
              </div>
              <p className="text-slate-500 text-xs mt-1">
                {currentLang === 'en' ? 'Try widening your search to all blood groups or neighboring districts.' : 'রক্তের গ্রুপ বা জেলা পরিবর্তন করে পুনরায় চেষ্টা করুন।'}
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 inline-flex items-center gap-1.5 bg-red-50 text-red-700 font-bold px-4 py-2 rounded-xl text-xs hover:bg-red-100 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t('resetFilters', currentLang)}
              </button>
            </div>
          ) : (
            filteredDonors.map((donor) => {
              const eligibility = calculateEligibility(donor.lastDonationDate);

              return (
                <div
                  key={donor.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Avatar, Name, Verified, Blood Group */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {donor.photoUrl ? (
                            <img
                              src={donor.photoUrl}
                              alt={donor.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-100"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-rose-100 text-red-700 font-extrabold flex items-center justify-center text-base">
                              {donor.name[0]}
                            </div>
                          )}

                          {donor.isVerified && (
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-2xs">
                              <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-1.5">
                            {donor.name}
                          </h3>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-red-500" />
                            <span>{donor.upazila ? `${donor.upazila}, ` : ''}{donor.district}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {donor.age ? `${donor.age} yrs • ` : ''}{donor.gender}
                          </div>
                        </div>
                      </div>

                      {/* Large Blood Group Badge */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white font-black text-lg flex items-center justify-center shadow-xs shrink-0">
                        {donor.bloodGroup}
                      </div>
                    </div>

                    {/* Status Badges: Available vs Unavailable & 90-Day Eligibility */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                      {/* Availability */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          donor.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${donor.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {donor.isAvailable ? t('availableToDonate', currentLang) : t('unavailable', currentLang)}
                      </span>

                      {/* 90-Day Eligibility Badge */}
                      {eligibility.isEligible ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <CheckCircle2 className="w-3 h-3 text-red-600" />
                          {t('eligibleNow', currentLang)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          {t('eligibleInDays', currentLang, { days: eligibility.daysRemaining })}
                        </span>
                      )}
                    </div>

                    {/* Details Row: Last donated & Total donations */}
                    <div className="mt-3 bg-slate-50/80 rounded-xl p-2.5 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">{t('lastDonated', currentLang)}:</span>
                        <span className="font-semibold text-slate-800">
                          {donor.lastDonationDate || t('neverDonated', currentLang)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">{currentLang === 'en' ? 'Total Donations' : 'মোট রক্তদান'}:</span>
                        <span className="font-bold text-red-600">
                          {donor.totalDonations || 0} {currentLang === 'en' ? 'times' : 'বার'}
                        </span>
                      </div>

                      {donor.medicalNotes && (
                        <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/60 truncate">
                          "{donor.medicalNotes}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button: Contact Donor */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      id={`contact-donor-${donor.id}`}
                      onClick={() => onContactDonor(donor)}
                      className="w-full bg-slate-900 hover:bg-red-600 text-white py-2.5 sm:py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs min-h-[44px] active:scale-98"
                    >
                      <Phone className="w-4 h-4 text-rose-300" />
                      <span>{t('contactDonor', currentLang)}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
