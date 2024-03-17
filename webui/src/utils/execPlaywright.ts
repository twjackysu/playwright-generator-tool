import { getSnapshot } from "@/utils/getSnapshot";
import { chromium } from "playwright";

export const exec = async (code: string, needSnapshot: boolean) => {
  // const str = 'await page.goto("https://irs.thsrc.com.tw/IMINT/?locale=tw");';
  let newCode = code;
  if (needSnapshot) {
    newCode +=
      "\nconst snapshot = await getSnapshot(page);\nreturn snapshot.dom;";
  }
  const snapshotDom = await new Function("chromium", "getSnapshot", code)(
    chromium,
    getSnapshot
  );
  return snapshotDom;
};
