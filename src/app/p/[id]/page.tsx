import { createClient } from '@supabase/supabase-js';
import PortfolioViewer from './PortfolioViewer';
import { notFound } from 'next/navigation';

export default async function PublishedPortfolioPage({ params }: { params: { id: string } }) {
  // We use the anon key for public access to the templates
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('my_templates')
    .select('modified_design')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return notFound();
  }

  const design = data.modified_design;

  return (
    <main className="min-h-screen">
      <PortfolioViewer design={design} />
    </main>
  );
}
