// server/mockEmails.js
// Inbox Quest - Rich Dataset with 4 Progressive Levels & Distinct Mission Metadata

export const MOCK_EMAILS = [
  // -------------------------------------------------------------
  // LEVEL 1: QUICK WINS (Promos & Low-value automated alerts)
  // -------------------------------------------------------------
  {
    id: "quest_lvl1_001",
    level: 1,
    levelName: "Level 1: Quick Wins",
    sender: { name: "ZARA Fashion", email: "newsletter@zara-updates.com" },
    subject: "FLASH SALE: Up to 70% off Mid-Season Essentials!",
    snippet: "Don't miss our 48-hour flash sale. Free shipping on all outerwear. Discover new arrivals before stocks deplete...",
    date: new Date(Date.now() - 4 * 86400000).toISOString(),
    age: "4 days ago",
    category: "Promotions",
    labels: ["INBOX", "UNREAD", "CATEGORY_PROMOTIONS"],
    isPromo: true,
    isVip: false,
    isWork: false,
    aiDetective: {
      categoryHypothesis: "Expired Marketing Promo",
      confidence: 98,
      senderTrust: "Low (Commercial Newsletter)",
      signals: [
        "Commercial trigger keywords: 'FLASH SALE', '70% off'",
        "4 days stale — promotional window elapsed",
        "Commercial sender domain: zara-updates.com",
        "Unsubscribe header present"
      ],
      humanReasoning: "The sender domain 'zara-updates.com' sends mass marketing blasts. The subject contains high-urgency commercial triggers ('FLASH SALE', '70% off') from 4 days ago. Zero personal reply history. Safe to archive or purge.",
      recommendation: "ARCHIVE",
      altRecommendation: "DELETE",
      explanation: "Lapsed retail promotion. Archive for records or Delete to eliminate completely."
    },
    simulatedRealAction: "Removes 'INBOX' label on Gmail API"
  },
  {
    id: "quest_lvl1_002",
    level: 1,
    levelName: "Level 1: Quick Wins",
    sender: { name: "Domino's Pizza Deals", email: "deals@dominos-email.com" },
    subject: "🍕 Weekend BOGO: Buy 1 Large Pizza, Get 1 FREE!",
    snippet: "Use promo code BOGO50 at checkout. Valid this past weekend only. Add stuffed cheesy bread for $4.99...",
    date: new Date(Date.now() - 7 * 86400000).toISOString(),
    age: "1 week ago",
    category: "Promotions",
    labels: ["INBOX", "UNREAD", "CATEGORY_PROMOTIONS"],
    isPromo: true,
    isVip: false,
    isWork: false,
    aiDetective: {
      categoryHypothesis: "Expired Coupon",
      confidence: 99,
      senderTrust: "Low (Promotional Bot)",
      signals: [
        "Past weekend expiration trigger ('Valid this past weekend')",
        "7 days old with zero interaction",
        "Automated bulk delivery envelope"
      ],
      humanReasoning: "Subject specifies a weekend coupon code that is already 7 days old and non-functional. Retaining expired coupons consumes inbox clutter with zero residual value.",
      recommendation: "DELETE",
      altRecommendation: "ARCHIVE",
      explanation: "Expired promo voucher. Move directly to Trash to clean your digital space!"
    },
    simulatedRealAction: "Moves message to Gmail Trash via users.messages.trash"
  },
  {
    id: "quest_lvl1_003",
    level: 1,
    levelName: "Level 1: Quick Wins",
    sender: { name: "Duolingo Owl", email: "reminders@duolingo.com" },
    subject: "Duo is crying... Don't lose your 42-day Spanish streak!",
    snippet: "Take just 3 minutes right now to practice Greetings and keep your streak alive. Duo has sent 4 reminders today...",
    date: new Date(Date.now() - 14 * 3600000).toISOString(),
    age: "14 hours ago",
    category: "Updates",
    labels: ["INBOX", "UNREAD"],
    isPromo: true,
    isVip: false,
    isWork: false,
    aiDetective: {
      categoryHypothesis: "Automated Engagement Nudge",
      confidence: 95,
      senderTrust: "Medium (Verified App Notification)",
      signals: [
        "Automated retention email from mobile app",
        "Streak date timestamp: 14 hours ago (today's session already passed)",
        "Daily automated cadence"
      ],
      humanReasoning: "Duolingo sends automated daily engagement reminders. Once the day concludes or you practice in-app, the email alert has zero utility. Archive it to keep inbox zero.",
      recommendation: "ARCHIVE",
      altRecommendation: "DELETE",
      explanation: "Daily automated notification. Archive it to protect your real inbox streak."
    },
    simulatedRealAction: "Removes 'INBOX' label on Gmail API"
  },
  {
    id: "quest_lvl1_004",
    level: 1,
    levelName: "Level 1: Quick Wins",
    sender: { name: "Crypto Sol Drops", email: "claims@sol-free-tokens-now.xyz" },
    subject: "You have 4,500 $SOL unclaimed tokens waiting for wallet confirmation!",
    snippet: "Congratulations! Your address was chosen for the 2026 Ecosystem Grant. Connect your private keys to claim within 24 hours...",
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    age: "1 day ago",
    category: "Spam",
    labels: ["INBOX", "UNREAD"],
    isPromo: true,
    isVip: false,
    isWork: false,
    aiDetective: {
      categoryHypothesis: "Phishing / Security Threat",
      confidence: 100,
      senderTrust: "CRITICAL DANGER (Unverified Domain)",
      signals: [
        "Unregistered TLD '.xyz' with spoofed cryptocurrency claims",
        "High-risk credential harvesting language ('Connect your private keys')",
        "Unsolicited token allocation"
      ],
      humanReasoning: "Sender address domain '.xyz' has high spam score. The body solicits 'private keys', which is an unmistakable phishing signature. Must be deleted immediately.",
      recommendation: "DELETE",
      altRecommendation: "ARCHIVE",
      explanation: "Security phishing risk. Delete to trash right away!"
    },
    simulatedRealAction: "Moves message to Gmail Trash via users.messages.trash"
  },
  {
    id: "quest_lvl1_005",
    level: 1,
    levelName: "Level 1: Quick Wins",
    sender: { name: "Spotify Music", email: "updates@spotify.com" },
    subject: "Your New Music Friday: Curated mix based on what you listened to",
    snippet: "We put together 25 new tracks from artists you listened to this month. Tap to listen to your curated mix in the app...",
    date: new Date(Date.now() - 6 * 86400000).toISOString(),
    age: "6 days ago",
    category: "Promotions",
    labels: ["INBOX", "UNREAD", "CATEGORY_PROMOTIONS"],
    isPromo: true,
    isVip: false,
    isWork: false,
    aiDetective: {
      categoryHypothesis: "Media Recommendation Digest",
      confidence: 96,
      senderTrust: "Medium (Streaming App)",
      signals: [
        "In-app music recommendation already loaded in mobile client",
        "6 days stale",
        "Pure promotional retention content"
      ],
      humanReasoning: "Spotify playlists already update inside the mobile application. Retaining notification emails clogs your primary view.",
      recommendation: "ARCHIVE",
      altRecommendation: "DELETE",
      explanation: "Music mix already in Spotify app. Archive to clean clutter."
    },
    simulatedRealAction: "Removes 'INBOX' label on Gmail API"
  },

  // -------------------------------------------------------------
  // LEVEL 2: DETECTIVE MODE (Ambiguous Receipts, Itineraries, Work)
  // -------------------------------------------------------------
  {
    id: "quest_lvl2_001",
    level: 2,
    levelName: "Level 2: Detective Mode",
    sender: { name: "Uber Receipts", email: "receipts@uber.com" },
    subject: "Your Wednesday evening ride with Uber ($24.80)",
    snippet: "Thanks for riding with Uber, Alex. Total: $24.80 charged to Apple Pay (•••• 8821). Pickup: 450 Mission St. View trip receipt...",
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    age: "3 days ago",
    category: "Receipts",
    labels: ["INBOX", "UNREAD"],
    isPromo: false,
    isVip: false,
    isWork: true,
    aiDetective: {
      categoryHypothesis: "Completed Transaction Receipt",
      confidence: 97,
      senderTrust: "High (Official Receipts Gateway)",
      signals: [
        "Fixed charge ($24.80) to Apple Pay verified",
        "Trip completed 3 days ago with zero disputes",
        "Expense record keyword: 'Trip receipt'",
        "No call-to-action remaining"
      ],
      humanReasoning: "This is a closed transaction receipt for $24.80. The payment cleared 3 days ago. Archiving removes it from your active inbox view while preserving full searchability in Gmail for tax/expense reimbursement.",
      recommendation: "ARCHIVE",
      altRecommendation: "KEEP",
      explanation: "Transaction settled. Archive safely; it remains indexed in All Mail."
    },
    simulatedRealAction: "Removes 'INBOX' label on Gmail API"
  },
  {
    id: "quest_lvl2_002",
    level: 2,
    levelName: "Level 2: Detective Mode",
    sender: { name: "Delta Air Lines", email: "ticketreceipt@delta.com" },
    subject: "Flight Confirmation: San Francisco (SFO) to New York (JFK) - May 14",
    snippet: "Confirmation Code: H9KZ82. Passenger: Alex Mercer. Seat: 14A (Main Cabin). Check-in opens 24 hours prior to departure...",
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    age: "5 days ago",
    category: "Travel",
    labels: ["INBOX", "UNREAD"],
    isPromo: false,
    isVip: true,
    isWork: false,
    aiDetective: {
      categoryHypothesis: "Upcoming Future Travel Itinerary",
      confidence: 99,
      senderTrust: "High (Delta Airlines Booking Engine)",
      signals: [
        "Upcoming departure date in May (active future event)",
        "Crucial booking code present: 'H9KZ82'",
        "Seat assignment confirmed (14A)",
        "Required for airport check-in security"
      ],
      humanReasoning: "Unlike past receipts, this is an active flight reservation for May 14 containing confirmation code 'H9KZ82'. You will need rapid access to this record on travel day. DO NOT TRASH.",
      recommendation: "STAR",
      altRecommendation: "KEEP",
      explanation: "Upcoming flight reservation with confirmation code. Star for one-click airport check-in!"
    },
    simulatedRealAction: "Adds 'STARRED' label on Gmail API"
  },
  {
    id: "quest_lvl2_003",
    level: 2,
    levelName: "Level 2: Detective Mode",
    sender: { name: "GitHub Notifications", email: "notifications@github.com" },
    subject: "[acme/core-api] Pull Request #412 merged: Fix rate limiter memory leak",
    snippet: "Merged #412 into main by @johndoe. 4 commits, 12 files changed. Build artifact deployed to staging environment...",
    date: new Date(Date.now() - 6 * 3600000).toISOString(),
    age: "6 hours ago",
    category: "Updates",
    labels: ["INBOX", "UNREAD", "CATEGORY_UPDATES"],
    isPromo: false,
    isVip: false,
    isWork: true,
    aiDetective: {
      categoryHypothesis: "Resolved Engineering Event",
      confidence: 94,
      senderTrust: "High (GitHub Automated Dispatch)",
      signals: [
        "Status: 'Merged' (terminal workflow state)",
        "CI/CD deployment to staging completed",
        "No pending review requests or blockages",
        "Informational notification only"
      ],
      humanReasoning: "PR #412 has reached a terminal state ('merged') with successful staging deployment. There are no remaining review requests for you. Leaving it in the inbox causes visual drag.",
      recommendation: "ARCHIVE",
      altRecommendation: "LABEL",
      explanation: "PR is merged and deployed. Archive to keep your work queue clear."
    },
    simulatedRealAction: "Removes 'INBOX' label on Gmail API"
  },
  {
    id: "quest_lvl2_004",
    level: 2,
    levelName: "Level 2: Detective Mode",
    sender: { name: "Dr. Rachel Green (Dental)", email: "office@greenfamilydental.com" },
    subject: "Appointment Reminder: Routine Dental Cleaning on Nov 12 at 10:30 AM",
    snippet: "This is a friendly reminder for your upcoming routine dental examination and teeth cleaning with Dr. Green. Reply C to confirm...",
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    age: "Yesterday",
    category: "Personal",
    labels: ["INBOX", "UNREAD"],
    isPromo: false,
    isVip: true,
    isWork: false,
    aiDetective: {
      categoryHypothesis: "Personal Healthcare Action Item",
      confidence: 98,
      senderTrust: "High (Verified Medical Clinic)",
      signals: [
        "Direct personal appointment scheduling",
        "Action required: 'Reply C to confirm'",
        "Upcoming calendar date: Nov 12"
      ],
      humanReasoning: "Direct medical appointment reminder requiring confirmation ('Reply C to confirm'). This represents an active personal commitment that should not be lost in the archive.",
      recommendation: "STAR",
      altRecommendation: "KEEP",
      explanation: "Active medical appointment requiring confirmation. Star or Keep in view!"
    },
    simulatedRealAction: "Adds 'STARRED' label on Gmail API"
  },
  {
    id: "quest_lvl2_005",
    level: 2,
    levelName: "Level 2: Detective Mode",
    sender: { name: "Stripe Billing", email: "invoices@stripe.com" },
    subject: "Receipt for OpenAI API Platform Usage ($14.20 - Invoice #INV-2026-92)",
    snippet: "Amount billed: $14.20. Payment method: Visa ending in 4021. For your financial tax records, download official VAT PDF receipt...",
    date: new Date(Date.now() - 8 * 86400000).toISOString(),
    age: "8 days ago",
    category: "Finance",
    labels: ["INBOX", "UNREAD"],
    isPromo: false,
    isVip: false,
    isWork: true,
    aiDetective: {
      categoryHypothesis: "SaaS Expense Tax Record",
      confidence: 97,
      senderTrust: "High (Stripe Verified)",
      signals: [
        "Developer cloud tool recurring subscription",
        "Paid in full with zero debt remaining",
        "Valuable for accountant & tax write-off"
      ],
      humanReasoning: "Official developer tool expense invoice. Paid and closed. Apply a 'Finances/Invoices' label or Archive for tax deductions.",
      recommendation: "LABEL",
      altRecommendation: "ARCHIVE",
      explanation: "Business expense invoice. Label as 'Expenses' or archive safely."
    },
    simulatedRealAction: "Applies 'Expenses' label and archives"
  },

  // -------------------------------------------------------------
  // LEVEL 3: SENDER ATTACK (Repeated Senders, Clusters & Newsletters)
  // -------------------------------------------------------------
  {
    id: "quest_lvl3_001",
    level: 3,
    levelName: "Level 3: Sender Attack",
    sender: { name: "Substack - The Pragmatic Engineer", email: "pragmatic@substack.com" },
    subject: "Issue #184: How Big Tech evaluates Staff Engineers in 2026",
    snippet: "In this week's edition: engineering career ladders, compensation trends, and hiring committee evaluations...",
    date: new Date(Date.now() - 12 * 86400000).toISOString(),
    age: "12 days ago",
    category: "Newsletters",
    labels: ["INBOX", "UNREAD", "CATEGORY_UPDATES"],
    senderClusterCount: 4,
    isPromo: true,
    isVip: false,
    isWork: true,
    aiDetective: {
      categoryHypothesis: "Repeated Newsletter Sender Backlog",
      confidence: 96,
      senderTrust: "Medium (Reputable Newsletter)",
      signals: [
        "Sender repeat count: 4 unread editions from this sender in inbox",
        "12 days unread — past the immediate reading cycle",
        "High quality reference content suitable for library archiving"
      ],
      humanReasoning: "Substack sends 3x weekly. You have 4 unread editions accumulated over the past month. Archiving clears this backlog while preserving searchability for engineering interviews.",
      recommendation: "ARCHIVE",
      altRecommendation: "LABEL",
      explanation: "Part of a 4-email newsletter backlog. Archive to wipe the sender pile!"
    },
    simulatedRealAction: "Removes 'INBOX' label on Gmail API"
  },
  {
    id: "quest_lvl3_002",
    level: 3,
    levelName: "Level 3: Sender Attack",
    sender: { name: "Substack - ByteByteGo", email: "bytebytego@substack.com" },
    subject: "System Design 101: Consistent Hashing & Virtual Nodes Explained",
    snippet: "How DynamoDB and Cassandra distribute partition keys across nodes without hot-spotting with animated diagrams...",
    date: new Date(Date.now() - 9 * 86400000).toISOString(),
    age: "9 days ago",
    category: "Newsletters",
    labels: ["INBOX", "UNREAD", "CATEGORY_UPDATES"],
    senderClusterCount: 3,
    isPromo: true,
    isVip: false,
    isWork: true,
    aiDetective: {
      categoryHypothesis: "Technical Reference Backlog",
      confidence: 93,
      senderTrust: "Medium (Educational Dispatch)",
      signals: [
        "Sender cluster: 3 unread system design guides in inbox",
        "Technical guide format rather than immediate action",
        "Best organized under 'Engineering/Study' label"
      ],
      humanReasoning: "Educational architecture breakdown. Part of a 3-email sender cluster. Recommended to Archive or tag with a custom Study label so it doesn't crowd out daily emergencies.",
      recommendation: "LABEL",
      altRecommendation: "ARCHIVE",
      explanation: "High-value reference material. Archive or Label to clean sender clutter."
    },
    simulatedRealAction: "Removes 'INBOX' label on Gmail API"
  },
  {
    id: "quest_lvl3_003",
    level: 3,
    levelName: "Level 3: Sender Attack",
    sender: { name: "LinkedIn Notifications", email: "invitations@linkedin.com" },
    subject: "David Park and 8 other people viewed your profile this week",
    snippet: "See who's looking at your profile. David Park (Tech Recruiter at Stripe) and 8 others visited in the past 7 days...",
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    age: "2 days ago",
    category: "Social",
    labels: ["INBOX", "UNREAD", "CATEGORY_SOCIAL"],
    senderClusterCount: 6,
    isPromo: true,
    isVip: false,
    isWork: false,
    aiDetective: {
      categoryHypothesis: "Aggressive Social Retention Loop",
      confidence: 99,
      senderTrust: "Low (Automated Upsell)",
      signals: [
        "6th notification from invitations@linkedin.com this month",
        "Clickbait hook ('viewed your profile') designed to drive Premium subscription",
        "No direct peer message or connection request attached"
      ],
      humanReasoning: "LinkedIn sends up to 6 of these automated digest emails monthly to tease LinkedIn Premium. There is no direct message attached. Purging or archiving immediately restores focus.",
      recommendation: "DELETE",
      altRecommendation: "ARCHIVE",
      explanation: "Part of a 6-email monthly social digest barrage. Archive or Delete!"
    },
    simulatedRealAction: "Moves message to Gmail Trash via users.messages.trash"
  },
  {
    id: "quest_lvl3_004",
    level: 3,
    levelName: "Level 3: Sender Attack",
    sender: { name: "Figma Community", email: "community@figma.com" },
    subject: "You've been invited to edit 'Design System Tokens v3.4'",
    snippet: "Elena Vance (elena@designstudio.co) invited you to collaborate on 'Design System Tokens v3.4'. Review color tokens and layout grid variables...",
    date: new Date(Date.now() - 10 * 3600000).toISOString(),
    age: "10 hours ago",
    category: "Work",
    labels: ["INBOX", "UNREAD"],
    senderClusterCount: 2,
    isPromo: false,
    isVip: true,
    isWork: true,
    aiDetective: {
      categoryHypothesis: "Active Workspace Collaboration Invite",
      confidence: 98,
      senderTrust: "High (Verified Figma Service)",
      signals: [
        "Direct teammate invitation to work file",
        "Project deadline actively pending",
        "Requires opening editor during work hours"
      ],
      humanReasoning: "Active teammate collaboration invite from Elena Vance. Keeping or labeling this under 'Work' ensures you do not lose your shared project workspace access.",
      recommendation: "KEEP",
      altRecommendation: "LABEL",
      explanation: "Active project collaboration invite. Keep in queue or Label under Work!"
    },
    simulatedRealAction: "Keeps email in INBOX (no change)"
  },

  // -------------------------------------------------------------
  // LEVEL 4: INBOX BOSS (High-Stakes VIP & Project Threads)
  // -------------------------------------------------------------
  {
    id: "quest_lvl4_001",
    level: 4,
    levelName: "Level 4: Inbox Boss Challenge",
    sender: { name: "Sarah Chen (VP Engineering)", email: "sarah.chen@techcorp.io" },
    subject: "URGENT: Q4 Architecture Roadmap & Board Review Prep",
    snippet: "Hey team, please review attached slides for the Q4 board presentation before 2 PM today. Review slide 8 regarding database budget...",
    date: new Date(Date.now() - 2 * 3600000).toISOString(),
    age: "2 hours ago",
    category: "Important",
    labels: ["INBOX", "UNREAD", "IMPORTANT"],
    isBossChallenge: true,
    isPromo: false,
    isVip: true,
    isWork: true,
    aiDetective: {
      categoryHypothesis: "CRITICAL EXECUTIVE ESCALATION",
      confidence: 100,
      senderTrust: "MAXIMUM (Internal Executive Authority)",
      signals: [
        "Sender is Vice President of Engineering on internal company domain",
        "Hard deadline constraint: 'before 2 PM today' (in 2 hours)",
        "Executive presentation keyword: 'board review prep'",
        "Requires active document inspection"
      ],
      humanReasoning: "Direct email from your VP of Engineering regarding an urgent board presentation deadline today at 2 PM. This is the ultimate high-signal email in your entire inbox. Immediate STAR and KEEP required. DO NOT TRASH UNDER ANY CIRCUMSTANCES.",
      recommendation: "STAR",
      altRecommendation: "KEEP",
      explanation: "BOSS LEVEL: Executive urgent review item with strict 2 PM deadline. Star immediately!"
    },
    simulatedRealAction: "Adds 'STARRED' label on Gmail API"
  },
  {
    id: "quest_lvl4_002",
    level: 4,
    levelName: "Level 4: Inbox Boss Challenge",
    sender: { name: "Google Cloud Billing", email: "billing@google.com" },
    subject: "[ACTION REQUIRED] Billing Account Alert: Budget threshold 85% reached",
    snippet: "Your Google Cloud project 'production-ml-cluster' has reached 85% of monthly budget ($850 of $1,000). Review Cloud Run and GPU VM instances...",
    date: new Date(Date.now() - 18 * 3600000).toISOString(),
    age: "18 hours ago",
    category: "Important",
    labels: ["INBOX", "UNREAD", "IMPORTANT"],
    isBossChallenge: true,
    isPromo: false,
    isVip: true,
    isWork: true,
    aiDetective: {
      categoryHypothesis: "INFRASTRUCTURE COST OVERRUN WARNING",
      confidence: 99,
      senderTrust: "MAXIMUM (Cloud Infrastructure Security)",
      signals: [
        "Threshold breach alert: 85% of budget consumed",
        "Active production cluster: 'production-ml-cluster'",
        "Financial cost risk if unaddressed"
      ],
      humanReasoning: "Critical cloud infrastructure alert. Your cluster has reached $850 of a $1,000 ceiling. Requires engineering review of active GPU/VM instances to prevent service suspension. Star immediately.",
      recommendation: "STAR",
      altRecommendation: "KEEP",
      explanation: "BOSS LEVEL: Cloud budget alert reaching threshold. Star to investigate instances!"
    },
    simulatedRealAction: "Adds 'STARRED' label on Gmail API"
  },
  {
    id: "quest_lvl4_003",
    level: 4,
    levelName: "Level 4: Inbox Boss Challenge",
    sender: { name: "Marcus Brody (Apartment Landlord)", email: "marcus.properties@gmail.com" },
    subject: "Building Water Shutoff Notice - Thursday 10 AM to 1 PM",
    snippet: "Dear Tenants, Please be advised that the main water line will be shut off for pipe maintenance this Thursday from 10:00 AM to 1:00 PM...",
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    age: "Yesterday",
    category: "Personal",
    labels: ["INBOX", "UNREAD"],
    isBossChallenge: true,
    isPromo: false,
    isVip: true,
    isWork: false,
    aiDetective: {
      categoryHypothesis: "CRITICAL RESIDENTIAL NOTICE",
      confidence: 97,
      senderTrust: "High (Verified Property Management)",
      signals: [
        "Essential utility disruption notice: Water shutoff",
        "Direct scheduling conflict window: Thursday 10 AM - 1 PM",
        "Personal real-world impact"
      ],
      humanReasoning: "Essential living accommodation notice. Water will be shut off for 3 hours on Thursday. You need this visible on your radar so you aren't stranded without water during work hours.",
      recommendation: "KEEP",
      altRecommendation: "STAR",
      explanation: "BOSS LEVEL: Vital home utility notice. Keep visible in your queue!"
    },
    simulatedRealAction: "Keeps email in INBOX (no change)"
  }
];
