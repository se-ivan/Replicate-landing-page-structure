import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const svgPath = path.resolve(process.cwd(), 'public', 'logo.svg');
const outDir = path.resolve(process.cwd(), 'public');
const sizes = [16, 32, 48, 96, 192, 512];

async function run() {
  try {
    const writtenFiles = [];
    for (const size of sizes) {
      const pngBuffer = await sharp(svgPath, { density: 300 })
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      const outPath = path.join(outDir, `favicon-${size}.png`);
      await fs.writeFile(outPath, pngBuffer);
      writtenFiles.push(outPath);
      console.log(`Wrote favicon-${size}.png`);
    }

    // create a 256x256 PNG and use it to generate an ICO (png-to-ico expects a 256px PNG)
    const png256Path = path.join(outDir, 'favicon-256.png');
    const png256Buffer = await sharp(svgPath, { density: 300 })
      .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    await fs.writeFile(png256Path, png256Buffer);
    console.log('Wrote favicon-256.png');

    const icoBuffer = await pngToIco(png256Path);
    await fs.writeFile(path.join(outDir, 'favicon.ico'), icoBuffer);
    console.log('Wrote favicon.ico');

    // optional: write a simple site.webmanifest
    const manifest = {
      name: 'Plenitud Emocional',
      short_name: 'Plenitud',
      icons: sizes.map((s) => ({ src: `/favicon-${s}.png`, sizes: `${s}x${s}`, type: 'image/png' })),
      start_url: '/',
      display: 'standalone',
      theme_color: '#1a2e1a',
      background_color: '#ffffff',
    };
    await fs.writeFile(path.join(outDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
    console.log('Wrote site.webmanifest');

    console.log('Favicons generation complete.');
  } catch (err) {
    console.error('Error generating favicons:', err);
    process.exit(1);
  }
}

run();
