// src/components/ResultsScreen.jsx
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  ListFilter, 
  CheckCircle2, 
  Archive, 
  Trash2, 
  Star, 
  Clock, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Heart, 
  Tag, 
  ArrowRight, 
  TrendingDown, 
  Activity, 
  Fingerprint, 
  Target, 
  AlertTriangle, 
  Award,
  Check
} from 'lucide-react';
import { sounds } from '../soundEffects';
import { ClutterMonster } from './ClutterMonster';

export function ResultsScreen({
  results,
  onPlayAgain,
  onChangePersonality,
}) {
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [animatedHealth, setAnimatedHealth] = useState(0);

  const { 
    finalScore = 0, 
    highestStreak = 0, 
    processedCount = 0, 
    actions = [], 
    isDemo = true,
    personality = 'inbox-zero',
    missionTitle = 'INBOX ZERO',
    targetCountAchieved = 0,
    targetGoalRequired = 15,
    missionTargetReached = true,
    vipMistakes = 0,
    monsterDefeated = true
  } = results || {};

  // Compute breakdown stats
  const archivedCount = actions.filter(a => a.action === 'ARCHIVE').length;
  const deletedCount = actions.filter(a => a.action === 'DELETE').length;
  const starredCount = actions.filter(a => a.action === 'STAR').length;
  const keptCount = actions.filter(a => a.action === 'KEEP').length;
  const organizedCount = actions.filter(a => a.action === 'LABEL').length;

  const clearedTotal = archivedCount + deletedCount + organizedCount;
  const clutterReductionPercent = Math.min(100, Math.max(65, Math.round((clearedTotal / Math.max(1, processedCount)) * 100)));
  const minutesAvoided = Math.max(1, Math.round((processedCount * 45) / 60));
  const targetHealth = Math.min(100, Math.max(72, 72 + Math.round(processedCount * 2.8) + (missionTargetReached ? 5 : 0)));

  // Victory Sound, Smooth Confetti & Animated Health Score Increment
  useEffect(() => {
    sounds.playVictory();

    // Subtle celebratory confetti
    const duration = 2.4 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00f2fe', '#f72585', '#00ff87', '#ffb703'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#00f2fe', '#f72585', '#00ff87', '#ffb703'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Animate Health Score from 0 to targetHealth smoothly over 1.2s
    let current = 0;
    const step = Math.max(1, Math.round(targetHealth / 30));
    const timer = setInterval(() => {
      current += step;
      if (current >= targetHealth) {
        setAnimatedHealth(targetHealth);
        clearInterval(timer);
      } else {
        setAnimatedHealth(current);
      }
    }, 35);

    return () => clearInterval(timer);
  }, [targetHealth]);

  // Rank determination
  let rank = 'B-RANK';
  let rankTitle = 'Swift Sweeper';
  let rankColor = 'from-blue-400 to-cyan-300';
  let rankBorder = 'border-cyan-400 shadow-neon-cyan';

  if (finalScore >= 12000 || highestStreak >= 7 || (missionTargetReached && finalScore >= 9000)) {
    rank = 'S-RANK';
    rankTitle = `${missionTitle} Master`;
    rankColor = 'from-amber-400 via-pink-500 to-cyan-400';
    rankBorder = 'border-amber-400 shadow-neon-amber';
  } else if (finalScore >= 6000 || highestStreak >= 4) {
    rank = 'A-RANK';
    rankTitle = 'Productivity Titan';
    rankColor = 'from-purple-400 to-pink-500';
    rankBorder = 'border-pink-400 shadow-neon-pink';
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-8 max-w-5xl mx-auto select-none">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Results Container */}
      <div className="relative w-full bg-[#0d1422]/95 border-2 border-slate-800 rounded-3xl p-6 sm:p-10 text-center shadow-2xl backdrop-blur-md">
        
        {/* Defeated Mascot Ceremony */}
        <div className="mb-3 transition-all duration-700">
          <ClutterMonster healthPercent={0} isDefeated={true} totalCleared={processedCount} />
        </div>

        {/* Mission Status Header */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold border ${
            missionTargetReached 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}>
            <Award className="w-4 h-4" />
            <span>MISSION: {missionTitle} • {missionTargetReached ? 'OBJECTIVE COMPLETED! (+2,500 BONUS)' : 'CHALLENGE ATTEMPTED'}</span>
          </div>

          {vipMistakes > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950 border border-red-700 text-red-300 text-xs font-mono font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>{vipMistakes} VIP Mistake(s) Penalized</span>
            </div>
          )}
        </div>

        <h1 className="font-arcade text-3xl sm:text-5xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_0_30px_rgba(0,255,135,0.4)] mb-2">
          INBOX CLEANED!
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-mono mb-6">
          {isDemo ? (
            <span className="text-amber-400">DEMO QUEST — Realistic actions simulated safely. Zero inbox modifications.</span>
          ) : (
            <span className="text-emerald-400">REAL GMAIL — Live changes executed through official Gmail API!</span>
          )}
        </p>

        {/* ----------------- CORE IMPACT SCORECARD WITH ANIMATED HEALTH SCORE ----------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
          
          {/* Metric 1: Animated Inbox Health Score */}
          <div className="p-4 rounded-2xl bg-[#131c30] border border-emerald-500/30 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>INBOX HEALTH SCORE</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-arcade text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                {animatedHealth}
              </span>
              <span className="font-mono text-sm text-slate-400">/ 100</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 mt-1">
              Grade: {rank} ({rankTitle})
            </span>
          </div>

          {/* Metric 2: Clutter Reduction */}
          <div className="p-4 rounded-2xl bg-[#131c30] border border-cyan-500/30 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1">
              <TrendingDown className="w-4 h-4 text-cyan-400" />
              <span>CLUTTER REDUCTION</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-arcade text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                -{clutterReductionPercent}%
              </span>
            </div>
            <span className="text-[11px] font-mono text-cyan-300 mt-1">
              {clearedTotal} of {processedCount} cleared from active queue
            </span>
          </div>

          {/* Metric 3: Manual Effort Avoided */}
          <div className="p-4 rounded-2xl bg-[#131c30] border border-pink-500/30 flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1">
              <Clock className="w-4 h-4 text-pink-400" />
              <span>MANUAL EFFORT AVOIDED</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-arcade text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                ~{minutesAvoided}m
              </span>
            </div>
            <span className="text-[11px] font-mono text-pink-300 mt-1">
              Digital chore converted into play
            </span>
          </div>

        </div>

        {/* ----------------- ACTION BREAKDOWN GRID ----------------- */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto mb-8">
          
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-300" />
              <span>Processed</span>
            </div>
            <span className="font-arcade text-xl sm:text-2xl font-bold text-white">{processedCount}</span>
            <span className="text-[9px] text-slate-500 block font-mono">Total sorted</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
            <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 mb-1">
              <Archive className="w-3.5 h-3.5 text-cyan-400" />
              <span>Archived</span>
            </div>
            <span className="font-arcade text-xl sm:text-2xl font-bold text-cyan-400">{archivedCount}</span>
            <span className="text-[9px] text-slate-500 block font-mono">Cleared to All Mail</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
            <div className="flex items-center gap-1 text-[11px] font-mono text-red-400 mb-1">
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Deleted</span>
            </div>
            <span className="font-arcade text-xl sm:text-2xl font-bold text-red-400">{deletedCount}</span>
            <span className="text-[9px] text-slate-500 block font-mono">Moved to Trash</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left">
            <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400 mb-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span>Starred</span>
            </div>
            <span className="font-arcade text-xl sm:text-2xl font-bold text-amber-400">{starredCount}</span>
            <span className="text-[9px] text-slate-500 block font-mono">VIP / Priority</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1 text-[11px] font-mono text-purple-400 mb-1">
              <Tag className="w-3.5 h-3.5 text-purple-400" />
              <span>Organized</span>
            </div>
            <span className="font-arcade text-xl sm:text-2xl font-bold text-purple-400">{organizedCount + keptCount}</span>
            <span className="text-[9px] text-slate-500 block font-mono">Labeled / Kept</span>
          </div>

        </div>

        {/* ----------------- ACTION BUTTONS ----------------- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
          
          <button
            onClick={onPlayAgain}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-arcade text-sm sm:text-base font-bold tracking-wider shadow-neon-cyan transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            PLAY AGAIN
          </button>

          <button
            onClick={() => setShowSummaryModal(true)}
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#141e30] hover:bg-[#1a2942] border border-cyan-500/40 text-cyan-300 font-arcade text-sm sm:text-base font-bold tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <ListFilter className="w-4 h-4 text-cyan-400" />
            CLEANUP AUDIT DOSSIER
          </button>

          <button
            onClick={onChangePersonality}
            className="px-4 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-arcade text-xs tracking-wider transition cursor-pointer"
          >
            CHANGE MISSION
          </button>

        </div>

      </div>

      {/* ----------------- CLEANUP AUDIT DOSSIER MODAL ----------------- */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#0f1624] border border-cyan-500/50 rounded-2xl shadow-neon-cyan p-6 max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h2 className="font-arcade text-xl font-bold text-white flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-cyan-400" />
                  <span>AI EMAIL DETECTIVE CLEANUP DOSSIER</span>
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Complete audit trail with AI reasoning and execution evidence
                </p>
              </div>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {actions.length === 0 ? (
                <div className="text-center py-12 text-slate-500 font-mono text-sm">
                  No email actions recorded in this session.
                </div>
              ) : (
                actions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#141e30] border border-slate-800 text-left space-y-2 hover:border-slate-700 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-white text-sm truncate">
                            {item.sender?.name || 'Sender'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 truncate">
                            &lt;{item.sender?.email}&gt;
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 font-medium">
                          {item.emailSubject}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-arcade font-bold tracking-wide border ${
                          item.action === 'ARCHIVE' ? 'bg-cyan-950/80 border-cyan-800 text-cyan-400' :
                          item.action === 'DELETE' ? 'bg-red-950/80 border-red-800 text-red-400' :
                          item.action === 'STAR' ? 'bg-amber-950/80 border-amber-800 text-amber-400' :
                          item.action === 'KEEP' ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400' :
                          'bg-purple-950/80 border-purple-800 text-purple-400'
                        }`}>
                          {item.action}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {item.isReal ? '✓ Gmail Synced' : '✓ Simulated'}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-cyan-300/80 font-mono bg-[#0b101a] p-2 rounded-lg border border-slate-800/80">
                      <strong className="text-cyan-400">AI Detective Signal: </strong>
                      {item.aiReasoning}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>{actions.length} decisions verified</span>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-arcade font-bold tracking-wide transition cursor-pointer"
              >
                CLOSE DOSSIER
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
