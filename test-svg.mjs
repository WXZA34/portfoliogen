import * as pdfjsLib from 'pdfjs-dist';

async function test() {
  console.log("SVGGraphics available?", !!pdfjsLib.SVGGraphics);
}

test();
