// src/components/ClutterMonster.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Skull, Zap, Sparkles, Heart, Shield, ShieldAlert } from 'lucide-react';
import { sounds } from '../soundEffects';

export function ClutterMonster({
  healthPercent = 100,
  isDamaged = false,
  isDefeated = false,
  totalCleared = 0,
  triggerIntro = false,
}) {
  const [speech, setSpeech] = useState("Mwahaha! I am the Clutter Monster! 5,000 unread emails are MINE!");
  const [damageEffect, setDamageEffect] = useState(false);
  const [milestoneReaction, setMilestoneReaction] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const lastHealthTierRef = useRef(100);

  // Intro sound & visual entrance animation
  useEffect(() => {
    if (triggerIntro || !hasEntered) {
      setHasEntered(true);
      sounds.playMonsterIntro();
    }
  }, [triggerIntro]);

  // Monitor health milestones (75%, 50%, 25%, 0%)
  useEffect(() => {
    const currentTier = healthPercent <= 0 ? 0 : healthPercent <= 25 ? 25 : healthPercent <= 50 ? 50 : healthPercent <= 75 ? 75 : 100;

    if (currentTier < lastHealthTierRef.current) {
      lastHealthTierRef.current = currentTier;
      // Trigger milestone reaction
      setMilestoneReaction(true);
      sounds.playMonsterReaction();
      const timer = setTimeout(() => setMilestoneReaction(false), 600);
      return () => clearTimeout(timer);
    }
  }, [healthPercent]);

  // Damage animation reaction
  useEffect(() => {
    if (isDamaged) {
      setDamageEffect(true);
      const timer = setTimeout(() => setDamageEffect(false), 380);
      return () => clearTimeout(timer);
    }
  }, [isDamaged]);

  // Dynamic dialogue reacting to the 5 monster progress stages
  useEffect(() => {
    if (isDefeated || healthPercent <= 0) {
      setSpeech("NOOOO! My clutter pile has been completely vanquished! The inbox is pristine!");
    } else if (healthPercent <= 25) {
      setSpeech("Ugh... whimpering... leave at least ONE newsletter alive!");
    } else if (healthPercent <= 50) {
      setSpeech("Ouch! Stop archiving my precious unread junk! My shield is cracking!");
    } else if (healthPercent <= 75) {
      setSpeech("Hey! That swipe actually hurt! You can't reach Inbox Zero!");
    } else {
      setSpeech("Mwahaha! 5,000 unread emails! You will procrastinate forever!");
    }
  }, [healthPercent, isDefeated]);

  // Visual size and energy scaling (100% -> 25%)
  const scale = isDefeated
    ? 'scale-75 opacity-90 transition-all duration-700'
    : healthPercent <= 25
    ? 'scale-75'
    : healthPercent <= 50
    ? 'scale-85'
    : healthPercent <= 75
    ? 'scale-95'
    : 'scale-105';

  return (
    <div className="relative flex flex-col items-center justify-center py-1 select-none">
      
      {/* Monster Speech Bubble */}
      <div className="relative mb-2 max-w-xs sm:max-w-md bg-[#141c2e]/95 border border-cyan-500/40 px-3.5 py-1.5 rounded-2xl text-xs font-mono text-cyan-200 shadow-neon-cyan animate-float text-center backdrop-blur-md">
        <span className="font-bold text-pink-400 mr-1.5">CLUTTER MONSTER:</span>
        "{speech}"
        {/* Tail */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-[#141c2e]" />
      </div>

      {/* Mascot Graphic with Entrance & Damage Animation */}
      <div 
        className={`relative transition-all duration-300 transform ${scale} ${
          damageEffect ? 'animate-shake' : milestoneReaction ? 'animate-bounce' : ''
        } ${!hasEntered ? 'scale-0 opacity-0' : 'opacity-100'}`}
      >
        
        {/* Glow Halo based on Monster State */}
        <div className={`absolute inset-0 rounded-full blur-2xl transition-colors duration-500 ${
          isDefeated 
            ? 'bg-emerald-400/40' 
            : healthPercent <= 25 
            ? 'bg-blue-500/30' 
            : healthPercent <= 50 
            ? 'bg-purple-600/40' 
            : 'bg-pink-600/50'
        }`} />

        {/* Monster SVG Container */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_0_15px_rgba(247,37,133,0.5)]">
            <defs>
              <radialGradient id="monsterGrad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor={isDefeated ? "#00ff87" : healthPercent <= 25 ? "#38bdf8" : healthPercent <= 50 ? "#a855f7" : "#f72585"} />
                <stop offset="70%" stopColor={isDefeated ? "#0284c7" : healthPercent <= 25 ? "#1e3a8a" : healthPercent <= 50 ? "#6b21a8" : "#7209b7"} />
                <stop offset="100%" stopColor="#090d16" />
              </radialGradient>
              <linearGradient id="envelopeGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
            </defs>

            {/* Clutter Shield (Flickers and cracks below 50%) */}
            {!isDefeated && (
              <circle
                cx="60"
                cy="60"
                r="56"
                fill="none"
                stroke={healthPercent <= 30 ? "#38bdf8" : "#f72585"}
                strokeWidth={healthPercent <= 30 ? "1.5" : "2.5"}
                strokeDasharray={healthPercent <= 50 ? "6,4" : "none"}
                className={`transition-all duration-300 ${healthPercent <= 30 ? 'animate-pulse opacity-40' : 'opacity-80'}`}
              />
            )}

            {/* Monster Body - Morphing Spiky Blob */}
            <path
              d={isDefeated 
                ? "M30,60 Q20,30 50,25 Q80,20 95,50 Q105,80 75,95 Q45,105 25,80 Z"
                : healthPercent <= 35
                ? "M25,55 Q18,32 45,28 Q60,15 80,30 Q98,40 92,65 Q102,90 75,95 Q55,105 32,95 Q15,90 25,55 Z"
                : "M20,55 Q10,25 45,20 Q60,5 85,25 Q110,35 100,65 Q115,95 80,100 Q60,115 35,100 Q5,95 20,55 Z"
              }
              fill="url(#monsterGrad)"
              className="transition-all duration-300"
            />

            {/* Orbiting Unread Envelopes (Disappear as clutter drops) */}
            {!isDefeated && healthPercent > 20 && (
              <g className="animate-spin origin-center" style={{ animationDuration: '9s' }}>
                <rect x="14" y="14" width="16" height="11" rx="2" fill="url(#envelopeGrad)" transform="rotate(-15 20 20)" />
                <path d="M14,14 L22,21 L30,14" fill="none" stroke="#64748b" strokeWidth="1" />
              </g>
            )}

            {!isDefeated && healthPercent > 50 && (
              <g className="animate-spin origin-center" style={{ animationDuration: '7s', animationDirection: 'reverse' }}>
                <rect x="86" y="76" width="15" height="10" rx="2" fill="url(#envelopeGrad)" transform="rotate(20 90 80)" />
                <path d="M86,76 L93.5,83 L101,76" fill="none" stroke="#64748b" strokeWidth="1" />
              </g>
            )}

            {/* Expression Morphing */}
            {isDefeated ? (
              // 0% Defeated: Happy sparkles, angel halo, smile
              <>
                <text x="38" y="58" fontSize="16" fontWeight="bold" fill="#ffffff" textAnchor="middle">★</text>
                <text x="76" y="58" fontSize="16" fontWeight="bold" fill="#ffffff" textAnchor="middle">★</text>
                {/* Angel Halo */}
                <ellipse cx="58" cy="12" rx="25" ry="6" fill="none" stroke="#ffd166" strokeWidth="3" />
                {/* Cheerful Smile */}
                <path d="M42,75 Q58,90 74,75" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : healthPercent <= 25 ? (
              // 25% Dizzy Swirl Eyes & Pout
              <>
                <circle cx="42" cy="52" r="10" fill="#ffffff" />
                <path d="M42,47 A5,5 0 1,1 42,57 A5,5 0 1,1 42,47" fill="none" stroke="#000" strokeWidth="2" />
                <circle cx="76" cy="52" r="10" fill="#ffffff" />
                <path d="M76,47 A5,5 0 1,1 76,57 A5,5 0 1,1 76,47" fill="none" stroke="#000" strokeWidth="2" />
                {/* Big Blue Sweat Drop */}
                <path d="M94,28 C92,33 87,36 87,40 C87,44 91,46 95,43 C98,40 98,36 94,28 Z" fill="#38bdf8" />
                {/* Trembling mouth */}
                <path d="M44,78 Q58,72 72,78" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : healthPercent <= 50 ? (
              // 50% Worried Tired Eyes & Small Sweat
              <>
                <circle cx="42" cy="50" r="9" fill="#ffffff" />
                <circle cx="42" cy="50" r="4" fill="#090d16" />
                <circle cx="76" cy="50" r="9" fill="#ffffff" />
                <circle cx="76" cy="50" r="4" fill="#090d16" />
                {/* Flat mouth */}
                <path d="M46,76 L70,76" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              // 100% - 75%: Energetic Snarl & Confident Monster Eyes
              <>
                <polygon points="32,44 48,52 34,58" fill="#ffd166" />
                <circle cx="42" cy="52" r="3" fill="#ff0055" />
                <polygon points="84,44 68,52 82,58" fill="#ffd166" />
                <circle cx="74" cy="52" r="3" fill="#ff0055" />
                {/* Cartoon Monster Mouth with Fangs */}
                <path d="M38,76 Q58,95 78,76 Z" fill="#180e23" stroke="#f72585" strokeWidth="2" />
                <polygon points="45,76 49,83 53,76" fill="#ffffff" />
                <polygon points="63,76 67,83 71,76" fill="#ffffff" />
              </>
            )}

            {/* Damage Sparks Overlay */}
            {damageEffect && (
              <g className="animate-ping">
                <path d="M28,28 L48,15 L42,34 L62,24" stroke="#00f2fe" strokeWidth="3" fill="none" />
                <path d="M72,85 L86,98 L76,104 L94,112" stroke="#ffd166" strokeWidth="3" fill="none" />
              </g>
            )}
          </svg>

          {/* Floating '99+' unread badge */}
          {!isDefeated && (
            <div className={`absolute -top-1 -right-2 px-2 py-0.5 rounded-full bg-red-600 text-white font-arcade font-bold text-xs border border-red-400 shadow-[0_0_10px_rgba(255,0,85,0.8)] ${
              healthPercent <= 30 ? 'opacity-40 line-through' : 'animate-pulse'
            }`}>
              99+
            </div>
          )}
        </div>

      </div>

      {/* Monster Health / Clutter Meter */}
      <div className="w-full max-w-xs sm:max-w-md mt-1.5 space-y-1">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1.5 text-slate-300 font-bold">
            <Skull className="w-3.5 h-3.5 text-pink-400" />
            CLUTTER HP:
          </span>
          <span className="font-arcade font-extrabold text-pink-400">
            {isDefeated ? '0% PURGED' : `${Math.round(healthPercent)}%`}
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-700/80 p-0.5 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-300 bg-gradient-to-r ${
              isDefeated ? 'from-emerald-400 to-teal-400' :
              healthPercent <= 30 ? 'from-blue-500 to-cyan-400' :
              healthPercent <= 60 ? 'from-amber-500 to-pink-500' :
              'from-red-600 via-pink-600 to-purple-600'
            }`}
            style={{ width: `${isDefeated ? 0 : healthPercent}%` }}
          />
        </div>
      </div>

    </div>
  );
}
