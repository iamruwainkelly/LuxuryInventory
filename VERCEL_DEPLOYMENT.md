# LuxuryInventory Vercel Deployment Guide

## Prerequisites
1. Vercel account at https://vercel.com
2. PostgreSQL database (Neon, Supabase, or Railway recommended)
3. GitHub repository for the LuxuryInventory project

## Step 1: Prepare Database
1. Create a PostgreSQL database on your preferred provider:
   - **Neon** (Recommended): https://neon.tech
   - **Supabase**: https://supabase.com
   - **Railway**: https://railway.app

2. Get your database connection string (DATABASE_URL)

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard
1. Go to https://vercel.com/iamruwainkellys-projects
2. Click "Add New..." → "Project"
3. Import your LuxuryInventory GitHub repository
4. Configure environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NODE_ENV`: `production`
5. Deploy

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd /Users/ruwainkelly/Desktop/LuxuryInventory
vercel

# Follow prompts and set environment variables
```

## Step 3: Configure Environment Variables
In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   - `DATABASE_URL`: Your database connection string
   - `NODE_ENV`: `production`

## Step 4: Run Database Migrations
After deployment, run migrations:
```bash
# Using Vercel CLI
vercel env pull .env.local
npm run db:push
```

## Expected URLs
- Production URL: `https://luxury-inventory-[random].vercel.app`
- Dashboard: `https://luxury-inventory-[random].vercel.app/dashboard`
- API: `https://luxury-inventory-[random].vercel.app/api`

## Troubleshooting
- Check Vercel logs if deployment fails
- Ensure DATABASE_URL is properly set
- Verify all dependencies are in package.json
- Check build logs for any missing environment variables

## Project Structure
```
LuxuryInventory/
├── vercel.json          # Vercel configuration
├── package.json         # Updated with vercel-build script
├── client/              # React frontend
├── server/              # Express backend
├── shared/              # Shared types and schemas
└── dist/                # Build output
```
