import { sendToQueue } from "../handlers/publisher";
import Mail from "../types/mail";
import Job from "../types/job";
import { v4 as uuidv4 } from 'uuid';
import QUEUE from "../handlers";
import RetryOptions from "../types/retry";

export const sendMail = async (mail: Mail, retryOptions?: RetryOptions) => {

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
    data: mail,
    options: {
      maxRetry: retryOptions.maxRetry,
      baseDelay: retryOptions.baseDelay,
      jitterFactor: retryOptions.jitterFactor,
      attempts: retryOptions.attempts
    }
  }

  await sendToQueue(QUEUE.MAIL_QUEUE, job);
  console.log("[Service]: Requested mail sended to Queue!");
};
