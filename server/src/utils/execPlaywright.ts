import { getSnapshot } from "./getSnapshot";
import { chromium } from "playwright";

export const exec = async (code: string, needSnapshot: boolean) => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const func = new Function(
    "page",
    "getSnapshot",
    `return (async () => { ${code} })()`
  );
  let result = await func(page, getSnapshot);

  if (needSnapshot) {
    const snapshot = await getSnapshot(page);
    result = snapshot.dom;
  }

  await browser.close();

  return result;
};
