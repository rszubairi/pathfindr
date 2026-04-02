import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in Croatia 2025 | QS Rankings | Pathfindr',
  description:
    'Explore the best universities in Croatia for 2025. University of Zagreb, Split, Rijeka and more ranked by QS World University Rankings.',
  keywords: ['top universities Croatia 2025', 'best Croatian universities QS', 'University of Zagreb ranking 2025', 'study in Croatia universities'],
  openGraph: {
    title: 'Top Universities in Croatia 2025 | QS Rankings',
    description: 'University of Zagreb, Split, Rijeka and more — QS World University Rankings 2025.',
    type: 'article',
  },
};

export default function CroatiaRankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="croatia" />
    </MainLayout>
  );
}
