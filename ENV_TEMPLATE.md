# Environment Variables Template

This document lists all environment variables required for DeliveryFlow.

## Required Environment Variables

### Database Configuration

```bash
# Supabase PostgreSQL Connection String
# Format: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
# Get this from: Supabase Dashboard → Settings → Database → Connection String
DATABASE_URL=postgresql://postgres:your-password@db.example.supabase.co:5432/postgres
```

### Session Management

```bash
# Secret key for session encryption
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=your-random-secret-key-here
```

### Application Environment

```bash
# Environment mode: development | production
NODE_ENV=production
```

## Local Development Setup

Create a `.env` file in the project root:

```bash
# .env file for local development
DATABASE_URL=postgresql://postgres:your-password@db.example.supabase.co:5432/postgres
SESSION_SECRET=development-secret-key
NODE_ENV=development
```

## Vercel Production Setup

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Environments |
|----------|-------|--------------|
| `DATABASE_URL` | Your Supabase connection string | Production, Preview, Development |
| `SESSION_SECRET` | Generated secret key | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

## How to Get Values

### DATABASE_URL
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **Database**
4. Scroll to **Connection string** section
5. Select **URI** tab
6. Copy the connection string
7. Replace `[YOUR-PASSWORD]` with your actual database password

### SESSION_SECRET
Generate a secure random key:
```bash
# Using Node.js (recommended)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32

# Or online generator (use with caution)
# https://www.random.org/strings/ (64 characters, hex)
```

### NODE_ENV
- Use `development` for local development
- Use `production` for Vercel deployment
- Use `test` for testing environments

## Security Notes

⚠️ **Important Security Practices**:

1. **Never commit `.env` files** to version control
2. **Never share** environment variables publicly
3. **Rotate secrets** regularly (every 90 days recommended)
4. **Use different values** for production and development
5. **Store securely** using password managers
6. **Limit access** to team members who need them

## Verification

To verify your environment variables are set correctly:

```bash
# Local development
npm run dev

# Check database connection
npx tsx -e "import { db } from './server/db'; db.execute('SELECT 1').then(() => console.log('✓ Database connected')).catch(e => console.error('✗ Database error:', e))"

# Check all variables are present
node -e "require('dotenv').config(); ['DATABASE_URL', 'SESSION_SECRET', 'NODE_ENV'].forEach(v => console.log(v + ':', process.env[v] ? '✓ Set' : '✗ Missing'))"
```

## Troubleshooting

### Error: "DATABASE_URL is not defined"
- **Fix**: Ensure `.env` file exists in project root
- **Fix**: Verify `DATABASE_URL` is set in Vercel environment variables

### Error: "Connection refused"
- **Fix**: Check Supabase project is active
- **Fix**: Verify connection string is correct
- **Fix**: Ensure IP allowlist includes 0.0.0.0/0 in Supabase settings

### Error: "Invalid session secret"
- **Fix**: Verify `SESSION_SECRET` is at least 32 characters
- **Fix**: Generate a new secret using the command above

## Additional Configuration (Optional)

### Port Configuration (Local Development Only)
```bash
# Port for local development server (default: 5000)
PORT=5000
```

### Logging Level
```bash
# Log level: error | warn | info | debug (default: info)
LOG_LEVEL=info
```

### CORS Origins (if needed)
```bash
# Allowed origins for CORS (comma-separated)
CORS_ORIGINS=https://deliveryflow.vercel.app,https://www.yourcompany.com
```

---

## Quick Start Commands

```bash
# 1. Copy this template
cp ENV_TEMPLATE.md .env

# 2. Edit .env with your values
nano .env

# 3. Generate session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 4. Initialize database
npm run db:push

# 5. Seed initial data
npx tsx server/seed.ts

# 6. Start development server
npm run dev
```
