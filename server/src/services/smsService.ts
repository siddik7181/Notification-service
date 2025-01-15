import QUEUE from "../handlers";
import { sendToQueue } from "../handlers/publisher";
import Sms from "../types/sms";
import Job from "../types/job";
import { createNewJob } from ".";

export const sendSms = async (sms: Sms) => {
  const job: Job = createNewJob("sms", sms);
  await sendToQueue(QUEUE.SMS_QUEUE, job);
};
