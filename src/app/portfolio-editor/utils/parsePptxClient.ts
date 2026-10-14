import JSZip from 'jszip';
import { uploadMediaFromPC } from '@/lib/utils/mediaUploadHelper';

function compressImage(dataUrl: string, mimeType: string, maxWidth: number = 1920): Promise<string> {
  return new Promise((resolve) => {
    if (mimeType === 'image/gif' || typeof document === 'undefined') return resolve(dataUrl);
    
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round(height * (maxWidth / width));
        width = maxWidth;
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Convert everything (even PNGs) to JPEG to save massive amounts of JSON size, unless it needs transparency. 
        // For simplicity, 0.7 quality JPEG reduces size by 90% compared to raw PNG base64.
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

async function uploadDataUrl(dataUrl: string): Promise<string> {
  if (!dataUrl.startsWith('data:')) return dataUrl;
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const ext = blob.type.split('/')[1] || 'jpg';
    const file = new File([blob], `slide_${Date.now()}.${ext}`, { type: blob.type });
    
    const uploadRes = await uploadMediaFromPC(file);
    if (uploadRes.url) return uploadRes.url;
  } catch(e) {
    console.error("Upload error in parsePptxClient", e);
  }
  return dataUrl; // fallback to base64 if upload fails
}

function getSolidFillColor(solidFill: Element | null): string | null {
  if (!solidFill) return null;
  const srgbClr = solidFill.getElementsByTagName('a:srgbClr')[0] || solidFill.getElementsByTagName('srgbClr')[0];
  if (srgbClr) {
    const val = srgbClr.getAttribute('val');
    return val ? '#' + val : null;
  }
  const schemeClr = solidFill.getElementsByTagName('a:schemeClr')[0] || solidFill.getElementsByTagName('schemeClr')[0];
  if (schemeClr) {
    const val = schemeClr.getAttribute('val');
    switch (val) {
      case 'bg1': return '#ffffff';
      case 'tx1': return '#000000';
      case 'bg2': return '#e7e6e6';
      case 'tx2': return '#44546a';
      case 'accent1': return '#4472c4';
      case 'accent2': return '#ed7d31';
      case 'accent3': return '#a5a5a5';
      case 'accent4': return '#ffc000';
      case 'accent5': return '#5b9bd5';
      case 'accent6': return '#70ad47';
      default: return '#cccccc';
    }
  }
  return null;
}

async function parseShapeNode(node: Element, offsetX: number, offsetY: number, scaleX: number, scaleY: number, rels: Record<string, string>, loadedZip: JSZip, elements: any[], layoutPhs: Record<string, any>) {
  const children = Array.from(node.children);
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const nodeName = child.nodeName.split(':').pop(); // e.g. "sp", "pic", "grpSp"
    
    if (nodeName === 'grpSp') {
      const grpSpPr = child.getElementsByTagName('p:grpSpPr')[0] || child.getElementsByTagName('grpSpPr')[0];
      let newOffsetX = offsetX, newOffsetY = offsetY, newScaleX = scaleX, newScaleY = scaleY;
      if (grpSpPr) {
        const xfrm = grpSpPr.getElementsByTagName('a:xfrm')[0];
        if (xfrm) {
          const off = xfrm.getElementsByTagName('a:off')[0];
          const ext = xfrm.getElementsByTagName('a:ext')[0];
          const chOff = xfrm.getElementsByTagName('a:chOff')[0];
          const chExt = xfrm.getElementsByTagName('a:chExt')[0];
          if (off && ext && chOff && chExt) {
            const gx = parseInt(off.getAttribute('x') || '0');
            const gy = parseInt(off.getAttribute('y') || '0');
            const gw = parseInt(ext.getAttribute('cx') || '0');
            const gh = parseInt(ext.getAttribute('cy') || '0');
            const cx = parseInt(chOff.getAttribute('x') || '0');
            const cy = parseInt(chOff.getAttribute('y') || '0');
            const cw = parseInt(chExt.getAttribute('cx') || '1');
            const ch = parseInt(chExt.getAttribute('cy') || '1');
            
            // new scale factor is parent scale * (group width / group child coordinate width)
            newScaleX = scaleX * (gw / cw);
            newScaleY = scaleY * (gh / ch);
            newOffsetX = offsetX + (gx - cx * (gw / cw)) * scaleX;
            newOffsetY = offsetY + (gy - cy * (gh / ch)) * scaleY;
          }
        }
      }
      await parseShapeNode(child, newOffsetX, newOffsetY, newScaleX, newScaleY, rels, loadedZip, elements, layoutPhs);
    } else if (nodeName === 'sp' || nodeName === 'pic' || nodeName === 'cxnSp' || nodeName === 'graphicFrame') {
      const spPr = child.getElementsByTagName('a:spPr')[0] || child.getElementsByTagName('p:spPr')[0];
      const pXfrm = child.getElementsByTagName('p:xfrm')[0];
      let x = 0, y = 0, w = 100, h = 50;
      let bgColor = 'transparent';
      
      const ph = child.getElementsByTagName('p:ph')[0];
      const phIdx = ph ? (ph.getAttribute('idx') || ph.getAttribute('type') || 'body') : null;

      if (spPr || pXfrm) {
        const xfrm = (spPr && spPr.getElementsByTagName('a:xfrm')[0]) || pXfrm;
        if (xfrm) {
          const off = xfrm.getElementsByTagName('a:off')[0];
          const ext = xfrm.getElementsByTagName('a:ext')[0];
          if (off && ext) {
            const rawX = parseInt(off.getAttribute('x') || '0');
            const rawY = parseInt(off.getAttribute('y') || '0');
            const rawW = parseInt(ext.getAttribute('cx') || '0');
            const rawH = parseInt(ext.getAttribute('cy') || '0');
            
            x = Math.round((offsetX + rawX * scaleX) / 9525);
            y = Math.round((offsetY + rawY * scaleY) / 9525);
            w = Math.round((rawW * scaleX) / 9525);
            h = Math.round((rawH * scaleY) / 9525);
          }
        } else if (phIdx && layoutPhs[phIdx]) {
          const rawX = layoutPhs[phIdx].x;
          const rawY = layoutPhs[phIdx].y;
          const rawW = layoutPhs[phIdx].w;
          const rawH = layoutPhs[phIdx].h;
          x = Math.round((offsetX + rawX * scaleX) / 9525);
          y = Math.round((offsetY + rawY * scaleY) / 9525);
          w = Math.round((rawW * scaleX) / 9525);
          h = Math.round((rawH * scaleY) / 9525);
        }
        
        
        const solidFill = spPr ? spPr.getElementsByTagName('a:solidFill')[0] : null;
        const color = getSolidFillColor(solidFill);
        if (color) bgColor = color;
      }

      let imageUrl = null;
      const blipFill = child.getElementsByTagName('a:blipFill')[0] || child.getElementsByTagName('p:blipFill')[0];
      if (blipFill) {
        const blip = blipFill.getElementsByTagName('a:blip')[0];
        if (blip) {
          const embedId = blip.getAttribute('r:embed');
          if (embedId && rels[embedId]) {
            const target = rels[embedId];
            const mediaPath = target.replace('../', 'ppt/').replace(/^\/?ppt\//, 'ppt/');
            const mediaFile = loadedZip.file(mediaPath) || loadedZip.file(`ppt/media/${target.split('/').pop()}`);
            if (mediaFile) {
              const base64 = await mediaFile.async('base64');
              const ext = mediaPath.split('.').pop()?.toLowerCase();
              const mime = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg';
              const rawDataUrl = `data:${mime};base64,${base64}`;
              // Compress the image to avoid massive JSON sizes if upload fails
              const compressed = await compressImage(rawDataUrl, mime);
              // Upload to Supabase to prevent statement timeouts on save!
              imageUrl = await uploadDataUrl(compressed);
            }
          }
        }
      }

      if (!imageUrl && (nodeName === 'pic' || nodeName === 'graphicFrame' || (ph && ph.getAttribute('type') === 'pic'))) {
        imageUrl = nodeName === 'graphicFrame' ? 'https://placehold.co/400x300?text=Graphic/Table' : 'https://placehold.co/400x300?text=Image';
      }

      if (imageUrl) {
        elements.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'image',
          content: '',
          url: imageUrl,
          x: x.toString(),
          y: y.toString(),
          width: w.toString(),
          height: h.toString(),
          style: { borderRadius: '0px' },
          zIndex: elements.length + 1
        });
        continue;
      }

      const txBody = child.getElementsByTagName('p:txBody')[0] || child.getElementsByTagName('txBody')[0];
      let text = '';
      let textColor = '#000000';
      let fontSize = '16px';

      if (txBody) {
        const paragraphs = txBody.getElementsByTagName('a:p');
        for (let k = 0; k < paragraphs.length; k++) {
          const pPr = paragraphs[k].getElementsByTagName('a:pPr')[0];
          if (pPr) {
            const defRPr = pPr.getElementsByTagName('a:defRPr')[0];
            if (defRPr) {
              const sz = defRPr.getAttribute('sz');
              if (sz) fontSize = Math.round((parseInt(sz) / 100) * scaleY) + 'px';
              const textSolidFill = defRPr.getElementsByTagName('a:solidFill')[0];
              const tColor = getSolidFillColor(textSolidFill);
              if (tColor) textColor = tColor;
            }
          }

          const runs = paragraphs[k].getElementsByTagName('a:r');
          for (let l = 0; l < runs.length; l++) {
            const rPr = runs[l].getElementsByTagName('a:rPr')[0];
            if (rPr) {
              const sz = rPr.getAttribute('sz');
              if (sz) {
                // scale font size
                fontSize = Math.round((parseInt(sz) / 100) * scaleY) + 'px';
              }
              const textSolidFill = rPr.getElementsByTagName('a:solidFill')[0];
              const tColor = getSolidFillColor(textSolidFill);
              if (tColor) textColor = tColor;
            }
            const t = runs[l].getElementsByTagName('a:t')[0];
            if (t && t.textContent) text += t.textContent;
          }
          text += '\n';
        }
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
          style: { color: textColor, fontSize: fontSize, backgroundColor: bgColor === 'transparent' ? undefined : bgColor },
          zIndex: elements.length + 1
        });
      } else if (bgColor !== 'transparent') {
        elements.push({
          id: Math.random().toString(36).substr(2, 9),
          type: 'shape',
          content: '',
          x: x.toString(),
          y: y.toString(),
          width: w.toString(),
          height: h.toString(),
          style: { backgroundColor: bgColor },
          zIndex: elements.length + 1
        });
      }
    }
  }
}

