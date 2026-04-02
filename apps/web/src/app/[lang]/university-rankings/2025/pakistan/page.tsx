import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in Pakistan 2025 | QS Rankings | Pathfindr',
  description:
    'Discover the best universities in Pakistan for 2025. Quaid-i-Azam University, University of Punjab, NUST, University of Karachi, LUMS and more ranked by QS World University Rankings.',
  keywords: ['top universities Pakistan 2025', 'best Pakistani universities QS', 'NUST ranking 2025', 'Quaid-i-Azam University ranking', 'LUMS ranking 2025'],
  openGraph: {
    title: 'Top Universities in Pakistan 2025 | QS Rankings',
    description: 'Quaid-i-Azam, NUST, Punjab, LUMS and more — QS World University Rankings 2025.',
    type: 'article',
  },
};

export default function PakistanRankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="pakistan" />
    </MainLayout>
  );
}
