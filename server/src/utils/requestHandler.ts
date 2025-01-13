import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const sendRequest = async (request: AxiosRequestConfig) => {
  try {
    return await axios(request);
  } catch (error) {
    console.log("Axios: ", (error as AxiosError).message);
    throw error as AxiosError;
  }
};
