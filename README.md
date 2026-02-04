# ProBot AI Chatbot

A professional, AI-powered chatbot application built with React, Firebase, and Google Gemini API.

## Features
*   **🤖 AI Intelligence**: Powered by Google's Gemini Pro model.
*   **🔐 Google Authentication**: Secure login with Firebase Auth.
*   **☁️ Cloud History**: Chats are saved in real-time to Firestore Database.
*   **🎨 Professional UI**: Modern, responsive design with dark mode elements and glassmorphism.
*   **⚡ Real-time**: Instant message syncing.

---

## 🚀 How to Run Locally

Follow these steps to run the project on your machine.

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd chatbot-
```

### 2. Install Dependencies
Make sure you have [Node.js](https://nodejs.org/) installed.
```bash
npm install
```
*Note: This strictly installs dependencies. Do NOT move `node_modules`.*

### 3. Configure Environment Variables
Create a file named `.env` in the root folder (same level as `package.json`).
Copy the following template and fill in your keys:

```env
# Google Gemini API Key (Get from: https://aistudio.google.com/)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration (Get from: Firebase Console > Project Settings)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Important**: The app will NOT work without these keys.

### 4. Enable Firebase Features
1.  Go to [Firebase Console](https://console.firebase.google.com/).
2.  **Authentication**: Enable "Google" Sign-in method.
3.  **Firestore Database**: Create database and start in "Test mode".

### 5. Start the App
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Tech Stack
*   **Frontend**: React, Vite, Tailwind CSS
*   **Backend/Auth**: Firebase (Auth, Firestore)
*   **AI Model**: Google Gemini (`@google/generative-ai`)
