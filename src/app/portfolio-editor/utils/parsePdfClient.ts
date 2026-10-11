import * as pdfjsLib from 'pdfjs-dist';

// Define the worker script manually for Next.js to avoid build issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// Helper to upload base64 to Supabase
async function uploadDataUrl(dataUrl: string): Promise<string> {
  if (!dataUrl.startsWith('data:')) return dataUrl;
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const formData = new FormData();
    const ext = blob.type.split('/')[1] || 'jpg';
    formData.append('file', new File([blob], `image.${ext}`, { type: blob.type }));
    
    const uploadRes = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    });
    if (uploadRes.ok) {
      const data = await uploadRes.json();
      if (data.url) return data.url;
    }
  } catch(e) {
    console.error("Upload error in parsePdfClient", e);
  }
  return dataUrl;
}

export async function parsePdfClient(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const blocks: any[] = [];
  
  let presentationWidth = 1000;
  let presentationHeight = 562.5; // 16:9

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 }); // scale up for better quality
    
    if (pageNum === 1) {
      presentationWidth = viewport.width;
      presentationHeight = viewport.height;
    }

    const elements: any[] = [];

    // Extract images by rendering to canvas (Background strategy)
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      await page.render({ canvasContext: ctx, viewport } as any).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      const uploadedUrl = await uploadDataUrl(dataUrl);
      
      // Add the background image
      elements.push({
        id: `bg-${pageNum}`,
        type: 'image',
        url: uploadedUrl,
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height,
        zIndex: 1,
        style: {}
      });

      // Extract text
      const textContent = await page.getTextContent();
      
      textContent.items.forEach((item: any) => {
        // transform: [scaleX, skewY, skewX, scaleY, translateX, translateY]
        const tx = item.transform;
        // In PDF, Y is measured from bottom to top. We must invert it.
        const y = viewport.height - (tx[5] * 1.5) - (tx[3] * 1.5);
        const x = tx[4] * 1.5;
        
        // Adaptive background color: sample pixel slightly top-left of the text
        const sampleX = Math.max(0, Math.floor(x) - 2);
        const sampleY = Math.max(0, Math.floor(y) - 2);
        const pixelData = ctx.getImageData(sampleX, sampleY, 1, 1).data;
        
        let r = pixelData[0];
        let g = pixelData[1];
        let b = pixelData[2];
        let a = pixelData[3] / 255;
        
        // Fallback to white if completely transparent
        if (a === 0) {
          r = 255; g = 255; b = 255;
        }

        const bgColor = `rgb(${r}, ${g}, ${b})`;
        
        // Calculate luminance to decide text color
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const textColor = luminance > 0.5 ? '#000000' : '#ffffff';

        elements.push({
          id: `text-${pageNum}-${Math.random().toString(36).substring(2, 9)}`,
          type: 'text',
          content: item.str,
          x: x,
          y: y,
          width: item.width * 1.5,
          height: item.height * 1.5,
          zIndex: 20,
          style: {
            fontSize: `${Math.max(10, Math.round(tx[3] * 1.5))}px`,
            fontFamily: item.fontName || 'sans-serif',
            color: textColor, // Adaptive text color
            backgroundColor: bgColor // Adaptive background color to hide baked text
          }
        });
      });
    }

    blocks.push({
      id: `pdf-page-${pageNum}`,
      type: 'custom',
      content: { title: `Page ${pageNum}` },
      style: { bgColor: '#ffffff', padding: 'none', align: 'left', fontFamily: 'sans-serif' },
      layout: { type: 'freeform', elements }
    });
  }

  return { blocks, presentationWidth, presentationHeight };
}