export async function parsePptxClient(file: File) {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file);

  const slideEntries: any[] = [];
  
  loadedZip.forEach((relativePath, fileEntry) => {
    if (relativePath.match(/^ppt\/slides\/slide\d+\.xml$/)) {
      slideEntries.push({ path: relativePath, entry: fileEntry });
    }
  });

  slideEntries.sort((a, b) => {
    const numA = parseInt(a.path.match(/\d+/)![0]);
    const numB = parseInt(b.path.match(/\d+/)![0]);
    return numA - numB;
  });

  const parser = new DOMParser();

  let presentationWidth = 1280;
  let presentationHeight = 720;
  if (loadedZip.file('ppt/presentation.xml')) {
    const presXml = await loadedZip.file('ppt/presentation.xml')!.async('text');
    const presDoc = parser.parseFromString(presXml, 'application/xml');
    const sldSz = presDoc.getElementsByTagName('p:sldSz')[0];
    if (sldSz) {
      const cx = parseInt(sldSz.getAttribute('cx') || '12192000');
      const cy = parseInt(sldSz.getAttribute('cy') || '6858000');
      presentationWidth = Math.round(cx / 9525);
      presentationHeight = Math.round(cy / 9525);
    }
  }

  const blocks: any[] = [];

  for (let i = 0; i < slideEntries.length; i++) {
    const slidePath = slideEntries[i].path;
    const relsPath = slidePath.replace('ppt/slides/slide', 'ppt/slides/_rels/slide') + '.rels';
    
    let layoutPath = '';
    const rels: Record<string, string> = {};
    if (loadedZip.file(relsPath)) {
      const relsXml = await loadedZip.file(relsPath)!.async('text');
      const relsDoc = parser.parseFromString(relsXml, 'application/xml');
      const relElements = relsDoc.getElementsByTagName('Relationship');
      for (let r = 0; r < relElements.length; r++) {
        const id = relElements[r].getAttribute('Id');
        const target = relElements[r].getAttribute('Target');
        const type = relElements[r].getAttribute('Type');
        if (id && target) {
          rels[id] = target;
          if (type?.includes('slideLayout')) {
            layoutPath = target.replace('../', 'ppt/').replace(/^\/?ppt\//, 'ppt/');
          }
        }
      }
    }

    const layoutPhs: Record<string, any> = {};
    let layoutBgColor = '#ffffff';
    
    if (layoutPath && loadedZip.file(layoutPath)) {
      const layoutXml = await loadedZip.file(layoutPath)!.async('text');
      const layoutDoc = parser.parseFromString(layoutXml, 'application/xml');
      const layoutShapes = Array.from(layoutDoc.querySelectorAll('sp, pic'));
      for (const lSp of layoutShapes) {
        const ph = lSp.getElementsByTagName('p:ph')[0];
        if (ph) {
          const idx = ph.getAttribute('idx') || ph.getAttribute('type') || 'body';
          const xfrm = lSp.getElementsByTagName('a:xfrm')[0];
          if (xfrm) {
            const off = xfrm.getElementsByTagName('a:off')[0];
            const ext = xfrm.getElementsByTagName('a:ext')[0];
            if (off && ext) {
              layoutPhs[idx] = {
                x: parseInt(off.getAttribute('x') || '0'),
                y: parseInt(off.getAttribute('y') || '0'),
                w: parseInt(ext.getAttribute('cx') || '0'),
                h: parseInt(ext.getAttribute('cy') || '0'),
              };
            }
          }
        }
      }
      
      const layoutBg = layoutDoc.getElementsByTagName('p:bg')[0];
      if (layoutBg) {
        const layoutSolidFill = layoutBg.getElementsByTagName('a:solidFill')[0];
        const layoutColor = getSolidFillColor(layoutSolidFill);
        if (layoutColor) layoutBgColor = layoutColor;
      }
    }

    const xmlString = await slideEntries[i].entry.async('text');
    const doc = parser.parseFromString(xmlString, 'application/xml');

    const elements: any[] = [];
    let slideBgColor = layoutBgColor;

    // Parse slide background
    const bg = doc.getElementsByTagName('p:bg')[0];
    if (bg) {
      const solidFill = bg.getElementsByTagName('a:solidFill')[0];
      const color = getSolidFillColor(solidFill);
      if (color) slideBgColor = color;
    }

    // Process all visual elements (p:sp, p:pic, p:cxnSp, p:grpSp) recursively to handle group transforms
    const spTree = doc.getElementsByTagName('p:spTree')[0];
    if (spTree) {
      await parseShapeNode(spTree, 0, 0, 1.0, 1.0, rels, loadedZip, elements, layoutPhs);
    }

    blocks.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'custom',
      content: { title: `Slide ${i + 1}` },
      style: {
        padding: 'none', // Important: don't add extra padding to precise coordinates
        align: 'left',
        bgColor: slideBgColor,
        textColor: '#000000',
        accentColor: '#3b82f6',
      },
      layout: {
        type: 'freeform',
        elements
      }
    });
  }

  return { blocks, presentationWidth, presentationHeight };
}
