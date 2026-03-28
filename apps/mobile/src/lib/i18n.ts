import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';

const LANGUAGE_KEY = 'pathfindr_language';

const resources = {
  en: {
    translation: {
      // --- Navigation / Common ---
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
      // --- Hero Section ---
      hero: {
        badge: 'Discover Your Global Educational Journey',
        titlePart1: 'Find Your Perfect ',
        titlePart2: 'Scholarship',
        subtitle: 'Connect with thousands of scholarships, universities, internships, and job opportunities across Southeast Asia and beyond. Your future starts here.',
        browseBtn: 'Browse Scholarships',
        learnMoreBtn: 'Learn More',
        trustedBy: 'Trusted by 5,000+ students',
        available: '10,000+ scholarships available',
        countriesCount: '50+ countries',
      },
      // --- Home Page ---
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
          }
        },
        featured: {
          title: 'Featured Scholarships',
          subtitle: 'Explore our top scholarship opportunities currently accepting applications.',
          viewAll: 'View All Scholarships',
        },
        testimonials: {
          title: 'Success Stories from Our Students',
          subtitle: 'Join thousands of students who have found their perfect scholarship through Pathfindr.',
        },
        cta: {
          title: 'Ready to Start Your Journey?',
          subtitle: 'Create your profile today and unlock access to thousands of opportunities. Join our community of successful students achieving their dreams.',
          createAccount: 'Create Free Account',
          browseScholarships: 'Browse Scholarships',
        }
      },
      // --- Pricing ---
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
          q1: { q: 'What counts as an application?', a: 'Each time you click "Apply Now" on a scholarship and are redirected to the scholarship provider\'s application page, it counts as one application.' },
          q2: { q: 'When does my application limit reset?', a: 'Your application count resets annually when your subscription renews.' },
          q3: { q: 'Can I upgrade my plan?', a: 'Yes! You can upgrade from Pro to Expert at any time. The price difference will be prorated for the remainder of your billing period.' },
          q4: { q: 'Can I cancel anytime?', a: "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period." }
        }
      },
      // --- Profile ---
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
            gender: { label: 'Gender', placeholder: 'Select gender', male: 'Male', female: 'Female', other: 'Other', preferNotToSay: 'Prefer not to say' },
            nationality: { label: 'Nationality', placeholder: 'e.g., Malaysian, British' },
            country: { label: 'Country of Residence', placeholder: 'e.g., Malaysia, United Kingdom' },
          },
          education: {
            title: 'Education History',
            subtitle: 'Add your academic qualifications (most recent first)',
            entry: 'Education {{index}}',
            addAnother: 'Add Another Education',
            institution: { label: 'Institution Name', placeholder: 'e.g., Universiti Malaya' },
            qualification: { label: 'Qualification', placeholder: 'Select qualification' },
            fieldOfStudy: { label: 'Field of Study', placeholder: 'e.g., Computer Science' },
            startDate: 'Start Date',
            endDate: { label: 'End Date', helper: 'Leave empty if currently studying' },
            grade: { label: 'Grade', placeholder: 'e.g., First Class, A+, Distinction' },
            gpa: { label: 'GPA (out of 4.0)', placeholder: 'e.g., 3.8' },
            qualifications: {
              highSchool: 'High School Diploma', associate: 'Associate Degree',
              bachelorArts: 'Bachelor of Arts', bachelorScience: 'Bachelor of Science',
              bachelorEng: 'Bachelor of Engineering', masterArts: 'Master of Arts',
              masterScience: 'Master of Science', mba: 'MBA', phd: 'PhD',
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
            certificates: { title: 'Certificates', entry: 'Certificate {{index}}', addAnother: 'Add Certificate', itemTitle: 'Certificate Title', issuer: 'Issuer', dateIssued: 'Date Issued', placeholder: 'e.g., AWS Solutions Architect' },
            projects: { title: 'Academic / Personal Projects', entry: 'Project {{index}}', addAnother: 'Add Project', itemTitle: 'Project Title', description: 'Description', technologies: 'Technologies', startDate: 'Start Date', endDate: 'End Date', placeholder: 'e.g., AI-Powered Scholarship Matcher', descPlaceholder: 'Briefly describe the project and your role' },
            skills: { title: 'Skills', placeholder: 'Type a skill and press Enter (e.g., Python, Leadership)' },
          },
          preferences: {
            title: 'Career Preferences',
            subtitle: 'Tell us about your interests so we can match you with the right scholarships',
            interests: { label: 'Interests', placeholder: 'e.g., Technology, Healthcare, Education' },
            studyCountries: { label: 'Preferred Study Countries', placeholder: 'e.g., United States, United Kingdom, Germany' },
            availability: { label: 'When are you planning to start?', placeholder: 'e.g., Fall 2026, January 2027, Immediately' },
            complete: 'Complete Profile',
            saving: 'Saving profile...',
          },
        },
      },
      // --- Footer ---
      footer: {
        description: 'Your path to global educational opportunities. Connect with scholarships, universities, internships, and jobs across Southeast Asia and beyond.',
        platform: 'Platform',
        resources: 'Resources',
        connect: 'Connect',
        links: { universities: 'Universities', internships: 'Internships', jobs: 'Jobs', helpCenter: 'Help Center', privacyPolicy: 'Privacy Policy', termsOfService: 'Terms of Service' },
        allRightsReserved: 'All rights reserved.',
        madeWith: 'Made with',
        inSEA: 'in Southeast Asia',
      },
      // --- International Schools ---
      internationalSchools: {
        title: 'International Schools',
        subtitle: 'Explore {{total}} top international schools across Malaysia, Indonesia, and China.',
        schoolsCount: '{{count}} schools',
        search: { placeholder: 'Search schools by name...' },
        sort: { label: 'Sort by:', name: 'Name', country: 'Country', city: 'City' },
        results: { school: '{{count}} school found', schools: '{{count}} schools found' },
        empty: { title: 'No schools found', description: "We couldn't find any international schools matching your criteria.", clearAll: 'Clear All Filters' },
        filters: { title: 'Filters', clearAll: 'Clear all', clearAllBtn: 'Clear All Filters', country: 'Country', curriculum: 'Curriculum' },
        card: { fees: 'Fees:', visitWebsite: 'Visit Website' },
        pagination: { previous: 'Previous', next: 'Next' },
        mobile: { filters: 'Filters', showResults: 'Show {{count}} Results' },
      },
      // --- Mobile-specific keys ---
      mobile: {
        home: {
          subtitle: 'Your Path to Global Educational Opportunities',
          description: 'Connect with scholarships, university programmes, internships, and jobs across Southeast Asia and beyond',
          whatWeOffer: 'What We Offer',
          scholarshipsDesc: 'Discover and apply for scholarships from governments, universities, and organizations',
          internshipsDesc: 'Find internship opportunities to kickstart your career',
          boardingSchoolsDesc: 'Discover top boarding schools across the nation',
          internationalSchoolsDesc: 'Explore modern international education options globally',
        },
        auth: {
          welcomeBack: 'Welcome Back',
          signInSubtitle: 'Sign in to your account to continue',
          email: 'Email',
          emailPlaceholder: 'your@email.com',
          password: 'Password',
          passwordPlaceholder: 'Enter your password',
          forgotPassword: 'Forgot password?',
          signingIn: 'Signing In...',
          signIn: 'Sign In',
          noAccount: "Don't have an account? ",
          signUp: 'Sign Up',
          createAccount: 'Create Account',
          createAccountSubtitle: 'Join Pathfindr to discover opportunities',
          fullName: 'Full Name',
          fullNamePlaceholder: 'Enter your full name',
          confirmPassword: 'Confirm Password',
          confirmPasswordPlaceholder: 'Re-enter your password',
          creating: 'Creating Account...',
          haveAccount: 'Already have an account? ',
        },
        profile: {
          completeProfile: 'Complete Your Profile',
          completeProfileDesc: "You haven't completed your profile yet. Complete it to unlock personalized recommendations.",
          completeProfileBtn: 'Complete Profile',
          personalDetails: 'Personal Details',
          educationHistory: 'Education History',
          standardizedTests: 'Standardized Tests',
          certifications: 'Certifications',
          skillsAndInterests: 'Skills & Interests',
          topSkills: 'Top Skills',
          interests: 'Interests',
          careerPreferences: 'Career Preferences',
          preferredCountries: 'Preferred Countries',
          availability: 'Availability',
          notSpecified: 'Not specified',
          edit: 'Edit',
        },
        common: {
          language: 'Language',
        },
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
        subtitle: 'Berhubung dengan beribu-ribu biasiswa, universiti, latihan amali, dan peluang pekerjaan di seluruh Asia Tenggara dan seterusnya. Masa depan anda bermula di sini.',
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
          subtitle: 'Perjalanan anda ke pendidikan global bermula di sini.',
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
          }
        },
        featured: { title: 'Biasiswa Pilihan', subtitle: 'Terokai peluang biasiswa terbaik kami.', viewAll: 'Lihat Semua Biasiswa' },
        testimonials: { title: 'Kisah Kejayaan Pelajar Kami', subtitle: 'Sertai beribu-ribu pelajar yang telah menemui biasiswa sempurna melalui Pathfindr.' },
        cta: {
          title: 'Sedia untuk Memulai Perjalanan Anda?',
          subtitle: 'Bina profil anda hari ini dan buka akses ke beribu-ribu peluang.',
          createAccount: 'Bina Akaun Percuma',
          browseScholarships: 'Lihat Biasiswa',
        }
      },
      pricing: {
        title: 'Pilih pelan anda',
        subtitle: 'Langgan untuk mula memohon biasiswa.',
        mostPopular: 'Paling Popular',
        currentPlan: 'Pelan Semasa',
        getStarted: 'Dapatkan {{name}}',
        appsPerYear: '{{count}} permohonan biasiswa setiap tahun',
        whatsIncluded: 'Apa yang disertakan:',
        tiers: {
          pro: { name: 'Pro', features: ['Mohon kepada 5 biasiswa setiap tahun', 'Maklumat penuh biasiswa & kelayakan', 'Papan pemuka pengesanan permohonan', 'Pemberitahuan e-mel untuk tarikh akhir'] },
          expert: { name: 'Expert', features: ['Mohon kepada 20 biasiswa setiap tahun', 'Maklumat penuh biasiswa & kelayakan', 'Papan pemuka pengesanan permohonan', 'Pemberitahuan e-mel untuk tarikh akhir', 'Sokongan keutamaan', 'Syor padanan biasiswa'] }
        },
        faq: {
          title: 'Soalan Lazim',
          q1: { q: 'Apakah yang dikira sebagai permohonan?', a: 'Setiap kali anda mengklik "Mohon Sekarang" pada biasiswa dan diarahkan ke halaman permohonan penyedia biasiswa, ia dikira sebagai satu permohonan.' },
          q2: { q: 'Bilakah had permohonan saya ditetapkan semula?', a: 'Jumlah permohonan anda ditetapkan semula setiap tahun apabila langganan anda diperbaharui.' },
          q3: { q: 'Bolehkah saya menaik taraf pelan saya?', a: 'Ya! Anda boleh menaik taraf daripada Pro ke Expert pada bila-bila masa.' },
          q4: { q: 'Bolehkah saya membatalkan pada bila-bila masa?', a: 'Sudah tentu. Anda boleh membatalkan langganan anda pada bila-bila masa daripada tetapan akaun anda.' }
        }
      },
      profile: {
        complete: { title: 'Lengkapkan Profil Akademik Anda', subtitle: 'Bantu kami memadankan anda dengan biasiswa terbaik' },
        steps: { personalDetails: 'Butiran Peribadi', education: 'Pendidikan', testScores: 'Skor Ujian', achievements: 'Pencapaian', preferences: 'Keutamaan' },
        forms: {
          common: { back: 'Kembali', next: 'Seterusnya', required: 'diperlukan', select: 'Pilih', add: 'Tambah', delete: 'Padam', other: 'Lain-lain', saveProgress: 'Menyimpan kemajuan...' },
          personalDetails: {
            title: 'Butiran Peribadi', subtitle: 'Mari mulakan dengan beberapa maklumat asas tentang anda', dateOfBirth: 'Tarikh Lahir',
            gender: { label: 'Jantina', placeholder: 'Pilih jantina', male: 'Lelaki', female: 'Perempuan', other: 'Lain-lain', preferNotToSay: 'Tidak mahu memberitahu' },
            nationality: { label: 'Kewarganegaraan', placeholder: 'cth., Malaysia, British' },
            country: { label: 'Negara Kediaman', placeholder: 'cth., Malaysia, United Kingdom' },
          },
          education: {
            title: 'Sejarah Pendidikan', subtitle: 'Tambah kelayakan akademik anda', entry: 'Pendidikan {{index}}', addAnother: 'Tambah Pendidikan Lain',
            institution: { label: 'Nama Institusi', placeholder: 'cth., Universiti Malaya' },
            qualification: { label: 'Kelayakan', placeholder: 'Pilih kelayakan' },
            fieldOfStudy: { label: 'Bidang Pengajian', placeholder: 'cth., Sains Komputer' },
            startDate: 'Tarikh Mula', endDate: { label: 'Tarikh Tamat', helper: 'Tinggalkan kosong jika masih belajar' },
            grade: { label: 'Gred', placeholder: 'cth., Kelas Pertama, A+' },
            gpa: { label: 'GPA (daripada 4.0)', placeholder: 'cth., 3.8' },
            qualifications: { highSchool: 'Diploma Sekolah Menengah', associate: 'Ijazah Bersekutu', bachelorArts: 'Sarjana Muda Sastera', bachelorScience: 'Sarjana Muda Sains', bachelorEng: 'Sarjana Muda Kejuruteraan', masterArts: 'Sarjana Sastera', masterScience: 'Sarjana Sains', mba: 'MBA', phd: 'PhD' },
          },
          testScores: {
            title: 'Skor Ujian Piawai', subtitle: 'Tambah skor untuk sebarang ujian yang anda duduki.',
            sat: { label: 'Skor SAT', placeholder: 'cth., 1450', helper: 'Jumlah skor (400–1600)' },
            ielts: { label: 'Skor IELTS', placeholder: 'cth., 7.5', helper: 'Skor band keseluruhan (0–9)' },
            toefl: { label: 'Skor TOEFL', placeholder: 'cth., 105', helper: 'Jumlah skor (0–120)' },
            gre: { label: 'Skor GRE', placeholder: 'cth., 325', helper: 'Lisan + Kuant gabungan (260–340)' },
            gmat: { label: 'Skor GMAT', placeholder: 'cth., 720', helper: 'Jumlah skor (200–800)' },
          },
          achievements: {
            title: 'Pencapaian & Kemahiran', subtitle: 'Tunjukkan sijil, projek, dan kemahiran anda.',
            certificates: { title: 'Sijil', entry: 'Sijil {{index}}', addAnother: 'Tambah Sijil', itemTitle: 'Tajuk Sijil', issuer: 'Penerbit', dateIssued: 'Tarikh Diterbitkan', placeholder: 'cth., Arkitek Penyelesaian AWS' },
            projects: { title: 'Projek Akademik / Peribadi', entry: 'Projek {{index}}', addAnother: 'Tambah Projek', itemTitle: 'Tajuk Projek', description: 'Penerangan', technologies: 'Teknologi', startDate: 'Tarikh Mula', endDate: 'Tarikh Tamat', placeholder: 'cth., Pemadan Biasiswa Dikuasakan AI', descPlaceholder: 'Terangkan secara ringkas tentang projek dan peranan anda' },
            skills: { title: 'Kemahiran', placeholder: 'Taip kemahiran dan tekan Enter' },
          },
          preferences: {
            title: 'Keutamaan Kerjaya', subtitle: 'Beritahu kami tentang minat anda',
            interests: { label: 'Minat', placeholder: 'cth., Teknologi, Penjagaan Kesihatan, Pendidikan' },
            studyCountries: { label: 'Negara Pengajian Pilihan', placeholder: 'cth., Amerika Syarikat, United Kingdom' },
            availability: { label: 'Bilakah anda merancang untuk bermula?', placeholder: 'cth., Musim Luruh 2026' },
            complete: 'Lengkapkan Profil', saving: 'Menyimpan profil...',
          },
        },
      },
      footer: {
        description: 'Laluan anda ke peluang pendidikan global.',
        platform: 'Platform', resources: 'Sumber', connect: 'Hubungi Kami',
        links: { universities: 'Universiti', internships: 'Latihan Amali', jobs: 'Pekerjaan', helpCenter: 'Pusat Bantuan', privacyPolicy: 'Dasar Privasi', termsOfService: 'Syarat Perkhidmatan' },
        allRightsReserved: 'Hak cipta terpelihara.', madeWith: 'Dibuat dengan', inSEA: 'di Asia Tenggara',
      },
      internationalSchools: {
        title: 'Sekolah Antarabangsa',
        subtitle: 'Terokai {{total}} sekolah antarabangsa terbaik.',
        schoolsCount: '{{count}} sekolah',
        search: { placeholder: 'Cari sekolah mengikut nama...' },
        sort: { label: 'Susun mengikut:', name: 'Nama', country: 'Negara', city: 'Bandar' },
        results: { school: '{{count}} sekolah ditemui', schools: '{{count}} sekolah ditemui' },
        empty: { title: 'Tiada sekolah ditemui', description: 'Kami tidak dapat mencari sekolah antarabangsa yang sepadan.', clearAll: 'Kosongkan Semua Penapis' },
        filters: { title: 'Penapis', clearAll: 'Kosongkan semua', clearAllBtn: 'Kosongkan Semua Penapis', country: 'Negara', curriculum: 'Kurikulum' },
        card: { fees: 'Yuran:', visitWebsite: 'Lawati Laman Web' },
        pagination: { previous: 'Sebelumnya', next: 'Seterusnya' },
        mobile: { filters: 'Penapis', showResults: 'Tunjukkan {{count}} Keputusan' },
      },
      mobile: {
        home: {
          subtitle: 'Laluan Anda ke Peluang Pendidikan Global',
          description: 'Hubungi biasiswa, program universiti, latihan amali, dan pekerjaan di seluruh Asia Tenggara dan seterusnya',
          whatWeOffer: 'Apa yang Kami Tawarkan',
          scholarshipsDesc: 'Temui dan mohon biasiswa daripada kerajaan, universiti, dan organisasi',
          internshipsDesc: 'Cari peluang latihan amali untuk memulakan kerjaya anda',
          boardingSchoolsDesc: 'Temui sekolah berasrama terbaik di seluruh negara',
          internationalSchoolsDesc: 'Terokai pilihan pendidikan antarabangsa moden secara global',
        },
        auth: {
          welcomeBack: 'Selamat Kembali',
          signInSubtitle: 'Log masuk ke akaun anda untuk meneruskan',
          email: 'E-mel',
          emailPlaceholder: 'anda@emel.com',
          password: 'Kata Laluan',
          passwordPlaceholder: 'Masukkan kata laluan anda',
          forgotPassword: 'Lupa kata laluan?',
          signingIn: 'Sedang Log Masuk...',
          signIn: 'Log Masuk',
          noAccount: 'Tiada akaun? ',
          signUp: 'Daftar',
          createAccount: 'Buat Akaun',
          createAccountSubtitle: 'Sertai Pathfindr untuk menemui peluang',
          fullName: 'Nama Penuh',
          fullNamePlaceholder: 'Masukkan nama penuh anda',
          confirmPassword: 'Sahkan Kata Laluan',
          confirmPasswordPlaceholder: 'Masukkan semula kata laluan anda',
          creating: 'Mencipta Akaun...',
          haveAccount: 'Sudah ada akaun? ',
        },
        profile: {
          completeProfile: 'Lengkapkan Profil Anda',
          completeProfileDesc: 'Anda belum melengkapkan profil anda. Lengkapkan untuk membuka syor yang diperibadikan.',
          completeProfileBtn: 'Lengkapkan Profil',
          personalDetails: 'Butiran Peribadi',
          educationHistory: 'Sejarah Pendidikan',
          standardizedTests: 'Ujian Piawai',
          certifications: 'Pensijilan',
          skillsAndInterests: 'Kemahiran & Minat',
          topSkills: 'Kemahiran Teratas',
          interests: 'Minat',
          careerPreferences: 'Keutamaan Kerjaya',
          preferredCountries: 'Negara Pilihan',
          availability: 'Ketersediaan',
          notSpecified: 'Tidak dinyatakan',
          edit: 'Sunting',
        },
        common: {
          language: 'Bahasa',
        },
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
        subtitle: '连接东南亚及海外成千上万的奖学金、大学、实习和工作机会。您的未来从这里开始。',
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
          subtitle: '您的全球教育之旅从这里开始。',
          steps: {
            step1: { title: '创建个人资料', desc: '注册并告诉我们您的学术背景、兴趣和目标。' },
            step2: { title: '发现机会', desc: '使用我们的智能过滤器浏览成千上万的奖学金。' },
            step3: { title: '自信申请', desc: '跟踪您的申请、管理截止日期并访问有用资源。' },
            step4: { title: '实现梦想', desc: '获得奖学金并开启您的教育之旅。' },
          }
        },
        features: {
          title: '助您成功所需的一切',
          subtitle: 'Pathfindr 提供强大的工具和资源。',
          list: {
            smartSearch: { title: '智能搜索', desc: '高级过滤器，寻找匹配您资料的奖学金。' },
            personalized: { title: '个性化匹配', desc: '基于您目标的 AI 驱动推荐。' },
            global: { title: '全球机会', desc: '访问来自 50 多个国家的奖学金。' },
            verified: { title: '认证列表', desc: '所有奖学金经过验证以确保准确。' },
            tracking: { title: '申请跟踪', desc: '在一个仪表板中跟踪您的申请。' },
            secure: { title: '安全与私密', desc: '您的个人信息受到保护。' },
          }
        },
        featured: { title: '精选奖学金', subtitle: '探索我们目前正在接受申请的热门奖学金。', viewAll: '查看所有奖学金' },
        testimonials: { title: '我们学生的成功故事', subtitle: '加入成千上万通过 Pathfindr 找到完美奖学金的学生行列。' },
        cta: {
          title: '准备好开启您的旅程了吗？',
          subtitle: '立即创建您的资料，开启成千上万个机会的大门。',
          createAccount: '创建免费账户',
          browseScholarships: '浏览奖学金',
        }
      },
      pricing: {
        title: '选择您的计划',
        subtitle: '订阅并开始申请奖学金。',
        mostPopular: '最受欢迎',
        currentPlan: '当前计划',
        getStarted: '获取 {{name}}',
        appsPerYear: '每年 {{count}} 次奖学金申请',
        whatsIncluded: '包含内容：',
        tiers: {
          pro: { name: 'Pro 专业版', features: ['每年申请 5 项奖学金', '完整的奖学金详情和资格信息', '申请跟踪仪表板', '截止日期电子邮件通知'] },
          expert: { name: 'Expert 专家版', features: ['每年申请 20 项奖学金', '完整的奖学金详情和资格信息', '申请跟踪仪表板', '截止日期电子邮件通知', '优先支持', '奖学金匹配推荐'] }
        },
        faq: {
          title: '常见问题',
          q1: { q: '什么是申请？', a: '每次您点击"立即申请"并被重定向到奖学金申请页面时，都计为一次申请。' },
          q2: { q: '我的申请限额何时重置？', a: '您的申请计数将在每年订阅续订时重置。' },
          q3: { q: '我可以升级我的计划吗？', a: '可以！您可以随时从 Pro 升级到 Expert。' },
          q4: { q: '我可以随时取消吗？', a: '当然可以。您可以随时通过账户设置取消订阅。' }
        }
      },
      profile: {
        complete: { title: '完善您的学术资料', subtitle: '帮助我们为您匹配最合适的奖学金' },
        steps: { personalDetails: '个人详情', education: '教育经历', testScores: '考试成绩', achievements: '个人成就', preferences: '偏好设置' },
        forms: {
          common: { back: '上一步', next: '下一步', required: '必填', select: '选择', add: '添加', delete: '删除', other: '其他', saveProgress: '正在保存进度...' },
          personalDetails: {
            title: '个人详情', subtitle: '让我们从一些基本信息开始', dateOfBirth: '出生日期',
            gender: { label: '性别', placeholder: '选择性别', male: '男', female: '女', other: '其他', preferNotToSay: '不便透露' },
            nationality: { label: '国籍', placeholder: '例如：马来西亚，英国' },
            country: { label: '居住国家', placeholder: '例如：马来西亚，英国' },
          },
          education: {
            title: '教育经历', subtitle: '添加您的学术资历', entry: '教育经历 {{index}}', addAnother: '添加其他教育经历',
            institution: { label: '院校名称', placeholder: '例如：马来亚大学' },
            qualification: { label: '资历', placeholder: '选择资历' },
            fieldOfStudy: { label: '专业领域', placeholder: '例如：计算机科学' },
            startDate: '开始日期', endDate: { label: '结束日期', helper: '如果在读请留空' },
            grade: { label: '成绩', placeholder: '例如：一等学位，A+' },
            gpa: { label: 'GPA (4.0分制)', placeholder: '例如：3.8' },
            qualifications: { highSchool: '高中毕业证', associate: '副学士学位', bachelorArts: '文学学士', bachelorScience: '理学学士', bachelorEng: '工学学士', masterArts: '文学硕士', masterScience: '理学硕士', mba: '工商管理硕士 (MBA)', phd: '博士 (PhD)' },
          },
          testScores: {
            title: '标准化考试成绩', subtitle: '添加您参加过的考试成绩。',
            sat: { label: 'SAT 成绩', placeholder: '例如：1450', helper: '总分 (400–1600)' },
            ielts: { label: 'IELTS 成绩', placeholder: '例如：7.5', helper: '总分 (0–9)' },
            toefl: { label: 'TOEFL 成绩', placeholder: '例如：105', helper: '总分 (0–120)' },
            gre: { label: 'GRE 成绩', placeholder: '例如：325', helper: '语文 + 数学总分 (260–340)' },
            gmat: { label: 'GMAT 成绩', placeholder: '例如：720', helper: '总分 (200–800)' },
          },
          achievements: {
            title: '成就与技能', subtitle: '展示您的证书、项目和技能。',
            certificates: { title: '证书', entry: '证书 {{index}}', addAnother: '添加证书', itemTitle: '证书名称', issuer: '颁发机构', dateIssued: '颁发日期', placeholder: '例如：AWS 解决方案架构师' },
            projects: { title: '学术 / 个人项目', entry: '项目 {{index}}', addAnother: '添加项目', itemTitle: '项目名称', description: '描述', technologies: '技术栈', startDate: '开始日期', endDate: '结束日期', placeholder: '例如：AI 驱动的奖学金匹配器', descPlaceholder: '简要描述项目及您的职责' },
            skills: { title: '技能', placeholder: '输入技能并按回车' },
          },
          preferences: {
            title: '职业偏好', subtitle: '告诉我们您的兴趣',
            interests: { label: '兴趣', placeholder: '例如：技术，医疗保健，教育' },
            studyCountries: { label: '首选留学国家', placeholder: '例如：美国，英国，德国' },
            availability: { label: '您计划何时开始？', placeholder: '例如：2026 秋季' },
            complete: '完成个人资料', saving: '正在保存资料...',
          },
        },
      },
      footer: {
        description: '通往全球教育机会的必经之路。',
        platform: '平台', resources: '资源', connect: '联系我们',
        links: { universities: '大学', internships: '实习机会', jobs: '就业职位', helpCenter: '帮助中心', privacyPolicy: '隐私政策', termsOfService: '服务条款' },
        allRightsReserved: '版权所有。', madeWith: '精心制作', inSEA: '在东南亚',
      },
      internationalSchools: {
        title: '国际学校',
        subtitle: '探索 {{total}} 所顶级国际学校。',
        schoolsCount: '{{count}} 所学校',
        search: { placeholder: '按名称搜索学校...' },
        sort: { label: '排序方式：', name: '名称', country: '国家', city: '城市' },
        results: { school: '找到 {{count}} 所学校', schools: '找到 {{count}} 所学校' },
        empty: { title: '未找到学校', description: '未找到符合您条件的国际学校。', clearAll: '清除所有筛选' },
        filters: { title: '筛选', clearAll: '清除所有', clearAllBtn: '清除所有筛选', country: '国家', curriculum: '课程体系' },
        card: { fees: '学费：', visitWebsite: '访问网站' },
        pagination: { previous: '上一页', next: '下一页' },
        mobile: { filters: '筛选', showResults: '显示 {{count}} 个结果' },
      },
      mobile: {
        home: {
          subtitle: '通往全球教育机会的道路',
          description: '连接东南亚及海外的奖学金、大学项目、实习和工作机会',
          whatWeOffer: '我们提供什么',
          scholarshipsDesc: '发现并申请来自政府、大学和组织的奖学金',
          internshipsDesc: '寻找实习机会，开启您的职业生涯',
          boardingSchoolsDesc: '发现全国顶级寄宿学校',
          internationalSchoolsDesc: '探索全球现代国际教育选择',
        },
        auth: {
          welcomeBack: '欢迎回来',
          signInSubtitle: '登录您的账户以继续',
          email: '电子邮件',
          emailPlaceholder: 'your@email.com',
          password: '密码',
          passwordPlaceholder: '输入您的密码',
          forgotPassword: '忘记密码？',
          signingIn: '正在登录...',
          signIn: '登录',
          noAccount: '没有账户？',
          signUp: '注册',
          createAccount: '创建账户',
          createAccountSubtitle: '加入 Pathfindr 发现更多机会',
          fullName: '全名',
          fullNamePlaceholder: '输入您的全名',
          confirmPassword: '确认密码',
          confirmPasswordPlaceholder: '重新输入您的密码',
          creating: '正在创建账户...',
          haveAccount: '已有账户？',
        },
        profile: {
          completeProfile: '完善您的资料',
          completeProfileDesc: '您尚未完善个人资料。完善后可获取个性化推荐。',
          completeProfileBtn: '完善资料',
          personalDetails: '个人详情',
          educationHistory: '教育经历',
          standardizedTests: '标准化考试',
          certifications: '证书',
          skillsAndInterests: '技能与兴趣',
          topSkills: '核心技能',
          interests: '兴趣爱好',
          careerPreferences: '职业偏好',
          preferredCountries: '首选国家',
          availability: '入学时间',
          notSpecified: '未指定',
          edit: '编辑',
        },
        common: {
          language: '语言',
        },
      },
    },
  },
};

// Initialize with stored language or default to English
const initI18n = async () => {
  let savedLanguage = 'en';
  try {
    const stored = await SecureStore.getItemAsync(LANGUAGE_KEY);
    if (stored && ['en', 'ms', 'zh'].includes(stored)) {
      savedLanguage = stored;
    }
  } catch {
    // Ignore errors, use default
  }

  if (!i18n.isInitialized) {
    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: savedLanguage,
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
      });
  } else {
    await i18n.changeLanguage(savedLanguage);
  }
};

// Change language and persist
export const changeLanguage = async (lng: string) => {
  await i18n.changeLanguage(lng);
  try {
    await SecureStore.setItemAsync(LANGUAGE_KEY, lng);
  } catch {
    // Ignore storage errors
  }
};

export const LANGUAGES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ms', label: 'BM', name: 'Bahasa Melayu' },
  { code: 'zh', label: 'ZH', name: '中文' },
] as const;

// Initialize on import
initI18n();

export default i18n;
