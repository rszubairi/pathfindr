# Convex Database Setup Guide

This guide will help you set up Convex database for the Pathfindr project.

## Prerequisites

- Node.js 18+ installed
- npm installed
- A Convex account (free tier available at https://www.convex.dev)

## Step 1: Initialize Convex

Run the following command to initialize Convex in your project:

```bash
cd /Users/raheelzubairi/Documents/projects/pathfindr
npx convex dev
```

This will:
1. Prompt you to log in to Convex (or create an account)
2. Create a new Convex project
3. Generate a deployment URL
4. Create the `convex/_generated` directory with TypeScript types
5. Start watching for schema changes

## Step 2: Configure Environment Variables

After running `npx convex dev`, you'll receive a deployment URL like:
```
https://your-deployment-name.convex.cloud
```

Add this URL to your `.env.local` file:

```bash
# In apps/web/.env.local
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-name.convex.cloud
```

## Step 3: Seed the Database

Once Convex is running, seed the database with scholarship data:

### Option A: Using Convex Dashboard

1. Open your Convex dashboard at https://dashboard.convex.dev
2. Navigate to your project
3. Go to "Functions" tab
4. Find and run the `seed:seedScholarships` mutation
5. This will populate the database with 100 mock scholarships

### Option B: Using CLI

```bash
# From project root
npx convex run seed:seedScholarships
```

## Step 4: Verify Data

Check that data was seeded successfully:

1. Go to your Convex dashboard
2. Navigate to "Data" tab
3. You should see the `scholarships` table with 100+ entries

## Step 5: Start Development Server

With Convex running in one terminal, start your Next.js development server in another:

```bash
cd apps/web
npm run dev
```

Visit http://localhost:3000 to see your application with live Convex data!

## Important Notes

### Keep Convex Running

- Always keep `npx convex dev` running during development
- It watches for schema changes and keeps your types up to date
- Your Next.js app needs Convex to be running to fetch data

### Schema Changes

When you modify `convex/schema.ts`:
1. Save the file
2. Convex will automatically detect changes and update
3. TypeScript types in `convex/_generated` will be regenerated
4. Your IDE will pick up the new types

### Clearing Data

To reset the database (useful for testing):

```bash
npx convex run seed:clearScholarships
```

Then re-seed:

```bash
npx convex run seed:seedScholarships
```

## Available Convex Functions

### Queries (Read Data)
- `scholarships:list` - Get all scholarships with optional filters
- `scholarships:getById` - Get a single scholarship by ID
- `scholarships:search` - Search scholarships by name or provider
- `scholarships:filter` - Filter scholarships by multiple criteria
- `scholarships:stats` - Get scholarship statistics

### Mutations (Write Data)
- `scholarships:create` - Create a new scholarship
- `scholarships:update` - Update an existing scholarship
- `scholarships:remove` - Delete a scholarship
- `scholarships:bulkCreate` - Create multiple scholarships at once
- `seed:seedScholarships` - Populate database with mock data
- `seed:clearScholarships` - Clear all scholarships

## Troubleshooting

### "Cannot connect to Convex"
- Make sure `npx convex dev` is running
- Check that `NEXT_PUBLIC_CONVEX_URL` is set correctly
- Verify you're logged in: `npx convex dev --once`

### "No data appearing"
- Run the seed script: `npx convex run seed:seedScholarships`
- Check Convex dashboard to verify data exists
- Clear browser cache and refresh

### Schema errors
- Delete `convex/_generated` folder
- Restart `npx convex dev`
- Wait for types to regenerate

## Production Deployment

### Deploy Convex

```bash
npx convex deploy
```

This will create a production deployment and give you a production URL.

### Update Environment Variables

Update your production environment variables with the production Convex URL:

```
NEXT_PUBLIC_CONVEX_URL=https://your-prod-deployment.convex.cloud
```

### Seed Production Database

```bash
npx convex run seed:seedScholarships --prod
```

## Additional Resources

- [Convex Documentation](https://docs.convex.dev)
- [Convex + Next.js Guide](https://docs.convex.dev/quickstart/nextjs)
- [Convex Dashboard](https://dashboard.convex.dev)
