import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.openai.com/v1",
  apiKey: "",
  dangerouslyAllowBrowser: true,
});

export const callOpenAIApi = async (
  params: OpenAI.ChatCompletionCreateParamsNonStreaming
) => {
  const completion = await openai.chat.completions.create(params);
  return completion.choices[0];
};

export const callIsUIChangedApi = async (
  question: string,
  callback: (result: OpenAI.Chat.Completions.ChatCompletion.Choice) => void
) => {
  try {
    const result = await callOpenAIApi({
      messages: [
        {
          role: "system",
          content:
            "你是一個E2E test的專家, 你擅長分析用自然語言描述的每一個步驟的執行後, 畫面是否有變化, 有變化的標示Y, 沒變化的標示N",
        },
        {
          role: "user",
          content: `
            1. 前往https://www.youtube.com/
            2. 在上方的搜尋框輸入"iphone"
            3. 按ENTER鍵
            4. 點選右上角"Filters"按鈕
            5. 點選"Last hour"
            6. 預期不應該出現"hours ago"字樣
          `,
        },
        {
          role: "assistant",
          content: "1. Y\n2. Y\n3. Y\n4. Y\n5. Y\n6. N",
        },
        { role: "user", content: question },
      ],
      model: "gpt-4-turbo-preview",
    });
    callback(result);
  } catch (e) {
    console.log(e);
  }
};

export const callOneStepPlayWrightApi = async (
  text: string,
  callback: (result: OpenAI.Chat.Completions.ChatCompletion.Choice) => void
) => {
  try {
    const result = await callOpenAIApi({
      messages: [
        {
          role: "system",
          content:
            "你是一個E2E test的專家, 你擅長根據一句自然語言, 產生對應的playwright code",
        },
        {
          role: "user",
          content:
            "1. 前往https://goodinfo.tw/tw/StockDetail.asp?STOCK_ID=2330",
        },
        {
          role: "assistant",
          content: 'await page.goto("https://irs.thsrc.com.tw/IMINT/");',
        },
        {
          role: "user",
          content: '2. 點選"除權息日程"',
        },
        {
          role: "assistant",
          content: "await page.click('text=\"除權息日程\"');",
        },
        {
          role: "user",
          content:
            '3. 預期page的title要出現"(2330) 台積電 除權除息日程一覽表 - Goodinfo!台灣股市資訊網"',
        },
        {
          role: "assistant",
          content:
            'await expect(page).toHaveTitle("(2330) 台積電 除權除息日程一覽表 - Goodinfo!台灣股市資訊網");',
        },
        { role: "user", content: text },
      ],
      model: "gpt-4-turbo-preview",
    });
    callback(result);
  } catch (e) {
    console.log(e);
  }
};
