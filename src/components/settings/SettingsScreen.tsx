import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sun,
  Moon,
  ShieldCheck,
  Lock,
  Key,
  Smartphone,
  Mail,
  Bell,
  Sliders,
  CreditCard,
  Eye,
  EyeOff,
  Laptop,
  Trash2,
  Zap,
  Check,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Cpu,
  Volume2,
  Globe,
  DollarSign,
  Copy,
  ExternalLink,
  LogOut,
  AlertTriangle,
  Search,
  User,
  Fingerprint,
  ChevronRight,
  Shield,
  Activity,
  RefreshCw,
  Plus,
  ShieldAlert,
} from 'lucide-react';
import { ThemeMode } from '../../types';
import { SettingsSkeleton } from '../skeletons/SettingsSkeleton';

export type SettingsCategory =
  | 'account'
  | 'security'
  | 'two_factor'
  | 'notifications'
  | 'preferences'
  | 'payments'
  | 'privacy'
  | 'sessions';

interface SettingsScreenProps {
  userEmail?: string;
  uid?: string;
  username?: string;
  onUpdateUsername?: (name: string) => void;
  userAvatar?: string;
  theme: ThemeMode;
  onToggleTheme?: () => void;
  onOpenSupport?: () => void;
  onOpenProfile?: () => void;
  onBack: () => void;
  initialCategory?: SettingsCategory;
  isLoading?: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  userEmail = 'mickel.lucky@gmail.com',
  uid = '8829410',
  username = 'Mickel_Lucky',
  onUpdateUsername,
  userAvatar = '',
  theme = 'dark',
  onToggleTheme,
  onOpenSupport,
  onOpenProfile,
  onBack,
  initialCategory = 'account',
  isLoading = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>(initialCategory);
  const [searchFilter, setSearchFilter] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Update category when initialCategory changes
  useEffect(() => {
    if (initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [initialCategory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Account Settings State
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [copiedUid, setCopiedUid] = useState(false);
  const [fiatCurrency, setFiatCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'JPY' | 'USDT'>(() => {
    return (localStorage.getItem('okn_fiat') as any) || 'USD';
  });
  const [language, setLanguage] = useState<'English' | 'Español' | 'Deutsch' | 'Français' | '日本語'>(() => {
    return (localStorage.getItem('okn_lang') as any) || 'English';
  });

  // 2. Security Settings State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);

  const [tradingPin, setTradingPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [antiPhishingCode, setAntiPhishingCode] = useState(() => {
    return localStorage.getItem('okn_anti_phish') || 'NEXUS-77';
  });
  const [isEditingAntiPhish, setIsEditingAntiPhish] = useState(false);
  const [tempAntiPhish, setTempAntiPhish] = useState(antiPhishingCode);

  // 3. Two-Factor Authentication State
  const [isGoogle2FA, setIsGoogle2FA] = useState<boolean>(() => {
    return localStorage.getItem('okn_2fa_google') !== 'false';
  });
  const [isSms2FA, setIsSms2FA] = useState<boolean>(() => {
    return localStorage.getItem('okn_2fa_sms') === 'true';
  });
  const [isEmail2FA, setIsEmail2FA] = useState<boolean>(true);
  const [isBiometrics, setIsBiometrics] = useState<boolean>(() => {
    return localStorage.getItem('okn_biometrics') !== 'false';
  });
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  // 4. Notifications State
  const [notifTradeFills, setNotifTradeFills] = useState(true);
  const [notifPriceAlerts, setNotifPriceAlerts] = useState(true);
  const [notifSecurity, setNotifSecurity] = useState(true);
  const [notifFinancial, setNotifFinancial] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);
  const [channelPush, setChannelPush] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelSms, setChannelSms] = useState(false);

  // 5. System Preferences State
  const [oneClickTrading, setOneClickTrading] = useState<boolean>(() => {
    return localStorage.getItem('okn_one_click') === 'true';
  });
  const [orderbookSpeed, setOrderbookSpeed] = useState<'50ms' | '250ms' | '1000ms'>(() => {
    return (localStorage.getItem('okn_ob_speed') as any) || '250ms';
  });
  const [slippage, setSlippage] = useState<'0.1%' | '0.5%' | '1.0%'>(() => {
    return (localStorage.getItem('okn_slippage') as any) || '0.5%';
  });
  const [audioChimes, setAudioChimes] = useState<boolean>(() => {
    return localStorage.getItem('okn_audio') !== 'false';
  });
  const [haptics, setHaptics] = useState<boolean>(() => {
    return localStorage.getItem('okn_haptics') !== 'false';
  });
  const [gpuAccel, setGpuAccel] = useState<boolean>(() => {
    return localStorage.getItem('okn_gpu') !== 'false';
  });
  const [candleTheme, setCandleTheme] = useState<'classic' | 'pro'>(() => {
    return (localStorage.getItem('okn_candle_theme') as any) || 'classic';
  });
  const [cacheSize, setCacheSize] = useState('14.8 MB');

  // 6. Payment Settings State
  const [whitelistOnly, setWhitelistOnly] = useState<boolean>(() => {
    return localStorage.getItem('okn_whitelist_only') === 'true';
  });
  const [instantTransfer, setInstantTransfer] = useState<boolean>(() => {
    return localStorage.getItem('okn_instant_transfer') !== 'false';
  });
  const [coolingPeriod, setCoolingPeriod] = useState<boolean>(true);
  const [savedPaymentMethods, setSavedPaymentMethods] = useState([
    { id: 'pm-1', type: 'Bank Wire (SEPA)', detail: 'DE89 **** **** **** 4012', name: 'Mickel Lucky', active: true },
    { id: 'pm-2', type: 'Revolut Pay', detail: 'rev.me/@mickellucky', name: 'Mickel Lucky', active: true },
    { id: 'pm-3', type: 'Wise Transfer', detail: 'mickel.lucky@gmail.com', name: 'Mickel Lucky', active: false },
  ]);

  // 7. Privacy Settings State
  const [showPublicProfile, setShowPublicProfile] = useState<boolean>(() => {
    return localStorage.getItem('okn_public_profile') !== 'false';
  });
  const [showOnlineStatus, setShowOnlineStatus] = useState<boolean>(true);
  const [anonymousTrading, setAnonymousTrading] = useState<boolean>(false);
  const [autoHideBalances, setAutoHideBalances] = useState<boolean>(false);
  const [shareAnalytics, setShareAnalytics] = useState<boolean>(true);

  // 8. Sessions State
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

  const categories: {
    id: SettingsCategory;
    label: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: 'account', label: 'Account', description: 'Personal identity, language & currency', icon: User },
    { id: 'security', label: 'Security', description: 'Password, trading PIN & anti-phishing', icon: ShieldCheck, badge: '92%' },
    { id: 'two_factor', label: 'Two-Factor Authentication', description: 'Google TOTP, SMS & biometric passkeys', icon: Fingerprint, badge: 'Active' },
    { id: 'notifications', label: 'Notifications', description: 'Order fills, volatility & alerts', icon: Bell },
    { id: 'preferences', label: 'Preferences', description: 'Theme, orderbook speed & audio', icon: Sliders },
    { id: 'payments', label: 'Payment Settings', description: 'Payment rails, whitelist & cooling period', icon: CreditCard },
    { id: 'privacy', label: 'Privacy', description: 'Public visibility & anonymous orderbook', icon: Eye },
    { id: 'sessions', label: 'Session & Devices', description: 'Active devices, authorizations & logs', icon: Laptop, badge: `${sessions.length}` },
  ];

  const filteredCategories = categories.filter((c) =>
    c.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.description.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleCopyUid = () => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(true);
    showToast('UID copied to clipboard!');
    setTimeout(() => setCopiedUid(false), 2000);
  };

  const handleSaveUsername = () => {
    const trimmed = tempUsername.trim();
    if (trimmed.length >= 3 && trimmed.length <= 25) {
      if (onUpdateUsername) onUpdateUsername(trimmed);
      setIsEditingUsername(false);
      showToast('Account nickname updated successfully!');
    } else {
      showToast('Nickname must be between 3 and 25 characters');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      showToast('Please enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters');
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
    showToast('Login password changed successfully! Security cooling period: 24h.');
    setTimeout(() => setPassSuccess(false), 4000);
  };

  const handleSaveTradingPin = () => {
    if (tradingPin.length !== 6 || isNaN(Number(tradingPin))) {
      showToast('Trading PIN must be exactly 6 digits');
      return;
    }
    if (tradingPin !== confirmPin) {
      showToast('PIN confirmation does not match');
      return;
    }
    setIsSettingPin(false);
    setTradingPin('');
    setConfirmPin('');
    showToast('Trading PIN saved successfully!');
  };

  const handleSaveAntiPhish = () => {
    const code = tempAntiPhish.trim().toUpperCase();
    if (code.length < 4 || code.length > 20) {
      showToast('Anti-phishing code must be 4-20 characters');
      return;
    }
    setAntiPhishingCode(code);
    localStorage.setItem('okn_anti_phish', code);
    setIsEditingAntiPhish(false);
    showToast(`Anti-phishing code set to "${code}"`);
  };

  const handleClearCache = () => {
    setCacheSize('0.0 MB');
    showToast('Cache, offline charting buffers, and local data cleared!');
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    showToast('Session terminated successfully');
  };

  const handleRevokeAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.active));
    showToast('All other remote devices logged out!');
  };

  if (isLoading) {
    return <SettingsSkeleton onBack={onBack} />;
  }

  return (
    <div
      id="dedicated-settings-page"
      className="min-h-screen bg-slate-50 dark:bg-[#07090E] text-[#0F172A] dark:text-[#EDF1F5] pb-28 md:pb-12 transition-colors"
    >
      {/* Top Application Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0A0E13]/95 backdrop-blur-md border-b border-[#D7E0EB] dark:border-[#1E2633] px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="settings-back-btn"
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141B24] active:scale-95 transition-all"
              aria-label="Back to previous screen"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-white flex items-center gap-2">
                  <span>Settings & Security Center</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30">
                    EXCHANGE GRADE
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#8E98A6] hidden sm:block">
                Manage your account credentials, security hardware, trading engine parameters & privacy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenProfile && (
              <button
                type="button"
                id="settings-to-profile-btn"
                onClick={onOpenProfile}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] text-xs font-bold text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-colors shadow-2xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>View Full Profile</span>
              </button>
            )}

            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                className="p-2 rounded-xl bg-white dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] text-[#64748B] dark:text-[#8E98A6] hover:text-[#8B5CF6] transition-colors shadow-2xs"
                title="Toggle Light/Dark Theme"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#8B5CF6]" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5">
        {/* Toast Feedback Notification */}
        {toastMessage && (
          <div className="mb-4 px-4 py-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs font-bold flex items-center gap-2 animate-in fade-in shadow-xs">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Search and Navigation Bar for Categories */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search settings (e.g. 2FA, slippage, theme, whitelist)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Security Status Badge */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Account Protection: High (Tier 2)</span>
            </div>
          </div>
        </div>

        {/* Mobile Category Horizontal Scroll Bar */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white shadow-xs'
                    : 'bg-white dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] text-slate-600 dark:text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                {cat.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#8B5CF6]/10 text-[#8B5CF6]'
                  }`}>
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop 2-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Category Sidebar (Desktop) */}
          <aside className="hidden md:block md:col-span-4 lg:col-span-3">
            <div className="sticky top-20 space-y-1.5 bg-white dark:bg-[#0E141B] p-2 rounded-3xl border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs">
              {filteredCategories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    id={`settings-category-tab-${cat.id}`}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                      isActive
                        ? 'bg-[#8B5CF6] text-white shadow-xs font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#141B24]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-1.5 rounded-xl ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-[#1A222D] text-slate-500 dark:text-slate-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-semibold truncate leading-tight">
                          {cat.label}
                        </div>
                        <div className={`text-[10px] truncate ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`}>
                          {cat.description}
                        </div>
                      </div>
                    </div>
                    {cat.badge && (
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 ml-2 ${
                        isActive ? 'bg-white/25 text-white' : 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20'
                      }`}>
                        {cat.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Main Settings Pane */}
          <main className="md:col-span-8 lg:col-span-9 space-y-6">
            {/* 1. ACCOUNT CATEGORY */}
            {activeCategory === 'account' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Account Card */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#D7E0EB] dark:border-[#1E2633]">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-[#8B5CF6]" />
                      <h2 className="text-base font-bold text-[#0F172A] dark:text-white">Account Information</h2>
                    </div>
                    {onOpenProfile && (
                      <button
                        onClick={onOpenProfile}
                        className="text-xs font-bold text-[#8B5CF6] hover:underline flex items-center gap-1"
                      >
                        <span>Profile Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* User Identity */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633]">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">User Nickname</div>
                      {isEditingUsername ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            value={tempUsername}
                            onChange={(e) => setTempUsername(e.target.value)}
                            className="px-2.5 py-1 text-xs rounded-lg border border-[#8B5CF6] bg-white dark:bg-[#0E141B] text-[#0F172A] dark:text-white focus:outline-none"
                          />
                          <button
                            onClick={handleSaveUsername}
                            className="px-2 py-1 bg-[#8B5CF6] text-white text-xs font-bold rounded-lg"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setTempUsername(username);
                              setIsEditingUsername(false);
                            }}
                            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#0F172A] dark:text-white">@{username}</span>
                          <button
                            onClick={() => setIsEditingUsername(true)}
                            className="text-xs text-[#8B5CF6] font-bold hover:underline"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>

                    {/* UID */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633]">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">Account UID</div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-[#0F172A] dark:text-white">{uid}</span>
                        <button
                          onClick={handleCopyUid}
                          className="flex items-center gap-1 text-xs text-[#8B5CF6] font-bold hover:underline"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedUid ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633]">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">Registered Email</div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-[#0F172A] dark:text-white truncate max-w-[200px]">
                          {userEmail}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                          Verified
                        </span>
                      </div>
                    </div>

                    {/* VIP Level */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633]">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">VIP Rating & Tier</div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#8B5CF6]">VIP Tier 2</span>
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          0.06% Maker / 0.08% Taker
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Regional & Localization Settings */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#D7E0EB] dark:border-[#1E2633]">
                    <Globe className="w-5 h-5 text-[#8B5CF6]" />
                    <h2 className="text-base font-bold text-[#0F172A] dark:text-white">Language & Regional Defaults</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                        Base Settlement Currency
                      </label>
                      <select
                        value={fiatCurrency}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setFiatCurrency(val);
                          localStorage.setItem('okn_fiat', val);
                          showToast(`Default currency set to ${val}`);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#1E2633] text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                      >
                        <option value="USD">USD ($) - United States Dollar</option>
                        <option value="EUR">EUR (€) - Euro</option>
                        <option value="GBP">GBP (£) - British Pound</option>
                        <option value="JPY">JPY (¥) - Japanese Yen</option>
                        <option value="USDT">USDT (₮) - Tether Dollar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                        Interface Language
                      </label>
                      <select
                        value={language}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setLanguage(val);
                          localStorage.setItem('okn_lang', val);
                          showToast(`Language updated to ${val}`);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#1E2633] text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                      >
                        <option value="English">English (United States)</option>
                        <option value="Español">Español (Latinoamérica)</option>
                        <option value="Deutsch">Deutsch (Deutschland)</option>
                        <option value="Français">Français (France)</option>
                        <option value="日本語">日本語 (Japan)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SECURITY CATEGORY */}
            {activeCategory === 'security' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Security Score Banner */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-slate-900/5 to-purple-500/10 dark:from-emerald-950/30 dark:via-[#0E141B] dark:to-purple-950/20 border border-emerald-500/20 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                        <ShieldCheck className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-[#0F172A] dark:text-white">
                            Security Level: High (92/100)
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-extrabold">
                            HARDENED
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] dark:text-[#8E98A6] mt-0.5">
                          2FA enabled, anti-phishing active, device verification required for withdrawals
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Change Login Password Form */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#D7E0EB] dark:border-[#1E2633]">
                    <Lock className="w-5 h-5 text-[#8B5CF6]" />
                    <h2 className="text-base font-bold text-[#0F172A] dark:text-white">Change Login Password</h2>
                  </div>

                  {passSuccess && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Password successfully updated. Withdrawal lock: 24 hours.</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showOldPass ? 'text' : 'password'}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#1E2633] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPass(!showOldPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                          {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        New Password (Min 8 chars, 1 uppercase, 1 number)
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#1E2633] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                          {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type new password"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#1E2633] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold transition-all active:scale-95 shadow-xs"
                    >
                      Update Password
                    </button>
                  </form>
                </div>

                {/* Trading PIN / Asset Password */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs">
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#D7E0EB] dark:border-[#1E2633]">
                    <div className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-[#8B5CF6]" />
                      <div>
                        <h2 className="text-base font-bold text-[#0F172A] dark:text-white">6-Digit Trading PIN</h2>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Mandatory for order confirmation, API generation & crypto withdrawals
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                      Set & Active
                    </span>
                  </div>

                  {isSettingPin ? (
                    <div className="space-y-3 max-w-sm pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">New 6-Digit PIN</label>
                        <input
                          type="password"
                          maxLength={6}
                          value={tradingPin}
                          onChange={(e) => setTradingPin(e.target.value.replace(/\D/g, ''))}
                          placeholder="••••••"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#1E2633] text-sm text-center tracking-widest font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Confirm PIN</label>
                        <input
                          type="password"
                          maxLength={6}
                          value={confirmPin}
                          onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                          placeholder="••••••"
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#1E2633] text-sm text-center tracking-widest font-mono font-bold"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveTradingPin}
                          className="px-3.5 py-2 bg-[#8B5CF6] text-white text-xs font-bold rounded-xl"
                        >
                          Confirm PIN
                        </button>
                        <button
                          onClick={() => setIsSettingPin(false)}
                          className="text-xs text-slate-500 hover:text-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsSettingPin(true)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-[#141B24] hover:bg-slate-200 dark:hover:bg-[#1E2633] border border-[#D7E0EB] dark:border-[#242E3B] text-xs font-bold text-slate-700 dark:text-slate-200 transition-all"
                    >
                      Change Trading PIN
                    </button>
                  )}
                </div>

                {/* Anti-Phishing Code */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs">
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#D7E0EB] dark:border-[#1E2633]">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#8B5CF6]" />
                      <div>
                        <h2 className="text-base font-bold text-[#0F172A] dark:text-white">Anti-Phishing Verification Code</h2>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Included in all genuine OK Nexus confirmation emails to prevent phishing attacks
                        </p>
                      </div>
                    </div>
                  </div>

                  {isEditingAntiPhish ? (
                    <div className="flex items-center gap-2 max-w-sm">
                      <input
                        type="text"
                        value={tempAntiPhish}
                        onChange={(e) => setTempAntiPhish(e.target.value.toUpperCase())}
                        placeholder="e.g. NEXUS-77"
                        className="px-3.5 py-2 rounded-xl border border-[#8B5CF6] bg-white dark:bg-[#141B24] text-xs font-bold font-mono uppercase"
                      />
                      <button
                        onClick={handleSaveAntiPhish}
                        className="px-3 py-2 bg-[#8B5CF6] text-white text-xs font-bold rounded-xl"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingAntiPhish(false)}
                        className="text-xs text-slate-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 font-mono font-bold text-sm text-[#8B5CF6]">
                        {antiPhishingCode}
                      </div>
                      <button
                        onClick={() => {
                          setTempAntiPhish(antiPhishingCode);
                          setIsEditingAntiPhish(true);
                        }}
                        className="text-xs text-[#8B5CF6] font-bold hover:underline"
                      >
                        Modify Code
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. TWO-FACTOR AUTHENTICATION CATEGORY */}
            {activeCategory === 'two_factor' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#D7E0EB] dark:border-[#1E2633]">
                    <div className="flex items-center gap-2">
                      <Fingerprint className="w-5 h-5 text-[#8B5CF6]" />
                      <h2 className="text-base font-bold text-[#0F172A] dark:text-white">Multi-Factor Authentication (2FA)</h2>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      2 of 3 Methods Active
                    </span>
                  </div>

                  {/* Google Authenticator (TOTP) */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633] flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-purple-500/10 text-[#8B5CF6]">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#0F172A] dark:text-white">
                            Google Authenticator (TOTP)
                          </span>
                          <span className="px-2 py-0.2 rounded-md bg-emerald-500/15 text-emerald-600 text-[10px] font-bold">
                            Recommended
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Time-based 6-digit codes generated by Google Authenticator, Authy, or 1Password.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const next = !isGoogle2FA;
                        setIsGoogle2FA(next);
                        localStorage.setItem('okn_2fa_google', String(next));
                        showToast(`Google Authenticator ${next ? 'enabled' : 'disabled'}`);
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isGoogle2FA ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          isGoogle2FA ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* SMS / Phone 2FA */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633] flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#0F172A] dark:text-white">
                            SMS Text Authentication
                          </span>
                          <span className="text-xs text-slate-400 font-mono">+1 (***) ***-8829</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Receive security codes via SMS message for withdrawal verification.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const next = !isSms2FA;
                        setIsSms2FA(next);
                        localStorage.setItem('okn_2fa_sms', String(next));
                        showToast(`SMS Verification ${next ? 'enabled' : 'disabled'}`);
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isSms2FA ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          isSms2FA ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Biometric WebAuthn / Face ID */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633] flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                        <Fingerprint className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[#0F172A] dark:text-white">
                          Biometrics / Passkeys (WebAuthn)
                        </span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Use Apple Touch ID / Face ID or Windows Hello hardware credentials.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const next = !isBiometrics;
                        setIsBiometrics(next);
                        localStorage.setItem('okn_biometrics', String(next));
                        showToast(`Biometric Passkeys ${next ? 'enabled' : 'disabled'}`);
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isBiometrics ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          isBiometrics ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Emergency Recovery Codes */}
                  <div className="pt-2 border-t border-[#D7E0EB] dark:border-[#1E2633] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#0F172A] dark:text-white">Emergency Backup Codes</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        10 single-use recovery codes if you lose access to your authenticator
                      </div>
                    </div>
                    <button
                      onClick={() => setShowBackupCodes(!showBackupCodes)}
                      className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#1A222D] border border-[#D7E0EB] dark:border-[#242E3B] text-xs font-bold text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
                    >
                      {showBackupCodes ? 'Hide Codes' : 'View Codes'}
                    </button>
                  </div>

                  {showBackupCodes && (
                    <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs space-y-2">
                      <div className="text-amber-400 font-bold mb-2">Store these codes securely offline:</div>
                      <div className="grid grid-cols-2 gap-2 text-slate-300">
                        <span>1. 8839-2041-9921</span>
                        <span>2. 4410-9281-5532</span>
                        <span>3. 7729-1102-3384</span>
                        <span>4. 9942-7719-0021</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. NOTIFICATIONS CATEGORY */}
            {activeCategory === 'notifications' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#D7E0EB] dark:border-[#1E2633]">
                    <Bell className="w-5 h-5 text-[#8B5CF6]" />
                    <h2 className="text-base font-bold text-[#0F172A] dark:text-white">Notification Alert Preferences</h2>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        title: 'Trade Executions & Fills',
                        desc: 'Instant alert whenever your Limit or Market order fills on the spot/futures engine.',
                        checked: notifTradeFills,
                        onChange: () => setNotifTradeFills(!notifTradeFills),
                      },
                      {
                        title: 'Price Triggers & Volatility',
                        desc: 'Receive alerts when watched tokens move by ±5% in under 15 minutes.',
                        checked: notifPriceAlerts,
                        onChange: () => setNotifPriceAlerts(!notifPriceAlerts),
                      },
                      {
                        title: 'Security & New Device Logins',
                        desc: 'Mandatory security notifications for account safety (cannot be disabled).',
                        checked: notifSecurity,
                        disabled: true,
                        onChange: () => {},
                      },
                      {
                        title: 'Deposits & Withdrawals',
                        desc: 'Real-time blockchain confirmations and fiat transfer completion notices.',
                        checked: notifFinancial,
                        onChange: () => setNotifFinancial(!notifFinancial),
                      },
                      {
                        title: 'Product Announcements & Marketing',
                        desc: 'New coin listings, VIP rewards events, and platform feature releases.',
                        checked: notifMarketing,
                        onChange: () => setNotifMarketing(!notifMarketing),
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633] flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-[#0F172A] dark:text-white">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.desc}
                          </div>
                        </div>
                        <button
                          disabled={item.disabled}
                          onClick={item.onChange}
                          className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            item.checked ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'
                          } ${item.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                              item.checked ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Channels */}
                  <div className="pt-4 border-t border-[#D7E0EB] dark:border-[#1E2633]">
                    <h3 className="text-xs font-bold text-[#0F172A] dark:text-white mb-3">Notification Channels</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setChannelPush(!channelPush)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          channelPush
                            ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-[#8B5CF6] font-bold'
                            : 'bg-slate-50 dark:bg-[#141B24] border-[#D7E0EB] dark:border-[#1E2633] text-slate-500'
                        }`}
                      >
                        <div className="text-xs">Push Notification</div>
                        <div className="text-[10px] opacity-80">{channelPush ? 'Enabled' : 'Disabled'}</div>
                      </button>

                      <button
                        onClick={() => setChannelEmail(!channelEmail)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          channelEmail
                            ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-[#8B5CF6] font-bold'
                            : 'bg-slate-50 dark:bg-[#141B24] border-[#D7E0EB] dark:border-[#1E2633] text-slate-500'
                        }`}
                      >
                        <div className="text-xs">Email Digest</div>
                        <div className="text-[10px] opacity-80">{channelEmail ? 'Enabled' : 'Disabled'}</div>
                      </button>

                      <button
                        onClick={() => setChannelSms(!channelSms)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          channelSms
                            ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-[#8B5CF6] font-bold'
                            : 'bg-slate-50 dark:bg-[#141B24] border-[#D7E0EB] dark:border-[#1E2633] text-slate-500'
                        }`}
                      >
                        <div className="text-xs">SMS Text</div>
                        <div className="text-[10px] opacity-80">{channelSms ? 'Enabled' : 'Disabled'}</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. PREFERENCES CATEGORY */}
            {activeCategory === 'preferences' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Theme & Palette Selection */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#D7E0EB] dark:border-[#1E2633]">
                    <div className="flex items-center gap-2">
                      <Sun className="w-5 h-5 text-amber-500" />
                      <h2 className="text-base font-bold text-[#0F172A] dark:text-white">Theme & Display Colors</h2>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-purple-500/10 text-[#8B5CF6] capitalize">
                      {theme} mode
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      id="settings-theme-light-btn"
                      onClick={() => {
                        if (theme !== 'light' && onToggleTheme) onToggleTheme();
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        theme === 'light'
                          ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500'
                          : 'bg-slate-50 dark:bg-[#141B24] border-[#D7E0EB] dark:border-[#1E2633]'
                      }`}
                    >
                      <Sun className="w-5 h-5 text-amber-500 mb-2" />
                      <div className="text-xs font-bold text-[#0F172A] dark:text-white">Light Mode</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">High contrast crisp daytime layout</div>
                    </button>

                    <button
                      type="button"
                      id="settings-theme-dark-btn"
                      onClick={() => {
                        if (theme !== 'dark' && onToggleTheme) onToggleTheme();
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        theme === 'dark'
                          ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] ring-1 ring-[#8B5CF6]'
                          : 'bg-slate-50 dark:bg-[#141B24] border-[#D7E0EB] dark:border-[#1E2633]'
                      }`}
                    >
                      <Moon className="w-5 h-5 text-[#8B5CF6] mb-2" />
                      <div className="text-xs font-bold text-[#0F172A] dark:text-white">Dark Mode</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Obsidian midnight layout, battery safe</div>
                    </button>
                  </div>

                  {/* Candle Palette */}
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-[#0F172A] dark:text-white">Candlestick Palette</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Bullish & bearish market chart colors</div>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#1E2633]">
                      <button
                        onClick={() => {
                          setCandleTheme('classic');
                          localStorage.setItem('okn_candle_theme', 'classic');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          candleTheme === 'classic'
                            ? 'bg-white dark:bg-[#1E2633] text-slate-900 dark:text-white shadow-2xs'
                            : 'text-slate-500'
                        }`}
                      >
                        Classic (Green/Red)
                      </button>
                      <button
                        onClick={() => {
                          setCandleTheme('pro');
                          localStorage.setItem('okn_candle_theme', 'pro');
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          candleTheme === 'pro'
                            ? 'bg-white dark:bg-[#1E2633] text-slate-900 dark:text-white shadow-2xs'
                            : 'text-slate-500'
                        }`}
                      >
                        Pro (Cyan/Magenta)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Trading Engine Parameters */}
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#D7E0EB] dark:border-[#1E2633]">
                    <Zap className="w-5 h-5 text-[#8B5CF6]" />
                    <h2 className="text-base font-bold text-[#0F172A] dark:text-white">Trading Engine Speed & Execution</h2>
                  </div>

                  {/* Orderbook refresh rate */}
                  <div className="flex items-center justify-between py-2 border-b border-[#D7E0EB]/70 dark:border-[#1E2633]">
                    <div>
                      <div className="text-xs font-bold text-[#0F172A] dark:text-white">Orderbook Depth Frequency</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">WebSocket feed rate for bid/ask orders</div>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#1E2633]">
                      {(['50ms', '250ms', '1000ms'] as const).map((spd) => (
                        <button
                          key={spd}
                          onClick={() => {
                            setOrderbookSpeed(spd);
                            localStorage.setItem('okn_ob_speed', spd);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            orderbookSpeed === spd
                              ? 'bg-[#8B5CF6] text-white shadow-2xs'
                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {spd}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slippage tolerance */}
                  <div className="flex items-center justify-between py-2 border-b border-[#D7E0EB]/70 dark:border-[#1E2633]">
                    <div>
                      <div className="text-xs font-bold text-[#0F172A] dark:text-white">Default Slippage Tolerance</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Maximum price slippage permitted for swaps</div>
                    </div>
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#1E2633]">
                      {(['0.1%', '0.5%', '1.0%'] as const).map((slp) => (
                        <button
                          key={slp}
                          onClick={() => {
                            setSlippage(slp);
                            localStorage.setItem('okn_slippage', slp);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            slippage === slp
                              ? 'bg-[#8B5CF6] text-white shadow-2xs'
                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {slp}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audio & Haptic Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633] flex items-center justify-between">
                      <div className="text-xs font-bold text-[#0F172A] dark:text-white">Audio Chimes</div>
                      <button
                        onClick={() => {
                          const next = !audioChimes;
                          setAudioChimes(next);
                          localStorage.setItem('okn_audio', String(next));
                        }}
                        className={`w-9 h-5 rounded-full transition-colors relative ${audioChimes ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${audioChimes ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633] flex items-center justify-between">
                      <div className="text-xs font-bold text-[#0F172A] dark:text-white">Haptic Feedback</div>
                      <button
                        onClick={() => {
                          const next = !haptics;
                          setHaptics(next);
                          localStorage.setItem('okn_haptics', String(next));
                        }}
                        className={`w-9 h-5 rounded-full transition-colors relative ${haptics ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${haptics ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633] flex items-center justify-between">
                      <div className="text-xs font-bold text-[#0F172A] dark:text-white">GPU Acceleration</div>
                      <button
                        onClick={() => {
                          const next = !gpuAccel;
                          setGpuAccel(next);
                          localStorage.setItem('okn_gpu', String(next));
                        }}
                        className={`w-9 h-5 rounded-full transition-colors relative ${gpuAccel ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${gpuAccel ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Cache clearing */}
                  <div className="pt-3 border-t border-[#D7E0EB] dark:border-[#1E2633] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#0F172A] dark:text-white">Local Storage & Cache ({cacheSize})</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Clear cached candle historical chunks and market buffers</div>
                    </div>
                    <button
                      onClick={handleClearCache}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Cache</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 6. PAYMENT SETTINGS CATEGORY */}
            {activeCategory === 'payments' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#D7E0EB] dark:border-[#1E2633]">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#8B5CF6]" />
                      <h2 className="text-base font-bold text-[#0F172A] dark:text-white">Saved Payment Methods (Fiat & P2P)</h2>
                    </div>
                    <button
                      onClick={() => showToast('Opening payment gateway connector...')}
                      className="px-3 py-1.5 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Method</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {savedPaymentMethods.map((pm) => (
                      <div
                        key={pm.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-[#8B5CF6]">
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-bold text-xs sm:text-sm text-[#0F172A] dark:text-white">{pm.type}</div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{pm.detail}</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                          Verified
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Security Controls */}
                  <div className="pt-4 border-t border-[#D7E0EB] dark:border-[#1E2633] space-y-3">
                    <h3 className="text-xs font-bold text-[#0F172A] dark:text-white">Withdrawal & Transfer Protection</h3>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#0F172A] dark:text-white">Whitelist Address Only Mode</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Withdrawals restricted exclusively to pre-approved addresses</div>
                      </div>
                      <button
                        onClick={() => {
                          const next = !whitelistOnly;
                          setWhitelistOnly(next);
                          localStorage.setItem('okn_whitelist_only', String(next));
                          showToast(`Whitelist mode ${next ? 'activated' : 'deactivated'}`);
                        }}
                        className={`w-9 h-5 rounded-full transition-colors relative ${whitelistOnly ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${whitelistOnly ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#0F172A] dark:text-white">Instant Internal Zero-Fee Transfers</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Enable receiving instant transfers from other OK Nexus users via UID</div>
                      </div>
                      <button
                        onClick={() => {
                          const next = !instantTransfer;
                          setInstantTransfer(next);
                          localStorage.setItem('okn_instant_transfer', String(next));
                        }}
                        className={`w-9 h-5 rounded-full transition-colors relative ${instantTransfer ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${instantTransfer ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#0F172A] dark:text-white">24h Security Cooling Period</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Lock withdrawals for 24h when 2FA or password is modified</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                        Enforced
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. PRIVACY CATEGORY */}
            {activeCategory === 'privacy' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-[#D7E0EB] dark:border-[#1E2633]">
                    <Eye className="w-5 h-5 text-[#8B5CF6]" />
                    <h2 className="text-base font-bold text-[#0F172A] dark:text-white">Privacy & Visibility Controls</h2>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#0F172A] dark:text-white">Public Profile & Badges</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Display your VIP rank, trading volume badges & trophy showcase on leaderboards</div>
                      </div>
                      <button
                        onClick={() => {
                          const next = !showPublicProfile;
                          setShowPublicProfile(next);
                          localStorage.setItem('okn_public_profile', String(next));
                          showToast(`Public profile ${next ? 'visible' : 'hidden'}`);
                        }}
                        className={`w-9 h-5 rounded-full transition-colors relative ${showPublicProfile ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${showPublicProfile ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#0F172A] dark:text-white">P2P Online Status Indicator</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Show a green active badge to counterparties in the P2P marketplace</div>
                      </div>
                      <button
                        onClick={() => setShowOnlineStatus(!showOnlineStatus)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${showOnlineStatus ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${showOnlineStatus ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#0F172A] dark:text-white">Anonymized Orderbook Trades</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Mask your username in recent public trade feeds with "Trader_****"</div>
                      </div>
                      <button
                        onClick={() => setAnonymousTrading(!anonymousTrading)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${anonymousTrading ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${anonymousTrading ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#141B24] border border-[#D7E0EB]/70 dark:border-[#1E2633] flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#0F172A] dark:text-white">Auto-Hide Balances on Screen Share</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">Conceal portfolio figures with asterisks (••••••) when public</div>
                      </div>
                      <button
                        onClick={() => setAutoHideBalances(!autoHideBalances)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${autoHideBalances ? 'bg-[#8B5CF6]' : 'bg-slate-300 dark:bg-slate-700'}`}
                      >
                        <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${autoHideBalances ? 'left-4' : 'left-0.5'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. SESSIONS AND DEVICE MANAGEMENT CATEGORY */}
            {activeCategory === 'sessions' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D7E0EB] dark:border-[#1E2633]">
                    <div className="flex items-center gap-2">
                      <Laptop className="w-5 h-5 text-[#8B5CF6]" />
                      <h2 className="text-base font-bold text-[#0F172A] dark:text-white">Active Authorized Sessions</h2>
                    </div>
                    {sessions.length > 1 && (
                      <button
                        onClick={handleRevokeAllOtherSessions}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out All Other Devices</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {sessions.map((sess) => (
                      <div
                        key={sess.id}
                        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          sess.active
                            ? 'bg-purple-500/[0.04] dark:bg-purple-950/20 border-purple-500/30 ring-1 ring-purple-500/20'
                            : 'bg-slate-50 dark:bg-[#141B24] border-[#D7E0EB]/70 dark:border-[#1E2633]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl mt-0.5 ${
                            sess.active ? 'bg-purple-500/15 text-[#8B5CF6]' : 'bg-slate-200 dark:bg-[#1A222D] text-slate-500'
                          }`}>
                            <Laptop className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-[#0F172A] dark:text-white">
                                {sess.device}
                              </span>
                              {sess.active && (
                                <span className="px-2 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 text-[10px] font-bold">
                                  Current Device
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {sess.location}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {sess.lastActive}
                            </div>
                          </div>
                        </div>

                        {!sess.active && (
                          <button
                            onClick={() => handleRevokeSession(sess.id)}
                            className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold transition-all self-end sm:self-auto"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Security Activity Log */}
                  <div className="pt-4 border-t border-[#D7E0EB] dark:border-[#1E2633]">
                    <h3 className="text-xs font-bold text-[#0F172A] dark:text-white mb-2">Recent Login Security Audit</h3>
                    <div className="divide-y divide-[#D7E0EB]/60 dark:divide-[#1E2633] text-xs">
                      <div className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">Web Dashboard Login</div>
                          <div className="text-[10px] text-slate-500">102.89.44.12 • Safari 17.5 • Lagos, NG</div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600">Success (2FA Verified)</span>
                      </div>
                      <div className="py-2.5 flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200">API Key Usage</div>
                          <div className="text-[10px] text-slate-500">198.51.100.24 • REST Order Engine • New York, US</div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600">Success (Signed)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
