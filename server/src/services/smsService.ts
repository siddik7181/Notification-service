import QUEUE from "../handlers";
import { sendToQueue } from "../handlers/publisher";
import Sms from "../types/sms";
import Job from "../types/job";
import { v4 as uuidv4 } from "uuid";
import { JobStatus, Provider } from "../utils/enums";

export const sendSms = async (sms: Sms) => {
  const job: Job = {
    id: uuidv4(),
    type: "sms",
    data: sms,
    currentProvider: Provider.First,
    baseDelay: 500,
    maxDelay: 30000,
    currentDelay: 500,
    maxRetries: 10,
    attempts: 0,
    jitter: 0.25,
    jobStatus: JobStatus.InQueue,
  };

  await sendToQueue(QUEUE.SMS_QUEUE, job);
};
