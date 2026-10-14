import type { Metadata } from 'next';
import PublicPortfolioViewer from './components/PublicPortfolioViewer';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: 'Portfolio Public | PortfolioGen.net',
  description:
    'Consultez ce portfolio professionnel sur PortfolioGen.net.',
};

export default async function PublicPortfolioRootPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const forParam =
    typeof resolvedSearchParams?.for === 'string'
      ? resolvedSearchParams.for
      : undefined;

  return (
    <PublicPortfolioViewer
      slug=""
      recipientCompany={forParam}
    />
  );
}
