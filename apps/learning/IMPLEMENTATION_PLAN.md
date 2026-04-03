# 🚀 Pathfindr Learning App - Implementation Plan

Based on my analysis of your existing Turborepo structure, I've created a comprehensive, phased implementation plan for the new **Learning App** (`apps/learning`). This plan ensures seamless integration with your existing backend, design system, and architecture.

---

## 📋 **Executive Summary**

**Objective**: Build a React Native learning app that extends Pathfindr with AI-powered educational content, leveraging existing infrastructure.

**Key Integration Points**:
- ✅ Convex backend (auth, users)
- ✅ Shared packages (`@pathfindr/shared`)
- ✅ Theme system (colors, typography)
- ✅ Navigation patterns
- ✅ Redux store structure

**New Components**:
- 📚 Course system with lessons & breakpoints
- 🤖 AI Tutor with interrupt-driven engagement
- 📊 Assessments, progress tracking & leaderboard
- 👶 Kid profiles (multi-child support)

---

## 🏗️ **Phase 0: Foundation & Setup** (Week 1)

### **Module 0.1: Project Scaffolding**
```bash
# Create new app from mobile template
cp -r apps/mobile apps/learning
# Update package.json, app.json, configuration files
```

**Files to Create/Modify**:
- `apps/learning/package.json` (name: `@pathfindr/learning`)
- `apps/learning/app.json` (slug, name, bundle identifier)
- `apps/learning/tsconfig.json` (path aliases)
- `apps/learning/.env.example` (Convex URL, AI service keys)

**Commit**: `feat(learning): initialize learning app scaffold`

---

### **Module 0.2: Backend Schema Extension**
**File**: `convex/schema.ts`

**New Tables**:
```typescript
// Learning-specific tables
kidProfiles: defineTable({
  userId: v.id('users'),
  name: v.string(),
  dateOfBirth: v.string(),
  grade: v.string(),
  learningGoals: v.optional(v.array(v.string())),
  createdAt: v.string(),
  updatedAt: v.string(),
}).index('by_user', ['userId']),

courseCategories: defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  icon: v.optional(v.string()),
  order: v.number(),
  createdAt: v.string(),
}).index('by_order', ['order']),

courses: defineTable({
  categoryId: v.id('courseCategories'),
  title: v.string(),
  description: v.string(),
  thumbnailUrl: v.optional(v.string()),
  videoUrl: v.optional(v.string()),
  script: v.string(), // For AI tutor
  duration: v.number(), // minutes
  ageRange: v.object({ min: v.number(), max: v.number() }),
  status: v.union(v.literal('draft'), v.literal('published'), v.literal('archived')),
  createdAt: v.string(),
  updatedAt: v.string(),
}).index('by_category', ['categoryId'])
  .index('by_status', ['status'])
  .searchIndex('search_title', { searchField: 'title', filterFields: ['status'] }),

lessons: defineTable({
  courseId: v.id('courses'),
  title: v.string(),
  sequenceOrder: v.number(),
  videoUrl: v.optional(v.string()),
  script: v.string(),
  breakpoints: v.array(v.object({
    timestamp: v.number(), // seconds
    type: v.union(v.literal('question'), v.literal('hint'), v.literal('summary')),
    content: v.string(),
    correctAnswer: v.optional(v.string()),
  })),
  duration: v.number(),
  createdAt: v.string(),
}).index('by_course', ['courseId'])
  .index('by_sequence', ['courseId', 'sequenceOrder']),

courseEnrollments: defineTable({
  userId: v.id('users'),
  kidProfileId: v.id('kidProfiles'),
  courseId: v.id('courses'),
  progress: v.number(), // 0-100
  currentLessonIndex: v.number(),
  enrolledAt: v.string(),
  completedAt: v.optional(v.string()),
}).index('by_user', ['userId'])
  .index('by_kid', ['kidProfileId'])
  .index('by_course', ['courseId'])
  .index('by_user_and_course', ['userId', 'courseId']),

aiTutorInteractions: defineTable({
  userId: v.id('users'),
  kidProfileId: v.id('kidProfiles'),
  lessonId: v.id('lessons'),
  breakpointIndex: v.number(),
  interactionType: v.union(v.literal('question'), v.literal('hint'), v.literal('correction'), v.literal('encouragement')),
  userResponse: v.optional(v.string()),
  aiResponse: v.string(),
  scoreDelta: v.optional(v.number()),
  createdAt: v.string(),
}).index('by_lesson', ['lessonId'])
  .index('by_user', ['userId'])
  .index('by_kid', ['kidProfileId']),

assessments: defineTable({
  courseId: v.id('courses'),
  title: v.string(),
  description: v.optional(v.string()),
  passingScore: v.number(), // percentage
  timeLimit: v.optional(v.number()), // minutes
  questions: v.array(v.object({
    question: v.string(),
    type: v.union(v.literal('multiple_choice'), v.literal('true_false'), v.literal('short_answer')),
    options: v.optional(v.array(v.string())),
    correctAnswer: v.string(),
    points: v.number(),
  })),
  createdAt: v.string(),
}).index('by_course', ['courseId']),

assessmentResults: defineTable({
  userId: v.id('users'),
  kidProfileId: v.id('kidProfiles'),
  assessmentId: v.id('assessments'),
  courseId: v.id('courses'),
  score: v.number(),
  totalPoints: v.number(),
  percentage: v.number(),
  passed: v.boolean(),
  answers: v.array(v.object({
    questionIndex: v.number(),
    answer: v.string(),
    correct: v.boolean(),
  })),
  completedAt: v.string(),
}).index('by_user', ['userId'])
  .index('by_kid', ['kidProfileId'])
  .index('by_assessment', ['assessmentId'])
  .index('by_course', ['courseId']),

leaderboard: defineTable({
  userId: v.id('users'),
  kidProfileId: v.id('kidProfiles'),
  courseId: v.id('courses'),
  score: v.number(),
  rank: v.number(),
  updatedAt: v.string(),
}).index('by_course', ['courseId'])
  .index('by_user', ['userId'])
  .index('by_rank', ['courseId', 'score']),
```

