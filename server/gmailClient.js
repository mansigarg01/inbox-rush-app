// server/gmailClient.js
// Handles Google OAuth 2.0 and Gmail API client initialization

import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback';

export const SCOPES = [
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

export function hasOAuthCredentials() {
  return Boolean(CLIENT_ID && CLIENT_SECRET && CLIENT_ID.trim().length > 0 && CLIENT_SECRET.trim().length > 0);
}

export function createOAuth2Client() {
  if (!hasOAuthCredentials()) {
    return null;
  }
  return new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
}

export function getAuthorizationUrl(state = '') {
  const oauth2Client = createOAuth2Client();
  if (!oauth2Client) {
    throw new Error('Google OAuth Credentials are not configured in .env');
  }

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    include_granted_scopes: true,
    prompt: 'consent',
    state,
  });
}

export async function exchangeCodeForTokens(code) {
  const oauth2Client = createOAuth2Client();
  if (!oauth2Client) {
    throw new Error('Google OAuth Credentials are not configured in .env');
  }

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Fetch basic user profile info
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const userProfile = await oauth2.userinfo.get();

  return {
    tokens,
    user: {
      email: userProfile.data.email,
      name: userProfile.data.name,
      picture: userProfile.data.picture,
    },
  };
}

export function getGmailService(tokens) {
  const oauth2Client = createOAuth2Client();
  if (!oauth2Client) {
    throw new Error('Google OAuth Credentials are not configured');
  }
  oauth2Client.setCredentials(tokens);
  return google.gmail({ version: 'v1', auth: oauth2Client });
}
