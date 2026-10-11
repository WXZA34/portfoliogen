import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';

async function generateIcons() {
  const svg = fs.readFileSync('public/icon.svg', 'utf8');
  // Need to convert SVG to PNG using canvas
  const img = await loadImage('data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64'));
  
  for (const size of [192, 512]) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, size, size);
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`public/icon-${size}.png`, buffer);
    console.log(`Created icon-${size}.png`);
  }
}

generateIcons().catch(console.error);
