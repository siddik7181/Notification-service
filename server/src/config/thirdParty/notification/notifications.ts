import axios, { AxiosError } from "axios";
import { emailConfig, smsConfig } from ".";
import Mail from "../../../types/mail";
import Sms from "../../../types/sms";
import { Provider } from "../../../utils/enums";

export const callEmailProvider = async (provider: Provider, data: Mail) => {
  const config = emailConfig[provider];
  const endpoint = `http://${config.host}:${config.port}/api/${config.url}`;
  return await axios.post(endpoint, data);
};

export const callSmsProvider = async (provider: Provider, data: Sms) => {
  const config = smsConfig[provider];
  const endpoint = `http://${config.host}:${config.port}/api/${config.url}`;
  return await axios.post(endpoint, data);
};
