import React from 'react';
import { 
  Home, 
  Search, 
  Plus, 
  Flame, 
  User as UserIcon, 
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { User, Language } from '../types';
import { t } from '../i18n';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  currentLang: Language;
  onOpenPostRequest: () => void;
  onOpenAuth: (tab?: 'login' | 'signup') => void;
  activeRequestsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  currentLang,
  onOpenPostRequest,
  onOpenAuth,
  activeRequestsCount = 0,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.07)] px-2 py-1.5 transition-transform duration-300">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center relative">
        {/* 1. Home */}
        <button
          id="mobile-nav-home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'home'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Go to Home"
        >
          <div className="relative">
            <Home className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {activeTab === 'home' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-600 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight truncate max-w-[56px]">
            {t('mobileHome', currentLang)}
          </span>
        </button>

        {/* 2. Find Donors */}
        <button
          id="mobile-nav-donors"
          onClick={() => setActiveTab('donors')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'donors'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="Search Donors"
        >
          <div className="relative">
            <Search className={`w-5 h-5 transition-transform ${activeTab === 'donors' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {activeTab === 'donors' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-600 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight truncate max-w-[56px]">
            {t('mobileDonors', currentLang)}
          </span>
        </button>

        {/* 3. Center Elevated Action Button (FAB): Request Blood */}
        <div className="flex flex-col items-center justify-center -mt-6">
          <button
            id="mobile-nav-post-fab"
            onClick={onOpenPostRequest}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 text-white shadow-lg shadow-red-500/35 ring-4 ring-white active:scale-92 hover:scale-105 transition-all flex items-center justify-center group"
            aria-label="Post Blood Request"
          >
            <Plus className="w-6 h-6 stroke-[2.8] text-white transition-transform group-hover:rotate-90 duration-200" />
          </button>
          <span className="text-[10px] font-extrabold text-red-600 mt-1 tracking-tight truncate">
            {t('mobilePost', currentLang)}
          </span>
        </div>

        {/* 4. Urgent Requests Feed */}
        <button
          id="mobile-nav-requests"
          onClick={() => setActiveTab('requests')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'requests'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="View Urgent Requests"
        >
          <div className="relative">
            <Flame className={`w-5 h-5 transition-transform ${activeTab === 'requests' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {activeRequestsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                {activeRequestsCount}
              </span>
            )}
            {activeTab === 'requests' && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-600 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight truncate max-w-[56px]">
            {t('mobileRequests', currentLang)}
          </span>
        </button>

        {/* 5. Dashboard / Profile / Auth */}
        <button
          id="mobile-nav-profile"
          onClick={() => {
            if (!currentUser) {
              onOpenAuth('login');
            } else {
              setActiveTab(currentUser.role === 'admin' ? 'admin' : 'dashboard');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all active:scale-95 ${
            activeTab === 'dashboard' || activeTab === 'admin'
              ? 'text-red-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-label="View Profile or Dashboard"
        >
          <div className="relative">
            {currentUser?.photoUrl ? (
              <img
                src={currentUser.photoUrl}
                alt={currentUser.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-red-400"
              />
            ) : currentUser?.role === 'admin' ? (
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            ) : (
              <UserIcon className={`w-5 h-5 transition-transform ${activeTab === 'dashboard' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
            )}
            {(activeTab === 'dashboard' || activeTab === 'admin') && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-600 rounded-full" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight truncate max-w-[56px]">
            {currentUser 
              ? (currentUser.role === 'admin' ? (currentLang === 'en' ? 'Admin' : 'অ্যাডমিন') : t('mobileProfile', currentLang))
              : t('signIn', currentLang)
            }
          </span>
        </button>
      </div>
    </div>
  );
};
