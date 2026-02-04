# How to get a FREE Google Gemini API Key

1.  **Go to Google AI Studio**:
    Open this link: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

2.  **Sign In**:
    Log in with your Google Account.

3.  **Create Key**:
    Click on **"Create API Key"**.
    Select "Create API key in new project".

4.  **Copy the Key**:
    You will see a long string of characters (e.g., `AIzaSy...`). Copy this key.

5.  **Paste in Project**:
    Open the file `src/services/ai.js` in this project.
    Replace `"PASTE_YOUR_API_KEY_HERE"` with your actual key.

    ```javascript
    // Example in src/services/ai.js
    const API_KEY = "AIzaSyDxxxx...."; // <-- Paste here
    ```

6.  **Done!**:
    Restart the app if needed, and your chatbot is now super intelligent!
