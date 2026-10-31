// src/components/AudioSettingsModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Music, Bell, Sliders, Check } from 'lucide-react';
import { sounds } from '../soundEffects';

export function AudioSettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState(sounds.getSettings());

  useEffect(() => {
    if (isOpen) {
      setSettings(sounds.getSettings());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleMute = () => {
    const isMuted = sounds.toggleMute();
    setSettings(prev => ({ ...prev, isMuted }));
  };

  const handleSfxChange = (e) => {
    const val = parseFloat(e.target.value);
    sounds.setSfxVolume(val);
    setSettings(prev => ({ ...prev, sfxVolume: val }));
  };

  const handleBgmChange = (e) => {
    const val = parseFloat(e.target.value);
    sounds.setBgmVolume(val);
    setSettings(prev => ({ ...prev, bgmVolume: val }));
  };

  const handleTestSfx = () => {
    sounds.playCorrectClassification();
  };

  const handleResetDefaults = () => {
    sounds.setSfxVolume(0.65);
    sounds.setBgmVolume(0.28);
    if (settings.isMuted) sounds.toggleMute();
    setSettings(sounds.getSettings());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-[#0f1624] border border-cyan-500/40 rounded-2xl shadow-neon-cyan p-6 text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-arcade text-lg font-bold text-white tracking-wide">
                AUDIO SETTINGS
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Procedural Sound & Futuristic Ambience
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Sound ON/OFF */}
        <div className="bg-[#141e30] border border-slate-800 rounded-xl p-3.5 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {settings.isMuted ? (
              <VolumeX className="w-5 h-5 text-red-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-400" />
            )}
            <div>
              <span className="text-sm font-semibold text-white block">
                Master Audio: {settings.isMuted ? 'OFF (MUTED)' : 'ON'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {settings.isMuted ? 'All sounds and background audio silenced' : 'Audio active'}
              </span>
            </div>
          </div>

          <button
            onClick={handleToggleMute}
            className={`px-3 py-1.5 rounded-lg text-xs font-arcade font-bold tracking-wider transition ${
              settings.isMuted
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-neon-emerald'
            }`}
          >
            {settings.isMuted ? 'UNMUTE' : 'MUTE'}
          </button>
        </div>

        {/* Sound Effects (SFX) Volume Slider */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Bell className="w-4 h-4 text-cyan-400" />
              Game Effects Volume (SFX)
            </span>
            <span className="text-cyan-400 font-bold">{Math.round(settings.sfxVolume * 100)}%</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.sfxVolume}
              onChange={handleSfxChange}
              disabled={settings.isMuted}
              className="flex-1 accent-cyan-400 cursor-pointer disabled:opacity-30"
            />
            <button
              onClick={handleTestSfx}
              disabled={settings.isMuted}
              className="text-[11px] font-mono px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 disabled:opacity-30 cursor-pointer"
            >
              Test
            </button>
          </div>
        </div>

        {/* Background Ambient Music (BGM) Volume Slider */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Music className="w-4 h-4 text-pink-400" />
              Futuristic Ambient BGM
            </span>
            <span className="text-pink-400 font-bold">{Math.round(settings.bgmVolume * 100)}%</span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.bgmVolume}
              onChange={handleBgmChange}
              disabled={settings.isMuted}
              className="flex-1 accent-pink-400 cursor-pointer disabled:opacity-30"
            />
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            Subtle procedural ambient synthesizer running in the background during gameplay.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs font-mono">
          <button
            onClick={handleResetDefaults}
            className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-arcade font-bold tracking-wider cursor-pointer"
          >
            DONE
          </button>
        </div>

      </div>
    </div>
  );
}
