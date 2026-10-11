import sharp from 'sharp';
import fs from 'fs';

async function generateIcons() {
  const svgBuffer = fs.readFileSync('public/icon.svg');
  
  for (const size of [192, 512]) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(`public/icon-${size}.png`);
    console.log(`Created icon-${size}.png`);
  }
}

generateIcons().catch(console.error);
