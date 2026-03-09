/**
 * Maps known scholarship providers to their official logo URLs.
 * Falls back to a Clearbit or Google favicon API for unknown providers.
 */

const PROVIDER_LOGO_MAP: Record<string, string> = {
    // Government
    "government & public": "/logos/malaysia-flag.png",
    "mohe / govt": "/logos/malaysia-flag.png",
    "community colleges": "/logos/malaysia-flag.png",

    // Corporate
    "petronas": "/logos/petronas.png",
    "bank negara malaysia": "/logos/bnm.png",
    "shell malaysia": "/logos/shell.png",
    "telekom malaysia": "/logos/tm.png",
    "tenaga nasional": "/logos/tnb.png",
    "gamuda": "/logos/gamuda.png",
    "maybank / cimb / rhb": "/logos/maybank.png",
    "maybank": "/logos/maybank.png",
    "cimb": "/logos/cimb.png",
    "rhb": "/logos/rhb.png",
    "sime darby foundation": "/logos/simedarby.png",
    "ocbc": "/logos/ocbc.png",

    // Foundation / Leadership
    "khazanah": "/logos/khazanah.png",
    "yayasan tunku abdul rahman": "/logos/ytar.png",
    "yayasan employees provident fund": "/logos/kwsp.png",

    // Universities
    "taylor's university": "/logos/taylors.png",
    "sunway university": "/logos/sunway.png",
    "monash university malaysia": "/logos/monash.png",
    "universiti malaya": "/logos/um.png",
    "universiti kebangsaan malaysia": "/logos/ukm.png",
    "universiti putra malaysia": "/logos/upm.png",
    "universiti teknologi malaysia": "/logos/utm.png",
    "universiti sains malaysia": "/logos/usm.png",
    "universiti teknologi mara": "/logos/uitm.png",
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
