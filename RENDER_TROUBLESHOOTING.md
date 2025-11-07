# 🔧 Render Deployment Troubleshooting Guide

## Issue: "Running 'node admin.js'" Error

### Root Cause

Render is trying to run `node admin.js` instead of `node server.js` because it's detecting the wrong entry point.

---

## ✅ Fixes Applied

### 1. Updated package.json

```json
"main": "server.js"  // Changed from "admin.js"
```

### 2. Updated render.yaml

```yaml
startCommand: node server.js  // Explicitly set the start command
```

---

## 🚀 Manual Fix on Render Dashboard

If Render is still showing the error, follow these steps:

### Step 1: Clear Build Cache

1. Go to your Render dashboard
2. Click on your "healslot" service
3. Click "Settings" in the left sidebar
4. Scroll down to "Build & Deploy"
5. Click "Clear build cache & deploy"

### Step 2: Verify Start Command

1. In Settings → "Build & Deploy"
2. Check "Start Command" field
3. It should show: `node server.js`
4. If it shows anything else, change it to: `node server.js`
5. Click "Save Changes"

### Step 3: Manual Redeploy

1. Go to "Manual Deploy" tab
2. Click "Deploy latest commit"
3. Wait for the deployment to complete

---

## 🔍 Verify Deployment Success

### Check Logs

1. Go to your Render dashboard
2. Click "Logs" tab
3. Look for these success messages:
   ```
   ✅ Connected to MongoDB Atlas
   ✅ Server running on port 10000
   ✅ Access the application at: http://localhost:10000
   ```

### Common Error Messages & Solutions

#### Error: "Application exited early"

**Cause:** Wrong start command or missing dependencies
**Solution:**

- Verify start command is `node server.js`
- Check that all dependencies are in package.json
- Clear build cache and redeploy

#### Error: "MongoDB connection error"

**Cause:** MongoDB Atlas not allowing Render's IP
**Solution:**

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere"
4. IP: `0.0.0.0/0`
5. Click "Confirm"

#### Error: "Cannot find module"

**Cause:** Missing dependencies or wrong directory structure
**Solution:**

- Ensure all files are in the root directory (not in a subdirectory)
- Run `npm install` locally to verify dependencies
- Check that node_modules is in .gitignore

---

## 📋 Render Configuration Checklist

### Environment Variables (Must Set!)

Go to Settings → Environment → Add Environment Variable

1. **MONGODB_URI**

   ```
   mongodb+srv://hospitalmanagement_user:sai0228@cluster0.eh9qu4h.mongodb.net/hospitalDB?retryWrites=true&w=majority&appName=Cluster0
   ```

2. **NODE_ENV**
   ```
   production
   ```

### Build & Deploy Settings

- **Build Command:** `npm install`
- **Start Command:** `node server.js`
- **Node Version:** 22.x (or latest)

### Auto-Deploy

- ✅ Enable "Auto-Deploy" for automatic deployments on git push

---

## 🧪 Test Locally Before Deploying

Always test locally first:

```bash
cd Desktop
npm install
npm start
```

Expected output:

```
Connected to MongoDB Atlas
Server running on port 3000
Access the application at: http://localhost:3000
```

If this works locally, it should work on Render.

---

## 🔄 Alternative: Delete and Recreate Service

If nothing works, try recreating the service:

### Step 1: Delete Current Service

1. Go to Render dashboard
2. Click on "healslot" service
3. Settings → Scroll to bottom
4. Click "Delete Web Service"
5. Confirm deletion

### Step 2: Create New Service

1. Click "New +" → "Web Service"
2. Connect GitHub repository: `Heals-slot`
3. Configure:
   - **Name:** healslot
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add environment variables (MONGODB_URI, NODE_ENV)
5. Click "Create Web Service"

---

## 📞 Still Having Issues?

### Check These Common Mistakes:

1. **Wrong Repository Branch**

   - Ensure you're deploying from `main` branch
   - Check that latest commits are pushed

2. **Missing Environment Variables**

   - MONGODB_URI must be set
   - Check for typos in the connection string

3. **MongoDB Atlas Network Access**

   - Must allow 0.0.0.0/0 (all IPs)
   - Or add Render's IP ranges

4. **Port Configuration**

   - Render automatically sets PORT environment variable
   - Your server.js should use: `process.env.PORT || 3000`

5. **File Structure**
   - All files should be in repository root
   - server.js must be in the root directory
   - models/ folder must be in root

---

## ✅ Success Indicators

Your deployment is successful when you see:

1. **In Render Logs:**

   ```
   ==> Build successful 🎉
   ==> Deploying...
   Connected to MongoDB Atlas
   Server running on port 10000
   ```

2. **In Browser:**

   - Visit your Render URL (e.g., https://healslot.onrender.com)
   - You should see the HealSlot login page
   - Can select a hospital
   - Can register/login

3. **In Render Dashboard:**
   - Status shows "Live" (green)
   - No error messages in logs
   - Health checks passing

---

## 🎯 Quick Fix Summary

If you're seeing "Running 'node admin.js'" error:

1. ✅ Update package.json main field to "server.js"
2. ✅ Update render.yaml startCommand to "node server.js"
3. ✅ Commit and push changes
4. ✅ Clear Render build cache
5. ✅ Manually redeploy on Render
6. ✅ Verify environment variables are set
7. ✅ Check MongoDB Atlas network access

---

## 📚 Useful Links

- **Render Docs:** https://render.com/docs
- **Render Node.js Guide:** https://render.com/docs/deploy-node-express-app
- **MongoDB Atlas:** https://cloud.mongodb.com/
- **GitHub Repository:** https://github.com/sailakshmigorlamandala02-lgtm/Heals-slot

---

## 💡 Pro Tips

1. **Always check logs first** - They tell you exactly what's wrong
2. **Test locally** - If it works locally, it should work on Render
3. **Use environment variables** - Never hardcode sensitive data
4. **Enable auto-deploy** - Automatic deployments on git push
5. **Monitor your app** - Check Render dashboard regularly

---

Your HealSlot application should now deploy successfully! 🎉
