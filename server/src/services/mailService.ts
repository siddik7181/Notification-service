import { sendToQueue } from "../handlers/publisher";
import Mail from "../types/mail";
import Job from "../types/job";
import { v4 as uuidv4 } from "uuid";
import QUEUE from "../handlers";
import { JobStatus } from "../utils/enums";
import { currentLessBusyEmailProvider } from "../config/thirdParty/provider";

export const sendMail = async (mail: Mail) => {
  const job: Job = {
    id: uuidv4(),
    type: "email",
    data: mail,
    currentProvider: currentLessBusyEmailProvider(),
    baseDelay: 500,
    maxDelay: 30000,
    currentDelay: 500,
    maxRetries: 10,
    attempts: 0,
    jitter: 0.25,
    jobStatus: JobStatus.InQueue,
  };
  await sendToQueue(QUEUE.MAIL_QUEUE, job);
};
