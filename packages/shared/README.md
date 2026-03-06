# @pathfindr/shared

Shared types, utilities, and constants for the Pathfindr platform.

## Overview

This package contains common code shared across the web, mobile, and backend applications, including:

- TypeScript type definitions
- Constants and enums
- Utility functions
- Validation helpers

## Installation

This package is part of the Pathfindr monorepo and is not published to npm. It's used internally via workspace references.

## Usage

### In Web or Mobile Applications

```typescript
import { User, Scholarship, calculateMatchScore } from '@pathfindr/shared';

const matchScore = calculateMatchScore(studentProfile, scholarship);
```

### In Backend

```typescript
import { USER_ROLES, isValidEmail, ApiResponse } from '@pathfindr/shared';

const response: ApiResponse = {
  success: true,
  data: user,
  timestamp: new Date().toISOString(),
};
```

## Structure

```
src/
├── types/            # TypeScript type definitions
├── constants/        # Constants and enums
└── utils/            # Utility functions
```

## Available Exports

### Types
- User, UAP, Scholarship, University, Programme, Opportunity
- Application, Notification, Subscription
- ApiResponse, PaginatedResponse

### Constants
- USER_ROLES, SUBSCRIPTION_TIERS, APPLICATION_STATUS
- NOTIFICATION_TYPES, FEATURE_FLAGS, VALIDATION
- CURRENCIES, LANGUAGES, COUNTRIES
- ERROR_MESSAGES, SUCCESS_MESSAGES

### Utilities
- Validation: `isValidEmail`, `isValidPassword`, `isValidPhone`
- String: `truncate`, `slugify`, `capitalize`
- Date: `formatDate`, `isDeadlineSoon`, `isDeadlinePassed`
- Number: `formatCurrency`, `calculatePercentage`
- Array: `unique`, `chunk`
- Object: `omit`, `pick`
- File: `getFileExtension`, `formatFileSize`
- UAP: `calculateProfileCompleteness`
- Matching: `calculateMatchScore`

## Development

```bash
npm run build        # Build TypeScript
npm run dev          # Watch mode
npm run lint         # Run ESLint
npm run test         # Run tests
```

## License

Private - All rights reserved by Pathfindr Team
