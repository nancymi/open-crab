# ⚡ Quick Start: Deploy to Vercel in 5 Minutes

## Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))

## Step 1: Push to GitHub (1 min)

```bash
# You're already in the project directory
git push origin main
```

If you need to authenticate, follow GitHub's prompts or use:
```bash
git push -u origin main
```

## Step 2: Import to Vercel (2 min)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select **nancymi/open-crab**
4. Click "Import"
5. Click "Deploy" (we'll add env vars in next step)

## Step 3: Add Postgres Database (1 min)

1. In project dashboard → **Storage** tab
2. Click "Create Database" → Select **Postgres**
3. Name it `opencrab-db`
4. Click "Create"
5. Click "Connect to Project" → Select your project
6. ✅ `DATABASE_URL` is now automatically added!

## Step 4: Configure Environment Variables (1 min)

Go to **Settings** → **Environment Variables** and add:

### Required:

**GITHUB_TOKEN**
```bash
# Get your token at: https://github.com/settings/tokens
# Click "Generate new token (classic)"
# Select scope: "public_repo"
# Copy the token (starts with ghp_)
```
Value: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**CRON_SECRET**
```bash
# Generate a random secret:
openssl rand -base64 32
# Or use any random string
```
Value: `your-random-secret-here`

**NEXT_PUBLIC_BASE_URL** (optional but recommended)
Value: `https://open-crab.vercel.app` (use your actual URL)

### Optional:

**PRODUCTHUNT_API_KEY** (leave empty if you don't have one)
Value: (empty or your Product Hunt API key)

**Important:** Make sure all variables are checked for:
- ✅ Production
- ✅ Preview
- ✅ Development

Then click **Save**.

## Step 5: Redeploy with Environment Variables

After adding env vars:
1. Go to **Deployments** tab
2. Click ︙ on latest deployment → **Redeploy**
3. ✅ Check "Use existing Build Cache"
4. Click "Redeploy"

## Step 6: Initialize Database & Collect Data

### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
vercel login
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# Seed categories
npx tsx scripts/seed-database.ts

# Collect initial data
npx tsx scripts/test-collectors.ts
```

### Option B: Manual via API
```bash
# Replace YOUR_URL and YOUR_SECRET below

# Seed database (categories)
# Create file: pages/api/seed.ts (see DEPLOYMENT.md for code)

# Trigger collectors
curl -X POST https://YOUR_URL.vercel.app/api/cron/collect-github \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

curl -X POST https://YOUR_URL.vercel.app/api/cron/collect-reddit \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

curl -X POST https://YOUR_URL.vercel.app/api/cron/collect-medium \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## ✅ Done! Your site is live!

Visit: `https://your-app.vercel.app`

You should see:
- ✅ Homepage with hero section
- ✅ Latest AI tools displayed
- ✅ Search and filters working
- ✅ RSS feed at `/api/rss`

## Automatic Updates

Your cron jobs will run automatically every 6 hours to collect new tools:
- GitHub repos
- Reddit posts
- Medium articles
- Product Hunt launches (if configured)

Check **Deployments** → **Functions** → **Cron** to monitor.

## Next Steps

1. **Verify Data Collection**
   - Check homepage for tools
   - Visit `/tools` to see all collected items
   - Test search functionality

2. **Monitor Logs**
   - Go to **Deployments** → Functions
   - Click on cron jobs to view logs
   - Check for any errors

3. **Custom Domain** (optional)
   - Settings → Domains
   - Add your domain
   - Update `NEXT_PUBLIC_BASE_URL`

4. **Share Your Site!**
   - Tweet about it
   - Post on Product Hunt
   - Share in AI communities

## Troubleshooting

### No tools showing up?
- Run the data collectors manually (Step 6)
- Check GitHub token is valid at https://github.com/settings/tokens
- View function logs in Vercel dashboard

### Build errors?
- Check all environment variables are set
- Redeploy after adding env vars

### Cron jobs not running?
- Verify `CRON_SECRET` is set
- Check you're on Vercel Pro (free tier has limits)
- View logs: Deployments → Functions → [cron-job-name]

## Cost

**Free Tier Includes:**
- 100 GB-hours compute/month
- 1 GB Postgres database
- Unlimited bandwidth

Perfect for starting out! Upgrade to Pro if needed.

## Need Help?

- Full guide: See `DEPLOYMENT.md`
- Issues: https://github.com/nancymi/open-crab/issues
- Vercel Docs: https://vercel.com/docs

---

**That's it! 🎉 You're live in 5 minutes!**
