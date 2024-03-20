// index.ts

import express from "express";
import { chromium } from "playwright";
import { exec } from "./utils/execPlaywright";
import OpenAI from "openai";
import dotenv from "dotenv";
import minifyHTML from "./utils/minifyHtml2";

dotenv.config();
const app = express();
const port = 3001;
const apiRouter = express.Router();

app.get("/screenshot", async (req, res) => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(req.query.url as string);
    const screenshot = await page.screenshot();
    await browser.close();
    res.set("Content-Type", "image/png");
    res.send(screenshot);
  } catch (e) {
    res.status(500).send((e as Error).message);
  }
});

app.get("/snapshot", async (req, res) => {
  try {
    if (typeof req.query.code === "string") {
      const snapshot = await exec(req.query.code, true);
      res.send(minifyHTML(snapshot));
    } else {
      throw new Error("code is required");
    }
  } catch (e) {
    res.status(500).send((e as Error).toString());
  }
});

app.use(express.json());

app.post("/openai", async (req, res, next) => {
  try {
    const params: OpenAI.ChatCompletionCreateParamsNonStreaming =
      req.body.params;
    const openai = new OpenAI({
      baseURL: process.env.OPENAI_BASE_URL,
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create(params);
    res.json(completion.choices[0]);
  } catch (e) {
    res.status(500).send((e as Error).toString());
  }
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
