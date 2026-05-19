import { mutation } from "./_generated/server";
import { GCC_SCHOLARSHIPS } from "./seedDataScholarshipsGCC";
import { MY_SCHOLARSHIPS } from "./seedDataScholarshipsMY";

export const seedMYScholarships = mutation({
  args: {},
  handler: async (ctx) => {
    let seeded = 0;
    for (const scholarship of MY_SCHOLARSHIPS) {
      const existing = await ctx.db
        .query("scholarships")
        .withSearchIndex("search_name", (q) => q.search("name", scholarship.name))
        .filter((q) => q.eq(q.field("provider"), scholarship.provider))
        .first();

      if (!existing) {
        await ctx.db.insert("scholarships", scholarship);
        seeded++;
        console.log(`Seeded: ${scholarship.name}`);
      } else {
        console.log(`Already exists: ${scholarship.name}`);
      }
    }
    return `Malaysian scholarships seeded: ${seeded} added`;
  },
});

// ─── University of Leicester International Scholarships ───────────────────────

const LEICESTER_SCHOLARSHIPS = [
  {
    name: "International Citizens of Change Scholarship (Undergraduate)",
    provider: "University of Leicester",
    providerType: "university" as const,
    value: 10000,
    currency: "GBP",
    eligibleFields: ["All Fields"],
    eligibleCountries: ["All Countries"],
    deadline: new Date("2026-09-01").toISOString(),
    eligibilityCriteria: {
      level: "Undergraduate",
      feeStatus: "International-fee paying",
      excludedPrograms: "Medicine, LLB Maitrise, STEM International Foundation, International Year 1 courses",
      intake: "September 2026",
      available: "10 scholarships",
      valueNote: "Up to £10,000/year for up to 3 years",
    },
    description:
      "The International Citizens of Change Scholarship offers up to £10,000 per year for up to 3 years to international undergraduate students at the University of Leicester. Ten scholarships are available for September 2026 entry. Excluded programmes include Medicine, LLB Maitrise, STEM International Foundation, and International Year 1 courses. Applicants must be international-fee paying students.",
    applicationUrl: "https://le.ac.uk/study/international-students/scholarships",
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Global Excellence Scholarship (Postgraduate)",
    provider: "University of Leicester",
    providerType: "university" as const,
    value: 7000,
    currency: "GBP",
    eligibleFields: ["All Fields"],
    eligibleCountries: ["All Countries"],
    deadline: new Date("2027-04-01").toISOString(),
    eligibilityCriteria: {
      level: "Postgraduate Taught",
      feeStatus: "International-fee paying (excludes India-domiciled applicants)",
      intake: "Academic cycle 2026–27; April 2027 start available for College of Business only",
      available: "10 scholarships",
      valueNote: "£7,000 tuition fee discount",
    },
    description:
      "The Global Excellence Scholarship provides a £7,000 tuition fee discount to international postgraduate taught students at the University of Leicester. Ten scholarships are available for the 2026–27 academic cycle. India-domiciled applicants are not eligible. An April 2027 start is available for College of Business students only.",
    applicationUrl: "https://le.ac.uk/study/international-students/scholarships",
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "International Undergraduate Tuition Fee Waiver",
    provider: "University of Leicester",
    providerType: "university" as const,
    value: 0,
    currency: "GBP",
    eligibleFields: ["All Fields"],
    eligibleCountries: ["All Countries"],
    deadline: new Date("2026-09-01").toISOString(),
    eligibilityCriteria: {
      level: "Undergraduate",
      feeStatus: "International-fee paying",
      excludedPrograms: "Medicine, LLB Maitrise, STEM International Foundation, International Year 1, programmes exceeding 3 years",
      intake: "September 2026",
      available: "30 waivers (150 total over 5 years)",
      applicationOpens: "18 November 2025",
      valueNote: "Full tuition fee waiver",
    },
    description:
      "The International Undergraduate Tuition Fee Waiver provides a full tuition fee waiver to 30 international students for September 2026 entry (150 total over 5 years). Excluded programmes include Medicine, LLB Maitrise, STEM International Foundation, International Year 1, and programmes exceeding 3 years. Applications opened 18 November 2025.",
    applicationUrl: "https://le.ac.uk/study/international-students/scholarships",
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "International Merit Scholarship",
    provider: "University of Leicester",
    providerType: "university" as const,
    value: 5000,
    currency: "GBP",
    eligibleFields: ["All Fields"],
    eligibleCountries: ["All Countries"],
    deadline: new Date("2026-12-31").toISOString(),
    eligibilityCriteria: {
      level: "Undergraduate or Postgraduate Taught",
      feeStatus: "International-fee paying",
      selection: "Automatic consideration upon submission of final results",
      pathwayNote: "Also available to International Pathway Year students with 70%+ score",
      valueNote: "£5,000/year tuition fee discount",
    },
    description:
      "The International Merit Scholarship awards a £5,000 per year tuition fee discount to high-achieving international undergraduate and postgraduate taught students at the University of Leicester. Students are automatically considered upon submission of final results — no separate application required. International Pathway Year students achieving 70% or above are also eligible.",
    applicationUrl: "https://le.ac.uk/study/international-students/scholarships",
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Chancellor's International Scholarship",
    provider: "University of Leicester",
    providerType: "university" as const,
    value: 3000,
    currency: "GBP",
    eligibleFields: ["All Fields"],
    eligibleCountries: ["All Countries"],
    deadline: new Date("2026-12-31").toISOString(),
    eligibilityCriteria: {
      level: "Undergraduate or Postgraduate Taught",
      feeStatus: "International-fee paying",
      excludedPrograms: "Medicine, LLB Maitrise (UG); not available to India-domiciled PG applicants",
      selection: "Automatic consideration with course offer",
      valueNote: "£3,000/year tuition fee discount",
    },
    description:
      "The Chancellor's International Scholarship provides a £3,000 per year tuition fee discount to international students meeting entry requirements at the University of Leicester. Students are automatically considered when receiving a course offer — no separate application needed. Excluded for undergraduates: Medicine and LLB Maitrise. India-domiciled postgraduate applicants are not eligible.",
    applicationUrl: "https://le.ac.uk/study/international-students/scholarships",
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Africa Development Scholarship",
    provider: "University of Leicester",
    providerType: "university" as const,
    value: 0,
    currency: "GBP",
    eligibleFields: ["All Fields"],
    eligibleCountries: [
      "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde",
      "Cameroon", "Central African Republic", "Chad", "Comoros", "Congo",
      "Democratic Republic of the Congo", "Djibouti", "Equatorial Guinea",
      "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea",
      "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia",
      "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Mozambique",
      "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe",
      "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa",
      "South Sudan", "Sudan", "Tanzania", "Togo", "Uganda", "Zambia", "Zimbabwe",
    ],
    deadline: new Date("2026-09-01").toISOString(),
    eligibilityCriteria: {
      level: "Postgraduate",
      region: "Sub-Saharan Africa",
      intake: "September 2026",
      available: "2 scholarships",
      valueNote: "Full tuition fee waiver",
    },
    description:
      "The Africa Development Scholarship offers a full tuition fee waiver to 2 postgraduate students from Sub-Saharan Africa for September 2026 entry at the University of Leicester. The scholarship aims to support academic talent from the region and foster development through education.",
    applicationUrl: "https://le.ac.uk/study/international-students/scholarships",
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "University of Leicester GREAT Scholarship 2026",
    provider: "University of Leicester",
    providerType: "university" as const,
    value: 10000,
    currency: "GBP",
    eligibleFields: ["All Fields"],
    eligibleCountries: ["Pakistan"],
    deadline: new Date("2026-12-31").toISOString(),
    eligibilityCriteria: {
      level: "Postgraduate Taught (one-year courses only)",
      nationality: "Pakistani applicants",
      excludedPrograms: "PGCE",
      available: "1 scholarship",
      partners: "British Council and GREAT Britain Campaign",
      valueNote: "£10,000 tuition fee discount",
    },
    description:
      "The University of Leicester GREAT Scholarship 2026, offered in partnership with the British Council and GREAT Britain Campaign, provides a £10,000 tuition fee discount to one Pakistani student enrolling in a one-year postgraduate course (excluding PGCE). The scholarship supports Pakistan's brightest talents to study at the University of Leicester.",
    applicationUrl: "https://le.ac.uk/study/international-students/scholarships",
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Leicester–King Power Thai Scholarship",
    provider: "University of Leicester",
    providerType: "university" as const,
    value: 5000,
    currency: "GBP",
    eligibleFields: ["All Fields"],
    eligibleCountries: ["Thailand"],
    deadline: new Date("2026-09-01").toISOString(),
    eligibilityCriteria: {
      level: "Undergraduate or Postgraduate Taught",
      domicile: "Thai-domiciled international students",
      intake: "September 2026",
      selection: "Automatic — no separate application required",
      valueNote: "£5,000 tuition fee discount",
    },
    description:
      "The Leicester–King Power Thai Scholarship offers a £5,000 tuition fee discount to Thai-domiciled international undergraduate and postgraduate taught students at the University of Leicester for September 2026 entry. No separate application is required — eligible students are automatically considered.",
    applicationUrl: "https://le.ac.uk/study/international-students/scholarships",
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Sanctuary Scholarship – University of Leicester",
    provider: "University of Leicester",
    providerType: "university" as const,
    value: 0,
    currency: "GBP",
    eligibleFields: ["All Fields"],
    eligibleCountries: ["All Countries"],
    deadline: new Date("2026-12-31").toISOString(),
    eligibilityCriteria: {
      level: "Undergraduate, Postgraduate Taught, or Distance Learning",
      eligibility: "Individuals seeking asylum in the UK",
      available: "Up to 4 scholarships",
      valueNote: "Full tuition fee waiver plus support package",
    },
    description:
      "The Sanctuary Scholarship at the University of Leicester provides a full tuition fee waiver plus a support package to individuals seeking asylum in the UK. Up to 4 scholarships are available across undergraduate, postgraduate taught, and distance learning levels. The scheme supports access to higher education for those affected by displacement and conflict.",
    applicationUrl: "https://le.ac.uk/study/international-students/scholarships",
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    name: "Family Loyalty Discount – University of Leicester",
    provider: "University of Leicester",
    providerType: "university" as const,
    value: 0,
    currency: "GBP",
    eligibleFields: ["All Fields"],
    eligibleCountries: ["All Countries"],
    deadline: new Date("2026-12-31").toISOString(),
    eligibilityCriteria: {
      level: "Undergraduate or Postgraduate",
      eligibility: "Students with a family member currently studying at or graduated from the University of Leicester",
      valueNote: "10% tuition fee discount per year",
    },
    description:
      "The Family Loyalty Discount offers a 10% per year tuition fee reduction to undergraduate and postgraduate students who have a family member currently studying at or who has graduated from the University of Leicester.",
    applicationUrl: "https://le.ac.uk/study/international-students/scholarships",
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const seedLeicesterScholarships = mutation({
  args: {},
  handler: async (ctx) => {
    let seeded = 0;
    for (const scholarship of LEICESTER_SCHOLARSHIPS) {
      const existing = await ctx.db
        .query("scholarships")
        .withSearchIndex("search_name", (q) => q.search("name", scholarship.name))
        .filter((q) => q.eq(q.field("provider"), scholarship.provider))
        .first();

      if (!existing) {
        await ctx.db.insert("scholarships", scholarship);
        seeded++;
        console.log(`Seeded: ${scholarship.name}`);
      } else {
        console.log(`Already exists: ${scholarship.name}`);
      }
    }
    return `Leicester scholarships seeded: ${seeded} added`;
  },
});

const MGIMO_SCHOLARSHIP = {
  name: "MGIMO University Government Scholarship",
  provider: "Moscow State Institute of International Relations (MGIMO University)",
  providerType: "government" as const,
  value: 0,
  currency: "RUB",
  eligibleFields: [
    "International Relations",
    "Area Studies",
    "Law",
    "Journalism",
    "Media Policy and Public Relations",
    "Economics",
    "Ecology and Wildlife Management",
    "Trade Regulation",
    "Political Science",
    "State and Municipal Administration",
    "Management",
    "Tourism",
  ],
  eligibleCountries: ["Malaysia"],
  deadline: new Date("2026-04-20").toISOString(),
  eligibilityCriteria: {
    programs: "Russian Language Preparatory Course, Bachelor's Degree, Master's Degree",
    places: "3 total (1 preparatory course, 1 bachelor's, 1 master's)",
    contact: "Vasiliy Kazakov — int.quota@id.mgimo.ru — +7 (495) 234-83-84 ext. 2091",
  },
  description:
    "The MGIMO University Government Scholarship, sponsored by the Moscow State Institute of International Relations under the Ministry of Foreign Affairs of the Russian Federation, offers three (3) fully funded places: one for a Russian Language Preparatory Course, one for a Bachelor's Degree programme, and one for a Master's Degree programme. Bachelor's fields include International Relations, Area Studies (Western and Eastern), Law, Journalism, Media Policy and Public Relations, Economics, Ecology and Wildlife Management, and Trade Regulation. Master's fields additionally include Political Science, State and Municipal Administration, Management, and Tourism. For enquiries, contact Vasiliy Kazakov at int.quota@id.mgimo.ru or +7 (495) 234-83-84 (ext. 2091).",
  applicationUrl: "https://int.mgimo.ru/en/apply/",
  status: "active" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const seedGCCScholarships = mutation({
  args: {},
  handler: async (ctx) => {
    for (const scholarship of GCC_SCHOLARSHIPS) {
      // Avoid duplicate by name and provider
      const existing = await ctx.db
        .query("scholarships")
        .withSearchIndex("search_name", (q) => q.search("name", scholarship.name))
        .filter((q) => q.eq(q.field("provider"), scholarship.provider))
        .first();

      if (!existing) {
        await ctx.db.insert("scholarships", scholarship);
        console.log(`Seeded scholarship: ${scholarship.name}`);
      } else {
        console.log(`Scholarship already exists: ${scholarship.name}`);
      }
    }
    return "GCC Scholarships seeded successfully";
  },
});

const JKPJ_2026_SCHOLARSHIP = {
  name: "Program Khas Jepun, Korea, Perancis dan Jerman (JKPJ) 2026",
  provider: "Jabatan Perkhidmatan Awam (JPA) Malaysia",
  providerType: "government" as const,
  value: 0,
  currency: "MYR",
  eligibleFields: [
    "Kejuruteraan",
    "Sains dan Teknologi (S&T)",
    "Sains Sosial",
  ],
  eligibleCountries: ["Japan", "Korea", "France", "Germany"],
  deadline: new Date("2026-04-16").toISOString(),
  eligibilityCriteria: {
    nationality: "Warganegara Malaysia",
    healthRequirement: "Bebas daripada penyakit kronik/berjangkit dan berupaya mengikuti pengajian",
    blacklistCheck: "Ibu bapa/penjaga tidak disenarai hitam oleh JPA atau dalam tindakan undang-undang JPA",
    spmResult: "Menduduki peperiksaan SPM 2025 buat kali pertama di sekolah menengah atau calon-calon persendirian",
    ageLimit: "Belum mencapai 19 tahun (atau belum 20 tahun bagi pelajar peralihan) pada 31 Disember tahun peperiksaan SPM diduduki",
    programType: "Pinjaman Boleh Ubah (Penajaan)",
    applicationUrl: "https://esilav2.jpa.gov.my/online_progs/tunggakanindividu.php",
    contact: "03-8000 8000 | lepasanspm2025@jpa.gov.my",
    note: "Hanya boleh memilih SATU (1) program sahaja — sama ada JKPJ atau Program Khas JPA-MARA (PKJM) 2026",
  },
  description:
    "Program Khas Jepun, Korea, Perancis dan Jerman (JKPJ) 2026 ditawarkan oleh Jabatan Perkhidmatan Awam (JPA) Malaysia kepada lepasan SPM 2025. Penajaan berbentuk Pinjaman Boleh Ubah bagi pelajar yang berminat melanjutkan pengajian dalam bidang Kejuruteraan, Sains dan Teknologi (S&T), dan Sains Sosial di negara Jepun, Korea, Perancis, dan Jerman. Pemohon mestilah warganegara Malaysia, bebas daripada penyakit kronik/berjangkit, dan belum mencapai 19 tahun (atau 20 tahun bagi pelajar peralihan) pada 31 Disember tahun peperiksaan SPM. Permohonan dibuka dari 3 April 2026 (3.00 petang) hingga 16 April 2026 (5.00 petang) melalui https://psanajaan.jpa.gov.my. Nota penting: pemohon hanya boleh memilih SATU program sahaja antara JKPJ atau Program Khas JPA-MARA (PKJM) 2026.",
  applicationUrl: "https://psanajaan.jpa.gov.my",
  status: "active" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const seedJKPJ2026Scholarship = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("scholarships")
      .withSearchIndex("search_name", (q) => q.search("name", JKPJ_2026_SCHOLARSHIP.name))
      .filter((q) => q.eq(q.field("provider"), JKPJ_2026_SCHOLARSHIP.provider))
      .first();

    if (!existing) {
      await ctx.db.insert("scholarships", JKPJ_2026_SCHOLARSHIP);
      return "JKPJ 2026 scholarship seeded successfully";
    }
    return "JKPJ 2026 scholarship already exists";
  },
});

const ZAKAT_MAINPP_SCHOLARSHIP = {
  name: "Skim Dermasiswa Pengajian Zakat MAINPP",
  provider: "Majlis Agama Islam Negeri Pulau Pinang (MAINPP)",
  providerType: "government" as const,
  value: 0,
  currency: "MYR",
  eligibleFields: [
    "All Fields",
    "Islamic Studies",
    "Engineering",
    "Medicine",
    "Science",
    "Arts",
    "Social Sciences",
    "Business",
  ],
  eligibleCountries: ["Malaysia"],
  deadline: new Date("2026-12-31").toISOString(),
  eligibilityCriteria: {
    academicLevel: "Diploma, Bachelor's Degree, Master's Degree, PhD",
    cgpa: "Minimum CGPA 2.75 (domestic students); passing grades for international students",
    employmentStatus: "Unemployed students preferred for Diploma and Bachelor's; working students may apply for Master's and PhD only",
    studyMode: "Full-time at MQA-recognized or government-accredited institutions",
    zakatRequirement: "Must meet general Zakat assistance conditions",
    documentsNeeded: [
      "Current enrollment letter from institution",
      "Latest academic results / progress report",
      "Active bank account in student's own name",
      "Proof of parental income (if applicable)",
      "Residential verification",
    ],
    contact: "04-549 8088 | admin@zakat.mainpp.gov.my",
    note: "Applications must be submitted online with all required colored documents uploaded to designated platforms.",
  },
  description:
    "Skim Dermasiswa Pengajian Zakat MAINPP (Zakat MAINPP Study Scholarship Scheme) is offered by Majlis Agama Islam Negeri Pulau Pinang to provide financial assistance to Muslim students pursuing higher education at MQA-recognized or government-accredited institutions, domestically or internationally. Eligible levels include Diploma, Bachelor's, Master's, and PhD. Applicants must have a minimum CGPA of 2.75 (domestic) or passing grades (international), study full-time, and satisfy Zakat eligibility conditions. Unemployed students are preferred for Diploma and Bachelor's programmes; working students may apply only for Master's and Doctorate levels. Required documents include an enrollment letter, latest academic results, proof of bank account, parental income proof, and residential verification. Apply online via the MAINPP Zakat portal.",
  applicationUrl: "https://zakat.mainpp.gov.my/bantuan-dermasiswa-pengajian/",
  status: "active" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const HASANAH_MICRO_GRANT_2026 = {
  name: "Hasanah Micro Grant (HMG) 2026",
  provider: "Yayasan Hasanah",
  providerType: "foundation" as const,
  value: 50000,
  currency: "MYR",
  eligibleFields: [
    "Education",
    "Community Development",
    "Environment",
    "Arts & Public Spaces",
    "Knowledge",
  ],
  eligibleCountries: ["Malaysia"],
  deadline: new Date("2026-12-31").toISOString(),
  eligibilityCriteria: {
    applicantType: "Registered organizations only (non-profits, NGOs, civil society, community-based organizations)",
    legalRegistration: "Must be registered under Registrar of Societies Act 1966, Businesses Act 1956 (ROBA 1956), Cooperative Act 1993, or Trade Licensing Ordinance (Sabah/Sarawak)",
    operationalHistory: "Registered and active for at least 6 months",
    fundingAmount: "Up to RM50,000 per project",
    projectDuration: "6 to 12 months",
    applicationWindow: "Open year-round, reviewed quarterly",
    applicationSubmission: "Submit at least 16 weeks before intended project start",
    restriction: "Only ONE application per year; previously funded Yayasan Hasanah recipients are ineligible",
    documentsNeeded: [
      "Portfolio / organizational profile",
      "Two of: 3 months bank statements, audited financial statements or tax submission, eCCRIS or CTOS report",
      "Application Form",
      "Implementation and Budget Template",
      "Project Deck Template",
    ],
    ineligibleActivities: [
      "Direct donations to individuals",
      "Standalone clinical health interventions",
      "Political campaigns",
      "Construction/equipment for commercial use",
      "Faith-based activities",
    ],
    contact: "Via portal — complete Eligibility Assessment to receive credentials",
  },
  description:
    "The Hasanah Micro Grant (HMG) 2026 is a 'Seed for Impact' initiative by Yayasan Hasanah that funds grassroots, community-led solutions addressing challenges across Malaysia. Registered organizations — including NGOs, civil society organizations, and community-based groups — may apply for up to RM50,000 per project for initiatives lasting 6 to 12 months. Projects must align with at least one of five focus areas: Education, Community Development, Environment, Arts & Public Spaces, or Knowledge. Applications are open year-round and reviewed quarterly. Applicants must complete an Eligibility Assessment and submit full applications at least 16 weeks before the intended project start date. Only one application per organization per year is permitted; previously funded Yayasan Hasanah recipients are not eligible.",
  applicationUrl: "https://yayasanhasanah.org/hasanah-micro-grant-hmg-2026/",
  status: "active" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const READING_MALAYSIA_PHD_SCHOLARSHIP = {
  name: "University of Reading Malaysia 10 PhD Scholarship Scheme",
  provider: "University of Reading Malaysia (UoRM)",
  providerType: "university" as const,
  value: 2500,
  currency: "MYR",
  eligibleFields: [
    "Built Environment",
    "Business and Management",
    "Psychology",
  ],
  eligibleCountries: ["All Countries"],
  deadline: new Date("2026-10-15").toISOString(),
  eligibilityCriteria: {
    level: "PhD (Full-time)",
    duration: "Minimum 3 years, maximum 4 years",
    available: "Up to 5 scholarships per cycle (2 cycles per year)",
    academicRequirement: "Master's degree or equivalent in a relevant field with minimum upper second-class Bachelor's honours; exceptional first-class Bachelor's holders may qualify for direct entry",
    englishRequirement: "IELTS 7.0 or equivalent if English is not first language (waiver available for recent English-speaking country study/work)",
    researchProposal: "Research proposal aligned with School research strengths with confirmed supervisory support required",
    visaRequirement: "International applicants must obtain a valid Malaysian student visa before benefits activate",
    recipientObligation: "Maximum 320 hours per annum (approx. 6 hours/week) contribution to School or University activities",
    applicationCycles: "Cycle 1: July 1–15, 2026 | Cycle 2: October 1–15, 2026",
    documentsNeeded: [
      "PhD Scholarship Application Form (applicant and supervisor sections)",
      "Current CV with academic qualifications, grades, and experience",
      "Complete research proposal",
      "PhD programme offer letter",
    ],
  },
  description:
    "The University of Reading Malaysia (UoRM) 10 PhD Scholarship Scheme offers up to 5 fully funded scholarships per cycle (2 cycles per year) for full-time PhD students in Built Environment, Business and Management, or Psychology. Benefits include a full tuition fee waiver, RM2,500 per annum research allowance for 3 years, and an allocated desktop workstation. Applicants must hold a Master's degree (or exceptional first-class Bachelor's) in a relevant field, have a confirmed supervisory arrangement, and submit a research proposal. English proficiency of IELTS 7.0 or equivalent is required unless English is the applicant's first language. International students must obtain a Malaysian student visa before benefits activate. Recipients are expected to contribute up to 320 hours per year to school or university activities. Application Cycle 1: July 1–15, 2026; Cycle 2: October 1–15, 2026.",
  applicationUrl: "https://www.reading.edu.my/scholarships-and-aid/phd-scholarship",
  status: "active" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const seedReadingMalaysiaPhdScholarship = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("scholarships")
      .withSearchIndex("search_name", (q) =>
        q.search("name", READING_MALAYSIA_PHD_SCHOLARSHIP.name)
      )
      .filter((q) => q.eq(q.field("provider"), READING_MALAYSIA_PHD_SCHOLARSHIP.provider))
      .first();

    if (!existing) {
      await ctx.db.insert("scholarships", READING_MALAYSIA_PHD_SCHOLARSHIP);
      return "University of Reading Malaysia PhD Scholarship seeded successfully";
    }
    return "University of Reading Malaysia PhD Scholarship already exists";
  },
});

export const seedHasanahMicroGrant2026 = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("scholarships")
      .withSearchIndex("search_name", (q) => q.search("name", HASANAH_MICRO_GRANT_2026.name))
      .filter((q) => q.eq(q.field("provider"), HASANAH_MICRO_GRANT_2026.provider))
      .first();

    if (!existing) {
      await ctx.db.insert("scholarships", HASANAH_MICRO_GRANT_2026);
      return "Hasanah Micro Grant 2026 seeded successfully";
    }
    return "Hasanah Micro Grant 2026 already exists";
  },
});

export const seedZakatMAINPPScholarship = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("scholarships")
      .withSearchIndex("search_name", (q) => q.search("name", ZAKAT_MAINPP_SCHOLARSHIP.name))
      .filter((q) => q.eq(q.field("provider"), ZAKAT_MAINPP_SCHOLARSHIP.provider))
      .first();

    if (!existing) {
      await ctx.db.insert("scholarships", ZAKAT_MAINPP_SCHOLARSHIP);
      return "Zakat MAINPP scholarship seeded successfully";
    }
    return "Zakat MAINPP scholarship already exists";
  },
});

export const seedMGIMOScholarship = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("scholarships")
      .withSearchIndex("search_name", (q) => q.search("name", MGIMO_SCHOLARSHIP.name))
      .filter((q) => q.eq(q.field("provider"), MGIMO_SCHOLARSHIP.provider))
      .first();

    if (!existing) {
      await ctx.db.insert("scholarships", MGIMO_SCHOLARSHIP);
      return "MGIMO scholarship seeded successfully";
    }
    return "MGIMO scholarship already exists";
  },
});
