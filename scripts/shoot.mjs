/** Visual QA harness: screenshots the page at a few widths and states. */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const OUT = process.env.SHOT_DIR ?? "/tmp/shots";
const URL = "http://localhost:3000";

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium",
});

async function shoot(name, { width, height, action } = {}) {
  const page = await browser.newPage({
    viewport: { width: width ?? 1440, height: height ?? 900 },
    deviceScaleFactor: 1,
  });

  await page.goto(URL, { waitUntil: "networkidle" });
  // Let entrance animations settle before capturing.
  await page.waitForTimeout(1400);

  if (action) await action(page);

  await page.screenshot({
    path: `${OUT}/${name}.png`,
    fullPage: !action && !height,
  });
  await page.close();
  console.log("✓", name);
}

const scrollTo = (selector) => async (page) => {
  await page.evaluate((sel) => {
    document.querySelector(sel)?.scrollIntoView({ block: "start" });
  }, selector);
  await page.waitForTimeout(1600);
};

await shoot("desktop-full", {});
await shoot("hero", { height: 900 });
await shoot("collections", { height: 980, action: scrollTo("#collections") });

await shoot("album-open", {
  height: 980,
  action: async (page) => {
    await scrollTo("#collections")(page);
    await page.getByRole("button", { name: /Wedding Journal/i }).first().click();
    await page.waitForTimeout(1100);
  },
});

await shoot("about", { height: 950, action: scrollTo("#about") });
await shoot("process", { height: 950, action: scrollTo("#process") });
await shoot("craft", { height: 950, action: scrollTo("#craft") });
await shoot("occasions", { height: 900, action: scrollTo("#occasions") });
await shoot("order", { height: 950, action: scrollTo("#order") });
await shoot("faq", { height: 900, action: scrollTo("#faq") });
await shoot("mobile-full", { width: 390, height: 844 });
await shoot("mobile-collections", {
  width: 390,
  height: 844,
  action: scrollTo("#collections"),
});

await browser.close();
