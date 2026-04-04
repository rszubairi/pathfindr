import { mutation } from "./_generated/server";

export const seedStudents = mutation({
  args: {},
  handler: async (ctx) => {
    const studentNames = [
      "Liam", "Emma", "Noah", "Olivia", "William", "Ava", "James", "Isabella", "Oliver", "Sophia",
      "Ahmed", "Fatima", "Ayaan", "Zoya", "Omar", "Sara", "Zaid", "Hana", "Mustafa", "Noor",
      "Chidi", "Amara", "Kojo", "Efua", "Chen", "Meilin", "Hiroshi", "Yuki", "Hans", "Greta"
    ];

    const countries = ["US", "GB", "AE", "SA", "PK", "IN", "MY", "NG", "CN", "JP", "DE"];

    for (let i = 0; i < studentNames.length; i++) {
        const name = studentNames[i];
        const country = countries[Math.floor(Math.random() * countries.length)];
        const dummyUserEmail = `student_p_${i}_${Math.floor(Math.random()*1000)}@example.com`;
        
        // Create fake user (parent)
        const userId = await ctx.db.insert("users", {
            fullName: `${name}'s Parent`,
            email: dummyUserEmail,
            phone: "+123456789",
            role: "student",
            passwordHash: "fake_hash",
            emailVerified: true,
            profileCompleted: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        // Create academic profile for country
        await ctx.db.insert("academicProfiles", {
            userId,
            country: country === "US" ? "United States" : country === "AE" ? "United Arab Emirates" : "Other",
            countryCode: country,
            education: [],
            testScores: {},
            certificates: [],
            projects: [],
            skills: [],
            languages: [],
            extracurriculars: [],
            profileStatus: "verified",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        // Create kid profile
        const kidProfileId = await ctx.db.insert("kidProfiles", {
            userId,
            name: name,
            dateOfBirth: "2015-01-01",
            grade: "Year 5",
            avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        // Some get leaderboard scores
        if (Math.random() > 0.4) {
            await ctx.db.insert("leaderboard", {
                userId,
                kidProfileId,
                courseId: "ka59exf2pt1wzsmc26c6hpsj0h6m7erq" as any, 
                totalScore: 500 + Math.floor(Math.random() * 5000),
                completedAssessments: 1 + Math.floor(Math.random() * 10),
                averageScore: 70 + Math.floor(Math.random() * 25),
                rank: i + 1,
                streak: Math.floor(Math.random() * 10),
                lastActivityAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }
    }
    
    return "Seeded students successfully!";
  },
});
