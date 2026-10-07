'use client';

import dynamic from 'next/dynamic';

const PublicPortfolioView = dynamic(
  () => import('./components/PublicPortfolioView'),
  { ssr: false }
);

export default function PublicPortfolioPage() {
  return <PublicPortfolioView />;
}