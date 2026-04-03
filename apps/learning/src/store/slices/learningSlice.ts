import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types locally to avoid dependency issues
export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type CourseStatus = 'draft' | 'published' | 'archived';

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
    difficulty: CourseDifficulty;
    language: string;
    tags: string[];
    learningObjectives: string[];
    prerequisites?: string[];
    status: CourseStatus;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CourseCategory {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    order: number;
    ageRange: { min: number; max: number };
    isActive: boolean;
    createdAt: string;
}

export interface CompletedLesson {
    lessonId: string;
    completedAt: string;
    score?: number;
}

export interface CourseEnrollment {
    id: string;
    userId: string;
    kidProfileId: string;
    courseId: string;
    progress: number;
    currentLessonIndex: number;
    completedLessons: CompletedLesson[];
    totalScore?: number;
    enrolledAt: string;
    completedAt?: string;
    lastAccessedAt?: string;
}

export type BreakpointType = 'question' | 'hint' | 'summary' | 'activity';

export interface LessonBreakpoint {
    timestamp: number;
    type: BreakpointType;
    content: string;
    correctAnswer?: string;
    options?: string[];
    points?: number;
}

export type LessonStatus = 'draft' | 'published' | 'archived';

export interface Lesson {
    id: string;
    courseId: string;
    title: string;
    description?: string;
    sequenceOrder: number;
    videoUrl?: string;
    script: string;
    breakpoints: LessonBreakpoint[];
    duration: number;
    learningObjectives?: string[];
    status: LessonStatus;
    createdAt: string;
}

export interface LearningProgress {
    enrolledCourses: number;
    completedCourses: number;
    totalLessons: number;
    completedLessons: number;
    totalScore: number;
    averageScore: number;
    currentStreak: number;
    longestStreak: number;
    achievementsEarned: number;
    timeSpentMinutes: number;
}

interface LearningState {
    // Courses
    courses: Course[];
    categories: CourseCategory[];
    selectedCourse: Course | null;

    // Enrollments
    enrollments: CourseEnrollment[];
    currentEnrollment: CourseEnrollment | null;

    // Lessons
    currentLesson: Lesson | null;
    currentLessonIndex: number;
    isPlaying: boolean;
    currentTime: number; // Current video timestamp in seconds

    // Progress
    progress: LearningProgress | null;
    isLoadingProgress: boolean;

    // UI State
    isLoadingCourses: boolean;
    isLoadingEnrollments: boolean;
    isEnrolling: boolean;
    error: string | null;

    // Filters
    filters: {
        categoryId?: string;
        difficulty?: ('beginner' | 'intermediate' | 'advanced')[];
        ageRange?: { min?: number; max?: number };
        search?: string;
    };
}

const initialState: LearningState = {
    courses: [],
    categories: [],
    selectedCourse: null,
    enrollments: [],
    currentEnrollment: null,
    currentLesson: null,
    currentLessonIndex: 0,
    isPlaying: false,
    currentTime: 0,
    progress: null,
    isLoadingProgress: false,
    isLoadingCourses: false,
    isLoadingEnrollments: false,
    isEnrolling: false,
    error: null,
    filters: {},
};

