// server/index.js
// Main Express server for Inbox Quest

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  hasOAuthCredentials,
  getAuthorizationUrl,
  exchangeCodeForTokens,
} from './gmailClient.js';
import { fetchRealEmails, executeRealAction } from './gmailActions.js';
import { MOCK_EMAILS } from './mockEmails.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(express.json());
app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'inbox_quest_arcade_secret_2026',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}));

function getAuditLog(req) {
  if (!req.session.auditLog) {
    req.session.auditLog = [];
  }
  return req.session.auditLog;
}

// -------------------------------------------------------------
// Mission Config Definitions
// -------------------------------------------------------------
const MISSION_CONFIGS = {
  'inbox-zero': {
    id: 'inbox-zero',
    title: 'INBOX ZERO',
    targetCount: 15,
    targetType: 'clear',
    targetLabel: 'Clear 15 Emails',
    speedBonus: 150,
    badgeColor: 'cyan',
    description: 'Process 15 emails before the 60s timer expires with speed combo bonuses.',
  },
  'find-important': {
    id: 'find-important',
    title: 'SIGNAL HUNTER',
    targetCount: 4,
    targetType: 'vip',
    targetLabel: 'Rescue 4 VIP Messages',
    vipBonus: 1500,
    vipPenalty: 800,
    badgeColor: 'amber',
    description: 'Star or Keep 4 VIP/Urgent emails. Beware: Trashing a VIP email incurs an 800-point penalty!',
  },
  'remove-promos': {
    id: 'remove-promos',
    title: 'CLUTTER PURGE',
    targetCount: 8,
    targetType: 'promo',
    targetLabel: 'Purge 8 Commercial Blasts',
    monsterDamageMult: 2.5,
    badgeColor: 'pink',
    description: 'Exterminate promotional blasts and marketing spam to deal 2.5x damage to the Clutter Monster.',
  },
  'organize-work': {
    id: 'organize-work',
    title: 'WORK ARCHITECT',
    targetCount: 5,
    targetType: 'work',
    targetLabel: 'Label 5 Work Documents',
    labelBonus: 1200,
    badgeColor: 'emerald',
    description: 'Organize engineering references, SaaS invoices, and project invites using the [L] LABEL key.',
  },
};

// 1. Health & Config Status
app.get('/api/config', (req, res) => {
  const oauthConfigured = hasOAuthCredentials();
  res.json({
    status: 'online',
    appName: 'Inbox Quest',
    oauthConfigured,
    demoAvailable: true,
    message: oauthConfigured
      ? 'Google OAuth credentials configured. Real Gmail mode enabled.'
      : 'Google OAuth not configured in .env. Full gameplay available in DEMO MODE.'
  });
});

// 2. Authentication Status
app.get('/api/auth/status', (req, res) => {
  const isAuthenticated = Boolean(req.session.tokens);
  res.json({
    authenticated: isAuthenticated,
    user: req.session.user || null,
    isDemo: !isAuthenticated,
    oauthAvailable: hasOAuthCredentials(),
  });
});

