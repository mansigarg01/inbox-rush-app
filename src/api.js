// src/api.js
// Client API connector for Inbox Quest

const API_BASE = '/api';

export async function fetchConfig() {
  const res = await fetch(`${API_BASE}/config`);
  if (!res.ok) throw new Error('Failed to load server configuration');
  return res.json();
}

export async function fetchAuthStatus() {
  const res = await fetch(`${API_BASE}/auth/status`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to check auth status');
  return res.json();
}

export async function fetchGoogleAuthUrl() {
  const res = await fetch(`${API_BASE}/auth/google/url`, {
    credentials: 'include',
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to generate Google OAuth URL');
  }
  return res.json();
}

export async function logoutUser() {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to logout');
  return res.json();
}

export async function fetchEmails(isDemo = true, personality = 'inbox-zero') {
  const url = isDemo 
    ? `${API_BASE}/emails?demo=true&personality=${encodeURIComponent(personality)}` 
    : `${API_BASE}/emails?personality=${encodeURIComponent(personality)}`;
    
  const res = await fetch(url, {
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const err = new Error(errorData.message || 'Failed to fetch emails');
    err.code = errorData.error;
    throw err;
  }
  return res.json();
}

export async function executeAction({
  messageId,
  action,
  labelName,
  isDemo = true,
  emailSubject,
  sender,
  aiReasoning,
  level,
}) {
  const res = await fetch(`${API_BASE}/actions/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      messageId,
      action,
      labelName,
      isDemo,
      emailSubject,
      sender,
      aiReasoning,
      level,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const err = new Error(errorData.message || `Failed to execute ${action}`);
    err.code = errorData.error;
    throw err;
  }
  return res.json();
}

export async function fetchSummary() {
  const res = await fetch(`${API_BASE}/stats/summary`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to fetch session summary');
  return res.json();
}

export async function resetSummary() {
  const res = await fetch(`${API_BASE}/stats/reset`, {
    method: 'POST',
    credentials: 'include',
  });
  return res.json();
}
