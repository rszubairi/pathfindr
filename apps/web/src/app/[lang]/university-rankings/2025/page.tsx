import type { Metadata } from 'next';
import { MainLayout } from '@/components/layout/MainLayout';
import { GlobalLeaderboard } from '@/components/universityRankings/GlobalLeaderboard';

export const metadata: Metadata = {
  title: "World's Top Universities 2025 | QS Global Rankings | Pathfindr",
  description:
    'Explore the QS World University Rankings 2025. The definitive global leaderboard featuring MIT, Imperial College, Oxford, Harvard, Cambridge, Stanford and more, ranked by academic reputation, research impact, and employer outcomes.',
  keywords: [
    'world university rankings 2025',
    'QS rankings 2025',
    'top universities in the world 2025',
    'best universities globally',
    'MIT Harvard Oxford ranking 2025',
    'global university leaderboard',
  ],
  openGraph: {
    title: "World's Top Universities 2025 | QS Global Rankings",
    description: 'MIT, Imperial, Oxford, Harvard, Cambridge and more — QS World University Rankings 2025.',
    type: 'website',
  },
};

export default function GlobalUniversityRankingsPage() {
  return (
    <MainLayout>
      <GlobalLeaderboard />
    </MainLayout>
  );
}
