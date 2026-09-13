import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  User,
  Key,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  Palette,
  Check,
  Camera,
  Upload,
  Image as ImageIcon,
  Edit2,
  RefreshCw,
  LineChart,
  Settings,
  Bell,
  Sliders,
  Copy,
  CheckCheck,
  ExternalLink,
  Shield,
  Smartphone,
  Lock,
  Globe,
  CreditCard,
  Laptop,
  AlertTriangle,
  FileCheck2,
  Eye,
  EyeOff,
  Radio,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  Send,
  Zap,
  Crown,
  Award,
  Star,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { ThemeMode } from '../../types';
import { POPULAR_NFT_AVATARS, OKN_OFFICIAL_AVATARS, AvatarPreset } from '../../data/avatarCollections';
import { ProfileSkeleton } from '../skeletons/ProfileSkeleton';

interface ProfileScreenProps {
  userEmail?: string;
  uid?: string;
  username?: string;
  onUpdateUsername?: (newUsername: string) => void;
  userAvatar?: string;
  onUpdateAvatar?: (newAvatarUrl: string) => void;
  onSignOut?: () => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  onOpenSupport?: () => void;
  onOpenAnalytics?: () => void;
  onOpenApiManagement?: () => void;
  onOpenSettings?: (category?: any) => void;
  onBack: () => void;
  initialSubView?: 'profile' | 'system_settings';
  isLoading?: boolean;
}

