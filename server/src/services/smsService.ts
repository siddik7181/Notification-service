import QUEUE from "../handlers";
import { sendToQueue } from "../handlers/publisher";
import Sms from "../types/sms";
import Job from "../types/job";
import { v4 as uuidv4 } from "uuid";

export const sendSms = async (sms: Sms) => {
  const job: Job = {
    id: uuidv4(),
    data: sms,
    providerNumber: 0, // 0, 1, 2, good for module by 3.
    baseDelay: 500,
    maxDelay: 30000,
    currentDelay: 500,
    maxRetries: 5,
    attempts: 0,
    jitter: 0.25,
    jobStatus: "InQueue",
  };

  await sendToQueue(QUEUE.SMS_QUEUE, job);
  console.log("[Service]: Requested sms sended to Queue!");
};
