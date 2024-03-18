import axios from "axios";

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
