import QUEUE from "../handlers";
import { sendToQueue } from "../handlers/publisher";
import Sms from "../types/sms";
import Job from "../types/job";
import { v4 as uuidv4 } from 'uuid';
import RetryOptions from "../types/retry";

export const sendSms = async (sms: Sms, retryOptions?: RetryOptions) => {

  if (!retryOptions) {
    retryOptions = {
      maxRetry: 3,
      baseDelay: 500,
      jitterFactor: 0.5,
      attempts: 0
    }
  }

  const job: Job = {
    id: uuidv4(),
    data: sms,
    options: {
      maxRetry: retryOptions.maxRetry,
      baseDelay: retryOptions.baseDelay,
      jitterFactor: retryOptions.jitterFactor,
      attempts: retryOptions.attempts
    }
  }

  await sendToQueue(QUEUE.SMS_QUEUE, job);
  console.log("[Service]: Requested sms sended to Queue!");
};
