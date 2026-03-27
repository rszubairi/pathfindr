const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/** Haversine distance between two lat/lng points in kilometres. */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export const MAJOR_CITIES = [
  { name: 'Kuala Lumpur, Malaysia', lat: 3.139, lng: 101.6869 },
  { name: 'Penang, Malaysia', lat: 5.4141, lng: 100.3288 },
  { name: 'Johor Bahru, Malaysia', lat: 1.4927, lng: 103.7414 },
  { name: 'Kota Kinabalu, Malaysia', lat: 5.9804, lng: 116.0735 },
  { name: 'Kuching, Malaysia', lat: 1.5535, lng: 110.3593 },
  { name: 'Jakarta, Indonesia', lat: -6.2088, lng: 106.8456 },
  { name: 'Bandung, Indonesia', lat: -6.9175, lng: 107.6191 },
  { name: 'Surabaya, Indonesia', lat: -7.2575, lng: 112.7521 },
  { name: 'Bali, Indonesia', lat: -8.3405, lng: 115.092 },
  { name: 'Medan, Indonesia', lat: 3.5952, lng: 98.6722 },
  { name: 'Beijing, China', lat: 39.9042, lng: 116.4074 },
  { name: 'Shanghai, China', lat: 31.2304, lng: 121.4737 },
  { name: 'Guangzhou, China', lat: 23.1291, lng: 113.2644 },
  { name: 'Shenzhen, China', lat: 22.5431, lng: 114.0579 },
  { name: 'Chengdu, China', lat: 30.5728, lng: 104.0668 },
  { name: 'Nanjing, China', lat: 32.0603, lng: 118.7969 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Bangkok, Thailand', lat: 13.7563, lng: 100.5018 },
  { name: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
] as const;
