import { publishMail } from "../handlers/publisher";
import Mail from "../types/mail";

export const sendMail = async (mail: Mail) => {
  await publishMail(mail);
  return "Mail Sended!";
};