**Commit**: `feat(convex): add learning app database schema`

---

### **Module 0.3: Shared Types Extension**
**File**: `packages/shared/src/types/index.ts`

**Add Learning Types**:
```typescript
export interface KidProfile {
  id: string;
  userId: string;
  name: string;
  dateOfBirth: string;
  grade: string;
  learningGoals?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  categoryId: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  script: string;
  duration: number;
  ageRange: { min: number; max: number };
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  sequenceOrder: number;
  videoUrl?: string;
  script: string;
  breakpoints: LessonBreakpoint[];
  duration: number;
  createdAt: string;
}

export interface LessonBreakpoint {
  timestamp: number;
  type: 'question' | 'hint' | 'summary';
  content: string;
  correctAnswer?: string;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  kidProfileId: string;
  courseId: string;
  progress: number;
  currentLessonIndex: number;
  enrolledAt: string;
  completedAt?: string;
}

export interface Assessment {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  questions: AssessmentQuestion[];
  createdAt: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  kidProfileId: string;
  assessmentId: string;
  courseId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  answers: AssessmentAnswer[];
  completedAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  kidProfileId: string;
  courseId: string;
  score: number;
  rank: number;
  updatedAt: string;
}
```

**Commit**: `feat(shared): add learning app type definitions`

---

## 🎨 **Phase 1: Core App Structure** (Week 2)

### **Module 1.1: App Configuration & Entry Point**
**Files**:
- `apps/learning/App.tsx` (adapted from mobile)
- `apps/learning/src/lib/i18n.ts` (reuse from mobile)
- `apps/learning/src/store/index.ts` (new slices for learning state)

**New Redux Slices**:
- `learningSlice.ts` - Course progress, enrollments
- `kidProfilesSlice.ts` - Kid profile management
- `assessmentSlice.ts` - Quiz state, results

**Commit**: `feat(learning): setup app configuration and state management`

---

### **Module 1.2: Theme Integration**
**Files**:
- Copy `apps/mobile/src/theme/` to `apps/learning/src/theme/`
- Ensure consistency with `@pathfindr/shared` colors if created

**Commit**: `feat(learning): integrate theme system`

---

### **Module 1.3: Navigation Structure**
**File**: `apps/learning/src/navigation/RootNavigator.tsx`

