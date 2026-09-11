import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  User,
  Key,
  Bell,
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
  Sparkle,
  LineChart,
  Settings,
} from 'lucide-react';
import { OKNexusLogo } from '../common/OKNexusLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { ThemeMode } from '../../types';
import { POPULAR_NFT_AVATARS, OKN_OFFICIAL_AVATARS, AvatarPreset } from '../../data/avatarCollections';
import { SystemSettingsView } from './SystemSettingsView';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  initialTab?: 'profile' | 'system_settings';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
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
  initialTab = 'profile',
}) => {
  // Navigation view inside modal: 'profile' | 'system_settings'
  const [activeView, setActiveView] = useState<'profile' | 'system_settings'>(initialTab);

  useEffect(() => {
    if (isOpen) {
      setActiveView(initialTab || 'profile');
    }
  }, [isOpen, initialTab]);

  // Username editing state
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState(username);
  const [usernameSuccessMsg, setUsernameSuccessMsg] = useState('');

  // Avatar picker state
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [avatarCategory, setAvatarCategory] = useState<'nft' | 'okn' | 'device'>('nft');
  const [devicePreviewUrl, setDevicePreviewUrl] = useState<string | null>(null);
  const [avatarSuccessMsg, setAvatarSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 bg-black/70 dark:bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        id="profile-settings-modal"
        className="w-full max-w-lg bg-white dark:bg-[#0E141B] border-t sm:border border-[#D7E0EB] dark:border-[#242E3B] rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom animate-slideUp text-[#0F172A] dark:text-[#EDF1F5] max-h-[90vh] overflow-y-auto shadow-2xl transition-colors duration-200"
      >
        {activeView === 'system_settings' ? (
          <SystemSettingsView
            onBack={() => setActiveView('profile')}
            onClose={onClose}
            theme={theme}
            onToggleTheme={onToggleTheme}
            onOpenSupport={onOpenSupport}
          />
        ) : (
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#D7E0EB] dark:border-[#242E3B] mb-4">
              <div>
                <h3 className="font-bold text-base text-[#0F172A] dark:text-white flex items-center gap-2">
                  <span>Settings & Profile</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] dark:bg-[#8B5CF6]/20 dark:text-[#8B5CF6]">
                    User Center
                  </span>
                </h3>
                <p className="text-[11px] text-[#64748B] dark:text-[#8E98A6] mt-0.5">
                  Customize your profile, avatar, username, security, and display
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] dark:text-[#8E98A6] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#141B24] transition-colors"
                aria-label="Close Settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

        {/* Feedback Toasts */}
        {usernameSuccessMsg && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[#10B981] text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            {usernameSuccessMsg}
          </div>
        )}
        {avatarSuccessMsg && (
          <div className="mb-3 px-3 py-2 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] text-xs font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            {avatarSuccessMsg}
          </div>
        )}

        {/* User Identity & Avatar Profile Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/5 via-[#F8FAFC] to-[#8B5CF6]/5 dark:from-[#1F1735] dark:via-[#141224] dark:to-[#0A0E13] border border-[#8B5CF6]/20 dark:border-[#8B5CF6]/30 mb-4 shadow-xs transition-colors duration-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              {/* Profile Avatar with Edit Overlay */}
              <div className="relative group">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#F59E0B] p-[2.5px] shadow-md cursor-pointer"
                     onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}>
                  <div className="w-full h-full rounded-full bg-white dark:bg-[#0E141B] overflow-hidden flex items-center justify-center">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt="Profile avatar"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="font-bold font-display text-[#8B5CF6] text-base">
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
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              {/* Username & Verification Info */}
              <div>
                {isEditingUsername ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      placeholder="New username"
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-[#0E141B] border border-[#8B5CF6] text-[#0F172A] dark:text-white focus:outline-hidden w-36"
                      autoFocus
                      maxLength={25}
                    />
                    <button
                      type="button"
                      onClick={handleSaveUsername}
                      className="px-2 py-1 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-[11px] font-bold"
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
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-base text-[#0F172A] dark:text-white flex items-center gap-1.5">
                      <span>@{username}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setTempUsername(username);
                        setIsEditingUsername(true);
                      }}
                      className="text-[#64748B] hover:text-[#8B5CF6] transition-colors p-0.5"
                      title="Edit Username"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-[#10B981] dark:bg-emerald-500/20 text-[10px] font-bold border border-emerald-300 dark:border-emerald-500/30">
                      VIP 2
                    </span>
                  </div>
                )}

                <p className="text-xs text-[#64748B] dark:text-[#8E98A6] font-medium">
                  {userEmail}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-[#64748B] dark:text-[#8E98A6] font-mono-num mt-1">
                  <span>UID: {uid}</span>
                  <span className="text-slate-300 dark:text-white/20">•</span>
                  <span className="text-[#10B981] font-semibold flex items-center gap-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 inline" /> KYC Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Change Picture Trigger Button */}
            <button
              type="button"
              onClick={() => setIsAvatarPickerOpen(!isAvatarPickerOpen)}
              className="px-2.5 py-1.5 rounded-xl bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30 text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{isAvatarPickerOpen ? 'Hide' : 'Change Avatar'}</span>
            </button>
          </div>

          {/* AVATAR PICKER DRAWER / SECTION */}
          {isAvatarPickerOpen && (
            <div className="mt-4 pt-4 border-t border-[#D7E0EB] dark:border-[#242E3B] space-y-3">
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
                    Reset to Initial
                  </button>
                )}
              </div>

              {/* Category Segmented Tabs */}
              <div className="flex items-center gap-1.5 bg-[#F8FAFC] dark:bg-[#0A0E13] p-1 rounded-xl border border-[#D7E0EB] dark:border-[#242E3B]">
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

              {/* Content Panel: NFT Collections */}
              {avatarCategory === 'nft' && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-1">
                  {POPULAR_NFT_AVATARS.map((nft) => {
                    const isSelected = userAvatar === nft.url;
                    return (
                      <button
                        key={nft.id}
                        type="button"
                        onClick={() => handleSelectPresetAvatar(nft)}
                        className={`relative group p-1.5 rounded-2xl border transition-all flex flex-col items-center gap-1.5 text-center ${
                          isSelected
                            ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] ring-2 ring-[#8B5CF6]/40'
                            : 'bg-white dark:bg-[#141B24] border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#8B5CF6]'
                        }`}
                        title={`${nft.name} (${nft.rarity})`}
                      >
                        <div className="w-11 h-11 rounded-full overflow-hidden border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs">
                          <img src={nft.url} alt={nft.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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

              {/* Content Panel: OKN Collections */}
              {avatarCategory === 'okn' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {OKN_OFFICIAL_AVATARS.map((okn) => {
                    const isSelected = userAvatar === okn.url;
                    return (
                      <button
                        key={okn.id}
                        type="button"
                        onClick={() => handleSelectPresetAvatar(okn)}
                        className={`relative group p-2 rounded-2xl border transition-all flex flex-col items-center gap-1.5 text-center ${
                          isSelected
                            ? 'bg-[#8B5CF6]/15 border-[#8B5CF6] ring-2 ring-[#8B5CF6]/40'
                            : 'bg-white dark:bg-[#141B24] border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#8B5CF6]'
                        }`}
                        title={`${okn.name} (${okn.rarity})`}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-[#D7E0EB] dark:border-[#242E3B] shadow-xs">
                          <img src={okn.url} alt={okn.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <span className="text-[10px] font-bold text-[#0F172A] dark:text-[#EDF1F5] truncate w-full">
                          {okn.name}
                        </span>
                        <span className="text-[9px] text-[#F59E0B] font-semibold">
                          {okn.badge}
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

              {/* Content Panel: Device Photo Upload */}
              {avatarCategory === 'device' && (
                <div className="p-4 rounded-2xl bg-white dark:bg-[#141B24] border border-dashed border-[#8B5CF6]/40 text-center space-y-3">
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
                        <img src={devicePreviewUrl} alt="Device preview" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-bold text-[#0F172A] dark:text-white">Image Uploaded Successfully</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1 rounded-lg bg-[#F8FAFC] dark:bg-[#0E141B] text-xs font-semibold hover:bg-slate-200"
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
                          Click or drag image to upload
                        </p>
                        <p className="text-[11px] text-[#64748B] dark:text-[#8E98A6] mt-0.5">
                          PNG, JPG, WEBP, or GIF up to 5MB
                        </p>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-xs inline-flex items-center gap-1.5"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Browse Device Files</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Settings options list */}
        <div className="space-y-3 text-xs">
          {/* Section: System Settings & Advanced (Requirement 4) */}
          <div
            id="profile-system-settings-option-btn"
            onClick={() => setActiveView('system_settings')}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/10 via-[#8B5CF6]/5 to-transparent hover:from-[#8B5CF6]/15 hover:to-[#8B5CF6]/10 border border-[#8B5CF6]/30 cursor-pointer transition-all active:scale-[0.99] group shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#8B5CF6] text-white flex items-center justify-center shadow-xs">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#0F172A] dark:text-white">
                    System Settings
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-500/30 border border-purple-200 text-[10px] font-bold">
                    ADVANCED
                  </span>
                </div>
                <span className="text-[11px] text-[#64748B] dark:text-[#8E98A6] block mt-0.5">
                  Light/Dark theme, orderbook latency & hardware controls
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#8B5CF6] capitalize hidden sm:inline">
                {theme} Mode
              </span>
              <ChevronRight className="w-4 h-4 text-[#8B5CF6] group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Section: Appearance & Theme (Requirement 3: Centralized in System Settings) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8E98A6] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#8B5CF6]" />
                Appearance & Display
              </span>
              <span className="text-[11px] font-medium text-[#64748B] dark:text-[#8E98A6] capitalize">
                {theme === 'dark' ? 'Night mode' : 'Day mode'}
              </span>
            </div>

            {/* Appearance / Theme Selector Card */}
            <div
              id="profile-theme-settings-card"
              onClick={() => setActiveView('system_settings')}
              className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#141B24] border border-[#D7E0EB] dark:border-[#242E3B] hover:border-[#8B5CF6]/40 cursor-pointer shadow-xs transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 dark:bg-purple-900/30 text-[#8B5CF6] flex items-center justify-center">
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#0F172A] dark:text-white flex items-center gap-1.5">
                    <span>Display Theme</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-700 dark:text-slate-300 font-mono capitalize">
                      {theme} mode
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#8E98A6]">
                    Managed in System Settings
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#8B5CF6] flex items-center gap-1">
                Configure <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>

          {/* Section: Security & Access */}
          <div className="space-y-2 pt-1">
            <div className="px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8E98A6] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
                Security & Authentication
              </span>
            </div>

            {/* Two-Factor Authentication (2FA) */}
            <div
              id="profile-2fa-card"
              className="rounded-2xl border p-3.5 bg-[#F8FAFC] dark:bg-[#141B24] border-[#D7E0EB] dark:border-[#242E3B] shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#10B981] dark:bg-emerald-950/60 dark:border-emerald-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold block text-[#0F172A] dark:text-white">Two-Factor Authentication</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-[#10B981] dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/30">
                        ACTIVE
                      </span>
                    </div>
                    <span className="text-[11px] text-[#64748B] dark:text-[#8E98A6] block mt-0.5">
                      Google Authenticator & TOTP token active for withdrawals and API keys.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Portfolio Analytics & P&L Option */}
            <div
              id="profile-analytics-btn"
              onClick={() => {
                onClose();
                if (onOpenAnalytics) onOpenAnalytics();
              }}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 cursor-pointer transition-all active:scale-[0.99] group shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#8B5CF6] text-white flex items-center justify-center shadow-xs">
                  <LineChart className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs sm:text-sm text-[#0F172A] dark:text-white">Portfolio Analytics</span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-[#10B981] dark:bg-emerald-500/20 text-[9px] font-bold border border-emerald-300 dark:border-emerald-500/30">
                      P&L PRO
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64748B] dark:text-[#8E98A6] block mt-0.5">
                    Win rate, ROI curves, performance breakdown & logs
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8B5CF6] group-hover:translate-x-0.5 transition-transform" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] dark:bg-[#141B24] dark:hover:bg-[#1E2633] border border-[#D7E0EB] dark:border-[#242E3B] cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <Key className="w-4 h-4 text-[#8B5CF6]" />
                <span className="font-medium text-[#0F172A] dark:text-[#EDF1F5]">API Management</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#64748B] dark:text-[#8E98A6]" />
            </div>

            <div
              id="profile-support-btn"
              onClick={() => {
                onClose();
                if (onOpenSupport) onOpenSupport();
              }}
              className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] dark:bg-[#141B24] dark:hover:bg-[#1E2633] border border-[#D7E0EB] dark:border-[#242E3B] cursor-pointer transition-colors active:scale-98"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-[#8B5CF6]" />
                <span className="font-medium text-[#0F172A] dark:text-[#EDF1F5]">Help Center & 24/7 Support</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#64748B] dark:text-[#8E98A6]" />
            </div>

            <button
              onClick={() => {
                onClose();
                if (onSignOut) onSignOut();
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[#EF4444] hover:bg-rose-500/20 font-bold mt-3 transition-colors active:scale-98"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

