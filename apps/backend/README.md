# Pathfindr Backend API

Node.js backend API built with Express, TypeScript, and PostgreSQL.

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT with bcrypt
- **Caching:** Redis
- **File Storage:** AWS S3
- **Payment:** Stripe
- **Email:** Nodemailer
- **Push Notifications:** Firebase Admin SDK

## Directory Structure

```
src/
├── controllers/      # Request handlers
├── services/         # Business logic
├── models/           # Data models (Prisma)
├── middleware/       # Express middleware
├── routes/           # API route definitions
├── utils/            # Utility functions
├── types/            # TypeScript types
├── config/           # Configuration files
└── db/               # Database seeds and migrations
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Set up the database:
```bash
npm run migrate
npm run db:seed
```

4. Run the development server:
```bash
npm run dev
```

The API will be available at http://localhost:4000/api/v1

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed the database

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### UAP (Unified Academic Profile)
- `GET /api/v1/uap/profile` - Get user profile
- `PUT /api/v1/uap/profile` - Update user profile
- `POST /api/v1/uap/documents` - Upload document
- `DELETE /api/v1/uap/documents/:id` - Delete document

### Scholarships
- `GET /api/v1/scholarships` - Get all scholarships
- `GET /api/v1/scholarships/:id` - Get scholarship by ID
- `POST /api/v1/scholarships/search` - Search scholarships
- `POST /api/v1/scholarships/:id/apply` - Apply for scholarship
- `GET /api/v1/scholarships/:id/match` - Get match score

### Universities
- `GET /api/v1/universities` - Get all universities
- `GET /api/v1/universities/:id` - Get university by ID
- `GET /api/v1/universities/:id/programmes` - Get university programmes
- `POST /api/v1/universities/:id/follow` - Follow university
- `DELETE /api/v1/universities/:id/follow` - Unfollow university

### Jobs/Internships
- `GET /api/v1/jobs` - Get all jobs
- `GET /api/v1/jobs/:id` - Get job by ID
- `POST /api/v1/jobs/:id/apply` - Apply for job

### Notifications
- `GET /api/v1/notifications` - Get all notifications
- `PATCH /api/v1/notifications/:id/read` - Mark notification as read
- `PATCH /api/v1/notifications/read-all` - Mark all as read

### Subscriptions
- `GET /api/v1/subscriptions` - Get subscription status
- `POST /api/v1/subscriptions/upgrade` - Upgrade subscription
- `POST /api/v1/subscriptions/cancel` - Cancel subscription
- `POST /api/v1/subscriptions/webhook` - Stripe webhook handler

## Environment Variables

See `.env.example` for required environment variables.

## Database Schema

The database schema will be defined using Prisma. Run `npm run db:studio` to view the schema visually.

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on all endpoints
- CORS configuration
- Helmet for security headers
- Input validation with Zod

## Learn More

- [Express.js Documentation](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
