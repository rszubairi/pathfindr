const fs = require('fs');
const path = require('path');

const jsonFilePath = path.join(__dirname, 'output', 'scholarships.json');
const tsFilePath = path.join(__dirname, '../convex/seedDataScraped.ts');

const content = fs.readFileSync(jsonFilePath, 'utf-8');
const data = JSON.parse(content);

// Function to determine provider type based on provider name
function getProviderType(provider) {
    const providerLower = provider.toLowerCase();

    // Government/public institutions
    if (providerLower.includes('government') ||
        providerLower.includes('public') ||
        providerLower.includes('jpa') ||
        providerLower.includes('mohe') ||
        providerLower.includes('ministry') ||
        providerLower.includes('community college')) {
        return 'government';
    }

    // Corporate companies
    if (providerLower.includes('petronas') ||
        providerLower.includes('shell') ||
        providerLower.includes('maybank') ||
        providerLower.includes('cimb') ||
        providerLower.includes('rnb') ||
        providerLower.includes('telekom') ||
        providerLower.includes('tenaga') ||
        providerLower.includes('tnb') ||
        providerLower.includes('gamuda') ||
        providerLower.includes('bank')) {
        return 'corporate';
    }

    // Foundations
    if (providerLower.includes('foundation') ||
        providerLower.includes('yayasan') ||
        providerLower.includes('khazanah') ||
        providerLower.includes('simedarby')) {
        return 'foundation';
    }

    // Universities
    if (providerLower.includes('university') ||
        providerLower.includes('college') ||
        providerLower.includes('institute')) {
        return 'university';
    }

    // Default to university for unknown providers
    return 'university';
}

// Function to filter out non-scholarship entries
function isScholarshipEntry(title) {
    const titleLower = title.toLowerCase().trim();

    // Skip navigation items
    const navigationItems = [
        'explore', 'study', 'campus life', 'about taylor\'s',
        'home', 'about', 'features', 'login', 'register'
    ];

    // Skip FAQ items
    const faqItems = [
        'what does', 'what types', 'how can', 'when should',
        'what are', 'what type', 'do i need', 'are international',
        'will i be', 'what should'
    ];

    // Skip application process items
    const processItems = [
        'eligible programmes', 'eligibility', 'assessment',
        'how to apply', 'terms and conditions', 'quantum'
    ];

    // Skip generic content
    const genericItems = [
        'general criteria', 'academic criteria', 'documents needed'
    ];

    // Check if title contains any of the skip patterns
    if (navigationItems.some(item => titleLower === item)) {
        return false;
    }

    if (faqItems.some(item => titleLower.startsWith(item))) {
        return false;
    }

    if (processItems.some(item => titleLower.includes(item))) {
        return false;
    }

    if (genericItems.some(item => titleLower.includes(item))) {
        return false;
    }

    // If title looks like a proper scholarship name, include it
    // Scholarship names typically don't contain these patterns
    const suspiciousPatterns = [
        /how to/i, /what/i, /when/i, /where/i, /why/i, /terms/i, /conditions/i,
        /eligibility/i, /requirements/i, /documents/i, /apply/i, /assessment/i,
        /eligible programme/i, /eligible program/i, /programme/i, /program/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(titleLower))) {
        return false;
    }

    // If title is too short or too generic, skip it
    if (title.length < 3 || title.length > 100) {
        return false;
    }

    // Additional check for scholarship-specific keywords
    // Scholarship names usually contain words like "scholarship", "award", "grant", "bursary", "fund"
    const scholarshipKeywords = [
        'scholarship', 'award', 'grant', 'bursary', 'fund', 'program', 'programme', 'fellowship'
    ];

    // If it doesn't contain scholarship keywords and is too generic, skip it
    const hasScholarshipKeyword = scholarshipKeywords.some(keyword =>
        titleLower.includes(keyword)
    );

    // Allow if it has scholarship keywords, or if it's a well-known scholarship name
    const knownScholarships = [
        'jpa', 'petronas', 'shell', 'maybank', 'cimb', 'tnb', 'khazanah', 'simedarby'
    ];

    const isKnownScholarship = knownScholarships.some(scholarship =>
        titleLower.includes(scholarship)
    );

    if (!hasScholarshipKeyword && !isKnownScholarship) {
        return false;
    }

    return true;
}

const scholarships = data
    .filter(item => {
        // Filter out non-scholarship entries
        let cleanName = item.title;
        if (cleanName.includes('\n')) {
            cleanName = cleanName.split('\n')[0].trim();
        }
        return isScholarshipEntry(cleanName);
    })
    .map((item) => {
        // Clean up the title
        let cleanName = item.title;
        if (cleanName.includes('\n')) {
            cleanName = cleanName.split('\n')[0].trim();
        }

        // Clean up provider name
        let cleanProvider = item.university;
        if (cleanProvider.includes('\n')) {
            cleanProvider = cleanProvider.split('\n')[0].trim();
        }

        const providerType = getProviderType(cleanProvider);
        return {
            name: cleanName,
            provider: cleanProvider,
            providerType: providerType,
            value: Math.floor(Math.random() * 50000) + 10000, // Randomized value
            currency: 'MYR',
            eligibleFields: ['All Fields'],
            eligibleCountries: ['International', 'Malaysia'],
            deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            eligibilityCriteria: {
                requirements: item.requirements,
                timePeriod: item.timePeriod
            },
            description: `This scholarship is offered by ${cleanProvider}. Criteria: ${item.criteria}`,
            applicationUrl: item.applicationLink || item.sourceUrl,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
    });

// Filter out duplicates based on name to keep the DB clean
const uniqueScholarships = [];
const seenNames = new Set();
for (const s of scholarships) {
    if (!seenNames.has(s.name)) {
        uniqueScholarships.push(s);
        seenNames.add(s.name);
    }
}

const jsonStr = JSON.stringify(uniqueScholarships, null, 2);
// Inject "as const" cast into the generated typescript payload.
const tsContent = `// Auto-generated from scholarships.json
export const scrapedScholarships = ${jsonStr
        .replace(/"providerType": "government"/g, '"providerType": "government" as const')
        .replace(/"providerType": "corporate"/g, '"providerType": "corporate" as const')
        .replace(/"providerType": "foundation"/g, '"providerType": "foundation" as const')
        .replace(/"providerType": "university"/g, '"providerType": "university" as const')
        .replace(/"providerType": "ngo"/g, '"providerType": "ngo" as const')
        .replace(/"providerType": "individual"/g, '"providerType": "individual" as const')
        .replace(/"status": "active"/g, '"status": "active" as const')};
`;

fs.writeFileSync(tsFilePath, tsContent);
console.log('Successfully generated seedDataScraped.ts from JSON');
