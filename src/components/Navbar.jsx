// src/components/Navbar.jsx
import React from 'react';
import { Volume2, VolumeX, Shield, ShieldAlert, LogOut, Mail, Sword, Sliders, Sparkles } from 'lucide-react';
import { sounds } from '../soundEffects';

export function Navbar({
  isDemo,
  user,
  onLogout,
  onOpenConnectModal,
  onOpenAudioSettings,
  isMuted,
  onToggleSound,
  safeDeleteEnabled,
  onToggleSafeDelete,
  onGoHome,
}) {
  return (
    <header className="border-b border-slate-800 bg-[#080d18]/90 backdrop-blur-md sticky top-0 z-50 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Mascot Shield */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 group text-left transition focus:outline-none cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-500 to-pink-500 p-[2px] shadow-neon-cyan group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#080b11] rounded-[10px] flex items-center justify-center">
              <Sword className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-arcade text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-pink-500">
                INBOX QUEST
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold">
                PROD
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-tight -mt-0.5">
              Gamified Digital Chore Slaying
            </p>
          </div>
        </button>

        {/* Status Pills & Audio Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Mode Indicator Badge */}
          {isDemo ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="hidden sm:inline">MODE:</span> DEMO QUEST (SIMULATED)
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">MODE:</span> REAL GMAIL CONNECTED
            </div>
          )}

          {/* Safe Deletion Guard Toggle */}
          <button
            onClick={onToggleSafeDelete}
            title={safeDeleteEnabled ? "Safe Trash Guard: Asks confirmation before moving to Trash" : "Instant Trash: Trashes without asking"}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition border cursor-pointer ${
              safeDeleteEnabled
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {safeDeleteEnabled ? <Shield className="w-3.5 h-3.5 text-blue-400" /> : <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />}
            <span>Safety Guard: {safeDeleteEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Audio Controls Group (Quick Mute + Settings Modal Button) */}
          <div className="flex items-center rounded-lg bg-slate-800/60 border border-slate-700/80 p-0.5">
            <button
              onClick={onToggleSound}
              title={isMuted ? "Unmute Audio" : "Quick Mute Audio"}
              className="p-1.5 rounded-md text-slate-300 hover:text-cyan-400 transition cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <button
              onClick={onOpenAudioSettings}
              title="Open Audio Settings (SFX & BGM Volume)"
              className="p-1.5 rounded-md text-slate-400 hover:text-white transition cursor-pointer border-l border-slate-700/60"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Auth Info / Connect */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name || 'User'}
                  className="w-8 h-8 rounded-full border border-emerald-400"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs text-white">
                  {(user.name || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <div className="hidden lg:block text-left text-xs">
                <p className="font-medium text-slate-200 truncate max-w-[120px]">{user.name || user.email}</p>
                <p className="text-[10px] text-emerald-400 font-mono">Gmail Linked</p>
              </div>
              <button
                onClick={onLogout}
                title="Disconnect Gmail"
                className="p-2 text-slate-400 hover:text-red-400 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenConnectModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition shadow-sm cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Connect</span> Gmail
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
