# Quick Start: Deploy to Production (Free Hosting)

## Option 1: Recommended Setup (Render + Vercel)

### Total Cost: $0 initially, ~$7-15/month later

**Backend:** Render (Free tier: 0.5 CPU, 512MB RAM)
**Frontend:** Vercel (Free: unlimited bandwidth)

---

## 5-Minute Setup

### 1. Backend Deployment (Render)

```bash
# No local changes needed, just push to GitHub

# Go to https://render.com
# - Sign in with GitHub
# - Click "New Web Service"
# - Select your repository
# - Set Build Command: cd server && npm install
# - Set Start Command: cd server && npm start
# - Plan: Free

# Add these Environment Variables in Render:
NODE_ENV=production
PORT=3001
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
RECIPIENT_EMAIL=your-email@gmail.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-to-strong-password
JWT_SECRET=generate-random-key-from-checklist
CORS_ORIGINS=https://your-vercel-app.vercel.app

# Copy your Backend URL (e.g., https://kamala-trader-backend.onrender.com)
```

### 2. Frontend Deployment (Vercel)

```bash
# Go to https://vercel.com
# - Sign in with GitHub
# - Click "Add New" → "Project"
# - Select your repository
# - Framework: Vite (auto-detected)
# - Build Command: npm run build
# - Output Directory: dist

# Add Environment Variable:
VITE_API_URL=https://your-backend-url.onrender.com

# Deploy!
```

### 3. Test Everything

```bash
# Go to your Vercel URL (e.g., https://kamala-trader.vercel.app)
# 1. Click "Contact" in navbar → Should scroll to footer
# 2. Try admin login: /admin
#    - Username: admin
#    - Password: your-password
# 3. Upload a test product with image
# 4. Test email settings
# 5. View products in hero section
```

---

## Environment Variables Explained

| Variable | Where | Example |
|----------|-------|---------|
| `VITE_API_URL` | Vercel | `https://your-backend.onrender.com` |
| `EMAIL_USER` | Render | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | Render | Gmail App Password (not regular password) |
| `ADMIN_PASSWORD` | Render | Choose strong password |
| `JWT_SECRET` | Render | Random 32-char string |
| `CORS_ORIGINS` | Render | Your Vercel frontend URL |

---

## Getting Gmail App Password

1. Enable 2-Factor Authentication in Gmail
2. Go to myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Google generates 16-char password
5. Use this as `EMAIL_PASSWORD` (not your Gmail password)

---

## Backup Before Deploying

```bash
# Save your database
cp luxe-craft.db luxe-craft.db.backup

# Save your uploads
cp -r server/uploads server/uploads.backup
```

---

## Deployment Architecture

```
User's Browser
    ↓
Vercel (Frontend)
    ↓
  API Call
    ↓
Render (Backend)
    ↓
SQLite Database
```

---

## Free Tier Limitations

| Service | Limitation | Impact |
|---------|-----------|--------|
| Render | Sleeps after 15 mins | First request is slow (~30s) |
| Render | Limited resources | Handles small-medium traffic |
| Vercel | None | Unlimited bandwidth |

**Solution:** Upgrade Render to $7-15/month for always-on backend

---

## Cost After Free Trial

- Render (Production): $7-15/month
- Vercel: Free
- Custom Domain: $10-15/year (optional)
- **Total:** ~$7-15/month + domain

---

## Troubleshooting

### Products not showing?
- Check `VITE_API_URL` is correct in Vercel
- Verify `CORS_ORIGINS` in Render

### Email not sending?
- Use Gmail App Password, not regular password
- Enable "Less secure apps" in Gmail settings

### Admin won't login?
- Check `ADMIN_PASSWORD` you set
- Clear browser cache

### Render going to sleep?
- Normal for free tier
- Just wait 30 seconds and try again

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy backend to Render
3. ✅ Deploy frontend to Vercel
4. ✅ Test all features
5. ✅ Add custom domain (optional)
6. ✅ Monitor logs for errors

Good luck! 🚀
