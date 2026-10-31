// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { InboxPersonalitySelector } from './components/InboxPersonalitySelector';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ConnectModal } from './components/ConnectModal';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { fetchConfig, fetchAuthStatus, fetchEmails, logoutUser } from './api';
import { sounds } from './soundEffects';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function App() {
  const [view, setView] = useState('LANDING'); // 'LANDING' | 'SETUP_PERSONALITY' | 'GAME' | 'RESULTS'
  const [isDemo, setIsDemo] = useState(true);
  const [personality, setPersonality] = useState('inbox-zero');
  const [missionConfig, setMissionConfig] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [oauthConfigured, setOauthConfigured] = useState(false);
  const [safeDeleteEnabled, setSafeDeleteEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(sounds.isMuted);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false);

  // Email queue for current round
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState(null);

  // Results from completed round
  const [gameResults, setGameResults] = useState(null);

  // Check URL params for OAuth status callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authStatus = params.get('auth');
    const authError = params.get('auth_error');

    if (authStatus === 'connected') {
      window.history.replaceState({}, document.title, window.location.pathname);
      initAppState(false);
    } else if (authError) {
      setErrorNotice(`Google Authentication error: ${authError.replace(/_/g, ' ')}`);
      window.history.replaceState({}, document.title, window.location.pathname);
      initAppState(true);
    } else {
      initAppState();
    }
  }, []);

  const initAppState = async (forceDemoMode = null) => {
    try {
      const [configData, authData] = await Promise.all([
        fetchConfig().catch(() => ({ oauthConfigured: false })),
        fetchAuthStatus().catch(() => ({ authenticated: false, user: null })),
      ]);

      setOauthConfigured(Boolean(configData.oauthConfigured));
      setIsAuthenticated(Boolean(authData.authenticated));
      setUser(authData.user || null);

      if (forceDemoMode !== null) {
        setIsDemo(forceDemoMode);
      } else {
        setIsDemo(!authData.authenticated);
      }
    } catch (err) {
      console.warn('Initialization notice:', err.message);
      setIsDemo(true);
    }
  };

  const handleStartQuestSetup = (demoChoice = true) => {
    setIsDemo(demoChoice);
    setView('SETUP_PERSONALITY');
  };

  const handleSelectPersonalityAndStart = async (chosenPersonality) => {
    setPersonality(chosenPersonality);
    try {
      setLoading(true);
      setErrorNotice(null);

      const emailData = await fetchEmails(isDemo, chosenPersonality);
      setMissionConfig(emailData.missionConfig || null);

      if (!emailData.emails || emailData.emails.length === 0) {
        if (!isDemo) {
          setErrorNotice('Your real Gmail inbox is completely clean! Starting in Demo Quest mode so you can play.');
          const demoFallback = await fetchEmails(true, chosenPersonality);
          setIsDemo(true);
          setMissionConfig(demoFallback.missionConfig || null);
          setEmails(demoFallback.emails);
          setView('GAME');
        } else {
          setErrorNotice('No emails found.');
        }
      } else {
        setEmails(emailData.emails);
        setView('GAME');
      }
    } catch (err) {
      console.error('Failed to start quest:', err);
      if (err.code === 'AUTH_EXPIRED') {
        setIsAuthenticated(false);
        setUser(null);
        setErrorNotice('Your Gmail session expired. Starting in Demo Quest mode.');
        const demoFallback = await fetchEmails(true, chosenPersonality);
        setIsDemo(true);
        setMissionConfig(demoFallback.missionConfig || null);
        setEmails(demoFallback.emails);
        setView('GAME');
      } else {
        setErrorNotice(`Unable to load emails: ${err.message}. Starting Demo Quest mode instead.`);
        const demoFallback = await fetchEmails(true, chosenPersonality);
        setIsDemo(true);
        setMissionConfig(demoFallback.missionConfig || null);
        setEmails(demoFallback.emails);
        setView('GAME');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGameOver = (results) => {
    setGameResults(results);
    setView('RESULTS');
  };

  const handlePlayAgain = () => {
    handleSelectPersonalityAndStart(personality);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      setUser(null);
      setIsDemo(true);
      if (view === 'GAME' || view === 'SETUP_PERSONALITY') {
        setView('LANDING');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans select-none">
      
      {/* Top Navigation */}
      <Navbar
        isDemo={isDemo}
        user={user}
        onLogout={handleLogout}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
        onOpenAudioSettings={() => setIsAudioSettingsOpen(true)}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        safeDeleteEnabled={safeDeleteEnabled}
        onToggleSafeDelete={() => setSafeDeleteEnabled(prev => !prev)}
        onGoHome={() => setView('LANDING')}
      />

      {/* Global Error Notice */}
      {errorNotice && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center text-xs text-amber-300 font-mono flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{errorNotice}</span>
          <button
            onClick={() => setErrorNotice(null)}
            className="ml-2 underline text-amber-200 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {loading ? (
          <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center">
            <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin mb-4" />
            <h2 className="font-arcade text-2xl font-bold text-white tracking-wide">
              {isDemo ? 'INITIALIZING MISSION PIPELINE...' : 'CONFIGURING MISSION OBJECTIVES ON GMAIL API...'}
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Applying scoring rules, filtering dataset signatures, and arming the Clutter Monster
            </p>
          </div>
        ) : view === 'LANDING' ? (
          <LandingPage
            onStartQuestSetup={handleStartQuestSetup}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
            isDemo={isDemo}
            isAuthenticated={isAuthenticated}
            user={user}
            oauthConfigured={oauthConfigured}
          />
        ) : view === 'SETUP_PERSONALITY' ? (
          <InboxPersonalitySelector
            onSelectPersonality={handleSelectPersonalityAndStart}
            isDemo={isDemo}
            onBack={() => setView('LANDING')}
          />
        ) : view === 'GAME' ? (
          <GameScreen
            emails={emails}
            isDemo={isDemo}
            personality={personality}
            missionConfig={missionConfig}
            safeDeleteEnabled={safeDeleteEnabled}
            onGameOver={handleGameOver}
            onExitGame={() => setView('LANDING')}
          />
        ) : (
          <ResultsScreen
            results={gameResults}
            onPlayAgain={handlePlayAgain}
            onChangePersonality={() => setView('SETUP_PERSONALITY')}
          />
        )}
      </main>

      {/* Google OAuth Connect Modal */}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onStartDemo={() => handleStartQuestSetup(true)}
        oauthConfigured={oauthConfigured}
      />

      {/* Audio Settings Modal */}
      <AudioSettingsModal
        isOpen={isAudioSettingsOpen}
        onClose={() => {
          setIsAudioSettingsOpen(false);
          setIsMuted(sounds.isMuted);
        }}
      />

    </div>
  );
}
