"use client";

import {
  callGetCodeWithTextAndSnapshotApi,
  callGetCodeWithTextApi,
  callIsUIChangedApi,
} from "@/apis/openAIApi";
import { fill } from "@/snapshot/temp";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import OpenAI from "openai";
import { useMemo, useState } from "react";
import StyledTextareaAutosize from "./components/StyledTextareaAutosize";

const StyledTypography = styled(Typography)(
  `
  white-space: pre-wrap;
  `
);

const StyledBox = styled(Box)(
  `
  width: 100%;
  max-height: 300px;
  overflow: auto;
  `
);

export default function Home() {
  const [stepsScript, setStepsScript] = useState(`
  1. 前往https://goodinfo.tw/tw/StockDetail.asp?STOCK_ID=2330
  2. 點選"除權息日程"
  3. 預期page的title要出現"(2330) 台積電 除權除息日程一覽表 - Goodinfo!台灣股市資訊網"
  `);
  const [isUIChangedQueryResult, setIsUIChangedQueryResult] =
    useState<OpenAI.ChatCompletion.Choice | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [previousSnapshot, setPreviousSnapshot] = useState<string>("1");
  const [allStepPlayWrightQueryResult, setAllStepPlayWrightQueryResult] =
    useState<OpenAI.ChatCompletion.Choice[]>([]);
  const [allCode, setAllCode] = useState(`
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();
  `);

  const handleTextAreChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStepsScript(e.target.value);
  };
  const handleGetStepsCategoryButtonClick = () => {
    callIsUIChangedApi(stepsScript, (result) =>
      setIsUIChangedQueryResult(result)
    );
  };
  const currentStepText = useMemo(
    () => stepsScript.trim().split("\n")[currentStep],
    [stepsScript, currentStep]
  );
  const isUIChangedAfterCurrentStep = useMemo(() => {
    const nextStep = currentStep + 1;
    const isUIChangedAfterSteps = isUIChangedQueryResult?.message.content
      ?.trim()
      .split("\n");
    if (isUIChangedAfterSteps && isUIChangedAfterSteps.length > nextStep) {
      return isUIChangedAfterSteps[nextStep] === "Y";
    }
    return false;
  }, [isUIChangedQueryResult, currentStep]);
  const currentStepObject = useMemo(
    () => ({
      text: currentStepText,
      isUIChanged: isUIChangedAfterCurrentStep,
    }),
    [isUIChangedAfterCurrentStep, currentStepText]
  );

  const handleGetCodeWithTextButtonClick = async () => {
    callGetCodeWithTextApi(currentStepText, (result) => {
      setAllStepPlayWrightQueryResult((prev) => [...prev, result]);
      setAllCode((prev) => `${prev}\n${result.message.content}`);
    });
    setCurrentStep((prev) => prev + 1);
  };
  const handleGetCodeWithTextAndSnapshotButtonClick = () => {
    callGetCodeWithTextAndSnapshotApi(
      {
        text: "3. 在上方的搜尋框按ENTER鍵",
        snapshot: fill,
      },
      (result) => setAllStepPlayWrightQueryResult((prev) => [...prev, result])
    );
    setCurrentStep((prev) => prev + 1);
  };
  return (
    <main>
      <>
        <CssBaseline />
        <Container maxWidth="lg">
          <Box sx={{ height: "100vh" }}>
            <Stack spacing={1}>
              <Typography variant="h6" gutterBottom>
                Test scenario
              </Typography>
              <StyledTextareaAutosize
                minRows={10}
                value={stepsScript}
                onChange={handleTextAreChange}
              />
              <Button onClick={handleGetStepsCategoryButtonClick}>
                Get the UI will change after the step
              </Button>
              <Typography variant="h6" gutterBottom>
                Query result: The UI will change after the step
              </Typography>
              <Card>
                <CardContent>
                  <StyledTypography variant="body2" color="text.secondary">
                    {JSON.stringify(isUIChangedQueryResult, null, 4)}
                  </StyledTypography>
                </CardContent>
              </Card>

              <Stack direction="row" alignItems="center">
                <StyledBox>
                  <Typography variant="h6" gutterBottom>
                    Current Step
                  </Typography>
                  <Card>
                    <CardContent>
                      <StyledTypography variant="body2" color="text.secondary">
                        {currentStepText}
                      </StyledTypography>
                    </CardContent>
                  </Card>
                </StyledBox>
                <StyledBox>
                  <Typography variant="h6" gutterBottom>
                    Previous Snapshot
                  </Typography>
                  <Card>
                    <CardContent>
                      <StyledTypography variant="body2" color="text.secondary">
                        {previousSnapshot}
                      </StyledTypography>
                    </CardContent>
                  </Card>
                </StyledBox>
              </Stack>

              <Button onClick={handleGetCodeWithTextButtonClick}>
                Get code with text
              </Button>
              <Button onClick={handleGetCodeWithTextAndSnapshotButtonClick}>
                Get code with text & snapshot
              </Button>
              <Stack direction="row" alignItems="center">
                <StyledBox>
                  <Typography variant="h6" gutterBottom>
                    Each steps query result
                  </Typography>
                  <Card>
                    <CardContent>
                      <StyledTypography variant="body2" color="text.secondary">
                        {JSON.stringify(allStepPlayWrightQueryResult, null, 4)}
                      </StyledTypography>
                    </CardContent>
                  </Card>
                </StyledBox>
                <StyledBox>
                  <Card>
                    <CardContent>
                      <StyledTypography variant="body2" color="text.secondary">
                        {allCode}
                      </StyledTypography>
                    </CardContent>
                  </Card>
                </StyledBox>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </>
    </main>
  );
}
