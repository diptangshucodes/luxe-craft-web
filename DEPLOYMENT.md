# Deployment Guide

This guide covers deploying Kamala Trader to production using free/budget hosting.

## Architecture

```
Frontend (Vercel) ←→ Backend API (Render)
```

## Backend Deployment (Render)

### Prerequisites
- Render account (free at render.com)
- GitHub repository with your code
- Environment variables ready

### Step 1: Prepare Backend for Render

1. Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: kamala-trader-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm run start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
```

2. Update `server/package.json` scripts:

```json
{
  "scripts": {
    "dev": "node --watch index.js",
    "start": "node index.js"
  }
}
```

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name:** kamala-trader-backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (will sleep after 15 mins of inactivity)

6. Add Environment Variables:
   - `NODE_ENV`: production
   - `EMAIL_USER`: your-email@gmail.com
   - `EMAIL_PASSWORD`: your-app-password
   - `EMAIL_HOST`: smtp.gmail.com
   - `EMAIL_PORT`: 587
   - `RECIPIENT_EMAIL`: your-email@gmail.com
   - `ADMIN_USERNAME`: admin
   - `ADMIN_PASSWORD`: your-secure-password
   - `JWT_SECRET`: your-long-random-secret-key
   - `CORS_ORIGINS`: https://your-vercel-domain.vercel.app

7. Deploy! Render will automatically deploy from GitHub

**Your Backend URL:** `https://kamala-trader-backend.onrender.com`

**Note:** Free tier sleeps after 15 mins of inactivity. First request takes ~30 seconds to wake up.

---

## Frontend Deployment (Vercel)

### Step 1: Configure Frontend

1. Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@api_url"
  }
}
```

2. Update `.env.example`:

```
VITE_API_URL=https://kamala-trader-backend.onrender.com
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select your repository
5. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

6. Add Environment Variables:
   - `VITE_API_URL`: https://kamala-trader-backend.onrender.com

7. Deploy! Vercel will automatically deploy from GitHub

**Your Frontend URL:** `https://kamala-trader.vercel.app` (custom domain available)

---

## Alternative Hosting Options

### Backend Alternatives

**Railway (Recommended if budget available)**
- Free $5/month credits (usually lasts 1+ months)
- Better uptime than Render free tier
- Deploy: railway.app

**Heroku (Paid alternative)**
- More reliable than free options
- Starting at $7/month
- Deploy: heroku.com

### Frontend Alternatives

**Netlify**
- Similar to Vercel
- Deploy: netlify.com

**GitHub Pages**
- Free, but requires API to be CORS-enabled
- Deploy: github.com settings

---

## DNS & Custom Domain

To use a custom domain like `kamaltrader.com`:

1. **Vercel:** Add custom domain in project settings
2. **Render:** Add custom domain in environment settings
3. Point DNS to their nameservers

---

## Monitoring & Debugging

### Render Logs
- View logs in Render dashboard
- Check for errors in deployment

### Vercel Logs
- View build & runtime logs in Vercel dashboard

### Common Issues

**CORS Errors:**
- Ensure `CORS_ORIGINS` environment variable includes your frontend domain
- Format: `https://domain.com,https://www.domain.com`

**Database Errors:**
- SQLite database is file-based and created on first run
- Check file permissions in `/uploads` directory

**Email Not Sending:**
- Verify Gmail App Password (not regular password)
- Enable "Less secure app access" if using regular password
- Check SMTP settings in admin panel

---

## Backup & Data Management

Since you're using SQLite:

1. **Download Database:** Access `/luxe-craft.db` from Render storage
2. **Backup Uploads:** Download `/uploads` folder
3. **Version Control:** Keep sensitive files in `.gitignore`

---

## Scaling Tips

**When traffic increases:**

1. **Render:** Upgrade from free to paid plan ($7+/month)
2. **Vercel:** Auto-scales, no changes needed
3. **Database:** Consider PostgreSQL when SQLite limitations hit
4. **CDN:** Both services include CDN by default

---

## Estimated Monthly Costs

- **Initial:** $0 (free tiers)
- **After Free Credits:** $7-15/month for reliable hosting
- **With Custom Domain:** +$10-15/year

This setup can handle moderate traffic on free/budget plans. Upgrade as needed!
