import * as pdfjsLib from 'pdfjs-dist';
import fs from 'fs';
import { createCanvas } from 'canvas';

async function test() {
  const data = new Uint8Array(fs.readFileSync('C:\\Users\\rolan\\Downloads\\BUT gnie lectrique et informatique industrielle IUT cachan (94) universit paris saclay.pdf'));
  
  const doc = await pdfjsLib.getDocument({ data }).promise;
  const page = await doc.getPage(1);
  const viewport = page.getViewport({ scale: 1.0 });

  const canvas = createCanvas(viewport.width, viewport.height);
  const ctx = canvas.getContext('2d');
  
  const images = [];

  // Proxy drawImage
  const origDrawImage = ctx.drawImage;
  ctx.drawImage = function(...args) {
    images.push({ method: 'drawImage', args: args.length });
    return origDrawImage.apply(this, args);
  };

  const origPutImageData = ctx.putImageData;
  ctx.putImageData = function(...args) {
    images.push({ method: 'putImageData', args: args.length });
    return origPutImageData.apply(this, args);
  };

  await page.render({ canvasContext: ctx, viewport }).promise;

  console.log("Images found:", images.length);
  console.log(images);
}

test();
