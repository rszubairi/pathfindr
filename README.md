# Pathfindr - Student Opportunity Platform

## Overview

Pathfindr is a centralized digital ecosystem connecting students with global scholarships, university programmes, internships, and job opportunities. Built with React JS (Web) and React Native (Mobile), Pathfindr aims to be the LinkedIn + Scholarship Portal + University Admission Platform for students in Southeast Asia and beyond.

## System Architecture

This is a monorepo containing:

- **Web Application** (`apps/web`) - React JS web application with Next.js
- **Mobile Application** (`apps/mobile`) - React Native application for iOS and Android
- **Backend API** (`apps/backend`) - Node.js REST/GraphQL API server
- **Shared Packages** (`packages/shared`) - Shared TypeScript types, utilities, and constants

## Key Features

### Core Features (Phase 1 - MVP)
- ✅ Unified Academic Profile (UAP) system
- ✅ Scholarship Marketplace
- ✅ University Programme Discovery
- ✅ Auto-Apply Engine (Premium feature)
- ✅ Smart Notification System
- ✅ Student Subscription Tiers (Free & Premium)
- ✅ Admin Dashboard

### Future Features (Phase 2 & 3)
- Internship & Job Marketplace
- Employer & Institutional Accounts
- Philanthropist Scholarship Management
- AI-Powered Matching Engine
- Multi-language Support (Bahasa Malaysia, Thai, Vietnamese, Filipino)
- Regional Expansion across ASEAN

## Tech Stack

### Frontend (Web)
- React 18+ with TypeScript
- Next.js 14+ (SSR/SSG)
- Redux Toolkit (State Management)
- Tailwind CSS (Styling)
- React Query (Data Fetching)

### Mobile
- React Native 0.73+
- TypeScript
- React Navigation
- Redux Toolkit
- Firebase (Push Notifications)

### Backend
- Node.js 18+ with Express/Fastify
- TypeScript
- PostgreSQL (Primary Database)
- Redis (Caching)
- AWS S3 (File Storage)
- JWT Authentication

### DevOps & Infrastructure
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- AWS/Vercel (Deployment)
- Elasticsearch (Search)

## Project Structure

```
pathfindr/
├── apps/
│   ├── web/              # React web application
│   ├── mobile/           # React Native mobile app
│   └── backend/          # Backend API server
├── packages/
│   ├── shared/           # Shared types and utilities
│   ├── ui/               # Shared UI components
│   └── config/           # Shared configuration
├── docs/                 # Documentation
│   ├── api/              # API documentation
│   ├── design/           # Design specifications
│   └── requirements/     # System requirements
├── scripts/              # Build and deployment scripts
└── package.json          # Root package.json
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm 9+
- Docker and Docker Compose (optional, for local development)
- PostgreSQL 14+ (or use Docker)
- Redis 7+ (or use Docker)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pathfindr
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy environment templates
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
cp apps/backend/.env.example apps/backend/.env
```

4. Start development servers:

```bash
# Start web application
npm run dev:web

# Start mobile application (in a new terminal)
npm run dev:mobile

# Start backend API (in a new terminal)
npm run dev:backend
```

### Development Workflow

#### Web Application
```bash
cd apps/web
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
```

#### Mobile Application
```bash
cd apps/mobile
npm run start        # Start Metro bundler
npm run ios          # Run on iOS simulator
npm run android      # Run on Android emulator
npm run test         # Run tests
```

#### Backend API
```bash
cd apps/backend
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript
npm run start        # Start production server
npm run test         # Run tests
npm run migrate      # Run database migrations
```

## User Roles

1. **Students**
   - Free Tier: Basic profile, manual applications, 5 notifications/month
   - Premium Tier: Auto-Apply, unlimited notifications, AI matching, CV export

2. **Institutional Users**
   - Universities & Colleges
   - Scholarship Providers
   - Employers

3. **Philanthropists**
   - Individual scholarship sponsors

4. **Platform Administrators**
   - System management and moderation

## Key Modules

### 1. Unified Academic Profile (UAP)
Student's digital education resume powering the Auto-Apply feature

### 2. Auto-Apply Engine
Automated application submission based on UAP matching

### 3. Scholarship Marketplace
Browse, search, and apply for scholarships

### 4. University Discovery
Search programs, compare universities, track applications

### 5. Notification System
Push, email, and in-app notifications

### 6. Subscription Management
Stripe integration for payments and subscriptions

## Security & Compliance

- PDPA 2010 (Malaysia) compliant
- GDPR-ready architecture
- JWT-based authentication
- Multi-factor authentication (MFA)
- TLS 1.2+ encryption in transit
- Encrypted PII at rest

## Performance Requirements

- Page load time < 3 seconds on 4G
- API response time < 500ms (95th percentile)
- Support 10,000+ concurrent users
- 99.5% uptime SLA

## Documentation

- [System Functional Requirements](./docs/requirements/Pathfindr%20SFR%20v1.0-20260307015440.pdf)
- [API Documentation](./docs/api/README.md) (Coming soon)
- [Database Schema](./docs/database/schema.md) (Coming soon)
- [Deployment Guide](./docs/deployment/README.md) (Coming soon)

## Roadmap

### Phase 1 - MVP (Months 1-6) ⬅️ Current Phase
- UAP system
- Scholarship marketplace
- University discovery
- Basic notifications
- Student subscriptions
- Auto-Apply engine

### Phase 2 - Growth (Months 7-12)
- Internship & job marketplace
- Institutional accounts
- Philanthropist module
- Advanced AI matching
- Payment expansion

### Phase 3 - Expansion (Year 2+)
- ASEAN regional expansion
- Multi-language support
- Deep university integrations
- AI essay assistant
- Corporate CSR module

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and development process.

## License

This project is confidential and proprietary. All rights reserved by Pathfindr Team.

## Contact

For questions or support, please contact the Pathfindr development team.

---

**Version:** 1.0.0
**Last Updated:** March 2026
**Status:** Initial Development
