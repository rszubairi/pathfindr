# Pathfindr Web Application

React web application built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **Data Fetching:** TanStack Query (React Query)
- **Form Handling:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Icons:** Lucide React

## Directory Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable React components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and API clients
├── store/            # Redux store and slices
├── styles/           # Global styles
└── types/            # TypeScript type definitions
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests

## Features

### Implemented
- ✅ Landing page with hero section
- ✅ Redux state management setup
- ✅ API client configuration
- ✅ TypeScript types for core entities
- ✅ Responsive design with Tailwind CSS

### To Be Implemented
- [ ] Authentication (Login/Register)
- [ ] Student Dashboard
- [ ] UAP (Unified Academic Profile) Creation
- [ ] Scholarship Marketplace
- [ ] University Discovery
- [ ] Job/Internship Listings
- [ ] Application Tracking
- [ ] Notifications Center
- [ ] Subscription Management
- [ ] Admin Dashboard

## Code Style

This project uses:
- ESLint for linting
- Prettier for code formatting
- TypeScript for type safety

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Redux Toolkit](https://redux-toolkit.js.org)
