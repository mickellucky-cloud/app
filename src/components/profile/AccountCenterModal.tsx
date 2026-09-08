import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Key,
  Shield,
  Bell,
  Globe,
  Share2,
  Trash2,
  Edit3,
  Check,
  Copy,
  ChevronRight,
  Sun,
  Moon,
  AlertTriangle,
  Lock,
  Sparkles,
  Award,
  ArrowRight,
} from 'lucide-react';
import { ThemeMode } from '../../types';

interface AccountCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  uid?: string;
  onSignOut?: () => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onOpenSecurityCenter?: () => void;
  onOpenSupport?: () => void;
  onShowToast?: (title: string, message: string, type?: 'success' | 'alert' | 'info') => void;
}

export const AccountCenterModal: React.FC<AccountCenterModalProps> = ({
  isOpen,
  onClose,
  userEmail = 'mickel.lucky@gmail.com',
  uid = '8829410',
  onSignOut,
  theme = 'dark',
  onToggleTheme,
  onOpenSecurityCenter,
  onOpenSupport,
  onShowToast,
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'profile' | 'credentials' | 'preferences' | 'referrals' | 'danger'>('profile');

  // User Profile state
  const [displayName, setDisplayName] = useState('Mickel Lucky');
  const [username, setUsername] = useState('@mickellucky');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [bio, setBio] = useState('Active Web3 crypto swing trader & liquidity provider.');
  const [avatarGradient, setAvatarGradient] = useState('from-purple-600 via-indigo-600 to-amber-400');
  const [createdAt] = useState('October 14, 2024');

  // Edit Profile modal
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editNameInput, setEditNameInput] = useState(displayName);
  const [editUsernameInput, setEditUsernameInput] = useState(username);
  const [editBioInput, setEditBioInput] = useState(bio);

  // Change Email Flow state
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [emailVerifyCode, setEmailVerifyCode] = useState('');
  const [emailSecurity2faCode, setEmailSecurity2faCode] = useState('');
  const [emailStep, setEmailStep] = useState<1 | 2>(1);

  // Change Phone Flow state
  const [showChangePhone, setShowChangePhone] = useState(false);
  const [newPhoneInput, setNewPhoneInput] = useState('');
  const [phoneVerifyCode, setPhoneVerifyCode] = useState('');
  const [phoneStep, setPhoneStep] = useState<1 | 2>(1);

  // Preferences
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'NGN' | 'JPY'>('USD');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'es' | 'fr' | 'de' | 'ja'>('en');

  // Notification toggles
  const [notifPriceAlerts, setNotifPriceAlerts] = useState(true);
  const [notifOrders, setNotifOrders] = useState(true);
  const [notifSecurity, setNotifSecurity] = useState(true); // Mandatory
  const [notifMarketing, setNotifMarketing] = useState(false);

  // Referral state
  const [referralCode] = useState('OKN-88294');
  const [copiedReferral, setCopiedReferral] = useState(false);

  // Account Deletion Flow state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNameInput.trim()) return;
    setDisplayName(editNameInput.trim());
    setUsername(editUsernameInput.trim().startsWith('@') ? editUsernameInput.trim() : `@${editUsernameInput.trim()}`);
    setBio(editBioInput.trim());
    setIsEditingProfile(false);
    onShowToast?.('Profile Updated', 'Your public display name and handle were saved.', 'success');
  };

  const handleConfirmChangeEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailStep === 1) {
      if (!newEmailInput.includes('@')) {
        onShowToast?.('Invalid Email', 'Please provide a valid email address.', 'alert');
        return;
      }
      setEmailStep(2);
      onShowToast?.('Verification Dispatched', `A 6-digit confirmation code was sent to ${newEmailInput}.`, 'info');
    } else {
      if (emailVerifyCode.length !== 6) {
        onShowToast?.('Invalid Code', 'Please enter the 6-digit verification code.', 'alert');
        return;
      }
      setShowChangeEmail(false);
      setEmailStep(1);
      setNewEmailInput('');
      setEmailVerifyCode('');
      onShowToast?.('Email Address Updated', 'Your registered OKNexus account email has been updated.', 'success');
    }
  };

  const handleConfirmChangePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneStep === 1) {
      if (newPhoneInput.length < 8) {
        onShowToast?.('Invalid Phone', 'Please enter a valid mobile number.', 'alert');
        return;
      }
      setPhoneStep(2);
      onShowToast?.('SMS Dispatched', `Verification code sent to ${newPhoneInput}.`, 'info');
    } else {
      if (phoneVerifyCode.length !== 6) {
        onShowToast?.('Invalid Code', 'Please enter the 6-digit SMS verification code.', 'alert');
        return;
      }
      setPhone(newPhoneInput);
      setShowChangePhone(false);
      setPhoneStep(1);
      setNewPhoneInput('');
      setPhoneVerifyCode('');
      onShowToast?.('Phone Number Updated', 'Your 2FA SMS number has been updated.', 'success');
    }
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://oknexus.io/register?ref=${referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
    onShowToast?.('Referral Link Copied', 'Share your link to earn 40% lifetime trading fee rebates.', 'success');
  };

  const handleExecuteDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE ACCOUNT') {
      onShowToast?.('Confirmation Required', 'Please type DELETE ACCOUNT in uppercase to confirm.', 'alert');
      return;
    }
    setShowDeleteModal(false);
    onClose();
    onSignOut?.();
    onShowToast?.('Account Deleted', 'Your account and personal data have been scheduled for permanent erasure.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in text-slate-100">
      <div className="w-full max-w-2xl bg-[#0C0F1B] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0E1222]/80">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${avatarGradient} p-[2px] shadow-lg`}>
              <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center">
                <span className="font-extrabold text-white text-sm font-display">
                  {displayName.substring(0, 2).toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">{displayName}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  VIP 2
                </span>
                <span className="hidden sm:inline-flex items-center gap-0.5 text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-3.5 h-3.5" /> Level 2 Verified
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono-num">
                {username} • UID: {uid} • Joined {createdAt}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 pb-2 border-b border-white/[0.06] bg-[#080B14] overflow-x-auto no-scrollbar text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'profile' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Profile Overview
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'credentials' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Email & Phone
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'preferences' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Preferences
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'referrals' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            Referral Center
          </button>
          <button
            onClick={() => setActiveTab('danger')}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'danger' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'text-slate-500 hover:text-rose-400 hover:bg-white/[0.04]'
            }`}
          >
            Account Security & Delete
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: PROFILE OVERVIEW */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              {/* Profile Card with Quick Edit */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#181530] via-[#101124] to-[#0A0D18] border border-purple-500/30 shadow-lg space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Account Overview</span>
                    <h4 className="text-lg font-extrabold text-white">{displayName}</h4>
                    <p className="text-xs text-slate-300">{bio}</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditNameInput(displayName);
                      setEditUsernameInput(username);
                      setEditBioInput(bio);
                      setIsEditingProfile(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/15 text-xs font-bold text-white border border-white/10 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* Identity Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/[0.08] text-xs">
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
                    <span className="text-slate-400">Username:</span>
                    <span className="font-mono-num font-bold text-white">{username}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
                    <span className="text-slate-400">User ID (UID):</span>
                    <span className="font-mono-num font-bold text-purple-300">{uid}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-medium text-slate-200">{userEmail}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
                    <span className="text-slate-400">Phone:</span>
                    <span className="font-mono-num text-slate-200">{phone}</span>
                  </div>
                </div>
              </div>

              {/* Verification Tier Breakdown Card */}
              <div className="p-4 rounded-2xl bg-[#0F1322] border border-white/[0.07] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h4 className="font-bold text-sm text-white">Identity Verification (KYC)</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    TIER 2 VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-[#090C16] border border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 block font-semibold">National ID / Passport</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                      <Check className="w-3.5 h-3.5" /> Approved
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090C16] border border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 block font-semibold">Facial Biometrics</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                      <Check className="w-3.5 h-3.5" /> Matched
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090C16] border border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 block font-semibold">24h Withdrawal Limit</span>
                    <span className="font-bold text-white font-mono-num mt-0.5">100.00 BTC</span>
                  </div>
                </div>
              </div>

              {/* Dedicated Security Center Shortcut Banner */}
              <div
                onClick={() => {
                  onClose();
                  onOpenSecurityCenter?.();
                }}
                className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#14122E] to-[#0A1024] border border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition-all flex items-center justify-between group shadow-md"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                        Dedicated Security Center
                      </span>
                      <span className="px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        94% High Protection
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Configure 2FA, anti-phishing codes, device sessions, and recovery keys.</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Edit Profile Drawer / Form Modal */}
              {isEditingProfile && (
                <div className="p-4 rounded-2xl bg-[#090C16] border border-white/10 space-y-3">
                  <h4 className="font-bold text-xs uppercase text-slate-300 tracking-wider">Edit Public Details</h4>
                  <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Display Name</label>
                      <input
                        type="text"
                        value={editNameInput}
                        onChange={(e) => setEditNameInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Username / Handle</label>
                      <input
                        type="text"
                        value={editUsernameInput}
                        onChange={(e) => setEditUsernameInput(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-purple-500 font-mono-num"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Trader Bio</label>
                      <textarea
                        value={editBioInput}
                        onChange={(e) => setEditBioInput(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-purple-500 resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.06] text-slate-300 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EMAIL & PHONE CREDENTIALS */}
          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0F1322] border border-white/[0.07] space-y-1">
                <h4 className="font-bold text-sm text-white">Contact & Login Credentials</h4>
                <p className="text-xs text-slate-400">
                  Changing registered contact details requires 2-step verification codes to protect your assets from unauthorized access.
                </p>
              </div>

              {/* Email Address Row */}
              <div className="p-4 rounded-2xl bg-[#090C16] border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">Registered Email</span>
                    <span className="font-bold text-sm text-white">{userEmail}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowChangeEmail(!showChangeEmail)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-bold text-slate-200 transition-colors"
                >
                  {showChangeEmail ? 'Cancel' : 'Change Email'}
                </button>
              </div>

              {/* Change Email Flow */}
              {showChangeEmail && (
                <form onSubmit={handleConfirmChangeEmail} className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3 text-xs">
                  <span className="font-bold text-white block">
                    {emailStep === 1 ? 'Step 1: Enter New Email Address' : 'Step 2: Enter Verification Codes'}
                  </span>

                  {emailStep === 1 ? (
                    <div>
                      <input
                        type="email"
                        value={newEmailInput}
                        onChange={(e) => setNewEmailInput(e.target.value)}
                        placeholder="new.trader@oknexus.io"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-purple-500"
                        required
                      />
                      <span className="text-[11px] text-slate-400 block mt-1">
                        We will send a 6-digit confirmation code to this address.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-slate-400 mb-1">Code sent to {newEmailInput}:</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={emailVerifyCode}
                          onChange={(e) => setEmailVerifyCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="6-digit email code"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono-num text-center tracking-widest text-sm focus:outline-none focus:border-purple-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-slate-400 mb-1">Google Authenticator (2FA) Code:</label>
                        <input
                          type="text"
                          maxLength={6}
                          value={emailSecurity2faCode}
                          onChange={(e) => setEmailSecurity2faCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="6-digit 2FA code"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono-num text-center tracking-widest text-sm focus:outline-none focus:border-purple-500"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all"
                    >
                      {emailStep === 1 ? 'Send Code &rarr;' : 'Verify & Update Email'}
                    </button>
                  </div>
                </form>
              )}

              {/* Phone Number Row */}
              <div className="p-4 rounded-2xl bg-[#090C16] border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">SMS Phone Number</span>
                    <span className="font-bold text-sm text-white font-mono-num">{phone}</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowChangePhone(!showChangePhone)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-bold text-slate-200 transition-colors"
                >
                  {showChangePhone ? 'Cancel' : 'Change Phone'}
                </button>
              </div>

              {/* Change Phone Flow */}
              {showChangePhone && (
                <form onSubmit={handleConfirmChangePhone} className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3 text-xs">
                  <span className="font-bold text-white block">
                    {phoneStep === 1 ? 'Step 1: Enter New Mobile Number' : 'Step 2: Enter SMS Verification Code'}
                  </span>

                  {phoneStep === 1 ? (
                    <div>
                      <input
                        type="tel"
                        value={newPhoneInput}
                        onChange={(e) => setNewPhoneInput(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono-num focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-slate-400 mb-1">SMS code sent to {newPhoneInput}:</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={phoneVerifyCode}
                        onChange={(e) => setPhoneVerifyCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="6-digit SMS code"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-mono-num text-center tracking-widest text-sm focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all"
                    >
                      {phoneStep === 1 ? 'Send SMS Code &rarr;' : 'Verify & Update Phone'}
                    </button>
                  </div>
                </form>
              )}

              {/* Password Management Direct Action */}
              <div className="p-4 rounded-2xl bg-[#090C16] border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-950/70 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block">Account Password</span>
                    <span className="text-xs text-slate-200">Last changed 45 days ago • Strong entropy</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenSecurityCenter?.();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-colors"
                >
                  Manage Password &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: PREFERENCES */}
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              {/* Currency & Language */}
              <div className="p-4 rounded-2xl bg-[#0F1322] border border-white/[0.07] space-y-3">
                <h4 className="font-bold text-sm text-white">Language & Regional Currency</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Primary Display Currency</label>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => {
                        setSelectedCurrency(e.target.value as any);
                        onShowToast?.('Currency Changed', `Display prices adjusted to ${e.target.value}.`, 'info');
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold focus:outline-none focus:border-purple-500"
                    >
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                      <option value="NGN">NGN (₦) - Nigerian Naira</option>
                      <option value="JPY">JPY (¥) - Japanese Yen</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Display Language</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => {
                        setSelectedLanguage(e.target.value as any);
                        onShowToast?.('Language Set', 'Language preference saved.', 'info');
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white font-bold focus:outline-none focus:border-purple-500"
                    >
                      <option value="en">English (United States)</option>
                      <option value="es">Español (América Latina)</option>
                      <option value="fr">Français (International)</option>
                      <option value="de">Deutsch (Europa)</option>
                      <option value="ja">日本語 (Japan)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="p-4 rounded-2xl bg-[#0F1322] border border-white/[0.07] space-y-3">
                <h4 className="font-bold text-sm text-white">Notification Preferences</h4>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#090C16] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Price Alerts & Volatility Signals</span>
                      <span className="text-[11px] text-slate-400">Push notifications for market limits & target alerts</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifPriceAlerts(!notifPriceAlerts)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${notifPriceAlerts ? 'bg-purple-600' : 'bg-slate-800'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${notifPriceAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-[#090C16] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">P2P Orders & Direct Messages</span>
                      <span className="text-[11px] text-slate-400">Escrow status, buyer payment notices & chat pings</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifOrders(!notifOrders)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${notifOrders ? 'bg-purple-600' : 'bg-slate-800'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${notifOrders ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-[#090C16] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Critical Security Notices</span>
                      <span className="text-[11px] text-slate-400">Withdrawal confirmations, new IPs, and password resets</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      MANDATORY
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#090C16] border border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Marketing Campaigns & Airdrops</span>
                      <span className="text-[11px] text-slate-400">Weekly tournament pools, listing alerts & fee coupons</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNotifMarketing(!notifMarketing)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${notifMarketing ? 'bg-purple-600' : 'bg-slate-800'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${notifMarketing ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REFERRAL CENTER */}
          {activeTab === 'referrals' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1C1138] via-[#120F24] to-[#0A0D18] border border-purple-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">OKNexus Affiliate Pro</span>
                    <h4 className="text-base font-extrabold text-white">Earn 40% Lifetime Trading Rebates</h4>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Your Referral Code</span>
                    <span className="font-mono-num font-extrabold text-base text-purple-300 tracking-wider">
                      {referralCode}
                    </span>
                  </div>

                  <button
                    onClick={handleCopyReferral}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
                  >
                    {copiedReferral ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedReferral ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>

                {/* Referral Performance Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-[#090C16] border border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 block">Friends Invited</span>
                    <span className="text-sm font-extrabold text-white font-mono-num">18</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#090C16] border border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 block">Total Commission</span>
                    <span className="text-sm font-extrabold text-emerald-400 font-mono-num">$3,420.50</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#090C16] border border-white/[0.06]">
                    <span className="text-[10px] text-slate-400 block">Rebate Tier</span>
                    <span className="text-sm font-extrabold text-amber-300 font-mono-num">40% VIP</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DANGER ZONE & DELETION */}
          {activeTab === 'danger' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <h4>Irreversible Actions</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Deleting your account permanently revokes trading access, terminates API credentials, erases order history, and forfeits unwithdrawn balances.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0F1322] border border-white/[0.07] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Sign Out From Current Browser</span>
                  <span className="text-[11px] text-slate-400">Safely clear active session tokens on this machine</span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onSignOut?.();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-xs font-bold text-slate-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#0F1322] border border-rose-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-rose-300 block">Permanently Delete Account</span>
                  <span className="text-[11px] text-slate-400">Erase personal credentials, P2P merchant profiles & ledger records</span>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md"
                >
                  Delete Account
                </button>
              </div>

              {/* Account Deletion Confirmation Modal */}
              {showDeleteModal && (
                <div className="p-5 rounded-2xl bg-[#14080C] border border-rose-500/40 space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-rose-400 text-sm flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Account Erasure Protocol
                    </span>
                    <button onClick={() => setShowDeleteModal(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    To confirm termination, please ensure all funds have been withdrawn and type <strong>DELETE ACCOUNT</strong> below:
                  </p>

                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE ACCOUNT"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-rose-500/40 text-rose-300 font-mono-num text-xs uppercase focus:outline-none"
                  />

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      Abort
                    </button>
                    <button
                      onClick={handleExecuteDeleteAccount}
                      disabled={deleteConfirmText !== 'DELETE ACCOUNT'}
                      className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-bold transition-all"
                    >
                      Confirm Permanent Deletion
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/[0.08] bg-[#0E1222]/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>OKNexus Global Exchange • 99.99% Uptime</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
