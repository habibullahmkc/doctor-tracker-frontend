/**
 * Browser end-to-end suite (35 checks, desktop + mobile) against a running app with seeded data.
 *   npm run e2e:ui                                   # http://localhost:1982
 *   BASE_URL=https://doctor-tracker-psi.vercel.app npm run e2e:ui
 * Uses the locally installed Chrome (override with CHROME_PATH). Creates and deletes its own test doctor.
 */
import puppeteer from "puppeteer-core";

const CHROME_PATH =
  process.env.CHROME_PATH ??
  {
    win32: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    linux: "/usr/bin/google-chrome",
  }[process.platform];
import fs from "node:fs";

const BASE = process.argv[2] ?? process.env.BASE_URL ?? "http://localhost:1982";
const OUT = process.argv[3] ?? process.env.OUT_DIR ?? "./e2e/.output";
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: ["--hide-scrollbars"],
});
const errors = [];
let passed = 0;
let failed = 0;
const check = (name, ok, detail = "") => {
  if (ok) passed++;
  else failed++;
  console.log(`  ${ok ? "✔" : "✘"} ${name}${ok ? "" : " " + detail}`);
};
const wait = (ms = 700) => new Promise((r) => setTimeout(r, ms));
const path = (p) => p.url().replace(BASE, "");
const text = (p) => p.evaluate(() => document.body.innerText);
const waitIn = (p, selector, needle, timeout = 15000) =>
  p.waitForFunction((sel, n) => document.querySelector(sel)?.innerText.includes(n), { timeout }, selector, needle).then(() => true, () => false);
// Dialogs animate out; body has pointer-events:none until they're gone.
const waitDialogClosed = (p) =>
  p.waitForFunction(() => !document.querySelector("[role=dialog],[role=alertdialog]") && document.body.style.pointerEvents !== "none", { timeout: 10000 }).catch(() => {});
const waitText = (p, needle, timeout = 15000) =>
  p.waitForFunction((n) => document.body.innerText.includes(n), { timeout }, needle).then(() => true, () => false);

