import { getSnapshot } from "./getSnapshot";
import { chromium } from "playwright";

export const exec = async (code: string, needSnapshot: boolean) => {
  const browser = await chromium.launch({ headless: false });
  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    const func = new Function(
      "page",
      "getSnapshot",
      `return (async () => { ${code} })()`
    );
    let result = await func(page, getSnapshot);
    await page.waitForTimeout(1000);
    if (needSnapshot) {
      const snapshot = await getSnapshot(page);
      result = snapshot.dom;
    }

    return result;
  } finally {
    // Always release the browser process, even if the supplied code threw.
    await browser.close().catch((e) => {
      console.error("Failed to close browser:", (e as Error).message);
    });
  }
};
