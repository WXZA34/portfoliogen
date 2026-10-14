import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate type: images, videos, and documents (PDF, etc.)
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isDoc = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf') || file.type.includes('document') || file.type.includes('msword');

    if (!isImage && !isVideo && !isDoc) {
      return NextResponse.json(
        { error: 'Format non supporté. Utilisez des images (JPG, PNG, WebP, GIF), des vidéos (MP4, WebM, MOV) ou des documents (PDF).' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try Supabase Storage
    try {
      const supabase = await createClient();
      const ext = file.name.split('.').pop() || 'bin';
      const folder = isVideo ? 'videos' : isDoc ? 'documents' : 'images';
      const filename = `editor/${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      let uploadResult = await supabase.storage
        .from('portfolio-media')
        .upload(filename, buffer, {
          contentType: file.type || 'application/octet-stream',
          upsert: false,
        });

      if (uploadResult.error) {
        uploadResult = await supabase.storage
          .from('media')
          .upload(filename, buffer, {
            contentType: file.type || 'application/octet-stream',
            upsert: false,
          });
      }

      if (!uploadResult.error) {
        const bucket = uploadResult.data?.fullPath?.startsWith('media/') ? 'media' : 'portfolio-media';
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(filename);

        return NextResponse.json({ url: urlData.publicUrl, path: filename });
      }
    } catch (storageErr) {
      console.warn('Supabase storage not accessible, falling back to data URL:', storageErr);
    }

    // Fallback: return data URL so upload never fails
    const mime = file.type || (isDoc ? 'application/pdf' : isVideo ? 'video/mp4' : 'image/jpeg');
    const dataUrl = `data:${mime};base64,${buffer.toString('base64')}`;
    return NextResponse.json({ url: dataUrl, path: `local/${file.name}` });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
