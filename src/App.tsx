import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { UrgentRequestsFeed } from './components/UrgentRequestsFeed';
import { DonorSearchSection } from './components/DonorSearchSection';
import { DashboardView } from './components/DashboardView';
import { PostRequestModal } from './components/PostRequestModal';
import { DonorProfileModal } from './components/DonorProfileModal';
import { ContactDonorModal } from './components/ContactDonorModal';
import { AuthModal } from './components/AuthModal';
import { BloodCompatibilityModal } from './components/BloodCompatibilityModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { RedLinkStorage } from './services/storage';
import { User, BloodRequest, Language } from './types';
import { t } from './i18n';
import { CheckCircle2, AlertCircle, Heart, BellRing } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => RedLinkStorage.getCurrentUser());
  const [currentLang, setCurrentLang] = useState<Language>('bn'); // Default to Bangla as requested in prompt, with 1-click EN switch
  const [activeTab, setActiveTab] = useState<string>('home');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'signup'>('login');
  const [isPostRequestModalOpen, setIsPostRequestModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCompatibilityModalOpen, setIsCompatibilityModalOpen] = useState(false);
  const [contactDonorTarget, setContactDonorTarget] = useState<User | null>(null);

  // Search query state passed from Hero to Donors tab
  const [searchBloodGroup, setSearchBloodGroup] = useState<string>('');
  const [searchDistrict, setSearchDistrict] = useState<string>('');

  // Data cache trigger
  const [dataVersion, setDataVersion] = useState(0);
  const refreshData = () => setDataVersion((v) => v + 1);

  // Toast message
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Synchronize language preference in HTML lang tag
  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const allRequests = RedLinkStorage.getRequests();
  const allUsers = RedLinkStorage.getUsers();
  const allDonations = RedLinkStorage.getDonations();

  const totalDonors = allUsers.filter((u) => u.role === 'donor' || u.role === 'admin').length;
  const requestsFulfilled = allRequests.filter((r) => r.status === 'fulfilled').length;
  const activeUrgentRequests = allRequests.filter((r) => r.status === 'open' && (r.urgency === 'urgent' || r.urgency === 'critical')).length;

  const handleHeroSearch = (bloodGroup: string, district: string) => {
    setSearchBloodGroup(bloodGroup);
    setSearchDistrict(district);
    setActiveTab('donors');
  };

  const handleRespondToRequest = (requestId: string) => {
    if (!currentUser) {
      setAuthInitialTab('login');
      setIsAuthModalOpen(true);
      return;
    }

    const success = RedLinkStorage.respondToRequest(
      requestId,
      currentUser,
      currentLang === 'en' 
        ? 'I am on standby and ready to donate for this patient. Please contact me.' 
        : 'আমি এই রোগীর জন্য রক্ত দিতে প্রস্তুত। অনুগ্রহ করে আমার সাথে যোগাযোগ করুন।'
    );

    if (success) {
      refreshData();
      showToast(
        currentLang === 'en' 
          ? 'Thank you! Your willingness to donate has been sent to the patient attendant.' 
          : 'ধন্যবাদ! আপনার রক্তদানের সম্মতি আবেদনকারীর নিকট পাঠানো হয়েছে।'
      );
    } else {
      showToast(
        currentLang === 'en' ? 'You have already responded to this blood request.' : 'আপনি ইতিমধ্যে এই আবেদনে সাড়া দিয়েছেন।',
        'info'
      );
    }
  };

  const handleOpenAuth = (initialTab: 'login' | 'signup' = 'login') => {
    setAuthInitialTab(initialTab);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs max-w-md border border-slate-700">
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'info' && <BellRing className="w-5 h-5 text-blue-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentUser={currentUser}
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={handleOpenAuth}
        onOpenPostRequest={() => setIsPostRequestModalOpen(true)}
        onOpenProfile={() => {
          if (!currentUser) handleOpenAuth('login');
          else setIsProfileModalOpen(true);
        }}
        onUserSwitch={(u) => {
          setCurrentUser(u);
          refreshData();
          if (u) {
            showToast(
              currentLang === 'en'
                ? `Logged in as ${u.name} (${u.role.toUpperCase()})`
                : `${u.name} হিসেবে লগইন সফল হয়েছে।`
            );
          }
        }}
      />

      {/* Main Application Views */}
      <main className="flex-1 pb-16 md:pb-0">
        {/* VIEW 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div>
            <HeroSection
              currentLang={currentLang}
              currentUser={currentUser}
              totalDonors={totalDonors}
              requestsFulfilled={requestsFulfilled}
              activeRequests={activeUrgentRequests}
              onSearch={handleHeroSearch}
              onOpenPostRequest={() => setIsPostRequestModalOpen(true)}
              onBecomeDonor={() => {
                if (!currentUser) {
                  handleOpenAuth('signup');
                } else {
                  setIsProfileModalOpen(true);
                }
              }}
              onOpenCompatibilityModal={() => setIsCompatibilityModalOpen(true)}
            />

            {/* Live Urgent Requests Public Feed */}
            <UrgentRequestsFeed
              requests={allRequests}
              currentLang={currentLang}
              currentUser={currentUser}
              onRespond={handleRespondToRequest}
              onOpenAuth={() => handleOpenAuth('login')}
            />

            {/* Featured Donors Quick Section */}
            <section className="py-12 bg-slate-50 border-t border-slate-200/70">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                      {currentLang === 'en' ? 'Available Donors Ready to Help' : 'রক্তদানে প্রস্তুত কয়েকজন স্বেচ্ছাসেবী'}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {currentLang === 'en' 
                        ? 'Connect directly with voluntary donors in your district.'
                        : 'আপনার নিকটস্থ জেলায় প্রস্তুত রক্তদাতাদের সাথে যোগাযোগ করুন।'}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('donors')}
                    className="text-xs font-bold text-red-600 hover:text-red-700 underline"
                  >
                    {currentLang === 'en' ? 'Explore All Donors →' : 'সকল রক্তদাতা দেখুন →'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {allUsers
                    .filter((u) => u.role === 'donor' && u.isAvailable)
                    .slice(0, 4)
                    .map((donor) => (
                      <div
                        key={donor.id}
                        className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex items-center gap-3.5"
                      >
                        {donor.photoUrl ? (
                          <img
                            src={donor.photoUrl}
                            alt={donor.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-rose-100"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-rose-100 text-red-700 font-extrabold flex items-center justify-center text-sm shrink-0">
                            {donor.name[0]}
                          </div>
                        )}

                        <div className="flex-1 truncate">
                          <div className="font-bold text-xs text-slate-900 truncate">{donor.name}</div>
                          <div className="text-[11px] text-slate-500 truncate">{donor.upazila ? `${donor.upazila}, ` : ''}{donor.district}</div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="bg-red-600 text-white font-black text-[10px] px-1.5 py-0.2 rounded-sm">
                              {donor.bloodGroup}
                            </span>
                            <span className="text-[10px] text-emerald-600 font-bold">Available</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setContactDonorTarget(donor)}
                          className="bg-slate-900 hover:bg-red-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
                        >
                          {currentLang === 'en' ? 'Call' : 'যোগাযোগ'}
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: DONOR SEARCH PAGE */}
        {activeTab === 'donors' && (
          <DonorSearchSection
            donors={allUsers}
            currentLang={currentLang}
            initialBloodGroup={searchBloodGroup}
            initialDistrict={searchDistrict}
            onContactDonor={(donor) => setContactDonorTarget(donor)}
          />
        )}

        {/* VIEW 3: BLOOD REQUESTS FEED PAGE */}
        {activeTab === 'requests' && (
          <div className="py-6 bg-slate-50">
            <UrgentRequestsFeed
              requests={allRequests}
              currentLang={currentLang}
              currentUser={currentUser}
              onRespond={handleRespondToRequest}
              onOpenAuth={() => handleOpenAuth('login')}
            />
          </div>
        )}

        {/* VIEW 4: DASHBOARD PAGE */}
        {activeTab === 'dashboard' && (
          currentUser ? (
            <DashboardView
              currentUser={currentUser}
              currentLang={currentLang}
              onOpenEditProfile={() => setIsProfileModalOpen(true)}
              onOpenPostRequest={() => setIsPostRequestModalOpen(true)}
              onRequestStatusChanged={refreshData}
              onUserRoleOrStatusChanged={() => {
                setCurrentUser(RedLinkStorage.getCurrentUser());
                refreshData();
              }}
            />
          ) : (
            <div className="py-20 px-4 text-center max-w-md mx-auto min-h-[60vh] flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-rose-100 text-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-xs">
                <Heart className="w-8 h-8 fill-red-500 text-red-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                {currentLang === 'en' ? 'Sign In to Your Dashboard' : 'ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন'}
              </h2>
              <p className="text-slate-500 text-sm mt-2 mb-6 leading-relaxed">
                {currentLang === 'en'
                  ? 'Manage your blood donation availability, track your donation history, and respond to urgent hospital requests.'
                  : 'আপনার রক্তদানের সময়সূচি ও প্রাপ্যতা পরিবর্তন করতে অথবা আপনার রক্তের আবেদনগুলো পরিচালনা করতে অ্যাকাউন্টে লগইন করুন।'}
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  id="dashboard-gate-login-btn"
                  onClick={() => handleOpenAuth('login')}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-xl text-sm shadow-md shadow-red-200 transition-all active:scale-98"
                >
                  {t('signIn', currentLang)}
                </button>
                <button
                  id="dashboard-gate-signup-btn"
                  onClick={() => handleOpenAuth('signup')}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-5 rounded-xl text-sm transition-all active:scale-98"
                >
                  {t('signUp', currentLang)}
                </button>
              </div>
            </div>
          )
        )}

        {/* VIEW 5: ADMIN VIEW (FOR ADMIN ROLE) */}
        {activeTab === 'admin' && currentUser?.role === 'admin' && (
          <DashboardView
            currentUser={currentUser}
            currentLang={currentLang}
            onOpenEditProfile={() => setIsProfileModalOpen(true)}
            onOpenPostRequest={() => setIsPostRequestModalOpen(true)}
            onRequestStatusChanged={refreshData}
            onUserRoleOrStatusChanged={() => {
              setCurrentUser(RedLinkStorage.getCurrentUser());
              refreshData();
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        onOpenCompatibilityModal={() => setIsCompatibilityModalOpen(true)}
        setActiveTab={setActiveTab}
      />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        currentLang={currentLang}
        onOpenPostRequest={() => setIsPostRequestModalOpen(true)}
        onOpenAuth={(tab) => handleOpenAuth(tab || 'login')}
        activeRequestsCount={activeUrgentRequests}
      />

      {/* Modals & Drawers */}
      {/* 1. Post Blood Request Modal */}
      <PostRequestModal
        isOpen={isPostRequestModalOpen}
        onClose={() => setIsPostRequestModalOpen(false)}
        currentUser={currentUser}
        currentLang={currentLang}
        onOpenAuth={() => handleOpenAuth('login')}
        onRequestCreated={() => {
          refreshData();
          showToast(
            currentLang === 'en'
              ? 'Blood request published successfully!'
              : 'জরুরি রক্তের আবেদন সফলভাবে প্রকাশিত হয়েছে!'
          );
        }}
      />

      {/* 2. Donor Profile / Edit Modal */}
      {currentUser && (
        <DonorProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          currentLang={currentLang}
          onProfileUpdated={(updated) => {
            setCurrentUser(updated);
            refreshData();
            showToast(currentLang === 'en' ? 'Profile updated!' : 'প্রোফাইল আপডেট হয়েছে!');
          }}
        />
      )}

      {/* 3. Contact Donor Modal */}
      <ContactDonorModal
        donor={contactDonorTarget}
        currentUser={currentUser}
        currentLang={currentLang}
        onClose={() => setContactDonorTarget(null)}
      />

      {/* 4. Auth Modal (Login / Signup / Password Reset) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentLang={currentLang}
        initialTab={authInitialTab}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          refreshData();
          showToast(
            currentLang === 'en'
              ? `Welcome back, ${user.name}!`
              : `স্বাগতম, ${user.name}!`
          );
        }}
      />

      {/* 5. Blood Compatibility Modal */}
      <BloodCompatibilityModal
        isOpen={isCompatibilityModalOpen}
        onClose={() => setIsCompatibilityModalOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
}