type ProfileSection =
  | 'overview'
  | 'kyc'
  | 'security'
  | 'password'
  | 'sessions'
  | 'notifications'
  | 'preferences'
  | 'payments';

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userEmail = 'mickel.lucky@gmail.com',
  uid = '8829410',
  username = 'Mickel_Lucky',
  onUpdateUsername,
  userAvatar = '',
  onUpdateAvatar,
  onSignOut,
  theme = 'dark',
  onToggleTheme,
  onOpenSupport,
  onOpenAnalytics,
  onOpenApiManagement,
  onOpenSettings,
  onBack,
  initialSubView = 'profile',
  isLoading = false,
}) => {
  const [activeSection, setActiveSection] = useState<ProfileSection>(
    initialSubView === 'system_settings' ? 'preferences' : 'overview'
  );
  const [mobileDrillDownActive, setMobileDrillDownActive] = useState(false);

  // Username editing
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [copiedUid, setCopiedUid] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Avatar picker
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [avatarCategory, setAvatarCategory] = useState<'nft' | 'okn' | 'device'>('nft');
  const [devicePreviewUrl, setDevicePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password management form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);

  // Trading PIN
  const [tradingPin, setTradingPin] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Security Toggles
  const [isGoogle2FAEnabled, setIsGoogle2FAEnabled] = useState(true);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(true);
  const [antiPhishingCode, setAntiPhishingCode] = useState('NEXUS-77');
  const [isEditingAntiPhish, setIsEditingAntiPhish] = useState(false);

  // Sessions
  const [sessions, setSessions] = useState([
    {
      id: 'sess-1',
      device: 'Mobile Safari / iOS 17.5',
      location: 'Lagos, Nigeria (IP: 102.89.44.12)',
      active: true,
      lastActive: 'Active now (This device)',
    },
    {
      id: 'sess-2',
      device: 'Chrome 124 / macOS Sonoma',
      location: 'London, UK (IP: 82.165.197.1)',
      active: false,
      lastActive: '3 hours ago',
    },
    {
      id: 'sess-3',
      device: 'Desktop Terminal / Windows 11',
      location: 'New York, US (IP: 198.51.100.24)',
      active: false,
      lastActive: '2 days ago',
    },
  ]);

  // Notifications preferences
  const [notifPreferences, setNotifPreferences] = useState({
    tradeFills: true,
    priceAlerts: true,
    securityAlerts: true,
    depositConfirmations: true,
    promotions: false,
    newsletter: false,
  });

  // Account Preferences
  const [fiatCurrency, setFiatCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');
  const [orderbookLatency, setOrderbookLatency] = useState('50ms');
  const [soundEffects, setSoundEffects] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  // Payment & Withdrawal Settings
  const [whitelistOnly, setWhitelistOnly] = useState(false);
  const [instantInternalTransfer, setInstantInternalTransfer] = useState(true);
  const [coolingPeriod, setCoolingPeriod] = useState(true);

  if (isLoading) {
    return <ProfileSkeleton onBack={onBack} />;
  }

  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleCopyUid = () => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(true);
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleSaveUsername = () => {
    const trimmed = tempUsername.trim();
    if (trimmed.length >= 3 && trimmed.length <= 25) {
      if (onUpdateUsername) onUpdateUsername(trimmed);
      setIsEditingUsername(false);
      showToast('Username updated successfully!');
    }
  };

  const handleSelectPresetAvatar = (preset: AvatarPreset) => {
    if (onUpdateAvatar) onUpdateAvatar(preset.url);
    showToast(`Avatar updated: ${preset.name}`);
    setIsAvatarPickerOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Error: Image must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setDevicePreviewUrl(result);
          if (onUpdateAvatar) onUpdateAvatar(result);
          showToast('Custom photo applied!');
          setIsAvatarPickerOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match');
      return;
    }
    setPassSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Login password changed successfully!');
    setTimeout(() => setPassSuccess(false), 4000);
  };

  const handleRevokeOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.active));
    showToast('All other active sessions have been revoked.');
  };

  const navigationSections: {
    id: ProfileSection;
    label: string;
    description: string;
    badge?: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'overview', label: 'Overview & Identity', description: 'Account identifiers, UID, VIP tier & verification', icon: User, badge: 'VIP 2' },
    { id: 'kyc', label: 'KYC & Verification', description: 'Government ID, facial proof & proof of address', icon: FileCheck2, badge: 'Verified' },
    { id: 'security', label: 'Security & 2FA', description: 'Two-factor authenticator, biometrics & anti-phishing', icon: ShieldCheck, badge: '95/100' },
    { id: 'password', label: 'Password & PIN', description: 'Login credentials and 6-digit asset PIN', icon: Key },
    { id: 'sessions', label: 'Active Sessions', description: 'Authorized hardware & remote device logouts', icon: Laptop, badge: `${sessions.length} Active` },
    { id: 'notifications', label: 'Notifications', description: 'Order fills, security alerts & price triggers', icon: Bell },
    { id: 'preferences', label: 'Account Preferences', description: 'Display currency, interface language & sounds', icon: Sliders },
    { id: 'payments', label: 'Payment & Withdrawal', description: 'Address whitelists, bank accounts & fast transfers', icon: CreditCard },
  ];

  return (
    <div
      id="standalone-profile-page"
      className="min-h-screen bg-slate-50 dark:bg-[#07090E] text-[#0F172A] dark:text-[#EDF1F5] pb-28 transition-colors"
    >
      {/* Desktop Top Header (Hidden on Mobile where MobileTopBar handles it) */}
      <header className="hidden md:block sticky top-0 z-30 bg-white/95 dark:bg-[#0A0E13]/95 backdrop-blur-md border-b border-[#D7E0EB] dark:border-[#1E2633] px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141B24] active:scale-95 transition-all"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-white flex items-center gap-2">
                <span>Account & Profile Center</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  VIP TIER 2
                </span>
              </h1>
              <p className="text-[11px] text-[#64748B] dark:text-[#8E98A6] hidden sm:block">
                Identity verification, security hardening, device authorizations & trading preferences
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenSettings && (
              <button
                type="button"
                id="profile-to-settings-btn"
                onClick={() => onOpenSettings()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#8B5CF6] dark:hover:text-[#8B5CF6] transition-colors shadow-2xs"
                title="Open Settings & Security Center"
              >
                <Settings className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            )}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-2 rounded-xl bg-white dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] text-[#64748B] dark:text-[#8E98A6] hover:text-[#8B5CF6] transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5">
        {/* Toast Feedback */}
        {statusMessage && (
          <div className="mb-4 px-4 py-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* User Hero Banner - Upgraded Luxury Exchange Profile Card */}
        <section
          id="profile-hero-card"
          className={`mb-6 rounded-3xl bg-gradient-to-br from-purple-900/20 via-white to-indigo-900/10 dark:from-purple-950/60 dark:via-[#0D121B] dark:to-indigo-950/40 border border-purple-500/25 dark:border-purple-500/20 shadow-sm relative overflow-hidden p-5 sm:p-6 ${
            mobileDrillDownActive ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mb-20" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Avatar and Identity */}
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Avatar with gradient halo and camera trigger */}
              <div className="relative group shrink-0">
                <div
                  className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-amber-400 p-[2.5px] shadow-lg cursor-pointer hover:scale-102 active:scale-98 transition-all"
                  onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
                >
                  <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#0A0E13] overflow-hidden flex items-center justify-center relative">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="font-black text-2xl sm:text-3xl text-purple-600">
                        {username.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                    {/* Live Online Badge */}
                    <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0A0E13] animate-pulse" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md hover:bg-purple-500 transition-all active:scale-90"
                  title="Change Avatar"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* User Details */}
              <div className="min-w-0">
                {isEditingUsername ? (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      placeholder="Username"
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#0A0E13] border border-purple-500 text-slate-900 dark:text-white w-44 focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                      autoFocus
                      maxLength={25}
                    />
                    <button
                      type="button"
                      onClick={handleSaveUsername}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingUsername(false)}
                      className="text-xs text-slate-400 hover:text-slate-600 p-1.5 rounded-lg"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h2 className="font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
                      @{username}
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setTempUsername(username);
                        setIsEditingUsername(true);
                      }}
                      className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-1"
                      title="Edit Username"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold border border-purple-500/30 flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-500" />
                      <span>VIP TIER 2</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <span>KYC Verified</span>
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <span>{userEmail}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Account Active
                  </span>
                </div>

                {/* UID, Joined Date & Security Badge */}
                <div className="flex items-center gap-2.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-2 flex-wrap">
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/[0.05] px-2 py-0.5 rounded-lg">
                    <span>UID: {uid}</span>
                    <button
                      type="button"
                      onClick={handleCopyUid}
                      className="text-purple-600 dark:text-purple-400 hover:opacity-80 inline-flex items-center ml-1"
                      title="Copy UID"
                    >
                      {copiedUid ? (
                        <CheckCheck className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                  <span className="hidden sm:inline font-sans">Member since Oct 2023</span>
                </div>
              </div>
            </div>

            {/* Right: Security & Quick Action Strip */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-white/10 shrink-0">
              {/* Security Health Ring */}
              <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#0A0E13]/80 border border-slate-200 dark:border-white/10 w-full sm:w-auto shadow-2xs">
                <div className="flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white">Security Rating</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Elite 2FA Protected</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">95 / 100</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full rounded-full" style={{ width: '95%' }} />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
                  className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors shadow-2xs"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>{isAvatarPickerOpen ? 'Close Picker' : 'Change Avatar'}</span>
                </button>
                {onOpenSettings && (
                  <button
                    type="button"
                    onClick={() => onOpenSettings()}
                    className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors shadow-2xs"
                  >
                    <Settings className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>Settings</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-slate-200/80 dark:border-white/10">
            <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06]">
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">30d Trading Volume</div>
              <div className="text-xs font-bold text-slate-900 dark:text-white font-mono mt-0.5">$148,250 USDT</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06]">
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">P2P Rating</div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                <span>99.4% (348 trades)</span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06]">
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Trading Fee Tier</div>
              <div className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono mt-0.5">0.06% / 0.08%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/60 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.06]">
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Account Safety</div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Optimal (2FA ON)</span>
              </div>
            </div>
          </div>

          {/* Avatar Drawer */}
          {isAvatarPickerOpen && (
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#0A0E13] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAvatarCategory('nft')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    avatarCategory === 'nft'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  NFT Avatars
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarCategory('okn')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    avatarCategory === 'okn'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  OKNexus Official
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarCategory('device')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    avatarCategory === 'device'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Upload Device Photo
                </button>
              </div>

              {avatarCategory === 'nft' && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
                  {POPULAR_NFT_AVATARS.map((nft) => (
                    <button
                      key={nft.id}
                      onClick={() => handleSelectPresetAvatar(nft)}
                      className={`p-2 rounded-2xl border transition-all flex flex-col items-center gap-1 bg-white dark:bg-[#141B24] ${
                        userAvatar === nft.url
                          ? 'border-purple-600 ring-2 ring-purple-600/30'
                          : 'border-slate-200 dark:border-white/10 hover:border-purple-400'
                      }`}
                    >
                      <img src={nft.url} alt={nft.name} className="w-12 h-12 rounded-full object-cover" />
                      <span className="text-[10px] font-bold truncate w-full">{nft.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {avatarCategory === 'okn' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {OKN_OFFICIAL_AVATARS.map((okn) => (
                    <button
                      key={okn.id}
                      onClick={() => handleSelectPresetAvatar(okn)}
                      className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center gap-1 bg-white dark:bg-[#141B24] ${
                        userAvatar === okn.url
                          ? 'border-purple-600 ring-2 ring-purple-600/30'
                          : 'border-slate-200 dark:border-white/10 hover:border-purple-400'
                      }`}
                    >
                      <img src={okn.url} alt={okn.name} className="w-12 h-12 rounded-full object-cover" />
                      <span className="text-xs font-bold truncate w-full">{okn.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {avatarCategory === 'device' && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#141B24] border border-dashed border-purple-500/40 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer py-2 space-y-1"
                  >
                    <Upload className="w-6 h-6 text-purple-600 mx-auto" />
                    <p className="text-xs font-bold">Upload an image file from device (PNG, JPG, WEBP)</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* TWO-COLUMN LAYOUT WITH VERTICAL OPTIONS LIST (ZERO HORIZONTAL SLIDERS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Vertical Options List */}
          <aside className={`${mobileDrillDownActive ? 'hidden lg:block' : 'block'} lg:col-span-4 space-y-4`}>
            <div className="rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] p-3 shadow-xs space-y-1">
              <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100 dark:border-white/[0.05] mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Profile Options
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  8 Categories
                </span>
              </div>

              {/* Vertical List of Options */}
              <div className="space-y-1">
                {navigationSections.map((sec) => {
                  const isActive = activeSection === sec.id;
                  const Icon = sec.icon;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => {
                        setActiveSection(sec.id);
                        setMobileDrillDownActive(true);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#141B24]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-400 group-hover:text-purple-600 group-hover:bg-purple-50 dark:group-hover:bg-purple-950/40'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate leading-tight flex items-center gap-1.5">
                            <span>{sec.label}</span>
                          </div>
                          <div
                            className={`text-[10px] truncate mt-0.5 ${
                              isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'
                            }`}
                          >
                            {sec.description}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {sec.badge && (
                          <span
                            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                              isActive
                                ? 'bg-white/25 text-white'
                                : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                            }`}
                          >
                            {sec.badge}
                          </span>
                        )}
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${
                            isActive ? 'text-white translate-x-0.5' : 'text-slate-400 group-hover:translate-x-0.5'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Security Tip Card in Sidebar */}
            <div className="hidden lg:block p-4 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10 border border-emerald-500/20 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Account Protection Tips</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Ensure Anti-Phishing code is enabled and never share your 6-digit withdrawal PIN with anyone, including OKNexus staff.
              </p>
            </div>
          </aside>

          {/* RIGHT COLUMN: Active Section Content */}
          <main className={`${mobileDrillDownActive ? 'block' : 'hidden lg:block'} lg:col-span-8 space-y-4`}>
            {/* Mobile Back Button to Return to Options List */}
            {mobileDrillDownActive && (
              <button
                type="button"
                onClick={() => setMobileDrillDownActive(false)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#0E141B] border border-slate-200 dark:border-[#242E3B] text-xs font-bold text-slate-800 dark:text-white shadow-2xs hover:border-purple-500/50 transition-all mb-2"
              >
                <ArrowLeft className="w-4 h-4 text-purple-600" />
                <span>Back to Profile Options</span>
              </button>
            )}

        {/* SECTION 1: OVERVIEW & IDENTITY */}
        {activeSection === 'overview' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Account Summary Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" />
                  <span>Personal Identifiers</span>
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-white/[0.04] text-xs">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-500">Registered Email</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{userEmail}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-500">Account UID</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">{uid}</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-500">Country of Residence</span>
                    <span className="font-bold text-slate-900 dark:text-white">United States / Global</span>
                  </div>
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-500">VIP Fee Status</span>
                    <span className="font-bold text-purple-600">VIP Tier 2 (0.06% Maker)</span>
                  </div>
                </div>
              </div>

              {/* Fast Links & Hubs */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span>Trader Hubs</span>
                </h3>

                <div className="space-y-2">
                  {onOpenAnalytics && (
                    <button
                      onClick={onOpenAnalytics}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-slate-200 dark:border-white/5 hover:border-purple-500/50 flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <LineChart className="w-4 h-4 text-purple-600" />
                        <div>
                          <span className="text-xs font-bold block">Portfolio Analytics</span>
                          <span className="text-[10px] text-slate-400">P&L curves, win rates & asset breakdown</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  )}

                  {onOpenApiManagement && (
                    <button
                      onClick={onOpenApiManagement}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-slate-200 dark:border-white/5 hover:border-purple-500/50 flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Key className="w-4 h-4 text-purple-600" />
                        <div>
                          <span className="text-xs font-bold block">API Management</span>
                          <span className="text-[10px] text-slate-400">Programmatic HMAC keys & bot webhooks</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  )}

                  {onOpenSupport && (
                    <button
                      onClick={onOpenSupport}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-slate-200 dark:border-white/5 hover:border-purple-500/50 flex items-center justify-between text-left transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-purple-600" />
                        <div>
                          <span className="text-xs font-bold block">Customer Service Center</span>
                          <span className="text-[10px] text-slate-400">24/7 Concierge, tickets & blockchain trace</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: KYC & VERIFICATION */}
        {activeSection === 'kyc' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-emerald-500" />
                    <span>Identity Verification Status</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Required for compliance, increased withdrawal limits and P2P fiat trading.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                  VERIFIED TIER 2
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-slate-200 dark:border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Tier 1: Basic Identity</span>
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Completed
                    </span>
                  </div>
                  <ul className="text-xs text-slate-500 space-y-1">
                    <li>• Government ID & Passport verification</li>
                    <li>• Personal name & Date of Birth verification</li>
                    <li>• 100,000 USDT / 24h withdrawal limit</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300">Tier 2: Advanced Biometrics</span>
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  </div>
                  <ul className="text-xs text-slate-500 space-y-1">
                    <li>• 3D Facial Liveness check</li>
                    <li>• Proof of Address verification</li>
                    <li>• 2,000,000 USDT / 24h withdrawal limit</li>
                    <li>• Unlimited P2P fiat trading</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: SECURITY SETTINGS & 2FA */}
        {activeSection === 'security' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span>Two-Factor Authentication & Protection</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Multi-layered defense against unauthorized account takeovers.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-500">Security Score: 95/100</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-white/[0.06]">
                {/* Google Authenticator */}
                <div className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-white">
                        Google Authenticator (TOTP)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Used for withdrawals, password resets and API management
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsGoogle2FAEnabled(!isGoogle2FAEnabled);
                      showToast(
                        !isGoogle2FAEnabled
                          ? 'Google Authenticator enabled!'
                          : 'Google Authenticator disabled.'
                      );
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isGoogle2FAEnabled
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-slate-200 dark:bg-[#141B24] text-slate-500'
                    }`}
                  >
                    {isGoogle2FAEnabled ? 'Enabled ✓' : 'Disabled'}
                  </button>
                </div>

                {/* Biometrics */}
                <div className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-white">
                        Biometric Quick-Unlock (Face ID / Fingerprint)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Local secure enclave authentication for mobile
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsBiometricsEnabled(!isBiometricsEnabled);
                      showToast(
                        !isBiometricsEnabled
                          ? 'Biometric authorization enabled!'
                          : 'Biometrics disabled.'
                      );
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isBiometricsEnabled
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-slate-200 dark:bg-[#141B24] text-slate-500'
                    }`}
                  >
                    {isBiometricsEnabled ? 'Active ✓' : 'Inactive'}
                  </button>
                </div>

                {/* Anti-phishing code */}
                <div className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-white">
                        Anti-Phishing Code
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Included in all official OKNexus emails to verify authenticity
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#141B24] font-mono text-xs font-bold text-purple-600">
                      {antiPhishingCode}
                    </span>
                    <button
                      onClick={() => {
                        const next = prompt('Enter new anti-phishing code (4-20 characters):', antiPhishingCode);
                        if (next && next.trim()) {
                          setAntiPhishingCode(next.trim());
                          showToast('Anti-phishing code updated!');
                        }
                      }}
                      className="text-xs font-semibold text-purple-600 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: PASSWORD MANAGEMENT */}
        {activeSection === 'password' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Login Password Form */}
              <form
                onSubmit={handlePasswordChange}
                className="p-5 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] space-y-3"
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Key className="w-4 h-4 text-purple-600" />
                  <span>Change Login Password</span>
                </h3>

                {passSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                    Login password updated successfully!
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPass ? 'text' : 'password'}
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-slate-300 dark:border-[#242E3B] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPass(!showOldPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showOldPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-slate-300 dark:border-[#242E3B] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-slate-300 dark:border-[#242E3B] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xs active:scale-95 transition-all mt-2"
                >
                  Update Password
                </button>
              </form>

              {/* Trading PIN */}
              <div className="p-5 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-600" />
                  <span>Trading & Withdrawal PIN</span>
                </h3>
                <p className="text-xs text-slate-500">
                  A 6-digit numeric passcode to authorize instant trades and small withdrawals without OTP SMS delay.
                </p>

                {pinSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                    6-digit PIN saved successfully!
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    6-Digit Numeric PIN
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={tradingPin}
                    onChange={(e) => setTradingPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••••"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-slate-300 dark:border-[#242E3B] text-center font-mono text-base tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (tradingPin.length === 6) {
                      setPinSuccess(true);
                      showToast('Trading PIN updated!');
                      setTimeout(() => setPinSuccess(false), 3000);
                    } else {
                      showToast('Please enter a 6-digit PIN');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#141B24] dark:hover:bg-[#1C2533] text-purple-600 font-bold text-xs transition-colors mt-2"
                >
                  Save 6-Digit PIN
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: LOGIN / SESSION MANAGEMENT */}
        {activeSection === 'sessions' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Laptop className="w-5 h-5 text-purple-600" />
                    <span>Authorized Devices & Active Sessions</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review and revoke unauthorized hardware accesses instantly.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRevokeOtherSessions}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-500/20 text-xs font-bold hover:bg-rose-500/20 transition-all active:scale-95"
                >
                  Revoke All Other Sessions
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {sessions.map((sess) => (
                  <div key={sess.id} className="py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${sess.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 dark:bg-[#141B24] text-slate-400'}`}>
                        <Laptop className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {sess.device}
                          </span>
                          {sess.active && (
                            <span className="px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 text-[10px] font-bold">
                              Current
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 block">{sess.location}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{sess.lastActive}</span>
                      </div>
                    </div>

                    {!sess.active && (
                      <button
                        type="button"
                        onClick={() => {
                          setSessions((prev) => prev.filter((s) => s.id !== sess.id));
                          showToast('Session logged out');
                        }}
                        className="text-xs font-bold text-rose-500 hover:underline"
                      >
                        Terminate
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: NOTIFICATION PREFERENCES */}
        {activeSection === 'notifications' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-600" />
                <span>Alert & Notification Channels</span>
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {[
                  {
                    key: 'tradeFills' as const,
                    title: 'Order Executions & Trades',
                    desc: 'Real-time push notifications when Spot, Futures or Convert orders fill',
                  },
                  {
                    key: 'priceAlerts' as const,
                    title: 'Price Target & Volatility Alerts',
                    desc: 'Sound chimes and pushes when user-defined price thresholds are triggered',
                  },
                  {
                    key: 'depositConfirmations' as const,
                    title: 'Deposit & Withdrawal Credits',
                    desc: 'Instant alert when blockchain deposits confirm and credit balance',
                  },
                  {
                    key: 'securityAlerts' as const,
                    title: 'Security & Sign-in Warnings',
                    desc: 'Mandatory high-priority alert on new IP, password change, or 2FA update',
                  },
                  {
                    key: 'promotions' as const,
                    title: 'Ecosystem Campaigns & Airdrops',
                    desc: 'Promotional updates, new token listings, and launchpad opportunities',
                  },
                ].map((item) => (
                  <div key={item.key} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-white">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate-500">{item.desc}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setNotifPreferences((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key],
                        }));
                        showToast('Notification preference saved');
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                        notifPreferences[item.key] ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                          notifPreferences[item.key] ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION 7: ACCOUNT & TRADING PREFERENCES */}
        {activeSection === 'preferences' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-600" />
                <span>Interface & Trading Engine Preferences</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Primary Valuation Currency
                  </label>
                  <select
                    value={fiatCurrency}
                    onChange={(e) => {
                      setFiatCurrency(e.target.value);
                      showToast(`Currency updated to ${e.target.value}`);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-slate-300 dark:border-[#242E3B] text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>JPY (¥)</option>
                    <option>NGN (₦)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Platform Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      showToast(`Language set to ${e.target.value}`);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-slate-300 dark:border-[#242E3B] text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option>English</option>
                    <option>Español</option>
                    <option>中文</option>
                    <option>Français</option>
                    <option>العربية</option>
                  </select>
                </div>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-white/[0.04] pt-2">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold block">Trade Audio Chimes</span>
                    <span className="text-[11px] text-slate-500">Play crisp sound effect on order fills</span>
                  </div>
                  <button
                    onClick={() => {
                      setSoundEffects(!soundEffects);
                      showToast('Sound preferences updated');
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                      soundEffects ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${soundEffects ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold block">Haptic Vibration Feedback</span>
                    <span className="text-[11px] text-slate-500">Tactile tap confirmation on mobile touch buttons</span>
                  </div>
                  <button
                    onClick={() => {
                      setHapticFeedback(!hapticFeedback);
                      showToast('Haptic feedback updated');
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                      hapticFeedback ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${hapticFeedback ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 8: PAYMENT & WITHDRAWAL SETTINGS */}
        {activeSection === 'payments' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#1E2633] space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                <span>Payment & Withdrawal Security Controls</span>
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                <div className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold block text-slate-900 dark:text-white">
                      Universal Internal Transfer (0% Fee)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Enable instant zero-fee transfers to any OKNexus user via UID or Email
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setInstantInternalTransfer(!instantInternalTransfer);
                      showToast('Internal transfer setting saved');
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                      instantInternalTransfer ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${instantInternalTransfer ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                <div className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold block text-slate-900 dark:text-white">
                      Withdrawal Address Whitelist Only
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Restrict outgoing withdrawals exclusively to pre-approved addresses
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setWhitelistOnly(!whitelistOnly);
                      showToast(
                        !whitelistOnly ? 'Address whitelist enforced!' : 'Whitelist mode disabled'
                      );
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                      whitelistOnly ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${whitelistOnly ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                <div className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold block text-slate-900 dark:text-white">
                      24-Hour Security Cooling Period
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Locks withdrawals for 24h after password reset or 2FA modification
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setCoolingPeriod(!coolingPeriod);
                      showToast('Cooling period setting saved');
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                      coolingPeriod ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${coolingPeriod ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

          </main>
        </div>

        {/* LOGOUT BUTTON */}
        {onSignOut && (
          <div className="pt-6">
            <button
              type="button"
              id="standalone-profile-signout-btn"
              onClick={onSignOut}
              className="w-full py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 hover:bg-rose-500/20 font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all shadow-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of OKNexus</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
