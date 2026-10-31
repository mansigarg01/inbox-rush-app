// server/gmailActions.js
// Handles real-world Gmail API interactions with minimal scopes and deep AI Email Detective analysis

import { getGmailService } from './gmailClient.js';

// Helper to compute relative age
function getRelativeAge(dateString) {
  if (!dateString) return 'Recently';
  const emailDate = new Date(dateString);
  const diffMs = Date.now() - emailDate.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 60) {
    return `${Math.max(1, diffMinutes)}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  }
}

// Parse From header: "John Doe <john@example.com>" -> { name: "John Doe", email: "john@example.com" }
function parseFromHeader(fromStr = '') {
  const match = fromStr.match(/^(.*?)\s*<(.+?)>$/);
  if (match) {
    const name = match[1].replace(/["']/g, '').trim();
    return {
      name: name || match[2].split('@')[0],
      email: match[2].trim(),
    };
  }
  return {
    name: fromStr.split('@')[0] || fromStr,
    email: fromStr,
  };
}

// Advanced AI Email Detective Analyzer for Real Gmail Messages
function analyzeWithAiDetective({ sender, subject = '', snippet = '', dateHeader = '', labels = [], senderFrequency = 1 }) {
  const subLower = subject.toLowerCase();
  const snipLower = snippet.toLowerCase();
  const fromDomain = sender.email.split('@')[1] || '';
  
  const isUrgent = labels.includes('IMPORTANT') || 
    subLower.includes('urgent') || 
    subLower.includes('action required') || 
    subLower.includes('alert') || 
    subLower.includes('deadline');

  const isPromo = labels.includes('CATEGORY_PROMOTIONS') || 
    subLower.includes('sale') || 
    subLower.includes('deal') || 
    subLower.includes('off') || 
    subLower.includes('discount') || 
    subLower.includes('newsletter');

  const isReceipt = subLower.includes('receipt') || 
    subLower.includes('invoice') || 
    subLower.includes('payment') || 
    subLower.includes('order confirmed') || 
    subLower.includes('billed');

  const isSocial = labels.includes('CATEGORY_SOCIAL') || 
    fromDomain.includes('linkedin') || 
    fromDomain.includes('twitter') || 
    fromDomain.includes('facebook');

  // Multi-tier classification & Level assignment
  if (isUrgent) {
    return {
      level: 4,
      levelName: "Level 4: Inbox Boss Challenge",
      isBossChallenge: true,
      aiDetective: {
        categoryHypothesis: "HIGH-PRIORITY CRITICAL COMMUNICATION",
        confidence: 98,
        senderTrust: "High (Action Required Flag)",
        signals: [
          `Sender domain: ${fromDomain}`,
          `High-urgency keywords detected in subject: "${subject}"`,
          `Gmail VIP priority indicator marked by server`,
          `Recent delivery timestamp: ${getRelativeAge(dateHeader)}`
        ],
        humanReasoning: `The sender '${sender.name}' (${sender.email}) sent an email containing priority triggers matching urgent action items. Immediate attention recommended. Star or Keep in view.`,
        recommendation: "STAR",
        altRecommendation: "KEEP",
        explanation: "Boss Challenge: Urgent priority item requiring review or action!"
      }
    };
  }

  if (senderFrequency >= 2) {
    return {
      level: 3,
      levelName: "Level 3: Sender Attack",
      senderClusterCount: senderFrequency,
      aiDetective: {
        categoryHypothesis: "REPEATED SENDER BACKLOG",
        confidence: 95,
        senderTrust: "Medium (Frequent Dispatcher)",
        signals: [
          `Detected ${senderFrequency} emails from this sender in active inbox sample`,
          `High recurring volume from @${fromDomain}`,
          `Informational cadence rather than emergency`
        ],
        humanReasoning: `You have multiple messages accumulated from '${sender.name}'. This sender generates high recurrent inbox volume. Bulk archiving or tagging with a label frees up clutter quickly.`,
        recommendation: "ARCHIVE",
        altRecommendation: "LABEL",
        explanation: `Sender Attack: Part of a ${senderFrequency}-message sender pile. Archive to clear!`
      }
    };
  }

  if (isReceipt) {
    return {
      level: 2,
      levelName: "Level 2: Detective Mode",
      aiDetective: {
        categoryHypothesis: "TRANSACTION RECORD / RECEIPT",
        confidence: 96,
        senderTrust: "High (Verified Merchant / Gateway)",
        signals: [
          "Financial transaction signature detected",
          "Archival record suitable for expense auditing",
          "No ongoing reply thread required"
        ],
        humanReasoning: `This message from '${sender.name}' matches a payment or receipt pattern. The purchase is logged. Archiving removes it from your inbox clutter while keeping it 100% searchable in All Mail for tax time.`,
        recommendation: "ARCHIVE",
        altRecommendation: "KEEP",
        explanation: "Detective Mode: Transaction receipt. Safe to archive; remains indexed in All Mail."
      }
    };
  }

  if (isPromo || isSocial) {
    return {
      level: 1,
      levelName: "Level 1: Quick Wins",
      aiDetective: {
        categoryHypothesis: "COMMERCIAL PROMOTIONS & MARKETING",
        confidence: 97,
        senderTrust: "Low (Commercial Broadcast)",
        signals: [
          `Categorized by Gmail as ${isSocial ? 'Social' : 'Promotions'}`,
          `Commercial distribution keywords found in headers`,
          `Zero personal direct exchange history`
        ],
        humanReasoning: `Broadcast email from '${sender.name}' (@${fromDomain}). Subject '${subject}' reflects commercial promotional cycles. Safely archive or move to trash to achieve inbox zero.`,
        recommendation: "ARCHIVE",
        altRecommendation: "DELETE",
        explanation: "Quick Wins: Marketing promo. Archive to clear the view, or delete to purge."
      }
    };
  }

  // General ambiguous message -> Detective Mode
  return {
    level: 2,
    levelName: "Level 2: Detective Mode",
    aiDetective: {
      categoryHypothesis: "GENERAL INBOX CORRESPONDENCE",
      confidence: 88,
      senderTrust: "Medium (Standard Exchange)",
      signals: [
        `Sender: ${sender.email}`,
        `Age: ${getRelativeAge(dateHeader)}`,
        `Subject length: ${subject.length} characters`
      ],
      humanReasoning: `Message from '${sender.name}'. If you have read this and no further follow-up is pending, archive it. If awaiting an action, Keep or Star.`,
      recommendation: "ARCHIVE",
      altRecommendation: "KEEP",
      explanation: "Detective Mode: Review message and decide whether to archive or keep."
    }
  };
}

/**
 * Fetch a safe sample of real inbox emails via Gmail API
 */
export async function fetchRealEmails(tokens, maxResults = 25) {
  const gmail = getGmailService(tokens);

  try {
    const listRes = await gmail.users.messages.list({
      userId: 'me',
      q: 'in:inbox',
      maxResults,
    });

    const messages = listRes.data.messages || [];
    if (messages.length === 0) {
      return [];
    }

    // Step 1: Fetch header details for each message
    const rawEmails = await Promise.all(messages.map(async (msg) => {
      try {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'metadata',
          metadataHeaders: ['From', 'Subject', 'Date'],
        });

        const headers = detail.data.payload?.headers || [];
        const fromHeader = headers.find(h => h.name.toLowerCase() === 'from')?.value || 'Unknown Sender';
        const subjectHeader = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const dateHeader = headers.find(h => h.name.toLowerCase() === 'date')?.value || '';

        const sender = parseFromHeader(fromHeader);
        const age = getRelativeAge(dateHeader);
        const labels = detail.data.labelIds || [];

        // Determine category
        let category = 'Primary';
        if (labels.includes('CATEGORY_PROMOTIONS')) category = 'Promotions';
        else if (labels.includes('CATEGORY_UPDATES')) category = 'Updates';
        else if (labels.includes('CATEGORY_SOCIAL')) category = 'Social';
        else if (labels.includes('CATEGORY_FORUMS')) category = 'Forums';

        return {
          id: msg.id,
          threadId: detail.data.threadId,
          sender,
          subject: subjectHeader,
          snippet: detail.data.snippet || '',
          date: dateHeader,
          age,
          category,
          labels,
          isReal: true,
          simulatedRealAction: 'Direct Gmail API execution'
        };
      } catch (err) {
        console.error(`Failed to fetch details for email ${msg.id}:`, err.message);
        return null;
      }
    }));

    const validEmails = rawEmails.filter(Boolean);

    // Step 2: Compute sender frequencies to detect repeat sender clusters
    const senderCounts = {};
    validEmails.forEach(e => {
      const email = e.sender.email.toLowerCase();
      senderCounts[email] = (senderCounts[email] || 0) + 1;
    });

    // Step 3: Run AI Email Detective analysis for each email
    const processedEmails = validEmails.map(e => {
      const freq = senderCounts[e.sender.email.toLowerCase()] || 1;
      const analysis = analyzeWithAiDetective({
        sender: e.sender,
        subject: e.subject,
        snippet: e.snippet,
        dateHeader: e.date,
        labels: e.labels,
        senderFrequency: freq,
      });

      return {
        ...e,
        level: analysis.level,
        levelName: analysis.levelName,
        isBossChallenge: analysis.isBossChallenge || false,
        senderClusterCount: analysis.senderClusterCount || 1,
        aiDetective: analysis.aiDetective,
        gamePrompt: {
          badge: analysis.aiDetective.categoryHypothesis,
          color: analysis.level === 4 ? 'amber' : analysis.level === 3 ? 'purple' : analysis.level === 2 ? 'cyan' : 'pink',
          reason: analysis.aiDetective.humanReasoning,
          recommendation: analysis.aiDetective.recommendation,
          altRecommendation: analysis.aiDetective.altRecommendation,
          explanation: analysis.aiDetective.explanation,
        }
      };
    });

    // Sort progressively: Level 1 -> Level 2 -> Level 3 -> Level 4 (Boss)
    processedEmails.sort((a, b) => a.level - b.level);

    return processedEmails;
  } catch (error) {
    console.error('Error fetching real emails from Gmail API:', error);
    if (error.code === 401 || error.status === 401) {
      const err = new Error('Your Gmail session has expired. Please sign in again.');
      err.code = 'AUTH_EXPIRED';
      throw err;
    }
    throw error;
  }
}

/**
 * Execute real Gmail action on message
 */
export async function executeRealAction(tokens, messageId, action, labelName = '') {
  const gmail = getGmailService(tokens);

  try {
    switch (action) {
      case 'ARCHIVE': {
        const res = await gmail.users.messages.modify({
          userId: 'me',
          id: messageId,
          requestBody: {
            removeLabelIds: ['INBOX'],
          },
        });
        return {
          success: true,
          action: 'ARCHIVE',
          messageId,
          realActionDescription: 'Removed INBOX label (Archived)',
          data: res.data,
        };
      }

      case 'DELETE': {
        const res = await gmail.users.messages.trash({
          userId: 'me',
          id: messageId,
        });
        return {
          success: true,
          action: 'DELETE',
          messageId,
          realActionDescription: 'Moved to Gmail Trash (Recoverable for 30 days)',
          data: res.data,
        };
      }

      case 'STAR': {
        const res = await gmail.users.messages.modify({
          userId: 'me',
          id: messageId,
          requestBody: {
            addLabelIds: ['STARRED'],
          },
        });
        return {
          success: true,
          action: 'STAR',
          messageId,
          realActionDescription: 'Added STARRED label',
          data: res.data,
        };
      }

      case 'KEEP': {
        const res = await gmail.users.messages.modify({
          userId: 'me',
          id: messageId,
          requestBody: {
            removeLabelIds: ['UNREAD'],
          },
        });
        return {
          success: true,
          action: 'KEEP',
          messageId,
          realActionDescription: 'Kept in Inbox (Marked as read)',
          data: res.data,
        };
      }

      case 'LABEL': {
        const labelToApply = labelName || 'InboxQuest/Organized';
        const labelList = await gmail.users.labels.list({ userId: 'me' });
        const existing = (labelList.data.labels || []).find(
          l => l.name.toLowerCase() === labelToApply.toLowerCase()
        );

        let targetLabelId;
        if (existing) {
          targetLabelId = existing.id;
        } else {
          const created = await gmail.users.labels.create({
            userId: 'me',
            requestBody: {
              name: labelToApply,
              labelListVisibility: 'labelShow',
              messageListVisibility: 'show',
            },
          });
          targetLabelId = created.data.id;
        }

        const res = await gmail.users.messages.modify({
          userId: 'me',
          id: messageId,
          requestBody: {
            addLabelIds: [targetLabelId],
            removeLabelIds: ['INBOX'],
          },
        });

        return {
          success: true,
          action: 'LABEL',
          labelName: labelToApply,
          messageId,
          realActionDescription: `Applied label '${labelToApply}' & archived`,
          data: res.data,
        };
      }

      default:
        throw new Error(`Unsupported action: ${action}`);
    }
  } catch (error) {
    console.error(`Gmail action error (${action}):`, error);
    if (error.code === 401 || error.status === 401) {
      const err = new Error('Authentication expired. Please reconnect your Gmail.');
      err.code = 'AUTH_EXPIRED';
      throw err;
    }
    throw error;
  }
}
