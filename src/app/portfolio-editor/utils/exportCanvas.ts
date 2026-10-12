'use client';

// Dynamic imports to avoid SSR issues
export async function captureCanvasThumbnail(elementId = 'portfolio-canvas-export'): Promise<string | null> {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const el = document.getElementById(elementId);
    if (!el) return null;

    const canvas = await html2canvas(el, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scale: 0.5, // lightweight thumbnail
      logging: false,
    });
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch (err) {
    console.warn('Could not generate automatic thumbnail', err);
    return null;
  }
}

export async function exportToPNG(elementId: string, filename = 'portfolio.png') {
  const html2canvas = (await import('html2canvas')).default;

  const el = document.getElementById(elementId);
  if (!el) throw new Error('Element not found: ' + elementId);

  const canvas = await html2canvas(el, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    scale: 2, // 2x resolution for crisp output
    logging: false,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export async function exportToPDF(elementId: string, filename = 'portfolio.pdf') {
  const html2canvas = (await import('html2canvas')).default;
  const { jsPDF } = await import('jspdf');

  const el = document.getElementById(elementId);
  if (!el) throw new Error('Element not found: ' + elementId);

  const canvas = await html2canvas(el, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    scale: 1.5,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  // A4 landscape if wider than tall, portrait otherwise
  const isLandscape = imgWidth > imgHeight;
  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'px',
    format: [imgWidth, imgHeight],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  pdf.save(filename);
}

export async function exportToPPTX(elementId: string, filename = 'portfolio.pptx') {
  const html2canvas = (await import('html2canvas')).default;
  const PptxGenJS = (await import('pptxgenjs')).default;

  const el = document.getElementById(elementId);
  if (!el) throw new Error('Element not found: ' + elementId);

  // Generate an image from the canvas
  const canvas = await html2canvas(el, {
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    scale: 1.5,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  const pptx = new PptxGenJS();
  
  // Calculate aspect ratio to fit the image on the slide
  // Default PPTX slide size is 10 x 5.625 inches (16:9)
  const isLandscape = imgWidth > imgHeight;
  
  if (isLandscape) {
    pptx.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches
  } else {
    // Custom portrait layout (roughly A4)
    pptx.defineLayout({ name: 'PORTRAIT', width: 8.27, height: 11.69 });
    pptx.layout = 'PORTRAIT';
  }

  const slide = pptx.addSlide();
  
  const w = isLandscape ? 10 : 8.27;
  const h = isLandscape ? 5.625 : 11.69;

  slide.addImage({
    data: imgData,
    x: 0,
    y: 0,
    w,
    h,
    sizing: { type: 'contain', w, h }
  });

  await pptx.writeFile({ fileName: filename });
}
