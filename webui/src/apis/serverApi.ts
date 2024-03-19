import axios from "axios";
import OpenAI from "openai";

export const callGetSnapshot = async (code: string) => {
  const response = await axios.get<string>("/api/snapshot", {
    params: {
      code,
    },
    paramsSerializer: (params) => {
      // Sample implementation of query string building
      let result = "";
      Object.keys(params).forEach((key) => {
        result += `${key}=${encodeURIComponent(params[key])}&`;
      });
      return result.substring(0, result.length - 1);
    },
    responseType: "text", // specify that we want to receive data as text
  });
  return response.data;
};

export const callPostOpenAI = async (params: OpenAI.ChatCompletionCreateParamsNonStreaming) => {
  const response = await axios.post<OpenAI.Chat.Completions.ChatCompletion.Choice>(
    "/api/openai", { params: params }, { headers: { 'Content-Type': 'application/json' } });
  return response.data;
}