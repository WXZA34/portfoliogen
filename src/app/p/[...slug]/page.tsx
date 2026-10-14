import type { Metadata } from 'next';
import PublicPortfolioViewer from '../components/PublicPortfolioViewer';

interface PageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const fullSlug = (resolvedParams?.slug || []).join('/');
  const forParam =
    typeof resolvedSearchParams?.for === 'string'
      ? resolvedSearchParams.for
      : undefined;

  const targetSuffix = forParam ? ` • Préparé pour ${forParam}` : '';

  return {
    title: `Portfolio Public (${fullSlug})${targetSuffix} | PortfolioGen.net`,
    description:
      'Consultez ce portfolio professionnel ciblé et vérifié sur PortfolioGen.net. Réalisations industrielles, projets, compétences et parcours.',
    openGraph: {
      title: `Portfolio Public | PortfolioGen.net`,
      description:
        'Portfolio professionnel interactif partagé via PortfolioGen.net',
      url: `https://portfoliogen.net/p/${fullSlug}`,
    },
  };
}

export default async function PublicPortfolioSlugPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const fullSlug = (resolvedParams?.slug || []).join('/');
  const forParam =
    typeof resolvedSearchParams?.for === 'string'
      ? resolvedSearchParams.for
      : undefined;

  return (
    <PublicPortfolioViewer
      slug={fullSlug || 'dussey-larry/geii-automatisme'}
      recipientCompany={forParam}
    />
  );
}
