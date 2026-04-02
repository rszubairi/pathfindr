import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in the United States 2025 | QS Rankings | Pathfindr',
  description:
    'Discover the best universities in the United States for 2025 according to QS World University Rankings. Compare MIT, Harvard, Stanford, Caltech and more by score, type, and global rank.',
  keywords: ['top universities USA 2025', 'best US universities QS rankings', 'MIT Harvard Stanford ranking 2025', 'university rankings United States'],
  openGraph: {
    title: 'Top Universities in the United States 2025 | QS Rankings',
    description: 'Ranked by academic reputation, employer outcomes and research impact. QS World University Rankings 2025.',
    type: 'article',
  },
};

export default function USARankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="united-states" />
    </MainLayout>
  );
}