// 3. Initiate Google OAuth Flow
app.get('/api/auth/google/url', (req, res) => {
  try {
    if (!hasOAuthCredentials()) {
      return res.status(400).json({
        error: 'MISSING_CREDENTIALS',
        message: 'Google Client ID & Secret are not configured in server .env file.',
      });
    }

    const authUrl = getAuthorizationUrl('inbox_quest_game');
    res.json({ url: authUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Google OAuth Callback
app.get('/api/auth/google/callback', async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    console.warn('OAuth authorization error:', error);
    return res.redirect(`${FRONTEND_URL}/?auth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return res.redirect(`${FRONTEND_URL}/?auth_error=No_code_received`);
  }

  try {
    const { tokens, user } = await exchangeCodeForTokens(code);
    req.session.tokens = tokens;
    req.session.user = user;
    req.session.auditLog = [];

    res.redirect(`${FRONTEND_URL}/?auth=connected&user=${encodeURIComponent(user.email || user.name)}`);
  } catch (err) {
    console.error('Failed to exchange code:', err);
    res.redirect(`${FRONTEND_URL}/?auth_error=${encodeURIComponent(err.message || 'Auth_exchange_failed')}`);
  }
});

// 5. Logout
app.post('/api/auth/logout', (req, res) => {
  req.session.tokens = null;
  req.session.user = null;
  req.session.auditLog = [];
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 6. Fetch Emails with Mission-Specific Dataset Transformation
app.get('/api/emails', async (req, res) => {
  const forceDemo = req.query.demo === 'true';
  const personality = req.query.personality || 'inbox-zero';
  const isAuthenticated = Boolean(req.session.tokens);
  const missionConfig = MISSION_CONFIGS[personality] || MISSION_CONFIGS['inbox-zero'];

  // DEMO MODE DATASET TRANSFORMATION
  if (forceDemo || !isAuthenticated) {
    let dataset = [...MOCK_EMAILS];

    // Modify dataset ordering and filtering according to chosen mission:
    if (personality === 'find-important') {
      // SIGNAL HUNTER: High density of VIP/Urgent messages interleaved with tricky decoys
      const vips = dataset.filter(e => e.isVip || e.isBossChallenge);
      const decoys = dataset.filter(e => !e.isVip && !e.isBossChallenge);
      dataset = [
        vips[0], decoys[0], vips[1], decoys[1], vips[2], decoys[2], vips[3], decoys[3], vips[4] || vips[0], decoys[4]
      ].filter(Boolean);
    } else if (personality === 'remove-promos') {
      // CLUTTER PURGE: Dense pack of commercial blasts, spam, newsletters, retention digests
      const promos = dataset.filter(e => e.isPromo);
      const others = dataset.filter(e => !e.isPromo);
      dataset = [...promos, ...others.slice(0, 4)];
    } else if (personality === 'organize-work') {
      // WORK ARCHITECT: Dense concentration of technical guides, engineering PRs, invoices, workspace invites
      const workItems = dataset.filter(e => e.isWork);
      const nonWork = dataset.filter(e => !e.isWork);
      dataset = [...workItems, ...nonWork.slice(0, 3)];
    } else {
      // INBOX ZERO: Progressive high-speed balanced sprint
      dataset.sort((a, b) => a.level - b.level);
    }

    return res.json({
      mode: 'DEMO',
      isReal: false,
      banner: 'DEMO QUEST — Actions are simulated',
      personality,
      missionConfig,
      count: dataset.length,
      emails: dataset,
    });
  }

  // REAL GMAIL MODE
  try {
    const realEmails = await fetchRealEmails(req.session.tokens, 25);
    if (!realEmails || realEmails.length === 0) {
      return res.json({
        mode: 'REAL',
        isReal: true,
        banner: 'REAL GMAIL CONNECTED',
        personality,
        missionConfig,
        count: 0,
        emails: [],
        message: 'Your Inbox is already completely clean! Zero unread emails found.',
      });
    }

    // Sort according to chosen mission
    let tailoredReal = [...realEmails];
    if (personality === 'find-important') {
      tailoredReal.sort((a, b) => (b.level === 4 ? 1 : 0) - (a.level === 4 ? 1 : 0));
    } else if (personality === 'remove-promos') {
      tailoredReal.sort((a, b) => (a.category === 'Promotions' ? -1 : 1));
    } else if (personality === 'organize-work') {
      tailoredReal.sort((a, b) => (a.category === 'Primary' || a.category === 'Updates' ? -1 : 1));
    }

    res.json({
      mode: 'REAL',
      isReal: true,
      banner: 'REAL GMAIL CONNECTED — Real actions will be executed',
      personality,
      missionConfig,
      count: tailoredReal.length,
      emails: tailoredReal,
    });
  } catch (err) {
    console.error('Error in /api/emails:', err);
    if (err.code === 'AUTH_EXPIRED') {
      req.session.tokens = null;
      return res.status(401).json({
        error: 'AUTH_EXPIRED',
        message: 'Your Gmail session has expired. Please re-authenticate or play in Demo Quest mode.',
      });
    }

    res.status(500).json({
      error: 'GMAIL_API_ERROR',
      message: 'Failed to fetch emails from Gmail. Check your connection or play in Demo Quest mode.',
      details: err.message,
    });
  }
});

// 7. Execute Game Action (Real or Simulated)
app.post('/api/actions/execute', async (req, res) => {
  const { messageId, action, labelName, isDemo, aiReasoning, level, isVip, isPromo, isWork } = req.body;

  if (!messageId || !action) {
    return res.status(400).json({ error: 'messageId and action are required' });
  }

  const isAuthenticated = Boolean(req.session.tokens);
  const runAsDemo = isDemo === true || !isAuthenticated;
  const audit = getAuditLog(req);

  // DEMO MODE EXECUTION
  if (runAsDemo) {
    const mockEmail = MOCK_EMAILS.find(e => e.id === messageId) || {
      id: messageId,
      subject: req.body.emailSubject || 'Demo Quest Email',
      sender: req.body.sender || { name: 'Demo Sender', email: 'demo@example.com' }
    };

    let simulatedEffect = '';
    switch (action) {
      case 'ARCHIVE':
        simulatedEffect = 'Would remove INBOX label on Gmail API';
        break;
      case 'DELETE':
        simulatedEffect = 'Would move email to Gmail Trash via users.messages.trash';
        break;
      case 'STAR':
        simulatedEffect = 'Would add STARRED label on Gmail API';
        break;
      case 'KEEP':
        simulatedEffect = 'Leaves email in Inbox unchanged (marks as read)';
        break;
      case 'LABEL':
        simulatedEffect = `Would apply label "${labelName || 'InboxQuest/Organized'}" on Gmail`;
        break;
      default:
        simulatedEffect = 'Simulated custom action';
    }

    const logEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      messageId,
      emailSubject: mockEmail.subject,
      sender: mockEmail.sender,
      action,
      level: level || 1,
      isVip: Boolean(isVip),
      isPromo: Boolean(isPromo),
      isWork: Boolean(isWork),
      aiReasoning: aiReasoning || 'AI Email Detective analyzed metadata signals.',
      isReal: false,
      mode: 'DEMO',
      effect: simulatedEffect,
      timestamp: new Date().toISOString(),
    };
    audit.push(logEntry);

    return res.json({
      success: true,
      mode: 'DEMO',
      isReal: false,
      action,
      messageId,
      effect: simulatedEffect,
      banner: 'DEMO QUEST — Actions are simulated',
      timestamp: logEntry.timestamp,
    });
  }

  // REAL GMAIL API EXECUTION
  try {
    const result = await executeRealAction(req.session.tokens, messageId, action, labelName);

    const logEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      messageId,
      emailSubject: req.body.emailSubject || 'Real Gmail Message',
      sender: req.body.sender || { name: 'Gmail Contact', email: '' },
      action,
      level: level || 1,
      isVip: Boolean(isVip),
      isPromo: Boolean(isPromo),
      isWork: Boolean(isWork),
      aiReasoning: aiReasoning || 'Analyzed via Gmail headers and sender frequency.',
      isReal: true,
      mode: 'REAL',
      effect: result.realActionDescription,
      timestamp: new Date().toISOString(),
    };
    audit.push(logEntry);

    return res.json({
      success: true,
      mode: 'REAL',
      isReal: true,
      action,
      messageId,
      effect: result.realActionDescription,
      details: result,
      timestamp: logEntry.timestamp,
    });
  } catch (err) {
    console.error(`Failed to execute real action ${action}:`, err);

    if (err.code === 'AUTH_EXPIRED') {
      req.session.tokens = null;
      return res.status(401).json({
        error: 'AUTH_EXPIRED',
        message: 'Gmail authorization expired. Please reconnect your Gmail account.',
      });
    }

    res.status(500).json({
      error: 'ACTION_FAILED',
      message: `Failed to execute ${action} on Gmail: ${err.message}`,
    });
  }
});

// 8. Session Impact & Audit Summary
app.get('/api/stats/summary', (req, res) => {
  const audit = getAuditLog(req);
  const counts = {
    total: audit.length,
    archived: audit.filter(a => a.action === 'ARCHIVE').length,
    deleted: audit.filter(a => a.action === 'DELETE').length,
    starred: audit.filter(a => a.action === 'STAR').length,
    kept: audit.filter(a => a.action === 'KEEP').length,
    labeled: audit.filter(a => a.action === 'LABEL').length,
  };

  const manualMinutesSaved = Math.round((counts.total * 45) / 60);
  const clutterReductionPercent = Math.min(100, Math.round(((counts.archived + counts.deleted) / Math.max(1, counts.total)) * 100));
  const healthScore = Math.min(100, Math.max(70, 70 + Math.round((counts.total * 3))));

  res.json({
    counts,
    manualMinutesSaved,
    clutterReductionPercent,
    healthScore,
    auditLog: audit,
  });
});

app.post('/api/stats/reset', (req, res) => {
  req.session.auditLog = [];
  res.json({ success: true });
});

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('Inbox Quest API Server running.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Inbox Quest Backend running on http://localhost:${PORT}`);
  console.log(`⚔️ Clutter Monster Active | Mode: ${hasOAuthCredentials() ? 'Real Gmail OAuth Ready' : 'Demo Mode (Zero Config)'}`);
});
