import React, { useState } from 'react';
import { 
  Flame, 
  MapPin, 
  Building2, 
  Phone, 
  Clock, 
  Droplet, 
  UserCheck, 
  CheckCircle, 
  AlertTriangle,
  Send,
  Calendar
} from 'lucide-react';
import { BloodRequest, Language, User } from '../types';
import { BANGLADESH_DISTRICTS, t } from '../i18n';

interface UrgentRequestsFeedProps {
  requests: BloodRequest[];
  currentLang: Language;
  currentUser: User | null;
  onRespond: (requestId: string) => void;
  onOpenAuth: () => void;
  onSelectRequestDetails?: (request: BloodRequest) => void;
}

export const UrgentRequestsFeed: React.FC<UrgentRequestsFeedProps> = ({
  requests,
  currentLang,
  currentUser,
  onRespond,
  onOpenAuth,
  onSelectRequestDetails,
}) => {
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [filterBloodGroup, setFilterBloodGroup] = useState<string>('all');

  // Filter and sort requests (newest first)
  const filteredRequests = requests
    .filter((req) => {
      if (filterUrgency === 'critical' && req.urgency !== 'critical') return false;
      if (filterUrgency === 'urgent' && req.urgency === 'normal') return false;
      if (filterUrgency === 'fulfilled' && req.status !== 'fulfilled') return false;
      if (filterUrgency !== 'fulfilled' && req.status === 'fulfilled' && filterUrgency !== 'all') return false;

      if (filterDistrict !== 'all' && req.district.toLowerCase() !== filterDistrict.toLowerCase()) return false;
      if (filterBloodGroup !== 'all' && req.bloodGroup !== filterBloodGroup) return false;

      return true;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getUrgencyBadge = (urgency: BloodRequest['urgency']) => {
    switch (urgency) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-red-600 text-white shadow-xs animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-white" />
            {t('urgencyCritical', currentLang)}
          </span>
        );
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
            <AlertTriangle className="w-3 h-3" />
            {t('urgencyUrgent', currentLang)}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            <Clock className="w-3 h-3 text-slate-500" />
            {t('urgencyNormal', currentLang)}
          </span>
        );
    }
  };

  const getStatusBadge = (status: BloodRequest['status']) => {
    switch (status) {
      case 'fulfilled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            {t('statusFulfilled', currentLang)}
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
            {t('statusCancelled', currentLang)}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="py-12 bg-white" id="requests-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-red-600" />
              <span>{t('urgentFeedTitle', currentLang)}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentLang === 'en' ? 'Live Emergency Blood Requisitions' : 'জরুরি রক্তের লাইভ আবেদনসমূহ'}
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              {t('urgentFeedSubtitle', currentLang)}
            </p>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500 min-h-[42px]"
            >
              <option value="all">{currentLang === 'en' ? 'All Urgencies' : 'সব আবেদন'}</option>
              <option value="critical">{currentLang === 'en' ? 'Critical Emergency Only' : 'শুধুমাত্র অতি জরুরি'}</option>
              <option value="urgent">{currentLang === 'en' ? 'Urgent & Critical' : 'জরুরি ও সংকটজনক'}</option>
              <option value="fulfilled">{currentLang === 'en' ? 'Fulfilled Requests' : 'সম্পন্ন আবেদন'}</option>
            </select>

            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-red-500 min-h-[42px]"
            >
              <option value="all">{t('allDistricts', currentLang)}</option>
              {BANGLADESH_DISTRICTS.map((d) => (
                <option key={d.en} value={d.en}>
                  {currentLang === 'en' ? d.en : d.bn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Requests Feed Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
              <Droplet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <div className="text-slate-700 font-bold text-base">
                {currentLang === 'en' ? 'No blood requests found matching your filter.' : 'নির্বাচিত ফিল্টারে কোনো আবেদন পাওয়া যায়নি।'}
              </div>
              <p className="text-slate-500 text-xs mt-1">
                {currentLang === 'en' ? 'Try changing the district or urgency level above.' : 'অন্য জেলা বা ফিল্টার নির্বাচন করে দেখুন।'}
              </p>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const hasResponded = currentUser && req.responders?.some((r) => r.donorId === currentUser.id);

              return (
                <div
                  key={req.id}
                  className={`relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg flex flex-col justify-between overflow-hidden ${
                    req.urgency === 'critical'
                      ? 'border-red-300 ring-1 ring-red-500/20 shadow-xs'
                      : req.urgency === 'urgent'
                      ? 'border-amber-200 shadow-xs'
                      : 'border-slate-200 shadow-2xs'
                  }`}
                >
                  {/* Top Header Card */}
                  <div className="p-5 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      {/* Blood Group Pill */}
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex flex-col items-center justify-center font-black shadow-md shadow-red-200 shrink-0">
                        <span className="text-xl leading-none">{req.bloodGroup}</span>
                        <span className="text-[9px] uppercase font-bold tracking-wider opacity-90 mt-0.5">
                          {req.units} {currentLang === 'en' ? 'Bags' : 'ব্যাগ'}
                        </span>
                      </div>

                      {/* Urgency & Status Badges */}
                      <div className="flex flex-col items-end gap-1.5">
                        {req.status === 'open' ? getUrgencyBadge(req.urgency) : getStatusBadge(req.status)}
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Patient & Hospital Info */}
                    <div className="mt-4">
                      <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-red-600">
                        {req.patientName}
                      </h3>

                      <div className="mt-2 space-y-1.5 text-xs text-slate-600">
                        <div className="flex items-start gap-2">
                          <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <span className="font-medium text-slate-800">{req.hospitalName}</span>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span className="truncate">{req.hospitalAddress}, <strong className="text-slate-700">{req.district}</strong></span>
                        </div>

                        <div className="flex items-center gap-2 text-rose-700 font-semibold bg-rose-50/70 px-2.5 py-1 rounded-lg">
                          <Calendar className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <span>{t('neededTime', currentLang)}: {req.neededBy}</span>
                        </div>
                      </div>

                      {/* Short medical description */}
                      {req.description && (
                        <p className="mt-3 text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {req.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Responders Count bar */}
                  {req.responders && req.responders.length > 0 && (
                    <div className="px-5 py-1.5 bg-emerald-50/70 border-t border-b border-emerald-100/60 flex items-center justify-between text-xs text-emerald-800 font-medium">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {req.responders.length} {currentLang === 'en' ? 'donors responded' : 'জন রক্তদাতা সাড়া দিয়েছেন'}
                      </span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                        {req.responders[0].donorName}
                      </span>
                    </div>
                  )}

                  {/* Bottom Action Footer */}
                  <div className="p-3.5 sm:p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                    {/* Call Direct */}
                    <a
                      href={`tel:${req.contactPhone}`}
                      className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 py-2.5 sm:py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs min-h-[44px] active:scale-98"
                      title={`Call ${req.contactName}: ${req.contactPhone}`}
                    >
                      <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{req.contactPhone}</span>
                    </a>

                    {/* Respond / Donate Button */}
                    {req.status === 'open' && (
                      <button
                        onClick={() => {
                          if (!currentUser) {
                            onOpenAuth();
                          } else {
                            onRespond(req.id);
                          }
                        }}
                        disabled={hasResponded}
                        className={`flex-1 py-2.5 sm:py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs min-h-[44px] active:scale-98 ${
                          hasResponded
                            ? 'bg-emerald-100 text-emerald-800 cursor-default'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        {hasResponded ? (
                          <>
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span>{t('alreadyResponded', currentLang)}</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 shrink-0" />
                            <span>{t('respondToRequest', currentLang)}</span>
                          </>
                        )}
                      </button>
                    )}
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
