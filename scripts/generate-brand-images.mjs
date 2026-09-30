// Renders the static share image and app icons from the logo and brand colours.
// Usage: node scripts/generate-brand-images.mjs   (needs network for Google Fonts)
import { readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const logo = readFileSync("public/logo.svg", "utf8");
const markPath = [...logo.matchAll(/<path d="([^"]+)"/g)].map((m) => m[1]).find((d) => d.startsWith("M27.4204"));
if (!markPath) throw new Error("Logo mark path not found in public/logo.svg");
const logoWhite = logo.replace(/<svg /, '<svg style="height:100%;width:auto" ');
const mark = (size) =>
  `<svg viewBox="-4 -3.5 39 37" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><path d="${markPath}" fill="#eceee8"/></svg>`;

const fonts = `<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Schibsted+Grotesk:wght@600&family=JetBrains+Mono&display=block" rel="stylesheet">`;
const base = `*{margin:0;box-sizing:border-box} body{background:#1a2136;color:#eceee8;font-family:'Schibsted Grotesk',sans-serif}`;

const og = `<!doctype html><html><head>${fonts}<style>${base}
  .wrap{width:1200px;height:630px;position:relative;overflow:hidden;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between}
  .grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgb(154 163 184/.08) 1px,transparent 1px),linear-gradient(to bottom,rgb(154 163 184/.08) 1px,transparent 1px);background-size:64px 64px}
  .glow{position:absolute;left:-160px;top:-60px;width:620px;height:620px;border-radius:50%;background:rgb(44 103 255/.35);filter:blur(120px)}
  .logo{height:44px;position:relative} h1{font-size:76px;line-height:1;letter-spacing:-.035em;font-weight:600;max-width:930px;position:relative}
  em{font-family:'Instrument Serif',serif;font-weight:400;font-style:italic;letter-spacing:0}
  .foot{display:flex;justify-content:space-between;align-items:center;position:relative;font-family:'JetBrains Mono',monospace;font-size:20px;letter-spacing:.14em;text-transform:uppercase;color:#9aa3b8}
  .dot{display:inline-block;width:12px;height:12px;border-radius:50%;background:#3dffae;margin-right:14px}
  .url{color:#3dffae;text-transform:none;letter-spacing:0}
</style></head><body><div class="wrap"><div class="grid"></div><div class="glow"></div>
  <div class="logo">${logoWhite}</div>
  <h1>Senior engineers for products that <em>need to ship.</em></h1>
  <div class="foot"><span><span class="dot"></span>One-stop software partner · Europe &amp; GCC</span><span class="url">alfa-point.com</span></div>
</div></body></html>`;

const icon = (size) => `<!doctype html><html><head><style>${base}
  body{width:${size}px;height:${size}px;display:grid;place-items:center;background:#1a2136}</style></head>
  <body>${mark(Math.round(size * 0.78))}</body></html>`;

const browser = await chromium.launch();
async function render(html, width, height, out) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, clip: { x: 0, y: 0, width, height } });
  await page.close();
  console.log("wrote", out);
}
await render(og, 1200, 630, "public/og.png");
await render(icon(512), 512, 512, "src/app/icon.png");
await render(icon(180), 180, 180, "src/app/apple-icon.png");
await browser.close();