const learningSlice = createSlice({
    name: 'learning',
    initialState,
    reducers: {
        // Course actions
        setCourses: (state, action: PayloadAction<Course[]>) => {
            state.courses = action.payload;
            state.isLoadingCourses = false;
        },
        setCategories: (state, action: PayloadAction<CourseCategory[]>) => {
            state.categories = action.payload;
        },
        setSelectedCourse: (state, action: PayloadAction<Course | null>) => {
            state.selectedCourse = action.payload;
        },
        setLoadingCourses: (state, action: PayloadAction<boolean>) => {
            state.isLoadingCourses = action.payload;
        },

        // Enrollment actions
        setEnrollments: (state, action: PayloadAction<CourseEnrollment[]>) => {
            state.enrollments = action.payload;
            state.isLoadingEnrollments = false;
        },
        setCurrentEnrollment: (state, action: PayloadAction<CourseEnrollment | null>) => {
            state.currentEnrollment = action.payload;
        },
        addEnrollment: (state, action: PayloadAction<CourseEnrollment>) => {
            state.enrollments.push(action.payload);
        },
        updateEnrollmentProgress: (state, action: PayloadAction<{ enrollmentId: string; progress: number; currentLessonIndex: number }>) => {
            const { enrollmentId, progress, currentLessonIndex } = action.payload;
            const enrollment = state.enrollments.find(e => e.id === enrollmentId);
            if (enrollment) {
                enrollment.progress = progress;
                enrollment.currentLessonIndex = currentLessonIndex;
            }
            if (state.currentEnrollment?.id === enrollmentId) {
                state.currentEnrollment.progress = progress;
                state.currentEnrollment.currentLessonIndex = currentLessonIndex;
            }
        },
        setLoadingEnrollments: (state, action: PayloadAction<boolean>) => {
            state.isLoadingEnrollments = action.payload;
        },
        setEnrolling: (state, action: PayloadAction<boolean>) => {
            state.isEnrolling = action.payload;
        },

        // Lesson actions
        setCurrentLesson: (state, action: PayloadAction<Lesson | null>) => {
            state.currentLesson = action.payload;
            state.currentTime = 0;
            state.isPlaying = false;
        },
        setCurrentLessonIndex: (state, action: PayloadAction<number>) => {
            state.currentLessonIndex = action.payload;
        },
        setIsPlaying: (state, action: PayloadAction<boolean>) => {
            state.isPlaying = action.payload;
        },
        setCurrentTime: (state, action: PayloadAction<number>) => {
            state.currentTime = action.payload;
        },
        completeLesson: (state, action: PayloadAction<{ lessonId: string; score?: number }>) => {
            const { lessonId, score } = action.payload;
            if (state.currentEnrollment) {
                const completedLesson = state.currentEnrollment.completedLessons.find(
                    (l: CompletedLesson) => l.lessonId === lessonId
                );
                if (!completedLesson) {
                    state.currentEnrollment.completedLessons.push({
                        lessonId,
                        completedAt: new Date().toISOString(),
                        score,
                    });
                }
            }
        },

        // Progress actions
        setProgress: (state, action: PayloadAction<LearningProgress | null>) => {
            state.progress = action.payload;
            state.isLoadingProgress = false;
        },
        setLoadingProgress: (state, action: PayloadAction<boolean>) => {
            state.isLoadingProgress = action.payload;
        },
        updateProgress: (state, action: PayloadAction<Partial<LearningProgress>>) => {
            if (state.progress) {
                Object.assign(state.progress, action.payload);
            }
        },

        // Filter actions
        setFilters: (state, action: PayloadAction<LearningState['filters']>) => {
            state.filters = action.payload;
        },
        setFilter: <K extends keyof LearningState['filters']>(state: LearningState, action: PayloadAction<{ key: K; value: LearningState['filters'][K] }>) => {
            (state.filters as any)[action.payload.key] = action.payload.value;
        },
        clearFilters: (state) => {
            state.filters = {};
        },

        // Error actions
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },

        // Reset
        resetLearningState: () => initialState,
    },
});

export const {
    // Course actions
    setCourses,
    setCategories,
    setSelectedCourse,
    setLoadingCourses,

    // Enrollment actions
    setEnrollments,
    setCurrentEnrollment,
    addEnrollment,
    updateEnrollmentProgress,
    setLoadingEnrollments,
    setEnrolling,

    // Lesson actions
    setCurrentLesson,
    setCurrentLessonIndex,
    setIsPlaying,
    setCurrentTime,
    completeLesson,

    // Progress actions
    setProgress,
    setLoadingProgress,
    updateProgress,

    // Filter actions
    setFilters,
    setFilter,
    clearFilters,

    // Error actions
    setError,
    clearError,

    // Reset
    resetLearningState,
} = learningSlice.actions;

export default learningSlice.reducer;