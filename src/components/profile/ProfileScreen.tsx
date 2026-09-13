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
} from 'lucide-react';
import { ThemeMode } from '../../types';
import { POPULAR_NFT_AVATARS, OKN_OFFICIAL_AVATARS, AvatarPreset } from '../../data/avatarCollections';
import { SystemSettingsView } from '../modals/SystemSettingsView';
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
  onBack: () => void;
  initialSubView?: 'profile' | 'system_settings';
  isLoading?: boolean;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userEmail = 'trader.alex@oknexus.io',
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
  onBack,
  initialSubView = 'profile',
  isLoading = false,
}) => {
  const [activeSubView, setActiveSubView] = useState<'profile' | 'system_settings'>(initialSubView);

  // Username editing state
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [usernameSuccessMsg, setUsernameSuccessMsg] = useState('');

  // Avatar picker state
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [avatarCategory, setAvatarCategory] = useState<'nft' | 'okn' | 'device'>('nft');
  const [devicePreviewUrl, setDevicePreviewUrl] = useState<string | null>(null);
  const [avatarSuccessMsg, setAvatarSuccessMsg] = useState('');
  const [copiedUid, setCopiedUid] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) {
    return <ProfileSkeleton onBack={onBack} />;
  }

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
      setUsernameSuccessMsg('Username updated successfully!');
      setTimeout(() => setUsernameSuccessMsg(''), 2500);
    }
  };

  const handleSelectPresetAvatar = (preset: AvatarPreset) => {
    if (onUpdateAvatar) onUpdateAvatar(preset.url);
    setAvatarSuccessMsg(`Avatar updated: ${preset.name}`);
    setTimeout(() => setAvatarSuccessMsg(''), 2500);
    setIsAvatarPickerOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAvatarSuccessMsg('Error: Image must be under 5MB');
        setTimeout(() => setAvatarSuccessMsg(''), 3000);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setDevicePreviewUrl(result);
          if (onUpdateAvatar) onUpdateAvatar(result);
          setAvatarSuccessMsg('Custom device photo applied!');
          setTimeout(() => setAvatarSuccessMsg(''), 2500);
          setIsAvatarPickerOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetAvatar = () => {
    if (onUpdateAvatar) onUpdateAvatar('');
    setDevicePreviewUrl(null);
    setAvatarSuccessMsg('Avatar reset to default');
    setTimeout(() => setAvatarSuccessMsg(''), 2500);
  };

  if (activeSubView === 'system_settings') {
    return (
      <div className="min-h-screen bg-white dark:bg-[#07090E] text-[#0F172A] dark:text-[#EDF1F5] pb-24 transition-colors">
        {/* Top App Bar for Standalone Mobile View */}
        <div className="sticky top-0 z-30 bg-white/95 dark:bg-[#07090E]/95 backdrop-blur-md border-b border-[#D7E0EB] dark:border-[#1E2633] px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveSubView('profile')}
            className="flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </button>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] dark:bg-[#8B5CF6]/20">
            System Settings
          </span>
        </div>

        <div className="max-w-xl mx-auto p-4">
          <SystemSettingsView
            onBack={() => setActiveSubView('profile')}
            onClose={onBack}
            theme={theme}
            onToggleTheme={onToggleTheme}
            onOpenSupport={onOpenSupport}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      id="standalone-profile-page"
      className="min-h-screen bg-white dark:bg-[#07090E] text-[#0F172A] dark:text-[#EDF1F5] pb-28 transition-colors"
    >
      {/* Standalone Page Header */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#07090E]/95 backdrop-blur-md border-b border-[#D7E0EB] dark:border-[#1E2633] px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-xl text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#141B24] transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-extrabold text-base sm:text-lg text-[#0F172A] dark:text-white flex items-center gap-2">
              <span>Account & Profile</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] dark:bg-[#8B5CF6]/20">
                User Center
              </span>
            </h1>
            <p className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">
              Personal identity, preferences & security
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] text-[#64748B] dark:text-[#8E98A6] hover:text-[#8B5CF6] transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
        {/* Feedback Toasts */}
        {usernameSuccessMsg && (
          <div className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[#10B981] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            {usernameSuccessMsg}
          </div>
        )}
        {avatarSuccessMsg && (
          <div className="px-3.5 py-2.5 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4" />
            {avatarSuccessMsg}
          </div>
        )}

        {/* User Profile Hero Card */}
        <section
          id="profile-hero-card"
          className="p-5 rounded-3xl bg-gradient-to-br from-[#8B5CF6]/8 via-slate-50 to-[#8B5CF6]/5 dark:from-[#1F1735]/60 dark:via-[#141224] dark:to-[#0A0E13] border border-[#8B5CF6]/20 dark:border-[#8B5CF6]/30 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Profile Avatar with Edit Overlay */}
              <div className="relative group">
                <div
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#F59E0B] p-[2.5px] shadow-md cursor-pointer"
                  onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
                >
                  <div className="w-full h-full rounded-full bg-white dark:bg-[#0E141B] overflow-hidden flex items-center justify-center">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt="Profile avatar"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="font-bold font-display text-[#8B5CF6] text-lg">
                        {username.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-md hover:bg-[#7C3AED] transition-transform active:scale-95"
                  title="Change Avatar"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Username & Identifiers */}
              <div className="min-w-0">
                {isEditingUsername ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      placeholder="New username"
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-[#0E141B] border border-[#8B5CF6] text-[#0F172A] dark:text-white focus:outline-hidden w-40"
                      autoFocus
                      maxLength={25}
                    />
                    <button
                      type="button"
                      onClick={handleSaveUsername}
                      className="px-2.5 py-1 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[11px] font-bold"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTempUsername(username);
                        setIsEditingUsername(false);
                      }}
                      className="p-1 text-[#64748B] hover:text-[#0F172A] dark:hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="font-extrabold text-lg text-[#0F172A] dark:text-white truncate">
                      @{username}
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setTempUsername(username);
                        setIsEditingUsername(true);
                      }}
                      className="text-[#64748B] hover:text-[#8B5CF6] transition-colors p-1"
                      title="Edit Username"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#10B981] dark:bg-emerald-500/20 text-[10px] font-bold border border-emerald-300 dark:border-emerald-500/30">
                      VIP 2
                    </span>
                  </div>
                )}

                <p className="text-xs text-[#64748B] dark:text-[#8E98A6] font-medium truncate mt-0.5">
                  {userEmail}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-[#64748B] dark:text-[#8E98A6] font-mono mt-1.5">
                  <span>UID: {uid}</span>
                  <button
                    type="button"
                    onClick={handleCopyUid}
                    className="text-[#8B5CF6] hover:text-[#7C3AED] transition-colors inline-flex items-center gap-0.5"
                    title="Copy UID"
                  >
                    {copiedUid ? (
                      <CheckCheck className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                  <span className="text-slate-300 dark:text-white/20">•</span>
                  <span className="text-[#10B981] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 inline" /> Verified Tier 2
                  </span>
                </div>
              </div>
            </div>

            {/* Change Avatar Button */}
            <button
              type="button"
              onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
              className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30 text-xs font-semibold flex items-center gap-2 transition-all shrink-0"
            >
              <Palette className="w-4 h-4" />
              <span>{isAvatarPickerOpen ? 'Hide Picker' : 'Change Avatar'}</span>
            </button>
          </div>

          {/* AVATAR PICKER DRAWER / SECTION */}
          {isAvatarPickerOpen && (
            <div className="mt-5 pt-4 border-t border-[#D7E0EB] dark:border-[#242E3B] space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A] dark:text-[#EDF1F5] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  Choose Profile Picture
                </span>
                {userAvatar && (
                  <button
                    type="button"
                    onClick={handleResetAvatar}
                    className="text-[11px] text-[#EF4444] hover:underline font-medium flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset to Default
                  </button>
                )}
              </div>

              {/* Category Segmented Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0A0E13] p-1 rounded-xl border border-[#D7E0EB] dark:border-[#242E3B]">
                <button
                  type="button"
                  onClick={() => setAvatarCategory('nft')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    avatarCategory === 'nft'
                      ? 'bg-[#8B5CF6] text-white shadow-xs'
                      : 'text-[#64748B] dark:text-[#8E98A6] hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                >
                  NFT Collections
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarCategory('okn')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    avatarCategory === 'okn'
                      ? 'bg-[#8B5CF6] text-white shadow-xs'
                      : 'text-[#64748B] dark:text-[#8E98A6] hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                >
                  OKN Official
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarCategory('device')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    avatarCategory === 'device'
                      ? 'bg-[#8B5CF6] text-white shadow-xs'
                      : 'text-[#64748B] dark:text-[#8E98A6] hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                >
                  Upload Photo
                </button>
              </div>

              {/* NFT Presets */}
              {avatarCategory === 'nft' && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-1">
                  {POPULAR_NFT_AVATARS.map((nft) => {
                    const isSelected = userAvatar === nft.url;
                    return (
                      <button
                        key={nft.id}
                        type="button"
                        onClick={() => handleSelectPresetAvatar(nft)}
                        className={`relative group p-2 rounded-2xl border transition-all flex flex-col items-center gap-1.5 text-center ${
                          isSelected
                            ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] ring-2 ring-[#8B5CF6]/40'
                            : 'bg-white dark:bg-[#141B24] border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#8B5CF6]'
                        }`}
                        title={`${nft.name} (${nft.rarity})`}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs">
                          <img
                            src={nft.url}
                            alt={nft.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-[#0F172A] dark:text-[#EDF1F5] truncate w-full">
                          {nft.badge || nft.name}
                        </span>
                        {isSelected && (
                          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-[10px]">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* OKN Official Presets */}
              {avatarCategory === 'okn' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {OKN_OFFICIAL_AVATARS.map((okn) => {
                    const isSelected = userAvatar === okn.url;
                    return (
                      <button
                        key={okn.id}
                        type="button"
                        onClick={() => handleSelectPresetAvatar(okn)}
                        className={`relative group p-2.5 rounded-2xl border transition-all flex flex-col items-center gap-1.5 text-center ${
                          isSelected
                            ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] ring-2 ring-[#8B5CF6]/40'
                            : 'bg-white dark:bg-[#141B24] border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#8B5CF6]'
                        }`}
                        title={`${okn.name} (${okn.rarity})`}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs">
                          <img
                            src={okn.url}
                            alt={okn.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-[#0F172A] dark:text-[#EDF1F5] truncate w-full">
                          {okn.name}
                        </span>
                        <span className="text-[9px] text-[#F59E0B] font-semibold">{okn.badge}</span>
                        {isSelected && (
                          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center text-[10px]">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Device Upload */}
              {avatarCategory === 'device' && (
                <div className="p-5 rounded-2xl bg-white dark:bg-[#141B24] border border-dashed border-[#8B5CF6]/40 text-center space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  {devicePreviewUrl ? (
                    <div className="space-y-2">
                      <div className="w-16 h-16 rounded-full overflow-hidden mx-auto border-2 border-[#8B5CF6] shadow-md">
                        <img
                          src={devicePreviewUrl}
                          alt="Device preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs font-bold text-[#0F172A] dark:text-white">
                        Custom Image Uploaded
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-100 dark:bg-[#0E141B] text-xs font-semibold hover:bg-slate-200"
                      >
                        Choose Different Photo
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer space-y-2 py-2"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#0F172A] dark:text-white">
                          Click to upload an image from device
                        </p>
                        <p className="text-[11px] text-[#64748B] dark:text-[#8E98A6] mt-0.5">
                          PNG, JPG, WEBP, or GIF up to 5MB
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Browse Files</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Quick Navigation Cards */}
        <div className="space-y-3">
          {/* Section: System Settings & Advanced Controls */}
          <div
            id="standalone-profile-settings-btn"
            onClick={() => setActiveSubView('system_settings')}
            className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/10 via-[#8B5CF6]/5 to-transparent hover:from-[#8B5CF6]/15 hover:to-[#8B5CF6]/10 border border-[#8B5CF6]/30 cursor-pointer transition-all active:scale-[0.99] group shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6] text-white flex items-center justify-center shadow-xs">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm sm:text-base text-[#0F172A] dark:text-white">
                    System Settings
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-500/30 border border-purple-200 text-[10px] font-bold">
                    PRO TRADING
                  </span>
                </div>
                <span className="text-[12px] text-[#64748B] dark:text-[#8E98A6] block mt-0.5">
                  Theme mode, orderbook refresh latency, haptics & audio chimes
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8B5CF6] capitalize hidden sm:inline">
                {theme} Mode
              </span>
              <ChevronRight className="w-5 h-5 text-[#8B5CF6] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Section: Security & Authentication Overview */}
          <div className="rounded-2xl border p-4 bg-slate-50 dark:bg-[#141B24] border-[#D7E0EB] dark:border-[#242E3B] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8E98A6]">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                Security & Authentication
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                HIGH SECURITY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B]">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-4 h-4 text-[#8B5CF6]" />
                  <div>
                    <span className="font-bold text-xs block text-[#0F172A] dark:text-white">
                      Google 2FA
                    </span>
                    <span className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">
                      Enabled for withdrawal
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-500">Active</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#0E141B] border border-[#D7E0EB] dark:border-[#242E3B]">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-[#10B981]" />
                  <div>
                    <span className="font-bold text-xs block text-[#0F172A] dark:text-white">
                      Anti-Phishing Code
                    </span>
                    <span className="text-[10px] text-[#64748B] dark:text-[#8E98A6]">
                      Verified emails only
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-500">OKN-***</span>
              </div>
            </div>
          </div>

          {/* Section: Shortcuts & Services */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8E98A6] px-1 block">
              Preferences & Services
            </span>

            {/* Portfolio Analytics */}
            {onOpenAnalytics && (
              <div
                id="standalone-profile-analytics-btn"
                onClick={onOpenAnalytics}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#8B5CF6]/50 cursor-pointer transition-all active:scale-[0.99] group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                    <LineChart className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-[#0F172A] dark:text-white">
                        Portfolio Analytics & P&L
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-[#10B981] dark:bg-emerald-500/20 text-[9px] font-bold border border-emerald-300 dark:border-emerald-500/30">
                        P&L PRO
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748B] dark:text-[#8E98A6] block mt-0.5">
                      Daily profit curves, ROI performance breakdown & win rate
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8B5CF6] group-hover:translate-x-0.5 transition-transform" />
              </div>
            )}

            {/* API Management */}
            {onOpenApiManagement && (
              <div
                id="standalone-profile-api-btn"
                onClick={onOpenApiManagement}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#8B5CF6]/50 cursor-pointer transition-all active:scale-[0.99] group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#0F172A] dark:text-white block">
                      API Management
                    </span>
                    <span className="text-[11px] text-[#64748B] dark:text-[#8E98A6] block mt-0.5">
                      Create and manage HMAC-SHA256 programmatic trading keys
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B] dark:text-[#8E98A6] group-hover:translate-x-0.5 transition-transform" />
              </div>
            )}

            {/* Help & Support */}
            {onOpenSupport && (
              <div
                id="standalone-profile-support-btn"
                onClick={onOpenSupport}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#8B5CF6]/50 cursor-pointer transition-all active:scale-[0.99] group shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#0F172A] dark:text-white block">
                      Help Center & 24/7 Live Support
                    </span>
                    <span className="text-[11px] text-[#64748B] dark:text-[#8E98A6] block mt-0.5">
                      Frequently asked questions, ticket management & live assistant
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748B] dark:text-[#8E98A6] group-hover:translate-x-0.5 transition-transform" />
              </div>
            )}

            {/* Sign Out Action */}
            {onSignOut && (
              <button
                type="button"
                id="standalone-profile-signout-btn"
                onClick={onSignOut}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-[#EF4444] hover:bg-rose-500/20 font-bold mt-4 transition-all active:scale-98 shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out of OKNexus</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
