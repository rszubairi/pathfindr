import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        scholarships: 'Scholarships',
        boardingschools: 'Boarding Schools',
        internationalschools: 'International Schools',
        internships: 'Internships',
        pricing: 'Pricing',
        features: 'Features',
        about: 'About',
        signIn: 'Sign In',
        getStarted: 'Get Started',
      },
      hero: {
        badge: 'Discover Your Global Educational Journey',
        titlePart1: 'Find Your Perfect ',
        titlePart2: 'Scholarship',
        subtitle: 'Connect with thousands of scholarships, boarding schools, international schools, and internships across Southeast Asia and beyond. Your future starts here.',
        browseBtn: 'Browse Scholarships',
        learnMoreBtn: 'Learn More',
        trustedBy: 'Trusted by 5,000+ students',
        available: '10,000+ scholarships available',
        countriesCount: '50+ countries',
      },
      home: {
        stats: {
          scholarships: { label: 'Scholarships Available', desc: 'Diverse opportunities across all fields' },
          countries: { label: 'Countries', desc: 'Global reach across Southeast Asia and beyond' },
          students: { label: 'Students Helped', desc: 'Success stories from our community' },
          awarded: { label: 'Scholarships Awarded', desc: 'Total value facilitated through our platform' },
        },
        howItWorks: {
          title: 'How Pathfindr Works',
          subtitle: 'Your journey to a global education starts here. Follow these simple steps to find and secure your perfect scholarship.',
          steps: {
            step1: { title: 'Create Your Profile', desc: 'Sign up and tell us about your academic background, interests, and goals.' },
            step2: { title: 'Discover Opportunities', desc: 'Browse through thousands of scholarships using our smart filters.' },
            step3: { title: 'Apply with Confidence', desc: 'Track your applications, manage deadlines, and access helpful resources.' },
            step4: { title: 'Achieve Your Dreams', desc: 'Secure your scholarship and embark on your educational journey.' },
          }
        },
        features: {
          title: 'Everything You Need to Succeed',
          subtitle: 'Pathfindr provides powerful tools and resources to help you discover and secure your perfect scholarship opportunity.',
          list: {
            smartSearch: { title: 'Smart Search', desc: 'Advanced filters to find scholarships that match your profile.' },
            personalized: { title: 'Personalized Matching', desc: 'AI-powered recommendations based on your goals.' },
            global: { title: 'Global Opportunities', desc: 'Access scholarships from 50+ countries.' },
            verified: { title: 'Verified Listings', desc: 'All scholarships are verified for accuracy.' },
            tracking: { title: 'Application Tracking', desc: 'Keep track of your applications in one dashboard.' },
            secure: { title: 'Secure & Private', desc: 'Your personal information is protected.' },
          },
          detailed: [
            {
              title: 'Advanced Search & Filters',
              description: "Find exactly what you're looking for with powerful search capabilities and smart filters. Filter by country, field of study, value, and provider type.",
              benefits: [
                'Multi-criteria filtering',
                'Instant search results',
                'Saved search preferences',
              ],
            },
            {
              title: 'AI-Powered Matching',
              description: 'Our intelligent matching algorithm analyzes your profile to recommend opportunities with the highest success probability.',
              benefits: [
                'Personalized recommendations',
                'Match score for each scholarship',
                'Smart priority ranking',
              ],
            },
            {
              title: 'Real-Time Notifications',
              description: 'Never miss a deadline. Get instant notifications for new scholarships matching your profile and upcoming deadlines.',
              benefits: [
                'Customizable preferences',
                'Deadline reminders',
                'Status change alerts',
              ],
            },
          ]
        },
        featured: {
          title: 'Featured Scholarships',
          subtitle: 'Explore our top scholarship opportunities currently accepting applications.',
          viewAll: 'View All Scholarships',
        },
        testimonials: {
          title: 'Success Stories from Our Students',
          subtitle: 'Join thousands of students who have found their perfect scholarship through Pathfindr.',
          list: [
            {
              quote: "Pathfindr made finding the right scholarship so much easier. The personalized matching feature connected me with opportunities I didn't even know existed. Now I'm studying Computer Science at NUS!",
              university: 'National University of Singapore',
              country: 'Singapore',
            },
            {
              quote: "I was overwhelmed by the number of scholarships available until I found Pathfindr. The platform's smart filters and deadline tracking helped me stay organized and ultimately win a full scholarship to study Engineering.",
              university: 'University of Melbourne',
              country: 'Australia',
            },
            {
              quote: "As a first-generation college student, navigating scholarship applications was daunting. Pathfindr's verified listings and application tracking gave me the confidence to pursue my dreams. I'm now studying Medicine in Bangkok!",
              university: 'Chulalongkorn University',
              country: 'Thailand',
            },
          ]
        },
        cta: {
          title: 'Ready to Start Your Journey?',
          subtitle: 'Create your profile today and unlock access to thousands of opportunities. Join our community of successful students achieving their dreams.',
          createAccount: 'Create Free Account',
          browseScholarships: 'Browse Scholarships',
        }
      },
      pricing: {
        title: 'Choose your plan',
        subtitle: 'Subscribe to start applying for scholarships. Pick the plan that fits your needs and unlock your path to educational opportunities.',
        mostPopular: 'Most Popular',
        currentPlan: 'Current Plan',
        getStarted: 'Get {{name}}',
        appsPerYear: '{{count}} scholarship applications per year',
        whatsIncluded: "What's included:",
        tiers: {
          pro: {
            name: 'Pro',
            features: [
              'Apply to 5 scholarships per year',
              'Full scholarship details & eligibility',
              'Application tracking dashboard',
              'Email notifications for deadlines',
            ]
          },
          expert: {
            name: 'Expert',
            features: [
              'Apply to 20 scholarships per year',
              'Full scholarship details & eligibility',
              'Application tracking dashboard',
              'Email notifications for deadlines',
              'Priority support',
              'Scholarship match recommendations',
            ]
          }
        },
        faq: {
          title: 'Frequently asked questions',
          q1: {
            q: 'What counts as an application?',
            a: 'Each time you click "Apply Now" on a scholarship and are redirected to the scholarship provider\'s application page, it counts as one application.'
          },
          q2: {
            q: 'When does my application limit reset?',
            a: 'Your application count resets annually when your subscription renews.'
          },
          q3: {
            q: 'Can I upgrade my plan?',
            a: 'Yes! You can upgrade from Pro to Expert at any time. The price difference will be prorated for the remainder of your billing period.'
          },
          q4: {
            q: 'Can I cancel anytime?',
            a: "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period."
          }
        }
      },
      profile: {
        complete: {
          title: 'Complete Your Academic Profile',
          subtitle: 'Help us match you with the best scholarships',
        },
        steps: {
          personalDetails: 'Personal Details',
          education: 'Education',
          testScores: 'Test Scores',
          achievements: 'Achievements',
          preferences: 'Preferences',
          activities: 'Activities',
        },
        forms: {
          common: {
            back: 'Back',
            next: 'Next',
            required: 'required',
            select: 'Select',
            add: 'Add',
            delete: 'Delete',
            other: 'Other',
            saveProgress: 'Saving progress...',
          },
          personalDetails: {
            title: 'Personal Details',
            subtitle: "Let's start with some basic information about you",
            dateOfBirth: 'Date of Birth',
            gender: {
              label: 'Gender',
              placeholder: 'Select gender',
              male: 'Male',
              female: 'Female',
              other: 'Other',
              preferNotToSay: 'Prefer not to say',
            },
            nationality: {
              label: 'Nationality',
              placeholder: 'e.g., Malaysian, British',
            },
            country: {
              label: 'Country of Residence',
              placeholder: 'e.g., Malaysia, United Kingdom',
            },
          },
          education: {
            title: 'Education History',
            subtitle: 'Add your academic qualifications (most recent first)',
            entry: 'Education {{index}}',
            addAnother: 'Add Another Education',
            institution: {
              label: 'Institution Name',
              placeholder: 'e.g., Universiti Malaya',
            },
            qualification: {
              label: 'Qualification',
              placeholder: 'Select qualification',
            },
            fieldOfStudy: {
              label: 'Field of Study',
              placeholder: 'e.g., Computer Science',
            },
            startDate: 'Start Date',
            endDate: {
              label: 'End Date',
              helper: 'Leave empty if currently studying',
            },
            grade: {
              label: 'Grade',
              placeholder: 'e.g., First Class, A+, Distinction',
            },
            gpa: {
              label: 'GPA (out of 4.0)',
              placeholder: 'e.g., 3.8',
            },
            qualifications: {
              highSchool: 'High School Diploma',
              associate: 'Associate Degree',
              bachelorArts: 'Bachelor of Arts',
              bachelorScience: 'Bachelor of Science',
              bachelorEng: 'Bachelor of Engineering',
              masterArts: 'Master of Arts',
              masterScience: 'Master of Science',
              mba: 'MBA',
              phd: 'PhD',
            },
          },
          testScores: {
            title: 'Standardized Test Scores',
            subtitle: 'Add scores for any tests you\'ve taken. All fields are optional — only fill in tests you\'ve completed.',
            sat: { label: 'SAT Score', placeholder: 'e.g., 1450', helper: 'Total score (400–1600)' },
            ielts: { label: 'IELTS Score', placeholder: 'e.g., 7.5', helper: 'Overall band score (0–9)' },
            toefl: { label: 'TOEFL Score', placeholder: 'e.g., 105', helper: 'Total score (0–120)' },
            gre: { label: 'GRE Score', placeholder: 'e.g., 325', helper: 'Verbal + Quant combined (260–340)' },
            gmat: { label: 'GMAT Score', placeholder: 'e.g., 720', helper: 'Total score (200–800)' },
          },
          achievements: {
            title: 'Achievements & Skills',
            subtitle: 'Showcase your certificates, projects, and skills. All sections are optional.',
            certificates: {
              title: 'Certificates',
              entry: 'Certificate {{index}}',
              addAnother: 'Add Certificate',
              itemTitle: 'Certificate Title',
              issuer: 'Issuer',
              dateIssued: 'Date Issued',
              placeholder: 'e.g., AWS Solutions Architect',
            },
            projects: {
              title: 'Academic / Personal Projects',
              entry: 'Project {{index}}',
              addAnother: 'Add Project',
              itemTitle: 'Project Title',
              description: 'Description',
              technologies: 'Technologies',
              startDate: 'Start Date',
              endDate: 'End Date',
              placeholder: 'e.g., AI-Powered Scholarship Matcher',
              descPlaceholder: 'Briefly describe the project and your role',
            },
            skills: {
              title: 'Skills',
              placeholder: 'Type a skill and press Enter (e.g., Python, Leadership)',
            },
          },
          preferences: {
            title: 'Career Preferences',
            subtitle: 'Tell us about your interests so we can match you with the right scholarships',
            interests: {
              label: 'Interests',
              placeholder: 'e.g., Technology, Healthcare, Education',
            },
            studyCountries: {
              label: 'Preferred Study Countries',
              placeholder: 'e.g., United States, United Kingdom, Germany',
            },
            availability: {
              label: 'When are you planning to start?',
              placeholder: 'e.g., Fall 2026, January 2027, Immediately',
            },
            complete: 'Complete Profile',
            saving: 'Saving profile...',
          },
        },
      },
      footer: {
        description: 'Your path to global educational opportunities. Connect with scholarships, boarding schools, international schools, and internships across Southeast Asia and beyond.',
        platform: 'Platform',
        resources: 'Resources',
        connect: 'Connect',
        links: {
          universities: 'Universities',
          internships: 'Internships',
          jobs: 'Jobs',
          knowledgeBase: 'Knowledge Base',
          privacyPolicy: 'Privacy Policy',
          termsOfService: 'Terms of Service',
        },
        allRightsReserved: 'All rights reserved.',
        madeWith: 'Made with',
        inSEA: 'in Southeast Asia',
      },
      internationalSchools: {
        title: 'International Schools',
        subtitle: 'Explore {{total}} top international schools across Malaysia, Indonesia, and China. Compare curricula, fees, and find the perfect school for your education journey.',
        schoolsCount: '{{count}} schools',
        search: {
          placeholder: 'Search schools by name, e.g. ISKL, Dulwich, JIS...',
        },
        sort: {
          label: 'Sort by:',
          name: 'Name',
          country: 'Country',
          city: 'City',
        },
        results: {
          school: '{{count}} school found',
          schools: '{{count}} schools found',
        },
        empty: {
          title: 'No schools found',
          description: "We couldn't find any international schools matching your criteria. Try adjusting your filters or search query.",
          clearAll: 'Clear All Filters',
        },
        filters: {
          title: 'Filters',
          clearAll: 'Clear all',
          clearAllBtn: 'Clear All Filters',
          country: 'Country',
          curriculum: 'Curriculum',
        },
        location: {
          title: 'Your Location',
          locating: 'Locating...',
          useCurrent: 'Use My Location',
          or: 'or',
          selectCity: 'Select a city',
          distance: 'Distance',
        },
        card: {
          fees: 'Fees:',
          visitWebsite: 'Visit Website',
        },
        pagination: {
          previous: 'Previous',
          next: 'Next',
        },
        mobile: {
          filters: 'Filters',
          showResults: 'Show {{count}} Results',
        },
      },
      profileView: {
        title: 'My Profile',
        editProfile: 'Edit Profile',
        notFound: 'Profile Not Found',
        notFoundDesc: "You haven't completed your profile yet. Complete it to view your profile here.",
        completeProfileBtn: 'Complete Profile',
        resumeOptimizer: {
          title: 'Resume Optimizer',
          score: 'Profile Score',
          scoreLabel: 'Score',
          ranking: 'Ranking',
          generateBtn: 'Generate Optimized Resume',
          suggestions: 'Suggestions for Improvement',
          copyLink: 'Copy Shareable Link',
          viewPublic: 'View Public Resume',
          copySuccess: 'Shareable link copied to clipboard!',
          perfectProfile: 'Your profile is perfect! You are ready to generate your optimized resume.',
          aiDescription: 'Our AI-driven system formats your profile into a professional, recruiter-ready resume.',
          previewTitle: 'Resume Preview',
          printBtn: 'Print / Save as PDF',
          footer: 'Generated by PathFindr Optimized Resume Engine',
          percentageComplete: '{{progress}}% Complete',
          levels: {
            needsImprovement: 'Needs Improvement',
            goodProgress: 'Good Progress',
            professional: 'Professional',
            elite: 'Elite',
          },
          descriptions: {
            needsImprovement: 'Your profile needs more details to stand out.',
            goodProgress: 'You are building a solid foundation.',
            professional: 'You are ready for most career opportunities.',
            elite: 'Your profile is highly competitive for top-tier hiring.',
          },
          suggestionsList: {
            phone: 'Add your phone number for recruiters.',
            gpa: 'Include your GPA or grades to showcase academic excellence.',
            education: 'List your educational background.',
            skills: 'Add more industry-relevant skills (aim for at least 8).',
            skillsBasic: 'Showcase your technical and professional skills.',
            projectDetail: 'Write more detailed descriptions for your projects.',
            projectDetailBasic: 'Detail academic or personal projects to demonstrate practical experience.',
            certificates: 'Add certifications to validate your expertise.',
            subjectScores: 'Add your IGCSE, SPM, or O-Level subject results to strengthen your academic profile.',
          },
          sections: {
            education: 'Education',
            projects: 'Key Projects',
            expertise: 'Expertise',
            certificates: 'Certificates',
            testScores: 'Test Scores',
          },
          placeholders: {
            noEducation: 'No education entries added. Recruiters prioritize academic background.',
            noProjects: 'Add relevant projects to demonstrate practical application of your skills.',
            noSkills: 'List your core technical and soft skills.',
            noCertificates: 'Showcase your formal certifications and continuous learning.',
            noTestScores: 'Standardized scores (SAT, IELTS, etc.) add weight to your academic standing.',
          }
        },
        common: {
          in: 'in',
          score: 'Score',
        },
        sections: {
          personal: 'Personal Details',
          education: 'Education',
          testScores: 'Test Scores',
          certificates: 'Certificates',
          projects: 'Projects',
          skills: 'Skills',
          interests: 'Interests',
          preferences: 'Preferences',
          activities: 'Extracurricular Activities',
        },
        fields: {
          dob: 'Date of Birth',
          gender: 'Gender',
          nationality: 'Nationality',
          country: 'Country',
          phone: 'Phone',
          gpa: 'GPA',
          grade: 'Grade',
          present: 'Present',
          preferredCountries: 'Preferred Countries',
          availability: 'Availability',
        }
      },
      referral: {
        title: 'Referral Programme',
        code: {
          label: 'Your referral code',
          copy: 'Copy code',
          copyLink: 'Copy share link',
          description: 'Share this code or link with friends to earn rewards',
        },
        progress: {
          title: 'Referral Progress',
          count: '{{count}}/5 friends',
          earned: 'You just earned a reward!',
          inviteToEarn: 'Invite 5 friends to earn a free Pro subscription',
          moreNeeded: '{{count}} more friend to earn a free Pro subscription',
          moreNeeded_plural: '{{count}} more friends to earn a free Pro subscription',
          stats: {
            friendsReferred: 'Friends Referred',
            rewardsEarned: 'Rewards Earned',
          }
        },
        rewards: {
          title: 'Your Rewards',
          proSubscription: 'Pro Subscription',
          coupon: 'Coupon: ',
          copyCoupon: 'Copy coupon code',
          status: {
            active: 'Active',
            available: 'Available',
            claimed: 'Claimed'
          }
        },
        claim: {
          success: {
            title: 'Subscription Activated!',
            description: 'Your free Pro subscription is now active, thanks to {{name}}.',
            nextSteps: 'You can now start applying for scholarships.',
            browseBtn: 'Browse Scholarships',
            viewSubBtn: 'View Subscription',
          },
          validating: 'Validating coupon code...',
          error: {
            notAvailable: 'Coupon Not Available',
            invalidOrClaimed: 'This referral coupon code is either invalid or has already been claimed.',
            viewPricing: 'View Pricing Plans',
            studentRequired: 'Student Account Required',
            studentRequiredDesc: 'Referral coupons are available only for student accounts.',
            goToDashboard: 'Go to Dashboard',
            alreadySubscribed: 'You Already Have a Subscription',
            alreadySubscribedDesc: 'Your account already has an active subscription. This coupon can be used by students without a subscription.',
            manageSub: 'Manage Subscription',
            generic: 'Failed to claim coupon. Please try again.',
          },
          gift: {
            title: 'Free Pro Subscription!',
            subtitle: '{{name}} is sharing a referral reward with you.',
            instruction: 'Register or log in to claim your free Pro subscription.',
            registerBtn: 'Register to Claim',
            loginBtn: 'Log In to Claim',
            claimTitle: 'Claim Your Free Pro Subscription',
            sharedBy: '{{name}} earned this reward through the referral programme and is sharing it with you!',
            fullAccess: 'This gives you full access to apply for scholarships for one year.',
            planFree: 'Pro Plan — Free for 1 Year',
            normalPrice: 'Normally $9.99/year — Gifted by {{name}}',
            claimBtn: 'Claim Free Subscription'
          }
        }
      },
      sponsorship: {
        claim: {
          success: {
            title: 'Subscription Activated!',
            description: 'Your {{tier}} subscription is now active, sponsored by {{company}}.',
            nextSteps: 'You can now start applying for scholarships.',
            browseBtn: 'Browse Scholarships',
            viewSubBtn: 'View Subscription',
          },
          validating: 'Validating coupon code...',
          error: {
            notAvailable: 'Coupon No Longer Available',
            invalidOrExhausted: 'This coupon code is either invalid or all sponsored subscriptions have been claimed.',
            viewPricing: 'View Pricing Plans',
            studentRequired: 'Student Account Required',
            studentRequiredDesc: 'Sponsored subscriptions are available only for student accounts.',
            goToDashboard: 'Go to Dashboard',
            alreadySubscribed: 'You Already Have a Subscription',
            alreadySubscribedDesc: 'Your account already has an active subscription. This coupon can be used by students without a subscription.',
            manageSub: 'Manage Subscription',
            generic: 'Failed to claim subscription. Please try again.',
          },
          gift: {
            title: 'Free Subscription Available!',
            subtitle: '{{company}} is sponsoring {{tier}} subscriptions for students.',
            instruction: 'Register or log in to claim your free subscription.',
            registerBtn: 'Register to Claim',
            loginBtn: 'Log In to Claim',
            claimTitle: 'Claim Your Free Subscription',
            sharedBy: '{{company}} is sponsoring your {{tier}} subscription!',
            fullAccess: 'This gives you full access to apply for scholarships for one year.',
            planFree: '{{tier}} Plan — Free for 1 Year',
            normalPrice: 'Normally ${{price}}/year — Waived by {{company}}',
            claimBtn: 'Claim Free Subscription',
            remainingSlots: '{{count}} sponsored subscription remaining',
            remainingSlots_plural: '{{count}} sponsored subscriptions remaining',
          }
        }
      },
      scholarships: {
        title: 'Find Your Scholarship',
        subtitle: 'Browse through thousands of scholarships from around the world. Use our advanced filters to find opportunities that match your profile.',
        searchPlaceholder: 'Search scholarships by name, provider...',
        sortBy: 'Sort by:',
        sort: {
          relevant: 'Relevant',
          deadline: 'Deadline',
          value: 'Value',
          recent: 'Recent',
        },
        filters: 'Filters',
        showResults: 'Show {{count}} Results',
        previous: 'Previous',
        next: 'Next',
        noResults: 'No scholarships found',
        noResultsDesc: "We couldn't find any scholarships matching your criteria. Try adjusting your filters or search query.",
        clearFilters: 'Clear All Filters',
      },
      boardingSchools: {
        title: 'Boarding Schools',
        subtitle: 'Discover top boarding schools across Southeast Asia. Compare categories, locations, and find the perfect environment for your education.',
        searchPlaceholder: 'Search schools by name...',
        filters: 'Filters',
        noResults: 'No schools found',
        noResultsDesc: "We couldn't find any boarding schools matching your criteria. Try adjusting your filters or search query.",
        category: 'Category',
        state: 'State',
        managedBy: 'Managed by {{provider}}',
      },
      internships: {
        title: 'Internships',
        subtitle: 'Find your next career step with internships from top companies. Gain valuable experience and kickstart your professional journey.',
        searchPlaceholder: 'Search roles or companies...',
        filters: 'Filters',
        noResults: 'No internships found',
        noResultsDesc: "We couldn't find any active internships matching your search.",
        applyBy: 'Apply by {{date}}',
      },
    },
  },
  ms: {
    translation: {
      nav: {
        home: 'Utama',
        scholarships: 'Biasiswa',
        boardingschools: 'Sekolah Berasrama',
        internationalschools: 'Sekolah Antarabangsa',
        internships: 'Latihan Amali',
        pricing: 'Harga',
        features: 'Ciri-ciri',
        about: 'Tentang Kami',
        signIn: 'Log Masuk',
        getStarted: 'Mula Sekarang',
      },
      hero: {
        badge: 'Temui Perjalanan Pendidikan Global Anda',
        titlePart1: 'Cari ',
        titlePart2: 'Biasiswa Sempurna Anda',
        subtitle: 'Berhubung dengan beribu-ribu biasiswa, sekolah berasrama, sekolah antarabangsa, dan latihan amali di seluruh Asia Tenggara dan seterusnya. Masa depan anda bermula di sini.',
        browseBtn: 'Lihat Biasiswa',
        learnMoreBtn: 'Ketahui Lebih Lanjut',
        trustedBy: 'Dipercayai oleh 5,000+ pelajar',
        available: '10,000+ biasiswa tersedia',
        countriesCount: '50+ negara',
      },
      home: {
        stats: {
          scholarships: { label: 'Biasiswa Tersedia', desc: 'Peluang pelbagai merangkumi semua bidang' },
          countries: { label: 'Negara', desc: 'Capai global di seluruh Asia Tenggara dan seterusnya' },
          students: { label: 'Pelajar Dibantu', desc: 'Kisah kejayaan daripada komuniti kami' },
          awarded: { label: 'Biasiswa Dianugerahkan', desc: 'Jumlah nilai yang difasilitasi melalui platform kami' },
        },
        howItWorks: {
          title: 'Cara Pathfindr Berfungsi',
          subtitle: 'Perjalanan anda ke pendidikan global bermula di sini. Ikuti langkah mudah ini untuk mencari biasiswa yang sempurna.',
          steps: {
            step1: { title: 'Bina Profil Anda', desc: 'Daftar dan beritahu kami tentang latar belakang akademik, minat, dan matlamat anda.' },
            step2: { title: 'Temui Peluang', desc: 'Lihat beribu-ribu biasiswa menggunakan penapis pintar kami.' },
            step3: { title: 'Mohon dengan Yakin', desc: 'Jejaki permohonan anda, urus tarikh akhir, dan akses sumber yang berguna.' },
            step4: { title: 'Capai Impian Anda', desc: 'Dapatkan biasiswa anda dan mulakan perjalanan pendidikan anda.' },
          }
        },
        features: {
          title: 'Semua yang Anda Perlukan untuk Berjaya',
          subtitle: 'Pathfindr menyediakan alat dan sumber yang hebat untuk membantu anda menemui peluang biasiswa yang sempurna.',
          list: {
            smartSearch: { title: 'Carian Pintar', desc: 'Penapis canggih untuk mencari biasiswa yang sepadan dengan profil anda.' },
            personalized: { title: 'Padanan Peribadi', desc: 'Syor dikuasakan AI berdasarkan matlamat anda.' },
            global: { title: 'Peluang Global', desc: 'Akses biasiswa dari 50+ negara.' },
            verified: { title: 'Senarai Disahkan', desc: 'Semua biasiswa disahkan untuk ketepatan.' },
            tracking: { title: 'Jejak Permohonan', desc: 'Jejaki permohonan anda dalam satu papan pemuka.' },
            secure: { title: 'Selamat & Peribadi', desc: 'Maklumat peribadi anda dilindungi.' },
          },
          detailed: [
            {
              title: 'Carian & Penapis Terperinci',
              description: 'Cari apa yang anda cari dengan keupayaan carian yang hebat dan penapis pintar.',
              benefits: [
                'Penapisan pelbagai kriteria',
                'Keputusan carian segera',
                'Pilihan carian disimpan',
              ],
            },
            {
              title: 'Padanan Dikuasakan AI',
              description: 'Algoritma padanan pintar kami menganalisis profil anda untuk mencadangkan peluang dengan kebarangkalian kejayaan tertinggi.',
              benefits: [
                'Syor diperibadikan',
                'Skor padanan untuk setiap biasiswa',
                'Kedudukan keutamaan pintar',
              ],
            },
            {
              title: 'Pemberitahuan Masa Realiti',
              description: 'Jangan terlepas tarikh akhir. Dapatkan pemberitahuan segera untuk biasiswa baru yang sepadan dengan profil anda.',
              benefits: [
                'Keutamaan yang boleh disesuaikan',
                'Peringatan tarikh akhir',
                'Amaran perubahan status',
              ],
            },
          ]
        },
        featured: {
          title: 'Biasiswa Pilihan',
          subtitle: 'Terokai peluang biasiswa terbaik kami yang sedang menerima permohonan.',
          viewAll: 'Lihat Semua Biasiswa',
        },
        testimonials: {
          title: 'Kisah Kejayaan Pelajar Kami',
          subtitle: 'Sertai beribu-ribu pelajar yang telah menemui biasiswa sempurna melalui Pathfindr.',
          list: [
            {
              quote: "Pathfindr memudahkan pencarian biasiswa. Ciri padanan peribadi menghubungkan saya dengan peluang yang saya tidak tahu wujud. Sekarang saya belajar Sains Komputer di NUS!",
              university: 'National University of Singapore',
              country: 'Singapura',
            },
            {
              quote: "Saya merasa terbeban dengan jumlah biasiswa yang ada sehinggalah saya menemui Pathfindr. Penapis pintar dan penjejakan tarikh akhir membantu saya kekal teratur.",
              university: 'University of Melbourne',
              country: 'Australia',
            },
            {
              quote: "Sebagai pelajar kolej generasi pertama, permohonan biasiswa amat menakutkan. Penjejakan permohonan Pathfindr memberi saya keyakinan. Saya kini belajar Perubatan!",
              university: 'Chulalongkorn University',
              country: 'Thailand',
            },
          ]
        },
        cta: {
          title: 'Sedia untuk Memulai Perjalanan Anda?',
          subtitle: 'Bina profil anda hari ini dan buka akses ke beribu-ribu peluang. Sertai komuniti pelajar kami yang berjaya.',
          createAccount: 'Bina Akaun Percuma',
          browseScholarships: 'Lihat Biasiswa',
        }
      },
      pricing: {
        title: 'Pilih pelan anda',
        subtitle: 'Langgan untuk mula memohon biasiswa. Pilih pelan yang sesuai dengan keperluan anda dan buka jalan anda ke peluang pendidikan.',
        mostPopular: 'Paling Popular',
        currentPlan: 'Pelan Semasa',
        getStarted: 'Dapatkan {{name}}',
        appsPerYear: '{{count}} permohonan biasiswa setiap tahun',
        whatsIncluded: 'Apa yang disertakan:',
        tiers: {
          pro: {
            name: 'Pro',
            features: [
              'Mohon kepada 5 biasiswa setiap tahun',
              'Maklumat penuh biasiswa & kelayakan',
              'Papan pemuka pengesanan permohonan',
              'Pemberitahuan e-mel untuk tarikh akhir',
            ]
          },
          expert: {
            name: 'Expert',
            features: [
              'Mohon kepada 20 biasiswa setiap tahun',
              'Maklumat penuh biasiswa & kelayakan',
              'Papan pemuka pengesanan permohonan',
              'Pemberitahuan e-mel untuk tarikh akhir',
              'Sokongan keutamaan',
              'Syor padanan biasiswa',
            ]
          }
        },
        faq: {
          title: 'Soalan Lazim',
          q1: {
            q: 'Apakah yang dikira sebagai permohonan?',
            a: 'Setiap kali anda mengklik "Mohon Sekarang" pada biasiswa dan diarahkan ke halaman permohonan penyedia biasiswa, ia dikira sebagai satu permohonan.'
          },
          q2: {
            q: 'Bilakah had permohonan saya ditetapkan semula?',
            a: 'Jumlah permohonan anda ditetapkan semula setiap tahun apabila langganan anda diperbaharui.'
          },
          q3: {
            q: 'Bolehkah saya menaik taraf pelan saya?',
            a: 'Ya! Anda boleh menaik taraf daripada Pro ke Expert pada bila-bila masa. Perbezaan harga akan dikira secara pro-rata untuk baki tempoh pengebilan anda.'
          },
          q4: {
            q: 'Bolehkah saya membatalkan pada bila-bila masa?',
            a: 'Sudah tentu. Anda boleh membatalkan langganan anda pada bila-bila masa daripada tetapan akaun anda. Anda akan terus mempunyai akses sehingga akhir tempoh pengebilan semasa anda.'
          }
        }
      },
      profile: {
        complete: {
          title: 'Lengkapkan Profil Akademik Anda',
          subtitle: 'Bantu kami memadankan anda dengan biasiswa terbaik',
        },
        steps: {
          personalDetails: 'Butiran Peribadi',
          education: 'Pendidikan',
          testScores: 'Skor Ujian',
          achievements: 'Pencapaian',
          preferences: 'Keutamaan',
          activities: 'Aktiviti',
        },
        forms: {
          common: {
            back: 'Kembali',
            next: 'Seterusnya',
            required: 'diperlukan',
            select: 'Pilih',
            add: 'Tambah',
            delete: 'Padam',
            other: 'Lain-lain',
            saveProgress: 'Menyimpan kemajuan...',
          },
          personalDetails: {
            title: 'Butiran Peribadi',
            subtitle: 'Mari mulakan dengan beberapa maklumat asas tentang anda',
            dateOfBirth: 'Tarikh Lahir',
            gender: {
              label: 'Jantina',
              placeholder: 'Pilih jantina',
              male: 'Lelaki',
              female: 'Perempuan',
              other: 'Lain-lain',
              preferNotToSay: 'Tidak mahu memberitahu',
            },
            nationality: {
              label: 'Kewarganegaraan',
              placeholder: 'cth., Malaysia, British',
            },
            country: {
              label: 'Negara Kediaman',
              placeholder: 'cth., Malaysia, United Kingdom',
            },
          },
          education: {
            title: 'Sejarah Pendidikan',
            subtitle: 'Tambah kelayakan akademik anda (paling terkini dahulu)',
            entry: 'Pendidikan {{index}}',
            addAnother: 'Tambah Pendidikan Lain',
            institution: {
              label: 'Nama Institusi',
              placeholder: 'cth., Universiti Malaya',
            },
            qualification: {
              label: 'Kelayakan',
              placeholder: 'Pilih kelayakan',
            },
            fieldOfStudy: {
              label: 'Bidang Pengajian',
              placeholder: 'cth., Sains Komputer',
            },
            startDate: 'Tarikh Mula',
            endDate: {
              label: 'Tarikh Tamat',
              helper: 'Tinggalkan kosong jika masih belajar',
            },
            grade: {
              label: 'Gred',
              placeholder: 'cth., Kelas Pertama, A+, Kepujian',
            },
            gpa: {
              label: 'GPA (daripada 4.0)',
              placeholder: 'cth., 3.8',
            },
            qualifications: {
              highSchool: 'Diploma Sekolah Menengah',
              associate: 'Ijazah Bersekutu',
              bachelorArts: 'Sarjana Muda Sastera',
              bachelorScience: 'Sarjana Muda Sains',
              bachelorEng: 'Sarjana Muda Kejuruteraan',
              masterArts: 'Sarjana Sastera',
              masterScience: 'Sarjana Sains',
              mba: 'MBA',
              phd: 'PhD',
            },
          },
          testScores: {
            title: 'Skor Ujian Piawai',
            subtitle: 'Tambah skor untuk sebarang ujian yang anda duduki. Semua ruangan adalah pilihan — hanya isi ujian yang anda telah lengkapkan.',
            sat: { label: 'Skor SAT', placeholder: 'cth., 1450', helper: 'Jumlah skor (400–1600)' },
            ielts: { label: 'Skor IELTS', placeholder: 'cth., 7.5', helper: 'Skor band keseluruhan (0–9)' },
            toefl: { label: 'Skor TOEFL', placeholder: 'cth., 105', helper: 'Jumlah skor (0–120)' },
            gre: { label: 'Skor GRE', placeholder: 'cth., 325', helper: 'Lisan + Kuant gabungan (260–340)' },
            gmat: { label: 'Skor GMAT', placeholder: 'cth., 720', helper: 'Jumlah skor (200–800)' },
          },
          achievements: {
            title: 'Pencapaian & Kemahiran',
            subtitle: 'Tunjukkan sijil, projek, dan kemahiran anda. Semua bahagian adalah pilihan.',
            certificates: {
              title: 'Sijil',
              entry: 'Sijil {{index}}',
              addAnother: 'Tambah Sijil',
              itemTitle: 'Tajuk Sijil',
              issuer: 'Penerbit',
              dateIssued: 'Tarikh Diterbitkan',
              placeholder: 'cth., Arkitek Penyelesaian AWS',
            },
            projects: {
              title: 'Projek Akademik / Peribadi',
              entry: 'Projek {{index}}',
              addAnother: 'Tambah Projek',
              itemTitle: 'Tajuk Projek',
              description: 'Penerangan',
              technologies: 'Teknologi',
              startDate: 'Tarikh Mula',
              endDate: 'Tarikh Tamat',
              placeholder: 'cth., Pemadan Biasiswa Dikuasakan AI',
              descPlaceholder: 'Terangkan secara ringkas tentang projek dan peranan anda',
            },
            skills: {
              title: 'Kemahiran',
              placeholder: 'Taip kemahiran dan tekan Enter (cth., Python, Kepimpinan)',
            },
          },
          preferences: {
            title: 'Keutamaan Kerjaya',
            subtitle: 'Beritahu kami tentang minat anda supaya kami dapat memadankan anda dengan biasiswa yang betul',
            interests: {
              label: 'Minat',
              placeholder: 'cth., Teknologi, Penjagaan Kesihatan, Pendidikan',
            },
            studyCountries: {
              label: 'Negara Pengajian Pilihan',
              placeholder: 'cth., Amerika Syarikat, United Kingdom, Jerman',
            },
            availability: {
              label: 'Bilakah anda merancang untuk bermula?',
              placeholder: 'cth., Musim Luruh 2026, Januari 2027, Segera',
            },
            complete: 'Lengkapkan Profil',
            saving: 'Menyimpan profil...',
          },
        },
      },
      footer: {
        description: 'Laluan anda ke peluang pendidikan global. Hubungi biasiswa, sekolah berasrama, sekolah antarabangsa, dan latihan amali di seluruh Asia Tenggara dan seterusnya.',
        platform: 'Platform',
        resources: 'Sumber',
        connect: 'Hubungi Kami',
        links: {
          universities: 'Universiti',
          internships: 'Latihan Amali',
          jobs: 'Pekerjaan',
          knowledgeBase: 'Pangkalan Pengetahuan',
          privacyPolicy: 'Dasar Privasi',
          termsOfService: 'Syarat Perkhidmatan',
        },
        allRightsReserved: 'Hak cipta terpelihara.',
        madeWith: 'Dibuat dengan',
        inSEA: 'di Asia Tenggara',
      },
      internationalSchools: {
        title: 'Sekolah Antarabangsa',
        subtitle: 'Terokai {{total}} sekolah antarabangsa terbaik di Malaysia, Indonesia, dan China. Bandingkan kurikulum, yuran, dan cari sekolah yang sempurna untuk perjalanan pendidikan anda.',
        schoolsCount: '{{count}} sekolah',
        search: {
          placeholder: 'Cari sekolah mengikut nama, cth. ISKL, Dulwich, JIS...',
        },
        sort: {
          label: 'Susun mengikut:',
          name: 'Nama',
          country: 'Negara',
          city: 'Bandar',
        },
        results: {
          school: '{{count}} sekolah ditemui',
          schools: '{{count}} sekolah ditemui',
        },
        empty: {
          title: 'Tiada sekolah ditemui',
          description: 'Kami tidak dapat mencari sekolah antarabangsa yang sepadan dengan kriteria anda. Cuba laraskan penapis atau carian anda.',
          clearAll: 'Kosongkan Semua Penapis',
        },
        filters: {
          title: 'Penapis',
          clearAll: 'Kosongkan semua',
          clearAllBtn: 'Kosongkan Semua Penapis',
          country: 'Negara',
          curriculum: 'Kurikulum',
        },
        location: {
          title: 'Lokasi Anda',
          locating: 'Menentukan Lokasi...',
          useCurrent: 'Gunakan Lokasi Saya',
          or: 'atau',
          selectCity: 'Pilih bandar',
          distance: 'Jarak',
        },
        card: {
          fees: 'Yuran:',
          visitWebsite: 'Lawati Laman Web',
        },
        pagination: {
          previous: 'Sebelumnya',
          next: 'Seterusnya',
        },
        mobile: {
          filters: 'Penapis',
          showResults: 'Tunjukkan {{count}} Keputusan',
        },
      },
      profileView: {
        title: 'Profil Saya',
        editProfile: 'Sunting Profil',
        notFound: 'Profil Tidak Ditemui',
        notFoundDesc: "Anda belum melengkapkan profil anda. Lengkapkan profil anda untuk melihatnya di sini.",
        completeProfileBtn: 'Lengkapkan Profil',
        sections: {
          personal: 'Butiran Peribadi',
          education: 'Pendidikan',
          testScores: 'Skor Ujian',
          certificates: 'Sijil',
          projects: 'Projek',
          skills: 'Kemahiran',
          interests: 'Minat',
          preferences: 'Keutamaan',
          activities: 'Aktiviti Kokurikulum',
        },
        fields: {
          dob: 'Tarikh Lahir',
          gender: 'Jantina',
          nationality: 'Kewarganegaraan',
          country: 'Negara',
          phone: 'Telefon',
          gpa: 'GPA',
          grade: 'Gred',
          present: 'Sekarang',
          preferredCountries: 'Negara Pilihan',
          availability: 'Ketersediaan',
        },
        resumeOptimizer: {
          title: 'Pengoptimum Resume',
          score: 'Skor Profil',
          scoreLabel: 'Skor',
          ranking: 'Kedudukan',
          generateBtn: 'Bina Resume Dioptimumkan',
          suggestions: 'Cadangan untuk Penambahbaikan',
          copyLink: 'Salin Pautan Kongsi',
          viewPublic: 'Lihat Resume Awam',
          copySuccess: 'Pautan kongsi disalin ke papan klip!',
          perfectProfile: 'Profil anda sempurna! Anda sedia untuk membina resume dioptimumkan anda.',
          aiDescription: 'Sistem dikuasakan AI kami menukar profil anda menjadi resume profesional yang sedia untuk perekrut.',
          previewTitle: 'Pratonton Resume',
          printBtn: 'Cetak / Simpan sebagai PDF',
          footer: 'Dijana oleh Enjin Resume Dioptimumkan PathFindr',
          percentageComplete: '{{progress}}% Lengkap',
          levels: {
            needsImprovement: 'Perlu Penambahbaikan',
            goodProgress: 'Kemajuan Baik',
            professional: 'Profesional',
            elite: 'Elit',
          },
          descriptions: {
            needsImprovement: 'Profil anda memerlukan lebih banyak butiran untuk menonjol.',
            goodProgress: 'Anda sedang membina asas yang kukuh.',
            professional: 'Anda sedia untuk kebanyakan peluang kerjaya.',
            elite: 'Profil anda sangat kompetitif untuk pengambilan peringkat tinggi.',
          },
          suggestionsList: {
            phone: 'Tambah nombor telefon anda untuk perekrut.',
            gpa: 'Sertakan GPA atau gred anda untuk menunjukkan kecemerlangan akademik.',
            education: 'Senaraikan latar belakang pendidikan anda.',
            skills: 'Tambah lebih banyak kemahiran berkaitan industri (sasarkan sekurang-kurangnya 8).',
            skillsBasic: 'Tunjukkan kemahiran teknikal dan profesional anda.',
            projectDetail: 'Tulis penerangan yang lebih terperinci untuk projek anda.',
            projectDetailBasic: 'Perincikan projek akademik atau peribadi untuk menunjukkan pengalaman praktikal.',
            certificates: 'Tambah sijil untuk mengesahkan kepakaran anda.',
            subjectScores: 'Tambah keputusan subjek IGCSE, SPM, atau O-Level anda untuk memperkukuh profil akademik anda.',
          },
          sections: {
            education: 'Pendidikan',
            projects: 'Projek Utama',
            expertise: 'Kepakaran',
            certificates: 'Sijil',
            testScores: 'Skor Ujian',
          },
          placeholders: {
            noEducation: 'Tiada kemasukan pendidikan ditambah. Perekrut mengutamakan latar belakang akademik.',
            noProjects: 'Tambah projek yang relevan untuk menunjukkan aplikasi praktikal kemahiran anda.',
            noSkills: 'Senaraikan kemahiran teknikal dan insaniah teras anda.',
            noCertificates: 'Tunjukkan sijil formal dan pembelajaran berterusan anda.',
            noTestScores: 'Skor piawai (SAT, IELTS, dll.) menambah berat kepada kedudukan akademik anda.',
          }
        },
        common: {
          in: 'di',
          score: 'Skor',
        },
      },
      referral: {
        title: 'Program Rujukan',
        code: {
          label: 'Kod rujukan anda',
          copy: 'Salin kod',
          copyLink: 'Salin pautan rujukan',
          description: 'Kongsi kod atau pautan ini dengan rakan-rakan untuk mendapat ganjaran',
        },
        progress: {
          title: 'Kemajuan Rujukan',
          count: '{{count}}/5 rakan',
          earned: 'Anda baru sahaja mendapat ganjaran!',
          inviteToEarn: 'Jemput 5 rakan untuk mendapat langganan Pro percuma',
          moreNeeded: '{{count}} lagi rakan diperlukan untuk mendapat langganan Pro percuma',
          moreNeeded_plural: '{{count}} lagi rakan diperlukan untuk mendapat langganan Pro percuma',
          stats: {
            friendsReferred: 'Rakan Dirujuk',
            rewardsEarned: 'Ganjaran Diperoleh',
          }
        },
        rewards: {
          title: 'Ganjaran Anda',
          proSubscription: 'Langganan Pro',
          coupon: 'Kupon: ',
          copyCoupon: 'Salin kod kupon',
          status: {
            active: 'Aktif',
            available: 'Tersedia',
            claimed: 'Ditebus'
          }
        },
        claim: {
          success: {
            title: 'Langganan Diaktifkan!',
            description: 'Langganan Pro percuma anda kini aktif, terima kasih kepada {{name}}.',
            nextSteps: 'Anda kini boleh mula memohon biasiswa.',
            browseBtn: 'Lihat Biasiswa',
            viewSubBtn: 'Lihat Langganan',
          },
          validating: 'Mengesahkan kod kupon...',
          error: {
            notAvailable: 'Kupon Tidak Tersedia',
            invalidOrClaimed: 'Kod kupon rujukan ini sama ada tidak sah atau telah pun ditebus.',
            viewPricing: 'Lihat Pelan Harga',
            studentRequired: 'Akaun Pelajar Diperlukan',
            studentRequiredDesc: 'Kupon rujukan hanya tersedia untuk akaun pelajar.',
            goToDashboard: 'Pergi ke Papan Pemuka',
            alreadySubscribed: 'Anda Sudah Mempunyai Langganan',
            alreadySubscribedDesc: 'Akaun anda sudah mempunyai langganan aktif. Kupon ini boleh digunakan oleh pelajar tanpa langganan.',
            manageSub: 'Urus Langganan',
            generic: 'Gagal menebus kupon. Sila cuba lagi.',
          },
          gift: {
            title: 'Langganan Pro Percuma!',
            subtitle: '{{name}} berkongsi ganjaran rujukan dengan anda.',
            instruction: 'Daftar atau log masuk untuk menebus langganan Pro percuma anda.',
            registerBtn: 'Daftar untuk Menebus',
            loginBtn: 'Log Masuk untuk Menebus',
            claimTitle: 'Tebus Langganan Pro Percuma Anda',
            sharedBy: '{{name}} memperoleh ganjaran ini melalui program rujukan dan berkongsinya dengan anda!',
            fullAccess: 'Ini memberi anda akses penuh untuk memohon biasiswa selama satu tahun.',
            planFree: 'Pelan Pro — Percuma selama 1 Tahun',
            normalPrice: 'Biasanya $9.99/tahun — Dihadiahkan oleh {{name}}',
            claimBtn: 'Tebus Langganan Percuma'
          }
        }
      },
      sponsorship: {
        claim: {
          success: {
            title: 'Langganan Diaktifkan!',
            description: 'Langganan {{tier}} anda kini aktif, ditaja oleh {{company}}.',
            nextSteps: 'Anda kini boleh mula memohon biasiswa.',
            browseBtn: 'Lihat Biasiswa',
            viewSubBtn: 'Lihat Langganan',
          },
          validating: 'Mengesahkan kod kupon...',
          error: {
            notAvailable: 'Kupon Tidak Lagi Tersedia',
            invalidOrExhausted: 'Kod kupon ini sama ada tidak sah atau semua langganan yang ditaja telah ditebus.',
            viewPricing: 'Lihat Pelan Harga',
            studentRequired: 'Akaun Pelajar Diperlukan',
            studentRequiredDesc: 'Langganan yang ditaja hanya tersedia untuk akaun pelajar.',
            goToDashboard: 'Pergi ke Papan Pemuka',
            alreadySubscribed: 'Anda Sudah Mempunyai Langganan',
            alreadySubscribedDesc: 'Akaun anda sudah mempunyai langganan aktif. Kupon ini boleh digunakan oleh pelajar tanpa langganan.',
            manageSub: 'Urus Langganan',
            generic: 'Gagal menebus langganan. Sila cuba lagi.',
          },
          gift: {
            title: 'Langganan Percuma Tersedia!',
            subtitle: '{{company}} menaja langganan {{tier}} untuk pelajar.',
            instruction: 'Daftar atau log masuk untuk menebus langganan percuma anda.',
            registerBtn: 'Daftar untuk Menebus',
            loginBtn: 'Log Masuk untuk Menebus',
            claimTitle: 'Tebus Langganan Percuma Anda',
            sharedBy: '{{company}} menaja langganan {{tier}} anda!',
            fullAccess: 'Ini memberi anda akses penuh untuk memohon biasiswa selama satu tahun.',
            planFree: 'Pelan {{tier}} — Percuma selama 1 Tahun',
            normalPrice: 'Biasanya ${{price}}/tahun — Dikecualikan oleh {{company}}',
            claimBtn: 'Tebus Langganan Percuma',
            remainingSlots: '{{count}} langganan ditaja berbaki',
            remainingSlots_plural: '{{count}} langganan ditaja berbaki',
          }
        }
      },
      scholarships: {
        title: 'Cari Biasiswa Anda',
        subtitle: 'Lihat beribu-ribu biasiswa dari seluruh dunia. Gunakan penapis canggih kami untuk mencari peluang yang sepadan dengan profil anda.',
        searchPlaceholder: 'Cari biasiswa mengikut nama, penyedia...',
        sortBy: 'Susun mengikut:',
        sort: {
          relevant: 'Relevan',
          deadline: 'Tarikh Akhir',
          value: 'Nilai',
          recent: 'Terkini',
        },
        filters: 'Penapis',
        showResults: 'Tunjukkan {{count}} Keputusan',
        previous: 'Sebelumnya',
        next: 'Seterusnya',
        noResults: 'Tiada biasiswa ditemui',
        noResultsDesc: "Kami tidak dapat mencari biasiswa yang sepadan dengan kriteria anda. Cuba laraskan penapis atau carian anda.",
        clearFilters: 'Kosongkan Semua Penapis',
      },
      boardingSchools: {
        title: 'Sekolah Berasrama',
        subtitle: 'Temui sekolah berasrama terbaik di seluruh Asia Tenggara. Bandingkan kategori, lokasi, dan cari persekitaran yang sempurna untuk pendidikan anda.',
        searchPlaceholder: 'Cari sekolah mengikut nama...',
        filters: 'Penapis',
        noResults: 'Tiada sekolah ditemui',
        noResultsDesc: "Kami tidak dapat mencari sekolah berasrama yang sepadan dengan kriteria anda. Cuba laraskan penapis atau carian anda.",
        category: 'Kategori',
        state: 'Negeri',
        managedBy: 'Diuruskan oleh {{provider}}',
      },
      internships: {
        title: 'Latihan Amali',
        subtitle: 'Cari langkah kerjaya anda seterusnya dengan latihan amali daripada syarikat terkemuka. Dapatkan pengalaman berharga dan mulakan perjalanan profesional anda.',
        searchPlaceholder: 'Cari peranan atau syarikat...',
        filters: 'Penapis',
        noResults: 'Tiada latihan amali ditemui',
        noResultsDesc: "Kami tidak dapat mencari latihan amali yang aktif yang sepadan dengan carian anda.",
        applyBy: 'Mohon sebelum {{date}}',
      },
    },
  },
  zh: {
    translation: {
      nav: {
        home: '首页',
        scholarships: '奖学金',
        boardingschools: '寄宿学校',
        internationalschools: '国际学校',
        internships: '实习机会',
        pricing: '价格',
        features: '功能',
        about: '关于我们',
        signIn: '登录',
        getStarted: '立即开始',
      },
      hero: {
        badge: '开启您的全球教育之旅',
        titlePart1: '寻找您最完美的 ',
        titlePart2: '奖学金',
        subtitle: '连接东南亚及海外成千上万的奖学金、寄宿学校、国际学校和实习机会。您的未来从这里开始。',
        browseBtn: '浏览奖学金',
        learnMoreBtn: '了解更多',
        trustedBy: '5,000+ 名学生的信赖',
        available: '10,000+ 项奖学金可供选择',
        countriesCount: '50+ 个国家',
      },
      home: {
        stats: {
          scholarships: { label: '可用奖学金', desc: '各领域的多元化机会' },
          countries: { label: '覆盖国家', desc: '覆盖东南亚及全球各地' },
          students: { label: '已帮助学生', desc: '来自我们社区的成功故事' },
          awarded: { label: '已颁发奖学金', desc: '通过我们平台促成的总价值' },
        },
        howItWorks: {
          title: 'Pathfindr 如何运作',
          subtitle: '您的全球教育之旅从这里开始。按照这些简单的步骤寻找并获得完美的奖学金。',
          steps: {
            step1: { title: '创建个人资料', desc: '注册并告诉我们您的学术背景、兴趣和目标。' },
            step2: { title: '发现机会', desc: '使用我们的智能过滤器浏览成千上万的奖学金。' },
            step3: { title: '自信申请', desc: '跟踪您的申请、管理截止日期并访问有用资源。' },
            step4: { title: '实现梦想', desc: '获得奖学金并开启您的教育之旅。' },
          }
        },
        features: {
          title: '助您成功所需的一切',
          subtitle: 'Pathfindr 提供强大的工具和资源，帮助您发现并获得完美的奖学金机会。',
          list: {
            smartSearch: { title: '智能搜索', desc: '高级过滤器，寻找匹配您资料的奖学金。' },
            personalized: { title: '个性化匹配', desc: '基于您目标的 AI 驱动推荐。' },
            global: { title: '全球机会', desc: '访问来自 50 多个国家的奖学金。' },
            verified: { title: '认证列表', desc: '所有奖学金经过验证以确保准确。' },
            tracking: { title: '申请跟踪', desc: '在一个仪表板中跟踪您的申请。' },
            secure: { title: '安全与私密', desc: '您的个人信息受到保护。' },
          },
          detailed: [
            {
              title: '高级搜索与筛选',
              description: '通过强大的搜索功能和智能过滤器，准确找到您想要的内容。',
              benefits: [
                '多标准过滤',
                '即时搜索结果',
                '保存搜索偏好',
              ],
            },
            {
              title: 'AI 驱动匹配',
              description: '我们的智能匹配算法会分析您的个人资料，推荐成功率最高的机会。',
              benefits: [
                '个性化推荐',
                '每项奖学金的匹配得分',
                '智能优先级排序',
              ],
            },
            {
              title: '实时通知',
              description: '永远不会错过截止日期。即时获取符合您资料的新奖学金通知。',
              benefits: [
                '可定制的偏好',
                '截止日期提醒',
                '状态变更警报',
              ],
            },
          ]
        },
        featured: {
          title: '精选奖学金',
          subtitle: '探索我们目前正在接受申请的热门奖学金机会。',
          viewAll: '查看所有奖学金',
        },
        testimonials: {
          title: '我们学生的成功故事',
          subtitle: '加入成千上万通过 Pathfindr 找到完美奖学金的学生行列。',
          list: [
            {
              quote: "Pathfindr 让寻找合适的奖学金变得更加简单。个性化匹配功能让我发现了很多我以前都不知道的机会。现在我在新加坡国立大学学习计算机科学！",
              university: '新加坡国立大学',
              country: '新加坡',
            },
            {
              quote: "在发现 Pathfindr 之前，我被大量的奖学金信息搞得不知所措。平台的智能过滤器和截止日期跟踪帮助我保持井井有条，并最终赢得了全额奖学金去学习工程学。",
              university: '墨尔本大学',
              country: '澳大利亚',
            },
            {
              quote: "作为第一代大学生，申请奖学金曾让我望而生畏。Pathfindr 的认证列表和申请跟踪给了我追求梦想的信心。我现在在曼谷学习医学！",
              university: '朱拉隆功大学',
              country: '泰国',
            },
          ]
        },
        cta: {
          title: '准备好开启您的旅程了吗？',
          subtitle: '立即创建您的资料，开启成千上万个机会的大门。加入我们成功的学生社区。',
          createAccount: '创建免费账户',
          browseScholarships: '浏览奖学金',
        }
      },
      pricing: {
        title: '选择您的计划',
        subtitle: '订阅并开始申请奖学金。选择最适合您需求的计划，开启通往教育机会的大门。',
        mostPopular: '最受欢迎',
        currentPlan: '当前计划',
        getStarted: '获取 {{name}}',
        appsPerYear: '每年 {{count}} 次奖学金申请',
        whatsIncluded: '包含内容：',
        tiers: {
          pro: {
            name: 'Pro 专业版',
            features: [
              '每年申请 5 项奖学金',
              '完整的奖学金详情和资格信息',
              '申请跟踪仪表板',
              '截止日期电子邮件通知',
            ]
          },
          expert: {
            name: 'Expert 专家版',
            features: [
              '每年申请 20 项奖学金',
              '完整的奖学金详情和资格信息',
              '申请跟踪仪表板',
              '截止日期电子邮件通知',
              '优先支持',
              '奖学金匹配推荐',
            ]
          }
        },
        faq: {
          title: '常见问题',
          q1: {
            q: '什么是申请？',
            a: '每次您点击奖学金上的“立即申请”并被重定向到奖学金提供者的申请页面时，都计为一次申请。'
          },
          q2: {
            q: '我的申请限额何时重置？',
            a: '您的申请计数将在每年订阅续订时重置。'
          },
          q3: {
            q: '我可以升级我的计划吗？',
            a: '可以！您可以随时从 Pro 升级到 Expert。价格差额将按计费周期的剩余时间按比例计算。'
          },
          q4: {
            q: '我可以随时取消吗？',
            a: '当然可以。您可以随时通过账户设置取消订阅。在当前计费周期结束前，您仍可继续访问。'
          }
        }
      },
      profile: {
        complete: {
          title: '完善您的学术资料',
          subtitle: '帮助我们为您匹配最合适的奖学金',
        },
        steps: {
          personalDetails: '个人详情',
          education: '教育经历',
          testScores: '考试成绩',
          achievements: '个人成就',
          preferences: '偏好设置',
          activities: '课外活动',
        },
        forms: {
          common: {
            back: '上一步',
            next: '下一步',
            required: '必填',
            select: '选择',
            add: '添加',
            delete: '删除',
            other: '其他',
            saveProgress: '正在保存进度...',
          },
          personalDetails: {
            title: '个人详情',
            subtitle: '让我们从一些基本信息开始',
            dateOfBirth: '出生日期',
            gender: {
              label: '性别',
              placeholder: '选择性别',
              male: '男',
              female: '女',
              other: '其他',
              preferNotToSay: '不便透露',
            },
            nationality: {
              label: '国籍',
              placeholder: '例如：马来西亚，英国',
            },
            country: {
              label: '居住国家',
              placeholder: '例如：马来西亚，英国',
            },
          },
          education: {
            title: '教育经历',
            subtitle: '添加您的学术资历（从最近的开始）',
            entry: '教育经历 {{index}}',
            addAnother: '添加其他教育经历',
            institution: {
              label: '院校名称',
              placeholder: '例如：马来亚大学',
            },
            qualification: {
              label: '资历',
              placeholder: '选择资历',
            },
            fieldOfStudy: {
              label: '专业领域',
              placeholder: '例如：计算机科学',
            },
            startDate: '开始日期',
            endDate: {
              label: '结束日期',
              helper: '如果在读请留空',
            },
            grade: {
              label: '成绩',
              placeholder: '例如：一等学位，A+，优异',
            },
            gpa: {
              label: 'GPA (4.0分制)',
              placeholder: '例如：3.8',
            },
            qualifications: {
              highSchool: '高中毕业证',
              associate: '副学士学位',
              bachelorArts: '文学学士',
              bachelorScience: '理学学士',
              bachelorEng: '工学学士',
              masterArts: '文学硕士',
              masterScience: '理学硕士',
              mba: '工商管理硕士 (MBA)',
              phd: '博士 (PhD)',
            },
          },
          testScores: {
            title: '标准化考试成绩',
            subtitle: '添加您参加过的任何考试成绩。所有字段均为可选 — 仅填写您已完成的考试。',
            sat: { label: 'SAT 成绩', placeholder: '例如：1450', helper: '总分 (400–1600)' },
            ielts: { label: 'IELTS 成绩', placeholder: '例如：7.5', helper: '总分 (0–9)' },
            toefl: { label: 'TOEFL 成绩', placeholder: '例如：105', helper: '总分 (0–120)' },
            gre: { label: 'GRE 成绩', placeholder: '例如：325', helper: '语文 + 数学总分 (260–340)' },
            gmat: { label: 'GMAT 成绩', placeholder: '例如：720', helper: '总分 (200–800)' },
          },
          achievements: {
            title: '成就与技能',
            subtitle: '展示您的证书、项目和技能。所有部分均为可选。',
            certificates: {
              title: '证书',
              entry: '证书 {{index}}',
              addAnother: '添加证书',
              itemTitle: '证书名称',
              issuer: '颁发机构',
              dateIssued: '颁发日期',
              placeholder: '例如：AWS 解决方案架构师',
            },
            projects: {
              title: '学术 / 个人项目',
              entry: '项目 {{index}}',
              addAnother: '添加项目',
              itemTitle: '项目名称',
              description: '描述',
              technologies: '技术栈',
              startDate: '开始日期',
              endDate: '结束日期',
              placeholder: '例如：AI 驱动的奖学金匹配器',
              descPlaceholder: '简要描述项目及您的职责',
            },
            skills: {
              title: '技能',
              placeholder: '输入技能并按回车（例如：Python, 领导力）',
            },
          },
          preferences: {
            title: '职业偏好',
            subtitle: '告诉我们您的兴趣，以便我们为您匹配合适的奖学金',
            interests: {
              label: '兴趣',
              placeholder: '例如：技术，医疗保健，教育',
            },
            studyCountries: {
              label: '首选留学国家',
              placeholder: '例如：美国，英国，德国',
            },
            availability: {
              label: '您计划何时开始？',
              placeholder: '例如：2026 秋季，2027 年 1 月，立即',
            },
            complete: '完成个人资料',
            saving: '正在保存资料...',
          },
        },
      },
      footer: {
        description: '通往全球教育机会的必经之路。连接东南亚及其他地区的奖学金、寄宿学校、国际学校和实习机会。',
        platform: '平台',
        resources: '资源',
        connect: '联系我们',
        links: {
          universities: '大学',
          internships: '实习机会',
          jobs: '就业职位',
          knowledgeBase: '知识库',
          privacyPolicy: '隐私政策',
          termsOfService: '服务条款',
        },
        allRightsReserved: '版权所有。',
        madeWith: '精心制作',
        inSEA: '在东南亚',
      },
      internationalSchools: {
        title: '国际学校',
        subtitle: '探索马来西亚、印度尼西亚和中国的 {{total}} 所顶级国际学校。比较课程、学费，为您的教育之旅找到最合适的学校。',
        schoolsCount: '{{count}} 所学校',
        search: {
          placeholder: '按名称搜索学校，如 ISKL、Dulwich、JIS...',
        },
        sort: {
          label: '排序方式：',
          name: '名称',
          country: '国家',
          city: '城市',
        },
        results: {
          school: '找到 {{count}} 所学校',
          schools: '找到 {{count}} 所学校',
        },
        empty: {
          title: '未找到学校',
          description: '未找到符合您条件的国际学校。请尝试调整筛选条件或搜索关键词识别。',
          clearAll: '清除所有筛选',
        },
        filters: {
          title: '筛选',
          clearAll: '清除所有',
          clearAllBtn: '清除所有筛选',
          country: '国家',
          curriculum: '课程体系',
        },
        location: {
          title: '您的位置',
          locating: '定位中...',
          useCurrent: '使用我的位置',
          or: '或',
          selectCity: '选择城市',
          distance: '距离',
        },
        card: {
          fees: '学费：',
          visitWebsite: '访问网站',
        },
        pagination: {
          previous: '上一页',
          next: '下一页',
        },
        mobile: {
          filters: '筛选',
          showResults: '显示 {{count}} 个结果',
        },
      },
      profileView: {
        title: '我的个人资料',
        editProfile: '编辑资料',
        notFound: '未找到个人资料',
        notFoundDesc: '您尚未完善个人资料。完善后即可在此查看。',
        completeProfileBtn: '完善资料',
        sections: {
          personal: '个人详情',
          education: '教育经历',
          testScores: '考试成绩',
          certificates: '证书',
          projects: '项目经历',
          skills: '技能',
          interests: '兴趣爱好',
          preferences: '偏好设置',
          activities: '课外活动',
        },
        fields: {
          dob: '出生日期',
          gender: '性别',
          nationality: '国籍',
          country: '居住国家',
          phone: '电话',
          gpa: 'GPA',
          grade: '成绩/等级',
          present: '至今',
          preferredCountries: '首选国家',
          availability: '入学时间',
        },
        resumeOptimizer: {
          title: '简历优化器',
          score: '个人资料评分',
          scoreLabel: '评分',
          ranking: '排名',
          generateBtn: '生成优化简历',
          suggestions: '改进建议',
          copyLink: '复制分享链接',
          viewPublic: '查看公开简历',
          copySuccess: '分享链接已复制到剪贴板！',
          perfectProfile: '您的个人资料非常完美！您已准备好生成优化后的简历。',
          aiDescription: '我们的 AI 驱动系统会将您的个人资料格式化为专业的、适合招聘人员的简历。',
          previewTitle: '简历预览',
          printBtn: '打印 / 另存为 PDF',
          footer: '由 PathFindr 优化简历引擎生成',
          percentageComplete: '完成度 {{progress}}%',
          levels: {
            needsImprovement: '需要改进',
            goodProgress: '良好进展',
            professional: '专业水平',
            elite: '精英水平',
          },
          descriptions: {
            needsImprovement: '您的个人资料需要更多细节才能脱颖而出。',
            goodProgress: '您正在建立坚实的基础。',
            professional: '您已准备好应对大多数职业机会。',
            elite: '您的个人资料在顶级招聘中极具竞争力。',
          },
          suggestionsList: {
            phone: '添加您的电话号码以便招聘人员联系。',
            gpa: '列出您的 GPA 或成绩以展示学术表现。',
            education: '列出您的教育背景。',
            skills: '添加更多行业相关的技能（目标至少 8 项）。',
            skillsBasic: '展示您的技术和专业技能。',
            projectDetail: '为您的项目编写更详细的描述。',
            projectDetailBasic: '详细描述学术或个人项目，以展示实际经验。',
            certificates: '添加证书以证明您的专业知识。',
            subjectScores: '添加您的 IGCSE、SPM 或 O-Level 科目成绩，以加强您的学术档案。',
          },
          sections: {
            education: '教育经历',
            projects: '重点项目',
            expertise: '专业技能',
            certificates: '获奖证书',
            testScores: '考试成绩',
          },
          placeholders: {
            noEducation: '尚未添加教育经历。招聘人员非常看重学术背景。',
            noProjects: '添加相关项目以展示您的技能实际应用。',
            noSkills: '列出您的核心技术和软技能。',
            noCertificates: '展示您的正式证书和持续学习成果。',
            noTestScores: '标准化考试成绩（SAT、IELTS 等）会增加您的学术分量。',
          }
        },
        common: {
          in: '于',
          score: '分数',
        },
      },
      referral: {
        title: '推荐计划',
        code: {
          label: '您的推荐代码',
          copy: '复制代码',
          copyLink: '复制分享链接',
          description: '与朋友分享此代码或链接以获得奖励',
        },
        progress: {
          title: '推荐进度',
          count: '{{count}}/5 位朋友',
          earned: '您刚获得了一项奖励！',
          inviteToEarn: '邀请 5 位朋友即可获得一年的免费 Pro 订阅',
          moreNeeded: '还需 {{count}} 位朋友即可获得免费 Pro 订阅',
          moreNeeded_plural: '还需 {{count}} 位朋友即可获得免费 Pro 订阅',
          stats: {
            friendsReferred: '已推荐朋友',
            rewardsEarned: '已获得奖励',
          }
        },
        rewards: {
          title: '您的奖励',
          proSubscription: 'Pro 订阅',
          coupon: '优惠券：',
          copyCoupon: '复制优惠券代码',
          status: {
            active: '已激活',
            available: '可用',
            claimed: '已领取'
          }
        },
        claim: {
          success: {
            title: '订阅已激活！',
            description: '您的免费 Pro 订阅现已激活，感谢 {{name}}。',
            nextSteps: '您现在可以开始申请奖学金了。',
            browseBtn: '浏览奖学金',
            viewSubBtn: '查看订阅',
          },
          validating: '正在验证优惠券代码...',
          error: {
            notAvailable: '优惠券不可用',
            invalidOrClaimed: '此推荐优惠券代码无效或已被领取。',
            viewPricing: '查看价格计划',
            studentRequired: '需要学生账户',
            studentRequiredDesc: '推荐优惠券仅适用于学生账户。',
            goToDashboard: '前往仪表板',
            alreadySubscribed: '您已有订阅',
            alreadySubscribedDesc: '您的账户已有活跃订阅。此优惠券仅供尚未订阅的学生使用。',
            manageSub: '管理订阅',
            generic: '领取优惠券失败。请重试。',
          },
          gift: {
            title: '免费 Pro 订阅！',
            subtitle: '{{name}} 正在与您分享推荐奖励。',
            instruction: '注册或登录即可领取您的免费 Pro 订阅。',
            registerBtn: '注册并领取',
            loginBtn: '登录并领取',
            claimTitle: '领取您的免费 Pro 订阅',
            sharedBy: '{{name}} 通过推荐计划获得了此奖励，并正与您分享！',
            fullAccess: '这将为您提供一年的全额奖学金申请权限。',
            planFree: 'Pro 计划 — 1 年免费',
            normalPrice: '原价 $9.99/年 — 由 {{name}} 赠送',
            claimBtn: '领取免费订阅'
          }
        }
      },
      sponsorship: {
        claim: {
          success: {
            title: '订阅已激活！',
            description: '您的 {{tier}} 订阅现已激活，由 {{company}} 赞助。',
            nextSteps: '您现在可以开始申请奖学金了。',
            browseBtn: '浏览奖学金',
            viewSubBtn: '查看订阅',
          },
          validating: '正在验证优惠券代码...',
          error: {
            notAvailable: '优惠券不再可用',
            invalidOrExhausted: '此优惠券代码无效或赞助订阅已被领取。',
            viewPricing: '查看价格计划',
            studentRequired: '需要学生账户',
            studentRequiredDesc: '赞助订阅仅适用于学生账户。',
            goToDashboard: '前往仪表板',
            alreadySubscribed: '您已有订阅',
            alreadySubscribedDesc: '您的账户已有活跃订阅。此优惠券仅供尚未订阅的学生使用。',
            manageSub: '管理订阅',
            generic: '领取订阅失败。请重试。',
          },
          gift: {
            title: '有免费订阅可用！',
            subtitle: '{{company}} 正为学生赞助 {{tier}} 订阅。',
            instruction: '注册或登录即可领取您的免费订阅。',
            registerBtn: '注册并领取',
            loginBtn: '登录并领取',
            claimTitle: '领取您的免费订阅',
            sharedBy: '{{company}} 正在赞助您的 {{tier}} 订阅！',
            fullAccess: '这将为您提供一年的全额奖学金申请权限。',
            planFree: '{{tier}} 计划 — 1 年免费',
            normalPrice: '原价 ${{price}}/年 — 由 {{company}} 免除',
            claimBtn: '领取免费订阅',
            remainingSlots: '剩余 {{count}} 个赞助订阅名额',
            remainingSlots_plural: '剩余 {{count}} 个赞助订阅名额',
          }
        }
      },
      scholarships: {
        title: '寻找您的奖学金',
        subtitle: '浏览来自全球的数千项奖学金。使用我们的高级筛选器，寻找匹配您资料的机会。',
        searchPlaceholder: '按名称、提供商搜索奖学金...',
        sortBy: '排序方式：',
        sort: {
          relevant: '相关性',
          deadline: '截止日期',
          value: '价值',
          recent: '最近添加',
        },
        filters: '筛选',
        showResults: '显示 {{count}} 个结果',
        previous: '上一页',
        next: '下一页',
        noResults: '未找到奖学金项目',
        noResultsDesc: "未找到符合您条件的奖学金。请尝试调整筛选条件或搜索关键词。",
        clearFilters: '清除所有筛选',
      },
      boardingSchools: {
        title: '寄宿学校',
        subtitle: '探索东南亚顶尖的寄宿学校。比较类别、地点，为您的教育找到理想的环境。',
        searchPlaceholder: '按名称搜索学校...',
        filters: '筛选',
        noResults: '未找到学校',
        noResultsDesc: "未找到符合您条件的寄宿学校。请尝试调整筛选条件或搜索关键词。",
        category: '类别',
        state: '州/省',
        managedBy: '由 {{provider}} 管理',
      },
      internships: {
        title: '实习机会',
        subtitle: '通过顶尖公司的实习机会发现您的职业新台阶。获得宝贵经验，开启您的专业旅程。',
        searchPlaceholder: '搜索职位或公司...',
        filters: '筛选',
        noResults: '未找到实习机会',
        noResultsDesc: "未找到匹配您搜索的活跃实习机会。",
        applyBy: '请在 {{date}} 前申请',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
