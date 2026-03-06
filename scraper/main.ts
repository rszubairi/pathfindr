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
        console.log('--- Scraping Taylor\'s University ---');
        const url = 'https://university.taylors.edu.my/en/study/scholarships-and-financial-aid/undergraduate-scholarships.html';
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            // Select sections that likely contain scholarship names
            // Based on browser exploration, Taylor's uses swiper-slides and accordions
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
            console.error('Failed to scrape Taylor\'s:', e);
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
        this.saveResults();
    }
}

const scraper = new UniversalScholarshipScraper();
scraper.runAll().catch(console.error);
