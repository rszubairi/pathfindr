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
