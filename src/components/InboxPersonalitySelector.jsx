// src/components/InboxPersonalitySelector.jsx
import React, { useState } from 'react';
import { 
  Zap, 
  Search, 
  Trash2, 
  Briefcase, 
  Target, 
  ShieldAlert, 
  ArrowRight, 
  Check, 
  Flame, 
  AlertTriangle,
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { sounds } from '../soundEffects';

const MISSIONS = [
  {
    id: 'inbox-zero',
    title: 'INBOX ZERO',
    subtitle: 'High-Velocity Speed Run',
    icon: Zap,
    badge: 'SPEED & VOLUME',
    accentColor: 'cyan',
    borderColor: 'border-cyan-400',
    borderGlow: 'shadow-neon-cyan',
    bgGradient: 'from-cyan-500/20 to-blue-600/10',
    iconBg: 'bg-gradient-to-br from-cyan-400 to-blue-600',
    targetGoal: 'Clear 15 emails before the 60s timer expires',
    queueProfile: 'Balanced high-velocity pipeline across all 4 levels',
    gameplayRules: [
      { label: 'Speed Bonus', detail: '+150 Pts when making a decision under 2.5s' },
      { label: 'Combo Ramp', detail: 'Multiplier escalates 2x faster on consecutive clears' },
      { label: 'Core Objective', detail: 'Target: 15 emails sorted to claim victory' }
    ],
    penaltyNote: 'Timer expiration before target reduces final rank',
  },
  {
    id: 'find-important',
    title: 'SIGNAL HUNTER',
    subtitle: 'VIP & Critical Rescue',
    icon: Search,
    badge: 'PRECISION DETECTIVE',
    accentColor: 'amber',
    borderColor: 'border-amber-400',
    borderGlow: 'shadow-neon-amber',
    bgGradient: 'from-amber-500/20 to-orange-600/10',
    iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
    targetGoal: 'Rescue 4 VIP & urgent messages with zero mistakes',
    queueProfile: 'Dense pack of executive escalations, travel codes & alerts mixed with decoys',
    gameplayRules: [
      { label: 'VIP Bounty', detail: '+1,500 Pts for correctly starring or keeping VIP messages' },
      { label: 'Severe Penalty', detail: '-800 Pts & screen warning if you accidentally trash a VIP email' },
      { label: 'Core Objective', detail: 'Target: 4 VIP items rescued without critical errors' }
    ],
    penaltyNote: 'Accidental deletion incurs severe -800 pt penalty',
  },
  {
    id: 'remove-promos',
    title: 'CLUTTER PURGE',
    subtitle: 'Spam & Newsletter Eradication',
    icon: Trash2,
    badge: 'MARKETING SLAYER',
    accentColor: 'pink',
    borderColor: 'border-pink-500',
    borderGlow: 'shadow-neon-pink',
    bgGradient: 'from-pink-500/20 to-red-600/10',
    iconBg: 'bg-gradient-to-br from-pink-500 to-red-600',
    targetGoal: 'Exterminate 8 promotional blasts & newsletter piles',
    queueProfile: 'Heavy influx of expired flash sales, food coupons & retention loops',
    gameplayRules: [
      { label: '2.5x Boss Damage', detail: 'Archiving/Deleting marketing blasts deals 2.5x damage to monster' },
      { label: 'Purge Stacking', detail: '+300 Pts combo bonus for consecutive cleanup actions' },
      { label: 'Core Objective', detail: 'Target: 8 promotional emails eliminated' }
    ],
    penaltyNote: 'Keeping promotional junk interrupts combo multiplier',
  },
  {
    id: 'organize-work',
    title: 'WORK ARCHITECT',
    subtitle: 'Systematic Curation & Labeling',
    icon: Briefcase,
    badge: 'KNOWLEDGE CURATOR',
    accentColor: 'emerald',
    borderColor: 'border-emerald-400',
    borderGlow: 'shadow-neon-emerald',
    bgGradient: 'from-emerald-400 to-teal-600',
    iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    targetGoal: 'Organize 5 technical references, coursework & SaaS invoices',
    queueProfile: 'Concentration of system architecture docs, PR notices & billing receipts',
    gameplayRules: [
      { label: 'Label Reward', detail: '+1,200 Pts for using [L] LABEL to organize work items' },
      { label: 'Keep Bonus', detail: '+600 Pts for preserving active project files' },
      { label: 'Core Objective', detail: 'Target: 5 work/study records neatly organized' }
    ],
    penaltyNote: 'Mindless deletion of technical docs forfeits curation bonuses',
  }
];

export function InboxPersonalitySelector({
  onSelectPersonality,
  isDemo,
  onBack,
}) {
  const [selectedId, setSelectedId] = useState('inbox-zero');

  const selectedMission = MISSIONS.find(m => m.id === selectedId) || MISSIONS[0];

  const handleStartMission = () => {
    sounds.playArchive();
    onSelectPersonality(selectedId);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 py-6 max-w-6xl mx-auto select-none">
      
      {/* Screen Header */}
      <div className="text-center mb-6 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-mono mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STEP 1: SELECT YOUR DIGITAL CHORE</span>
        </div>
        <h1 className="font-arcade text-3xl sm:text-5xl font-extrabold text-white tracking-wider mb-2">
          CHOOSE YOUR MISSION
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-mono">
          Your choice transforms the incoming email pipeline, scoring rules, objectives, and win condition.
        </p>
      </div>

      {/* 4 Functional Mission Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
        {MISSIONS.map((m) => {
          const Icon = m.icon;
          const isSelected = m.id === selectedId;

          return (
            <div
              key={m.id}
              onClick={() => {
                sounds.playWhoosh();
                setSelectedId(m.id);
              }}
              className={`relative p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left bg-[#101726] flex flex-col justify-between ${
                isSelected 
                  ? `${m.borderColor} ${m.borderGlow} scale-[1.01] bg-[#141f33]` 
                  : 'border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                {/* Header: Icon, Title, Badge, Checkmark */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${m.iconBg} flex items-center justify-center text-slate-950 shadow-md`}>
                      <Icon className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-arcade text-xl sm:text-2xl font-extrabold text-white tracking-wide">
                          {m.title}
                        </h3>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black/60 text-slate-300 border border-slate-700 font-bold">
                          {m.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {m.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? `${m.borderColor} bg-white text-slate-950` : 'border-slate-700 bg-slate-900'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>

                {/* Target Goal Banner */}
                <div className="bg-[#0b101a] border border-slate-800 rounded-xl p-2.5 mb-3 text-xs font-mono flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white font-bold">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <span>TARGET:</span>
                  </div>
                  <span className="text-cyan-300 font-semibold">{m.targetGoal}</span>
                </div>

                {/* Gameplay Rules & Modifiers */}
                <div className="space-y-1.5 mb-3">
                  {m.gameplayRules.map((rule, idx) => (
                    <div key={idx} className="flex items-start justify-between text-xs font-mono">
                      <span className="text-slate-400 font-medium">• {rule.label}:</span>
                      <span className="text-slate-200 text-right font-semibold ml-2">{rule.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Queue & Penalty Note */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 truncate max-w-[280px]">
                  Queue: <strong className="text-slate-300">{m.queueProfile}</strong>
                </span>
                <span className="text-amber-400 text-[10px] font-semibold">
                  ⚠️ {m.penaltyNote}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Mission Summary & START MISSION Button Bar */}
      <div className="w-full bg-[#0c121e] border-2 border-cyan-500/50 p-4 sm:p-5 rounded-2xl shadow-neon-cyan flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Mission Details Preview */}
        <div className="text-left text-xs font-mono space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">ACTIVE MISSION:</span>
            <strong className="font-arcade text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
              {selectedMission.title} ({selectedMission.badge})
            </strong>
          </div>
          <div className="flex items-center gap-3 text-slate-300">
            <span>🎯 <strong>Goal:</strong> {selectedMission.targetGoal}</span>
            <span>•</span>
            <span>{isDemo ? '🕹️ Mode: DEMO QUEST (Simulated)' : '⚡ Mode: REAL GMAIL API'}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onBack}
            className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-arcade text-sm transition cursor-pointer"
          >
            BACK
          </button>
          
          <button
            onClick={handleStartMission}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-arcade text-base font-extrabold tracking-wider shadow-neon-cyan hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
          >
            <span>START MISSION: {selectedMission.title}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

      </div>

    </div>
  );
}
