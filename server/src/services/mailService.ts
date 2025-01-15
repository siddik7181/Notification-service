import { sendToQueue } from "../handlers/publisher";
import Mail from "../types/mail";
import Job from "../types/job";
import QUEUE from "../handlers";
import { createNewJob } from ".";

export const sendMail = async (mail: Mail) => {
  const job: Job = createNewJob("email", mail);
  await sendToQueue(QUEUE.MAIL_QUEUE, job);
};
