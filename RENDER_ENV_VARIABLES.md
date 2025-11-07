# Render Environment Variables Configuration

## ✅ ONLY 2 Environment Variables Needed!

Your HealSlot application is simple and only requires these environment variables:

---

## Required Environment Variables:

### 1. MONGODB_URI (Required)

**Key:** `MONGODB_URI`

**Value:**

```
mongodb+srv://hospitalmanagement_user:sai0228@cluster0.eh9qu4h.mongodb.net/hospitalDB?retryWrites=true&w=majority&appName=Cluster0
```

**Description:** MongoDB Atlas connection string for your hospital database

---

### 2. NODE_ENV (Recommended)

**Key:** `NODE_ENV`

**Value:**

```
production
```

**Description:** Sets Node.js to production mode for better performance

---

### 3. PORT (Automatically Set - DO NOT ADD)

**Note:** Render automatically provides the PORT environment variable. Your code handles this:

```javascript
const PORT = process.env.PORT || 3000;
```

Render will set PORT to 10000 automatically. **You don't need to add this manually.**

---

## 📋 Summary Table:

| Variable    | Value                                             | Required       | Action               |
| ----------- | ------------------------------------------------- | -------------- | -------------------- |
| MONGODB_URI | mongodb+srv://hospitalmanagement_user:sai0228@... | ✅ YES         | Add manually         |
| NODE_ENV    | production                                        | ⚠️ Recommended | Add manually         |
| PORT        | (auto-set to 10000)                               | ❌ NO          | Render provides this |

**That's it! No JWT_SECRET, no other secrets needed.**

---

## 🚀 How to Add on Render Dashboard:

### Step 1: Access Environment Settings

1. Go to: https://dashboard.render.com/
2. Click on your "healslot" web service
3. Click "Environment" tab in the left sidebar

### Step 2: Add MONGODB_URI

1. Click "Add Environment Variable" button
2. **Key:** `MONGODB_URI`
3. **Value:** `mongodb+srv://hospitalmanagement_user:sai0228@cluster0.eh9qu4h.mongodb.net/hospitalDB?retryWrites=true&w=majority&appName=Cluster0`
4. Click "Add" or "Save"

### Step 3: Add NODE_ENV

1. Click "Add Environment Variable" button again
2. **Key:** `NODE_ENV`
3. **Value:** `production`
4. Click "Add" or "Save"

### Step 4: Deploy

- Render will automatically redeploy with the new variables
- Wait 2-3 minutes for deployment
- Check logs for success messages

---

## ✅ Verification

After deployment, check your Render logs. You should see:

```
✅ Connected to MongoDB Atlas
✅ Server running on port 10000
✅ Access the application at: http://localhost:10000
```

If you see these messages, your environment variables are configured correctly!

---

## ⚠️ Important: MongoDB Atlas Network Access

**You MUST configure MongoDB Atlas to allow Render connections:**

1. Go to: https://cloud.mongodb.com/
2. Select your project
3. Click "Network Access" in the left sidebar
4. Click "Add IP Address" button
5. Select "Allow Access from Anywhere"
6. IP Address: `0.0.0.0/0`
7. Comment: "Render deployment access"
8. Click "Confirm"

**Wait 1-2 minutes** for the changes to take effect.

---

## 🔧 Troubleshooting

### Error: "MongoDB connection error"

**Causes:**

- MONGODB_URI not set correctly
- MongoDB Atlas not allowing connections

**Solutions:**

1. Verify MONGODB_URI is copied exactly (no extra spaces)
2. Check MongoDB Atlas Network Access allows 0.0.0.0/0
3. Wait 1-2 minutes after adding IP whitelist
4. Verify MongoDB credentials are correct

### Error: "Application exited early"

**Causes:**

- Missing environment variables
- Wrong start command

**Solutions:**

1. Verify both MONGODB_URI and NODE_ENV are set
2. Check start command is `node server.js` (in Settings → Build & Deploy)
3. Clear build cache and redeploy

### Error: "env is not good it is saying jwt secret and port"

**Solution:**

- **Your app doesn't use JWT!** You only need MONGODB_URI and NODE_ENV
- PORT is automatically provided by Render
- No JWT_SECRET needed for your application

---

## 📝 What Your Application Uses

Based on your `server.js` code analysis:

```javascript
// Only these environment variables are used:
const PORT = process.env.PORT || 3000; // Render provides this
const mongoUri = process.env.MONGODB_URI || "fallback-uri"; // You must set this
```

**That's all!** Your application is simple and doesn't require JWT, sessions, or other secrets.

---

## 🎉 After Configuration

Once you add MONGODB_URI and NODE_ENV:

1. ✅ Render will automatically redeploy
2. ✅ Your app will connect to MongoDB Atlas
3. ✅ Server will start on port 10000
4. ✅ Your app will be live at: `https://healslot.onrender.com` (or your assigned URL)

---

## 🔒 Security Best Practices

1. ✅ Never commit `.env` files to Git (already in `.gitignore`)
2. ✅ Use environment variables for all sensitive data
3. ✅ Rotate MongoDB passwords regularly
4. ✅ Monitor MongoDB Atlas access logs
5. ✅ Consider restricting IP access in production (instead of 0.0.0.0/0)

---

## 💡 Quick Reference

**To add environment variables on Render:**

```
Dashboard → Your Service → Environment → Add Environment Variable
```

**Required variables:**

1. MONGODB_URI = mongodb+srv://hospitalmanagement_user:sai0228@cluster0.eh9qu4h.mongodb.net/hospitalDB?retryWrites=true&w=majority&appName=Cluster0
2. NODE_ENV = production

**That's it!** Your HealSlot application is now properly configured! 🏥
