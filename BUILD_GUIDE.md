# Build Guide - Pathfindr with Convex

This guide explains how to build and deploy your Pathfindr application with Convex database.

## Understanding the Build Process

Your app now uses Convex, which requires the `convex/_generated` folder with TypeScript types. This folder is created by running `npx convex dev` or `npx convex codegen`.

## Development Workflow

### Local Development (Recommended)

**Terminal 1 - Run Convex:**
```bash
npx convex dev
```
Keep this running to:
- Watch for schema changes
- Auto-generate TypeScript types
- Enable real-time database updates

**Terminal 2 - Run Next.js:**
```bash
cd apps/web
npm run dev
```

Visit http://localhost:3000

## Building for Production

### Option 1: Quick Build (After Dev is Running)

If you already have `npx convex dev` running:

```bash
cd apps/web
npm run build
```

### Option 2: Production Build (Complete)

For a fresh production build with deployment:

```bash
# From project root
cd apps/web
npm run build:prod
```

This will:
1. Deploy Convex functions to production
2. Generate production types
3. Build Next.js for production

### Option 3: Build Without Convex Deploy

If you just want to build locally without deploying:

```bash
# Generate types first
npx convex codegen --typecheck=disable

# Then build
cd apps/web
npm run build
```

## Deployment Strategies

### Vercel Deployment

1. **Connect to Vercel:**
   ```bash
   cd apps/web
   vercel
   ```

2. **Set Environment Variables in Vercel:**
   - Go to your Vercel project settings
   - Add environment variable:
     ```
     NEXT_PUBLIC_CONVEX_URL=https://joyous-pika-164.eu-west-1.convex.cloud
     ```

3. **Deploy Convex First:**
   ```bash
   npx convex deploy --prod
   ```
   This gives you a production Convex URL.

4. **Update Vercel Environment Variable:**
   - Update `NEXT_PUBLIC_CONVEX_URL` with the production URL
   - Redeploy on Vercel

### Other Platforms (Netlify, AWS, etc.)

1. **Deploy Convex:**
   ```bash
   npx convex deploy --prod
   ```

2. **Set Environment Variables:**
   ```
   NEXT_PUBLIC_CONVEX_URL=<your-production-convex-url>
   ```

3. **Build Command:**
   ```bash
   npm run build:prod
   ```

4. **Start Command:**
   ```bash
   npm run start
   ```

## CI/CD Setup

For automated deployments, you need to authenticate Convex:

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Deploy Convex
        env:
          CONVEX_DEPLOY_KEY: ${{ secrets.CONVEX_DEPLOY_KEY }}
        run: npx convex deploy --prod

      - name: Build
        run: |
          cd apps/web
          npm run build
```

### Getting Convex Deploy Key

1. Run: `npx convex deploy --generate-key`
2. Copy the key
3. Add it as a secret to your CI/CD platform

## Troubleshooting

### Error: "MissingAccessToken"

**Problem:** Convex needs authentication.

**Solution:**
```bash
# Authenticate locally
npx convex dev

# Or for CI/CD, use deploy key
npx convex deploy --generate-key
```

### Error: "Cannot find module convex/_generated/api"

**Problem:** Generated types are missing.

**Solution:**
```bash
# Generate types
npx convex codegen --typecheck=disable

# Or run convex dev
npx convex dev --once
```

### Error: "Build failed" during deployment

**Problem:** Convex functions not deployed or environment variable missing.

**Solution:**
1. Deploy Convex first: `npx convex deploy --prod`
2. Set `NEXT_PUBLIC_CONVEX_URL` environment variable
3. Rebuild: `npm run build`

## NPM Scripts Reference

```bash
# Development
npm run dev              # Start Next.js dev server
npm run dev:convex       # Start Convex dev server

# Building
npm run build            # Build for production (requires Convex to be running)
npm run build:prod       # Deploy Convex + build (complete production build)

# Convex
npm run convex:deploy    # Deploy Convex to production
npm run convex:seed      # Seed database with sample data
npm run convex:clear     # Clear all scholarships from database

# Production
npm run start            # Start production server
```

## Best Practices

### Development
1. Always run `npx convex dev` in a separate terminal
2. Keep it running while developing
3. Types will auto-update when you change schema

### Production
1. Deploy Convex first: `npx convex deploy --prod`
2. Get production URL from Convex dashboard
3. Set environment variables in your hosting platform
4. Build and deploy your Next.js app

### Environment Variables

**Development (.env.local):**
```bash
NEXT_PUBLIC_CONVEX_URL=https://joyous-pika-164.eu-west-1.convex.cloud
```

**Production (Hosting Platform):**
```bash
NEXT_PUBLIC_CONVEX_URL=https://your-prod-deployment.convex.cloud
```

## Quick Reference

| Scenario | Command |
|----------|---------|
| Local Dev | `npx convex dev` + `npm run dev` |
| Quick Build | `npm run build` (after dev) |
| Full Production | `npm run build:prod` |
| Deploy to Vercel | `npx convex deploy --prod` + Vercel deploy |
| CI/CD Build | `npx convex deploy` + `npm run build` |

## Need Help?

- **Convex Docs:** https://docs.convex.dev
- **Convex Dashboard:** https://dashboard.convex.dev
- **Deployment Guide:** https://docs.convex.dev/production/hosting
