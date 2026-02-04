# How to Set Up Google Login (Firebase)

Follow these steps exactly to make the Login button work.

## Step 1: Create a Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com/).
2. Click **"Add project"** (or "Create a project").
3. Give it a name (e.g., `My Chatbot`).
4. Disable Google Analytics (simpler) and click **"Create project"**.
5. Wait for it to finish and click **"Continue"**.

## Step 2: Register the App
1. You should now be on the Project Overview page.
2. Click the **Web icon** (`</>`) under "Get started by adding Firebase to your app".
3. Enter an App nickname (e.g., `Chatbot Web`).
4. Click **"Register app"**.
5. **DO NOT** copy the script yet. Just keep that page open or copy the `firebaseConfig` object values if you see them.

## Step 3: Enable Google Sign-In
1. On the left sidebar, click **"Build"** -> **"Authentication"**.
2. Click **"Get started"**.
3. Click on the **"Sign-in method"** tab.
4. Click **"Google"**.
5. Click the **"Enable"** switch in the top right.
6. Select your email in the **"Project support email"** dropdown.
7. Click **"Save"**.

## Step 4: Get Key & Paste in .env
1. Click the **Gear Icon** (Settings) next to "Project Overview" in the top left sidebar.
2. Select **"Project settings"**.
3. Scroll down to the bottom where it says **"Your apps"**.
4. You will see "SDK setup and configuration". Look for `const firebaseConfig = { ... }`.
5. Now, fill in your `.env` file in VS Code with these values:

   *   `apiKey`  ->  `VITE_FIREBASE_API_KEY`
   *   `authDomain`  ->  `VITE_FIREBASE_AUTH_DOMAIN`
   *   `projectId`  ->  `VITE_FIREBASE_PROJECT_ID`
   *   `storageBucket`  ->  `VITE_FIREBASE_STORAGE_BUCKET`
   *   `messagingSenderId`  ->  `VITE_FIREBASE_MESSAGING_SENDER_ID`
   *   `appId`  ->  `VITE_FIREBASE_APP_ID`

## Example .env
```env
VITE_FIREBASE_API_KEY=AIzaSyB2...
VITE_FIREBASE_AUTH_DOMAIN=my-chatbot.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-chatbot
VITE_FIREBASE_STORAGE_BUCKET=my-chatbot.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456...
VITE_FIREBASE_APP_ID=1:12345:web:abcd...
```

Once you save the `.env` file, the login will work!
