"use client";

import { callIsUIChangedApi, callOneStepPlayWrightApi } from "@/apis/openAIApi";
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

export default function Home() {
  const [stepsScript, setStepsScript] = useState(`
  1. 前往https://goodinfo.tw/tw/StockDetail.asp?STOCK_ID=2330
  2. 點選"除權息日程"
  3. 預期page的title要出現"(2330) 台積電 除權除息日程一覽表 - Goodinfo!台灣股市資訊網"
  `);
  const [isUIChangedQueryResult, setIsUIChangedQueryResult] =
    useState<OpenAI.ChatCompletion.Choice | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [allStepPlayWrightQueryResult, setAllStepPlayWrightQueryResult] =
    useState<OpenAI.ChatCompletion.Choice[]>([]);

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

  const handleGetOneLineCodeButtonClick = () => {
    callOneStepPlayWrightApi(currentStepText, (result) =>
      setAllStepPlayWrightQueryResult((prev) => [...prev, result])
    );
    setCurrentStep((prev) => prev + 1);
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
            <StyledTextareaAutosize
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
                <StyledTypography variant="body2" color="text.secondary">
                  {JSON.stringify(isUIChangedQueryResult, null, 4)}
                </StyledTypography>
              </CardContent>
            </Card>
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
            <Button onClick={handleGetOneLineCodeButtonClick}>
              GetOneLineCode
            </Button>
            <Typography variant="h6" gutterBottom>
              OneLineCode
            </Typography>
            <Card>
              <CardContent>
                <StyledTypography variant="body2" color="text.secondary">
                  {JSON.stringify(allStepPlayWrightQueryResult, null, 4)}
                </StyledTypography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </>
    </main>
  );
}
