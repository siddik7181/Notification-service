import { sendToQueue } from "../handlers/publisher";
import Mail from "../types/mail";
import Job from "../types/job";
import { v4 as uuidv4 } from "uuid";
import QUEUE from "../handlers";
import { JobStatus, Provider } from "../utils/enums";

export const sendMail = async (mail: Mail) => {
  const job: Job = {
    id: uuidv4(),
    type: "email",
    data: mail,
    currentProvider: Provider.First,
    baseDelay: 500,
    maxDelay: 30000,
    currentDelay: 500,
    maxRetries: 5,
    attempts: 0,
    jitter: 0.25,
    jobStatus: JobStatus.InQueue,
  };
  await sendToQueue(QUEUE.MAIL_QUEUE, job);
  console.log("[Service]: Requested mail sended to Queue!");
};
