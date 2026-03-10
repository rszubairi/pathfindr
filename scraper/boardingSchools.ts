import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

interface BoardingSchool {
  name: string;
  shortName?: string;
  category: string;
  state: string;
  district: string;
  gender: string;
  entryLevels: string[];
  applicationPortal: string;
  applicationPeriod: string;
  description?: string;
  specialPrograms: string[];
  managedBy: string;
  sourceUrl: string;
  lastUpdated: string;
}

class BoardingSchoolScraper {
  private schools: BoardingSchool[] = [];

  /**
   * Attempts to scrape SBP list from MOE website
   */
  async scrapeSBP() {
    console.log('--- Scraping SBP from MOE ---');
    const url = 'https://www.moe.gov.my/sekolah-berasrama-penuh';
    try {
      const { data } = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 15000,
      });
      const $ = cheerio.load(data);

      // Try to extract school names from the page content
      $('table tr, .school-list li, .content-area a').each((_i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 5 && text.length < 200) {
          // Detect if this looks like a school name
          if (
            text.includes('Sekolah Menengah Sains') ||
            text.includes('Sekolah Berasrama Penuh') ||
            text.includes('SMAP') ||
            text.includes('Kolej Islam')
          ) {
            this.schools.push({
              name: text,
              category: this.detectCategory(text),
              state: 'Unknown',
              district: 'Unknown',
              gender: 'mixed',
              entryLevels: ['Tingkatan 1', 'Tingkatan 4'],
              applicationPortal: 'https://spskt1.moe.gov.my',
              applicationPeriod: 'August - September',
              description: `Scraped from MOE website.`,
              specialPrograms: [],
              managedBy: 'KPM',
              sourceUrl: url,
              lastUpdated: new Date().toISOString(),
            });
          }
        }
      });

      console.log(`Found ${this.schools.length} SBP schools from MOE website`);
    } catch (e) {
      console.warn('Failed to scrape MOE SBP page, will use static data:', (e as Error).message);
    }
  }

  /**
   * Attempts to scrape MRSM list from MARA website
   */
  async scrapeMRSM() {
    console.log('--- Scraping MRSM from MARA ---');
    const url = 'https://mrsm.mara.gov.my/mymrsm/';
    try {
      const { data } = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 15000,
      });
      const $ = cheerio.load(data);

      $('a, li, option').each((_i, el) => {
        const text = $(el).text().trim();
        if (text && text.startsWith('MRSM') && text.length > 5 && text.length < 100) {
          // Avoid duplicates
          if (!this.schools.find((s) => s.name === text)) {
            this.schools.push({
              name: text,
              category: text.toLowerCase().includes('premier') ? 'MRSM Premier' : 'MRSM',
              state: 'Unknown',
              district: 'Unknown',
              gender: 'mixed',
              entryLevels: ['Tingkatan 1', 'Tingkatan 4'],
              applicationPortal: 'https://mrsm.mara.gov.my/mymrsm/',
              applicationPeriod: 'March - May',
              description: `Scraped from MARA website.`,
              specialPrograms: ['Pure Science'],
              managedBy: 'MARA',
              sourceUrl: url,
              lastUpdated: new Date().toISOString(),
            });
          }
        }
      });

      console.log(`Found ${this.schools.filter((s) => s.managedBy === 'MARA').length} MRSM schools from MARA website`);
    } catch (e) {
      console.warn('Failed to scrape MARA MRSM page, will use static data:', (e as Error).message);
    }
  }

  private detectCategory(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes('sains') || lower.includes('science')) return 'SMS';
    if (lower.includes('integrasi')) return 'SBPI';
    if (lower.includes('agama') || lower.includes('smap')) return 'SMAP';
    if (lower.includes('tahfiz') || lower.includes('ulul albab') || lower.includes('imtiaz')) return 'TMUA';
    if (lower.includes('mrsm')) return 'MRSM';
    return 'SBP Premier';
  }

  saveResults() {
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const filePath = path.join(outputDir, 'boardingSchools.json');
    fs.writeFileSync(filePath, JSON.stringify(this.schools, null, 2));
    console.log(`\nBoarding school scraping complete! ${this.schools.length} schools found.`);
    console.log(`Data saved to: ${filePath}`);
  }

  async runAll() {
    await this.scrapeSBP();
    await this.scrapeMRSM();
    this.saveResults();
    return this.schools;
  }
}

export { BoardingSchoolScraper };
export default BoardingSchoolScraper;
