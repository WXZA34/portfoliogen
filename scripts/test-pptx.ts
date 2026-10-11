import AdmZip from 'adm-zip';
import { parseStringPromise } from 'xml2js';

async function test() {
  const filePath = 'C:\\Users\\rolan\\Downloads\\Présentation de projet entreprise Moderne Bleu Noir.pptx';
  console.log(`Reading ${filePath}...`);
  
  try {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();
    
    // Find slide 1
    const slideEntry = zipEntries.find(entry => entry.entryName === 'ppt/slides/slide1.xml');
    if (!slideEntry) {
      console.log('No slide1.xml found');
      return;
    }
    
    const slideXml = slideEntry.getData().toString('utf8');
    const parsed = await parseStringPromise(slideXml);
    
    const shapes = parsed['p:sld']?.['p:cSld']?.[0]?.['p:spTree']?.[0]?.['p:sp'] || [];
    console.log(`Found ${shapes.length} shapes`);
    
    shapes.forEach((shape: any, i: number) => {
      const spPr = shape['p:spPr']?.[0];
      const xfrm = spPr?.['a:xfrm']?.[0];
      const off = xfrm?.['a:off']?.[0]?.$;
      const ext = xfrm?.['a:ext']?.[0]?.$;
      
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
      
      console.log(`Shape ${i}:`);
      console.log(`  Text: ${text.trim().replace(/\n/g, ' ')}`);
      if (off && ext) {
        // EMUs to Pixels (1 px = 9525 EMUs)
        console.log(`  X: ${Math.round(parseInt(off.x) / 9525)}px`);
        console.log(`  Y: ${Math.round(parseInt(off.y) / 9525)}px`);
        console.log(`  W: ${Math.round(parseInt(ext.cx) / 9525)}px`);
        console.log(`  H: ${Math.round(parseInt(ext.cy) / 9525)}px`);
      }
    });
    
  } catch (err) {
    console.error(err);
  }
}

test();
