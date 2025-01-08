import { publishSms } from "../handlers/publisher";
import Sms from "../types/sms";

export const sendSms = async (sms: Sms) => {
  await publishSms(sms);
  return "Sms Sended!";
};
