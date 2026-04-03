import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const seedLearningData = mutation({
  handler: async (ctx) => {
    // 1. Seed Course Categories
    const categories = [
      {
        name: 'Computer Science',
        description: 'Prepare for the future with fundamental and advanced computing concepts.',
        icon: 'cpu',
        color: '#4F46E5', // Indigo
        order: 1,
        ageRange: { min: 13, max: 18 },
        isActive: true,
      },
      {
        name: 'Mathematics',
        description: 'Level up your thinking with structured problem solving and logic.',
        icon: 'calculator',
        color: '#059669', // Emerald
        order: 2,
        ageRange: { min: 7, max: 18 },
        isActive: true,
      },
      {
        name: 'Programming',
        description: 'Learn logic and creativity by building your own apps and games.',
        icon: 'code',
        color: '#EA580C', // Orange
        order: 3,
        ageRange: { min: 10, max: 18 },
        isActive: true,
      },
      {
        name: 'Robotics',
        description: 'Where hardware meets software to bring machines to life.',
        icon: 'settings',
        color: '#7C3AED', // Violet
        order: 4,
        ageRange: { min: 11, max: 18 },
        isActive: true,
      },
    ];

    const categoryIds: Record<string, any> = {};
    const now = new Date().toISOString();

    for (const cat of categories) {
      const existing = await ctx.db
        .query('courseCategories')
        .withIndex('by_order', (q) => q.eq('order', cat.order))
        .first();

      if (!existing) {
        const id = await ctx.db.insert('courseCategories', {
          ...cat,
          createdAt: now,
        });
        categoryIds[cat.name] = id;
      } else {
        categoryIds[cat.name] = existing._id;
      }
    }

    // 2. Seed IGCSE Computer Science Course
    const igcseCsCourse = {
      categoryId: categoryIds['Computer Science'],
      title: 'IGCSE Computer Science (0478)',
      description: 'The complete syllabus for Cambridge IGCSE Computer Science, covering data representation, communication, hardware, software, and more.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
      script: 'Welcome to IGCSE Computer Science. In this course, we will explore how computers store data, communicate, and solve complex problems.',
      duration: 120,
      ageRange: { min: 14, max: 16 },
      difficulty: 'intermediate' as const,
      language: 'English',
      tags: ['IGCSE', 'Computer Science', 'Cambridge', '0478'],
      learningObjectives: [
        'Understand binary and hexadecimal number systems',
        'Demonstrate understanding of logic gates and truth tables',
        'Explain the role of operating systems and CPU architecture',
        'Develop problem-solving and programming skills',
      ],
      status: 'published' as const,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const allCourses = await ctx.db.query('courses').collect();
    const existingCourse = allCourses.find((c) => c.title === igcseCsCourse.title);

    let courseId;
    if (!existingCourse) {
      courseId = await ctx.db.insert('courses', igcseCsCourse);
    } else {
      courseId = existingCourse._id;
    }

    // 3. Seed some preliminary lessons for the IGCSE CS course
    const lessons = [
      {
        courseId,
        title: 'Binary Number Systems',
        description: 'How computers use zeros and ones to represent anything.',
        sequenceOrder: 1,
        script: 'Deep within every digital device, there is a complex world of electrical signals. These signals are either ON or OFF. This is why we use binary.',
        duration: 15,
        status: 'published' as const,
        breakpoints: [
          {
            timestamp: 60,
            type: 'question' as const,
            content: 'What is the base of the binary number system?',
            correctAnswer: '2',
            options: ['2', '10', '16', '8'],
            points: 10,
          },
          {
            timestamp: 180,
            type: 'summary' as const,
            content: 'So, every digit in binary represents a power of 2, starting from 2 to the power of 0.',
          },
        ],
        createdAt: now,
      },
      {
        courseId,
        title: 'Hexadecimal Representation',
        description: 'Why we use base 16 and how to convert it to binary and denary.',
        sequenceOrder: 2,
        script: 'Hexadecimal numbers are much easier for humans to read than long strings of binary. Let’s learn how to convert between them.',
        duration: 20,
        status: 'published' as const,
        breakpoints: [
          {
            timestamp: 120,
            type: 'question' as const,
            content: 'What hexadecimal digit represents the denary value 10?',
            correctAnswer: 'A',
            options: ['A', 'F', 'C', 'B'],
            points: 15,
          },
        ],
        createdAt: now,
      },
    ];

    for (const lesson of lessons) {
      const existingLesson = await ctx.db
        .query('lessons')
        .withIndex('by_sequence', (q) => q.eq('courseId', courseId).eq('sequenceOrder', lesson.sequenceOrder))
        .first();

      if (!existingLesson) {
        await ctx.db.insert('lessons', lesson);
      }
    }

    // 4. Seed an assessment for the course
    const assessment = {
      courseId,
      title: 'Data Representation Quiz',
      description: 'Test your knowledge on Binary, Hexadecimal, and Data Storage.',
      type: 'quiz' as const,
      passingScore: 70,
      timeLimit: 15,
      questions: [
        {
          id: 'q1',
          question: 'What is the binary equivalent of the denary number 13?',
          type: 'multiple_choice' as const,
          options: ['1101', '1011', '1110', '1010'],
          correctAnswer: '1101',
          points: 5,
        },
        {
          id: 'q2',
          question: 'Hexadecimal is base 16.',
          type: 'true_false' as const,
          correctAnswer: 'true',
          points: 5,
        },
      ],
      totalPoints: 10,
      shuffleQuestions: true,
      shuffleOptions: true,
      status: 'published' as const,
      createdAt: now,
      updatedAt: now,
    };

    const existingAssessment = await ctx.db
      .query('assessments')
      .withIndex('by_course', (q) => q.eq('courseId', courseId))
      .first();

    if (!existingAssessment) {
      await ctx.db.insert('assessments', assessment);
    }

    return {
      message: 'Learning data seeded successfully',
      categoryIdCount: Object.keys(categoryIds).length,
      courseCreated: !existingCourse,
    };
  },
});
