import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { CountryLeaderboard } from '@/components/universityRankings/CountryLeaderboard';

export const metadata: Metadata = {
  title: 'Top Universities in Qatar 2025 | QS Rankings | Pathfindr',
  description:
    "Explore Qatar's leading universities for 2025. Qatar University, Hamad Bin Khalifa University and top international branch campuses in Education City ranked by QS.",
  keywords: ['top universities Qatar 2025', 'best Qatari universities QS', 'Qatar University ranking 2025', 'study in Education City Qatar'],
  openGraph: {
    title: 'Top Universities in Qatar 2025 | QS Rankings',
    description: "Qatar University, Hamad Bin Khalifa University and more — QS World University Rankings 2025.",
    type: 'article',
  },
};

export default function QatarRankingsPage() {
  return (
    <MainLayout>
      <CountryLeaderboard countrySlug="qatar" />
    </MainLayout>
  );
}
