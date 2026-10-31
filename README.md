# ⚔️ Inbox Quest — Slay Your Inbox Clutter & Procrastination

> **The Central Concept:**
> “Turn inbox procrastination into a game where every move actually cleans your digital life.”

**Inbox Quest** transforms boring email triage into a fast-paced productivity arcade quest. Face off against the **Clutter Monster**, let the **AI Email Detective** unravel hidden sender patterns, advance through **4 progressive tiers**, and execute live **Gmail API** actions in the background.

---

## 🎧 Subtle Audio & Clutter Monster Interaction System

### 1. 👾 Clutter Monster Progress & Evolution
The Clutter Monster visually reacts to the player's cleanup progress throughout the run:
- **Intro Encounter**: Monster drops in with an entrance scale animation and plays a short (1.2s), low-pitched, mischievous digital sound: *"Mwahaha! I am the Clutter Monster! 5,000 unread emails are MINE!"*
- **100% Clutter**: Large, energetic, orbiting unread envelopes, healthy glowing eyes, toothy snarl, pulsing clutter shield.
- **75% Clutter**: Monster stutters, clutter shield flickers, speech: *"Hey! Stop archiving my precious unread junk!"*
- **50% Clutter**: Clutter shield cracks, eyes tire, sweat drop appears, orbiting envelopes begin falling off, speech: *"Oof... my clutter shield is cracking!"*
- **25% Clutter**: Monster shrinks to 75% scale, dizzy swirly eyes, coughing cartoon dust, speech: *"Whimpering... please leave at least ONE newsletter!"*
- **0% Defeated**: Shield shatters into clean sparkling particles, monster turns into clean white envelopes with a golden halo and happy sparkle eyes (`★ ★`), speech: *"NOOO! The inbox is pristine! I have been purged!"*

---

### 2. 🎵 Procedural Synthesizer Sound Effects
Built with zero external audio assets via the native browser **Web Audio API**:
- **Successful Cleanup (`playClean`)**: Soft, satisfying futuristic whoosh-zap on Archive.
- **Promo Deletion (`playDelete`)**: Clean laser pop on Trash actions.
- **Correct Classification (`playCorrectClassification`)**: Harmonious dual-tone chime when matching AI Detective advice.
- **VIP Discovery (`playVipDiscovery`)**: Golden shimmering bell triad for executive escalations & flights.
- **Wrong Decision (`playWrongDecision`)**: Soft, muted low thud (gentle error feedback).
- **Progressive Combo Tiers (`playComboTier`)**:
  - `3x Combo`: Pleasant two-note ascending sparkle.
  - `5x Combo`: Resonant 3-note harmonic triad.
  - `10x Combo`: Grand 4-note ascending sparkle arpeggio.
- **Final 10 Seconds Countdown (`playCountdownTick`)**: Subtle digital woodblock click.
- **Mission Milestone (`playMissionMilestone`)**: Inspiring 4-note quest progression fanfare.
- **Final Celebration (`playVictory`)**: Major 9th celebration chord progression (`C -> E -> G -> B -> D`).

---

### 3. 🌌 Futuristic Ambient Background Music (BGM)
- Gentle procedural arpeggio sequence in D Dorian/minor pentatonic running quietly at 133 BPM.
- Soft sine/triangle oscillators filtered through a warm lowpass filter (no harsh percussion or repetitive piercing tones).
- Loops seamlessly during active gameplay and gracefully fades out upon mission completion.

---

### 4. 🎛️ Audio Settings Panel
Accessible from the top navigation bar at any time:
- **Master Sound ON/OFF**: Instant silence toggle stopping all audio.
- **SFX Volume Slider**: Adjusts game effect levels (0% to 100%) with live test button.
- **BGM Volume Slider**: Adjusts ambient background music level (0% to 100%).
- Automatically saves preferences to `localStorage`.

---

## 🎯 Meaningful Mission Gameplay Modes

| Mission | Primary Objective | Incoming Queue Profile | Gameplay Modifiers & Scoring | Risk & Penalty |
| :--- | :--- | :--- | :--- | :--- |
| **⚡ INBOX ZERO** | **Clear 15+ Emails** before 60s expires | High-velocity progressive pipeline across all categories | • **Speed Bonus**: +150 Pts on decisions under 2.5s<br>• **Fast Ramp**: Combo multiplier scales 2x faster | Timer expiration before reaching target |
| **🔍 SIGNAL HUNTER** | **Rescue 4 VIP Messages** (Zero mistakes) | Executive escalations, Delta flights, and medical reminders hidden among tricky decoys | • **VIP Bounty**: +1,500 Pts per VIP correctly starred or kept<br>• **Critical Alert**: Real-time signal highlights | **-800 Point Penalty & Error Flash** if you accidentally delete a VIP email |
| **🧹 CLUTTER PURGE** | **Purge 8 Commercial Blasts** | Dense pack of retail flash sales, expired food coupons & Substack backlogs | • **2.5x Boss Damage**: Commercial deletions deal 2.5x damage to the Clutter Monster<br>• **Stacking Purge**: +300 Pts streak bonus | Keeping promo spam interrupts combo |
| **📚 WORK ARCHITECT** | **Label 5 Work Documents** & SaaS Invoices | Concentrated technical whitepapers, system design guides, GitHub PRs & receipts | • **Curation Reward**: +1,200 Pts for using `[L] LABEL`<br>• **Keep Reward**: +600 Pts for preserving active files | Mindless deletions forfeit curation bonuses |

---

## 🌐 Real-World Gmail Actions

When connected to Gmail, all moves execute live via the official Gmail API:
- **ARCHIVE** (`[A]` / `[←]`) ➔ `users.messages.modify` (removes `INBOX` label; preserved in All Mail).
- **DELETE** (`[D]` / `[↓]`) ➔ `users.messages.trash` (moves to Gmail Trash; safe with 30-day recovery).
- **STAR** (`[S]` / `[↑]`) ➔ `users.messages.modify` (adds `STARRED` label for VIP priority).
- **KEEP** (`[K]` / `[→]`) ➔ `users.messages.modify` (marks as read; keeps in active view).
- **LABEL** (`[L]`) ➔ Creates and attaches `InboxQuest/Organized`.
- **Principle of Minimum Permissions**: Only requests `https://www.googleapis.com/auth/gmail.modify`.

---

## 🚀 Quick Start Guide

The application is actively running at:
👉 **`http://localhost:3001`**

### Manual Start Commands:
```powershell
cd C:\Users\LENOVO\.gemini\antigravity\scratch\inbox-rush
node server/index.js
```