**Screen Stack**:
```
RootStack
├── AuthStack (Login, Register)
├── MainTabNavigator
│   ├── Home (Dashboard)
│   ├── Courses (Catalog)
│   ├── Kids (Profile management)
│   ├── Progress (Stats & Results)
│   └── Leaderboard
├── CoursePlayer (Video + AI Tutor)
├── AssessmentView
├── KidProfileDetail
└── Settings
```

**Commit**: `feat(learning): implement navigation structure`

---

## 📱 **Phase 2: Core Screens & Features** (Weeks 3-4)

### **Module 2.1: Authentication & Kid Profiles**
**Screens**:
- `LoginScreen.tsx` (reuse from mobile)
- `RegisterScreen.tsx` (reuse from mobile)
- `KidProfileSetupScreen.tsx` (new)
- `KidProfileListScreen.tsx` (new)

**Convex Functions**:
- `convex/kidProfiles.ts` - CRUD operations
- `convex/auth.ts` - Reuse existing auth

**Commit**: `feat(learning): add authentication and kid profile management`

---

### **Module 2.2: Course Catalog & Discovery**
**Screens**:
- `CoursesScreen.tsx` - Browse by category, age
- `CourseDetailScreen.tsx` - Course info, enrollment

**Components**:
- `CourseCard.tsx`
- `CategoryFilter.tsx`
- `AgeRangeSelector.tsx`

**Convex Functions**:
- `convex/courses.ts` - Get courses, filter, search
- `convex/enrollments.ts` - Enroll, track progress

**Commit**: `feat(learning): implement course catalog and enrollment`

---

### **Module 2.3: Course Player & AI Tutor**
**Screen**: `CoursePlayerScreen.tsx`

**Features**:
- Video playback (expo-av)
- Script display with highlighting
- Breakpoint detection
- AI interaction overlay

**Components**:
- `VideoPlayer.tsx`
- `ScriptViewer.tsx`
- `AIInteractionModal.tsx`
- `BreakpointIndicator.tsx`

**Services**:
- `apps/learning/src/services/aiTutor.ts` - AI interaction logic
- `apps/learning/src/services/videoSync.ts` - Timestamp synchronization

**Convex Functions**:
- `convex/aiTutor.ts` - Log interactions, get AI responses
- `convex/lessons.ts` - Get lesson data

**Commit**: `feat(learning): build course player with AI tutor integration`

---

### **Module 2.4: Assessments & Progress Tracking**
**Screens**:
- `AssessmentScreen.tsx` - Take quiz
- `ResultsScreen.tsx` - View results
- `ProgressScreen.tsx` - Overall progress dashboard

**Components**:
- `QuizQuestion.tsx`
- `ProgressBar.tsx`
- `ScoreCard.tsx`
- `CertificateView.tsx`

**Convex Functions**:
- `convex/assessments.ts` - Get assessments, submit answers
- `convex/progress.ts` - Calculate progress, generate certificates

**Commit**: `feat(learning): implement assessments and progress tracking`

---

### **Module 2.5: Leaderboard & Gamification**
**Screen**: `LeaderboardScreen.tsx`

**Components**:
- `LeaderboardList.tsx`
- `RankBadge.tsx`
- `AchievementCard.tsx`

**Convex Functions**:
- `convex/leaderboard.ts` - Get rankings, update scores

**Commit**: `feat(learning): add leaderboard and gamification`

---

## 🤖 **Phase 3: AI Tutor Integration** (Week 5)

### **Module 3.1: AI Service Setup**
**File**: `apps/learning/src/services/aiTutor.ts`

**Integration Options**:
1. **OpenAI API** (for chat completions)
2. **ElevenLabs** (for voice synthesis)
3. **Web Speech API** (for voice recognition)

**Features**:
- Text-to-speech for AI responses
- Speech-to-text for user answers
- Context-aware questioning based on lesson content

**Commit**: `feat(learning): integrate AI tutor service`

---

### **Module 3.2: Interactive Breakpoints**
**Enhancements**:
- Real-time response evaluation
- Adaptive difficulty based on performance
- Hint system with scaffolding

**Convex Functions**:
- `convex/aiTutor.ts` - Process responses, calculate scores

**Commit**: `feat(learning): enhance AI tutor with interactive breakpoints`

---

## 🧪 **Phase 4: Testing & Polish** (Week 6)

