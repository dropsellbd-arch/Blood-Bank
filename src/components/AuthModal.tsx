import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  Phone,
  Mail,
  Lock
} from 'lucide-react';
import { UserRole, BloodGroup, Language, User } from '../types';
import { RedLinkStorage } from '../services/storage';
import { BLOOD_GROUPS, BANGLADESH_DISTRICTS, getUpazilasForDistrict, t } from '../i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  initialTab?: 'login' | 'signup';
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  initialTab = 'login',
  onLoginSuccess,
}) => {
  const [tab, setTab] = useState<'login' | 'signup' | 'reset'>(initialTab);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup fields
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('donor');
  const [signupBloodGroup, setSignupBloodGroup] = useState<BloodGroup>('O+');
  const [signupDistrict, setSignupDistrict] = useState<string>('Dhaka');
  const [signupUpazila, setSignupUpazila] = useState<string>('');

  const signupUpazilas = getUpazilasForDistrict(signupDistrict);

  const handleSignupDistrictChange = (d: string) => {
    setSignupDistrict(d);
    setSignupUpazila('');
  };

  // Reset fields
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Status
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = RedLinkStorage.login(loginEmail, loginPassword);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
      onClose();
    } else {
      setErrorMsg(res.error || (currentLang === 'en' ? 'Invalid credentials' : 'ভুল ইমেইল বা পাসওয়ার্ড'));
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!signupName.trim() || !signupEmail.trim() || !signupPhone.trim()) {
      setErrorMsg(currentLang === 'en' ? 'Please fill in all required fields' : 'সবগুলো প্রয়োজনীয় ঘর পূরণ করুন');
      return;
    }

    const newUser = RedLinkStorage.signup({
      name: signupName,
      email: signupEmail,
      phone: signupPhone,
      role: signupRole,
      bloodGroup: signupBloodGroup,
      district: signupDistrict,
      upazila: signupUpazila || undefined,
      city: signupUpazila || signupDistrict,
      address: signupUpazila ? `${signupUpazila}, ${signupDistrict}` : signupDistrict,
      isAvailable: true,
    });

    onLoginSuccess(newUser);
    onClose();
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setTab('login');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center mx-auto mb-2 text-white">
            <Heart className="w-6 h-6 fill-white" />
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">RedLink</h2>
          <p className="text-xs text-rose-100 mt-0.5">{t('tagline', currentLang)}</p>

          {/* Tab Selector */}
          <div className="mt-4 flex rounded-xl bg-black/15 p-1 text-xs font-bold">
            <button
              onClick={() => {
                setTab('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                tab === 'login' ? 'bg-white text-red-700 shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              {t('loginTab', currentLang)}
            </button>
            <button
              onClick={() => {
                setTab('signup');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                tab === 'signup' ? 'bg-white text-red-700 shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              {t('signupTab', currentLang)}
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('email', currentLang)}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">{t('password', currentLang)}</label>
                  <button
                    type="button"
                    onClick={() => setTab('reset')}
                    className="text-[11px] text-red-600 hover:underline font-semibold"
                  >
                    {t('forgotPassword', currentLang)}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-red-200 transition-colors flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('signIn', currentLang)}</span>
              </button>
            </form>
          )}

          {/* 2. SIGN UP FORM */}
          {tab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('iWantTo', currentLang)}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupRole('donor')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-left transition-all ${
                      signupRole === 'donor'
                        ? 'border-red-500 bg-red-50/70 text-red-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 mb-1 text-red-600" />
                    <div>Blood Donor</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupRole('recipient')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-left transition-all ${
                      signupRole === 'recipient'
                        ? 'border-red-500 bg-red-50/70 text-red-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5 mb-1 text-slate-700" />
                    <div>Requester</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('fullName', currentLang)} *</label>
                <input
                  type="text"
                  required
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('email', currentLang)} *</label>
                  <input
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('phone', currentLang)} *</label>
                  <input
                    type="tel"
                    required
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="+880 17XXXXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('bloodGroup', currentLang)} *</label>
                  <select
                    value={signupBloodGroup}
                    onChange={(e) => setSignupBloodGroup(e.target.value as BloodGroup)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('district', currentLang)} *</label>
                  <select
                    value={signupDistrict}
                    onChange={(e) => handleSignupDistrictChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d.en} value={d.en}>
                        {currentLang === 'en' ? d.en : d.bn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('upazila', currentLang)}</label>
                <select
                  value={signupUpazila}
                  onChange={(e) => setSignupUpazila(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  <option value="">{t('selectUpazila', currentLang)}</option>
                  {signupUpazilas.map((u) => (
                    <option key={u.en} value={u.en}>
                      {currentLang === 'en' ? u.en : u.bn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('password', currentLang)} *</label>
                <input
                  type="password"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Create strong password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-red-200 transition-colors flex items-center justify-center gap-1.5 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t('signupTab', currentLang)}</span>
              </button>
            </form>
          )}

          {/* 3. RESET PASSWORD FLOW */}
          {tab === 'reset' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-rose-50 text-red-600 flex items-center justify-center mx-auto mb-2">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">{t('forgotPassword', currentLang)}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentLang === 'en'
                    ? 'Enter your registered email address to receive password recovery instructions.'
                    : 'আপনার নিবন্ধিত ইমেইল ঠিকানা দিন, আমরা পাসওয়ার্ড রিসেট লিংক পাঠাব।'}
                </p>
              </div>

              {resetSuccess ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {currentLang === 'en'
                      ? 'Password reset instructions sent to your email.'
                      : 'পাসওয়ার্ড রিসেটের লিংক আপনার ইমেইলে পাঠানো হয়েছে।'}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleReset} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="your-email@domain.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />

                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl text-xs"
                  >
                    {t('sendResetLink', currentLang)}
                  </button>

                  <button
                    type="button"
                    onClick={() => setTab('login')}
                    className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-semibold"
                  >
                    ← {t('backToLogin', currentLang)}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
