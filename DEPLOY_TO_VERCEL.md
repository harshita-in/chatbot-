# How to Deploy to Vercel (Step-by-Step)

This guide focuses on **Step 4: Environment Variables**, which is the most important part.

## Why do we need this?
Your `.env` file (where your keys are) is **hidden** from GitHub for security. Vercel pulls code from GitHub, so it doesn't know your keys. You must tell Vercel what they are manually.

---

## The Steps

### 1. Start Deployment
1. Go to [vercel.com/new](https://vercel.com/new).
2. You will see a list of your GitHub repositories.
3. Click **"Import"** next to `chatbot-`.

### 2. Configure Project
You will see a screen titled **"Configure Project"**.
*   **Project Name**: Leave as is.
*   **Framework Preset**: It should auto-detect "Vite".

### 3. Add Environment Variables (IMPORTANT!)
Look for a section called **"Environment Variables"** and click to expand it.

You need to copy **EVERY** line from your local `.env` file and add it here.

**How to do it quickly:**
1.  Open your local `.env` file in VS Code.
2.  Copy the **Name** (left side) and **Value** (right side) for each one.

| Key (Name) | Value (Paste yours here) |
| :--- | :--- |
| `VITE_GEMINI_API_KEY` | `AIzaSy...` |
| `VITE_FIREBASE_API_KEY` | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `...firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `...` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `...` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `...` |
| `VITE_FIREBASE_APP_ID` | `...` |

**Tip:** Vercel allows you to copy-paste the entire file content into the first box, and it might auto-format it! Try copying your whole `.env` text and pasting it into the first "Key" field—Vercel often parses it automatically.

### 4. Deploy
1. Once all variables are added, click **"Deploy"**.
2. Wait about 1 minute.
3. You will get a confetti screen with your new website URL (e.g., `https://chatbot-tau.vercel.app`).
