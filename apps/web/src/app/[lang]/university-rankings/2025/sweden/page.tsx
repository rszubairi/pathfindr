import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in Sweden 2025 | QS Rankings | Pathfindr',
  description:
    'Find the best universities in Sweden for 2025. KTH Royal Institute of Technology, Karolinska Institute, Lund University, Uppsala and more ranked by QS World University Rankings.',
  keywords: ['top universities Sweden 2025', 'best Swedish universities QS', 'KTH ranking 2025', 'Lund University ranking 2025', 'Karolinska ranking 2025'],
  openGraph: {
    title: 'Top Universities in Sweden 2025 | QS Rankings',
    description: 'KTH, Karolinska, Lund, Uppsala and more — QS World University Rankings 2025.',
    type: 'article',
  },
};

export default function SwedenRankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="sweden" />
    </MainLayout>
  );
}
