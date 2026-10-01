// Gera as imagens de prévia (Open Graph) a partir do conteúdo e da foto.
// Rode com `bun run og` sempre que mudar título, manchete ou foto, e faça commit dos PNGs.
import sharp from 'sharp';
import { LOCALES, content } from '../src/lib/i18n';
import { escapeXml, wrapText } from '../src/lib/xml';

const WIDTH = 1200;
const HEIGHT = 630;
const PHOTO_WIDTH = 440;
const SITE_HOST = 'matheus-amon.github.io';
const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

for (const locale of LOCALES) {
  const cv = content[locale];
  const headline = wrapText(cv.person.headline, 26)
    .map((line, i) => `<tspan x="72" dy="${i === 0 ? 0 : 60}">${escapeXml(line)}</tspan>`)
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <rect width="100%" height="100%" fill="#FAFAF8"/>
  <rect width="12" height="${HEIGHT}" fill="#2A9D96"/>
  <text x="72" y="120" font-family="${FONT}" font-size="22" letter-spacing="3" fill="#1F7A75">${escapeXml(cv.person.title.toUpperCase())}</text>
  <text x="72" y="230" font-family="${FONT}" font-size="50" font-weight="700" fill="#0E1A24">${headline}</text>
  <text x="72" y="540" font-family="${FONT}" font-size="30" font-weight="700" fill="#0E1A24">${escapeXml(cv.person.name)}</text>
  <text x="72" y="580" font-family="${FONT}" font-size="20" fill="#5A6672">${SITE_HOST}</text>
</svg>`;

  const photo = await sharp('src/assets/photo.jpg')
    .resize(PHOTO_WIDTH, HEIGHT, { fit: 'cover', position: 'north' })
    .toBuffer();

  const out = `public/og-${locale}.png`;
  await sharp(Buffer.from(svg))
    .composite([{ input: photo, left: WIDTH - PHOTO_WIDTH, top: 0 }])
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log(`✓ ${out}`);
}
