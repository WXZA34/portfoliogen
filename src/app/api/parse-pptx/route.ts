import { NextResponse } from 'next/server';
import AdmZip from 'adm-zip';
import { parseStringPromise } from 'xml2js';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const zip = new AdmZip(buffer);
    const zipEntries = zip.getEntries();
    
    // Find all slides
    const slideEntries = zipEntries.filter(entry => entry.entryName.match(/ppt\/slides\/slide\d+\.xml/));
    
    // Sort them by slide number (slide1.xml, slide2.xml...)
    slideEntries.sort((a, b) => {
      const numA = parseInt(a.entryName.match(/\d+/)![0]);
      const numB = parseInt(b.entryName.match(/\d+/)![0]);
      return numA - numB;
    });

    const blocks: any[] = [];

    for (let i = 0; i < slideEntries.length; i++) {
      const entry = slideEntries[i];
      const xmlString = entry.getData().toString('utf8');
      const parsed = await parseStringPromise(xmlString);
      
      const shapes = parsed['p:sld']?.['p:cSld']?.[0]?.['p:spTree']?.[0]?.['p:sp'] || [];
      const elements: any[] = [];

      shapes.forEach((shape: any) => {
        const spPr = shape['p:spPr']?.[0];
        const xfrm = spPr?.['a:xfrm']?.[0];
        const off = xfrm?.['a:off']?.[0]?.$;
        const ext = xfrm?.['a:ext']?.[0]?.$;
        
        let x = 0, y = 0, w = 100, h = 50;
        if (off && ext) {
          x = Math.round(parseInt(off.x) / 9525);
          y = Math.round(parseInt(off.y) / 9525);
          w = Math.round(parseInt(ext.cx) / 9525);
          h = Math.round(parseInt(ext.cy) / 9525);
        }

        const txBody = shape['p:txBody']?.[0];
        let text = '';
        if (txBody) {
          const paragraphs = txBody['a:p'] || [];
          paragraphs.forEach((p: any) => {
            const runs = p['a:r'] || [];
            runs.forEach((r: any) => {
              if (r['a:t'] && r['a:t'][0]) {
                text += r['a:t'][0];
              }
            });
            text += '\n';
          });
        }
        text = text.trim();

        if (text) {
          elements.push({
            id: Math.random().toString(36).substr(2, 9),
            type: 'text',
            content: text,
            x: x.toString(),
            y: y.toString(),
            width: w.toString(),
            height: h.toString(),
            style: {
              color: '#000000',
              fontSize: '16px', // PPTX parsing for fonts is complex, fallback for now
            },
            zIndex: elements.length + 1
          });
        } else {
          // Empty shape -> rectangle
          elements.push({
            id: Math.random().toString(36).substr(2, 9),
            type: 'shape',
            content: '',
            x: x.toString(),
            y: y.toString(),
            width: w.toString(),
            height: h.toString(),
            style: {
              backgroundColor: '#e5e7eb',
            },
            zIndex: elements.length + 1
          });
        }
      });

      // Also get pictures if possible, though we don't have the image data, we can just put a placeholder
      const pics = parsed['p:sld']?.['p:cSld']?.[0]?.['p:spTree']?.[0]?.['p:pic'] || [];
      pics.forEach((pic: any) => {
        const spPr = pic['p:spPr']?.[0];
        const xfrm = spPr?.['a:xfrm']?.[0];
        const off = xfrm?.['a:off']?.[0]?.$;
        const ext = xfrm?.['a:ext']?.[0]?.$;
        
        let x = 0, y = 0, w = 100, h = 50;
        if (off && ext) {
          x = Math.round(parseInt(off.x) / 9525);
          y = Math.round(parseInt(off.y) / 9525);
          w = Math.round(parseInt(ext.cx) / 9525);
          h = Math.round(parseInt(ext.cy) / 9525);
        }

        elements.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'image',
          content: '',
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop', // Placeholder for now
          x: x.toString(),
          y: y.toString(),
          width: w.toString(),
          height: h.toString(),
          style: {
            borderRadius: '0px'
          },
          zIndex: elements.length + 1
        });
      });

      blocks.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'custom',
        content: { title: `Slide ${i + 1}` },
        style: {
          padding: 'md',
          align: 'left',
          bgColor: '#ffffff',
          textColor: '#000000',
          accentColor: '#3b82f6',
        },
        layout: {
          type: 'freeform',
          elements
        }
      });
    }

    return NextResponse.json({ blocks });
  } catch (error: any) {
    console.error('Error parsing PPTX:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
