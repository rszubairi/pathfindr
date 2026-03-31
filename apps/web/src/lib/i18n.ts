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
            extracurricularBasic: 'Include extracurricular activities to showcase your leadership and personality.',
            extracurricularCount: 'Add at least 3 extracurricular activities to demonstrate a well-rounded profile.',
          },
          sections: {
            education: 'Education',
            projects: 'Key Projects',
            expertise: 'Expertise',
            certificates: 'Certificates',
            testScores: 'Test Scores',
            extracurriculars: 'Extracurricular Activities',
          },
          placeholders: {
            noEducation: 'No education entries added. Recruiters prioritize academic background.',
            noProjects: 'Add relevant projects to demonstrate practical application of your skills.',
            noSkills: 'List your core technical and soft skills.',
            noCertificates: 'Showcase your formal certifications and continuous learning.',
            noTestScores: 'Standardized scores (SAT, IELTS, etc.) add weight to your academic standing.',
            noExtracurriculars: 'No extracurricular activities added yet.',
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
        emphasize: {
          title: 'Earn 1 Year Free!',
          description: 'Refer 5 friends to Pathfindr and get a 1-year Pro subscription automatically activated!',
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
        featuredResults: 'Featured Results',
        featuredBadge: 'Featured',
        viewDetails: 'View Details',
        notifyMe: 'Notify Me',
        filtersList: {
          title: 'Filters',
          clearAll: 'Clear all',
          countries: 'Countries',
          fieldsOfStudy: 'Fields of Study',
          providerType: 'Provider Type',
          scholarshipValue: 'Scholarship Value',
          minValue: 'Min Value (USD)',
          maxValue: 'Max Value (USD)',
          deadline: 'Application Deadline',
          within: 'Within',
          month: 'month',
          months: 'months',
          anyTime: 'Any time',
        }
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
        filtersList: {
          schoolType: 'School Type',
          gender: 'Gender',
          boysOnly: 'Boys Only',
          girlsOnly: 'Girls Only',
          coed: 'Co-ed (Mixed)',
          entryLevel: 'Entry Level',
          managedBy: 'Managed By',
          all: 'All',
        }
      },
      internships: {
        title: 'Internships',
        subtitle: 'Find your next career step with internships from top companies. Gain valuable experience and kickstart your professional journey.',
        searchPlaceholder: 'Search roles or companies...',
        filters: 'Filters',
        noResults: 'No internships found',
        noResultsDesc: "We couldn't find any active internships matching your search.",
        applyBy: 'Apply by {{date}}',
        filtersList: {
          fullTime: 'Full-time',
          partTime: 'Part-time',
          remote: 'Remote',
        }
      },
      dashboard: {
        scholarships: {
          featureAction: 'Feature',
          featureModalTitle: 'Feature Scholarship',
          featureModalDesc: 'Feature your scholarship at the top of the list for 30 days. This will increase visibility and attract more qualified applicants.',
          featureModalPrice: 'Monthly fee: USD 10.00',
          featureBtn: 'Pay & Feature Now',
          featureSuccessTitle: 'Scholarship Featured!',
          featureSuccessDesc: 'Your scholarship is now featured at the top of the listings.',
          isFeatured: 'Featured',
        }
      }
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
            extracurricularBasic: 'Sertakan aktiviti kokurikulum untuk menunjukkan kepimpinan dan keperibadian anda.',
            extracurricularCount: 'Tambah sekurang-kurangnya 3 aktiviti kokurikulum untuk menunjukkan profil yang lengkap.',
          },
          sections: {
            education: 'Pendidikan',
            projects: 'Projek Utama',
            expertise: 'Kepakaran',
            certificates: 'Sijil',
            testScores: 'Skor Ujian',
            extracurriculars: 'Aktiviti Kokurikulum',
          },
          placeholders: {
            noEducation: 'Tiada kemasukan pendidikan ditambah. Perekrut mengutamakan latar belakang akademik.',
            noProjects: 'Tambah projek yang relevan untuk menunjukkan aplikasi praktikal kemahiran anda.',
            noSkills: 'Senaraikan kemahiran teknikal dan insaniah teras anda.',
            noCertificates: 'Tunjukkan sijil formal dan pembelajaran berterusan anda.',
            noTestScores: 'Skor piawai (SAT, IELTS, dll.) menambah berat kepada kedudukan akademik anda.',
            noExtracurriculars: 'Tiada aktiviti kokurikulum ditambah lagi.',
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
        emphasize: {
          title: 'Dapatkan 1 Tahun Percuma!',
          description: 'Rujuk 5 rakan ke Pathfindr dan dapatkan langganan Pro selama 1 tahun diaktifkan secara automatik!',
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
        featuredResults: 'Keputusan Pilihan',
        featuredBadge: 'Pilihan',
        viewDetails: 'Lihat Butiran',
        notifyMe: 'Beritahu Saya',
        filtersList: {
          title: 'Penapis',
          clearAll: 'Padam semua',
          countries: 'Negara',
          fieldsOfStudy: 'Bidang Pengajian',
          providerType: 'Jenis Pemberi',
          scholarshipValue: 'Nilai Biasiswa',
          minValue: 'Nilai Minimum (USD)',
          maxValue: 'Nilai Maksimum (USD)',
          deadline: 'Tarikh Akhir Permohonan',
          within: 'Dalam masa',
          month: 'bulan',
          months: 'bulan',
          anyTime: 'Bila-bila masa',
        }
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
        filtersList: {
          schoolType: 'Jenis Sekolah',
          gender: 'Jantina',
          boysOnly: 'Lelaki Sahaja',
          girlsOnly: 'Perempuan Sahaja',
          coed: 'Bercampur (Lelaki & Perempuan)',
          entryLevel: 'Tahap Kemasukan',
          managedBy: 'Diuruskan Oleh',
          all: 'Semua',
        }
      },
      internships: {
        title: 'Latihan Amali',
        subtitle: 'Cari langkah kerjaya anda seterusnya dengan latihan amali daripada syarikat terkemuka. Dapatkan pengalaman berharga dan mulakan perjalanan profesional anda.',
        searchPlaceholder: 'Cari peranan atau syarikat...',
        filters: 'Penapis',
        noResults: 'Tiada latihan amali ditemui',
        noResultsDesc: "Kami tidak dapat mencari latihan amali yang aktif yang sepadan dengan carian anda.",
        applyBy: 'Mohon sebelum {{date}}',
        filtersList: {
          fullTime: 'Sepenuh Masa',
          partTime: 'Sambilan',
          remote: 'Jarak Jauh',
        }
      },
      dashboard: {
        scholarships: {
          featureAction: 'Pilihan',
          featureModalTitle: 'Pilihan Biasiswa',
          featureModalDesc: 'Paparkan biasiswa anda di bahagian atas senarai selama 30 hari. Ini akan meningkatkan keterlihatan dan menarik lebih ramai pemohon yang berkelayakan.',
          featureModalPrice: 'Yuran bulanan: USD 10.00',
          featureBtn: 'Bayar & Jadikan Pilihan Sekarang',
          featureSuccessTitle: 'Biasiswa Dijadikan Pilihan!',
          featureSuccessDesc: 'Biasiswa anda kini dipaparkan di bahagian atas senarai.',
          isFeatured: 'Pilihan',
        }
      }
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
            extracurricularBasic: '包含课外活动以展示您的领导能力和个性。',
            extracurricularCount: '添加至少 3 项课外活动以展示全面的个人资料。',
          },
          sections: {
            education: '教育经历',
            projects: '重点项目',
            expertise: '专业技能',
            certificates: '获奖证书',
            testScores: '考试成绩',
            extracurriculars: '课外活动',
          },
          placeholders: {
            noEducation: '尚未添加教育经历。招聘人员非常看重学术背景。',
            noProjects: '添加相关项目以展示您的技能实际应用。',
            noSkills: '列出您的核心技术和软技能。',
            noCertificates: '展示您的正式证书和持续学习成果。',
            noTestScores: '标准化考试成绩（SAT、IELTS 等）会增加您的学术分量。',
            noExtracurriculars: '尚未添加课外活动。',
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
        emphasize: {
          title: '赚取 1 年免费订阅！',
          description: '向朋友推荐 Pathfindr，如果 5 位好友通过您的代码注册，您将自动获得 1 年专业版订阅！',
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
        featuredResults: '精选结果',
        featuredBadge: '精选',
        viewDetails: '查看详情',
        notifyMe: '通知我',
        filtersList: {
          title: '筛选',
          clearAll: '清除全部',
          countries: '国家',
          fieldsOfStudy: '研究领域',
          providerType: '提供者类型',
          scholarshipValue: '奖学金价值',
          minValue: '最低价值 (USD)',
          maxValue: '最高价值 (USD)',
          deadline: '申请截止日期',
          within: '在',
          month: '个月内',
          months: '个月内',
          anyTime: '随时',
        }
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
        filtersList: {
          schoolType: '学校类型',
          gender: '性别',
          boysOnly: '仅限男生',
          girlsOnly: '仅限女生',
          coed: '混合 (男女同校)',
          entryLevel: '入学阶段',
          managedBy: '管理机构',
          all: '全部',
        }
      },
      internships: {
        title: '实习机会',
        subtitle: '通过顶尖公司的实习机会发现您的职业新台阶。获得宝理解并开启您的专业旅程。',
        searchPlaceholder: '搜索职位或公司...',
        filters: '筛选',
        noResults: '未找到实习机会',
        noResultsDesc: "未找到匹配您搜索的活跃实习机会。",
        applyBy: '请在 {{date}} 前申请',
        filtersList: {
          fullTime: '全职',
          partTime: '兼职',
          remote: '远程',
        }
      },
      dashboard: {
        scholarships: {
          featureAction: '精选',
          featureModalTitle: '设为精选奖学金',
          featureModalDesc: '将您的奖学金在列表顶部展示 30 天。这将增加曝光率并吸引更多高质量的申请者。',
          featureModalPrice: '月费：10.00 美元',
          featureBtn: '立即支付并设为精选',
          featureSuccessTitle: '奖学金已设为精选！',
          featureSuccessDesc: '您的奖学金现在显示在列表的最顶部。',
          isFeatured: '精选',
      }
    },
    },
  },
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        scholarships: 'Becas',
        boardingschools: 'Internados',
        internationalschools: 'Escuelas Internacionales',
        internships: 'Pasantías',
        pricing: 'Precios',
        features: 'Funciones',
        about: 'Sobre nosotros',
        signIn: 'Iniciar sesión',
        getStarted: 'Empezar',
      },
      hero: {
        badge: 'Descubre tu viaje educativo global',
        titlePart1: 'Encuentra tu ',
        titlePart2: 'beca perfecta',
        subtitle: 'Conéctate con miles de becas, internados, escuelas internacionales y pasantías en el sudeste asiático y más allá. Tu futuro comienza aquí.',
        browseBtn: 'Ver becas',
        learnMoreBtn: 'Más información',
        trustedBy: 'Con la confianza de más de 5,000 estudiantes',
        available: 'Más de 10,000 becas disponibles',
        countriesCount: 'Más de 50 países',
      },
      home: {
        stats: {
          scholarships: { label: 'Becas disponibles', desc: 'Diversas oportunidades en todos los campos' },
          countries: { label: 'Países', desc: 'Alcance global en el sudeste asiático y más allá' },
          students: { label: 'Estudiantes ayudados', desc: 'Historias de éxito de nuestra comunidad' },
          awarded: { label: 'Becas otorgadas', desc: 'Valor total facilitado a través de nuestra plataforma' },
        },
        howItWorks: {
          title: 'Cómo funciona Pathfindr',
          subtitle: 'Tu viaje hacia una educación global comienza aquí. Sigue estos sencillos pasos para encontrar y asegurar tu beca perfecta.',
          steps: {
            step1: { title: 'Crea tu perfil', desc: 'Regístrate y cuéntanos sobre tu formación académica, intereses y objetivos.' },
            step2: { title: 'Descubre oportunidades', desc: 'Explora miles de becas utilizando nuestros filtros inteligentes.' },
            step3: { title: 'Solicita con confianza', desc: 'Realiza un seguimiento de tus solicitudes, gestiona los plazos y accede a recursos útiles.' },
            step4: { title: 'Logra tus sueños', desc: 'Asegura tu beca y comienza tu viaje educativo.' },
          }
        },
        features: {
          title: 'Todo lo que necesitas para triunfar',
          subtitle: 'Pathfindr proporciona herramientas y recursos potentes para ayudarte a descubrir y asegurar tu oportunidad de beca perfecta.',
          list: {
            smartSearch: { title: 'Búsqueda inteligente', desc: 'Filtros avanzados para encontrar becas que coincidan con tu perfil.' },
            personalized: { title: 'Emparejamiento personalizado', desc: 'Recomendaciones impulsadas por IA basadas en tus objetivos.' },
            global: { title: 'Oportunidades globales', desc: 'Acceso a becas de más de 50 países.' },
            verified: { title: 'Listados verificados', desc: 'Todas las becas están verificadas para mayor precisión.' },
            tracking: { title: 'Seguimiento de solicitudes', desc: 'Realiza un seguimiento de tus solicitudes en un solo panel de control.' },
            secure: { title: 'Seguro y privado', desc: 'Tu información personal está protegida.' },
          },
          detailed: [
            {
              title: 'Búsqueda y filtros avanzados',
              description: 'Encuentra exactamente lo que buscas con potentes capacidades de búsqueda y filtros inteligentes.',
              benefits: [
                'Filtrado por múltiples criterios',
                'Resultados de búsqueda instantáneos',
                'Preferencias de búsqueda guardadas',
              ],
            },
            {
              title: 'Emparejamiento impulsado por IA',
              description: 'Nuestro algoritmo de emparejamiento inteligente analiza tu perfil para recomendar oportunidades con la mayor probabilidad de éxito.',
              benefits: [
                'Recomendaciones personalizadas',
                'Puntuación de coincidencia para cada beca',
                'Clasificación de prioridad inteligente',
              ],
            },
            {
              title: 'Notificaciones en tiempo real',
              description: 'Nunca pierdas un plazo. Recibe notificaciones instantáneas de nuevas becas que coincidan con tu perfil.',
              benefits: [
                'Preferencias personalizables',
                'Recordatorios de plazos',
                'Alertas de cambio de estado',
              ],
            },
          ]
        },
        featured: {
          title: 'Becas destacadas',
          subtitle: 'Explora nuestras mejores oportunidades de becas que aceptan solicitudes actualmente.',
          viewAll: 'Ver todas las becas',
        },
        testimonials: {
          title: 'Historias de éxito de nuestros estudiantes',
          subtitle: 'Únete a miles de estudiantes que han encontrado su beca perfecta a través de Pathfindr.',
          list: [
            {
              quote: "Pathfindr hizo que encontrar la beca adecuada fuera mucho más fácil. La función de emparejamiento personalizado me conectó con oportunidades que ni siquiera sabía que existían. ¡Ahora estoy estudiando Ciencias de la Computación en la NUS!",
              university: 'Universidad Nacional de Singapur',
              country: 'Singapur',
            },
            {
              quote: "Estaba abrumado por la cantidad de becas disponibles hasta que encontré Pathfindr. Los filtros inteligentes de la plataforma y el seguimiento de los plazos me ayudaron a mantenerme organizada.",
              university: 'Universidad de Melbourne',
              country: 'Australia',
            },
            {
              quote: "Como estudiante universitario de primera generación, navegar por las solicitudes de becas fue desalentador. El seguimiento de solicitudes de Pathfindr me dio confianza. ¡Ahora estoy estudiando Medicina!",
              university: 'Universidad de Chulalongkorn',
              country: 'Tailandia',
            },
          ]
        },
        cta: {
          title: '¿Listo para comenzar tu viaje?',
          subtitle: 'Crea tu perfil hoy y desbloquea el acceso a miles de oportunidades. Únete a nuestra comunidad de estudiantes exitosos.',
          createAccount: 'Crear cuenta gratuita',
          browseScholarships: 'Ver becas',
        }
      },
      pricing: {
        title: 'Elige tu plan',
        subtitle: 'Suscríbete para empezar a solicitar becas. Elige el plan que se adapte a tus necesidades y desbloquea tu camino hacia las oportunidades educativas.',
        mostPopular: 'Más popular',
        currentPlan: 'Plan actual',
        getStarted: 'Obtener {{name}}',
        appsPerYear: '{{count}} solicitudes de beca al año',
        whatsIncluded: 'Qué incluye:',
        tiers: {
          pro: {
            name: 'Pro',
            features: [
              'Solicita 5 becas al año',
              'Detalles completos de becas y elegibilidad',
              'Panel de seguimiento de solicitudes',
              'Notificaciones por correo sobre plazos',
            ]
          },
          expert: {
            name: 'Expert',
            features: [
              'Solicita 20 becas al año',
              'Detalles completos de becas y elegibilidad',
              'Panel de seguimiento de solicitudes',
              'Notificaciones por correo sobre plazos',
              'Soporte prioritario',
              'Recomendaciones de becas personalizadas',
            ]
          }
        },
        faq: {
          title: 'Preguntas frecuentes',
          q1: {
            q: '¿Qué cuenta como una solicitud?',
            a: 'Cada vez que haces clic en "Solicitar ahora" en una beca y eres redirigido a la página de solicitud del proveedor de la beca, cuenta como una solicitud.'
          },
          q2: {
            q: '¿Cuándo se restablece mi límite de solicitudes?',
            a: 'El recuento de solicitudes se restablece anualmente cuando se renueva tu suscripción.'
          },
          q3: {
            q: '¿Puedo mejorar mi plan?',
            a: '¡Sí! Puedes pasar de Pro a Expert en cualquier momento. La diferencia de precio se prorrateará para el resto del periodo de facturación.'
          },
          q4: {
            q: '¿Puedo cancelar en cualquier momento?',
            a: 'Por supuesto. Puedes cancelar tu suscripción en cualquier momento desde la configuración de tu cuenta.'
          }
        }
      },
      profile: {
        complete: {
          title: 'Completa tu perfil académico',
          subtitle: 'Ayúdanos a conectarte con las mejores becas',
        },
        steps: {
          personalDetails: 'Detalles personales',
          education: 'Educación',
          testScores: 'Resultados de exámenes',
          achievements: 'Logros',
          preferences: 'Preferencias',
          activities: 'Actividades',
        },
        forms: {
          common: {
            back: 'Atrás',
            next: 'Siguiente',
            required: 'obligatorio',
            select: 'Seleccionar',
            add: 'Añadir',
            delete: 'Eliminar',
            other: 'Otro',
            saveProgress: 'Guardando progreso...',
          },
          personalDetails: {
            title: 'Detalles personales',
            subtitle: "Empecemos por una información básica sobre ti",
            dateOfBirth: 'Fecha de nacimiento',
            gender: {
              label: 'Género',
              placeholder: 'Seleccionar género',
              male: 'Hombre',
              female: 'Mujer',
              other: 'Otro',
              preferNotToSay: 'Prefiero no decirlo',
            },
            nationality: {
              label: 'Nacionalidad',
              placeholder: 'ej. Española, Mexicana',
            },
            country: {
              label: 'País de residencia',
              placeholder: 'ej. España, México',
            },
          },
          education: {
            title: 'Historial educativo',
            subtitle: 'Añade tus cualificaciones académicas (la más reciente primero)',
            entry: 'Educación {{index}}',
            addAnother: 'Añadir otra educación',
            institution: {
              label: 'Nombre de la institución',
              placeholder: 'ej. Universidad Complutense',
            },
            qualification: {
              label: 'Cualificación',
              placeholder: 'Seleccionar cualificación',
            },
            fieldOfStudy: {
              label: 'Campo de estudio',
              placeholder: 'ej. Ingeniería Informática',
            },
            startDate: 'Fecha de inicio',
            endDate: {
              label: 'Fecha de finalización',
              helper: 'Dejar vacío si estás estudiando actualmente',
            },
            grade: {
              label: 'Nota/Grado',
              placeholder: 'ej. Matrícula de Honor, A+',
            },
            gpa: {
              label: 'Nota media',
              placeholder: 'ej. 3.8',
            },
            qualifications: {
              highSchool: 'Diploma de Educación Secundaria',
              associate: 'Grado asociado',
              bachelorArts: 'Grado en Artes',
              bachelorScience: 'Grado en Ciencias',
              bachelorEng: 'Grado en Ingeniería',
              masterArts: 'Máster en Artes',
              masterScience: 'Máster en Ciencias',
              mba: 'MBA',
              phd: 'Doctorado',
            },
          },
          testScores: {
            title: 'Resultados de exámenes estandarizados',
            subtitle: 'Añade los resultados de los exámenes que hayas realizado.',
            sat: { label: 'Resultado SAT', placeholder: 'ej. 1450', helper: 'Puntuación total (400–1600)' },
            ielts: { label: 'Resultado IELTS', placeholder: 'ej. 7.5', helper: 'Escala total (0–9)' },
            toefl: { label: 'Resultado TOEFL', placeholder: 'ej. 105', helper: 'Puntuación total (0–120)' },
            gre: { label: 'Resultado GRE', placeholder: 'ej. 325', helper: 'Combinada (260–340)' },
            gmat: { label: 'Resultado GMAT', placeholder: 'ej. 720', helper: 'Puntuación total (200–800)' },
          },
          achievements: {
            title: 'Logros y habilidades',
            subtitle: 'Muestra tus certificados, proyectos y habilidades.',
            certificates: {
              title: 'Certificados',
              entry: 'Certificado {{index}}',
              addAnother: 'Añadir certificado',
              itemTitle: 'Título del certificado',
              issuer: 'Emisor',
              dateIssued: 'Fecha de emisión',
            },
            projects: {
              title: 'Proyectos académicos / personales',
              entry: 'Proyecto {{index}}',
              addAnother: 'Añadir proyecto',
              itemTitle: 'Título del proyecto',
              description: 'Descripción',
              technologies: 'Tecnologías',
            },
            skills: {
              title: 'Habilidades',
              placeholder: 'Escribe una habilidad y pulsa Intro',
            },
          },
          preferences: {
            title: 'Preferencias profesionales',
            subtitle: 'Cuéntanos lo que te interesa para buscar becas adecuadas',
            interests: {
              label: 'Intereses',
              placeholder: 'ej. Tecnología, Sanidad, Educación',
            },
            studyCountries: {
              label: 'Países de estudio preferidos',
              placeholder: 'ej. Estados Unidos, Reino Unido, Alemania',
            },
            availability: {
              label: '¿Cuándo planeas empezar?',
              placeholder: 'ej. Otoño 2026',
            },
            complete: 'Completar perfil',
            saving: 'Guardando perfil...',
          },
        },
      },
      footer: {
        description: 'Tu camino hacia oportunidades educativas globales. Conéctate con becas, internados, escuelas internacionales y pasantías.',
        platform: 'Plataforma',
        resources: 'Recursos',
        connect: 'Conectar',
        links: {
          universities: 'Universidades',
          internships: 'Pasantías',
          jobs: 'Empleos',
          knowledgeBase: 'Base de conocimientos',
          privacyPolicy: 'Política de privacidad',
          termsOfService: 'Términos de servicio',
        },
        allRightsReserved: 'Todos los derechos reservados.',
      },
      internationalSchools: {
        title: 'Escuelas Internacionales',
        subtitle: 'Explora las mejores escuelas internacionales. Compara currículos, tarifas y encuentra la escuela perfecta.',
        schoolsCount: '{{count}} escuelas',
        search: {
          placeholder: 'Buscar escuelas por nombre...',
        },
        sort: {
          label: 'Ordenar por:',
          name: 'Nombre',
          country: 'País',
          city: 'Ciudad',
        },
        results: {
          school: '{{count}} escuela encontrada',
          schools: '{{count}} escuelas encontradas',
        },
        empty: {
          title: 'No se encontraron escuelas',
          description: "No pudimos encontrar internados que coincidan con tus criterios.",
          clearAll: 'Borrar todos los filtros',
        },
        filters: {
          title: 'Filtros',
          clearAll: 'Borrar todo',
          country: 'País',
          curriculum: 'Currículo',
        },
        location: {
          title: 'Tu ubicación',
          locating: 'Localizando...',
          useCurrent: 'Usar mi ubicación',
          or: 'o',
          selectCity: 'Seleccionar ciudad',
          distance: 'Distancia',
        },
        card: {
          fees: 'Tarifas:',
          visitWebsite: 'Visitar sitio web',
        },
        pagination: {
          previous: 'Anterior',
          next: 'Siguiente',
        },
      },
      profileView: {
        title: 'Mi perfil',
        editProfile: 'Editar perfil',
        notFound: 'Perfil no encontrado',
        notFoundDesc: "Aún no has completado tu perfil.",
        completeProfileBtn: 'Completar perfil',
        resumeOptimizer: {
          title: 'Optimizador de CV',
          score: 'Puntuación del perfil',
          scoreLabel: 'Puntuación',
          ranking: 'Clasificación',
          generateBtn: 'Generar CV optimizado',
          suggestions: 'Sugerencias de mejora',
          copyLink: 'Copiar enlace para compartir',
          viewPublic: 'Ver CV público',
          copySuccess: '¡Enlace copiado al portapapeles!',
          perfectProfile: '¡Tu perfil es perfecto! Estás listo para generar tu CV optimizado.',
          aiDescription: 'Nuestro sistema impulsado por IA da formato a tu perfil en un CV profesional listo para los reclutadores.',
          previewTitle: 'Vista previa del CV',
          printBtn: 'Imprimir / Guardar como PDF',
          footer: 'Generado por el motor de optimización de CV de PathFindr',
          percentageComplete: '{{progress}}% completado',
          levels: {
            needsImprovement: 'Necesita mejorar',
            goodProgress: 'Buen progreso',
            professional: 'Profesional',
            elite: 'Élite',
          },
          descriptions: {
            needsImprovement: 'Tu perfil necesita más detalles para destacar.',
            goodProgress: 'Estás construyendo una base sólida.',
            professional: 'Estás listo para la mayoría de las oportunidades.',
            elite: 'Tu perfil es altamente competitivo.',
          },
          suggestionsList: {
            phone: 'Añade tu número de teléfono.',
            gpa: 'Incluye tu nota media.',
            education: 'Enumera tu historial académico.',
            skills: 'Añade más habilidades (al menos 8).',
            skillsBasic: 'Muestra tus habilidades técnicas.',
            projectDetail: 'Escribe descripciones más detalladas de tus proyectos.',
            projectDetailBasic: 'Detalla proyectos académicos o personales.',
            certificates: 'Añade certificaciones.',
            subjectScores: 'Añade resultados de IGCSE, SPM u O-Level.',
            extracurricularBasic: 'Incluye actividades extracurriculares.',
            extracurricularCount: 'Añade al menos 3 actividades extracurriculares.',
          },
          sections: {
            education: 'Educación',
            projects: 'Proyectos clave',
            expertise: 'Experiencia',
            certificates: 'Certificados',
            testScores: 'Resultados de exámenes',
            extracurriculars: 'Actividades extracurriculares',
          },
          placeholders: {
            noEducation: 'Sin entradas de educación.',
            noProjects: 'Añade proyectos relevantes.',
            noSkills: 'Enumera tus habilidades.',
            noCertificates: 'Muestra tus certificaciones.',
            noTestScores: 'Los exámenes estandarizados añaden valor.',
            noExtracurriculars: 'Sin actividades extracurriculares aún.',
          }
        },
        common: {
          in: 'en',
          score: 'Puntuación',
        },
        fields: {
          dob: 'Fecha de nacimiento',
          gender: 'Género',
          nationality: 'Nacionalidad',
          country: 'País',
          phone: 'Teléfono',
          gpa: 'Nota media',
          grade: 'Grado/Calificación',
          present: 'Actualidad',
          preferredCountries: 'Países preferidos',
          availability: 'Disponibilidad',
        }
      },
      referral: {
        title: 'Programa de recomendación',
        code: {
          label: 'Tu código de recomendación',
          copy: 'Copiar código',
          copyLink: 'Copiar enlace',
          description: 'Comparte este código para ganar recompensas',
        },
        emphasize: {
          title: '¡Gana 1 año gratis!',
          description: '¡Recomienda Pathfindr a 5 amigos y obtén una suscripción Pro de 1 año activada automáticamente!',
        },
        progress: {
          title: 'Progreso de recomendación',
          count: '{{count}}/5 amigos',
          earned: '¡Has ganado una recompensa!',
          inviteToEarn: 'Invita a 5 amigos para ganar una suscripción Pro gratuita',
          moreNeeded: 'Falta {{count}} amigo para ganar Pro',
          moreNeeded_plural: 'Faltan {{count}} amigos para ganar Pro',
        },
        rewards: {
          title: 'Tus recompensas',
          proSubscription: 'Suscripción Pro',
          coupon: 'Cupón: ',
          status: {
            active: 'Activo',
            available: 'Disponible',
            claimed: 'Canjeado'
          }
        },
        claim: {
          success: {
            title: '¡Suscripción activada!',
            description: 'Tu suscripción Pro gratuita ya está activa gracias a {{name}}.',
            nextSteps: 'Ya puedes empezar a solicitar becas.',
            browseBtn: 'Ver becas',
            viewSubBtn: 'Ver suscripción',
          },
          validating: 'Validando código de cupón...',
          error: {
            notAvailable: 'Cupón no disponible',
            invalidOrClaimed: 'Este código de cupón no es válido o ya ha sido canjeado.',
            viewPricing: 'Ver planes de precios',
            studentRequired: 'Se requiere cuenta de estudiante',
            studentRequiredDesc: 'Los cupones de recomendación son solo para estudiantes.',
            goToDashboard: 'Ir al panel de control',
            generic: 'Error al canjear el cupón. Por favor, inténtalo de nuevo.',
          },
          gift: {
            title: '¡Suscripción Pro gratuita!',
            subtitle: '{{name}} está compartiendo una recompensa contigo.',
            instruction: 'Regístrate o inicia sesión para canjear tu suscripción Pro gratuita.',
            registerBtn: 'Registrarse para canjear',
            loginBtn: 'Iniciar sesión para canjear',
            claimTitle: 'Canjea tu suscripción Pro gratuita',
            planFree: 'Plan Pro — Gratis por 1 año',
            claimBtn: 'Canjear suscripción gratuita'
          }
        }
      },
      sponsorship: {
        claim: {
          success: {
            title: '¡Suscripción activada!',
            description: 'Tu suscripción {{tier}} ya está activa, patrocinada por {{company}}.',
            nextSteps: 'Ya puedes empezar a solicitar becas.',
            browseBtn: 'Ver becas',
            viewSubBtn: 'Ver suscripción',
          },
          validating: 'Validando código de cupón...',
          error: {
            notAvailable: 'Cupón no disponible',
            invalidOrExhausted: 'Este código de cupón no es válido o todas las suscripciones han sido canjeadas.',
            viewPricing: 'Ver planes de precios',
            generic: 'Error al canjear la suscripción.',
          },
          gift: {
            title: '¡Suscripción gratuita disponible!',
            subtitle: '{{company}} patrocina suscripciones {{tier}} para estudiantes.',
            instruction: 'Regístrate o inicia sesión para canjear tu suscripción gratuita.',
            claimTitle: 'Canjea tu suscripción gratuita',
            planFree: 'Plan {{tier}} — Gratis por 1 año',
            claimBtn: 'Canjear suscripción gratuita',
          }
        }
      },
      scholarships: {
        title: 'Encuentra tu beca',
        subtitle: 'Explora miles de becas de todo el mundo. Utiliza nuestros filtros avanzados.',
        searchPlaceholder: 'Buscar becas por nombre, proveedor...',
        sortBy: 'Ordenar por:',
        sort: {
          relevant: 'Relevante',
          deadline: 'Plazo',
          value: 'Valor',
          recent: 'Reciente',
        },
        filters: 'Filtros',
        showResults: 'Mostrar {{count}} resultados',
        previous: 'Anterior',
        next: 'Siguiente',
        noResults: 'No se encontraron becas',
        clearFilters: 'Borrar todos los filtros',
        viewDetails: 'Ver detalles',
        notifyMe: 'Notificarme',
        filtersList: {
          title: 'Filtros',
          clearAll: 'Borrar todo',
          countries: 'Países',
          fieldsOfStudy: 'Campos de estudio',
          providerType: 'Tipo de proveedor',
          scholarshipValue: 'Valor de la beca',
          minValue: 'Valor mínimo (USD)',
          maxValue: 'Valor máximo (USD)',
          deadline: 'Plazo de solicitud',
          anyTime: 'Cualquier momento',
        }
      },
      boardingSchools: {
        title: 'Internados',
        subtitle: 'Descubre los mejores internados en el sudeste asiático.',
        searchPlaceholder: 'Buscar escuelas por nombre...',
        filters: 'Filtros',
        noResults: 'No se encontraron escuelas',
        category: 'Categoría',
        state: 'Estado/Provincia',
        managedBy: 'Gestionado por {{provider}}',
        filtersList: {
          schoolType: 'Tipo de escuela',
          gender: 'Género',
          boysOnly: 'Solo niños',
          girlsOnly: 'Solo niñas',
          coed: 'Mixto',
          entryLevel: 'Nivel de entrada',
          managedBy: 'Gestionado por',
          all: 'Todos',
        }
      },
      internships: {
        title: 'Pasantías',
        subtitle: 'Encuentra tu próximo paso profesional con pasantías en grandes empresas.',
        searchPlaceholder: 'Buscar roles o empresas...',
        filters: 'Filtros',
        noResults: 'No se encontraron pasantías',
        applyBy: 'Solicitar antes del {{date}}',
        filtersList: {
          fullTime: 'Tiempo completo',
          partTime: 'Tiempo parcial',
          remote: 'Remoto',
        }
      },
      dashboard: {
        scholarships: {
          featureAction: 'Destacar',
          featureModalTitle: 'Destacar beca',
          featureModalDesc: 'Destaca tu beca al principio de la lista durante 30 días.',
          featureBtn: 'Pagar y destacar ahora',
          featureSuccessTitle: '¡Beca destacada!',
          isFeatured: 'Destacada',
        }
      }
    }
  },
  pt: {
    translation: {
      nav: {
        home: 'Início',
        scholarships: 'Bolsas de Estudo',
        boardingschools: 'Internatos',
        internationalschools: 'Escolas Internacionais',
        internships: 'Estágios',
        pricing: 'Preços',
        features: 'Recursos',
        about: 'Sobre',
        signIn: 'Entrar',
        getStarted: 'Começar',
      },
      hero: {
        badge: 'Descubra sua jornada educacional global',
        titlePart1: 'Encontre sua ',
        titlePart2: 'bolsa perfeita',
        subtitle: 'Conecte-se com milhares de bolsas de estudo, internatos, escolas internacionais e estágios no Sudeste Asiático e além. Seu futuro começa aqui.',
        browseBtn: 'Ver bolsas',
        learnMoreBtn: 'Saiba mais',
        trustedBy: 'Confiado por mais de 5.000 alunos',
        available: 'Mais de 10.000 bolsas disponíveis',
        countriesCount: 'Mais de 50 países',
      },
      home: {
        stats: {
          scholarships: { label: 'Bolsas disponíveis', desc: 'Diversas oportunidades em todas as áreas' },
          countries: { label: 'Países', desc: 'Alcance global no Sudeste Asiático e além' },
          students: { label: 'Alunos ajudados', desc: 'Histórias de sucesso da nossa comunidade' },
          awarded: { label: 'Bolsas concedidas', desc: 'Valor total facilitado através da nossa plataforma' },
        },
        howItWorks: {
          title: 'Como o Pathfindr funciona',
          subtitle: 'Sua jornada para uma educação global começa aqui. Siga estes passos simples para encontrar e garantir sua bolsa perfeita.',
          steps: {
            step1: { title: 'Crie seu perfil', desc: 'Cadastre-se e conte-nos sobre sua formação acadêmica, interesses e objetivos.' },
            step2: { title: 'Descubra oportunidades', desc: 'Navegue por milhares de bolsas usando nossos filtros inteligentes.' },
            step3: { title: 'Candidate-se com confiança', desc: 'Acompanhe suas candidaturas, gerencie prazos e acesse recursos úteis.' },
            step4: { title: 'Realize seus sonhos', desc: 'Garanta sua bolsa e embarque em sua jornada educacional.' },
          }
        },
        features: {
          title: 'Tudo o que você precisa para ter sucesso',
          subtitle: 'O Pathfindr oferece ferramentas e recursos poderosos para ajudá-lo a descobrir e garantir sua oportunidade de bolsa ideal.',
          list: {
            smartSearch: { title: 'Busca Inteligente', desc: 'Filtros avançados para encontrar bolsas que correspondam ao seu perfil.' },
            personalized: { title: 'Correspondência Personalizada', desc: 'Recomendações baseadas em IA com base em seus objetivos.' },
            global: { title: 'Oportunidades Globais', desc: 'Acesse bolsas de mais de 50 países.' },
            verified: { title: 'Listagens Verificadas', desc: 'Todas as bolsas são verificadas quanto à precisão.' },
            tracking: { title: 'Acompanhamento de Candidaturas', desc: 'Acompanhe suas candidaturas em um único painel.' },
            secure: { title: 'Seguro e Privado', desc: 'Suas informações pessoais estão protegidas.' },
          },
          detailed: [
            {
              title: 'Busca Avançada e Filtros',
              description: 'Encontre exatamente o que você procura com recursos de busca poderosos e filtros inteligentes.',
              benefits: [
                'Filtragem por múltiplos critérios',
                'Resultados de busca instantâneos',
                'Preferências de busca salvas',
              ],
            },
            {
              title: 'Correspondência por IA',
              description: 'Nosso algoritmo de correspondência inteligente analisa seu perfil para recomendar oportunidades com maior probabilidade de sucesso.',
              benefits: [
                'Recomendações personalizadas',
                'Pontuação de correspondência para cada bolsa',
                'Ranking de prioridade inteligente',
              ],
            },
            {
              title: 'Notificações em Tempo Real',
              description: 'Nunca perca um prazo. Receba notificações instantâneas para novas bolsas que correspondam ao seu perfil.',
              benefits: [
                'Preferências personalizáveis',
                'Lembretes de prazos',
                'Alertas de mudança de status',
              ],
            },
          ]
        },
        featured: {
          title: 'Bolsas em Destaque',
          subtitle: 'Explore nossas principais oportunidades de bolsas que estão aceitando candidaturas no momento.',
          viewAll: 'Ver Todas as Bolsas',
        },
        testimonials: {
          title: 'Histórias de Sucesso de Nossos Alunos',
          subtitle: 'Junte-se a milhares de alunos que encontraram sua bolsa perfeita através do Pathfindr.',
          list: [
            {
              quote: "O Pathfindr tornou a busca pela bolsa certa muito mais fácil. O recurso de correspondência personalizada me conectou a oportunidades que eu nem sabia que existiam.",
              university: 'Universidade Nacional de Singapura',
              country: 'Singapura',
            },
          ]
        },
        cta: {
          title: 'Pronto para começar sua jornada?',
          subtitle: 'Crie seu perfil hoje e desbloqueie o acesso a milhares de oportunidades.',
          createAccount: 'Criar conta gratuita',
          browseScholarships: 'Ver bolsas',
        }
      },
      pricing: {
        title: 'Escolha seu plano',
        subtitle: 'Assine para começar a se candidatar a bolsas. Escolha o plano que melhor se adapta às suas necessidades.',
        mostPopular: 'Mais Popular',
        currentPlan: 'Plano Atual',
        getStarted: 'Obter {{name}}',
        appsPerYear: '{{count}} candidaturas a bolsas por ano',
        whatsIncluded: 'O que está incluído:',
        tiers: {
          pro: {
            name: 'Pro',
            features: [
              'Candidate-se a 5 bolsas por ano',
              'Detalhes completos da bolsa e elegibilidade',
              'Painel de acompanhamento de candidaturas',
              'Notificações por e-mail para prazos',
            ]
          },
          expert: {
            name: 'Expert',
            features: [
              'Candidate-se a 20 bolsas por ano',
              'Detalhes completos da bolsa e elegibilidade',
              'Painel de acompanhamento de candidaturas',
              'Notificações por e-mail para prazos',
              'Suporte prioritário',
              'Recomendações de bolsas personalizadas',
            ]
          }
        },
        faq: {
          title: 'Perguntas frequentes',
          q1: {
            q: 'O que conta como uma candidatura?',
            a: 'Cada vez que você clica em "Candidatar-se agora" em uma bolsa e é redirecionado para a página de inscrição do provedor, isso conta como uma candidatura.'
          },
          q2: {
            q: 'Quando o meu limite de candidaturas é redefinido?',
            a: 'Sua contagem de candidaturas é redefinida anualmente quando sua assinatura é renovada.'
          },
          q3: {
            q: 'Posso atualizar o meu plano?',
            a: 'Sim! Você pode atualizar de Pro para Expert a qualquer momento. A diferença de preço será rateada pelo restante do seu período de faturamento.'
          },
          q4: {
            q: 'Posso cancelar a qualquer momento?',
            a: 'Com certeza. Você pode cancelar sua assinatura a qualquer momento nas configurações da sua conta.'
          }
        }
      },
      profile: {
        complete: {
          title: 'Complete seu Perfil Acadêmico',
          subtitle: 'Ajude-nos a encontrar as melhores bolsas para você',
        },
        steps: {
          personalDetails: 'Dados Pessoais',
          education: 'Educação',
          testScores: 'Notas de Testes',
          achievements: 'Conquistas',
          preferences: 'Preferências',
          activities: 'Atividades',
        }
      },
      footer: {
        description: 'Seu caminho para oportunidades educacionais globais. Conecte-se com bolsas de estudo, internatos, escolas internacionais e estágios.',
        platform: 'Plataforma',
        resources: 'Recursos',
        connect: 'Conectar',
        links: {
          universities: 'Universidades',
          internships: 'Estágios',
          jobs: 'Empregos',
          knowledgeBase: 'Base de Conhecimento',
          privacyPolicy: 'Política de Privacidade',
          termsOfService: 'Termos de Serviço',
        },
        allRightsReserved: 'Todos os direitos reservados.',
      },
      internationalSchools: {
        title: 'Escolas Internacionais',
        subtitle: 'Explore as melhores escolas internacionais. Compare currículos, taxas e encontre a escola perfeita para a jornada educacional do seu filho.',
        schoolsCount: '{{count}} escolas',
        search: {
          placeholder: 'Buscar escolas por nome...',
        },
        sort: {
          label: 'Ordenar por:',
          name: 'Nome',
          country: 'País',
          city: 'Cidade',
        },
        results: {
          school: '{{count}} escola encontrada',
          schools: '{{count}} escolas encontradas',
        },
        empty: {
          title: 'Nenhuma escola encontrada',
          description: "Não conseguimos encontrar nenhuma escola que corresponda aos seus critérios. Tente ajustar seus filtros.",
          clearAll: 'Limpar Todos os Filtros',
        },
        filters: {
          title: 'Filtros',
          clearAll: 'Limpar tudo',
          country: 'País',
          curriculum: 'Currículo',
        },
        location: {
          title: 'Sua Localização',
          locating: 'Localizando...',
          useCurrent: 'Usar Minha Localização',
          or: 'ou',
          selectCity: 'Selecionar cidade',
          distance: 'Distância',
        },
        card: {
          fees: 'Taxas:',
          visitWebsite: 'Visitar Website',
        },
        pagination: {
          previous: 'Anterior',
          next: 'Próximo',
        },
      },
      scholarships: {
        title: 'Encontre sua Bolsa',
        subtitle: 'Navegue por milhares de bolsas de estudo de todo o mundo. Use nossos filtros avançados para encontrar oportunidades que correspondam ao seu perfil.',
        searchPlaceholder: 'Buscar bolsas por nome, provedor...',
        sortBy: 'Ordenar por:',
        sort: {
          relevant: 'Relevante',
          deadline: 'Prazo',
          value: 'Valor',
          recent: 'Recente',
        },
        filters: 'Filtros',
        showResults: 'Mostrar {{count}} resultados',
        previous: 'Anterior',
        next: 'Próximo',
        noResults: 'Nenhuma bolsa encontrada',
        clearFilters: 'Limpar todos os filtros',
        viewDetails: 'Ver detalhes',
        notifyMe: 'Notificar-me',
        filtersList: {
          title: 'Filtros',
          clearAll: 'Limpar Tudo',
          countries: 'Países',
          fieldsOfStudy: 'Campos de Estudo',
          providerType: 'Tipo de Provedor',
          scholarshipValue: 'Valor da Bolsa',
          minValue: 'Valor Mínimo (USD)',
          maxValue: 'Valor Máximo (USD)',
          deadline: 'Prazo de Inscrição',
          anyTime: 'Qualquer momento',
        }
      },
      boardingSchools: {
        title: 'Internatos',
        subtitle: 'Descubra os melhores internatos no sudeste asiático.',
        searchPlaceholder: 'Buscar escolas por nome...',
        filters: 'Filtros',
        noResults: 'Nenhuma escola encontrada',
        category: 'Categoria',
        state: 'Estado/Província',
        managedBy: 'Gerido por {{provider}}',
        filtersList: {
          schoolType: 'Tipo de escola',
          gender: 'Gênero',
          boysOnly: 'Apenas meninos',
          girlsOnly: 'Apenas meninas',
          coed: 'Misto',
          entryLevel: 'Nível de entrada',
          managedBy: 'Gerido por',
          all: 'Todos',
        }
      },
      internships: {
        title: 'Estágios',
        subtitle: 'Encontre seu próximo passo na carreira com estágios em grandes empresas.',
        searchPlaceholder: 'Buscar funções ou empresas...',
        filters: 'Filtros',
        noResults: 'Nenhum estágio encontrado',
        applyBy: 'Candidatar-se até {{date}}',
        filtersList: {
          fullTime: 'Tempo integral',
          partTime: 'Meio período',
          remote: 'Remoto',
        }
      },
      profileView: {
        title: 'Meu Perfil',
        editProfile: 'Editar Perfil',
        notFound: 'Perfil Não Encontrado',
        notFoundDesc: 'Você ainda não completou seu perfil. Complete-o para visualizar seu perfil aqui.',
        completeProfileBtn: 'Completar Perfil',
        resumeOptimizer: {
          title: 'Otimizador de Currículo',
          score: 'Pontuação do Perfil',
          scoreLabel: 'Pontuação',
          ranking: 'Ranking',
          generateBtn: 'Gerar Currículo Otimizado',
          suggestions: 'Sugestões para Melhoria',
          copyLink: 'Copiar Link de Compartilhamento',
          viewPublic: 'Ver Currículo Público',
          copySuccess: 'Link de compartilhamento copiado para a área de transferência!',
          perfectProfile: 'Seu perfil está perfeito! Você está pronto para gerar seu currículo otimizado.',
          aiDescription: 'Nosso sistema impulsionado por IA formata seu perfil em um currículo profissional pronto para recrutadores.',
          previewTitle: 'Visualização do Currículo',
          printBtn: 'Imprimir / Salvar como PDF',
          footer: 'Gerado pelo Motor de Otimização de Currículo do PathFindr',
          percentageComplete: '{{progress}}% Concluído',
          levels: {
            needsImprovement: 'Precisa Melhorar',
            goodProgress: 'Bom Progresso',
            professional: 'Profissional',
            elite: 'Elite',
          },
          descriptions: {
            needsImprovement: 'Seu perfil precisa de lebih detalhes para se destacar.',
            goodProgress: 'Você está construindo uma base sólida.',
            professional: 'Você está pronto para a maioria das oportunidades de carreira.',
            elite: 'Seu perfil é altamente competitivo.',
          },
          suggestionsList: {
            phone: 'Adicione seu número de telefone para recrutadores.',
            gpa: 'Inclua seu GPA ou notas para demonstrar excelência acadêmica.',
            education: 'Liste sua formação acadêmica.',
            skills: 'Adicione mais habilidades relacionadas ao setor (meta de pelo menos 8).',
            skillsBasic: 'Mostre suas habilidades técnicas e profissionais.',
            projectDetail: 'Escreva descrições mais detalhadas para seus projetos.',
            projectDetailBasic: 'Detalhe projetos acadêmicos ou pessoais para demonstrar experiência prática.',
            certificates: 'Adicione certificações para validar sua especialidade.',
            subjectScores: 'Adicione seus resultados de IGCSE, SPM ou O-Level para fortalecer seu perfil acadêmico.',
            extracurricularBasic: 'Inclua atividades extracurriculares para demonstrar liderança e personalidade.',
            extracurricularCount: 'Adicione pelo menos 3 atividades extracurriculares para demonstrar um perfil completo.',
          },
          sections: {
            education: 'Educação',
            projects: 'Projetos Principais',
            expertise: 'Especialidade',
            certificates: 'Certificados',
            testScores: 'Pontuações de Testes',
            extracurriculars: 'Atividades Extracurriculares',
          },
          placeholders: {
            noEducation: 'Nenhuma entrada de educação adicionada. Recrutadores priorizam formação acadêmica.',
            noProjects: 'Adicione projetos relevantes para demonstrar a aplicação prática de suas habilidades.',
            noSkills: 'Liste suas habilidades técnicas e comportamentais principais.',
            noCertificates: 'Mostre suas certificações formais e aprendizado contínuo.',
            noTestScores: 'Pontuações padronizadas (SAT, IELTS, etc.) agregam valor à sua posição acadêmica.',
            noExtracurriculars: 'Nenhuma atividade extracurricular adicionada ainda.',
          }
        },
        common: {
          in: 'em',
          score: 'Pontuação',
        },
        fields: {
          dob: 'Data de Nascimento',
          gender: 'Gênero',
          nationality: 'Nacionalidade',
          country: 'País de Residência',
          phone: 'Telefone',
          gpa: 'GPA',
          grade: 'Grau/Nota',
          present: 'Presente',
          preferredCountries: 'Países Preferidos',
          availability: 'Disponibilidade',
        }
      },
      referral: {
        title: 'Programa de Indicação',
        code: {
          label: 'Seu código de indicação',
          copy: 'Copiar código',
          copyLink: 'Copiar link',
          description: 'Compartilhe este código para ganhar recompensas',
        },
        emphasize: {
          title: 'Ganhe 1 ano grátis!',
          description: 'Indique 5 amigos para o Pathfindr e ganhe uma assinatura Pro de 1 ano ativada automaticamente!',
        },
        progress: {
          title: 'Progresso de Indicação',
          count: '{{count}}/5 amigos',
          inviteToEarn: 'Convide 5 amigos para ganhar um ano de assinatura Pro gratuita',
          moreNeeded: 'Falta {{count}} amigo para ganhar Pro',
          moreNeeded_plural: 'Faltam {{count}} amigos para ganhar Pro',
        }
      },
    }
  },
  de: {
    translation: {
      nav: {
        home: 'Startseite',
        scholarships: 'Stipendien',
        boardingschools: 'Internate',
        internationalschools: 'Internationale Schulen',
        internships: 'Praktika',
        pricing: 'Preise',
        features: 'Funktionen',
        about: 'Über uns',
        signIn: 'Anmelden',
        getStarted: 'Loslegen',
      },
      hero: {
        badge: 'Entdecke deine globale Bildungsreise',
        titlePart1: 'Finde dein ',
        titlePart2: 'perfektes Stipendium',
        subtitle: 'Verbinde dich mit Tausenden von Stipendien, Internaten, internationalen Schulen und Praktika in Südostasien und darüber hinaus. Deine Zukunft beginnt hier.',
        browseBtn: 'Stipendien durchsuchen',
        learnMoreBtn: 'Mehr erfahren',
        trustedBy: 'Über 5.000 Studenten vertrauen uns',
        available: 'Über 10.000 Stipendien verfügbar',
        countriesCount: 'Über 50 Länder',
      },
      home: {
        stats: {
          scholarships: { label: 'Verfügbare Stipendien', desc: 'Vielfältige Möglichkeiten in allen Bereichen' },
          countries: { label: 'Länder', desc: 'Globale Reichweite in Südostasien und darüber hinaus' },
          students: { label: 'Unterstützte Studenten', desc: 'Erfolgsgeschichten aus unserer Community' },
          awarded: { label: 'Vergebene Stipendien', desc: 'Gesamtwert über unsere Plattform vermittelt' },
        },
        howItWorks: {
          title: 'So funktioniert Pathfindr',
          subtitle: 'Deine Reise zu einer globalen Ausbildung beginnt hier. Folge diesen einfachen Schritten, um dein perfektes Stipendium zu finden.',
          steps: {
            step1: { title: 'Profil erstellen', desc: 'Melde dich an und erzähle uns von deinem akademischen Hintergrund und deinen Zielen.' },
            step2: { title: 'Möglichkeiten entdecken', desc: 'Durchsuche Tausende von Stipendien mit unseren intelligenten Filtern.' },
            step3: { title: 'Sicher bewerben', desc: 'Verfolge deine Bewerbungen, verwalte Fristen und greife auf Ressourcen zu.' },
            step4: { title: 'Träume verwirklichen', desc: 'Sichere dir dein Stipendium und beginne deine Bildungsreise.' },
          }
        },
        features: {
          title: 'Alles, was Sie zum Erfolg brauchen',
          subtitle: 'Pathfindr bietet leistungsstarke Tools und Ressourcen, die Ihnen helfen, Ihre perfekte Stipendienmöglichkeit zu entdecken und zu sichern.',
          list: {
            smartSearch: { title: 'Intelligente Suche', desc: 'Erweiterte Filter, um Stipendien zu finden, die zu Ihrem Profil passen.' },
            personalized: { title: 'Personalisiertes Matching', desc: 'KI-gestützte Empfehlungen basierend auf Ihren Zielen.' },
            global: { title: 'Globale Möglichkeiten', desc: 'Greifen Sie auf Stipendien aus über 50 Ländern zu.' },
            verified: { title: 'Verifizierte Angebote', desc: 'Alle Stipendien werden auf ihre Richtigkeit überprüft.' },
            tracking: { title: 'Bewerbungsverfolgung', desc: 'Verfolgen Sie Ihre Bewerbungen in einem einzigen Dashboard.' },
            secure: { title: 'Sicher & Privat', desc: 'Ihre persönlichen Daten sind geschützt.' },
          },
          detailed: [
            {
              title: 'Erweiterte Suche & Filter',
              description: 'Finden Sie genau das, was Sie suchen, mit leistungsstarken Suchfunktionen und intelligenten Filtern.',
              benefits: ['Filterung nach mehreren Kriterien', 'Sofortige Suchergebnisse', 'Gespeicherte Sucheinstellungen'],
            },
            {
              title: 'KI-gestütztes Matching',
              description: 'Unser intelligenter Matching-Algorithmus analysiert Ihr Profil, um Möglichkeiten mit der höchsten Erfolgswahrscheinlichkeit zu empfehlen.',
              benefits: ['Personalisierte Empfehlungen', 'Match-Score für jedes Stipendium', 'Intelligentes Prioritätsranking'],
            },
            {
              title: 'Echtzeit-Benachrichtigungen',
              description: 'Verpassen Sie nie wieder eine Frist. Erhalten Sie sofortige Benachrichtigungen für neue Stipendien, die zu Ihrem Profil passen.',
              benefits: ['Anpassbare Einstellungen', 'Erinnerungen an Fristen', 'Statusänderungsalarme'],
            },
          ]
        },
        featured: {
          title: 'Hervorgehobene Stipendien',
          subtitle: 'Entdecken Sie unsere besten Stipendienmöglichkeiten, die derzeit Bewerbungen entgegennehmen.',
          viewAll: 'Alle Stipendien anzeigen',
        },
        testimonials: {
          title: 'Erfolgsgeschichten unserer Studenten',
          subtitle: 'Schließen Sie sich Tausenden von Studenten an, die ihr perfektes Stipendium über Pathfindr gefunden haben.',
          list: [
            {
              quote: "Pathfindr hat die Suche nach dem richtigen Stipendium so viel einfacher gemacht. Die personalisierte Matching-Funktion hat mich mit Möglichkeiten verbunden, von denen ich nicht einmal wusste, dass sie existieren. Jetzt studiere ich Informatik an der NUS!",
              university: 'National University of Singapore',
              country: 'Singapur',
            },
            {
              quote: "Ich war überwältigt von der Anzahl der verfügbaren Stipendien, bis ich Pathfindr fand. Die intelligenten Filter der Plattform und die Fristenverfolgung halfen mir, organisiert zu bleiben und schließlich ein Vollstipendium für das Ingenieurstudium zu gewinnen.",
              university: 'University of Melbourne',
              country: 'Australien',
            },
            {
              quote: "Als Student der ersten Generation war es entmutigend, sich durch Stipendienbewerbungen zu navigieren. Die verifizierten Angebote und die Bewerbungsverfolgung von Pathfindr gaben mir das Vertrauen, meine Träume zu verfolgen. Ich studiere jetzt Medizin!",
              university: 'Chulalongkorn University',
              country: 'Thailand',
            },
          ]
        },
      },
      pricing: {
        title: 'Wähle deinen Plan',
        subtitle: 'Abonniere, um dich für Stipendien zu bewerben. Wähle den Plan, der zu deinen Bedürfnissen passt.',
        mostPopular: 'Beliebteste',
        currentPlan: 'Aktueller Plan',
        getStarted: '{{name}} wählen',
        appsPerYear: '{{count}} Bewerbungen pro Jahr',
        whatsIncluded: 'Was enthalten ist:',
        tiers: {
          pro: {
            name: 'Pro',
            features: [
              'Bewerbe dich auf 5 Stipendien pro Jahr',
              'Vollständige Details & Berechtigung',
              'Bewerbungs-Dashboard',
              'E-Mail-Benachrichtigungen für Fristen',
            ]
          },
          expert: {
            name: 'Expert',
            features: [
              'Bewerbe dich auf 20 Stipendien pro Jahr',
              'Vollständige Details & Berechtigung',
              'Bewerbungs-Dashboard',
              'E-Mail-Benachrichtigungen für Fristen',
              'Prioritärer Support',
              'Personalisierte Stipendienempfehlungen',
            ]
          }
        },
        faq: {
          title: 'Häufig gestellte Fragen',
          q1: {
            q: 'Was zählt als Bewerbung?',
            a: 'Jedes Mal, wenn Sie bei einem Stipendium auf „Jetzt bewerben“ klicken und zur Bewerbungsseite des Stipendienanbieters weitergeleitet werden, zählt dies als eine Bewerbung.'
          },
          q2: {
            q: 'Wann wird mein Bewerbungslimit zurückgesetzt?',
            a: 'Ihre Bewerbungsanzahl wird jährlich zurückgesetzt, wenn Ihr Abonnement verlängert wird.'
          },
          q3: {
            q: 'Kann ich meinen Plan upgraden?',
            a: 'Ja! Sie können jederzeit von Pro zu Expert wechseln. Die Preisdifferenz wird für den Rest Ihres Abrechnungszeitraums anteilig berechnet.'
          },
          q4: {
            q: 'Kann ich jederzeit kündigen?',
            a: 'Absolut. Sie können Ihr Abonnement jederzeit über Ihre Kontoeinstellungen kündigen.'
          }
        }
      },
      footer: {
        description: 'Dein Weg zu globalen Bildungschancen. Verbinde dich mit Stipendien, Internaten, internationalen Schulen und Praktika.',
        platform: 'Plattform',
        resources: 'Ressourcen',
        connect: 'Verbinden',
        links: {
          universities: 'Universitäten',
          internships: 'Praktika',
          jobs: 'Jobs',
          knowledgeBase: 'Wissensdatenbank',
          privacyPolicy: 'Datenschutz',
          termsOfService: 'Nutzungsbedingungen',
        },
        allRightsReserved: 'Alle Rechte vorbehalten.',
      },
      internationalSchools: {
        title: 'Internationale Schulen',
        subtitle: 'Entdecken Sie erstklassige internationale Schulen. Vergleichen Sie Lehrpläne, Gebühren und finden Sie die perfekte Schule.',
        schoolsCount: '{{count}} Schulen',
        search: {
          placeholder: 'Schulen nach Namen suchen...',
        },
        sort: {
          label: 'Sortieren nach:',
          name: 'Name',
          country: 'Land',
          city: 'Stadt',
        },
        results: {
          school: '{{count}} Schule gefunden',
          schools: '{{count}} Schulen gefunden',
        },
        empty: {
          title: 'Keine Schulen gefunden',
          description: "Wir konnten keine Schulen finden, die Ihren Kriterien entsprechen.",
          clearAll: 'Alle Filter löschen',
        },
        filters: {
          title: 'Filter',
          clearAll: 'Alle löschen',
          country: 'Land',
          curriculum: 'Lehrplan',
        },
        location: {
          title: 'Ihr Standort',
          locating: 'Ortung...',
          useCurrent: 'Meinen Standort verwenden',
          or: 'oder',
          selectCity: 'Stadt wählen',
          distance: 'Entfernung',
        },
        card: {
          fees: 'Gebühren:',
          visitWebsite: 'Website besuchen',
        },
        pagination: {
          previous: 'Zurück',
          next: 'Weiter',
        },
      },
      scholarships: {
        title: 'Finden Sie Ihr Stipendium',
        subtitle: 'Durchsuchen Sie Tausende von Stipendien aus der ganzen Welt. Nutzen Sie unsere erweiterten Filter.',
        searchPlaceholder: 'Stipendien nach Namen, Anbieter suchen...',
        sortBy: 'Sortieren nach:',
        sort: {
          relevant: 'Relevant',
          deadline: 'Frist',
          value: 'Wert',
          recent: 'Neu',
        },
        filters: 'Filter',
        showResults: '{{count}} Ergebnisse anzeigen',
        previous: 'Zurück',
        next: 'Weiter',
        noResults: 'Keine Stipendien gefunden',
        clearFilters: 'Alle Filter löschen',
        viewDetails: 'Details anzeigen',
        notifyMe: 'Benachrichtige mich',
        filtersList: {
          title: 'Filter',
          clearAll: 'Alle löschen',
          countries: 'Länder',
          fieldsOfStudy: 'Studienbereiche',
          providerType: 'Anbietertyp',
          scholarshipValue: 'Stipendienwert',
          minValue: 'Mindestwert (USD)',
          maxValue: 'Maximalwert (USD)',
          deadline: 'Bewerbungsfrist',
          anyTime: 'Jederzeit',
        }
      },
      boardingSchools: {
        title: 'Internate',
        subtitle: 'Entdecken Sie die besten Internate in Südostasien.',
        searchPlaceholder: 'Schulen nach Namen suchen...',
        filters: 'Filter',
        noResults: 'Keine Schulen gefunden',
        category: 'Kategorie',
        state: 'Bundesland/Provinz',
        managedBy: 'Verwaltet von {{provider}}',
        filtersList: {
          schoolType: 'Schultyp',
          gender: 'Geschlecht',
          boysOnly: 'Nur Jungen',
          girlsOnly: 'Nur Mädchen',
          coed: 'Koedukativ',
          entryLevel: 'Einstiegslevel',
          managedBy: 'Verwaltet von',
          all: 'Alle',
        }
      },
      internships: {
        title: 'Praktika',
        subtitle: 'Finden Sie Ihren nächsten Karriereschritt mit Praktika bei Top-Unternehmen.',
        searchPlaceholder: 'Rollen oder Unternehmen suchen...',
        filters: 'Filter',
        noResults: 'Keine Praktika gefunden',
        applyBy: 'Bewerben bis {{date}}',
        filtersList: {
          fullTime: 'Vollzeit',
          partTime: 'Teilzeit',
          remote: 'Remote',
        }
      },
      profileView: {
        title: 'Mein Profil',
        editProfile: 'Profil bearbeiten',
        notFound: 'Profil nicht gefunden',
        notFoundDesc: 'Sie haben Ihr Profil noch nicht vervollständigt. Vervollständigen Sie es, um Ihr Profil hier zu sehen.',
        completeProfileBtn: 'Profil vervollständigen',
        resumeOptimizer: {
          title: 'Lebenslauf-Optimierer',
          score: 'Profil-Punktzahl',
          scoreLabel: 'Punktzahl',
          ranking: 'Ranking',
          generateBtn: 'Optimierten Lebenslauf erstellen',
          suggestions: 'Verbesserungsvorschläge',
          copyLink: 'Freigabelink kopieren',
          viewPublic: 'Öffentlichen Lebenslauf ansehen',
          copySuccess: 'Freigabelink in die Zwischenablage kopiert!',
          perfectProfile: 'Ihr Profil ist perfekt! Sie können nun Ihren optimierten Lebenslauf erstellen.',
          aiDescription: 'Unser KI-System formatiert Ihr Profil in einen professionellen, personalverantwortlichen-gerechten Lebenslauf.',
          previewTitle: 'Lebenslauf-Vorschau',
          printBtn: 'Drucken / Als PDF speichern',
          footer: 'Erstellt mit dem PathFindr Optimierten Lebenslauf-Generator',
          percentageComplete: '{{progress}}% Abgeschlossen',
          levels: {
            needsImprovement: 'Verbesserungsbedarf',
            goodProgress: 'Gute Fortschritte',
            professional: 'Professionell',
            elite: 'Elite',
          },
          descriptions: {
            needsImprovement: 'Ihr Profil benötigt mehr Details, um aufzufallen.',
            goodProgress: 'Sie bauen eine solide Grundlage auf.',
            professional: 'Sie sind bereit für die meisten Karrieremöglichkeiten.',
            elite: 'Ihr Profil ist hochgradig wettbewerbsfähig.',
          },
          suggestionsList: {
            phone: 'Fügen Sie Ihre Telefonnummer für Personalvermittler hinzu.',
            gpa: 'Geben Sie Ihren GPA oder Ihre Noten an, um akademische Exzellenz zu zeigen.',
            education: 'Listen Sie Ihren Bildungshintergrund auf.',
            skills: 'Fügen Sie weitere branchenrelevante Fähigkeiten hinzu (mind. 8 anstreben).',
            skillsBasic: 'Zeigen Sie Ihre technischen und beruflichen Fähigkeiten.',
            projectDetail: 'Schreiben Sie detailliertere Beschreibungen für Ihre Projekte.',
            projectDetailBasic: 'Detaillieren Sie akademische oder persönliche Projekte, um praktische Erfahrung zu zeigen.',
            certificates: 'Fügen Sie Zertifikate hinzu, um Ihr Fachwissen zu validieren.',
            subjectScores: 'Fügen Sie Ihre IGCSE-, SPM- oder O-Level-Ergebnisse hinzu, um Ihr akademisches Profil zu stärken.',
            extracurricularBasic: 'Beziehen Sie außerschulische Aktivitäten ein, um Führungskraft und Persönlichkeit zu zeigen.',
            extracurricularCount: 'Fügen Sie mindestens 3 außerschulische Aktivitäten hinzu, um ein vielseitiges Profil zu zeigen.',
          },
          sections: {
            education: 'Bildung',
            projects: 'Wichtige Projekte',
            expertise: 'Fachwissen',
            certificates: 'Zertifikate',
            testScores: 'Testergebnisse',
            extracurriculars: 'Außerschulische Aktivitäten',
          },
          placeholders: {
            noEducation: 'Keine Bildungseinträge vorhanden. Personalvermittler bevorzugen den akademischen Hintergrund.',
            noProjects: 'Fügen Sie relevante Projekte hinzu, um die praktische Anwendung Ihrer Fähigkeiten zu zeigen.',
            noSkills: 'Listen Sie Ihre Kernkompetenzen (Hard- und Soft-Skills) auf.',
            noCertificates: 'Zeigen Sie Ihre formalen Zertifizierungen und kontinuierliches Lernen.',
            noTestScores: 'Standardisierte Testergebnisse (SAT, IELTS usw.) erhöhen den Wert Ihres akademischen Standes.',
            noExtracurriculars: 'Noch keine außerschulischen Aktivitäten hinzugefügt.',
          }
        },
        common: {
          in: 'in',
          score: 'Punktzahl',
        },
        fields: {
          dob: 'Geburtsdatum',
          gender: 'Geschlecht',
          nationality: 'Nationalität',
          country: 'Wohnsitzland',
          phone: 'Telefon',
          gpa: 'GPA',
          grade: 'Note',
          present: 'Gegenwart',
          preferredCountries: 'Bevorzugte Länder',
          availability: 'Verfügbarkeit',
        }
      },
      referral: {
        title: 'Empfehlungsprogramm',
        code: {
          label: 'Dein Empfehlungscode',
          copy: 'Code kopieren',
          copyLink: 'Link kopieren',
          description: 'Teile diesen Code, um Belohnungen zu verdienen',
        },
        emphasize: {
          title: 'Verdiene 1 Jahr gratis!',
          description: 'Empfiehl 5 Freunde an Pathfindr und erhalte ein 1-jähriges Pro-Abonnement automatisch aktiviert!',
        },
        progress: {
          title: 'Empfehlungsfortschritt',
          count: '{{count}}/5 Freunde',
          inviteToEarn: 'Lade 5 Freunde ein, um ein Jahr kostenloses Pro-Abo zu erhalten',
          moreNeeded: 'Noch {{count}} Freund für Pro nötig',
          moreNeeded_plural: 'Noch {{count}} Freunde für Pro nötig',
        }
      },
    }
  },
  ja: {
    translation: {
      nav: {
        home: 'ホーム',
        scholarships: '奨学金',
        boardingschools: '寄宿学校',
        internationalschools: 'インターナショナルスクール',
        internships: 'インターンシップ',
        pricing: '料金',
        features: '特徴',
        about: 'Pathfindrについて',
        signIn: 'サインイン',
        getStarted: '今すぐ始める',
      },
      hero: {
        badge: 'あなたのグローバルな教育の旅を見つけよう',
        titlePart1: 'あなたにぴったりの ',
        titlePart2: '奨学金を見つける',
        subtitle: '東南アジア内外の数千の奨学金、寄宿学校、インターナショナルスクール、インターンシップとつながりましょう。あなたの未来はここから始まります。',
        browseBtn: '奨学金を探す',
        learnMoreBtn: '詳細を見る',
        trustedBy: '5,000人以上の学生に信頼されています',
        available: '10,000以上の奨学金が利用可能',
        countriesCount: '50カ国以上',
      },
      home: {
        stats: {
          scholarships: { label: '利用可能な奨学金', desc: 'あらゆる分野の多様な機会' },
          countries: { label: '対象国', desc: '東南アジアおよび世界中をカバー' },
          students: { label: '支援した学生', desc: 'コミュニティからの成功事例' },
          awarded: { label: '授与された奨学金', desc: 'プラットフォームを通じて促進された総額' },
        },
        howItWorks: {
          title: 'Pathfindrの仕組み',
          subtitle: 'グローバル教育への旅はここから始まります。完璧な奨学金を見つけて確保するための簡単なステップ。',
          steps: {
            step1: { title: 'プロフィールを作成', desc: '登録して、学歴、興味、目標を教えてください。' },
            step2: { title: '機会を見つける', desc: 'スマートフィルターを使用して数千の奨学金を検索。' },
            step3: { title: '自信を持って応募', desc: '応募状況を追跡し、期限を管理し、便利なリソースにアクセス。' },
            step4: { title: '夢を実現する', desc: '奨学金を獲得し、教育の旅を始めましょう。' },
          }
        },
        features: {
          title: '成功するために必要なすべてがここに',
          subtitle: 'Pathfindrは、あなたにぴったりの奨学金を見つけ、獲得するための強力なツールとリソースを提供します。',
          list: {
            smartSearch: { title: 'スマート検索', desc: 'あなたのプロフィールに合う奨学金を見つけるための高度なフィルター。' },
            personalized: { title: 'パーソナライズされたマッチング', desc: 'あなたの目標に基づいたAIによる推奨。' },
            global: { title: 'グローバルな機会', desc: '50カ国以上の奨学金にアクセス。' },
            verified: { title: '確認済みの掲載', desc: 'すべての奨学金は正確性が確認されています。' },
            tracking: { title: '応募追跡', desc: '一つのダッシュボードで応募状況を管理。' },
            secure: { title: '安全。プライベート', desc: 'あなたの個人情報は保護されています。' },
          },
          detailed: [
            {
              title: '高度な検索とフィルター',
              description: '強力な検索機能とスマートなフィルターで、探しているものを正確に見つけます。',
              benefits: ['複数条件によるフィルタリング', '即時の検索結果', '検索条件の保存'],
            },
            {
              title: 'AI搭載マッチング',
              description: '当社のインテリジェントなマッチングアルゴリズムがあなたのプロフィールを分析し、成功確率の高い機会を推奨します。',
              benefits: ['パーソナライズされた推奨', '各奨学金のマッチスコア', 'スマートな優先順位付け'],
            },
            {
              title: 'リアルタイム通知',
              description: '期限を逃しません。あなたのプロフィールに合う新しい奨学金や期限について、即座に通知を受け取れます。',
              benefits: ['カスタマイズ可能な設定', '期限のリマインダー', 'ステータス変更アラート'],
            },
          ]
        },
        featured: {
          title: '注目の奨学金',
          subtitle: '现在応募受付中のトップクラスの奨学金をチェックしましょう。',
          viewAll: 'すべての奨学金を見る',
        },
        testimonials: {
          title: '学生たちの成功ストーリー',
          subtitle: 'Pathfindrを通じてぴったりの奨学金を見つけた数千人の学生の仲間に加わりましょう。',
          list: [
            {
              quote: "Pathfindrのおかげで、自分に合った奨学金を見つけるのがとても簡単になりました。パーソナライズされたマッチング機能により、存在すら知らなかった機会に巡り合うことができました。今、私はNUSでコンピューターサイエンスを学んでいます！",
              university: 'シンガポール国立大学',
              country: 'シンガポール',
            },
            {
              quote: "利用可能な奨学金の多さに圧倒されていましたが、Pathfindrを見つけて救われました。スマートフィルターと期限管理機能のおかげで整理整頓ができ、最終的に工学を学ぶための全額奨学金を獲得することができました。",
              university: 'メルボルン大学',
              country: 'オーストラリア',
            },
            {
              quote: "第一世代の大学生として、奨学金の申請は不安でしたが、Pathfindrの確認済みリストと申請追跡機能が自信を与えてくれました。今、私はバンコクで医学を学んでいます！",
              university: 'チュラロンコン大学',
              country: 'タイ',
            },
          ]
        },
        cta: {
          title: 'あなたの旅を始める準備はできましたか？',
          subtitle: '今すぐプロフィールを作成して、数千の機会へのアクセスを解放しましょう。成功した学生たちのコミュニティに参加してください。',
          createAccount: '無料アカウントを作成',
          browseScholarships: '奨学金を探す',
        }
      },
      pricing: {
        title: 'プランを選択',
        subtitle: '奨学金への応募を開始するために購読してください。ニーズに合ったプランを選択して、教育の機会への道を切り開きましょう。',
        mostPopular: '一番人気',
        currentPlan: '現在のプラン',
        getStarted: '{{name}}を選択',
        appsPerYear: '年間{{count}}件の奨学金申請',
        whatsIncluded: '含まれるもの:',
        tiers: {
          pro: {
            name: 'Pro',
            features: [
              '年間5件の奨学金に応募',
              '奨学金の詳細と資格をフル表示',
              '申請管理ダッシュボード',
              '期限のメール通知',
            ]
          },
          expert: {
            name: 'Expert',
            features: [
              '年間20件の奨学金に応募',
              '奨学金の詳細と資格をフル表示',
              '申請管理ダッシュボード',
              '期限のメール通知',
              '優先サポート',
              'パーソナライズされた奨学金の推奨',
            ]
          }
        },
        faq: {
          title: 'よくある質問',
          q1: {
            q: '何が「申請」としてカウントされますか？',
            a: '奨学金の「今すぐ応募」をクリックし、提供元の申請ページにリダイレクトされるたびに、1件の申請としてカウントされます。'
          },
          q2: {
            q: '申請上限はいつリセットされますか？',
            a: '申請数は、購読が更新される際に毎年リセットされます。'
          },
          q3: {
            q: 'プランをアップグレードできますか？',
            a: 'はい！いつでもProからExpertにアップグレード可能です。差額は請求期間の残りに応じて日割り計算されます。'
          },
          q4: {
            q: 'いつでもキャンセルできますか？',
            a: 'もちろんです。アカウント設定からいつでもキャンセル可能です。'
          }
        }
      },
      footer: {
        description: 'グローバルな教育機会への道。東南アジア内外の奨学金、寄宿学校、インターナショナルスクール、インターンシップとつながりましょう。',
        platform: 'プラットフォーム',
        resources: 'リソース',
        connect: '公式SNS',
        links: {
          universities: '大学',
          internships: 'インターンシップ',
          jobs: '求人',
          knowledgeBase: 'ナレッジベース',
          privacyPolicy: 'プライバシーポリシー',
          termsOfService: '利用規約',
        },
        allRightsReserved: 'All rights reserved.',
      },
      internationalSchools: {
        title: 'インターナショナルスクール',
        subtitle: 'トップクラスのインターナショナルスクールを探索。カリキュラムや学費を比較し、お子様にぴったりの学校を見つけましょう。',
        schoolsCount: '{{count}} 校',
        search: {
          placeholder: '学校名で検索...',
        },
        sort: {
          label: '並べ替え:',
          name: '名前',
          country: '国',
          city: '都市',
        },
        results: {
          school: '{{count}} 件の学校が見つかりました',
          schools: '{{count}} 件の学校が見つかりました',
        },
        empty: {
          title: '学校が見つかりません',
          description: "条件に一致するインターナショナルスクールが見つかりませんでした。フィルターを調整してみてください。",
          clearAll: 'すべてのフィルターをクリア',
        },
        filters: {
          title: 'フィルター',
          clearAll: 'すべてクリア',
          country: '国',
          curriculum: 'カリキュラム',
        },
        location: {
          title: '現在地',
          locating: '位置情報を取得中...',
          useCurrent: '現在地を使用する',
          or: 'または',
          selectCity: '都市を選択',
          distance: '距離',
        },
        card: {
          fees: '学費:',
          visitWebsite: 'ウェブサイトを訪問',
        },
        pagination: {
          previous: '前へ',
          next: '次へ',
        },
      },
      scholarships: {
        title: '奨学金を探す',
        subtitle: '世界中の数千の奨学金を閲覧。高度なフィルターを使用して、あなたのプロフィールに合う機会を見つけましょう。',
        searchPlaceholder: '名前や提供元で奨学金を検索...',
        sortBy: '並べ替え:',
        sort: {
          relevant: '関連度順',
          deadline: '締切順',
          value: '金額順',
          recent: '新着順',
        },
        filters: 'フィルター',
        showResults: '{{count}} 件の結果を表示',
        previous: '前へ',
        next: '次へ',
        noResults: '奨学金が見つかりません',
        clearFilters: 'すべてのフィルターをクリア',
        viewDetails: '詳細を見る',
        notifyMe: '通知を受け取る',
        filtersList: {
          title: 'フィルター',
          clearAll: 'すべてクリア',
          countries: '国',
          fieldsOfStudy: '専攻分野',
          providerType: '提供元の種類',
          scholarshipValue: '奨学金の金額',
          minValue: '最小金額 (USD)',
          maxValue: '最大金額 (USD)',
          deadline: '申請締切',
          anyTime: 'いつでも',
        }
      },
      boardingSchools: {
        title: '寄宿学校',
        subtitle: '東南アジアで最高の寄宿学校を見つけましょう。',
        searchPlaceholder: '学校名で検索...',
        filters: 'フィルター',
        noResults: '学校が見つかりません',
        category: 'カテゴリー',
        state: '州/県',
        managedBy: '{{provider}}による運営',
        filtersList: {
          schoolType: '学校の種類',
          gender: '性別',
          boysOnly: '男子校',
          girlsOnly: '女子校',
          coed: '共学',
          entryLevel: '入学レベル',
          managedBy: '運営主体',
          all: 'すべて',
        }
      },
      internships: {
        title: 'インターンシップ',
        subtitle: 'トップ企業でのインターンシップで、キャリアの次の一歩を見つけましょう。',
        searchPlaceholder: '職種や企業名で検索...',
        filters: 'フィルター',
        noResults: 'インターンシップが見つかりません',
        applyBy: '締切: {{date}}',
        filtersList: {
          fullTime: 'フルタイム',
          partTime: 'パートタイム',
          remote: 'リモート',
        }
      },
      profileView: {
        title: 'マイプロフィール',
        editProfile: 'プロフィールを編集',
        notFound: 'プロフィールが見つかりません',
        notFoundDesc: 'プロフィールが未完成です。入力を完了して、ここで確認してください。',
        completeProfileBtn: 'プロフィールを完成させる',
        resumeOptimizer: {
          title: '履歴書オプティマイザー',
          score: 'プロフィールスコア',
          scoreLabel: 'スコア',
          ranking: 'ランキング',
          generateBtn: '最適化された履歴書を作成',
          suggestions: '改善の提案',
          copyLink: '共有リンクをコピー',
          viewPublic: '公開履歴書を表示',
          copySuccess: '共有リンクがクリップボードにコピーされました！',
          perfectProfile: 'あなたのプロフィールは完璧です！最適化された履歴書を作成する準備ができています。',
          aiDescription: '当社のAIシステムが、あなたのプロフィールをプロフェッショナルで採用担当者に優しい履歴書の形式に整えます。',
          previewTitle: '履歴書プレビュー',
          printBtn: '印刷 / PDFとして保存',
          footer: 'PathFindr 最適化履歴書エンジンにより生成',
          percentageComplete: '完成度 {{progress}}%',
          levels: {
            needsImprovement: '要改善',
            goodProgress: '順調',
            professional: 'プロフェッショナル',
            elite: 'エリート',
          },
          descriptions: {
            needsImprovement: 'あなたのプロフィールを目立たせるには、さらに詳細が必要です。',
            goodProgress: '強固な基盤を築いています。',
            professional: 'ほとんどのキャリア機会に対応可能です。',
            elite: 'あなたのプロフィールは、トップクラスの採用において非常に競争力があります。',
          },
          suggestionsList: {
            phone: '採用担当者のために電話番号を追加してください。',
            gpa: '学業の優秀さを示すためにGPAまたは成績を含めてください。',
            education: '学歴をリストに含めてください。',
            skills: '業界に関連するスキルをさらに追加してください（少なくとも8つを目指しましょう）。',
            skillsBasic: '技術的および専門的なスキルをアピールしましょう。',
            projectDetail: 'プロジェクトの詳細な説明を書いてください。',
            projectDetailBasic: '実務経験を示すために、学術的または個人的なプロジェクトを詳しく説明してください。',
            certificates: '専門知識を証明するために資格を追加してください。',
            subjectScores: '学業プロフィールを強化するために、IGCSE、SPM、またはOレベルの科目の結果を追加してください。',
            extracurricularBasic: 'リーダーシップと個性をアピールするために、課外活動を含めてください。',
            extracurricularCount: 'バランスの取れたプロフィールを示すために、少なくとも3つの課外活動を追加してください。',
          },
          sections: {
            education: '学歴',
            projects: '主なプロジェクト',
            expertise: '専門知識',
            certificates: '資格',
            testScores: 'テストスコア',
            extracurriculars: '課外活動',
          },
          placeholders: {
            noEducation: '学歴がありません。採用担当者は学歴を重視します。',
            noProjects: 'スキルの実用性を示すために、関連するプロジェクトを追加してください。',
            noSkills: 'コアとなるテクニカルスキルとソフトスキルをリストアップしてください。',
            noCertificates: '正式な資格と継続的な学習をアピールしましょう。',
            noTestScores: '標準化されたテストスコア（SAT、IELTSなど）は、学業成績を裏付けます。',
            noExtracurriculars: '課外活動はまだ追加されていません。',
          }
        },
        common: {
          in: 'にて',
          score: 'スコア',
        },
        fields: {
          dob: '生年月日',
          gender: '性別',
          nationality: '国籍',
          country: '居住国',
          phone: '電話番号',
          gpa: 'GPA',
          grade: '成績/評価',
          present: '現在',
          preferredCountries: '希望する留学先',
          availability: '入学可能時期',
        }
      },
      referral: {
        title: '紹介プログラム',
        code: {
          label: 'あなたの紹介コード',
          copy: 'コードをコピー',
          copyLink: 'リンクをコピー',
          description: '報酬を獲得するためにこのコードを共有してください',
        },
        emphasize: {
          title: '1年間無料で利用しよう！',
          description: 'Pathfindrを5人の友人に紹介すると、1年間のプロプラン・サブスクリプションが自動的に有効になります！',
        },
        progress: {
          title: '紹介の進捗',
          count: '{{count}}/5 人の友人',
          inviteToEarn: '5人を招待して1年間の無料プロプランを獲得',
          moreNeeded: 'あと {{count}} 人の友人でプロプラン獲得',
          moreNeeded_plural: 'あと {{count}} 人の友人でプロプラン獲得',
        }
      },
    }
  },
  ko: {
    translation: {
      nav: {
        home: '홈',
        scholarships: '장학금',
        boardingschools: '기숙 학교',
        internationalschools: '국제 학교',
        internships: '인턴십',
        pricing: '가격',
        features: '기능',
        about: 'Pathfindr 소개',
        signIn: '로그인',
        getStarted: '시작하기',
      },
      hero: {
        badge: '글로벌 교육 여정을 발견하세요',
        titlePart1: '당신에게 완벽한 ',
        titlePart2: '장학금 찾기',
        subtitle: '동남아시아 및 그 이상의 수천 개의 장학금, 기숙 학교, 국제 학교 및 인턴십과 연결하세요. 당신의 미래가 여기서 시작됩니다.',
        browseBtn: '장학금 둘러보기',
        learnMoreBtn: '더 알아보기',
        trustedBy: '5,000명 이상의 학생이 신뢰함',
        available: '10,000개 이상의 장학금 이용 가능',
        countriesCount: '50개국 이상',
      },
      home: {
        stats: {
          scholarships: { label: '이용 가능한 장학금', desc: '모든 분야의 다양한 기회' },
          countries: { label: '국가', desc: '동남아시아 및 전 세계 글로벌 활동' },
          students: { label: '도움을 받은 학생들', desc: '우리 커뮤니티의 성공 사례' },
          awarded: { label: '수여된 장학금', desc: '플랫폼을 통해 연결된 총 가치' },
        },
        howItWorks: {
          title: 'Pathfindr 작동 방식',
          subtitle: '글로벌 교육을 향한 여정이 여기서 시작됩니다. 완벽한 장학금을 찾고 확보하기 위한 간단한 단계.',
          steps: {
            step1: { title: '프로필 생성', desc: '가입하고 학업 배경, 관심사 및 목표를 알려주세요.' },
            step2: { title: '기회 발견', desc: '스마트 필터를 사용하여 수천 개의 장학금을 검색하세요.' },
            step3: { title: '자신 있게 지원', desc: '지원 현황을 추적하고, 마감일을 관리하며, 유용한 리소스에 액세스하세요.' },
            step4: { title: '꿈을 이루세요', desc: '장학금을 확보하고 교육 여정을 시작하세요.' },
          }
        },
        features: {
          title: '성공을 위해 필요한 모든 것',
          subtitle: 'Pathfindr는 당신에게 완벽한 장학금 기회를 발견하고 확보할 수 있도록 강력한 도구와 리소스를 제공합니다.',
          list: {
            smartSearch: { title: '스마트 검색', desc: '당신의 프로필에 맞는 장학금을 찾기 위한 고급 필터.' },
            personalized: { title: '개인화된 매칭', desc: '당신의 목표에 기반한 AI 추동 추천.' },
            global: { title: '글로벌 기회', desc: '50개국 이상의 장학금에 액세스.' },
            verified: { title: '확인된 목록', desc: '모든 장학금은 정확성이 확인되었습니다.' },
            tracking: { title: '지원 추적', desc: '하나의 대시보드에서 지원 현황을 관리하세요.' },
            secure: { title: '안정성 및 개인정보 보호', desc: '당신의 개인 정보는 안전하게 보호됩니다.' },
          },
          detailed: [
            {
              title: '고급 검색 및 필터',
              description: '강력한 검색 기능과 스마트 필터로 찾고 있는 것을 정확하게 찾으세요.',
              benefits: ['다중 기준 필터링', '즉각적인 검색 결과', '검색 기본 설정 저장'],
            },
            {
              title: 'AI 기반 매칭',
              description: '당사의 지능형 매칭 알고리즘이 당신의 프로필을 분석하여 성공 확률이 가장 높은 기회를 추천합니다.',
              benefits: ['개인화된 추천', '각 장학금에 대한 매칭 점수', '스마트 우선순위 랭킹'],
            },
            {
              title: '실시간 알림',
              description: '마감일을 절대 놓치지 마세요. 당신의 프로필과 일치하는 새로운 장학금에 대해 즉시 알림을 받으세요.',
              benefits: ['사용자 지정 기본 설정', '마감일 알림', '상태 변경 알림'],
            },
          ]
        },
        featured: {
          title: '추천 장학금',
          subtitle: '현재 지원을 받고 있는 최고의 장학금 기회를 살펴보세요.',
          viewAll: '모든 장학금 보기',
        },
        testimonials: {
          title: '학생 성공 사례',
          subtitle: 'Pathfindr를 통해 완벽한 장학금을 찾은 수천 명의 학생들과 함께하세요.',
          list: [
            {
              quote: "Pathfindr 덕분에 나에게 맞는 장학금을 찾는 것이 훨씬 쉬워졌습니다. 개인화된 매칭 기능을 통해 존재조차 몰랐던 기회들을 접할 수 있었고, 지금은 NUS에서 컴퓨터 공학을 공부하고 있습니다!",
              university: '싱가포르 국립대학교',
              country: '싱가포르',
            },
            {
              quote: "수많은 장학금 정보에 막막했었는데 Pathfindr를 만나고 정리가 되었습니다. 스마트 필터와 마감일 추적 기능 덕분에 체계적으로 준비할 수 있었고, 결국 공학 전공 전액 장학금을 받을 수 있었습니다.",
              university: '멜버른 대학교',
              country: '호주',
            },
            {
              quote: "가족 중 처음으로 대학에 진학하는 학생으로서 장학금 신청이 막막했지만, Pathfindr의 검증된 목록과 지원 추적 기능이 큰 자신감을 주었습니다. 지금은 방콕에서 의학을 공부하고 있습니다!",
              university: '쭐라롱껀 대학교',
              country: '태국',
            },
          ]
        },
        cta: {
          title: '여정을 시작할 준비가 되셨나요?',
          subtitle: '지금 프로필을 작성하고 수천 개의 장학금 기회를 확인하세요. 성공적인 학생 커뮤니티의 일원이 되어보세요.',
          createAccount: '무료 계정 생성',
          browseScholarships: '장학금 둘러보기',
        }
      },
      pricing: {
        title: '플랜 선택',
        subtitle: '장학금 지원을 시작하려면 구독하세요. 당신의 요구에 맞는 플랜을 선택하고 교육의 기회를 잡으세요.',
        mostPopular: '가장 인기 있는 플랜',
        currentPlan: '현재 플랜',
        getStarted: '{{name}} 선택하기',
        appsPerYear: '연간 {{count}}회 장학금 지원',
        whatsIncluded: '포함 내역:',
        tiers: {
          pro: {
            name: 'Pro',
            features: [
              '연간 5회 장학금 지원',
              '장학금 상세 정보 및 자격 조건 전체 공개',
              '지원 관리 대시보드',
              '마감일 이메일 알림',
            ]
          },
          expert: {
            name: 'Expert',
            features: [
              '연간 20회 장학금 지원',
              '장학금 상세 정보 및 자격 조건 전체 공개',
              '지원 관리 대시보드',
              '마감일 이메일 알림',
              '우선 지원 서비스',
              '개인화된 장학금 추천',
            ]
          }
        },
        faq: {
          title: '자주 묻는 질문',
          q1: {
            q: '어떤 것이 "지원"으로 집계되나요?',
            a: '장학금의 "지금 지원하기"를 클릭하여 해당 기관의 지원 페이지로 이동할 때마다 1회의 지원으로 집계됩니다.'
          },
          q2: {
            q: '지원 한도는 언제 초기화되나요?',
            a: '지원 횟수는 매년 구독이 갱신될 때 초기화됩니다.'
          },
          q3: {
            q: '플랜을 업그레이드할 수 있나요?',
            a: '네! 언제든지 Pro에서 Expert로 업그레이드할 수 있습니다. 차액은 남은 기간에 따라 일할 계산됩니다.'
          },
          q4: {
            q: '언제든지 해지할 수 있나요?',
            a: '물론입니다. 계정 설정에서 언제든지 구독을 해지할 수 있습니다.'
          }
        }
      },
      footer: {
        description: '글로벌 교육 기회로 향하는 길. 동남아시아와 전 세계의 장학금, 기숙 학교, 국제 학교, 인턴십 정보를 확인하세요.',
        platform: '플랫폼',
        resources: '리소스',
        connect: '소셜 미디어',
        links: {
          universities: '대학교',
          internships: '인턴십',
          jobs: '채용',
          knowledgeBase: '지식 베이스',
          privacyPolicy: '개인정보 처리방침',
          termsOfService: '이용 약관',
        },
        allRightsReserved: 'All rights reserved.',
      },
      internationalSchools: {
        title: '국제 학교',
        subtitle: '최고의 국제 학교를 탐색하세요. 교과 과정과 학비를 비교하고 자녀에게 딱 맞는 학교를 찾아보세요.',
        schoolsCount: '{{count}}개 학교',
        search: {
          placeholder: '학교 이름으로 검색...',
        },
        sort: {
          label: '정렬 기준:',
          name: '이름',
          country: '국가',
          city: '도시',
        },
        results: {
          school: '{{count}}개의 학교를 찾았습니다',
          schools: '{{count}}개의 학교를 찾았습니다',
        },
        empty: {
          title: '학교를 찾을 수 없습니다',
          description: "조건에 맞는 국제 학교를 찾지 못했습니다. 필터를 조정해 보세요.",
          clearAll: '모든 필터 초기화',
        },
        filters: {
          title: '필터',
          clearAll: '모두 지우기',
          country: '국가',
          curriculum: '교과 과정',
        },
        location: {
          title: '현재 위치',
          locating: '위치 정보 확인 중...',
          useCurrent: '현재 위치 사용',
          or: '또는',
          selectCity: '도시 선택',
          distance: '거리',
        },
        card: {
          fees: '학비:',
          visitWebsite: '웹사이트 방문',
        },
        pagination: {
          previous: '이전',
          next: '다음',
        },
      },
      scholarships: {
        title: '장학금 찾기',
        subtitle: '전 세계 수천 개의 장학금을 둘러보세요. 고급 필터를 사용해 나에게 맞는 기회를 찾아보세요.',
        searchPlaceholder: '장학금 이름이나 기관으로 검색...',
        sortBy: '정렬 기준:',
        sort: {
          relevant: '관련성 높은 순',
          deadline: '마감임박 순',
          value: '금액 높은 순',
          recent: '최신 순',
        },
        filters: '필터',
        showResults: '{{count}}개의 결과 보기',
        previous: '이전',
        next: '다음',
        noResults: '장학금을 찾을 수 없습니다',
        clearFilters: '모든 필터 초기화',
        viewDetails: '상세 보기',
        notifyMe: '알림받기',
        filtersList: {
          title: '필터',
          clearAll: '모두 지우기',
          countries: '국가',
          fieldsOfStudy: '전공 분야',
          providerType: '기관 유형',
          scholarshipValue: '장학금 금액',
          minValue: '최소 금액 (USD)',
          maxValue: '최대 금액 (USD)',
          deadline: '지원 마감일',
          anyTime: '언제든지',
        }
      },
      boardingSchools: {
        title: '기숙 학교',
        subtitle: '동남아시아 최고의 기숙 학교를 발견하세요.',
        searchPlaceholder: '학교 이름으로 검색...',
        filters: '필터',
        noResults: '학교를 찾을 수 없습니다',
        category: '카테고리',
        state: '주/광역시',
        managedBy: '{{provider}} 관리',
        filtersList: {
          schoolType: '학교 유형',
          gender: '성별',
          boysOnly: '남학교',
          girlsOnly: '여학교',
          coed: '남녀공학',
          entryLevel: '입학 수준',
          managedBy: '운영 주체',
          all: '전체',
        }
      },
      internships: {
        title: '인턴십',
        subtitle: '최고의 기업 인턴십을 통해 커리어를 시작하세요.',
        searchPlaceholder: '직무 또는 회사 검색...',
        filters: '필터',
        noResults: '인턴십을 찾을 수 없습니다',
        applyBy: '지원 마감: {{date}}',
        filtersList: {
          fullTime: '풀타임',
          partTime: '파트타임',
          remote: '원격 근무',
        }
      },
      profileView: {
        title: '내 프로필',
        editProfile: '프로필 수정',
        notFound: '프로필을 찾을 수 없습니다',
        notFoundDesc: '아직 프로필을 작성하지 않으셨습니다. 프로필을 작성하고 여기서 확인하세요.',
        completeProfileBtn: '프로필 완성하기',
        resumeOptimizer: {
          title: '이력서 최적화 도구',
          score: '프로필 점수',
          scoreLabel: '점수',
          ranking: '순위',
          generateBtn: '최적화된 이력서 생성',
          suggestions: '개선 제안',
          copyLink: '공유 링크 복사',
          viewPublic: '공개 이력서 보기',
          copySuccess: '공유 링크가 클립보드에 복사되었습니다!',
          perfectProfile: '프로필이 완벽합니다! 최적화된 이력서를 생성할 준비가 되었습니다.',
          aiDescription: 'AI 기반 시스템이 귀하의 프로필을 전문적이고 채용 담당자에게 적합한 이력서 형식으로 변환합니다.',
          previewTitle: '이력서 미리보기',
          printBtn: '인쇄 / PDF로 저장',
          footer: 'PathFindr 최적화 이력서 엔진에 의해 생성됨',
          percentageComplete: '완성도 {{progress}}%',
          levels: {
            needsImprovement: '개선 필요',
            goodProgress: '순조로운 진행',
            professional: '전문가 수준',
            elite: '최고 수준',
          },
          descriptions: {
            needsImprovement: '프로필을 돋보이게 하려면 더 많은 세부 정보가 필요합니다.',
            goodProgress: '탄탄한 기반을 구축하고 있습니다.',
            professional: '대부분의 커리어 기회에 준비되어 있습니다.',
            elite: '귀하의 프로필은 최고 수준의 채용에서 매우 경쟁력이 있습니다.',
          },
          suggestionsList: {
            phone: '채용 담당자를 위해 전화번호를 추가하세요.',
            gpa: '학업 우수성을 보여주기 위해 GPA 또는 성적을 포함하세요.',
            education: '학력 배경을 목록에 포함하세요.',
            skills: '업계와 관련된 기술을 더 추가하세요 (최소 8개 목표).',
            skillsBasic: '귀하의 기술적 및 전문적 능력을 보여주세요.',
            projectDetail: '프로젝트에 대한 더 자세한 설명을 작성하세요.',
            projectDetailBasic: '실무 경험을 보여주기 위해 학업 또는 개인 프로젝트를 자세히 설명하세요.',
            certificates: '전문 지식을 증명하기 위해 자격증을 추가하세요.',
            subjectScores: '학업 프로필을 강화하기 위해 IGCSE, SPM 또는 O-Level 과목 결과를 추가하세요.',
            extracurricularBasic: '리더십과 개성을 보여주기 위해 과외 활동을 포함하세요.',
            extracurricularCount: '균형 잡힌 프로필을 보여주기 위해 최소 3개의 과외 활동을 추가하세요.',
          },
          sections: {
            education: '학력',
            projects: '주요 프로젝트',
            expertise: '전문 지식',
            certificates: '자격증',
            testScores: '시험 점수',
            extracurriculars: '과외 활동',
          },
          placeholders: {
            noEducation: '추가된 학력이 없습니다. 채용 담당자는 학력 배경을 우선시합니다.',
            noProjects: '기술의 실제 적용을 보여주기 위해 관련 프로젝트를 추가하세요.',
            noSkills: '핵심 하드 및 소프트 스킬을 나열하세요.',
            noCertificates: '공식 자격증 및 지속적인 학습을 보여주세요.',
            noTestScores: '표준화된 시험 점수(SAT, IELTS 등)는 학업 성취도를 뒷받침합니다.',
            noExtracurriculars: '아직 과외 활동이 추가되지 않았습니다.',
          }
        },
        common: {
          in: '에서',
          score: '점수',
        },
        fields: {
          dob: '생년월일',
          gender: '성별',
          nationality: '국적',
          country: '거주 국가',
          phone: '전화번호',
          gpa: 'GPA',
          grade: '성적/등급',
          present: '현재',
          preferredCountries: '선호하는 유학 국가',
          availability: '입학 가능 시기',
        }
      },
      referral: {
        title: '추천 프로그램',
        code: {
          label: '내 추천 코드',
          copy: '코드 복사',
          copyLink: '링크 복사',
          description: '보상을 받으려면 이 코드를 공유하세요',
        },
        emphasize: {
          title: '1년 무료 혜택을 받으세요!',
          description: 'Pathfindr를 친구 5명에게 추천하면 1년 프로 구독권이 자동으로 활성화됩니다!',
        },
        progress: {
          title: '추천 진행 상황',
          count: '{{count}}/5 명의 친구',
          inviteToEarn: '친구 5명을 초대하고 1년 무료 프로 구독권을 받으세요',
          moreNeeded: '프로 구독권까지 {{count}}명의 친구가 더 필요합니다',
          moreNeeded_plural: '프로 구독권까지 {{count}}명의 친구가 더 필요합니다',
        }
      },
    }
  },
  vi: {
    translation: {
      nav: {
        home: 'Trang chủ',
        scholarships: 'Học bổng',
        boardingschools: 'Trường nội trú',
        internationalschools: 'Trường quốc tế',
        internships: 'Thực tập',
        pricing: 'Bảng giá',
        features: 'Tính năng',
        about: 'Giới thiệu',
        signIn: 'Đăng nhập',
        getStarted: 'Bắt đầu',
      },
      hero: {
        badge: 'Khám phá hành trình giáo dục toàn cầu của bạn',
        titlePart1: 'Tìm kiếm ',
        titlePart2: 'học bổng hoàn hảo',
        subtitle: 'Kết nối với hàng ngàn học bổng, trường nội trú, trường quốc tế và thực tập tại Đông Nam Á và hơn thế nữa. Tương lai của bạn bắt đầu từ đây.',
        browseBtn: 'Xem học bổng',
        learnMoreBtn: 'Tìm hiểu thêm',
        trustedBy: 'Được tin tưởng bởi hơn 5.000 sinh viên',
        available: 'Hơn 10.000 học bổng có sẵn',
        countriesCount: 'Hơn 50 quốc gia',
      },
      home: {
        stats: {
          scholarships: { label: 'Học bổng hiện có', desc: 'Cơ hội đa dạng trong mọi lĩnh vực' },
          countries: { label: 'Quốc gia', desc: 'Phạm vi toàn cầu tại Đông Nam Á và thế giới' },
          students: { label: 'Sinh viên đã hỗ trợ', desc: 'Câu chuyện thành công từ cộng đồng của chúng tôi' },
          awarded: { label: 'Học bổng đã trao', desc: 'Tổng giá trị được kết nối qua nền tảng' },
        },
        howItWorks: {
          title: 'Pathfindr hoạt động như thế nào',
          subtitle: 'Hành trình đến với giáo dục toàn cầu bắt đầu từ đây. Các bước đơn giản để tìm và đạt được học bổng hoàn hảo.',
          steps: {
            step1: { title: 'Tạo hồ sơ', desc: 'Đăng ký và cho chúng tôi biết về nền tảng học vấn, sở thích và mục tiêu của bạn.' },
            step2: { title: 'Khám phá cơ hội', desc: 'Duyệt qua hàng ngàn học bổng bằng bộ lọc thông minh.' },
            step3: { title: 'Ứng tuyển tự tin', desc: 'Theo dõi hồ sơ, quản lý thời hạn và tiếp cận các nguồn tài liệu hữu ích.' },
            step4: { title: 'Đạt được ước mơ', desc: 'Giành học bổng và bắt đầu hành trình giáo dục của bạn.' },
          }
        },
        features: {
          title: 'Mọi thứ bạn cần để thành công',
          subtitle: 'Pathfindr cung cấp các công cụ và nguồn lực mạnh mẽ để giúp bạn khám phá và giành được cơ hội học bổng hoàn hảo.',
          list: {
            smartSearch: { title: 'Tìm kiếm thông minh', desc: 'Bộ lọc nâng cao để tìm học bổng phù hợp với hồ sơ của bạn.' },
            personalized: { title: 'Ghép đôi cá nhân hóa', desc: 'Đề xuất dựa trên AI dựa trên mục tiêu của bạn.' },
            global: { title: 'Cơ hội toàn cầu', desc: 'Tiếp cận học bổng từ hơn 50 quốc gia.' },
            verified: { title: 'Danh sách đã xác minh', desc: 'Tất cả học bổng đều được xác minh độ chính xác.' },
            tracking: { title: 'Theo dõi ứng tuyển', desc: 'Theo dõi các đơn ứng tuyển của bạn trong một trang điều khiển.' },
            secure: { title: 'An toàn & Riêng tư', desc: 'Thông tin cá nhân của bạn được bảo vệ.' },
          },
          detailed: [
            {
              title: 'Tìm kiếm & Bộ lọc nâng cao',
              description: 'Tìm chính xác những gì bạn đang tìm kiếm với khả năng tìm kiếm mạnh mẽ và bộ lọc thông minh.',
              benefits: ['Lọc đa tiêu chí', 'Kết quả tìm kiếm tức thì', 'Lưu tùy chọn tìm kiếm'],
            },
            {
              title: 'Ghép đôi bằng AI',
              description: 'Thuật toán ghép đôi thông minh của chúng tôi phân tích hồ sơ của bạn để đề xuất các cơ hội có xác suất thành công cao nhất.',
              benefits: ['Đề xuất cá nhân hóa', 'Điểm phù hợp cho mỗi học bổng', 'Xếp hạng ưu tiên thông minh'],
            },
            {
              title: 'Thông báo thời gian thực',
              description: 'Không bao giờ bỏ lỡ thời hạn. Nhận thông báo tức thì cho các học bổng mới phù hợp với hồ sơ của bạn.',
              benefits: ['Tùy chỉnh thông báo', 'Nhắc nhở thời hạn', 'Cảnh báo thay đổi trạng thái'],
            },
          ]
        },
        featured: {
          title: 'Học bổng nổi bật',
          subtitle: 'Khám phá các cơ hội học bổng hàng đầu hiện đang nhận đơn đăng ký.',
          viewAll: 'Xem tất cả học bổng',
        },
        testimonials: {
          title: 'Câu chuyện thành công từ sinh viên',
          subtitle: 'Tham gia cùng hàng ngàn sinh viên đã tìm thấy học bổng hoàn hảo thông qua Pathfindr.',
          list: [
            {
              quote: "Pathfindr đã giúp việc tìm kiếm học bổng phù hợp trở nên dễ dàng hơn nhiều. Tính năng ghép đôi cá nhân hóa đã kết nối tôi với những cơ hội mà tôi thậm chí không biết là có tồn tại. Hiện tôi đang học Khoa học Máy tính tại NUS!",
              university: 'Đại học Quốc gia Singapore',
              country: 'Singapore',
            },
            {
              quote: "Tôi đã bị choáng ngợp bởi số lượng học bổng hiện có cho đến khi tìm thấy Pathfindr. Bộ lọc thông minh và tính năng theo dõi thời hạn của nền tảng đã giúp tôi luôn ngăn nắp và cuối cùng giành được học bổng toàn phần để học Kỹ thuật.",
              university: 'Đại học Melbourne',
              country: 'Australia',
            },
            {
              quote: "Là một sinh viên đại học thế hệ đầu tiên, việc ứng tuyển học bổng rất đáng sợ. Danh sách đã được xác minh và tính năng theo dõi ứng tuyển của Pathfindr đã cho tôi sự tự tin để theo đuổi ước mơ. Hiện tôi đang học Y khoa!",
              university: 'Đại học Chulalongkorn',
              country: 'Thái Lan',
            },
          ]
        },
        cta: {
          title: 'Sẵn sàng bắt đầu hành trình của bạn?',
          subtitle: 'Tạo hồ sơ của bạn ngay hôm nay và mở khóa quyền truy cập vào hàng ngàn cơ hội. Tham gia cộng đồng sinh viên thành công của chúng tôi.',
          createAccount: 'Tạo tài khoản miễn phí',
          browseScholarships: 'Xem học bổng',
        }
      },
      pricing: {
        title: 'Chọn gói của bạn',
        subtitle: 'Đăng ký để bắt đầu ứng tuyển học bổng. Chọn gói phù hợp với nhu cầu của bạn và mở lối tới những cơ hội giáo dục.',
        mostPopular: 'Phổ biến nhất',
        currentPlan: 'Gói hiện tại',
        getStarted: 'Chọn {{name}}',
        appsPerYear: '{{count}} đơn ứng tuyển mỗi năm',
        whatsIncluded: 'Bao gồm:',
        tiers: {
          pro: {
            name: 'Pro',
            features: [
              'Ứng tuyển 5 học bổng mỗi năm',
              'Thông tin chi tiết & điều kiện đầy đủ',
              'Trang điều khiển ứng tuyển',
              'Thông báo thời hạn qua email',
            ]
          },
          expert: {
            name: 'Expert',
            features: [
              'Ứng tuyển 20 học bổng mỗi năm',
              'Thông tin chi tiết & điều kiện đầy đủ',
              'Trang điều khiển ứng tuyển',
              'Thông báo thời hạn qua email',
              'Hỗ trợ ưu tiên',
              'Đề xuất học bổng cá nhân hóa',
            ]
          }
        },
        faq: {
          title: 'Câu hỏi thường gặp',
          q1: {
            q: 'Điều gì được tính là một đơn ứng tuyển?',
            a: 'Mỗi khi bạn nhấp vào "Ứng tuyển ngay" trên một học bổng và được chuyển hướng đến trang ứng tuyển của nhà cung cấp, đó được tính là một lần ứng tuyển.'
          },
          q2: {
            q: 'Khi nào giới hạn ứng tuyển của tôi được đặt lại?',
            a: 'Số lượng ứng tuyển của bạn sẽ được đặt lại hàng năm khi gói đăng ký của bạn được gia hạn.'
          },
          q3: {
            q: 'Tôi có thể nâng cấp gói của mình không?',
            a: 'Có! Bạn có thể nâng cấp từ Pro lên Expert bất cứ lúc nào. Chênh lệch giá sẽ được tính theo tỷ lệ cho phần còn lại của chu kỳ thanh toán.'
          },
          q4: {
            q: 'Tôi có thể hủy bất cứ lúc nào không?',
            a: 'Chắc chắn rồi. Bạn có thể hủy gói đăng ký bất cứ lúc nào từ phần cài đặt tài khoản.'
          }
        }
      },
      footer: {
        description: 'Con đường dẫn đến các cơ hội giáo dục toàn cầu. Kết nối với học bổng, trường nội trú, trường quốc tế và thực tập khắp Đông Nam Á và thế giới.',
        platform: 'Nền tảng',
        resources: 'Tài nguyên',
        connect: 'Kết nối',
        links: {
          universities: 'Đại học',
          internships: 'Thực tập',
          jobs: 'Việc làm',
          knowledgeBase: 'Trung tâm kiến thức',
          privacyPolicy: 'Chính sách bảo mật',
          termsOfService: 'Điều khoản dịch vụ',
        },
        allRightsReserved: 'All rights reserved.',
      },
      internationalSchools: {
        title: 'Trường quốc tế',
        subtitle: 'Khám phá các trường quốc tế hàng đầu. So sánh chương trình học, học phí và tìm ngôi trường hoàn hảo cho hành trình giáo dục của bạn.',
        schoolsCount: '{{count}} trường',
        search: {
          placeholder: 'Tìm trường theo tên...',
        },
        sort: {
          label: 'Sắp xếp theo:',
          name: 'Tên',
          country: 'Quốc gia',
          city: 'Thành phố',
        },
        results: {
          school: 'Tìm thấy {{count}} trường',
          schools: 'Tìm thấy {{count}} trường',
        },
        empty: {
          title: 'Không tìm thấy trường nào',
          description: "Chúng tôi không tìm thấy trường nào phù hợp với tiêu chí của bạn. Hãy thử điều chỉnh bộ lọc.",
          clearAll: 'Xóa tất cả bộ lọc',
        },
        filters: {
          title: 'Bộ lọc',
          clearAll: 'Xóa tất cả',
          country: 'Quốc gia',
          curriculum: 'Chương trình học',
        },
        location: {
          title: 'Vị trí của bạn',
          locating: 'Đang xác định vị trí...',
          useCurrent: 'Sử dụng vị trí hiện tại',
          or: 'hoặc',
          selectCity: 'Chọn thành phố',
          distance: 'Khoảng cách',
        },
        card: {
          fees: 'Học phí:',
          visitWebsite: 'Truy cập website',
        },
        pagination: {
          previous: 'Trang trước',
          next: 'Trang sau',
        },
      },
      scholarships: {
        title: 'Tìm học bổng của bạn',
        subtitle: 'Duyệt qua hàng ngàn học bổng từ khắp nơi trên thế giới. Sử dụng bộ lọc nâng cao để tìm cơ hội phù hợp với hồ sơ của bạn.',
        searchPlaceholder: 'Tìm học bổng theo tên, nhà cung cấp...',
        sortBy: 'Sắp xếp theo:',
        sort: {
          relevant: 'Phù hợp nhất',
          deadline: 'Thời hạn',
          value: 'Giá trị',
          recent: 'Mới nhất',
        },
        filters: 'Bộ lọc',
        showResults: 'Hiển thị {{count}} kết quả',
        previous: 'Trang trước',
        next: 'Trang sau',
        noResults: 'Không tìm thấy học bổng nào',
        clearFilters: 'Xóa tất cả bộ lọc',
        viewDetails: 'Xem chi tiết',
        notifyMe: 'Thông báo cho tôi',
        filtersList: {
          title: 'Bộ lọc',
          clearAll: 'Xóa tất cả',
          countries: 'Quốc gia',
          fieldsOfStudy: 'Lĩnh vực học tập',
          providerType: 'Loại nhà cung cấp',
          scholarshipValue: 'Giá trị học bổng',
          minValue: 'Giá trị tối thiểu (USD)',
          maxValue: 'Giá trị tối đa (USD)',
          deadline: 'Hạn nộp hồ sơ',
          anyTime: 'Bất cứ lúc nào',
        }
      },
      boardingSchools: {
        title: 'Trường nội trú',
        subtitle: 'Khám phá những trường nội trú tốt nhất tại Đông Nam Á.',
        searchPlaceholder: 'Tìm trường theo tên...',
        filters: 'Bộ lọc',
        noResults: 'Không tìm thấy trường nào',
        category: 'Danh mục',
        state: 'Bang/Tỉnh',
        managedBy: 'Quản lý bởi {{provider}}',
        filtersList: {
          schoolType: 'Loại trường',
          gender: 'Giới tính',
          boysOnly: 'Chỉ nam',
          girlsOnly: 'Chỉ nữ',
          coed: 'Nam nữ chung',
          entryLevel: 'Cấp bậc nhập học',
          managedBy: 'Đơn vị quản lý',
          all: 'Tất cả',
        }
      },
      internships: {
        title: 'Thực tập',
        subtitle: 'Tìm bước tiến sự nghiệp tiếp theo với các kỳ thực tập tại các công ty hàng đầu.',
        searchPlaceholder: 'Tìm vị trí hoặc công ty...',
        filters: 'Bộ lọc',
        noResults: 'Không tìm thấy kỳ thực tập nào',
        applyBy: 'Hạn ứng tuyển {{date}}',
        filtersList: {
          fullTime: 'Toàn thời gian',
          partTime: 'Bán thời gian',
          remote: 'Làm việc từ xa',
        }
      },
      profileView: {
        title: 'Hồ sơ của tôi',
        editProfile: 'Chỉnh sửa hồ sơ',
        notFound: 'Không tìm thấy hồ sơ',
        notFoundDesc: 'Bạn chưa hoàn thành hồ sơ của mình. Hãy hoàn thành hồ sơ để xem tại đây.',
        completeProfileBtn: 'Hoàn thành hồ sơ',
        resumeOptimizer: {
          title: 'Trình tối ưu hóa CV',
          score: 'Điểm hồ sơ',
          scoreLabel: 'Điểm số',
          ranking: 'Xếp hạng',
          generateBtn: 'Tạo CV tối ưu',
          suggestions: 'Đề xuất cải thiện',
          copyLink: 'Sao chép liên kết chia sẻ',
          viewPublic: 'Xem CV công khai',
          copySuccess: 'Đã sao chép liên kết chia sẻ vào khay nhớ tạm!',
          perfectProfile: 'Hồ sơ của bạn quá hoàn hảo! Bạn đã sẵn sàng để tạo CV tối ưu của mình.',
          aiDescription: 'Hệ thống AI của chúng tôi sẽ định dạng hồ sơ của bạn thành một CV chuyên nghiệp, thu hút nhà tuyển dụng.',
          previewTitle: 'Xem trước CV',
          printBtn: 'In / Lưu dưới dạng PDF',
          footer: 'Tạo bởi PathFindr Trình tối ưu hóa CV',
          percentageComplete: 'Hoàn thành {{progress}}%',
          levels: {
            needsImprovement: 'Cần cải thiện',
            goodProgress: 'Tiến triển tốt',
            professional: 'Chuyên nghiệp',
            elite: 'Xuất sắc',
          },
          descriptions: {
            needsImprovement: 'Hồ sơ của bạn cần chi tiết hơn để nổi bật.',
            goodProgress: 'Bạn đang xây dựng một nền tảng vững chắc.',
            professional: 'Bạn đã sẵn sàng cho hầu hết các cơ hội nghề nghiệp.',
            elite: 'Hồ sơ của bạn có tính cạnh tranh cao để tuyển dụng cấp cao.',
          },
          suggestionsList: {
            phone: 'Thêm số điện thoại của bạn cho nhà tuyển dụng.',
            gpa: 'Bao gồm điểm GPA để thể hiện thành tích học tập xuất sắc.',
            education: 'Liệt kê quá trình học tập của bạn.',
            skills: 'Thêm nhiều kỹ năng liên quan đến ngành hơn (mục tiêu ít nhất 8 kỹ năng).',
            skillsBasic: 'Thể hiện kỹ năng kỹ thuật và chuyên môn của bạn.',
            projectDetail: 'Viết mô tả chi tiết hơn cho các dự án của bạn.',
            projectDetailBasic: 'Thêm chi tiết các dự án học thuật hoặc cá nhân để làm nổi bật kinh nghiệm thực tế.',
            certificates: 'Thêm chứng chỉ để xác nhận chuyên môn của bạn.',
            subjectScores: 'Thêm kết quả các môn học IGCSE, SPM, hoặc O-Level để tăng cường hồ sơ học tập.',
            extracurricularBasic: 'Bao gồm các hoạt động ngoại khóa để thể hiện khả năng lãnh đạo và cá tính của bạn.',
            extracurricularCount: 'Thêm ít nhất 3 hoạt động ngoại khóa để tạo một hồ sơ toàn diện.',
          },
          sections: {
            education: 'Học vấn',
            projects: 'Dự án nổi bật',
            expertise: 'Chuyên môn',
            certificates: 'Chứng chỉ',
            testScores: 'Điểm khảo thí',
            extracurriculars: 'Hoạt động ngoại khóa',
          },
          placeholders: {
            noEducation: 'Chưa có thông tin học vấn. Nhà tuyển dụng luôn ưu tiên nền tảng học thuật.',
            noProjects: 'Cần có các dự án liên quan để thể hiện khả năng ứng dụng kỹ năng.',
            noSkills: 'Hãy liệt kê các kỹ năng cứng và mềm cốt lõi của bạn.',
            noCertificates: 'Trưng bày chứng chỉ chính thức và tinh thần học hỏi không ngừng.',
            noTestScores: 'Các bài thi chuẩn hóa (SAT, IELTS...) sẽ gia tăng sức nặng cho học vấn của bạn.',
            noExtracurriculars: 'Chưa có hoạt động ngoại khóa nào được thêm vào.',
          }
        },
        common: {
          in: 'thuộc',
          score: 'Điểm',
        },
        fields: {
          dob: 'Ngày sinh',
          gender: 'Giới tính',
          nationality: 'Quốc tịch',
          country: 'Quốc gia',
          phone: 'Số điện thoại',
          gpa: 'GPA',
          grade: 'Điểm số/Loại',
          present: 'Hiện tại',
          preferredCountries: 'Quốc gia mong muốn',
          availability: 'Mức độ sẵn sàng',
        }
      },
      referral: {
        title: 'Chương trình giới thiệu',
        code: {
          label: 'Mã giới thiệu của bạn',
          copy: 'Sao chép mã',
          copyLink: 'Sao chép liên kết',
          description: 'Chia sẻ mã này để nhận phần thưởng',
        },
        emphasize: {
          title: 'Nhận 1 năm miễn phí!',
          description: 'Giới thiệu 5 người bạn tham gia Pathfindr để tự động kích hoạt gói đăng ký Pro trong 1 năm!',
        },
        progress: {
          title: 'Tiến trình giới thiệu',
          count: '{{count}}/5 người bạn',
          inviteToEarn: 'Mời 5 người bạn để nhận 1 năm đăng ký Pro miễn phí',
          moreNeeded: 'Cần thêm {{count}} người bạn để nhận Pro',
          moreNeeded_plural: 'Cần thêm {{count}} người bạn để nhận Pro',
        }
      },
    }
  },
  id: {
    translation: {
      nav: {
        home: 'Beranda',
        scholarships: 'Beasiswa',
        boardingschools: 'Sekolah Berasrama',
        internationalschools: 'Sekolah Internasional',
        internships: 'Magang',
        pricing: 'Harga',
        features: 'Fitur',
        about: 'Tentang Kami',
        signIn: 'Masuk',
        getStarted: 'Mulai',
      },
      hero: {
        badge: 'Temukan perjalanan pendidikan global Anda',
        titlePart1: 'Temukan ',
        titlePart2: 'beasiswa sempurna Anda',
        subtitle: 'Terhubung dengan ribuan beasiswa, sekolah berasrama, sekolah internasional, dan magang di Asia Tenggara dan sekitarnya. Masa depan Anda dimulai di sini.',
        browseBtn: 'Lihat Beasiswa',
        learnMoreBtn: 'Pelajari Lebih Lanjut',
        trustedBy: 'Dipercaya oleh 5.000+ pelajar',
        available: '10.000+ beasiswa tersedia',
        countriesCount: '50+ negara',
      },
      home: {
        stats: {
          scholarships: { label: 'Beasiswa Tersedia', desc: 'Beragam peluang di semua bidang' },
          countries: { label: 'Negara', desc: 'Jangkauan global di Asia Tenggara dan seiyanya' },
          students: { label: 'Pelajar Terbantu', desc: 'Kisah sukses dari komunitas kami' },
          awarded: { label: 'Beasiswa Terfasilitasi', desc: 'Total nilai yang disalurkan melalui platform kami' },
        },
        howItWorks: {
          title: 'Cara Kerja Pathfindr',
          subtitle: 'Perjalanan Anda menuju pendidikan global dimulai di sini. Ikuti langkah mudah ini untuk menemukan beasiswa impian.',
          steps: {
            step1: { title: 'Buat Profil', desc: 'Daftar dan beri tahu kami tentang latar belakang akademik, minat, dan tujuan Anda.' },
            step2: { title: 'Temukan Peluang', desc: 'Cari ribuan beasiswa menggunakan filter cerdas kami.' },
            step3: { title: 'Daftar dengan Percaya Diri', desc: 'Pantau aplikasi Anda, kelola tenggat waktu, dan akses sumber daya bermanfaat.' },
            step4: { title: 'Raih Impian Anda', desc: 'Dapatkan beasiswa dan mulai perjalanan pendidikan Anda.' },
          }
        },
        features: {
          title: 'Semua yang Anda Butuhkan untuk Sukses',
          subtitle: 'Pathfindr menyediakan alat dan sumber daya yang kuat untuk membantu Anda menemukan dan mengamankan peluang beasiswa yang sempurna.',
          list: {
            smartSearch: { title: 'Pencarian Cerdas', desc: 'Filter canggih untuk menemukan beasiswa yang sesuai dengan profil Anda.' },
            personalized: { title: 'Pencocokan Personalisasi', desc: 'Rekomendasi bertenaga AI berdasarkan tujuan Anda.' },
            global: { title: 'Peluang Global', desc: 'Akses beasiswa dari 50+ negara.' },
            verified: { title: 'Daftar Terverifikasi', desc: 'Semua beasiswa diverifikasi untuk akurasi.' },
            tracking: { title: 'Pelacakan Aplikasi', desc: 'Pantau aplikasi Anda dalam satu dasbor.' },
            secure: { title: 'Aman & Pribadi', desc: 'Informasi pribadi Anda terlindungi.' },
          },
          detailed: [
            {
              title: 'Pencarian & Filter Canggih',
              description: 'Temukan apa yang Anda cari dengan kemampuan pencarian yang kuat dan filter cerdas.',
              benefits: ['Pemfilteran multi-kriteria', 'Hasil pencarian instan', 'Simpan preferensi pencarian'],
            },
            {
              title: 'Pencocokan Bertenaga AI',
              description: 'Algoritma pencocokan cerdas kami menganalisis profil Anda untuk merekomendasikan peluang dengan probabilitas keberhasilan tertinggi.',
              benefits: ['Rekomendasi personal', 'Skor cocok untuk setiap beasiswa', 'Peringkat prioritas cerdas'],
            },
            {
              title: 'Notifikasi Real-Time',
              description: 'Jangan pernah melewatkan tenggat waktu. Dapatkan notifikasi instan untuk beasiswa baru yang sesuai dengan profil Anda.',
              benefits: ['Preferensi yang dapat disesuaikan', 'Pengingat tenggat waktu', 'Peringatan perubahan status'],
            },
          ]
        },
        featured: {
          title: 'Beasiswa Unggulan',
          subtitle: 'Jelajahi peluang beasiswa terbaik kami yang sedang menerima aplikasi saat ini.',
          viewAll: 'Lihat Semua Beasiswa',
        },
        testimonials: {
          title: 'Kisah Sukses dari Pelajar Kami',
          subtitle: 'Bergabunglah dengan ribuan pelajar yang telah menemukan beasiswa sempurna mereka melalui Pathfindr.',
          list: [
            {
              quote: "Pathfindr membuat pencarian beasiswa yang tepat menjadi jauh lebih mudah. Fitur pencocokan personal menghubungkan saya dengan peluang yang bahkan tidak saya ketahui sebelumnya. Sekarang saya belajar Ilmu Komputer di NUS!",
              university: 'National University of Singapore',
              country: 'Singapura',
            },
            {
              quote: "Saya sempat merasa kewalahan dengan banyaknya beasiswa yang tersedia sampai saya menemukan Pathfindr. Filter cerdas dan pelacakan tenggat waktu membantu saya tetap teratur dan akhirnya memenangkan beasiswa penuh untuk belajar Teknik.",
              university: 'University of Melbourne',
              country: 'Australia',
            },
            {
              quote: "Sebagai mahasiswa generasi pertama, menavigasi aplikasi beasiswa sangatlah menakutkan. Daftar terverifikasi dan pelacakan aplikasi Pathfindr memberi saya kepercayaan diri. Sekarang saya belajar Kedokteran!",
              university: 'Chulalongkorn University',
              country: 'Thailand',
            },
          ]
        },
        cta: {
          title: 'Siap untuk memulai perjalanan Anda?',
          subtitle: 'Buat profil Anda hari ini dan buka akses ke ribuan peluang. Bergabunglah dengan komunitas pelajar sukses kami.',
          createAccount: 'Buat Akun Gratis',
          browseScholarships: 'Lihat Beasiswa',
        }
      },
      pricing: {
        title: 'Pilih Paket Anda',
        subtitle: 'Berlangganan untuk mulai melamar beasiswa. Pilih paket yang sesuai dengan kebutuhan Anda dan buka jalan menuju peluang pendidikan.',
        mostPopular: 'Paling Populer',
        currentPlan: 'Paket Saat Ini',
        getStarted: 'Pilih {{name}}',
        appsPerYear: '{{count}} lamaran beasiswa per tahun',
        whatsIncluded: 'Apa yang termasuk:',
        tiers: {
          pro: {
            name: 'Pro',
            features: [
              'Lamar ke 5 beasiswa per tahun',
              'Detail lengkap & kelayakan beasiswa',
              'Dasbor pelacakan aplikasi',
              'Notifikasi tenggat waktu via email',
            ]
          },
          expert: {
            name: 'Expert',
            features: [
              'Lamar ke 20 beasiswa per tahun',
              'Detail lengkap & kelayakan beasiswa',
              'Dasbor pelacakan aplikasi',
              'Notifikasi tenggat waktu via email',
              'Dukungan prioritas',
              'Rekomendasi beasiswa personal',
            ]
          }
        },
        faq: {
          title: 'Pertanyaan yang Sering Diajukan',
          q1: {
            q: 'Apa yang dihitung sebagai satu lamaran?',
            a: 'Setiap kali Anda menekan "Lamar Sekarang" pada suatu beasiswa dan diarahkan ke halaman aplikasi penyedia beasiswa, itu dihitung sebagai satu lamaran.'
          },
          q2: {
            q: 'Kapan batas lamaran saya direset?',
            a: 'Jumlah lamaran Anda direset setiap tahun saat langganan Anda diperbarui.'
          },
          q3: {
            q: 'Dapatkah saya upgrade paket saya?',
            a: 'Ya! Anda dapat upgrade dari Pro ke Expert kapan saja. Selisih harga akan dihitung secara prorata untuk sisa periode penagihan Anda.'
          },
          q4: {
            q: 'Dapatkah saya membatalkan kapan saja?',
            a: 'Tentu saja. Anda dapat membatalkan langganan kapan saja melalui pengaturan akun Anda.'
          }
        }
      },
      footer: {
        description: 'Jalan Anda menuju peluang pendidikan global. Terhubung dengan beasiswa, sekolah berasrama, sekolah internasional, dan magang di seluruh Asia Tenggara dan sekitarnya.',
        platform: 'Platform',
        resources: 'Sumber Daya',
        connect: 'Hubungi Kami',
        links: {
          universities: 'Universitas',
          internships: 'Magang',
          jobs: 'Pekerjaan',
          knowledgeBase: 'Pusat Pengetahuan',
          privacyPolicy: 'Kebijakan Privasi',
          termsOfService: 'Syarat dan Ketentuan',
        },
        allRightsReserved: 'All rights reserved.',
      },
      internationalSchools: {
        title: 'Sekolah Internasional',
        subtitle: 'Jelajahi sekolah internasional terbaik. Bandingkan kurikulum, biaya, dan temukan sekolah yang sempurna untuk perjalanan pendidikan Anda.',
        schoolsCount: '{{count}} sekolah',
        search: {
          placeholder: 'Cari sekolah berdasarkan nama...',
        },
        sort: {
          label: 'Urutkan berdasarkan:',
          name: 'Nama',
          country: 'Negara',
          city: 'Kota',
        },
        results: {
          school: '{{count}} sekolah ditemukan',
          schools: '{{count}} sekolah ditemukan',
        },
        empty: {
          title: 'Sekolah tidak ditemukan',
          description: "Kami tidak dapat menemukan sekolah yang cocok dengan kriteria Anda. Coba sesuaikan filter Anda.",
          clearAll: 'Hapus Semua Filter',
        },
        filters: {
          title: 'Filter',
          clearAll: 'Hapus semua',
          country: 'Negara',
          curriculum: 'Kurikulum',
        },
        location: {
          title: 'Lokasi Anda',
          locating: 'Mencari lokasi...',
          useCurrent: 'Gunakan Lokasi Saya',
          or: 'atau',
          selectCity: 'Pilih Kota',
          distance: 'Jarak',
        },
        card: {
          fees: 'Biaya:',
          visitWebsite: 'Kunjungi Situs Web',
        },
        pagination: {
          previous: 'Sebelumnya',
          next: 'Berikutnya',
        },
      },
      scholarships: {
        title: 'Cari Beasiswa Anda',
        subtitle: 'Jelajahi ribuan beasiswa dari seluruh dunia. Gunakan filter canggih kami untuk menemukan peluang yang sesuai dengan profil Anda.',
        searchPlaceholder: 'Cari beasiswa berdasarkan nama, penyedia...',
        sortBy: 'Urutkan berdasarkan:',
        sort: {
          relevant: 'Relevan',
          deadline: 'Tenggat Waktu',
          value: 'Nilai',
          recent: 'Terbaru',
        },
        filters: 'Filter',
        showResults: 'Tampilkan {{count}} Hasil',
        previous: 'Sebelumnya',
        next: 'Berikutnya',
        noResults: 'Beasiswa tidak ditemukan',
        clearFilters: 'Hapus Semua Filter',
        viewDetails: 'Lihat Detail',
        notifyMe: 'Beri Tahu Saya',
        filtersList: {
          title: 'Filter',
          clearAll: 'Hapus Semua',
          countries: 'Negara',
          fieldsOfStudy: 'Bidang Studi',
          providerType: 'Tipe Penyedia',
          scholarshipValue: 'Nilai Beasiswa',
          minValue: 'Nilai Minimum (USD)',
          maxValue: 'Nilai Maksimum (USD)',
          deadline: 'Tenggat Aplikasi',
          anyTime: 'Kapan saja',
        }
      },
      boardingSchools: {
        title: 'Sekolah Berasrama',
        subtitle: 'Temukan sekolah berasrama terbaik di Asia Tenggara.',
        searchPlaceholder: 'Cari sekolah berdasarkan nama...',
        filters: 'Filter',
        noResults: 'Sekolah tidak ditemukan',
        category: 'Kategori',
        state: 'Negara Bagian/Provinsi',
        managedBy: 'Dikelola oleh {{provider}}',
        filtersList: {
          schoolType: 'Tipe Sekolah',
          gender: 'Jenis Kelamin',
          boysOnly: 'Hanya laki-laki',
          girlsOnly: 'Hanya perempuan',
          coed: 'Campuran',
          entryLevel: 'Tingkat masuk',
          managedBy: 'Dikelola oleh',
          all: 'Semua',
        }
      },
      internships: {
        title: 'Magang',
        subtitle: 'Temukan langkah karier Anda selanjutnya dengan magang di perusahaan terkemuka.',
        searchPlaceholder: 'Cari peran atau perusahaan...',
        filters: 'Filter',
        noResults: 'Magang tidak ditemukan',
        applyBy: 'Lamar sebelum {{date}}',
        filtersList: {
          fullTime: 'Penuh waktu',
          partTime: 'Paruh waktu',
          remote: 'Remote',
        }
      },
      profileView: {
        title: 'Profil Saya',
        editProfile: 'Edit Profil',
        notFound: 'Profil Tidak Ditemukan',
        notFoundDesc: 'Anda belum melengkapi profil Anda. Lengkapi untuk melihat profil Anda di sini.',
        completeProfileBtn: 'Lengkapi Profil',
        resumeOptimizer: {
          title: 'Pengoptimal Resume',
          score: 'Skor Profil',
          scoreLabel: 'Skor',
          ranking: 'Peringkat',
          generateBtn: 'Buat Resume yang Dioptimalkan',
          suggestions: 'Saran untuk Peningkatan',
          copyLink: 'Salin Tautan Bagikan',
          viewPublic: 'Lihat Resume Publik',
          copySuccess: 'Tautan bagikan disalin ke papan klip!',
          perfectProfile: 'Profil Anda sempurna! Anda siap untuk membuat resume yang dioptimalkan.',
          aiDescription: 'Sistem berbasis AI kami memformat profil Anda menjadi resume profesional dan siap untuk direkrut.',
          previewTitle: 'Pratinjau Resume',
          printBtn: 'Cetak / Simpan sebagai PDF',
          footer: 'Dibuat oleh Mesin Resume yang Dioptimalkan PathFindr',
          percentageComplete: '{{progress}}% Selesai',
          levels: {
            needsImprovement: 'Perlu Ditingkatkan',
            goodProgress: 'Kemajuan Baik',
            professional: 'Profesional',
            elite: 'Elit',
          },
          descriptions: {
            needsImprovement: 'Profil Anda membutuhkan lebih banyak detail agar menonjol.',
            goodProgress: 'Anda sedang membangun fondasi yang kuat.',
            professional: 'Anda siap untuk sebagian besar peluang karier.',
            elite: 'Profil Anda sangat kompetitif untuk perekrutan tingkat atas.',
          },
          suggestionsList: {
            phone: 'Tambahkan nomor telepon Anda untuk perekrut.',
            gpa: 'Sertakan IPK atau nilai Anda untuk menunjukkan keunggulan akademik.',
            education: 'Daftar latar belakang pendidikan Anda.',
            skills: 'Tambahkan lebih banyak keterampilan terkait industri (target minimal 8).',
            skillsBasic: 'Tunjukkan keterampilan teknis dan profesional Anda.',
            projectDetail: 'Tulis deskripsi yang lebih rinci untuk proyek Anda.',
            projectDetailBasic: 'Rincikan proyek akademik atau pribadi untuk menunjukkan pengalaman praktis.',
            certificates: 'Tambahkan sertifikasi untuk memvalidasi keahlian Anda.',
            subjectScores: 'Tambahkan hasil mata pelajaran IGCSE, SPM, atau O-Level Anda untuk memperkuat profil akademik Anda.',
            extracurricularBasic: 'Sertakan kegiatan ekstrakurikuler untuk menunjukkan kepemimpinan dan kepribadian Anda.',
            extracurricularCount: 'Tambahkan minimal 3 kegiatan ekstrakurikuler untuk menunjukkan profil yang menyeluruh.',
          },
          sections: {
            education: 'Pendidikan',
            projects: 'Proyek Utama',
            expertise: 'Keahlian',
            certificates: 'Sertifikat',
            testScores: 'Skor Tes',
            extracurriculars: 'Kegiatan Ekstrakurikuler',
          },
          placeholders: {
            noEducation: 'Tidak ada entri pendidikan yang ditambahkan. Perekrut memprioritaskan latar belakang akademik.',
            noProjects: 'Tambahkan proyek yang relevan untuk menunjukkan penerapan praktis keterampilan Anda.',
            noSkills: 'Buat daftar keterampilan keras dan lunak inti Anda.',
            noCertificates: 'Pamerkan sertifikasi resmi dan pembelajaran berkelanjutan Anda.',
            noTestScores: 'Skor tes standar (SAT, IELTS, dll.) menambah bobot pada posisi akademik Anda.',
            noExtracurriculars: 'Belum ada kegiatan ekstrakurikuler yang ditambahkan.',
          }
        },
        common: {
          in: 'di',
          score: 'Skor',
        },
        fields: {
          dob: 'Tanggal Lahir',
          gender: 'Jenis Kelamin',
          nationality: 'Kewarganegaraan',
          country: 'Negara Tempat Tinggal',
          phone: 'Telepon',
          gpa: 'IPK',
          grade: 'Nilai/Tingkat',
          present: 'Sekarang',
          preferredCountries: 'Negara Pilihan',
          availability: 'Ketersediaan',
        }
      },
      referral: {
        title: 'Program Referal',
        code: {
          label: 'Kode referal Anda',
          copy: 'Salin kode',
          copyLink: 'Salin pautan',
          description: 'Bagikan kode ini untuk mendapatkan hadiah',
        },
        emphasize: {
          title: 'Dapatkan 1 Tahun Gratis!',
          description: 'Ajak 5 teman ke Pathfindr dan dapatkan langganan Pro selama 1 tahun yang diaktifkan secara otomatis!',
        },
        progress: {
          title: 'Kemajuan Referal',
          count: '{{count}}/5 teman',
          inviteToEarn: 'Undang 5 teman untuk mendapatkan satu tahun langganan Pro gratis',
          moreNeeded: 'Butuh {{count}} teman lagi untuk mendapatkan Pro',
          moreNeeded_plural: 'Butuh {{count}} teman lagi untuk mendapatkan Pro',
        }
      },
    }
  },
  hi: {
    translation: {
      nav: {
        home: 'होम',
        scholarships: 'छात्रवृत्तियाँ',
        boardingschools: 'बोर्डिंग स्कूल',
        internationalschools: 'अंतर्राष्ट्रीय स्कूल',
        internships: 'इंटर्नशिप',
        pricing: 'मूल्य निर्धारण',
        features: 'विशेषताएँ',
        about: 'हमारे बारे में',
        signIn: 'साइन इन करें',
        getStarted: 'शुरू करें',
      },
      hero: {
        badge: 'अपनी वैश्विक शैक्षिक यात्रा खोजें',
        titlePart1: 'अपनी सही ',
        titlePart2: 'छात्रवृत्ति खोजें',
        subtitle: 'दक्षिण-पूर्व एशिया और उससे परे हजारों छात्रवृत्तियों, बोर्डिंग स्कूलों, अंतर्राष्ट्रीय स्कूलों और इंटर्नशिप से जुड़ें। आपका भविष्य यहाँ से शुरू होता है।',
        browseBtn: 'छात्रवृत्तियाँ देखें',
        learnMoreBtn: 'और जानें',
        trustedBy: '5,000+ छात्रों द्वारा विश्वसनीय',
        available: '10,000+ छात्रवृत्तियाँ उपलब्ध',
        countriesCount: '50+ देश',
      },
      home: {
        stats: {
          scholarships: { label: 'उपलब्ध छात्रवृत्तियाँ', desc: 'सभी क्षेत्रों में विविध अवसर' },
          countries: { label: 'देश', desc: 'दक्षिण-पूर्व एशिया और उससे परे वैश्विक पहुँच' },
          students: { label: 'सहायता प्राप्त छात्र', desc: 'हमारे समुदाय की सफलता की कहानियाँ' },
          awarded: { label: 'प्रदान की गई छात्रवृत्तियाँ', desc: 'हमारे प्लेटफ़ॉर्म के माध्यम से कुल मूल्य' },
        },
        howItWorks: {
          title: 'Pathfindr कैसे काम करता है',
          subtitle: 'वैश्विक शिक्षा की ओर आपकी यात्रा यहाँ से शुरू होती है। अपनी सही छात्रवृत्ति खोजने के लिए इन सरल चरणों का पालन करें।',
          steps: {
            step1: { title: 'अपनी प्रोफ़ाइल बनाएँ', desc: 'साइन अप करें और अपनी शैक्षणिक पृष्ठभूमि, रुचियों और लक्ष्यों के बारे में बताएँ।' },
            step2: { title: 'अवसर खोजें', desc: 'हमारे स्मार्ट फ़िल्टर का उपयोग करके हजारों छात्रवृत्तियाँ ब्राउज़ करें।' },
            step3: { title: 'आत्मविश्वास के साथ आवेदन करें', desc: 'अपने आवेदन ट्रैक करें, डेडलाइन प्रबंधित करें और उपयोगी संसाधन एक्सेस करें।' },
            step4: { title: 'अपने सपने पूरे करें', desc: 'छात्रवृत्ति प्राप्त करें और अपनी शैक्षिक यात्रा शुरू करें।' },
          }
        },
        features: {
          title: 'सफलता के लिए सब कुछ',
          subtitle: 'Pathfindr आपको सही छात्रवृत्ति खोजने और सुरक्षित करने में मदद करने के लिए शक्तिशाली उपकरण और संसाधन प्रदान करता है।',
          list: {
            smartSearch: { title: 'स्मार्ट खोज', desc: 'आपकी प्रोफ़ाइल से मेल खाने वाली छात्रवृत्तियाँ खोजने के लिए उन्नत फ़िल्टर।' },
            personalized: { title: 'व्यक्तिगत मिलान', desc: 'आपके लक्ष्यों के आधार पर AI-संचालित सिफ़ारिशें।' },
            global: { title: 'वैश्विक अवसर', desc: '50+ देशों की छात्रवृत्तियाँ एक्सेस करें।' },
            verified: { title: 'सत्यापित लिस्टिंग', desc: 'सभी छात्रवृत्तियाँ सटीकता के लिए सत्यापित हैं।' },
            tracking: { title: 'आवेदन ट्रैकिंग', desc: 'एक डैशबोर्ड में अपने आवेदन ट्रैक करें।' },
            secure: { title: 'सुरक्षित और निजी', desc: 'आपकी व्यक्तिगत जानकारी सुरक्षित है।' },
          },
          detailed: [
            {
              title: 'उन्नत खोज और फ़िल्टर',
              description: 'शक्तिशाली खोज क्षमताओं और स्मार्ट फ़िल्टर के साथ जो चाहें ढूँढें। देश, अध्ययन क्षेत्र, मूल्य और प्रदाता प्रकार के अनुसार फ़िल्टर करें।',
              benefits: ['मल्टी-क्राइटेरिया फ़िल्टरिंग', 'तत्काल खोज परिणाम', 'सहेजी गई खोज प्राथमिकताएँ'],
            },
            {
              title: 'AI-संचालित मिलान',
              description: 'हमारा बुद्धिमान मिलान एल्गोरिदम आपकी प्रोफ़ाइल का विश्लेषण करके उच्चतम सफलता संभावना वाले अवसरों की सिफ़ारिश करता है।',
              benefits: ['व्यक्तिगत सिफ़ारिशें', 'प्रत्येक छात्रवृत्ति के लिए मिलान स्कोर', 'स्मार्ट प्राथमिकता रैंकिंग'],
            },
            {
              title: 'रियल-टाइम सूचनाएँ',
              description: 'कोई डेडलाइन न चूकें। अपनी प्रोफ़ाइल से मेल खाने वाली नई छात्रवृत्तियों और आगामी डेडलाइन के लिए तत्काल सूचनाएँ पाएँ।',
              benefits: ['अनुकूलनीय प्राथमिकताएँ', 'डेडलाइन रिमाइंडर', 'स्थिति परिवर्तन अलर्ट'],
            },
          ]
        },
        featured: {
          title: 'विशेष छात्रवृत्तियाँ',
          subtitle: 'हमारी शीर्ष छात्रवृत्ति अवसरों का अन्वेषण करें जो अभी आवेदन स्वीकार कर रही हैं।',
          viewAll: 'सभी छात्रवृत्तियाँ देखें',
        },
        testimonials: {
          title: 'हमारे छात्रों की सफलता की कहानियाँ',
          subtitle: 'उन हजारों छात्रों से जुड़ें जिन्होंने Pathfindr के माध्यम से अपनी सही छात्रवृत्ति पाई है।',
          list: [
            {
              quote: 'Pathfindr ने सही छात्रवृत्ति खोजना बहुत आसान बना दिया। व्यक्तिगत मिलान सुविधा ने मुझे ऐसे अवसरों से जोड़ा जिनके बारे में मुझे पता भी नहीं था। अब मैं NUS में कंप्यूटर विज्ञान पढ़ रहा हूँ!',
              university: 'नेशनल यूनिवर्सिटी ऑफ सिंगापुर',
              country: 'सिंगापुर',
            },
            {
              quote: 'जब तक मुझे Pathfindr नहीं मिला, मैं उपलब्ध छात्रवृत्तियों की संख्या से अभिभूत था। स्मार्ट फ़िल्टर और डेडलाइन ट्रैकिंग ने मुझे व्यवस्थित रहने में मदद की और अंततः इंजीनियरिंग के लिए पूर्ण छात्रवृत्ति जीती।',
              university: 'यूनिवर्सिटी ऑफ मेलबर्न',
              country: 'ऑस्ट्रेलिया',
            },
            {
              quote: 'पहली पीढ़ी के छात्र के रूप में, छात्रवृत्ति आवेदनों को नेविगेट करना बहुत कठिन था। Pathfindr की सत्यापित लिस्टिंग और आवेदन ट्रैकिंग ने मुझे आत्मविश्वास दिया। अब मैं मेडिसिन पढ़ रहा हूँ!',
              university: 'चुलालोंगकोर्न यूनिवर्सिटी',
              country: 'थाईलैंड',
            },
          ]
        },
        cta: {
          title: 'क्या आप अपनी यात्रा शुरू करने के लिए तैयार हैं?',
          subtitle: 'आज अपनी प्रोफ़ाइल बनाएँ और हजारों अवसरों तक पहुँच प्राप्त करें। हमारे सफल छात्रों के समुदाय में शामिल हों।',
          createAccount: 'मुफ़्त खाता बनाएँ',
          browseScholarships: 'छात्रवृत्तियाँ देखें',
        }
      },
      pricing: {
        title: 'अपना प्लान चुनें',
        subtitle: 'छात्रवृत्तियों के लिए आवेदन शुरू करने के लिए सदस्यता लें। वह प्लान चुनें जो आपकी जरूरतों के अनुसार हो।',
        mostPopular: 'सबसे लोकप्रिय',
        currentPlan: 'वर्तमान प्लान',
        getStarted: '{{name}} चुनें',
        appsPerYear: 'प्रति वर्ष {{count}} छात्रवृत्ति आवेदन',
        whatsIncluded: 'क्या शामिल है:',
        tiers: {
          pro: {
            name: 'Pro',
            features: [
              'प्रति वर्ष 5 छात्रवृत्तियों के लिए आवेदन करें',
              'पूर्ण छात्रवृत्ति विवरण और पात्रता',
              'आवेदन ट्रैकिंग डैशबोर्ड',
              'ईमेल द्वारा डेडलाइन सूचनाएँ',
            ]
          },
          expert: {
            name: 'Expert',
            features: [
              'प्रति वर्ष 20 छात्रवृत्तियों के लिए आवेदन करें',
              'पूर्ण छात्रवृत्ति विवरण और पात्रता',
              'आवेदन ट्रैकिंग डैशबोर्ड',
              'ईमेल द्वारा डेडलाइन सूचनाएँ',
              'प्राथमिकता सहायता',
              'व्यक्तिगत छात्रवृत्ति सिफ़ारिशें',
            ]
          }
        },
        faq: {
          title: 'अक्सर पूछे जाने वाले प्रश्न',
          q1: {
            q: 'एक आवेदन क्या माना जाता है?',
            a: 'जब भी आप किसी छात्रवृत्ति पर "अभी आवेदन करें" दबाते हैं और छात्रवृत्ति प्रदाता के आवेदन पृष्ठ पर पुनर्निर्देशित होते हैं, तो उसे एक आवेदन माना जाता है।'
          },
          q2: {
            q: 'मेरी आवेदन सीमा कब रीसेट होती है?',
            a: 'आपकी आवेदन संख्या प्रत्येक वर्ष आपकी सदस्यता नवीनीकरण पर रीसेट होती है।'
          },
          q3: {
            q: 'क्या मैं अपना प्लान अपग्रेड कर सकता हूँ?',
            a: 'हाँ! आप कभी भी Pro से Expert में अपग्रेड कर सकते हैं। आपके शेष बिलिंग अवधि के लिए मूल्य अंतर आनुपातिक रूप से लगाया जाएगा।'
          },
          q4: {
            q: 'क्या मैं कभी भी रद्द कर सकता हूँ?',
            a: 'बिल्कुल। आप अपने खाता सेटिंग के माध्यम से कभी भी अपनी सदस्यता रद्द कर सकते हैं।'
          }
        }
      },
      footer: {
        description: 'वैश्विक शिक्षा अवसरों तक आपका मार्ग। दक्षिण-पूर्व एशिया और उससे परे छात्रवृत्तियों, बोर्डिंग स्कूलों, अंतर्राष्ट्रीय स्कूलों और इंटर्नशिप से जुड़ें।',
        platform: 'प्लेटफ़ॉर्म',
        resources: 'संसाधन',
        connect: 'संपर्क करें',
        links: {
          universities: 'विश्वविद्यालय',
          internships: 'इंटर्नशिप',
          jobs: 'नौकरियाँ',
          knowledgeBase: 'ज्ञान केंद्र',
          privacyPolicy: 'गोपनीयता नीति',
          termsOfService: 'सेवा की शर्तें',
        },
        allRightsReserved: 'All rights reserved.',
      },
      internationalSchools: {
        title: 'अंतर्राष्ट्रीय स्कूल',
        subtitle: 'शीर्ष अंतर्राष्ट्रीय स्कूलों का अन्वेषण करें। पाठ्यक्रम, फीस की तुलना करें और अपनी शैक्षिक यात्रा के लिए सही स्कूल खोजें।',
        schoolsCount: '{{count}} स्कूल',
        search: {
          placeholder: 'नाम से स्कूल खोजें...',
        },
        sort: {
          label: 'इसके अनुसार क्रमबद्ध करें:',
          name: 'नाम',
          country: 'देश',
          city: 'शहर',
        },
        results: {
          school: '{{count}} स्कूल मिला',
          schools: '{{count}} स्कूल मिले',
        },
        empty: {
          title: 'कोई स्कूल नहीं मिला',
          description: 'आपके मानदंडों से मेल खाने वाले स्कूल नहीं मिले। अपने फ़िल्टर समायोजित करने का प्रयास करें।',
          clearAll: 'सभी फ़िल्टर हटाएँ',
        },
        filters: {
          title: 'फ़िल्टर',
          clearAll: 'सभी हटाएँ',
          country: 'देश',
          curriculum: 'पाठ्यक्रम',
        },
        location: {
          title: 'आपका स्थान',
          locating: 'स्थान खोजा जा रहा है...',
          useCurrent: 'मेरा स्थान उपयोग करें',
          or: 'या',
          selectCity: 'शहर चुनें',
          distance: 'दूरी',
        },
        card: {
          fees: 'फीस:',
          visitWebsite: 'वेबसाइट देखें',
        },
        pagination: {
          previous: 'पिछला',
          next: 'अगला',
        },
      },
      scholarships: {
        title: 'अपनी छात्रवृत्ति खोजें',
        subtitle: 'दुनिया भर की हजारों छात्रवृत्तियाँ ब्राउज़ करें। अपनी प्रोफ़ाइल से मेल खाने वाले अवसर खोजने के लिए हमारे उन्नत फ़िल्टर का उपयोग करें।',
        searchPlaceholder: 'नाम, प्रदाता द्वारा छात्रवृत्ति खोजें...',
        sortBy: 'इसके अनुसार क्रमबद्ध करें:',
        sort: {
          relevant: 'प्रासंगिक',
          deadline: 'डेडलाइन',
          value: 'मूल्य',
          recent: 'हाल का',
        },
        filters: 'फ़िल्टर',
        showResults: '{{count}} परिणाम दिखाएँ',
        previous: 'पिछला',
        next: 'अगला',
        noResults: 'कोई छात्रवृत्ति नहीं मिली',
        clearFilters: 'सभी फ़िल्टर हटाएँ',
        viewDetails: 'विवरण देखें',
        notifyMe: 'मुझे सूचित करें',
        filtersList: {
          title: 'फ़िल्टर',
          clearAll: 'सभी हटाएँ',
          countries: 'देश',
          fieldsOfStudy: 'अध्ययन क्षेत्र',
          providerType: 'प्रदाता प्रकार',
          scholarshipValue: 'छात्रवृत्ति मूल्य',
          minValue: 'न्यूनतम मूल्य (USD)',
          maxValue: 'अधिकतम मूल्य (USD)',
          deadline: 'आवेदन डेडलाइन',
          anyTime: 'कभी भी',
        }
      },
      boardingSchools: {
        title: 'बोर्डिंग स्कूल',
        subtitle: 'दक्षिण-पूर्व एशिया के शीर्ष बोर्डिंग स्कूल खोजें।',
        searchPlaceholder: 'नाम से स्कूल खोजें...',
        filters: 'फ़िल्टर',
        noResults: 'कोई स्कूल नहीं मिला',
        category: 'श्रेणी',
        state: 'राज्य/प्रांत',
        managedBy: '{{provider}} द्वारा प्रबंधित',
        filtersList: {
          schoolType: 'स्कूल प्रकार',
          gender: 'लिंग',
          boysOnly: 'केवल लड़के',
          girlsOnly: 'केवल लड़कियाँ',
          coed: 'सहशिक्षा',
          entryLevel: 'प्रवेश स्तर',
          managedBy: 'द्वारा प्रबंधित',
          all: 'सभी',
        }
      },
      internships: {
        title: 'इंटर्नशिप',
        subtitle: 'अग्रणी कंपनियों में इंटर्नशिप के साथ अपना अगला करियर कदम खोजें।',
        searchPlaceholder: 'भूमिका या कंपनी खोजें...',
        filters: 'फ़िल्टर',
        noResults: 'कोई इंटर्नशिप नहीं मिली',
        applyBy: '{{date}} तक आवेदन करें',
        filtersList: {
          fullTime: 'पूर्णकालिक',
          partTime: 'अंशकालिक',
          remote: 'रिमोट',
        }
      },
      profileView: {
        title: 'मेरी प्रोफ़ाइल',
        editProfile: 'प्रोफ़ाइल संपादित करें',
        notFound: 'प्रोफ़ाइल नहीं मिली',
        notFoundDesc: 'आपने अभी तक अपनी प्रोफ़ाइल पूरी नहीं की है। इसे यहाँ देखने के लिए पूरी करें।',
        completeProfileBtn: 'प्रोफ़ाइल पूरी करें',
        resumeOptimizer: {
          title: 'रेज़्यूमे ऑप्टिमाइज़र',
          score: 'प्रोफ़ाइल स्कोर',
          scoreLabel: 'स्कोर',
          ranking: 'रैंकिंग',
          generateBtn: 'ऑप्टिमाइज़्ड रेज़्यूमे बनाएँ',
          suggestions: 'सुधार के सुझाव',
          copyLink: 'शेयर लिंक कॉपी करें',
          viewPublic: 'सार्वजनिक रेज़्यूमे देखें',
          copySuccess: 'शेयर लिंक क्लिपबोर्ड पर कॉपी हो गया!',
          perfectProfile: 'आपकी प्रोफ़ाइल परफेक्ट है! आप ऑप्टिमाइज़्ड रेज़्यूमे बनाने के लिए तैयार हैं।',
          aiDescription: 'हमारी AI-संचालित प्रणाली आपकी प्रोफ़ाइल को एक पेशेवर, भर्ती-तैयार रेज़्यूमे में फ़ॉर्मेट करती है।',
          previewTitle: 'रेज़्यूमे पूर्वावलोकन',
          printBtn: 'प्रिंट / PDF के रूप में सहेजें',
          footer: 'PathFindr ऑप्टिमाइज़्ड रेज़्यूमे इंजन द्वारा बनाया गया',
          percentageComplete: '{{progress}}% पूर्ण',
          levels: {
            needsImprovement: 'सुधार की जरूरत है',
            goodProgress: 'अच्छी प्रगति',
            professional: 'पेशेवर',
            elite: 'अभिजात',
          },
          descriptions: {
            needsImprovement: 'आपकी प्रोफ़ाइल को अलग दिखने के लिए और विवरण चाहिए।',
            goodProgress: 'आप एक मजबूत आधार बना रहे हैं।',
            professional: 'आप अधिकांश करियर अवसरों के लिए तैयार हैं।',
            elite: 'आपकी प्रोफ़ाइल शीर्ष स्तरीय भर्ती के लिए अत्यधिक प्रतिस्पर्धी है।',
          },
          suggestionsList: {
            phone: 'भर्तीकर्ताओं के लिए अपना फ़ोन नंबर जोड़ें।',
            gpa: 'शैक्षणिक उत्कृष्टता दिखाने के लिए अपना GPA या ग्रेड शामिल करें।',
            education: 'अपनी शैक्षणिक पृष्ठभूमि सूचीबद्ध करें।',
            skills: 'अधिक उद्योग-प्रासंगिक कौशल जोड़ें (न्यूनतम 8 का लक्ष्य रखें)।',
            skillsBasic: 'अपने तकनीकी और पेशेवर कौशल प्रदर्शित करें।',
            projectDetail: 'अपने प्रोजेक्ट के लिए अधिक विस्तृत विवरण लिखें।',
            projectDetailBasic: 'व्यावहारिक अनुभव दिखाने के लिए शैक्षणिक या व्यक्तिगत प्रोजेक्ट का विवरण दें।',
            certificates: 'अपनी विशेषज्ञता को मान्य करने के लिए प्रमाणपत्र जोड़ें।',
            subjectScores: 'अपनी शैक्षणिक प्रोफ़ाइल को मजबूत करने के लिए IGCSE, SPM, या O-Level विषय परिणाम जोड़ें।',
            extracurricularBasic: 'नेतृत्व और व्यक्तित्व दिखाने के लिए पाठ्येतर गतिविधियाँ शामिल करें।',
            extracurricularCount: 'एक सर्वांगीण प्रोफ़ाइल दिखाने के लिए कम से कम 3 पाठ्येतर गतिविधियाँ जोड़ें।',
          },
          sections: {
            education: 'शिक्षा',
            projects: 'मुख्य प्रोजेक्ट',
            expertise: 'विशेषज्ञता',
            certificates: 'प्रमाणपत्र',
            testScores: 'परीक्षा स्कोर',
            extracurriculars: 'पाठ्येतर गतिविधियाँ',
          },
          placeholders: {
            noEducation: 'कोई शिक्षा प्रविष्टि नहीं जोड़ी गई। भर्तीकर्ता शैक्षणिक पृष्ठभूमि को प्राथमिकता देते हैं।',
            noProjects: 'अपने कौशल के व्यावहारिक अनुप्रयोग को दिखाने के लिए प्रासंगिक प्रोजेक्ट जोड़ें।',
            noSkills: 'अपने मुख्य कठिन और नरम कौशल सूचीबद्ध करें।',
            noCertificates: 'अपने आधिकारिक प्रमाणन और निरंतर सीखने का प्रदर्शन करें।',
            noTestScores: 'मानक परीक्षा स्कोर (SAT, IELTS, आदि) आपकी शैक्षणिक स्थिति को मजबूत करते हैं।',
            noExtracurriculars: 'अभी तक कोई पाठ्येतर गतिविधि नहीं जोड़ी गई।',
          }
        },
        common: {
          in: 'में',
          score: 'स्कोर',
        },
        fields: {
          dob: 'जन्म तिथि',
          gender: 'लिंग',
          nationality: 'राष्ट्रीयता',
          country: 'निवास देश',
          phone: 'फ़ोन',
          gpa: 'GPA',
          grade: 'ग्रेड/स्तर',
          present: 'वर्तमान',
          preferredCountries: 'पसंदीदा देश',
          availability: 'उपलब्धता',
        }
      },
      referral: {
        title: 'रेफरल प्रोग्राम',
        code: {
          label: 'आपका रेफरल कोड',
          copy: 'कोड कॉपी करें',
          copyLink: 'लिंक कॉपी करें',
          description: 'पुरस्कार अर्जित करने के लिए यह कोड साझा करें',
        },
        emphasize: {
          title: '1 साल मुफ़्त पाएँ!',
          description: 'Pathfindr पर 5 दोस्तों को आमंत्रित करें और स्वचालित रूप से सक्रिय 1 साल की Pro सदस्यता पाएँ!',
        },
        progress: {
          title: 'रेफरल प्रगति',
          count: '{{count}}/5 दोस्त',
          inviteToEarn: 'एक साल की मुफ़्त Pro सदस्यता पाने के लिए 5 दोस्तों को आमंत्रित करें',
          moreNeeded: 'Pro पाने के लिए {{count}} और दोस्त चाहिए',
          moreNeeded_plural: 'Pro पाने के लिए {{count}} और दोस्त चाहिए',
        }
      },
    }
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
