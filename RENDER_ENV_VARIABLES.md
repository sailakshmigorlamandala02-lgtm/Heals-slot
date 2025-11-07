# Render Environment Variables Configuration

## Required Environment Variables for Render Deployment

When deploying to Render, add these environment variables in the "Environment" section:

### 1. MONGODB_URI

```
mongodb+srv://hospitalmanagement_user:sai0228@cluster0.eh9qu4h.mongodb.net/hospitalDB?retryWrites=true&w=majority&appName=Cluster0
```

### 2. NODE_ENV

```
production
```

### 3. PORT (Optional - Render sets this automatically)

```
10000
```

---

## How to Add Environment Variables in Render:

1. Go to your Render Dashboard: https://dashboard.render.com/
2. Select your web service (healslot)
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add each variable:

   - **Key**: `MONGODB_URI`
   - **Value**: `mongodb+srv://hospitalmanagement_user:sai0228@cluster0.eh9qu4h.mongodb.net/hospitalDB?retryWrites=true&w=majority&appName=Cluster0`

   - **Key**: `NODE_ENV`
   - **Value**: `production`

6. Click "Save Changes"
7. Render will automatically redeploy with the new environment variables

---

## MongoDB Atlas Network Access

Make sure your MongoDB Atlas cluster allows connections from anywhere:

1. Go to MongoDB Atlas Dashboard
2. Navigate to "Network Access"
3. Add IP Address: `0.0.0.0/0` (Allow access from anywhere)
4. This is required for Render to connect to your database

---

## Testing the Connection

After deployment, check the Render logs to verify:

- ✅ "Connected to MongoDB Atlas" message appears
- ✅ "Server running on port XXXX" message appears
- ✅ No connection errors

---

## Security Note

⚠️ **Important**: Never commit your `.env` file to Git. It's already in `.gitignore` to prevent accidental commits.

For production, consider:

- Using MongoDB Atlas IP whitelist with Render's static IPs (paid feature)
- Rotating database passwords regularly
- Using MongoDB Atlas user roles with minimal required permissions
