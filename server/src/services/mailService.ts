import { sendToQueue } from "../handlers/publisher";
import Mail from "../types/mail";
import Job from "../types/job";
import { v4 as uuidv4 } from 'uuid';
import QUEUE from "../handlers";

export const sendMail = async (mail: Mail) => {

  const job: Job = {
    id: uuidv4(),
    data: mail
  }

  await sendToQueue(QUEUE.MAIL_QUEUE, job);
  console.log("[Service]: Requested mail sended to Queue!");
};
