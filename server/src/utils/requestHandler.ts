
import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const sendRequest = async (request: AxiosRequestConfig) => {
    try {
        return await axios(request);
    } catch (error) {
        throw error as AxiosError;
    }
}