### **Module 4.1: Unit & Integration Tests**
**Test Files**:
- `apps/learning/src/**/*.test.tsx`
- `convex/**/*.test.ts`

**Coverage Targets**:
- Components: 80%
- Convex functions: 90%
- Services: 85%

**Commit**: `test(learning): add comprehensive test coverage`

---

### **Module 4.2: UI/UX Polish**
**Tasks**:
- Ensure consistent spacing, typography
- Add loading states, skeletons
- Implement error boundaries
- Add haptic feedback
- Optimize for different screen sizes

**Commit**: `style(learning): polish UI/UX and add responsive design`

---

### **Module 4.3: Performance Optimization**
**Tasks**:
- Implement lazy loading for courses
- Optimize images with expo-image
- Add offline support for downloaded lessons
- Memory management for video playback

**Commit**: `perf(learning): optimize performance and add offline support`

---

## 🚀 **Phase 5: Deployment & Monitoring** (Week 7)

### **Module 5.1: Build Configuration**
**Files**:
- `apps/learning/eas.json` - EAS Build config
- `apps/learning/app.json` - App icons, splash screens

**Commit**: `build(learning): configure EAS Build for iOS and Android`

---

### **Module 5.2: Environment Setup**
**Tasks**:
- Set up production Convex deployment
- Configure AI service API keys
- Set up monitoring (Sentry)
- Add analytics (if needed)

**Commit**: `chore(learning): configure production environment`

---

### **Module 5.3: App Store Submission**
**Tasks**:
- Create app store listings
- Generate screenshots
- Write descriptions
- Submit for review

**Commit**: `release(learning): prepare for app store submission`

---

## 📊 **Module-Based Commit Strategy**

### **Commit Convention**:
```
type(scope): description

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `release`

**Scopes**: `learning`, `convex`, `shared`, `ui`, `mobile`

### **Example Commit Sequence**:
```
1. feat(learning): initialize learning app scaffold
2. feat(convex): add learning app database schema
3. feat(shared): add learning app type definitions
4. feat(learning): setup app configuration and state management
5. feat(learning): integrate theme system
6. feat(learning): implement navigation structure
7. feat(learning): add authentication and kid profile management
8. feat(learning): implement course catalog and enrollment
9. feat(learning): build course player with AI tutor integration
10. feat(learning): implement assessments and progress tracking
11. feat(learning): add leaderboard and gamification
12. feat(learning): integrate AI tutor service
13. feat(learning): enhance AI tutor with interactive breakpoints
14. test(learning): add comprehensive test coverage
15. style(learning): polish UI/UX and add responsive design
16. perf(learning): optimize performance and add offline support
17. build(learning): configure EAS Build for iOS and Android
18. chore(learning): configure production environment
19. release(learning): prepare for app store submission
```

---

## ✅ **Verification Checklist**

### **After Each Module**:
- [ ] Code compiles without errors
- [ ] TypeScript strict mode passes
- [ ] ESLint passes
- [ ] Tests pass (if applicable)
- [ ] Manual testing on device/simulator
- [ ] Convex functions deployed and tested
- [ ] Git commit with proper message

### **Phase Completion Criteria**:
- **Phase 0**: Schema deployed, types available, scaffold created
- **Phase 1**: App runs, navigation works, theme applied
- **Phase 2**: All core screens functional, data flows correctly
- **Phase 3**: AI tutor interacts, responses logged
- **Phase 4**: Tests passing, UI polished, performant
- **Phase 5**: Builds successful, ready for store submission

---

## 🎯 **Success Metrics**

1. **Technical**:
   - 90%+ test coverage
   - < 2s screen load times
   - Zero critical bugs
   - Successful App Store approval

2. **User Experience**:
   - Intuitive navigation
   - Engaging AI interactions
   - Clear progress tracking
   - Responsive design

3. **Business**:
   - Multi-kid support working
   - Course completion tracking
   - Leaderboard engagement
   - Assessment validity

---

## 🔄 **Next Steps**

Would you like me to:
1. **Start implementation** with Phase 0 (Foundation & Setup)?
2. **Modify the plan** based on your priorities?
3. **Focus on specific modules** first?
4. **Add additional features** not covered?

This plan provides a clear, step-by-step roadmap with verifiable milestones and module-based commits for easy tracking and rollback if needed.
