import React, { useState } from 'react';
import { 
  Heart, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  UserCheck, 
  Trash2, 
  Plus, 
  Building2, 
  MapPin, 
  Phone, 
  AlertTriangle,
  User as UserIcon,
  Flame,
  FileText,
  Users
} from 'lucide-react';
import { User, BloodRequest, DonationRecord, Language } from '../types';
import { calculateEligibility, RedLinkStorage } from '../services/storage';
import { formatLocation, t } from '../i18n';

interface DashboardViewProps {
  currentUser: User;
  currentLang: Language;
  onOpenEditProfile: () => void;
  onOpenPostRequest: () => void;
  onRequestStatusChanged: () => void;
  onUserRoleOrStatusChanged: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  currentLang,
  onOpenEditProfile,
  onOpenPostRequest,
  onRequestStatusChanged,
  onUserRoleOrStatusChanged,
}) => {
  const [activeTab, setActiveTab] = useState<'donor' | 'requester' | 'admin'>(
    currentUser.role === 'admin' ? 'admin' : currentUser.role === 'donor' ? 'donor' : 'requester'
  );

  // Log donation modal state
  const [isLogDonationOpen, setIsLogDonationOpen] = useState(false);
  const [logHospital, setLogHospital] = useState('');
  const [logPatient, setLogPatient] = useState('');
  const [logUnits, setLogUnits] = useState(1);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logNotes, setLogNotes] = useState('');

  const eligibility = calculateEligibility(currentUser.lastDonationDate);
  const allRequests = RedLinkStorage.getRequests();
  const allDonations = RedLinkStorage.getDonations();
  const allUsers = RedLinkStorage.getUsers();

  // Donor view data
  const myDonationHistory = allDonations.filter((d) => d.donorId === currentUser.id);
  const myRespondedRequests = allRequests.filter((r) =>
    r.responders?.some((resp) => resp.donorId === currentUser.id)
  );

  // Requester view data
  const myPostedRequests = allRequests.filter((r) => r.requesterId === currentUser.id);

  // Handlers for requests
  const handleMarkFulfilled = (req: BloodRequest) => {
    RedLinkStorage.updateRequest({
      ...req,
      status: 'fulfilled',
    });
    onRequestStatusChanged();
  };

  const handleCancelRequest = (req: BloodRequest) => {
    RedLinkStorage.updateRequest({
      ...req,
      status: 'cancelled',
    });
    onRequestStatusChanged();
  };

  const handleDeleteRequest = (reqId: string) => {
    if (window.confirm(currentLang === 'en' ? 'Delete this request permanently?' : 'এই আবেদনটি স্থায়ীভাবে মুছে ফেলতে চান?')) {
      RedLinkStorage.deleteRequest(reqId);
      onRequestStatusChanged();
    }
  };

  // Handlers for Admin
  const handleToggleVerification = (user: User) => {
    RedLinkStorage.saveUser({
      ...user,
      isVerified: !user.isVerified,
    });
    onUserRoleOrStatusChanged();
  };

  const handleToggleBan = (user: User) => {
    RedLinkStorage.saveUser({
      ...user,
      isBanned: !user.isBanned,
    });
    onUserRoleOrStatusChanged();
  };

  const handleLogDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logHospital.trim()) return;

    RedLinkStorage.addDonation({
      donorId: currentUser.id,
      donorName: currentUser.name,
      hospitalName: logHospital,
      patientName: logPatient || undefined,
      units: Number(logUnits) || 1,
      donatedAt: logDate,
      notes: logNotes || undefined,
    });

    setIsLogDonationOpen(false);
    setLogHospital('');
    setLogPatient('');
    setLogNotes('');
    onUserRoleOrStatusChanged();
  };

  return (
    <div className="py-10 bg-slate-50 min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Profile Summary Bar */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {currentUser.photoUrl ? (
                <img
                  src={currentUser.photoUrl}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-rose-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white font-extrabold text-2xl flex items-center justify-center">
                  {currentUser.name[0]}
                </div>
              )}
              {currentUser.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{currentUser.name}</h1>
                <span className="bg-red-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                  {currentUser.bloodGroup}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>{currentUser.email}</span>
                <span>•</span>
                <span>{currentUser.phone}</span>
                <span>•</span>
                <span className="font-semibold text-slate-700">{formatLocation(currentUser.district, currentUser.upazila, currentLang)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenEditProfile}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              {t('editProfile', currentLang)}
            </button>

            <button
              onClick={onOpenPostRequest}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t('postRequest', currentLang)}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('donor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
              activeTab === 'donor'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{t('donorDashboard', currentLang)}</span>
          </button>

          <button
            onClick={() => setActiveTab('requester')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
              activeTab === 'requester'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t('requesterDashboard', currentLang)}</span>
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                activeTab === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
              <span>{t('adminDashboard', currentLang)}</span>
            </button>
          )}
        </div>

        {/* 1. DONOR DASHBOARD VIEW */}
        {activeTab === 'donor' && (
          <div className="space-y-8">
            {/* Eligibility & Cooldown Status Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cooldown Ring/Badge Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {t('eligibilityCardTitle', currentLang)}
                    </span>
                    <Clock className="w-4 h-4 text-red-600" />
                  </div>

                  <div className="mt-4">
                    {eligibility.isEligible ? (
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          {t('eligibleNow', currentLang)}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          {currentLang === 'en'
                            ? 'You are physically ready to donate blood and save lives today.'
                            : 'আপনি যেকোনো জরুরি মুহূর্তে রক্তদানের জন্য প্রস্তুত।'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                          <Clock className="w-4 h-4 text-amber-600" />
                          {t('eligibleInDays', currentLang, { days: eligibility.daysRemaining })}
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          {currentLang === 'en'
                            ? `Cooldown ends on ${eligibility.nextEligibleDateStr}.`
                            : `পরবর্তী রক্তদানের সম্ভাব্য তারিখঃ ${eligibility.nextEligibleDateStr}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>{t('lastDonated', currentLang)}:</span>
                    <strong className="text-slate-800">{currentUser.lastDonationDate || t('neverDonated', currentLang)}</strong>
                  </div>
                </div>
              </div>

              {/* Total Donations Counter */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {currentLang === 'en' ? 'Lifetime Donations' : 'মোট রক্তদান'}
                    </span>
                    <Heart className="w-4 h-4 text-red-600 fill-red-100" />
                  </div>
                  <div className="mt-4 text-3xl sm:text-4xl font-black text-slate-900">
                    {currentUser.totalDonations || 0}
                    <span className="text-sm font-semibold text-slate-500 ml-1">
                      {currentLang === 'en' ? 'Bags' : 'ব্যাগ'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentLang === 'en'
                      ? `Estimated ${(currentUser.totalDonations || 0) * 3} lives directly impacted.`
                      : `আনুমানিক ${(currentUser.totalDonations || 0) * 3} টি জীবন সরাসরি উপকৃত হয়েছে।`}
                  </p>
                </div>

                <button
                  onClick={() => setIsLogDonationOpen(true)}
                  className="mt-4 w-full bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold py-2 rounded-xl border border-rose-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('logDonationBtn', currentLang)}</span>
                </button>
              </div>

              {/* Donor Availability Switch */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {t('availabilityStatus', currentLang)}
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${currentUser.isAvailable ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`} />
                  </div>
                  <div className="mt-4">
                    <span className={`text-base font-extrabold ${currentUser.isAvailable ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {currentUser.isAvailable ? t('availableToDonate', currentLang) : t('unavailable', currentLang)}
                    </span>
                    <p className="text-xs text-slate-500 mt-1">
                      {currentUser.isAvailable
                        ? (currentLang === 'en' ? 'Your profile appears in active searches.' : 'সার্চ তালিকায় আপনার নাম দৃশ্যমান আছে।')
                        : (currentLang === 'en' ? 'Hidden from search results while resting.' : 'বর্তমানে সার্চ তালিকায় প্রদর্শিত হচ্ছে না।')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const updated = { ...currentUser, isAvailable: !currentUser.isAvailable };
                    RedLinkStorage.saveUser(updated);
                    onUserRoleOrStatusChanged();
                  }}
                  className={`mt-4 w-full text-xs font-bold py-2 rounded-xl transition-colors ${
                    currentUser.isAvailable
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {currentUser.isAvailable ? 'Toggle OFF' : 'Toggle ON (Available)'}
                </button>
              </div>
            </div>

            {/* Donation History Table */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <span>{t('myDonationHistory', currentLang)}</span>
                </h3>

                <button
                  onClick={() => setIsLogDonationOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('logDonationBtn', currentLang)}</span>
                </button>
              </div>

              {myDonationHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  {currentLang === 'en' ? 'No past donation records logged yet. Click "+ Log a Donation" to add.' : 'এখনো কোনো রক্তদানের রেকর্ড যোগ করা হয়নি।'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px]">
                        <th className="pb-3">{currentLang === 'en' ? 'Date' : 'তারিখ'}</th>
                        <th className="pb-3">{t('hospital', currentLang)}</th>
                        <th className="pb-3">{t('patient', currentLang)}</th>
                        <th className="pb-3">{t('units', currentLang)}</th>
                        <th className="pb-3">{currentLang === 'en' ? 'Notes' : 'মন্তব্য'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {myDonationHistory.map((rec) => (
                        <tr key={rec.id} className="text-slate-700">
                          <td className="py-3 font-semibold text-slate-900">{rec.donatedAt}</td>
                          <td className="py-3">{rec.hospitalName}</td>
                          <td className="py-3">{rec.patientName || '—'}</td>
                          <td className="py-3 font-bold text-red-600">{rec.units} bag</td>
                          <td className="py-3 text-slate-500 italic max-w-xs truncate">{rec.notes || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Requests I Responded To */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs">
              <h3 className="font-extrabold text-base text-slate-900 mb-4 flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-600" />
                <span>{t('myRespondedRequests', currentLang)} ({myRespondedRequests.length})</span>
              </h3>

              {myRespondedRequests.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  {t('noResponsesYet', currentLang)}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myRespondedRequests.map((req) => (
                    <div key={req.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{req.patientName}</span>
                        <span className="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full">
                          {req.bloodGroup} • {req.units} bag
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {req.hospitalName}, {formatLocation(req.district, req.upazila, currentLang)}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className={`capitalize font-bold ${req.status === 'fulfilled' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          Status: {req.status}
                        </span>
                        <a
                          href={`tel:${req.contactPhone}`}
                          className="text-red-600 font-bold hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{req.contactPhone}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. REQUESTER DASHBOARD VIEW */}
        {activeTab === 'requester' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">
                {t('myPostedRequests', currentLang)} ({myPostedRequests.length})
              </h3>
              <button
                onClick={onOpenPostRequest}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('postRequest', currentLang)}</span>
              </button>
            </div>

            {myPostedRequests.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 text-base">{t('noRequestsYet', currentLang)}</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {currentLang === 'en'
                    ? 'Whenever you or a relative requires blood, click "+ Request Blood" to immediately alert voluntary donors.'
                    : 'প্রয়োজনে যে কোনো সময় রক্তের আবেদন করতে "+ রক্তের আবেদন করুন" বাটনে চাপুন।'}
                </p>
                <button
                  onClick={onOpenPostRequest}
                  className="mt-4 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  {t('postRequest', currentLang)}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myPostedRequests.map((req) => (
                  <div key={req.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-base text-slate-900">{req.patientName}</span>
                          <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded-full">
                            {req.bloodGroup}
                          </span>
                          <span className={`text-[11px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            req.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {req.hospitalName} • {req.hospitalAddress}, {formatLocation(req.district, req.upazila, currentLang)}
                        </div>
                      </div>

                      {/* Status Management Actions */}
                      <div className="flex items-center gap-2">
                        {req.status === 'open' && (
                          <>
                            <button
                              onClick={() => handleMarkFulfilled(req)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{t('markFulfilled', currentLang)}</span>
                            </button>
                            <button
                              onClick={() => handleCancelRequest(req)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                            >
                              {t('cancelRequest', currentLang)}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteRequest(req.id)}
                          className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Responders Section */}
                    <div className="mt-4">
                      <div className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        <span>{t('respondersCount', currentLang)} ({req.responders?.length || 0})</span>
                      </div>

                      {req.responders && req.responders.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {req.responders.map((resp, i) => (
                            <div key={i} className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900">{resp.donorName} ({resp.donorBloodGroup})</span>
                                <a
                                  href={`tel:${resp.phone}`}
                                  className="bg-emerald-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{resp.phone}</span>
                                </a>
                              </div>
                              {resp.message && (
                                <p className="text-slate-600 text-[11px] mt-1 italic">
                                  "{resp.message}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl">
                          {t('noResponsesYet', currentLang)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. ADMIN DASHBOARD VIEW */}
        {activeTab === 'admin' && currentUser.role === 'admin' && (
          <div className="space-y-8">
            {/* Admin Overview stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="text-xs font-bold text-slate-500 uppercase">{t('totalDonors', currentLang)}</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{allUsers.length}</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="text-xs font-bold text-slate-500 uppercase">{currentLang === 'en' ? 'All Blood Requests' : 'মোট রক্তের আবেদন'}</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{allRequests.length}</div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="text-xs font-bold text-slate-500 uppercase">{t('requestsFulfilled', currentLang)}</div>
                <div className="text-2xl font-black text-emerald-600 mt-1">
                  {allRequests.filter((r) => r.status === 'fulfilled').length}
                </div>
              </div>
            </div>

            {/* Manage Users Table */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs">
              <h3 className="font-extrabold text-base text-slate-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-red-600" />
                <span>{t('manageUsers', currentLang)} ({allUsers.length})</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px]">
                      <th className="pb-3">{t('fullName', currentLang)}</th>
                      <th className="pb-3">{t('userRole', currentLang)}</th>
                      <th className="pb-3">{t('bloodGroup', currentLang)}</th>
                      <th className="pb-3">{t('district', currentLang)}</th>
                      <th className="pb-3">{currentLang === 'en' ? 'Status' : 'অবস্থা'}</th>
                      <th className="pb-3 text-right">{currentLang === 'en' ? 'Actions' : 'অ্যাকশন'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allUsers.map((u) => (
                      <tr key={u.id} className="text-slate-700">
                        <td className="py-3">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            {u.name}
                            {u.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                          <div className="text-[11px] text-slate-400">{u.email} • {u.phone}</div>
                        </td>
                        <td className="py-3">
                          <span className="capitalize px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 font-bold text-red-600">{u.bloodGroup}</td>
                        <td className="py-3">{formatLocation(u.district, u.upazila, currentLang)}</td>
                        <td className="py-3">
                          {u.isBanned ? (
                            <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full text-[10px]">
                              Suspended
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                              Active
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => handleToggleVerification(u)}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            {u.isVerified ? t('unverifyDonor', currentLang) : t('verifyDonor', currentLang)}
                          </button>
                          <button
                            onClick={() => handleToggleBan(u)}
                            className="text-xs font-bold text-rose-600 hover:underline"
                          >
                            {u.isBanned ? t('unbanUser', currentLang) : t('banUser', currentLang)}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Manage Requests Table */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs">
              <h3 className="font-extrabold text-base text-slate-900 mb-4 flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-600" />
                <span>{t('manageRequests', currentLang)} ({allRequests.length})</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px]">
                      <th className="pb-3">{t('patient', currentLang)}</th>
                      <th className="pb-3">{t('hospital', currentLang)}</th>
                      <th className="pb-3">{t('bloodGroup', currentLang)}</th>
                      <th className="pb-3">{t('urgencyLevel', currentLang)}</th>
                      <th className="pb-3">{currentLang === 'en' ? 'Status' : 'অবস্থা'}</th>
                      <th className="pb-3 text-right">{currentLang === 'en' ? 'Actions' : 'অ্যাকশন'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allRequests.map((r) => (
                      <tr key={r.id} className="text-slate-700">
                        <td className="py-3 font-bold text-slate-900">{r.patientName}</td>
                        <td className="py-3">{r.hospitalName}, {formatLocation(r.district, r.upazila, currentLang)}</td>
                        <td className="py-3 font-bold text-red-600">{r.bloodGroup} ({r.units}u)</td>
                        <td className="py-3 capitalize">{r.urgency}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            r.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteRequest(r.id)}
                            className="text-xs font-bold text-rose-600 hover:text-rose-800"
                          >
                            {t('deleteRequest', currentLang)}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Log Donation Record */}
        {isLogDonationOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  <span>{t('logDonationBtn', currentLang)}</span>
                </h3>
                <button onClick={() => setIsLogDonationOpen(false)} className="text-slate-400 hover:text-slate-600">
                  ✕
                </button>
              </div>

              <form onSubmit={handleLogDonationSubmit} className="space-y-3 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('hospitalName', currentLang)} *</label>
                  <input
                    type="text"
                    required
                    value={logHospital}
                    onChange={(e) => setLogHospital(e.target.value)}
                    placeholder="e.g. DMCH, Evercare, CMCH..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('patientName', currentLang)}</label>
                    <input
                      type="text"
                      value={logPatient}
                      onChange={(e) => setLogPatient(e.target.value)}
                      placeholder="Optional"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('units', currentLang)}</label>
                    <input
                      type="number"
                      min="1"
                      value={logUnits}
                      onChange={(e) => setLogUnits(parseInt(e.target.value) || 1)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Donation *</label>
                  <input
                    type="date"
                    required
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Certificate ID</label>
                  <input
                    type="text"
                    value={logNotes}
                    onChange={(e) => setLogNotes(e.target.value)}
                    placeholder="Voluntary donation"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsLogDonationOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
