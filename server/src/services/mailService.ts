import { sendToQueue } from "../handlers/publisher";
import Mail from "../types/mail";
import Job from "../types/job";
import QUEUE from "../handlers";
import { createNewJob } from ".";
// Test to check if new job is sended to queue
export const sendMail = async (mail: Mail) => {
  const job: Job = createNewJob("email", mail); // Mock this function 
  await sendToQueue(QUEUE.MAIL_QUEUE, job);
};
