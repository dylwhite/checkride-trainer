// Generates the app icon and iPhone splash screens from scripts/icon.svg.
// Run with: npm run icons   (uses the Playwright browser to render PNGs)
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';

const svg = readFileSync(new URL('./icon.svg', import.meta.url), 'utf8');
const svgUri = 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64');
mkdirSync('public/icons', { recursive: true });
mkdirSync('public/splash', { recursive: true });

// iPhone screen sizes in CSS points and pixel ratio (portrait)
export const SPLASH = [
  [440, 956, 3], [402, 874, 3], [430, 932, 3], [393, 852, 3], [428, 926, 3],
  [390, 844, 3], [375, 812, 3], [414, 896, 3], [414, 896, 2], [375, 667, 2]
];

const browser = await chromium.launch();
const page = await browser.newPage();

async function shot(html, w, h, out) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<html><body style="margin:0;background:#0B1220">${html}</body></html>`);
  await page.waitForTimeout(50);
  await page.screenshot({ path: out, omitBackground: false });
}

for (const s of [180, 192, 512, 1024]) {
  await shot(`<img src="${svgUri}" style="width:${s}px;height:${s}px;display:block">`, s, s, `public/icons/icon-${s}.png`);
}
// Maskable: extra padding so Android-style masks don't clip the plane
await shot(`<div style="width:512px;height:512px;background:#0B1220;display:flex;align-items:center;justify-content:center"><img src="${svgUri}" style="width:400px;height:400px"></div>`, 512, 512, 'public/icons/icon-maskable-512.png');
await shot(`<img src="${svgUri}" style="width:64px;height:64px;display:block">`, 64, 64, 'public/icons/favicon-64.png');

const links = [];
for (const [w, h, r] of SPLASH) {
  const pw = w * r, ph = h * r, icon = Math.round(pw * 0.32);
  const file = `splash/splash-${pw}x${ph}.png`;
  await shot(`<div style="width:${pw}px;height:${ph}px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${Math.round(pw * 0.05)}px;background:radial-gradient(circle at 50% 40%,#16233D,#0B1220 70%);font-family:-apple-system,Helvetica,Arial,sans-serif">
    <img src="${svgUri}" style="width:${icon}px;height:${icon}px;border-radius:${Math.round(icon * 0.22)}px">
    <div style="color:#E8EEF8;font-weight:700;font-size:${Math.round(pw * 0.06)}px;letter-spacing:-0.01em">Checkride Trainer</div>
    <div style="color:#8B9AB5;font-size:${Math.round(pw * 0.032)}px;letter-spacing:0.12em;text-transform:uppercase">Think like a pilot</div>
  </div>`, pw, ph, `public/${file}`);
  links.push(`    <link rel="apple-touch-startup-image" href="${file}" media="(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${r}) and (orientation: portrait)" />`);
}
writeFileSync('scripts/splash-links.html', links.join('\n') + '\n');
await browser.close();
console.log('Icons and splash screens generated.');
