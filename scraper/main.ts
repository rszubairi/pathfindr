import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Scholarship interface matching Convex schema
 */
interface Scholarship {
    university: string;
    title: string;
    requirements: string;
    criteria: string;
    timePeriod: string;
    documentsNeeded: string[];
    applicationLink: string;
    sourceUrl: string;
    lastUpdated: string;
    category?: string;
    amount?: string;
}

class UniversalScholarshipScraper {
    private scholarships: Scholarship[] = [];

    constructor() { }

    /**
     * Scrapes Taylor's University
     */
    async scrapeTaylors() {
        console.log("--- Scraping Taylor's University ---");
        const url = 'https://university.taylors.edu.my/en/study/scholarships-and-financial-aid/undergraduate-scholarships.html';
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            $('.swiper-slide h3, .accordion-title').each((i, el) => {
                const title = $(el).text().trim();
                if (!title || title.length < 5) return;

                this.scholarships.push({
                    university: "Taylor's University",
                    title: title,
                    requirements: "Minimum 3As in A-Levels or equivalent. Strong co-curricular record.",
                    criteria: "Academic excellence and leadership potential.",
                    timePeriod: "Open for 2026 Intakes (Jan, April, August)",
                    documentsNeeded: [
                        "Certified true copy of academic transcripts",
                        "Copy of Identification Card (IC)",
                        "Taylor's University Offer Letter",
                        "Passport-sized photograph"
                    ],
                    applicationLink: "https://university.taylors.edu.my/en/study/scholarships-and-financial-aid/undergraduate-scholarships.html",
                    sourceUrl: url,
                    lastUpdated: new Date().toISOString(),
                    category: title.toLowerCase().includes('merit') ? 'Merit' : 'General',
                });
            });
        } catch (e) {
            console.error("Failed to scrape Taylor's: ", e);
        }
    }

    /**
     * Scrapes Sunway University
     */
    async scrapeSunway() {
        console.log('--- Scraping Sunway University ---');
        const url = 'https://sunway.edu.my/scholarships';
        try {
            const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
            const $ = cheerio.load(data);

            $('.views-row h2, .scholarship-title').each((i, el) => {
                const title = $(el).text().trim();
                if (!title) return;

                this.scholarships.push({
                    university: "Sunway University",
                    title: title,
                    requirements: "Minimum CGPA 3.5 or equivalent. Malaysian Citizen.",
                    criteria: "High academic achievement and financial need assessment.",
                    timePeriod: "Deadlines vary: March 2025 (Jan intake), August 2025 (Sept intake)",
                    documentsNeeded: [
                        "SPM/O-Level/STPM result slips",
                        "Recommendation letter from Principal",
                        "Proof of household income",
                        "Offer letter from Sunway"
                    ],
                    applicationLink: "https://sunway.edu.my/scholarships",
                    sourceUrl: url,
                    lastUpdated: new Date().toISOString(),
                });
            });
        } catch (e) {
            console.error('Failed to scrape Sunway:', e);
        }
    }

    /**
     * Scrapes Monash University Malaysia
     */
    async scrapeMonash() {
        console.log('--- Scraping Monash University Malaysia ---');
        const url = 'https://www.monash.edu.my/student-services/scholarships-and-financial-aid/scholarships';
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            $('a.card-title, .scholarship-list-item').each((i, el) => {
                const title = $(el).text().trim();
                if (!title) return;

                this.scholarships.push({
                    university: "Monash University Malaysia",
                    title: title,
                    requirements: "Refer to course-specific requirements. Usually ATAR 90+.",
                    criteria: "Top achievers in qualifying examinations.",
                    timePeriod: "Annual Rounds: Feb, April, July, October",
                    documentsNeeded: [
                        "Official academic transcripts",
                        "English Language Proficiency (IELTS/TOEFL)",
                        "Resume / CV for postgraduate",
                        "Personal Statement"
                    ],
                    applicationLink: "https://www.monash.edu.my/scholarships",
                    sourceUrl: url,
                    lastUpdated: new Date().toISOString(),
                });
            });
        } catch (e) {
            console.error('Failed to scrape Monash:', e);
        }
    }

    /**
     * Adds Researched Scholarships explicitly
     */
    addResearchedScholarships() {
        console.log('--- Adding Researched Scholarships ---');
        const staticList: Scholarship[] = [
            // Government & Public
            {
                university: "Government & Public",
                title: "JPA Scholarship – Program Penajaan Nasional (PPN)",
                requirements: "High-achieving students for various levels.",
                criteria: "Academic excellence & leadership.",
                timePeriod: "Follow JPA specific deadlines per intake.",
                documentsNeeded: ["SPM/STPM/Diploma/Degree results", "IC copy"],
                applicationLink: "https://esilav2.jpa.gov.my/",
                sourceUrl: "https://esilav2.jpa.gov.my/",
                lastUpdated: new Date().toISOString(),
                category: "Government"
            },
            {
                university: "Government & Public",
                title: "JPA Special Programmes (JKPJ, LPSM, PKJM)",
                requirements: "Targeted fields and destinations.",
                criteria: "Academic excellence.",
                timePeriod: "Varies depending on domestic/international paths.",
                documentsNeeded: ["Academic transcripts", "Application form"],
                applicationLink: "https://esilav2.jpa.gov.my/",
                sourceUrl: "https://esilav2.jpa.gov.my/",
                lastUpdated: new Date().toISOString(),
                category: "Government"
            },
            {
                university: "MOHE / Govt",
                title: "Skim Bantuan Awal Pelajar IPT / Dermasiswa",
                requirements: "For initial IPT enrolment cost support.",
                criteria: "Financial need.",
                timePeriod: "Open alongside university intakes.",
                documentsNeeded: ["University Offer Letter", "Income evidence"],
                applicationLink: "https://biasiswa.mohe.gov.my/bk_mqa/index.php",
                sourceUrl: "https://biasiswa.mohe.gov.my/",
                lastUpdated: new Date().toISOString(),
                category: "Government"
            },
            {
                university: "MOHE / Govt",
                title: "Bantuan Kewangan KPT Kluster B40/M40",
                requirements: "B40/M40 income families.",
                criteria: "Lower-income students in targeted institutions.",
                timePeriod: "Open during university start dates.",
                documentsNeeded: ["Household income proof", "IC copy"],
                applicationLink: "https://biasiswa.mohe.gov.my/",
                sourceUrl: "https://biasiswa.mohe.gov.my/",
                lastUpdated: new Date().toISOString(),
                category: "Government"
            },
            {
                university: "Community Colleges",
                title: "Bantuan Pelajar Kolej Komuniti (BKPKK)",
                requirements: "Enrolled in Community College certificate/diploma.",
                criteria: "Financial aid for college students.",
                timePeriod: "Follows semester schedule.",
                documentsNeeded: ["College Offer Letter"],
                applicationLink: "https://biasiswa.mohe.gov.my/",
                sourceUrl: "https://biasiswa.mohe.gov.my/",
                lastUpdated: new Date().toISOString(),
                category: "Government"
            },
            {
                university: "MOHE / Govt",
                title: "MyBrainSc (KPM)",
                requirements: "Science degrees (Physics, Chemistry, Biology, Mathematics).",
                criteria: "Excellent results in Core Sciences.",
                timePeriod: "Check portal for exact opening window.",
                documentsNeeded: ["Academic transcripts in Science subjects", "University Offer Letter"],
                applicationLink: "https://biasiswa.mohe.gov.my/MyBrainSc/",
                sourceUrl: "https://biasiswa.mohe.gov.my/",
                lastUpdated: new Date().toISOString(),
                category: "Government"
            },
            // Corporate & Foundation
            {
                university: "Petronas",
                title: "Petronas Education Sponsorship Programme (PESP)",
                requirements: "Outstanding SPM results, specific engineering/science fields.",
                criteria: "Holistic assessment, academics, and leadership.",
                timePeriod: "Typically opens quickly post SPM results.",
                documentsNeeded: ["SPM trial/actual results", "Co-curricular certificates"],
                applicationLink: "https://educationsponsorship.petronas.com.my/",
                sourceUrl: "https://educationsponsorship.petronas.com.my/",
                lastUpdated: new Date().toISOString(),
                category: "Corporate"
            },
            {
                university: "Bank Negara Malaysia",
                title: "Bank Negara Malaysia Scholarship",
                requirements: "Economics, finance, accounting, IT programs.",
                criteria: "Stellar academic achievements and potential to contribute to nation.",
                timePeriod: "March/April annually",
                documentsNeeded: ["Pre-U/SPM academic transcripts", "Extracurricular documents"],
                applicationLink: "https://www.bnm.gov.my/careers/scholarships",
                sourceUrl: "https://www.bnm.gov.my/",
                lastUpdated: new Date().toISOString(),
                category: "Corporate"
            },
            {
                university: "Shell Malaysia",
                title: "Shell Malaysia Scholarship",
                requirements: "Engineering and science fields.",
                criteria: "Leadership capability and high academic marks.",
                timePeriod: "Varies, check Shell Malaysia page.",
                documentsNeeded: ["Academic records", "Leadership proof"],
                applicationLink: "https://www.shell.com.my/careers/students-and-graduates/scholarships.html",
                sourceUrl: "https://www.shell.com.my/",
                lastUpdated: new Date().toISOString(),
                category: "Corporate"
            },
            {
                university: "Telekom Malaysia",
                title: "Telekom Malaysia Scholarship (TM)",
                requirements: "ICT and tech related degrees.",
                criteria: "Good academic standing.",
                timePeriod: "Varies by year.",
                documentsNeeded: ["Academic transcripts", "Admission letter"],
                applicationLink: "https://www.tm.com.my/tm/yayasantm",
                sourceUrl: "https://www.tm.com.my/",
                lastUpdated: new Date().toISOString(),
                category: "Corporate"
            },
            {
                university: "Tenaga Nasional",
                title: "Tenaga Nasional (TNB) Scholarship",
                requirements: "Engineering, Accounting, IT.",
                criteria: "Top SPM or Pre-U results.",
                timePeriod: "Wait for YTN announcements.",
                documentsNeeded: ["Official results", "IC", "Income statement"],
                applicationLink: "https://yayasan.tnb.com.my/",
                sourceUrl: "https://yayasan.tnb.com.my/",
                lastUpdated: new Date().toISOString(),
                category: "Corporate"
            },
            {
                university: "Sime Darby Foundation",
                title: "Sime Darby Foundation Scholarship Programme",
                requirements: "For pre-U, undergrad or diploma across various fields.",
                criteria: "Academic excellence, leadership potential, participation in extra-curricular activities.",
                timePeriod: "Varies per program.",
                documentsNeeded: ["Target university offer letter", "Transcripts"],
                applicationLink: "https://www.yayasansimedarby.com/scholarships",
                sourceUrl: "https://www.yayasansimedarby.com/",
                lastUpdated: new Date().toISOString(),
                category: "Corporate"
            },
            {
                university: "Khazanah",
                title: "Khazanah Global Scholarship",
                requirements: "Study in premier universities globally.",
                criteria: "Exceptional academic merits and leadership capabilities.",
                timePeriod: "Determined annually.",
                documentsNeeded: ["A-Level/IB/SPM top tier results", "Leadership certificates"],
                applicationLink: "https://www.yayasankhazanah.com.my/",
                sourceUrl: "https://www.yayasankhazanah.com.my/",
                lastUpdated: new Date().toISOString(),
                category: "Corporate"
            },
            {
                university: "Yayasan Tunku Abdul Rahman",
                title: "Yayasan Tunku Abdul Rahman Scholarships",
                requirements: "Undergraduates studying in public or private universities.",
                criteria: "Leadership potential and academic competency.",
                timePeriod: "March - April generally.",
                documentsNeeded: ["Offer letter", "Transcripts", "Personal statement"],
                applicationLink: "https://www.yayasantar.org.my/",
                sourceUrl: "https://www.yayasantar.org.my/",
                lastUpdated: new Date().toISOString(),
                category: "Foundation"
            },
            {
                university: "Maybank / CIMB / RHB",
                title: "Financial Institutions Scholarships",
                requirements: "Finance, business, IT and related fields.",
                criteria: "Academic performance.",
                timePeriod: "Varies across banks.",
                documentsNeeded: ["Results", "Admission Offer"],
                applicationLink: "https://www.maybankfoundation.com/index.php/what-we-do/our-pillars/education/maybank-group-scholarship-program",
                sourceUrl: "https://www.maybankfoundation.com/",
                lastUpdated: new Date().toISOString(),
                category: "Corporate"
            },
            {
                university: "Gamuda",
                title: "Gamuda Scholarship Programme",
                requirements: "Engineering, Quantity Surveying, Business, IT.",
                criteria: "Outstanding academic results and leadership.",
                timePeriod: "Usually April - May.",
                documentsNeeded: ["University Offer Letter", "Pre-U Results"],
                applicationLink: "https://gamuda.com.my/sustainability-esg/yayasan-gamuda/gamuda-scholarship/",
                sourceUrl: "https://gamuda.com.my/",
                lastUpdated: new Date().toISOString(),
                category: "Corporate"
            }
        ];

        this.scholarships.push(...staticList);
    }

    /**
     * Saves the list as a JSON for import to Convex
     */
    saveResults() {
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

        const filePath = path.join(outputDir, 'scholarships.json');
        fs.writeFileSync(filePath, JSON.stringify(this.scholarships, null, 2));
        console.log(`\n✅ Scraping complete! ${this.scholarships.length} scholarships found.`);
        console.log(`📁 Data saved to: ${filePath}`);
        console.log(`\nTo import to Convex, run:`);
        console.log(`npx convex import --table scholarships ${filePath}`);
    }

    async runAll() {
        await this.scrapeTaylors();
        await this.scrapeSunway();
        await this.scrapeMonash();
        this.addResearchedScholarships();
        this.saveResults();
    }
}

const scraper = new UniversalScholarshipScraper();
scraper.runAll().catch(console.error);
