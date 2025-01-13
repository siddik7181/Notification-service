import { sendToQueue } from "../handlers/publisher";
import Mail from "../types/mail";
import Job from "../types/job";
import { v4 as uuidv4 } from "uuid";
import QUEUE from "../handlers";

export const sendMail = async (mail: Mail) => {
  const job: Job = {
    id: uuidv4(),
    data: mail,
    providerNumber: 0, // 0, 1, 2, good for module by 3.
    baseDelay: 500,
    maxDelay: 30000,
    currentDelay: 500,
    maxRetries: 5,
    attempts: 0,
    jitter: 0.25,
    jobStatus: "InQueue",
  };

  await sendToQueue(QUEUE.MAIL_QUEUE, job);
  console.log("[Service]: Requested mail sended to Queue!");
};
