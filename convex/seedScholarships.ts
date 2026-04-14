import { mutation } from "./_generated/server";
import { GCC_SCHOLARSHIPS } from "./seedDataScholarshipsGCC";

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
