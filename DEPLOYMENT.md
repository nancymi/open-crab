# 🚀 Deployment Guide for Open-Crab

## Step 1: Push to GitHub

Your code is ready to push! Run the following command to authenticate and push:

```bash
git push origin main
```

If you need to authenticate, GitHub will prompt you for credentials or you can use SSH instead:

```bash
# Convert to SSH (if you prefer)
git remote set-url origin git@github.com:nancymi/open-crab.git
git push origin main
```

## Step 2: Deploy to Vercel

### 2.1 Sign in to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Authorize Vercel to access your repositories

### 2.2 Import Your Project
1. Click "Add New Project"
2. Select "Import Git Repository"
3. Find `nancymi/open-crab` in the list
4. Click "Import"

### 2.3 Configure Build Settings
Vercel should auto-detect Next.js settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

Click "Deploy" (we'll add environment variables after the first deployment)

## Step 3: Add Vercel Postgres Database

### 3.1 Create Database
1. In your Vercel project dashboard, go to the **Storage** tab
2. Click "Create Database"
3. Select **Postgres**
4. Choose a database name (e.g., `opencrab-db`)
5. Select your preferred region (choose closest to your users)
6. Click "Create"

### 3.2 Connect Database to Project
1. After creation, click "Connect to Project"
2. Select your `open-crab` project
3. Vercel will automatically add `POSTGRES_*` environment variables
4. The `DATABASE_URL` will be automatically configured

## Step 4: Configure Environment Variables

### 4.1 Add Required Variables
Go to **Settings** → **Environment Variables** and add:

#### Required:
```
GITHUB_TOKEN
```
- Get from: https://github.com/settings/tokens
- Click "Generate new token (classic)"
- Select scopes: `public_repo` (for reading public repositories)
- Copy the token (starts with `ghp_`)
- Paste as value in Vercel

```
CRON_SECRET
```
- Generate a random secret:
  ```bash
  openssl rand -base64 32
  ```
- Or use any random string (e.g., from password generator)
- This protects your cron endpoints from unauthorized access

#### Optional (but recommended):
```
PRODUCTHUNT_API_KEY
```
- Get from: https://www.producthunt.com/v2/oauth/applications
- Create a new application
- Copy the API key
- Leave empty to skip Product Hunt collection

```
NEXT_PUBLIC_BASE_URL
```
- Set to your Vercel deployment URL
- Example: `https://open-crab.vercel.app`
- Used for RSS feed generation

### 4.2 Environment Variable Scope
Make sure all variables are available for:
- ✅ Production
- ✅ Preview
- ✅ Development

## Step 5: Run Database Migrations

### 5.1 Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# Seed the database
npx tsx scripts/seed-database.ts
```

### 5.2 Alternative: Vercel Dashboard
1. Go to **Settings** → **Functions**
2. Add a temporary function to run migrations:

Create `pages/api/setup.ts`:
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await execAsync('npx prisma migrate deploy');
    await execAsync('npx tsx scripts/seed-database.ts');
    res.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
}
```

Then visit: `https://your-app.vercel.app/api/setup` with header:
```
Authorization: Bearer YOUR_CRON_SECRET
```

## Step 6: Initial Data Collection

Trigger the cron jobs manually to populate data:

```bash
# Collect from GitHub
curl -X POST https://your-app.vercel.app/api/cron/collect-github \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Collect from Reddit
curl -X POST https://your-app.vercel.app/api/cron/collect-reddit \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Collect from Medium
curl -X POST https://your-app.vercel.app/api/cron/collect-medium \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Collect from Product Hunt (if API key configured)
curl -X POST https://your-app.vercel.app/api/cron/collect-producthunt \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

Or use the test script locally:
```bash
# After pulling env variables
vercel env pull .env.local
npx tsx scripts/test-collectors.ts
```

## Step 7: Verify Deployment

### 7.1 Check Homepage
Visit `https://your-app.vercel.app`
- Should display the hero section
- Tools grid should show collected tools

### 7.2 Test API Endpoints
```bash
# Get tools
curl https://your-app.vercel.app/api/tools

# Get RSS feed
curl https://your-app.vercel.app/api/rss

# Test search
curl https://your-app.vercel.app/api/tools?search=chatbot

# Test category filter
curl https://your-app.vercel.app/api/tools?category=llms-chatbots
```

### 7.3 Check Cron Jobs
1. Go to **Deployments** → **Functions** → **Cron**
2. Verify cron jobs are scheduled:
   - `collect-github` - Every 6 hours at :00
   - `collect-reddit` - Every 6 hours at :30
   - `collect-medium` - Every 6 hours at :00
   - `collect-producthunt` - Every 6 hours at :30

### 7.4 Monitor Logs
1. Go to **Deployments** → Select latest deployment
2. Click **Functions** tab
3. Click on any function to view logs
4. Check for errors in cron job executions

## Step 8: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_BASE_URL` to use custom domain

## Troubleshooting

### Database Connection Issues
- Check that `DATABASE_URL` is properly set in environment variables
- Verify Postgres database is running in Vercel Storage
- Try redeploying after adding environment variables

### Cron Jobs Not Running
- Verify `CRON_SECRET` is set correctly
- Check function logs for errors
- Ensure cron jobs are on Pro plan (free tier has limitations)

### No Tools Appearing
- Run manual data collection (Step 6)
- Check `GITHUB_TOKEN` is valid and has correct scopes
- View function logs for collector errors
- Verify database was seeded with categories

### Build Failures
- Check that all dependencies are in `package.json`
- Verify TypeScript compilation succeeds locally
- Review build logs in Vercel dashboard

### API Rate Limits
- GitHub: 5000 req/hour (with token), 60 req/hour (without)
- Reddit: No official limit on JSON endpoints
- Product Hunt: Check your API key's rate limits
- If hitting limits, reduce cron frequency in `vercel.json`

## Monitoring & Maintenance

### Regular Checks
- Monitor cron job execution in Vercel dashboard
- Check database size in Storage tab
- Review error logs weekly
- Update dependencies monthly

### Scaling
- Free tier: 100 GB-hours compute, 1 GB database
- Pro tier: Unlimited compute, larger database
- Upgrade if you hit limits

### Backup
- Vercel Postgres has automatic backups
- Export data regularly for safety:
  ```bash
  pg_dump $DATABASE_URL > backup.sql
  ```

## Success Checklist

- ✅ Code pushed to GitHub
- ✅ Vercel project created and deployed
- ✅ Postgres database added
- ✅ Environment variables configured
- ✅ Database migrated and seeded
- ✅ Initial data collected
- ✅ Homepage loads with tools
- ✅ API endpoints responding
- ✅ RSS feed accessible
- ✅ Cron jobs scheduled

## Next Steps

Once deployed:
1. Share your site URL!
2. Monitor initial data collection
3. Add more data sources if needed
4. Consider adding analytics (Vercel Analytics)
5. Set up error monitoring (Sentry, LogRocket)
6. Add social sharing meta tags
7. Submit to product directories

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- GitHub Issues: https://github.com/nancymi/open-crab/issues
