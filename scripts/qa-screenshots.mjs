import puppeteer from "puppeteer-core";
import fs from "node:fs";

const OUT = process.env.QA_OUT_DIR || "/tmp/prx-qa";
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: false,
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
});

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
}

async function collectErrors(page, logs) {
  page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") logs.push(`[console.error] ${m.text()}`);
  });
}

const logs = [];

// --- Home page ---
const home = await browser.newPage();
await collectErrors(home, logs);
await home.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 4500));
await shot(home, "home-hero");

for (const f of [0.05, 0.25, 0.5, 0.72, 0.9]) {
  await home.evaluate((frac) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * frac, behavior: "instant" });
  }, f);
  await new Promise((r) => setTimeout(r, 500));
  await shot(home, `home-scroll-${Math.round(f * 100)}`);
}

// scroll to the very bottom past the pinned canvas to see story/3d/config/collection/footer
await home.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await new Promise((r) => setTimeout(r, 200));
const fullHeight = await home.evaluate(() => document.documentElement.scrollHeight);
const stops = [0.72, 0.78, 0.84, 0.9, 0.96, 1];
for (const s of stops) {
  await home.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), fullHeight * s);
  await new Promise((r) => setTimeout(r, 700));
  await shot(home, `home-page-${Math.round(s * 100)}`);
}

// Search overlay
await home.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await new Promise((r) => setTimeout(r, 300));
await home.click('button[aria-label="Search"]');
await new Promise((r) => setTimeout(r, 400));
await shot(home, "search-overlay-empty");
await home.type('input[aria-label="Search"]', "blue");
await new Promise((r) => setTimeout(r, 300));
await shot(home, "search-overlay-results");
await home.keyboard.press("Escape");
await new Promise((r) => setTimeout(r, 300));

// Add to bag from collection grid, open cart
await home.evaluate(() => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: max * 0.8, behavior: "instant" });
});
await new Promise((r) => setTimeout(r, 800));
const addBtn = await home.$$('button');
let clicked = false;
for (const b of addBtn) {
  const text = await home.evaluate((el) => el.textContent, b);
  if (text && text.includes("Add to Bag")) {
    await b.click();
    clicked = true;
    break;
  }
}
await new Promise((r) => setTimeout(r, 600));
await shot(home, "cart-sidebar" + (clicked ? "" : "-NOBUTTONFOUND"));

await home.close();

// --- Collection page ---
const coll = await browser.newPage();
await collectErrors(coll, logs);
await coll.goto("http://localhost:3000/collection", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 2500));
await shot(coll, "collection-page");
await coll.close();

// --- PDP page ---
const pdp = await browser.newPage();
await collectErrors(pdp, logs);
await pdp.goto("http://localhost:3000/watch/prx-powermatic-80-blue", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 2500));
await shot(pdp, "pdp-top");
await pdp.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
await new Promise((r) => setTimeout(r, 500));
await shot(pdp, "pdp-scrolled");
await pdp.close();

// --- Mobile home ---
const mobile = await browser.newPage();
await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
await collectErrors(mobile, logs);
await mobile.goto("http://localhost:3000", { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 4000));
await shot(mobile, "mobile-hero");
await mobile.click('button[aria-label="Toggle menu"]');
await new Promise((r) => setTimeout(r, 400));
await shot(mobile, "mobile-menu");
await mobile.close();

fs.writeFileSync(`${OUT}/console.log`, logs.join("\n"));
await browser.close();
console.log("QA done ->", OUT);
console.log("Errors captured:", logs.length);
