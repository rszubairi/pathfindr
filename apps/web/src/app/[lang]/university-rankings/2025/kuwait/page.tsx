import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in Kuwait 2025 | QS Rankings | Pathfindr',
  description:
    "Explore the best universities in Kuwait for 2025. Kuwait University, AUM, GUST, and AUK ranked by international academic excellence.",
  keywords: ['top universities Kuwait 2025', 'best Kuwaiti universities QS', 'Kuwait University ranking 2025', 'AUM GUST ranking 2025'],
  openGraph: {
    title: 'Top Universities in Kuwait 2025 | QS Rankings',
    description: "Kuwait University, AUM, GUST, and more — QS World University Rankings 2025.",
    type: 'article',
  },
};

export default function KuwaitRankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="kuwait" />
    </MainLayout>
  );
}
