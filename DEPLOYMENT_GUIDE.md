# HealSlot Deployment Guide

## ✅ Project Status

Your HealSlot project is **WORKING PROPERLY**!

- ✅ Server successfully connects to MongoDB Atlas
- ✅ All routes are functional
- ✅ Multi-hospital support is active
- ✅ All user roles (Admin, Doctor, Nurse, Patient, Pharmacist, Receptionist, Lab) are configured

---

## 📋 Prerequisites for Deployment

### 1. GitHub Account Setup

- Ensure you're logged into the correct GitHub account: `sailakshmigorlamandala02-lgtm`
- Repository URL: https://github.com/sailakshmigorlamandala02-lgtm/Heals-slot.git

### 2. MongoDB Atlas

- Your MongoDB connection string is already configured
- Database: `hospitalDB`
- Cluster: `Cluster0`

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub

You need to authenticate with GitHub first. Choose one of these methods:

#### Option A: Using Personal Access Token (Recommended)

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "HealSlot Deployment"
4. Select scopes: Check `repo` (full control of private repositories)
5. Click "Generate token" and **copy the token immediately**
6. Run these commands in your terminal:

```bash
cd Desktop
git push -u origin main
```

When prompted for password, paste your Personal Access Token (not your GitHub password)

#### Option B: Using GitHub CLI

```bash
gh auth login
# Follow the prompts to authenticate
cd Desktop
git push -u origin main
```

#### Option C: Using GitHub Desktop

1. Download and install GitHub Desktop
2. Sign in with your GitHub account
3. Add the repository from: `C:\Users\saida\Downloads\Heal slot\Desktop`
4. Push to origin

---

### Step 2: Deploy to Render

1. **Go to Render Dashboard**

   - Visit: https://dashboard.render.com/
   - Sign up or log in (you can use your GitHub account)

2. **Create New Web Service**

   - Click "New +" button
   - Select "Web Service"

3. **Connect GitHub Repository**

   - Click "Connect account" if not already connected
   - Find and select: `sailakshmigorlamandala02-lgtm/Heals-slot`
   - Click "Connect"

4. **Configure Service Settings**

   ```
   Name: healslot
   Region: Choose closest to your users
   Branch: main
   Root Directory: (leave empty)
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

5. **Select Plan**

   - Choose "Free" plan to start (you can upgrade later)

6. **Add Environment Variables**
   Click "Advanced" and add:

   | Key           | Value                                |
   | ------------- | ------------------------------------ |
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `NODE_ENV`    | `production`                         |

   **Important**: Get your MongoDB URI from your `.env` file or MongoDB Atlas dashboard

7. **Create Web Service**

   - Click "Create Web Service"
   - Wait for deployment (usually 2-5 minutes)

8. **Access Your Application**
   - Once deployed, Render will provide a URL like: `https://healslot.onrender.com`
   - Click on it to access your live application!

---

## 🔧 Environment Variables Needed

Make sure you have these in your Render environment variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospitalDB?retryWrites=true&w=majority
NODE_ENV=production
```

---

## 📝 Post-Deployment Checklist

After deployment, verify:

- [ ] Application loads at the Render URL
- [ ] Hospital selection works
- [ ] User registration works
- [ ] User login works for all roles
- [ ] Database connections are successful
- [ ] All portals (Admin, Doctor, Patient, etc.) are accessible

---

## 🐛 Troubleshooting

### Issue: "Application Error" or "Service Unavailable"

**Solution**: Check Render logs for errors. Usually related to:

- Missing environment variables
- MongoDB connection issues
- Build failures

### Issue: Database Connection Fails

**Solution**:

- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check if MONGODB_URI is correctly set in Render
- Ensure MongoDB Atlas cluster is active

### Issue: Static Files Not Loading

**Solution**:

- Render serves static files from the root directory
- All your HTML, CSS, JS files should load correctly

---

## 🔄 Updating Your Deployment

To update your live application:

1. Make changes locally
2. Commit changes:
   ```bash
   cd Desktop
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. Render will automatically redeploy (if auto-deploy is enabled)

---

## 📞 Support

If you encounter issues:

1. Check Render logs: Dashboard → Your Service → Logs
2. Check MongoDB Atlas logs
3. Verify all environment variables are set correctly

---

## 🎉 Success!

Once deployed, share your application URL:
`https://healslot.onrender.com` (or your custom domain)

Your HealSlot Hospital Management System is now live and accessible worldwide!
