# 🔧 FIX: Render Running Wrong Command (node admin.js)

## Problem

Render is running `node admin.js` instead of `node server.js`, causing "Application exited early" error.

---

## ✅ SOLUTION: Update Start Command in Render Dashboard

### Step-by-Step Fix:

#### 1. Go to Render Dashboard

- Open: https://dashboard.render.com/
- Click on your "healslot" web service

#### 2. Go to Settings

- Click "Settings" in the left sidebar
- Scroll down to "Build & Deploy" section

#### 3. Update Start Command

- Find the "Start Command" field
- **Current value:** `node admin.js` ❌
- **Change to:** `node server.js` ✅
- Click "Save Changes"

#### 4. Clear Build Cache (Important!)

- Scroll down to "Build & Deploy" section
- Click "Clear build cache & deploy" button
- This forces Render to use the new configuration

#### 5. Wait for Deployment

- Go to "Logs" tab
- Wait 2-3 minutes
- Look for success messages

---

## ✅ Expected Success Output

After fixing, you should see in logs:

```
==> Build successful 🎉
==> Deploying...
==> Running 'node server.js'
Connected to MongoDB Atlas
Server running on port 10000
```

---

## 🎯 Alternative: Delete and Recreate Service

If updating the start command doesn't work, recreate the service:

### Step 1: Delete Current Service

1. Go to Render Dashboard
2. Click on "healslot" service
3. Settings → Scroll to bottom
4. Click "Delete Web Service"
5. Type service name to confirm
6. Click "Delete"

### Step 2: Create New Service

1. Click "New +" → "Web Service"
2. Connect to GitHub repository: `Heals-slot`
3. Click "Connect"

### Step 3: Configure Service

**Name:** `healslot`

**Environment:** `Node`

**Branch:** `main`

**Root Directory:** (leave blank)

**Build Command:** `npm install`

**Start Command:** `node server.js` ⚠️ **IMPORTANT: Type this exactly!**

### Step 4: Add Environment Variables

Click "Advanced" → Add Environment Variables:

1. **MONGODB_URI**

   ```
   mongodb+srv://hospitalmanagement_user:sai0228@cluster0.eh9qu4h.mongodb.net/hospitalDB?retryWrites=true&w=majority&appName=Cluster0
   ```

2. **NODE_ENV**
   ```
   production
   ```

### Step 5: Create Web Service

- Click "Create Web Service"
- Wait for deployment (2-5 minutes)
- Check logs for success

---

## 📋 Checklist Before Deployment

Make sure you have:

- [ ] Updated Start Command to `node server.js` in Render Settings
- [ ] Added MONGODB_URI environment variable
- [ ] Added NODE_ENV=production environment variable
- [ ] Configured MongoDB Atlas Network Access (0.0.0.0/0)
- [ ] Cleared build cache on Render
- [ ] Waited for automatic redeploy

---

## 🔍 Verify Configuration

### In Render Dashboard → Settings:

**Build & Deploy Section:**

- Build Command: `npm install` ✅
- Start Command: `node server.js` ✅ (NOT admin.js!)

**Environment Section:**

- MONGODB_URI: Set ✅
- NODE_ENV: production ✅

---

## 💡 Why This Happens

Render may be:

1. Using cached configuration from first deployment
2. Ignoring render.yaml file (if service was created via dashboard)
3. Using package.json "main" field (which we already fixed)

**Solution:** Manually set the start command in Render dashboard settings.

---

## 🎉 After Fix

Once the start command is corrected:

1. ✅ Render will run `node server.js`
2. ✅ Server will connect to MongoDB Atlas
3. ✅ Application will be live at your Render URL
4. ✅ You can access HealSlot hospital management system

---

## 📞 Still Having Issues?

If you still see "Running 'node admin.js'" after:

- Updating start command
- Clearing build cache
- Redeploying

Then **delete and recreate the service** following the steps above. This ensures a clean configuration.

---

Your HealSlot application will deploy successfully once the start command is fixed! 🚀
