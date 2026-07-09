# 🔑 How to Create Google Client ID (Step-by-Step)

This is the FIRST step before you can login with Google. Takes ~10 minutes.

---

## STEP 1: Open Google Cloud Console

1. **Open your browser**
2. **Go to:** https://console.cloud.google.com/
3. You might see a login screen
4. **Log in with your Google account** (any personal Google account works)

✅ You're now in Google Cloud Console

---

## STEP 2: Create a New Project

1. **Look for the project dropdown** (top left, says something like "My First Project" or blank)
2. **Click it** to open the project selector
3. **Click the "+" button** (or "New Project" button)
4. **Enter project name:** `PropertyFlow` (or any name you want)
5. **Leave Organization blank** (unless you have one)
6. **Click "Create"**
7. **Wait 30 seconds** for project to be created
8. **Select the new project** from dropdown (it auto-selects usually)

✅ New project created

---

## STEP 3: Enable Google+ API

1. **In the left sidebar, find:** "APIs & Services"
2. **Click: "APIs & Services"**
3. **Click: "Library"** (or find it in the menu)
4. **In the search box at top, type:** `Google+ API`
5. **Click on "Google+ API"** (first result)
6. **Click the blue "Enable" button**
7. **Wait for it to process** (takes 1-2 minutes)

✅ Google+ API is now enabled

---

## STEP 4: Create OAuth 2.0 Credentials

1. **In the left sidebar, click:** "APIs & Services"
2. **Click: "Credentials"**
3. **Click the blue "+ CREATE CREDENTIALS" button** (top)
4. **Select: "OAuth client ID"**
5. **If prompted to create OAuth consent screen:**
   - Click **"Create Consent Screen"**
   - Choose: **"External"** (recommended for personal use)
   - Click **"Create"**
   - Fill in the form:
     - **App name:** PropertyFlow
     - **User support email:** (your email)
     - **Developer contact:** (your email)
   - Scroll down, click **"Save and Continue"**
   - **Skip scopes** (just click "Save and Continue")
   - **Skip test users** (just click "Save and Continue")
   - **Review and go back** (click "Back to Dashboard")

Now you're back at credentials page.

---

## STEP 5: Configure OAuth Application

1. **Click "+ CREATE CREDENTIALS" again**
2. **Select: "OAuth client ID"**
3. **Choose Application type:** `Web application`
4. **Enter a name:** `PropertyFlow Web Client` (or any name)
5. **Under "Authorized JavaScript origins", click "Add URI"**
6. **Add these URIs (one at a time):**
   - `http://localhost:3000`
   - `http://localhost:3001`
   - `http://127.0.0.1:3000`

7. **Under "Authorized redirect URIs", click "Add URI"**
8. **Add these URIs (one at a time):**
   - `http://localhost:3000/`
   - `http://localhost:3001/`
   - `http://localhost:3000/callback`

9. **Click "Create"**

✅ Credentials created!

---

## STEP 6: Copy Your Client ID

1. **A popup appears** showing your credentials
2. **Look for: "Client ID"** (a long string like: `123456789-abc...xyz.apps.googleusercontent.com`)
3. **Copy the entire Client ID** (Ctrl+C or click copy icon)
4. **Save it somewhere temporarily** (notepad, clipboard, etc.)

✅ Client ID is copied

---

## STEP 7: Add Client ID to .env File

1. **Open File Explorer**
2. **Navigate to:** `C:\Users\angel\OneDrive\Desktop\rental_system\frontend`
3. **Right-click in empty area**
4. **Choose: "New" → "Text Document"**
5. **Name it: `.env`** (important: start with dot, no extension)
6. **Open the .env file** (right-click → "Open with" → "Notepad")
7. **Paste this into the file:**

```
REACT_APP_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
REACT_APP_ENABLE_IP_VERIFICATION=true
REACT_APP_ENABLE_TERMS_MODAL=true
REACT_APP_ENABLE_PARTICLE_EFFECTS=true
REACT_APP_AUTHORIZED_EMAIL=isowekesa@gmail.com
REACT_APP_POLICY_VERSION=2026-07-07
```

8. **Replace `YOUR_CLIENT_ID_HERE`** with the Client ID you copied
9. **Example (what it should look like):**

```
REACT_APP_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
REACT_APP_API_URL=http://localhost:3001/api
...
```

10. **Save file** (Ctrl+S)
11. **Close Notepad**

✅ .env file created!

---

## STEP 8: Verify Everything

1. **Open Command Prompt** (Windows Key + R, type `cmd`, press Enter)
2. **Paste and press Enter:**
   ```
   cd C:\Users\angel\OneDrive\Desktop\rental_system\frontend
   ```

3. **Verify .env exists, paste and press Enter:**
   ```
   type .env
   ```
   You should see your REACT_APP_GOOGLE_CLIENT_ID

4. **If you see it:** ✅ Perfect! Ready to proceed.
5. **If you don't see it:** 
   - Check that .env is in the right folder
   - Make sure it's named `.env` (with dot, no extension)
   - Check that Client ID is in the file

---

## TROUBLESHOOTING

**Problem:** "I can't find the project dropdown"
- **Solution:** Look at the **top left** of Google Cloud Console. There's a bar showing your project name.

**Problem:** "Google+ API doesn't appear when I search"
- **Solution:** 
  - Try searching "Google+ API" (with +)
  - Or search just "Google"
  - Make sure you're in the Library section

**Problem:** ".env file not appearing in folder"
- **Solution:**
  - Check File Explorer View → Show hidden files
  - Or use Command Prompt: `dir /a`
  - Files starting with dot are hidden by default

**Problem:** "Credentials page shows no option to create"
- **Solution:**
  - Make sure you're in "APIs & Services" → "Credentials"
  - Check if Google+ API is enabled (go to Library)

**Problem:** "Can't add URIs to credentials"
- **Solution:**
  - You need to create consent screen FIRST
  - Follow the prompt if it appears
  - Then try creating credentials again

---

## WHAT'S NEXT?

Once you have .env file with Client ID:

1. **Open Command Prompt**
2. **Paste and press Enter:**
   ```
   cd C:\Users\angel\OneDrive\Desktop\rental_system\frontend
   npm install
   ```
   (Wait 5-10 minutes)

3. **Then paste and press Enter:**
   ```
   npm start
   ```
   (Wait 2-3 minutes, browser opens)

4. **Try logging in with Google** using `isowekesa@gmail.com`

---

## ✅ COMPLETE!

You now have:
- ✅ Google Cloud Project created
- ✅ OAuth 2.0 Credentials created
- ✅ Client ID copied
- ✅ .env file configured

**Ready to run the app!** 🚀

---

**Need help?** Let me know where you got stuck!
