# Pre-Deployment Checklist

## Security & Configuration

- [ ] Change `ADMIN_PASSWORD` from default `admin123` to a strong password
- [ ] Generate a new `JWT_SECRET` (use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Set Gmail App Password (not regular password) for email service
- [ ] Review all environment variables
- [ ] Add `.env` to `.gitignore` (never commit secrets)
- [ ] Update CORS_ORIGINS to include your Vercel domain

## Code Quality

- [ ] Test all admin functions (Products, Gallery, Email, Contact)
- [ ] Test product creation with images
- [ ] Test email configuration
- [ ] Test bulk order form sending
- [ ] Check responsive design on mobile
- [ ] Verify all API endpoints work

## Database

- [ ] Backup current `luxe-craft.db` if you have production data
- [ ] Ensure SQLite is properly initialized
- [ ] Test product CRUD operations
- [ ] Verify image upload/deletion works

## Frontend Build

- [ ] Run `npm run build` locally and verify no errors
- [ ] Test production build: `npm run preview`
- [ ] Ensure all images load correctly
- [ ] Check console for any warnings/errors

## Backend Readiness

- [ ] Update `package.json` start script: `"start": "node index.js"`
- [ ] Test server startup: `npm run start`
- [ ] Verify uploads directory exists and is writable
- [ ] Check all environment variables are set

## Deployment Accounts

- [ ] GitHub account (for CI/CD)
- [ ] Vercel account (frontend hosting)
- [ ] Render account (backend hosting)
- [ ] Gmail account for email service

## Post-Deployment

- [ ] Test frontend URL after deployment
- [ ] Test backend URL after deployment
- [ ] Verify API calls work from frontend
- [ ] Test admin login with new password
- [ ] Test product upload with image
- [ ] Test email sending
- [ ] Verify contact details display in footer
- [ ] Test collection gallery loading
- [ ] Monitor logs for errors

## Custom Domain (Optional)

- [ ] Purchase domain (Namecheap, GoDaddy, etc.)
- [ ] Point domain DNS to Vercel/Render nameservers
- [ ] Enable HTTPS/SSL
- [ ] Update contact details with new domain

## Troubleshooting

**If frontend won't load:**
- Check Vercel build logs
- Ensure VITE_API_URL is set correctly
- Clear browser cache and try again

**If API calls fail:**
- Check Render application logs
- Verify CORS_ORIGINS includes frontend domain
- Ensure environment variables are set

**If emails don't send:**
- Verify Gmail App Password in admin panel
- Check RECIPIENT_EMAIL is correct
- Review server logs for errors

**If Render goes to sleep:**
- This is normal for free tier
- First request after sleep takes ~30 seconds
- Upgrade to paid tier to prevent sleeping
