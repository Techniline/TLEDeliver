# DeliveryFlow - Vercel Deployment Guide

This guide will help you deploy DeliveryFlow to Vercel with Supabase PostgreSQL database.

## Prerequisites

- Vercel account ([sign up here](https://vercel.com/signup))
- Supabase project ([create one here](https://supabase.com))
- Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: deliveryflow-db
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"

### 1.2 Get Database Connection String

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Select **URI** tab
4. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. **Save this connection string** - you'll need it for Vercel

### 1.3 Initialize Database Schema

Run these commands locally to create the database tables:

```bash
# Ensure you have DATABASE_URL in your .env file
echo "DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" > .env

# Push database schema to Supabase
npm run db:push

# Seed initial driver data
npx tsx server/seed.ts
```

## Step 2: Prepare Your Code

### 2.1 Update package.json

Ensure your `package.json` has the build script:

```json
{
  "scripts": {
    "build": "vite build",
    "dev": "NODE_ENV=development tsx server/index.ts",
    "db:push": "drizzle-kit push"
  }
}
```

### 2.2 Verify Environment Variables

The app requires these environment variables:

```bash
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
SESSION_SECRET=your-random-secret-key-here
NODE_ENV=production
```

Generate a session secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 3: Deploy to Vercel

### 3.1 Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Select the repository containing DeliveryFlow

### 3.2 Configure Project

1. **Framework Preset**: Other (or Custom)
2. **Root Directory**: `./` (leave as default)
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist/public`
5. **Install Command**: `npm install`

### 3.3 Add Environment Variables

In the **Environment Variables** section, add:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Supabase connection string |
| `SESSION_SECRET` | Your generated secret key |
| `NODE_ENV` | `production` |

**Important**: Make sure to add these for all environments (Production, Preview, Development)

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (2-3 minutes)
3. Once deployed, you'll get a URL like: `https://deliveryflow.vercel.app`

## Step 4: Post-Deployment Setup

### 4.1 Verify Database Connection

1. Visit your deployed app
2. Try creating a delivery request
3. Check if it appears in the admin dashboard

### 4.2 Seed Production Database (Optional)

If you need to seed drivers in production:

```bash
# Set DATABASE_URL to your production database
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Run seed script
npx tsx server/seed.ts
```

### 4.3 Set Up Custom Domain (Optional)

1. In Vercel project settings, go to **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `deliveryflow.yourcompany.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate to be issued

## Step 5: Monitoring & Maintenance

### 5.1 View Logs

- **Vercel Logs**: Go to your project → **Logs** tab
- **Supabase Logs**: Go to Supabase project → **Logs** → **Postgres Logs**

### 5.2 Database Backups

Supabase automatically backs up your database daily. To restore:

1. Go to Supabase Dashboard → **Database** → **Backups**
2. Select a backup point
3. Click **"Restore"**

### 5.3 Update Deployment

To deploy changes:

```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

Vercel will automatically redeploy when you push to your main branch.

## Troubleshooting

### Build Fails

**Error**: `Module not found`
- **Fix**: Ensure all dependencies are in `package.json` and run `npm install` locally first

**Error**: `Database connection failed`
- **Fix**: Verify `DATABASE_URL` environment variable is set correctly in Vercel

### Runtime Errors

**Error**: `500 Internal Server Error`
- **Fix**: Check Vercel function logs for detailed error messages
- Verify all environment variables are set

**Error**: `Cannot connect to database`
- **Fix**: 
  1. Check Supabase project is active
  2. Verify connection string includes password
  3. Ensure IP allowlist is set to allow all (0.0.0.0/0) in Supabase settings

### Slow Performance

- **Database**: Upgrade Supabase plan for better performance
- **Functions**: Consider upgrading Vercel plan for more compute resources

## Security Best Practices

1. **Never commit secrets**: Keep `.env` files in `.gitignore`
2. **Rotate secrets**: Change `SESSION_SECRET` periodically
3. **Database access**: Use Supabase Row Level Security (RLS) for sensitive data
4. **HTTPS only**: Vercel provides SSL by default, ensure it's enabled
5. **Environment variables**: Use Vercel's encrypted environment variables

## Support

- **Vercel Issues**: [Vercel Support](https://vercel.com/support)
- **Supabase Issues**: [Supabase Support](https://supabase.com/support)
- **DeliveryFlow Issues**: Check application logs and database queries

## Next Steps

- Set up monitoring with [Vercel Analytics](https://vercel.com/analytics)
- Enable [Vercel Speed Insights](https://vercel.com/docs/speed-insights)
- Configure alerts for errors and downtime
- Set up staging environment for testing

---

**Deployment Checklist**:
- [ ] Supabase project created
- [ ] Database schema initialized
- [ ] Environment variables configured in Vercel
- [ ] Application deployed successfully
- [ ] Database connection verified
- [ ] Test delivery request submitted
- [ ] Admin dashboard functioning
- [ ] CSV export working
- [ ] Custom domain configured (optional)
- [ ] Monitoring enabled
