"use client";

import { callOpenAIApi } from "@/apis/openAIApi";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { blue, grey } from "@mui/material/colors";
import { styled } from "@mui/system";
import OpenAI from "openai";
import { useState } from "react";

const TextareaAutosize = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  box-sizing: border-box;
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${
    theme.palette.mode === "dark" ? grey[900] : grey[50]
  };

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === "dark" ? blue[600] : blue[200]
    };
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

export default function Home() {
  const [stepsScript, setStepsScript] = useState(`
  1. 前往https://translate.google.com/?sl=en&tl=zh-TW&text=Jacky&op=translate
  2. 預期要出現'傑基'
  `);
  const [stepsCategory, setStepsCategory] =
    useState<OpenAI.ChatCompletion.Choice | null>(null);
  const [oneLineCodes, setOneLineCodes] = useState<
    OpenAI.ChatCompletion.Choice[]
  >([]);
  const callStepCategoryApi = async (question: string) => {
    try {
      const result = await callOpenAIApi({
        messages: [
          {
            role: "system",
            content:
              "你是一個E2E test的專家, 你擅長分析一段自然語言的每一個步驟屬於什麼category",
          },
          {
            role: "user",
            content: `
              1. 前往https://goodinfo.tw/tw/StockDetail.asp?STOCK_ID=2330
              2. 點選"除權息日程"
              3. 預期page的title要出現"(2330) 台積電 除權除息日程一覽表 - Goodinfo!台灣股市資訊網"
            `,
          },
          {
            role: "assistant",
            content: "1. goto url 2. click 3. expect page title",
          },
          { role: "user", content: question },
        ],
        model: "gpt-4-0125-preview",
      });
      setStepsCategory(result);
    } catch (e) {
      console.log(e);
    }
  };

  const callGetPlayWrightApi = async (obj: {
    text: string;
    category: string;
  }) => {
    try {
      const result = await callOpenAIApi({
        messages: [
          {
            role: "system",
            content:
              "你是一個E2E test的專家, 你擅長根據一句自然語言和一個category, 產生對應的playwright code",
          },
          {
            role: "user",
            content: JSON.stringify({
              text: "1. 前往https://goodinfo.tw/tw/StockDetail.asp?STOCK_ID=2330",
              category: "goto url",
            }),
          },
          {
            role: "assistant",
            content: 'await page.goto("https://irs.thsrc.com.tw/IMINT/");',
          },
          {
            role: "user",
            content: JSON.stringify({
              text: '2. 點選"除權息日程"',
              category: "click",
            }),
          },
          {
            role: "assistant",
            content: "await page.click('text=\"除權息日程\"');",
          },
          {
            role: "user",
            content: JSON.stringify({
              text: '3. 預期page的title要出現"(2330) 台積電 除權除息日程一覽表 - Goodinfo!台灣股市資訊網"',
              category: "expect page title",
            }),
          },
          {
            role: "assistant",
            content:
              'await expect(page).toHaveTitle("(2330) 台積電 除權除息日程一覽表 - Goodinfo!台灣股市資訊網");',
          },
          { role: "user", content: JSON.stringify(obj) },
        ],
        model: "gpt-4-0125-preview",
      });
      setOneLineCodes((prev) => [...prev, result]);
    } catch (e) {
      console.log(e);
    }
  };
  const handleTextAreChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStepsScript(e.target.value);
  };
  const handleGetStepsCategoryButtonClick = () => {
    callStepCategoryApi(stepsScript);
  };
  const handleGetOneLineCodeButtonClick = () => {
    callGetPlayWrightApi({
      text: '4. 預期某個table內有"2023Q3"的字樣',
      category: "expect text",
    });
  };
  return (
    <main>
      <>
        <CssBaseline />
        <Container maxWidth="lg">
          <Box sx={{ height: "100vh" }}>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" gutterBottom>
                Test scenario
              </Typography>
            </Stack>
            <TextareaAutosize
              minRows={10}
              value={stepsScript}
              onChange={handleTextAreChange}
            />
            <Button onClick={handleGetStepsCategoryButtonClick}>
              GetStepsCategory
            </Button>
            <Typography variant="h6" gutterBottom>
              StepsCategory
            </Typography>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {JSON.stringify(stepsCategory)}
                </Typography>
              </CardContent>
            </Card>
            <TextareaAutosize
              minRows={10}
              value={stepsScript}
              onChange={handleTextAreChange}
            />
            <Button onClick={handleGetOneLineCodeButtonClick}>
              GetOneLineCode
            </Button>
            <Typography variant="h6" gutterBottom>
              OneLineCode
            </Typography>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {JSON.stringify(oneLineCodes)}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </>
    </main>
  );
}
