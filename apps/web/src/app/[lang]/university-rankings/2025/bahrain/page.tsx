import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in Bahrain 2025 | QS Rankings | Pathfindr',
  description:
    "Discover the top universities in Bahrain for 2025. University of Bahrain (UoB), Applied Science University (ASU), and Ahlia University ranked by quality and performance.",
  keywords: ['top universities Bahrain 2025', 'best Bahraini universities QS', 'UoB ranking 2025', 'ASU Bahrain ranking 2025'],
  openGraph: {
    title: 'Top Universities in Bahrain 2025 | QS Rankings',
    description: "University of Bahrain, Applied Science University, and more — QS World University Rankings 2025.",
    type: 'article',
  },
};

export default function BahrainRankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="bahrain" />
    </MainLayout>
  );
}
