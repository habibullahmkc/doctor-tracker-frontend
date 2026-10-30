/**
 * Accessibility (axe-core, WCAG 2.1 AA, 12 pages/dialog states) and keyboard checks.
 *   npm run e2e:a11y        (BASE_URL / CHROME_PATH as for e2e:ui)
 */
import fs from "node:fs";
import { createRequire } from "node:module";
import puppeteer from "puppeteer-core";

const CHROME_PATH =
  process.env.CHROME_PATH ??
  {
    win32: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    linux: "/usr/bin/google-chrome",
  }[process.platform];

const require = createRequire(import.meta.url);
const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const BASE = process.argv[2] ?? process.env.BASE_URL ?? "http://localhost:1982";
const browser = await puppeteer.launch({ executablePath: CHROME_PATH });
const wait = (ms = 700) => new Promise((r) => setTimeout(r, ms));
let totalViolations = 0;
let passed = 0;
let failed = 0;
const check = (name, ok, detail = "") => {
  if (ok) passed++;
  else failed++;
  console.log(`  ${ok ? "✔" : "✘"} ${name}${ok ? "" : " " + detail}`);
};

async function audit(page, label) {
  await page.evaluate(AXE);
  const result = await page.evaluate(async () =>
    axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] } }),
  );
  const v = result.violations;
  totalViolations += v.length;
  console.log(`\n[${label}] ${v.length ? `${v.length} violation type(s)` : "no violations"} · ${result.passes.length} rules passed`);
  for (const item of v) {
    console.log(`  - (${item.impact}) ${item.id}: ${item.help} [${item.nodes.length} node(s)]`);
    item.nodes.slice(0, 3).forEach((n) => console.log(`      ${n.target.join(" ")} :: ${n.failureSummary?.split("\n")[1]?.trim() ?? ""}`));
  }
}

async function session(viewport) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport(viewport);
  return page;
}
async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle0" });
  await page.type("#email", "admin@doctortracker.com");
  await page.type("#password", "Admin@123");
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), page.click("button[type=submit]")]);
}
const clickText = (page, sel, t) =>
  page.evaluate((s, x) => [...document.querySelectorAll(s)].find((e) => e.textContent?.trim().startsWith(x))?.click(), sel, t);

const d = await session({ width: 1440, height: 900 });
await d.goto(`${BASE}/login`, { waitUntil: "networkidle0" });
await wait(1500);
await audit(d, "login");
await login(d);
await wait(1200);
await audit(d, "dashboard");
await d.goto(`${BASE}/doctors`, { waitUntil: "networkidle0" });
await wait(800);
await audit(d, "doctors");
await clickText(d, "button", "Add doctor");
await wait(600);
await clickText(d, "[role=dialog] button", "Add doctor");
await wait(400);
await audit(d, "doctor form (with errors)");
await d.keyboard.press("Escape");
await wait(400);
const firstDoctor = await d.$eval("tbody tr", (r) => r.textContent);
await d.click("tbody tr");
await d.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {});
await wait(1000);
await audit(d, "doctor details");
console.log("  title:", await d.title(), `(${firstDoctor.slice(0, 30)}…)`);
await d.goto(`${BASE}/patients`, { waitUntil: "networkidle0" });
await wait(900);
await audit(d, "patients");
await d.click("tbody tr button[aria-label^='Actions for']");
await wait(300);
await clickText(d, "[role=menuitem]", "Edit");
await wait(800);
await audit(d, "patient form");
await d.keyboard.press("Escape");
await wait(400);
await d.click("tbody tr button[aria-label^='Actions for']");
await wait(300);
await clickText(d, "[role=menuitem]", "Delete");
await wait(500);
await audit(d, "confirm dialog");
await d.keyboard.press("Escape");
await wait(400);
await d.goto(`${BASE}/nope-page`, { waitUntil: "networkidle0" });
await audit(d, "404");

const m = await session({ width: 390, height: 844, isMobile: true, hasTouch: true });
await login(m);
await m.goto(`${BASE}/patients`, { waitUntil: "networkidle0" });
await wait(900);
await audit(m, "patients (mobile)");
await clickText(m, "button", "Filters");
await wait(600);
await audit(m, "filter sheet (mobile)");
await m.keyboard.press("Escape");
await m.click('button[aria-label="Open navigation menu"]');
await wait(600);
await audit(m, "nav drawer (mobile)");

// ---------- Keyboard ----------
console.log("\n■ Keyboard");
const k = await session({ width: 1440, height: 900 });
await login(k);
await k.goto(`${BASE}/doctors`, { waitUntil: "networkidle0" });
await wait(800);
const focusInfo = () =>
  k.evaluate(() => {
    const el = document.activeElement;
    return { tag: el?.tagName, text: el?.textContent?.trim().slice(0, 40), label: el?.getAttribute("aria-label"), id: el?.id, role: el?.getAttribute("role") };
  });
await k.keyboard.press("Tab");
let f = await focusInfo();
check("first Tab focuses 'Skip to content'", f.text === "Skip to content", JSON.stringify(f));
await k.keyboard.press("Enter");
await wait(200);
check("skip link targets #main-content", k.url().endsWith("#main-content"), k.url());
// Visible focus ring on a keyboard-focused button
for (let i = 0; i < 25; i++) {
  await k.keyboard.press("Tab");
  f = await focusInfo();
  if (f.text === "Add doctor") break;
}
check("Add doctor reachable by Tab", f.text === "Add doctor", JSON.stringify(f));
const ring = await k.evaluate(() => getComputedStyle(document.activeElement).boxShadow);
check("focused button shows a focus ring", ring && ring !== "none", ring);
await k.keyboard.press("Enter");
await wait(600);
f = await focusInfo();
check("Enter opens dialog and focuses first field", f.id === "doctor-name", JSON.stringify(f));
// Focus trap: tab many times, focus must stay inside dialog
let inside = true;
for (let i = 0; i < 15; i++) {
  await k.keyboard.press("Tab");
  inside = inside && (await k.evaluate(() => Boolean(document.activeElement?.closest("[role=dialog]"))));
}
check("focus stays trapped inside the dialog", inside);
await k.keyboard.press("Escape");
await wait(500);
f = await focusInfo();
check("Esc closes dialog and returns focus to trigger", !(await k.$("[role=dialog]")) && f.text === "Add doctor", JSON.stringify(f));
// Select operable by keyboard
await k.focus('[data-filter="All specializations"]');
await k.keyboard.press("Enter");
await wait(300);
await k.keyboard.press("ArrowDown");
await k.keyboard.press("ArrowDown");
await k.keyboard.press("Enter");
await wait(900);
check("filter select operable with keyboard", k.url().includes("specialization="), k.url());
// Row actions via keyboard
await k.focus("tbody tr button[aria-label^='Actions for']");
await k.keyboard.press("Enter");
await wait(300);
check("row action menu opens with keyboard", (await k.$$("[role=menuitem]")).length === 3);
await k.keyboard.press("Escape");
// Search: Escape clears
await k.focus("input[type=search]");
await k.keyboard.type("abc");
await k.keyboard.press("Escape");
check("Esc clears search input", (await k.$eval("input[type=search]", (i) => i.value)) === "");

console.log(`\naxe: ${totalViolations} violation type(s) total · keyboard: ${passed} passed, ${failed} failed`);
await browser.close();
process.exit(totalViolations || failed ? 1 : 0);
