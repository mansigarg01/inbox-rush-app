// src/components/LandingPage.jsx
import React from 'react';
import { 
  Play, 
  Mail, 
  Gamepad2, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Archive, 
  Trash2, 
  Star, 
  Bookmark, 
  Tag, 
  ArrowRight,
  Flame,
  Zap,
  Clock,
  Fingerprint,
  Skull,
  Sword,
  Target
} from 'lucide-react';
import { sounds } from '../soundEffects';
import { ClutterMonster } from './ClutterMonster';

export function LandingPage({
  onStartQuestSetup,
  onOpenConnectModal,
  isDemo,
  isAuthenticated,
  user,
  oauthConfigured,
}) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden select-none">
      
      {/* Background Neon Grid & Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-[#070a12] to-[#070a12] pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-10 pb-8 text-center">
        
        {/* Hackathon Challenge Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-mono mb-6 shadow-neon-cyan">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>INBOX QUEST: TURN DIGITAL PROCRASTINATION INTO AN ADVENTURE</span>
        </div>

        {/* Mascot Teaser in Hero */}
        <div className="flex justify-center mb-4">
          <ClutterMonster healthPercent={85} isDamaged={false} isDefeated={false} />
        </div>

        {/* Main Title & Brand Identity */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4">
          <span className="font-arcade text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-pink-500 drop-shadow-[0_0_35px_rgba(0,242,254,0.4)]">
            INBOX QUEST
          </span>
        </h1>

        {/* Central Core Concept Tagline */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-200 mb-2 font-medium">
          “Turn inbox procrastination into a game where every move actually cleans your digital life.”
        </p>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-slate-400 mb-8 font-mono">
          Battle the Clutter Monster, unlock 4 progressive tiers, and let the AI Email Detective guide every swipe directly to the Gmail API.
        </p>

        {/* Mode & Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-8">
          
          {/* PLAY DEMO Button */}
          <button
            onClick={() => {
              sounds.playWhoosh();
              onStartQuestSetup(true);
            }}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-arcade text-lg font-extrabold tracking-wide shadow-neon-cyan hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            PLAY DEMO QUEST
          </button>

          {/* CONNECT GMAIL Button */}
          {isAuthenticated ? (
            <button
              onClick={() => {
                sounds.playWhoosh();
                onStartQuestSetup(false);
              }}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-arcade text-lg font-extrabold tracking-wide shadow-neon-emerald hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-current" />
              SLAY REAL INBOX
            </button>
          ) : (
            <button
              onClick={onOpenConnectModal}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-[#141d2d] hover:bg-[#1a263c] border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-arcade text-lg font-bold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Mail className="w-5 h-5 text-cyan-400" />
              CONNECT GMAIL
            </button>
          )}

        </div>

        {/* Judge Friendly Callout */}
        <div className="inline-block max-w-lg mx-auto bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-2 text-xs text-amber-300 font-mono mb-10">
          <span className="font-bold text-amber-400">⚡ JUDGE READY:</span> Click <span className="underline font-bold">PLAY DEMO QUEST</span> for instant zero-config gameplay with realistic mock data and full 4-level progression.
        </div>

        {/* ----------------- 4 PROGRESSIVE GAMEPLAY LEVELS SHOWCASE ----------------- */}
        <div className="text-left max-w-4xl mx-auto mb-10">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-4 font-bold flex items-center gap-2">
            <Sword className="w-4 h-4 text-cyan-400" />
            <span>THE 4 PROGRESSIVE GAMEPLAY TIERS</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            
            {/* Level 1: Quick Wins */}
            <div className="p-4 rounded-xl bg-[#101728] border border-emerald-500/30 hover:border-emerald-400 transition">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                LEVEL 1
              </span>
              <h3 className="font-arcade text-base font-bold text-white mt-2 mb-1">
                Quick Wins
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Easy-to-spot expired promos, food coupons, and automated engagement alerts. Fast triage combos!
              </p>
            </div>

            {/* Level 2: Detective Mode */}
            <div className="p-4 rounded-xl bg-[#101728] border border-blue-500/30 hover:border-blue-400 transition">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                LEVEL 2
              </span>
              <h3 className="font-arcade text-base font-bold text-white mt-2 mb-1">
                Detective Mode
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Ambiguous emails where the AI Email Detective inspects receipts, flight booking codes, and clinic reminders.
              </p>
            </div>

            {/* Level 3: Sender Attack */}
            <div className="p-4 rounded-xl bg-[#101728] border border-purple-500/30 hover:border-purple-400 transition">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                LEVEL 3
              </span>
              <h3 className="font-arcade text-base font-bold text-white mt-2 mb-1">
                Sender Attack
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                Identifies high-frequency repeated senders (Substack, LinkedIn) to clear multi-message clutter piles.
              </p>
            </div>

            {/* Level 4: Inbox Boss */}
            <div className="p-4 rounded-xl bg-[#101728] border border-red-500/30 hover:border-red-400 transition">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                LEVEL 4
              </span>
              <h3 className="font-arcade text-base font-bold text-white mt-2 mb-1">
                Inbox Boss
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                High-stakes executive reviews, board roadmaps, and cloud billing alerts. Defeat the Clutter Monster!
              </p>
            </div>

          </div>
        </div>

        {/* ----------------- AI DETECTIVE & REAL GMAIL MAPPING ----------------- */}
        <div className="relative py-6 px-5 bg-[#0d1422]/90 border border-slate-800 rounded-2xl max-w-4xl mx-auto shadow-2xl backdrop-blur-md text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              <span>AI Email Detective Engine</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Parses Sender Frequency • Keyword Signatures • Stale Timestamps • Trust Levels
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-cyan-500/30">
              <div className="flex items-center gap-1.5 text-cyan-400 font-arcade font-bold text-xs mb-1">
                <Archive className="w-3.5 h-3.5" />
                ARCHIVE
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Removes <code className="text-cyan-300">INBOX</code> label. Preserves in All Mail.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-red-500/30">
              <div className="flex items-center gap-1.5 text-red-400 font-arcade font-bold text-xs mb-1">
                <Trash2 className="w-3.5 h-3.5" />
                DELETE
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Moves to Gmail <code className="text-red-300">Trash</code> (30-day recovery window).
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-amber-500/30">
              <div className="flex items-center gap-1.5 text-amber-400 font-arcade font-bold text-xs mb-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                STAR
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Attaches <code className="text-amber-300">STARRED</code> label for instant VIP priority.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-emerald-500/30">
              <div className="flex items-center gap-1.5 text-emerald-400 font-arcade font-bold text-xs mb-1">
                <Bookmark className="w-3.5 h-3.5" />
                KEEP
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Marks as read, keeping it active in your primary queue.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 border border-purple-500/30">
              <div className="flex items-center gap-1.5 text-purple-400 font-arcade font-bold text-xs mb-1">
                <Tag className="w-3.5 h-3.5" />
                LABEL
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Applies custom label & organizes neatly.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Safety & Hackathon Guarantees Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070a12] py-5 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Principle of Minimum Permissions: Only requests <code className="text-slate-400">gmail.modify</code></span>
          </div>
          <div className="flex items-center gap-4">
            <span>Non-destructive Trash</span>
            <span>•</span>
            <span>Zero External Storage</span>
            <span>•</span>
            <span>Demo Quest Ready</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
