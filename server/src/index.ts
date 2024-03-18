// index.ts

import express from "express";
import { chromium } from "playwright";
import { exec } from "./utils/execPlaywright";

const app = express();
const port = 3001;
const apiRouter = express.Router();

app.get("/screenshot", async (req, res) => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(req.query.url as string);
  const screenshot = await page.screenshot();
  await browser.close();
  res.set("Content-Type", "image/png");
  res.send(screenshot);
});

app.get("/snapshot", async (req, res) => {
  try {
    if (typeof req.query.code === "string") {
      const snapshot = await exec(req.query.code, true);
      res.send(snapshot);
    } else {
      throw new Error("code is required");
    }
  } catch (e) {
    res.status(400).send((e as Error).message);
  }
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
