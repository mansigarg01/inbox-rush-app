// src/components/GameScreen.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Archive, 
  Trash2, 
  Star, 
  Bookmark, 
  Tag, 
  Clock, 
  Flame, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Pause,
  Play,
  Search,
  Fingerprint,
  Layers,
  Sword,
  Target,
  AlertTriangle,
  Award
} from 'lucide-react';
import { sounds } from '../soundEffects';
import { executeAction } from '../api';
import { ClutterMonster } from './ClutterMonster';

export function GameScreen({
  emails = [],
  isDemo = true,
  personality = 'inbox-zero',
  missionConfig = null,
  safeDeleteEnabled = true,
  onGameOver,
  onExitGame,
}) {
  // Game & Score State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [processedActions, setProcessedActions] = useState([]);

  // Mission Objective Tracking
  const [targetCount, setTargetCount] = useState(0);
  const [missionCompleted, setMissionCompleted] = useState(false);
  const [vipMistakes, setVipMistakes] = useState(0);

  // Speed calculation timestamp for Inbox Zero
  const lastActionTimeRef = useRef(Date.now());

  // Mascot damage state
  const [monsterDamaged, setMonsterDamaged] = useState(false);
  const [isMonsterDefeated, setIsMonsterDefeated] = useState(false);

  // Level transition banner
  const [levelUpBanner, setLevelUpBanner] = useState(null);
  const lastLevelRef = useRef(1);

  // Visual Alert / Penalty
  const [penaltyWarning, setPenaltyWarning] = useState(null);

  // Card Animation & Floating Points
  const [cardAnimation, setCardAnimation] = useState('');
  const [floatingScore, setFloatingScore] = useState(null);
  const [lastActionFeedback, setLastActionFeedback] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(null);
  const [dontAskDeleteAgain, setDontAskDeleteAgain] = useState(!safeDeleteEnabled);

  const [isExecuting, setIsExecuting] = useState(false);

  const currentEmail = emails[currentIndex] || null;
  const currentLevel = currentEmail?.level || 1;
  const totalEmails = Math.max(1, emails.length);

  // Mission Config
  const mission = missionConfig || {
    id: personality,
    title: personality === 'find-important' ? 'SIGNAL HUNTER' :
      personality === 'remove-promos' ? 'CLUTTER PURGE' :
      personality === 'organize-work' ? 'WORK ARCHITECT' : 'INBOX ZERO',
    targetCount: personality === 'find-important' ? 4 :
      personality === 'remove-promos' ? 8 :
      personality === 'organize-work' ? 5 : 15,
    targetType: personality === 'find-important' ? 'vip' :
      personality === 'remove-promos' ? 'promo' :
      personality === 'organize-work' ? 'work' : 'clear',
    targetLabel: personality === 'find-important' ? 'Rescue 4 VIP Messages' :
      personality === 'remove-promos' ? 'Purge 8 Commercial Blasts' :
      personality === 'organize-work' ? 'Label 5 Work Documents' : 'Clear 15 Emails',
  };

  // Clutter Monster Health (100% -> 0%)
  const monsterHealth = Math.max(0, Math.round(((totalEmails - currentIndex) / totalEmails) * 100));

  // Multiplier scaling: Inbox Zero escalates faster!
  const multiplier = personality === 'inbox-zero'
    ? (streak >= 6 ? 5 : streak >= 4 ? 3 : streak >= 2 ? 2 : 1)
    : (streak >= 10 ? 5 : streak >= 6 ? 3 : streak >= 3 ? 2 : 1);

  // ------------------------------------------------------------------
  // Background Ambient Music Lifecycle
  // ------------------------------------------------------------------
  useEffect(() => {
    sounds.startBackgroundMusic();
    return () => {
      sounds.stopBackgroundMusic();
    };
  }, []);

  // Level transition detector
  useEffect(() => {
    if (currentEmail && currentEmail.level !== lastLevelRef.current) {
      const newLvl = currentEmail.level;
      lastLevelRef.current = newLvl;
      sounds.playMissionMilestone();
      setLevelUpBanner({
        level: newLvl,
        name: currentEmail.levelName || `Level ${newLvl}`,
      });
      const timer = setTimeout(() => setLevelUpBanner(null), 1600);
      return () => clearTimeout(timer);
    }
  }, [currentEmail]);

  // 60-Second Countdown Timer with Last 10s Audio Tick
  useEffect(() => {
    if (isPaused) return;

    if (timeLeft <= 0 || (emails.length > 0 && currentIndex >= emails.length)) {
      sounds.stopBackgroundMusic();
      setIsMonsterDefeated(true);
      sounds.playVictory();
      
      setTimeout(() => {
        onGameOver({
          finalScore: score,
          highestStreak,
          processedCount: processedActions.length,
          actions: processedActions,
          isDemo,
          personality,
          missionTitle: mission.title,
          targetCountAchieved: targetCount,
          targetGoalRequired: mission.targetCount,
          missionTargetReached: targetCount >= mission.targetCount,
          vipMistakes,
          monsterDefeated: true,
        });
      }, 900);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 10 && prev > 1) {
          sounds.playCountdownTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentIndex, emails.length, isPaused, score, highestStreak, processedActions, isDemo, personality, mission, targetCount, vipMistakes, onGameOver]);

  // Reset decision timer on new card
  useEffect(() => {
    lastActionTimeRef.current = Date.now();
  }, [currentIndex]);

  // Action Execution Handler
  const handleAction = useCallback(async (actionType, customLabel = '') => {
    if (!currentEmail || isExecuting) return;

    // Safety check for Delete action
    if (actionType === 'DELETE' && !dontAskDeleteAgain) {
      setConfirmDeleteModal({ email: currentEmail });
      return;
    }

    setIsExecuting(true);
    const decisionTimeSeconds = (Date.now() - lastActionTimeRef.current) / 1000;

    let earnedPoints = 350;
    let extraBonusText = '';
    const isVipEmail = Boolean(currentEmail.isVip || currentEmail.isBossChallenge);
    const isPromoEmail = Boolean(currentEmail.isPromo);
    const isWorkEmail = Boolean(currentEmail.isWork);

    // AI recommendation check
    const recommendation = currentEmail.aiDetective?.recommendation;
    const isRecommendedAction = recommendation === actionType || currentEmail.aiDetective?.altRecommendation === actionType;

    // 1. SIGNAL HUNTER MECHANIC: VIP Rescue vs Trashing Penalty
    if (personality === 'find-important') {
      if (isVipEmail && (actionType === 'STAR' || actionType === 'KEEP')) {
        earnedPoints += 1500;
        extraBonusText = '+1,500 VIP RESCUED!';
        sounds.playVipDiscovery();
        setTargetCount(prev => {
          const next = prev + 1;
          if (next === mission.targetCount) {
            setMissionCompleted(true);
            sounds.playMissionMilestone();
          }
          return next;
        });
      } else if (isVipEmail && actionType === 'DELETE') {
        earnedPoints = -800;
        setVipMistakes(prev => prev + 1);
        setPenaltyWarning('CRITICAL MISTAKE: TRASHED VIP EMAIL! (-800 PTS)');
        sounds.playWrongDecision();
        setTimeout(() => setPenaltyWarning(null), 2000);
      } else {
        if (actionType === 'ARCHIVE') sounds.playClean();
        else if (actionType === 'DELETE') sounds.playDelete();
        else sounds.playWhoosh();
      }
    }

    // 2. INBOX ZERO MECHANIC: Speed Velocity Bonus
    else if (personality === 'inbox-zero') {
      if (decisionTimeSeconds <= 2.5) {
        earnedPoints += 150;
        extraBonusText = '⚡ SPEED BONUS! +150';
      }
      if (actionType === 'ARCHIVE') sounds.playClean();
      else if (actionType === 'DELETE') sounds.playDelete();
      else sounds.playWhoosh();

      setTargetCount(prev => {
        const next = prev + 1;
        if (next === mission.targetCount) {
          setMissionCompleted(true);
          sounds.playMissionMilestone();
        }
        return next;
      });
    }

    // 3. CLUTTER PURGE MECHANIC: 2.5x Monster Damage on Promos
    else if (personality === 'remove-promos') {
      if (isPromoEmail && (actionType === 'ARCHIVE' || actionType === 'DELETE')) {
        earnedPoints += 600;
        extraBonusText = '💥 PROMO EXTERMINATED! +600';
        sounds.playDelete();
        setTargetCount(prev => {
          const next = prev + 1;
          if (next === mission.targetCount) {
            setMissionCompleted(true);
            sounds.playMissionMilestone();
          }
          return next;
        });
      } else {
        sounds.playClean();
      }
    }

    // 4. WORK ARCHITECT MECHANIC: Label & Organization Reward
    else if (personality === 'organize-work') {
      if (isWorkEmail && (actionType === 'LABEL' || actionType === 'KEEP')) {
        earnedPoints += 1200;
        extraBonusText = '📚 WORK ORGANIZED! +1,200';
        sounds.playCorrectClassification();
        setTargetCount(prev => {
          const next = prev + 1;
          if (next === mission.targetCount) {
            setMissionCompleted(true);
            sounds.playMissionMilestone();
          }
          return next;
        });
      } else {
        if (actionType === 'ARCHIVE') sounds.playClean();
        else if (actionType === 'DELETE') sounds.playDelete();
        else sounds.playWhoosh();
      }
    } else {
      if (actionType === 'ARCHIVE') sounds.playClean();
      else if (actionType === 'DELETE') sounds.playDelete();
      else sounds.playWhoosh();
    }

    // Play correct classification sound if recommendation followed
    if (isRecommendedAction && earnedPoints > 0) {
      sounds.playCorrectClassification();
    }

    // Monster damage animation
    setMonsterDamaged(true);
    setTimeout(() => setMonsterDamaged(false), 300);

    // Update streak and play progressive combo sound
    const newStreak = isRecommendedAction ? streak + 1 : 1;
    setStreak(newStreak);
    setHighestStreak(prev => Math.max(prev, newStreak));

    if (newStreak === 3 || newStreak === 5 || newStreak === 10) {
      sounds.playComboTier(newStreak);
    }

    // Calculate final score with multiplier
    const finalEarned = Math.round(earnedPoints * (earnedPoints > 0 ? multiplier : 1));
    setScore(prev => Math.max(0, prev + finalEarned));

    // Floating score notification
    setFloatingScore({
      points: finalEarned,
      multiplier: earnedPoints > 0 ? multiplier : 1,
      extraText: extraBonusText,
      isPenalty: finalEarned < 0,
      id: Date.now(),
    });

    // Animate card swipe
    const animationClass = actionType === 'ARCHIVE' ? 'translate-x-[-120%] opacity-0 rotate-[-12deg]' :
      actionType === 'DELETE' ? 'translate-y-[120%] opacity-0 scale-75' :
      actionType === 'STAR' ? 'translate-y-[-120%] opacity-0 scale-125' :
      'translate-x-[120%] opacity-0 rotate-[12deg]';

    setCardAnimation(animationClass);

    // Record action log entry with rich AI detective context
    const actionRecord = {
      messageId: currentEmail.id,
      emailSubject: currentEmail.subject,
      sender: currentEmail.sender,
      category: currentEmail.category,
      action: actionType,
      level: currentEmail.level || 1,
      isVip: isVipEmail,
      isPromo: isPromoEmail,
      isWork: isWorkEmail,
      aiReasoning: currentEmail.aiDetective?.humanReasoning || 'AI Email Detective analyzed metadata.',
      isReal: !isDemo,
      points: finalEarned,
      timestamp: new Date().toISOString(),
    };

    setProcessedActions(prev => [...prev, actionRecord]);

    // Live feedback toast
    setLastActionFeedback({
      action: actionType,
      subject: currentEmail.subject,
      status: isDemo ? 'Simulated in Demo Quest' : 'Synced with Gmail API ✓',
    });

    // Execute via API
    try {
      await executeAction({
        messageId: currentEmail.id,
        action: actionType,
        labelName: customLabel || 'InboxQuest/Organized',
        isDemo,
        emailSubject: currentEmail.subject,
        sender: currentEmail.sender,
        aiReasoning: currentEmail.aiDetective?.humanReasoning,
        level: currentEmail.level,
        isVip: isVipEmail,
        isPromo: isPromoEmail,
        isWork: isWorkEmail,
      });
    } catch (err) {
      console.error('Action execution failed:', err);
    }

    // Advance to next card
    setTimeout(() => {
      setCardAnimation('');
      setCurrentIndex(prev => prev + 1);
      setIsExecuting(false);
    }, 220);

  }, [currentEmail, isExecuting, dontAskDeleteAgain, streak, multiplier, isDemo, personality, mission]);

  // Keyboard Hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (confirmDeleteModal || isPaused) {
        if (e.key === 'Escape' && confirmDeleteModal) {
          setConfirmDeleteModal(null);
        }
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'a' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handleAction('ARCHIVE');
      } else if (key === 'd' || e.key === 'ArrowDown') {
        e.preventDefault();
        handleAction('DELETE');
      } else if (key === 's' || e.key === 'ArrowUp') {
        e.preventDefault();
        handleAction('STAR');
      } else if (key === 'k' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleAction('KEEP');
      } else if (key === 'l') {
        e.preventDefault();
        handleAction('LABEL', 'InboxQuest/Organized');
      } else if (key === 'p' || key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAction, confirmDeleteModal, isPaused]);

  const timerColor = timeLeft > 25 ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' :
    timeLeft > 10 ? 'text-amber-400 border-amber-500/40 bg-amber-500/10' :
    'text-red-400 border-red-500/50 bg-red-500/20 animate-pulse';

  if (!currentEmail || currentIndex >= emails.length) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center">
        <ClutterMonster healthPercent={0} isDefeated={true} totalCleared={processedActions.length} />
        <h2 className="font-arcade text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mt-4 mb-2">
          CLUTTER MONSTER DEFEATED!
        </h2>
        <p className="text-slate-400 font-mono text-sm">Tallying your Mission Impact Score...</p>
      </div>
    );
  }

  const detective = currentEmail.aiDetective || {
    categoryHypothesis: 'Inbox Item',
    senderTrust: 'Medium',
    signals: ['Metadata evaluated'],
    humanReasoning: 'Review and organize.',
    recommendation: 'ARCHIVE',
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between max-w-5xl mx-auto px-4 py-3 select-none">
      
      {/* ----------------- LEVEL UP OVERLAY BANNER ----------------- */}
      {levelUpBanner && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-[#121b2d] border-2 border-cyan-400 px-8 py-5 rounded-3xl shadow-neon-cyan text-center transform scale-110">
            <span className="text-xs font-mono uppercase text-cyan-400 tracking-widest block mb-1">
              ⚔️ ADVANCING QUEST
            </span>
            <h2 className="font-arcade text-3xl sm:text-4xl font-extrabold text-white tracking-wider">
              {levelUpBanner.name}
            </h2>
          </div>
        </div>
      )}

      {/* ----------------- SEVERE PENALTY WARNING FLASH ----------------- */}
      {penaltyWarning && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white font-arcade font-bold px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(255,0,85,0.8)] border border-red-300 flex items-center gap-2 animate-bounce">
          <AlertTriangle className="w-5 h-5" />
          <span>{penaltyWarning}</span>
        </div>
      )}

      {/* ----------------- TOP ARCADE HUD ----------------- */}
      <div className="bg-[#0e1524]/95 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-md mb-2">
        
        {/* Row 1: Active Mission Tracker & Timer */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 mb-2.5">
          
          {/* Active Mission Badge & Live Target */}
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-xl text-xs font-arcade font-bold tracking-wider border flex items-center gap-2 ${
              personality === 'find-important' ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-neon-amber' :
              personality === 'remove-promos' ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-neon-pink' :
              personality === 'organize-work' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-neon-emerald' :
              'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-neon-cyan'
            }`}>
              <Target className="w-3.5 h-3.5" />
              <span>MISSION: {mission.title}</span>
            </div>

            {/* Target Goal Progress */}
            <div className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${
              targetCount >= mission.targetCount 
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' 
                : 'bg-slate-900 border-slate-700 text-slate-300'
            }`}>
              {targetCount >= mission.targetCount ? (
                <span className="flex items-center gap-1 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> GOAL MET ({targetCount}/{mission.targetCount})
                </span>
              ) : (
                <span>Goal: {targetCount} / {mission.targetCount}</span>
              )}
            </div>
          </div>

          {/* Countdown Timer */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border font-mono font-bold text-base sm:text-xl transition-colors ${timerColor}`}>
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>

          {/* Streak & Multiplier */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border font-arcade font-bold text-xs sm:text-sm tracking-wider ${
              multiplier >= 5 ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-neon-amber' :
              multiplier >= 3 ? 'bg-pink-500/20 border-pink-400 text-pink-300 shadow-neon-pink' :
              multiplier >= 2 ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-neon-cyan' :
              'bg-slate-800/80 border-slate-700 text-slate-300'
            }`}>
              <Flame className={`w-3.5 h-3.5 ${multiplier > 1 ? 'fill-current animate-bounce text-amber-400' : 'text-slate-500'}`} />
              <span>STREAK {streak}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40">x{multiplier}</span>
            </div>
          </div>

          {/* Current Score */}
          <div className="text-right">
            <span className="text-[9px] font-mono uppercase text-slate-400 block tracking-widest">
              SCORE
            </span>
            <span className="font-arcade text-lg sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-300">
              {score.toLocaleString()}
            </span>
          </div>

        </div>

        {/* Row 2: Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Overall Quest: {currentIndex + 1} of {emails.length} emails</span>
            <span>{Math.round(((currentIndex + 1) / emails.length) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-pink-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / emails.length) * 100}%` }}
            />
          </div>
        </div>

      </div>

      {/* ----------------- MASCOT & ARENA ----------------- */}
      <ClutterMonster
        healthPercent={monsterHealth}
        isDamaged={monsterDamaged}
        isDefeated={isMonsterDefeated}
        totalCleared={processedActions.length}
        triggerIntro={currentIndex === 0}
      />

      {/* ----------------- CENTERPIECE EMAIL CARD ----------------- */}
      <div className="relative flex-1 flex flex-col justify-center items-center my-1">
        
        {/* Floating Earned Points */}
        {floatingScore && (
          <div 
            key={floatingScore.id}
            className={`absolute -top-6 font-arcade font-bold text-xl sm:text-2xl drop-shadow-[0_0_15px_rgba(0,242,254,0.8)] animate-bounce pointer-events-none z-30 ${
              floatingScore.isPenalty ? 'text-red-400 drop-shadow-[0_0_15px_rgba(255,0,85,0.8)]' : 'text-cyan-300'
            }`}
          >
            {floatingScore.points >= 0 ? `+${floatingScore.points}` : floatingScore.points} PTS! {floatingScore.extraText ? `(${floatingScore.extraText})` : ''}
          </div>
        )}

        {/* Email Card Container */}
        <div 
          className={`w-full max-w-2xl bg-[#121927] border-2 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200 relative ${
            currentEmail.isVip ? 'border-amber-400 shadow-neon-amber' :
            currentLevel === 4 ? 'border-red-500/80 shadow-[0_0_25px_rgba(255,0,85,0.45)]' :
            currentLevel === 3 ? 'border-purple-500/80 shadow-neon-purple' :
            currentLevel === 2 ? 'border-blue-500/80 shadow-neon-cyan' :
            'border-emerald-500/80 shadow-neon-emerald'
          } ${cardAnimation}`}
        >
          
          {/* Header Banner: Level & AI Hypothesis */}
          <div className={`px-4 py-2 flex items-center justify-between text-xs font-mono font-bold tracking-wide border-b ${
            currentEmail.isVip ? 'bg-amber-950/90 border-amber-800 text-amber-200' :
            currentLevel === 4 ? 'bg-red-950/90 border-red-800 text-red-200' :
            currentLevel === 3 ? 'bg-purple-950/90 border-purple-800 text-purple-200' :
            currentLevel === 2 ? 'bg-blue-950/90 border-blue-800 text-blue-200' :
            'bg-emerald-950/90 border-emerald-800 text-emerald-200'
          }`}>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 fill-current" />
              <span>{detective.categoryHypothesis}</span>
              {currentEmail.isVip && (
                <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.2 rounded font-black">
                  VIP SIGNAL
                </span>
              )}
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/40 border border-white/20">
              TRUST: {detective.senderTrust}
            </span>
          </div>

          <div className="p-4 sm:p-5 text-left space-y-3">
            
            {/* Sender & Timestamp Info */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-600 flex items-center justify-center font-arcade font-bold text-base text-white">
                  {currentEmail.sender?.name?.[0]?.toUpperCase() || 'M'}
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm sm:text-base leading-tight">
                    {currentEmail.sender?.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {currentEmail.sender?.email}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 font-mono text-xs">
                <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
                  {currentEmail.age}
                </span>
                {currentEmail.senderClusterCount > 1 && (
                  <span className="text-[10px] text-pink-400 font-bold uppercase bg-pink-950/60 px-2 py-0.5 rounded border border-pink-800">
                    {currentEmail.senderClusterCount}x Sender Cluster
                  </span>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="pt-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight leading-snug">
                {currentEmail.subject}
              </h2>
            </div>

            {/* Snippet */}
            <div className="bg-[#0b101a] rounded-xl p-3 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
              {currentEmail.snippet}
            </div>

            {/* AI EMAIL DETECTIVE DOSSIER */}
            <div className="bg-[#0d1525] border border-cyan-500/40 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Fingerprint className="w-4 h-4 text-cyan-400" />
                  AI EMAIL DETECTIVE DOSSIER
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  CONFIDENCE: {detective.confidence || 96}%
                </span>
              </div>

              {detective.signals && detective.signals.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {detective.signals.map((sig, sIdx) => (
                    <span 
                      key={sIdx}
                      className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/80 text-cyan-300 text-[10px] font-mono"
                    >
                      • {sig}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-xs text-slate-300 font-normal leading-relaxed pt-1 border-t border-slate-800/80">
                <p className="italic">
                  "{detective.humanReasoning}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs font-mono text-cyan-300">
                <span>Recommended: <strong className="text-white underline">{detective.recommendation}</strong></span>
                <span className="text-slate-400 text-[11px]">Alt: {detective.altRecommendation}</span>
              </div>
            </div>

          </div>
        </div>

        {/* Action feedback toast */}
        {lastActionFeedback && (
          <div className="mt-2 text-xs font-mono text-slate-400 flex items-center gap-2 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Action: <strong className="text-white">{lastActionFeedback.action}</strong> • {lastActionFeedback.status}</span>
          </div>
        )}

      </div>

      {/* ----------------- ARCADE ACTION BAR ----------------- */}
      <div className="bg-[#0e1524]/95 border border-slate-800 rounded-2xl p-3 shadow-2xl backdrop-blur-md mt-1">
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          
          {/* ARCHIVE [A] */}
          <button
            onClick={() => handleAction('ARCHIVE')}
            disabled={isExecuting}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#14233a] hover:bg-[#1a3154] active:scale-95 border-2 border-cyan-500/60 hover:border-cyan-400 text-cyan-300 transition-all shadow-sm hover:shadow-neon-cyan cursor-pointer disabled:opacity-50"
          >
            <Archive className="w-5 h-5 mb-1 text-cyan-400" />
            <span className="font-arcade font-bold text-sm tracking-wider">ARCHIVE</span>
            <span className="text-[9px] font-mono bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-400 mt-1 border border-cyan-800">
              KEY: [A] / [←]
            </span>
          </button>

          {/* DELETE [D] */}
          <button
            onClick={() => handleAction('DELETE')}
            disabled={isExecuting}
            className={`flex flex-col items-center justify-center p-3 rounded-xl active:scale-95 border-2 text-red-300 transition-all shadow-sm cursor-pointer disabled:opacity-50 ${
              personality === 'find-important' && currentEmail.isVip
                ? 'bg-red-950 border-red-500 shadow-[0_0_20px_rgba(255,0,85,0.7)] animate-pulse'
                : 'bg-[#2e131d] hover:bg-[#3f1927] border-red-500/60 hover:border-red-400 hover:shadow-[0_0_15px_rgba(255,0,85,0.4)]'
            }`}
          >
            <Trash2 className="w-5 h-5 mb-1 text-red-400" />
            <span className="font-arcade font-bold text-sm tracking-wider">DELETE</span>
            <span className="text-[9px] font-mono bg-red-950 px-1.5 py-0.5 rounded text-red-400 mt-1 border border-red-800">
              KEY: [D] / [↓]
            </span>
          </button>

          {/* STAR [S] */}
          <button
            onClick={() => handleAction('STAR')}
            disabled={isExecuting}
            className={`flex flex-col items-center justify-center p-3 rounded-xl active:scale-95 border-2 text-amber-300 transition-all shadow-sm cursor-pointer disabled:opacity-50 ${
              currentEmail.isVip 
                ? 'bg-[#3b2f12] border-amber-400 shadow-neon-amber scale-[1.02]' 
                : 'bg-[#2b220d] hover:bg-[#3b2f12] border-amber-500/60 hover:border-amber-400 hover:shadow-neon-amber'
            }`}
          >
            <Star className="w-5 h-5 mb-1 text-amber-400 fill-current" />
            <span className="font-arcade font-bold text-sm tracking-wider">STAR</span>
            <span className="text-[9px] font-mono bg-amber-950 px-1.5 py-0.5 rounded text-amber-400 mt-1 border border-amber-800">
              KEY: [S] / [↑]
            </span>
          </button>

          {/* KEEP [K] */}
          <button
            onClick={() => handleAction('KEEP')}
            disabled={isExecuting}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#12281e] hover:bg-[#18392a] active:scale-95 border-2 border-emerald-500/60 hover:border-emerald-400 text-emerald-300 transition-all shadow-sm hover:shadow-neon-emerald cursor-pointer disabled:opacity-50"
          >
            <Bookmark className="w-5 h-5 mb-1 text-emerald-400" />
            <span className="font-arcade font-bold text-sm tracking-wider">KEEP</span>
            <span className="text-[9px] font-mono bg-emerald-950 px-1.5 py-0.5 rounded text-emerald-400 mt-1 border border-emerald-800">
              KEY: [K] / [→]
            </span>
          </button>

          {/* LABEL [L] */}
          <button
            onClick={() => handleAction('LABEL', 'InboxQuest/Organized')}
            disabled={isExecuting}
            className={`col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-3 rounded-xl active:scale-95 border-2 text-purple-300 transition-all shadow-sm cursor-pointer disabled:opacity-50 ${
              personality === 'organize-work' && currentEmail.isWork
                ? 'bg-[#3a1b59] border-purple-400 shadow-neon-purple scale-[1.02]'
                : 'bg-[#241334] hover:bg-[#341b4b] border-purple-500/60 hover:border-purple-400 hover:shadow-neon-purple'
            }`}
          >
            <Tag className="w-5 h-5 mb-1 text-purple-400" />
            <span className="font-arcade font-bold text-sm tracking-wider">LABEL</span>
            <span className="text-[9px] font-mono bg-purple-950 px-1.5 py-0.5 rounded text-purple-400 mt-1 border border-purple-800">
              KEY: [L]
            </span>
          </button>

        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 mt-2 border-t border-slate-800">
          <span>Active Mission: <strong>{mission.title}</strong> • Goal: <strong>{mission.targetLabel}</strong></span>
          <button 
            onClick={onExitGame}
            className="text-slate-500 hover:text-red-400 transition"
          >
            Quit Quest (Esc)
          </button>
        </div>

      </div>

      {/* ----------------- SAFETY CONFIRMATION MODAL ----------------- */}
      {confirmDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-[#121926] border-2 border-red-500/60 rounded-2xl shadow-[0_0_30px_rgba(255,0,85,0.4)] p-6 text-left">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-arcade text-lg font-bold text-white tracking-wide">
                  SAFETY CHECK: TRASH EMAIL?
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Moves to Gmail Trash (Recoverable for 30 days)
                </p>
              </div>
            </div>

            {confirmDeleteModal.email.isVip && (
              <div className="p-2.5 rounded-lg bg-red-950/80 border border-red-600 text-red-200 text-xs font-mono font-bold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>WARNING: THIS IS A VIP EMAIL! Trashing will penalize -800 points.</span>
              </div>
            )}

            <p className="text-sm text-slate-200 mb-2 font-medium">
              "{confirmDeleteModal.email.subject}"
            </p>

            <label className="flex items-center gap-2 text-xs text-slate-300 font-mono mb-5 cursor-pointer">
              <input
                type="checkbox"
                checked={dontAskDeleteAgain}
                onChange={e => setDontAskDeleteAgain(e.target.checked)}
                className="rounded border-slate-700 text-red-500 focus:ring-0"
              />
              <span>Don't ask again this round</span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmDeleteModal(null);
                  handleAction('DELETE');
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-arcade font-bold tracking-wider text-sm transition shadow-sm cursor-pointer"
              >
                YES, TRASH IT [Enter]
              </button>
              <button
                onClick={() => setConfirmDeleteModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-arcade text-sm transition cursor-pointer"
              >
                CANCEL [Esc]
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
