# Deployment Setup Guide

This guide explains how to set up automatic deployment to Vercel after merging to the main branch.

## Option 1: Vercel GitHub Integration (Recommended - Easiest)

This is the simplest method. Vercel will automatically deploy when you push to main.

### Steps:

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Sign in or create an account

2. **Import Your GitHub Repository**
   - Click "Add New..." → "Project"
   - Select your GitHub repository (`erluxman/tt`)
   - Vercel will auto-detect Next.js settings from `vercel.json`

3. **Configure Project Settings**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (from vercel.json)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (from vercel.json)

4. **Set Up Automatic Deployments**
   - Production Branch: `main`
   - Vercel will automatically:
     - Deploy every push to `main` branch
     - Create preview deployments for pull requests
     - Run builds automatically

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a URL like: `https://your-project.vercel.app`

### Benefits:
- ✅ Zero configuration needed
- ✅ Automatic deployments on push to main
- ✅ Preview deployments for PRs
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Environment variables management in Vercel dashboard

---

## Option 2: GitHub Actions Deployment (More Control)

If you prefer to use GitHub Actions for deployment, follow these steps:

### Prerequisites:

1. **Get Vercel Tokens**
   - Go to https://vercel.com/account/tokens
   - Create a new token
   - Copy the token

2. **Get Vercel Project Information**
   - Install Vercel CLI: `npm i -g vercel`
   - Run: `vercel link` in your project directory
   - This will give you:
     - `VERCEL_ORG_ID`
     - `VERCEL_PROJECT_ID`

3. **Add GitHub Secrets**
   - Go to your GitHub repository
   - Navigate to: Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `VERCEL_TOKEN`: Your Vercel token
     - `VERCEL_ORG_ID`: Your organization ID
     - `VERCEL_PROJECT_ID`: Your project ID

4. **Deployment Workflow**
   - The workflow (`.github/workflows/deploy.yml`) is already created
   - It will automatically:
     - Run tests
     - Build the application
     - Deploy to Vercel production
     - Trigger on every push to `main` branch

### Workflow Details:

The deployment workflow:
- ✅ Runs tests before deploying
- ✅ Builds the application
- ✅ Deploys to Vercel production
- ✅ Only runs on `main` branch pushes
- ✅ Can be manually triggered via `workflow_dispatch`

---

## Option 3: Manual Deployment

If you prefer manual control:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

---

## Environment Variables

If your application needs environment variables:

### Via Vercel Dashboard:
1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add your variables
4. Redeploy

### Via Vercel CLI:
```bash
vercel env add VARIABLE_NAME
```

---

## Deployment Status

You can check deployment status:
- In Vercel dashboard
- Via GitHub Actions tab (if using Option 2)
- Via Vercel CLI: `vercel ls`

---

## Troubleshooting

### Build Failures:
- Check build logs in Vercel dashboard
- Verify `vercel.json` configuration
- Ensure all dependencies are in `package.json`

### Deployment Not Triggering:
- Verify branch protection rules allow deployments
- Check GitHub Actions permissions
- Verify Vercel tokens are valid

### Environment Variables Not Working:
- Ensure variables are set in Vercel dashboard
- Redeploy after adding variables
- Check variable names match your code

---

## Recommended Setup

For this project, **Option 1 (Vercel GitHub Integration)** is recommended because:
- ✅ Simplest setup
- ✅ Automatic preview deployments for PRs
- ✅ Built-in CI/CD
- ✅ No GitHub Actions configuration needed
- ✅ Easy environment variable management

The existing `vercel.json` file is already configured correctly for Next.js.

---

## Next Steps

1. Choose your deployment method (Option 1 recommended)
2. Set up the deployment
3. Push to `main` branch
4. Verify deployment at your Vercel URL

Your application will automatically deploy on every merge to `main`! 🚀