async function session(viewport) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport(viewport);
  page.on("pageerror", (e) => errors.push(`${path(page)} PAGEERROR ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error" && !/status of 40[0-9]/.test(m.text())) errors.push(`${path(page)} ${m.text()}`);
  });
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle0" });
  await page.type("#email", "admin@doctortracker.com");
  await page.type("#password", "Admin@123");
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), page.click("button[type=submit]")]);
  return page;
}
const clickText = (page, selector, label) =>
  page.evaluate(
    (sel, t) => {
      const el = [...document.querySelectorAll(sel)].find((e) => e.textContent?.trim() === t || e.textContent?.trim().startsWith(t));
      el?.click();
      return Boolean(el);
    },
    selector,
    label,
  );
async function pick(page, triggerSelector, option) {
  await page.click(triggerSelector);
  await wait(300);
  const ok = await clickText(page, "[role=option]", option);
  await wait(300);
  return ok;
}
const shot = (page, name, full = true) => page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full });
const toastText = (page) => page.evaluate(() => [...document.querySelectorAll("[data-sonner-toast]")].map((t) => t.textContent).join(" | "));
async function fill(page, selector, value) {
  await page.click(selector, { count: 3 });
  await page.keyboard.press("Backspace");
  await page.type(selector, value);
}

const stamp = Date.now().toString().slice(-6);
const DOC_NAME = `Dr. Zara Testwell ${stamp}`;
const DOC_EMAIL = `zara.${stamp}@example.com`;

// ================= DESKTOP =================
const d = await session({ width: 1440, height: 900 });
const leftovers = await d.evaluate(async () => {
  const res = await fetch("/api/doctors?search=testwell&limit=50");
  const { data } = await res.json();
  await Promise.all(data.map((doc) => fetch(`/api/doctors/${doc._id}`, { method: "DELETE" })));
  return data.length;
});
if (leftovers) console.log(`(removed ${leftovers} leftover test doctor(s) from an interrupted run)`);

console.log("\n■ Dashboard");
await d.goto(`${BASE}/dashboard`, { waitUntil: "networkidle0" });
await wait(1200);
const dash = await text(d);
check("stat cards + charts render", ["Total doctors", "Patient admissions", "Patients by status", "Patients per doctor", "Patients by condition", "Doctors by specialization", "Recent admissions"].every((s) => dash.includes(s)));
check("admissions area chart drawn", (await d.$$(".recharts-area-area")).length === 1);
await shot(d, "d-dashboard");
await d.click('[role=radio][aria-checked=false]:nth-of-type(3)');
await waitText(d, "last 12 months");
check("range toggle → ?range=12m", path(d).includes("range=12m"), path(d));
check("12-month description", (await text(d)).includes("last 12 months"));
// hover tooltip
const area = await d.$(".recharts-surface");
const box = await area.boundingBox();
await d.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2);
await wait(400);
check("hover tooltip shows admissions", (await text(d)).match(/\d+ admissions?/) !== null);
await shot(d, "d-dashboard-12m", false);
await clickText(d, "a", "Dr. ");
await d.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {});
check("patients-per-doctor bar links to doctor page", /\/doctors\/[a-f0-9]{24}/.test(path(d)), path(d));

console.log("\n■ Doctors list");
await d.goto(`${BASE}/doctors`, { waitUntil: "networkidle0" });
await waitText(d, "of 25");
check("10 rows + pagination", (await d.$$("tbody tr")).length === 10 && (await text(d)).includes("of 25"));
await shot(d, "d-doctors");
await d.type('input[type=search]', "card");
await wait(1200);
const cardRows = await d.$$eval("tbody tr", (rows) => rows.map((r) => r.innerText));
check("search 'card' → only Cardiology", cardRows.length > 0 && cardRows.every((r) => r.includes("Cardiology")), cardRows.length);
await clickText(d, "button", "Clear filters");
await d.click('input[type=search]', { count: 3 });
await d.keyboard.press("Backspace");
await wait(1000);
check("specialization filter", await pick(d, '[data-filter="All specializations"]', "Pediatrics"));
await wait(900);
check("→ URL has specialization", path(d).includes("specialization=Pediatrics"), path(d));
check("→ 3 pediatricians", (await d.$$("tbody tr")).length === 3);
await clickText(d, "button", "Clear filters");
await wait(900);

const existingEmail = await d.$eval("tbody tr td p.text-xs", (p) => p.textContent);
console.log("\n■ Create doctor");
await clickText(d, "button", "Add doctor");
await wait(500);
await clickText(d, "[role=dialog] button", "Add doctor");
await wait(400);
const errs = await d.$$eval("[role=dialog] p.text-destructive", (ps) => ps.map((p) => p.textContent));
check("empty submit → 5 inline errors", errs.length === 5, JSON.stringify(errs));
await shot(d, "d-doctor-form-errors", false);
await d.type("#doctor-name", DOC_NAME);
await pick(d, "#doctor-specialization", "Neurology");
await d.type("#doctor-hospital", "Test General Hospital");
await d.type("#doctor-phone", "+8801711223344");
await d.type("#doctor-email", existingEmail);
await clickText(d, "[role=dialog] button", "Add doctor");
await wait(1200);
const dupErr = await d.$eval("[role=dialog]", (el) => el.innerText).catch(() => "");
const dup = dupErr.includes("already in use");
check("duplicate email → 'already in use' under email field", dup, dupErr.slice(0, 160));
if (dup) {
  await fill(d, "#doctor-email", DOC_EMAIL);
  await clickText(d, "[role=dialog] button", "Add doctor");
  await waitDialogClosed(d);
  await d.waitForSelector("[data-sonner-toast]", { timeout: 10000 }).catch(() => {});
}
check("dialog closes after create", !(await d.$("[role=dialog]")));
check("success toast", (await toastText(d)).includes("added"), await toastText(d));
await d.type('input[type=search]', "testwell");
await wait(1300);
check("new doctor appears in list", (await text(d)).includes(DOC_NAME));

console.log("\n■ Edit doctor");
await d.click("tbody tr button[aria-label^='Actions for']");
await wait(300);
await clickText(d, "[role=menuitem]", "Edit");
await wait(500);
check("edit dialog prefilled", (await d.$eval("#doctor-name", (i) => i.value)) === DOC_NAME);
await fill(d, "#doctor-hospital", "Renamed Medical Centre");
await clickText(d, "[role=dialog] button", "Save changes");
await waitDialogClosed(d);
await waitIn(d, "tbody", "Renamed Medical Centre");
check("edited hospital shows in table", (await text(d)).includes("Renamed Medical Centre"));

console.log("\n■ Doctor details");
await d.click("tbody tr");
await d.waitForFunction(() => /\/doctors\/[a-f0-9]{24}/.test(location.pathname), { timeout: 15000 }).catch(() => {});
await waitText(d, "No patients yet");
check("row click → details page", /\/doctors\/[a-f0-9]{24}/.test(path(d)));
const doctorUrl = path(d).split("?")[0];
check("profile shows name + 0 patients", (await text(d)).includes(DOC_NAME) && (await text(d)).includes("No patients yet"));
await clickText(d, "button", "Add patient");
await d.waitForSelector("#patient-doctor", { timeout: 10000 });
check("add-patient dialog has fixed doctor", (await d.$eval("#patient-doctor", (i) => i.value)) === DOC_NAME);
await d.type("#patient-name", "Rafiq Testpatient");
await d.type("#patient-age", "47");
await pick(d, "#patient-gender", "Male");
await d.type("#patient-phone", "+8801899887766");
await pick(d, "#patient-condition", "Migraine");
await shot(d, "d-patient-form", false);
await clickText(d, "[role=dialog] button", "Add patient");
await waitDialogClosed(d);
await waitIn(d, "tbody", "Rafiq Testpatient");
await d.waitForFunction(() => /Total patients\s*1\b/.test(document.querySelector("main")?.innerText ?? ""), { timeout: 15000 }).catch(() => {});
check("patient added under doctor", (await text(d)).includes("Rafiq Testpatient") && (await d.$$("tbody tr")).length === 1);
check("profile count updated to 1", /Total patients\s*1\b/.test(await d.$eval("main", (m) => m.innerText)));
await d.click("tbody tr button[aria-label^='Actions for']");
await wait(300);
await clickText(d, "[role=menuitem]", "Edit");
await wait(500);
await pick(d, "#patient-status", "Recovered");
await clickText(d, "[role=dialog] button", "Save changes");
await waitDialogClosed(d);
await waitIn(d, "tbody", "Recovered");
check("patient status edited → Recovered", (await d.$eval("tbody", (t) => t.innerText)).includes("Recovered"));
await shot(d, "d-doctor-detail");
await d.click("tbody tr button[aria-label^='Actions for']");
await wait(300);
await clickText(d, "[role=menuitem]", "Remove");
await wait(400);
await shot(d, "d-remove-confirm", false);
await clickText(d, "[role=alertdialog] button", "Remove patient");
await waitIn(d, "main", "No patients yet");
check("patient removed", (await text(d)).includes("No patients yet"));

console.log("\n■ Patients page");
await d.goto(`${BASE}/patients`, { waitUntil: "networkidle0" });
await waitText(d, "of 450");
check("450 patients listed", (await text(d)).includes("of 450"));
await pick(d, '[data-filter="All conditions"]', "Asthma");
await wait(900);
await pick(d, '[data-filter="All statuses"]', "Discharged");
await d.waitForFunction(() => {
  const rows = [...document.querySelectorAll("tbody tr")].map((r) => r.innerText);
  return rows.length > 0 && rows.every((r) => r.includes("Asthma") && r.includes("Discharged")) && location.search.includes("status=");
}, { timeout: 15000 }).catch(() => {});
const rows = await d.$$eval("tbody tr", (rs) => rs.map((r) => r.innerText));
check("condition + status filters", rows.length > 0 && rows.every((r) => r.includes("Asthma") && r.includes("Discharged")), rows.length);
check("filters reflected in URL", path(d).includes("condition=Asthma") && path(d).includes("status=Discharged"));
await shot(d, "d-patients-filtered");
await d.reload({ waitUntil: "networkidle0" });
await wait(900);
check("filters survive reload", (await d.$$eval("tbody tr", (rs) => rs.length)) === rows.length);
await clickText(d, "button", "Clear filters");
await wait(1000);
await d.click("tbody tr button[aria-label^='Actions for']");
await wait(300);
await clickText(d, "[role=menuitem]", "Edit");
await wait(800);
check("edit dialog has doctor select populated", (await d.$eval("#patient-doctor", (b) => b.textContent)).includes("Dr."));
await shot(d, "d-patient-edit", false);
await d.keyboard.press("Escape");
await wait(400);

console.log("\n■ Delete doctor (cleanup)");
await d.goto(`${BASE}${doctorUrl}`, { waitUntil: "networkidle0" });
await wait(800);
await clickText(d, "button", "Delete");
await wait(400);
await clickText(d, "[role=alertdialog] button", "Delete doctor");
await d.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {});
await wait(800);
check("delete → redirected to /doctors", path(d).startsWith("/doctors") && !/[a-f0-9]{24}/.test(path(d)), path(d));
check("doctor count back to 25", (await text(d)).includes("of 25"));
await d.goto(`${BASE}${doctorUrl}`, { waitUntil: "networkidle0" });
await wait(1200);
check("deleted doctor URL → 'Doctor not found'", (await text(d)).includes("Doctor not found"));

// ================= MOBILE =================
console.log("\n■ Mobile");
const m = await session({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await m.goto(`${BASE}/dashboard`, { waitUntil: "networkidle0" });
await wait(1200);
await shot(m, "m-dashboard");
await m.goto(`${BASE}/doctors`, { waitUntil: "networkidle0" });
await wait(900);
await shot(m, "m-doctors");
await m.goto(`${BASE}/patients`, { waitUntil: "networkidle0" });
await wait(900);
await shot(m, "m-patients");
await clickText(m, "button", "Filters");
await wait(600);
check("mobile filter sheet opens", (await text(m)).includes("Narrow down the list"));
await m.screenshot({ path: `${OUT}/m-filter-sheet.png` });
await m.keyboard.press("Escape");
await wait(400);
const firstDoctor = await m.evaluate(() => document.querySelector("a[href^='/doctors/']")?.getAttribute("href"));
await m.goto(`${BASE}${firstDoctor}`, { waitUntil: "networkidle0" });
await wait(1000);
await shot(m, "m-doctor-detail");
const overflow = await m.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
check("no horizontal overflow on mobile", !overflow);

console.log(`\n${passed} passed, ${failed} failed`);
console.log(errors.length ? "Console errors:\n" + [...new Set(errors)].join("\n") : "No console errors");
await browser.close();
process.exit(failed ? 1 : 0);
