/**
 * Maps known scholarship providers to their official logo URLs.
 * Falls back to a Clearbit or Google favicon API for unknown providers.
 */

const PROVIDER_LOGO_MAP: Record<string, string> = {
    // Government
    "government & public": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Flag_of_Malaysia.svg/320px-Flag_of_Malaysia.svg.png",
    "mohe / govt": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Flag_of_Malaysia.svg/320px-Flag_of_Malaysia.svg.png",
    "community colleges": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Flag_of_Malaysia.svg/320px-Flag_of_Malaysia.svg.png",

    // Corporate
    "petronas": "https://logo.clearbit.com/petronas.com",
    "bank negara malaysia": "https://logo.clearbit.com/bnm.gov.my",
    "shell malaysia": "https://logo.clearbit.com/shell.com",
    "telekom malaysia": "https://logo.clearbit.com/tm.com.my",
    "tenaga nasional": "https://logo.clearbit.com/tnb.com.my",
    "gamuda": "https://logo.clearbit.com/gamuda.com.my",
    "maybank / cimb / rhb": "https://logo.clearbit.com/maybank.com",
    "maybank": "https://logo.clearbit.com/maybank.com",
    "cimb": "https://logo.clearbit.com/cimb.com",
    "rhb": "https://logo.clearbit.com/rhb.com.my",
    "sime darby foundation": "https://logo.clearbit.com/simedarby.com",
    "ocbc": "https://logo.clearbit.com/ocbc.com",

    // Foundation / Leadership
    "khazanah": "https://logo.clearbit.com/yayasankhazanah.com.my",
    "yayasan tunku abdul rahman": "https://www.yayasantar.org.my/wp-content/uploads/2020/08/ytar-logo-300x300.jpg",
    "yayasan employees provident fund": "https://logo.clearbit.com/kwsp.gov.my",

    // Universities
    "taylor's university": "https://logo.clearbit.com/taylors.edu.my",
    "sunway university": "https://logo.clearbit.com/sunway.edu.my",
    "monash university malaysia": "https://logo.clearbit.com/monash.edu.my",
    "universiti malaya": "https://logo.clearbit.com/um.edu.my",
    "universiti kebangsaan malaysia": "https://logo.clearbit.com/ukm.my",
    "universiti putra malaysia": "https://logo.clearbit.com/upm.edu.my",
    "universiti teknologi malaysia": "https://logo.clearbit.com/utm.my",
    "universiti sains malaysia": "https://logo.clearbit.com/usm.my",
    "universiti teknologi mara": "https://logo.clearbit.com/uitm.edu.my",
};

/**
 * Get the logo URL for a given provider name.
 * Falls back to a generated favicon URL via Google's favicon service.
 */
export function getProviderLogo(provider: string): string | null {
    const key = provider.toLowerCase().trim();

    // Exact match first
    if (PROVIDER_LOGO_MAP[key]) {
        return PROVIDER_LOGO_MAP[key];
    }

    // Partial match
    for (const [mapKey, url] of Object.entries(PROVIDER_LOGO_MAP)) {
        if (key.includes(mapKey) || mapKey.includes(key)) {
            return url;
        }
    }

    return null;
}

/**
 * Get a color for provider type badge to use as fallback background.
 */
export function getProviderTypeColor(
    providerType: string
): { bg: string; text: string; border: string } {
    switch (providerType) {
        case "government":
            return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" };
        case "corporate":
            return { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" };
        case "foundation":
            return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" };
        case "university":
            return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" };
        case "ngo":
            return { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" };
        default:
            return { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" };
    }
}

/**
 * Get initials from an organization name (up to 2 characters).
 */
export function getProviderInitials(provider: string): string {
    const words = provider.trim().split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
}
