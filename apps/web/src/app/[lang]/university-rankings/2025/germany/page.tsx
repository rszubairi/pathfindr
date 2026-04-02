import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in Germany 2025 | QS Rankings | Pathfindr',
  description:
    'Find the best universities in Germany for 2025. TU Munich, LMU Munich, Heidelberg, RWTH Aachen and more ranked by QS World University Rankings. Free tuition, world-class research.',
  keywords: ['top universities Germany 2025', 'best German universities QS', 'TU Munich ranking 2025', 'study in Germany university rankings'],
  openGraph: {
    title: 'Top Universities in Germany 2025 | QS Rankings',
    description: 'TU Munich, LMU, Heidelberg and more — QS World University Rankings 2025.',
    type: 'article',
  },
};

export default function GermanyRankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="germany" />
    </MainLayout>
  );
}
