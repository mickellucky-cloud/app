import React from 'react';
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
  ScanFace,
  Fingerprint,
  Sparkles,
} from 'lucide-react';
import { OKNexusLogo } from '../common/OKNexusLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { ThemeMode } from '../../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  uid?: string;
  onSignOut?: () => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
  biometricsEnabled?: boolean;
  onToggleBiometrics?: (enabled: boolean) => void;
  biometricType?: 'face_id' | 'fingerprint';
  onChangeBiometricType?: (type: 'face_id' | 'fingerprint') => void;
  onTestBiometrics?: () => void;
  onOpenSupport?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userEmail = 'trader.alex@oknexus.io',
  uid = '8829410',
  onSignOut,
  theme = 'dark',
  onToggleTheme,
  biometricsEnabled = false,
  onToggleBiometrics,
  biometricType = 'face_id',
  onChangeBiometricType,
  onTestBiometrics,
  onOpenSupport,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#0F1320] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl p-5 safe-area-bottom animate-slideUp text-slate-100 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
          <h3 className="font-bold text-base text-white">Account & Security</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Badge Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1F1735] via-[#141224] to-[#0A0D16] border border-purple-500/30 mb-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-amber-400 p-[2px] shadow-sm">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <span className="font-bold font-display text-white text-sm">MK</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-white">{userEmail}</h4>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  VIP 2
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono-num mt-0.5">
                <span>UID: {uid}</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 inline" /> KYC Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings options list */}
        <div className="space-y-1.5 text-xs">
          {/* Appearance / Theme Toggle */}
          <div
            id="profile-theme-toggle-row"
            className="flex items-center justify-between p-3 rounded-xl bg-[#090C14] border border-white/[0.06] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-purple-950/80 text-purple-400' : 'bg-amber-100 text-amber-600'}`}>
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </div>
              <div>
                <span className="font-semibold block text-white">Display Theme</span>
                <span className="text-[11px] text-slate-400">
                  {theme === 'dark' ? 'Night mode active' : 'Day mode active'}
                </span>
              </div>
            </div>
            {onToggleTheme && (
              <ThemeToggle
                theme={theme}
                onToggle={onToggleTheme}
                size="sm"
              />
            )}
          </div>

          {/* Biometric Authentication (Face ID / Fingerprint) */}
          <div
            id="profile-biometrics-card"
            className={`rounded-xl border transition-all p-3 ${
              biometricsEnabled
                ? 'bg-gradient-to-r from-purple-950/40 via-[#0C101E] to-[#0A1224] border-purple-500/40 shadow-sm'
                : 'bg-[#090C14] border-white/[0.06] hover:bg-white/[0.03]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    biometricsEnabled
                      ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                      : 'bg-white/[0.05] text-slate-400'
                  }`}
                >
                  {biometricType === 'fingerprint' ? (
                    <Fingerprint className="w-4 h-4" />
                  ) : (
                    <ScanFace className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold block text-white">Biometric Unlock</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                        biometricsEnabled
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {biometricsEnabled ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {biometricsEnabled
                      ? 'Extra biometric scan required after login before dashboard'
                      : 'Require Face ID or Touch ID after initial login'}
                  </span>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                id="profile-biometrics-toggle-btn"
                role="switch"
                aria-checked={biometricsEnabled}
                onClick={() => onToggleBiometrics && onToggleBiometrics(!biometricsEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  biometricsEnabled ? 'bg-purple-600' : 'bg-slate-800'
                }`}
                title="Toggle Biometric Authentication"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    biometricsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sub-controls when enabled: Face ID vs Touch ID selector & Test prompt button */}
            {biometricsEnabled && (
              <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 bg-[#06080F] p-0.5 rounded-lg border border-white/[0.06]">
                  <button
                    type="button"
                    onClick={() => onChangeBiometricType && onChangeBiometricType('face_id')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-all ${
                      biometricType === 'face_id'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ScanFace className="w-3 h-3" />
                    <span>Face ID</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeBiometricType && onChangeBiometricType('fingerprint')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-all ${
                      biometricType === 'fingerprint'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Fingerprint className="w-3 h-3" />
                    <span>Touch ID</span>
                  </button>
                </div>

                {onTestBiometrics && (
                  <button
                    type="button"
                    id="profile-test-biometrics-btn"
                    onClick={onTestBiometrics}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 active:scale-95 transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    <span>Test Prompt ⚡</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#090C14] border border-white/[0.06] hover:bg-white/[0.03] cursor-pointer">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Two-Factor Authentication (2FA)</span>
            </div>
            <span className="text-emerald-400 font-semibold">Enabled</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#090C14] border border-white/[0.06] hover:bg-white/[0.03] cursor-pointer">
            <div className="flex items-center gap-3">
              <Key className="w-4 h-4 text-purple-400" />
              <span>API Management</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#090C14] border border-white/[0.06] hover:bg-white/[0.03] cursor-pointer">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-purple-400" />
              <span>Trading Preferences</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          <div
            id="profile-support-btn"
            onClick={() => {
              onClose();
              if (onOpenSupport) onOpenSupport();
            }}
            className="flex items-center justify-between p-3 rounded-xl bg-[#090C14] border border-white/[0.06] hover:bg-white/[0.03] cursor-pointer transition-colors active:scale-98"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>Help Center & 24/7 Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          <button
            onClick={() => {
              onClose();
              if (onSignOut) onSignOut();
            }}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 font-bold mt-3 transition-colors active:scale-98"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
