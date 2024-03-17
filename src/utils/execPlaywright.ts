import { chromium } from "playwright";

export const exec = async (code: string) => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  // const str = 'await page.goto("https://irs.thsrc.com.tw/IMINT/?locale=tw");';
  new Function("page", code)(page);
};
