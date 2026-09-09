import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  PlusCircle, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Shield, 
  Menu, 
  X, 
  Phone, 
  Globe, 
  CheckCircle2, 
  Clock, 
  Flame,
  UserCheck,
  LogIn
} from 'lucide-react';
import { User, Language } from '../types';
import { RedLinkStorage } from '../services/storage';
import { t } from '../i18n';

interface NavbarProps {
  currentUser: User | null;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (initialTab?: 'login' | 'signup') => void;
  onOpenPostRequest: () => void;
  onOpenProfile: () => void;
  onUserSwitch: (user: User | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentLang,
  onLanguageChange,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenPostRequest,
  onOpenProfile,
  onUserSwitch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const notifications = currentUser ? RedLinkStorage.getNotifications(currentUser.id) : [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    RedLinkStorage.logout();
    onUserSwitch(null);
    setUserDropdownOpen(false);
  };

  const handleNotificationClick = (notifId: string, requestId?: string) => {
    RedLinkStorage.markNotificationRead(notifId);
    setNotifDropdownOpen(false);
    if (requestId) {
      setActiveTab('requests');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top Banner: Emergency Hotline & Language Switcher */}
      <div className="bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-rose-200">
              <Phone className="w-3.5 h-3.5 animate-pulse text-red-400" />
              {t('emergencyHotline', currentLang)}
            </span>
            <span className="hidden md:inline text-rose-300">|</span>
            <span className="hidden md:inline text-rose-200">
              {currentLang === 'en' 
                ? 'Blood saves lives. No fee, strictly voluntary.' 
                : 'রক্তদানে নেই কোনো খরচ, সম্পূর্ণ নিঃস্বার্থ সেবা।'}
            </span>
          </div>

          {/* Top Actions: Language Switcher & Quick Auth Link */}
          <div className="flex items-center gap-3">
            {!currentUser && (
              <button
                id="top-signin-btn"
                onClick={() => onOpenAuth('login')}
                className="text-rose-200 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-rose-300" />
                <span>{t('signIn', currentLang)}</span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              id="lang-toggle-btn"
              onClick={() => onLanguageChange(currentLang === 'en' ? 'bn' : 'en')}
              className="bg-rose-900/60 hover:bg-rose-800 text-rose-100 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors border border-rose-700/50"
              aria-label="Toggle language"
            >
              <Globe className="w-3 h-3 text-red-300" />
              <span>{currentLang === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white shadow-md shadow-red-200">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900">
                  Red<span className="text-red-600">Link</span>
                </span>
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                  BD
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block -mt-1 font-medium">
                {t('tagline', currentLang)}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-home-btn"
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'home'
                  ? 'bg-red-50 text-red-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('home', currentLang)}
            </button>

            <button
              id="nav-find-donors-btn"
              onClick={() => setActiveTab('donors')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'donors'
                  ? 'bg-red-50 text-red-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4" />
              {t('findDonors', currentLang)}
            </button>

            <button
              id="nav-requests-btn"
              onClick={() => setActiveTab('requests')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 relative ${
                activeTab === 'requests'
                  ? 'bg-red-50 text-red-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Flame className="w-4 h-4 text-red-600" />
              {t('requests', currentLang)}
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping absolute top-2 right-1.5" />
            </button>

            <button
              id="nav-dashboard-btn"
              onClick={() => {
                if (!currentUser) {
                  onOpenAuth('login');
                } else {
                  setActiveTab('dashboard');
                }
              }}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-red-50 text-red-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {t('dashboard', currentLang)}
            </button>

            {currentUser?.role === 'admin' && (
              <button
                id="nav-admin-btn"
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-rose-100 text-rose-800'
                    : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                <Shield className="w-4 h-4 text-rose-600" />
                {t('adminPanel', currentLang)}
              </button>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Request Blood Button CTA */}
            <button
              id="nav-post-request-btn"
              onClick={onOpenPostRequest}
              className="hidden sm:flex bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-3.5 py-2 rounded-xl text-sm font-bold shadow-sm shadow-red-200 items-center gap-1.5 transition-all hover:scale-102 active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('postRequest', currentLang)}</span>
            </button>

            {/* Notification Bell */}
            {currentUser && (
              <div className="relative">
                <button
                  id="notifications-bell-btn"
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in">
                    <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <div className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <Bell className="w-4 h-4 text-red-600" />
                        {t('notifications', currentLang)}
                        {unreadCount > 0 && (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-bold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => RedLinkStorage.markAllNotificationsRead(currentUser.id)}
                          className="text-xs text-red-600 hover:text-red-700 font-semibold"
                        >
                          {t('markAllAsRead', currentLang)}
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-sm">
                          {t('noNotifications', currentLang)}
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n.id, n.linkRequestId)}
                            className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-rose-50/50' : ''}`}
                          >
                            <div className="flex items-start gap-2.5">
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-red-600' : 'bg-slate-300'}`} />
                              <div className="flex-1">
                                <div className="text-xs font-bold text-slate-900 leading-snug">{n.title}</div>
                                <div className="text-xs text-slate-600 mt-0.5">{n.message}</div>
                                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Auth Area */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-colors"
                >
                  {currentUser.photoUrl ? (
                    <img
                      src={currentUser.photoUrl}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-red-400"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
                      {currentUser.name[0]}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  {currentUser.bloodGroup && (
                    <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-sm hidden sm:inline">
                      {currentUser.bloodGroup}
                    </span>
                  )}
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="font-bold text-sm text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {currentUser.role}
                        </span>
                        {currentUser.bloodGroup && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                            {currentUser.bloodGroup}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenProfile();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        {t('profileTitle', currentLang)}
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setActiveTab('dashboard');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4 text-slate-400" />
                        {t('dashboard', currentLang)}
                      </button>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setActiveTab('admin');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-medium text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <Shield className="w-4 h-4 text-rose-600" />
                          {t('adminPanel', currentLang)}
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        {t('signOut', currentLang)}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  id="navbar-signin-btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-red-600 transition-colors"
                >
                  {t('signIn', currentLang)}
                </button>
                <button
                  id="navbar-signup-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                >
                  {t('signUp', currentLang)}
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <button
            onClick={() => {
              setActiveTab('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
              activeTab === 'home' ? 'bg-red-50 text-red-700' : 'text-slate-700'
            }`}
          >
            {t('home', currentLang)}
          </button>
          <button
            onClick={() => {
              setActiveTab('donors');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
              activeTab === 'donors' ? 'bg-red-50 text-red-700' : 'text-slate-700'
            }`}
          >
            {t('findDonors', currentLang)}
          </button>
          <button
            onClick={() => {
              setActiveTab('requests');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
              activeTab === 'requests' ? 'bg-red-50 text-red-700' : 'text-slate-700'
            }`}
          >
            <span>{t('requests', currentLang)}</span>
            <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
              LIVE
            </span>
          </button>
          <button
            onClick={() => {
              if (!currentUser) onOpenAuth('login');
              else setActiveTab('dashboard');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold ${
              activeTab === 'dashboard' ? 'bg-red-50 text-red-700' : 'text-slate-700'
            }`}
          >
            {t('dashboard', currentLang)}
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-rose-700 bg-rose-50"
            >
              {t('adminPanel', currentLang)}
            </button>
          )}

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPostRequest();
              }}
              className="w-full bg-red-600 text-white py-2.5 rounded-xl font-bold text-sm text-center shadow-md shadow-red-200"
            >
              + {t('postRequest', currentLang)}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
