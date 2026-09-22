# Freedants - Competition Details Screen (Functional Full-Stack Module)

A production-grade, full-stack implementation of the **Feedants Competition Details screen** built for the **Full Stack Development Intern** technical assessment.

This project goes beyond reproducing the visual UI by delivering an end-to-end dynamic system with live MongoDB persistence, real-time lifecycle states, race-condition safe spot booking, bilingual localization (ENG / हिंदी), video previews, and interactive submission workflows.

---

## 🌟 Key Highlights & Features

1. **Pixel-Accurate Design**: Faithfully implemented following the Feedants design reference with signature teal branding (`#09535d`), custom badges, typography, cards, and responsive layout.
2. **Dynamic Backend & MongoDB Architecture**: All competition data, judge information, timeline dates, spots remaining, rewards, and previous winners are dynamically served by an Express REST API with MongoDB data models.
3. **Atomic Concurrency Protection**: High-concurrency spot booking implemented using MongoDB `$expr` with atomic `$inc` updates, completely eliminating race conditions and overselling when multiple users register simultaneously.
4. **Interactive Multi-User State Simulator**: Built-in evaluator testing toolbar allows instant switching between user states:
   - **Kushal (Registered)**: Displays the `✔ Registered` badge and `Upload Submission` action.
   - **Priya (Unregistered)**: Shows dynamic `Register Now • ₹99` CTA with live remaining spots counter.
   - **Rohit (Submitted)**: Displays `Submitted ✓` state and `View Submission` details.
5. **Live Countdown Timer**: Real-time ticking countdown (`01d : 06h : 28m : 32s`) calculating milliseconds remaining until the registration deadline.
6. **Bilingual Localization**: Instant language toggle (`ENG` / `हिंदी`) translating all labels, tags, descriptions, and disclaimers.
7. **Interactive Modals**:
   - **Judge Intro Video Player & Winner Clips**: Video playback modal for performance clips.
   - **Simulated Razorpay Payment Sheet**: Transparent fee breakdown and secure checkout flow.
   - **Entry Submission Form**: Upload performance title, dance style, video URL, and description.
   - **Stress Test Concurrency Runner**: 1-click button to fire 20 concurrent registration requests to visually demonstrate capacity limits and data consistency.

---

## 🛠 Tech Stack

- **Frontend**: React Native with Expo (`react-native-web` enabled for seamless preview on Web and iOS/Android devices).
- **Backend**: Node.js + Express.js REST API.
- **Database**: MongoDB with Mongoose ODM (supports both external MongoDB / MongoDB Atlas and zero-config automated in-memory MongoDB fallback).
- **Styling & UI**: React Native StyleSheet, Lucide & Expo Vector Icons.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```
The server will boot on `http://localhost:5000`.

> **Note on Database**: If you do not have MongoDB running locally, the server will **automatically launch an in-memory MongoDB instance** and pre-seed the competition data. You can also specify an external URI in `backend/.env`:
> ```env
> PORT=5000
> MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/feedants
> ```

To run the automated backend concurrency test:
```bash
cd backend
npm test
```

### 2. Frontend Setup (React Native / Expo)

