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
