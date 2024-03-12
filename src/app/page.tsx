"use client";

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
              <Button>Generate</Button>
            </Stack>
            <TextareaAutosize
              minRows={10}
              placeholder=""
              defaultValue={`
              1. 前往https://goodinfo.tw/tw/StockDetail.asp?STOCK_ID=2330
              2. 點選'除權息日程'
              3. 預期要出現'2330 台積電 除權息日程一覽表'
              `}
            />
            <Typography variant="h6" gutterBottom>
              Result
            </Typography>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary"></Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </>
    </main>
  );
}