In a separate terminal:
```bash
cd frontend
npm start -- --web --port 8081
# Or simply:
npm run web
```
Open **[http://localhost:8081](http://localhost:8081)** in your browser or scan the QR code with Expo Go on your mobile device.

---

## 🌐 Live Cloud Deployment Guide

### Option A: Deploying Backend (Render.com - 100% Free)
1. Go to **[render.com](https://render.com)** and log in with your GitHub account.
2. Click **New +** → **Web Service**.
3. Select your repository: **`Bunny-777/Feedants`**.
4. Configure settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `PORT`: `5000`
   - `MONGODB_URI`: *(Optional: paste your MongoDB Atlas free cluster connection string. If left blank, it uses automatic in-memory persistence!)*
   - `NODE_ENV`: `production`
6. Click **Create Web Service**. Your backend will be live at:
   `https://feedants-backend.onrender.com`

---

### Option B: Deploying Frontend (Vercel - 100% Free)
1. Go to **[vercel.com](https://vercel.com)** and log in with your GitHub.
2. Click **Add New...** → **Project**.
3. Import your **`Bunny-777/Feedants`** repository.
4. Configure settings:
   - **Root Directory**: Click edit and select `frontend`.
   - **Framework Preset**: `Other`
   - **Build Command**: `npx expo export -p web`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - Key: `EXPO_PUBLIC_API_URL`
   - Value: `https://feedants-backend.onrender.com/api` *(Your Render backend URL + `/api`)*
6. Click **Deploy**. Your React Native application is live and accessible on any device worldwide!

---

## 📋 Evaluation Criteria & Documentation

### 1. Important Assumptions Made
- **User Authentication**: In a full production application, user sessions are managed via JWT / session cookies. For the scope of this assignment and to ease evaluation, users are identified via clean `userId` headers/query params, and an evaluator panel is provided to seamlessly switch sessions.
- **Payment Gateway**: Simulated Razorpay order generation and checkout callback flow (`pay_razor_...`) to demonstrate fee deduction and spot reservation without incurring real monetary charges.
- **Video Storage**: Submission videos accept embeddable video URLs (YouTube unlisted, Google Drive, MP4 streams). In production, this would integrate with AWS S3 / Cloudinary presigned upload URLs.

### 2. Major Technical Decisions
- **Atomic Operations over Application-Level Locks**: Rather than using in-memory mutexes (which break across distributed instances), spot reservations are performed at the database level:
  ```javascript
  const updated = await Competition.findOneAndUpdate(
    {
      _id: competitionId,
      $expr: { $lt: ['$bookedSpots', '$totalSpots'] }
    },
    { $inc: { bookedSpots: 1 } },
    { new: true }
  );
  ```
  If `updated` is null, the competition is full. This guarantees 100% data consistency even across horizontal cluster replicas.
- **Compound Unique Constraints**: A unique index on `{ competitionId: 1, userId: 1 }` prevents double booking or accidental duplicate payments.
- **Cross-Platform React Native (Web + Mobile)**: Configured with `@expo/metro-runtime` and `react-native-web` centered in a clean mobile frame (max-width 440px on desktop, 100% width on mobile) ensuring evaluators can test instantly in any browser while preserving 100% native mobile compatibility.

### 3. Trade-Offs Considered
- **WebSockets vs. Optimistic Polling for Real-Time Spots**: For this assignment, REST endpoints with optimistic state updates were selected for stability and zero external infrastructure setup. For massive real-time events, Socket.io / Server-Sent Events (SSE) would push spot decrement events to all connected clients.
- **In-Memory Mongo Fallback vs. Strict Database Dependency**: Integrated `mongodb-memory-server` ensures any evaluator can run `npm start` immediately without needing a running MongoDB daemon or Atlas credentials, while full MongoDB Atlas support remains available via `.env`.

### 4. Production Improvements & Scaling Roadmap
If developed further for high-scale production:
1. **Distributed Caching (Redis)**: Cache competition metadata, judge profiles, and past winners with a TTL, utilizing Redis `DECR` for millisecond spot reservation before writing asynchronously to MongoDB.
2. **Webhook Verification**: Complete HMAC signature verification for Razorpay payment webhooks to handle asynchronous transaction confirmations and auto-refunds on failure.
3. **Media Pipeline**: Direct multipart video upload to AWS S3 with transcoding via AWS Elemental MediaConvert / Cloudflare Stream to generate adaptive bitrate HLS/DASH streams.
4. **Push Notifications**: Expo Push Notification integration reminding users 1 hour before submission deadlines.

---

## 📂 Project Structure

```
freedants/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB & In-memory connection configuration
│   │   ├── controllers/     # Competition, Registration, Submission, Admin logic
│   │   ├── models/          # Competition, Registration, Submission, User schemas
│   │   ├── routes/          # REST API endpoints (/api/competitions, /api/registrations, etc.)
│   │   ├── seed/            # Pre-seeded Feedants Classical Dance data
│   │   ├── tests/           # Automated race-condition concurrency stress test
│   │   └── server.js        # Express application bootstrap
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Modular React Native UI components
│   │   │   ├── HeaderBar.js
│   │   │   ├── MainCompetitionCard.js
│   │   │   ├── JudgeCard.js
│   │   │   ├── CountdownBanner.js
│   │   │   ├── ImportantDatesGrid.js
│   │   │   ├── PreviousWinnersRow.js
│   │   │   ├── TabsSection.js
│   │   │   ├── RewardsSection.js
│   │   │   ├── DisclaimerAndTrust.js
│   │   │   ├── ReferralCard.js
│   │   │   ├── TestimonialsAdRow.js
│   │   │   ├── FixedBottomBar.js
│   │   │   ├── BottomNavBar.js
│   │   │   ├── TesterToolbar.js
│   │   │   └── Modals.js
│   │   ├── constants/       # Design system tokens and bilingual translations
│   │   └── api.js           # API client service
│   ├── App.js               # Main Screen integration
│   └── package.json
│
└── README.md
```

---
Built with ❤️ for Feedants.
