
import Job from "../types/job";
import { sendToQueue } from "./publisher";
import QUEUE from ".";
import { calcDelay, getNextNotificationProvider, handleRequests } from "../utils/helper";
import RequestResponse from "../types/response";
import { JobStatus } from "../utils/enums";

export const broker = async (QUEUE_NAME: string, job: Job) => {
  // if (type !== "email" && type !== "sms") {
  //   throw new Error("Request Type not supported!");
  // }

  // console.log(`[Broker]: Type -> ${type}`);

  // const startPort: number = type === "sms" ? 8070 : 8090;
  // const QUEUE_NAME: string =
  //   type === "sms" ? QUEUE.SMS_QUEUE : QUEUE.MAIL_QUEUE;

  // const request: AxiosRequestConfig = {
  //   baseURL: `http://${PROVIDERHOST}:${
  //     startPort + job.currentProvider
  //   }/api/${type}`,
  //   url: `/provider${job.currentProvider}`,
  //   method: "post",
  //   data: job.data,
  // };



  job.jobStatus = JobStatus.Running;
  const { isRetryAble, isClientError }: RequestResponse = await handleRequests(job);
  job.attempts += 1;

  if (!isRetryAble) {
    if (isClientError) {
      job.jobStatus = JobStatus.ClientError;
    } else {
      job.jobStatus = JobStatus.Passed;
    }
    console.log(
      `[Broker]: ${job.id}: Your Job Processed, waiting for new jobs..`
    );
    return;
  }

  if (job.attempts >= job.maxRetries) {
    // job.jobStatus = "ServerError";
    job.jobStatus = JobStatus.ServerError;
    console.log(`[Broker]: ${job.id} failed even after retrying...`);
    // add to the DQL queue again.
    await sendToQueue(QUEUE.DEAD_LETTER_QUEUE, job);
    return;
  }

  job.jobStatus = JobStatus.InQueue;
  console.log(`Retry left: ${job.maxRetries - job.attempts}...`);
  console.log("Job Can Be retryed!");

  // change the providernumber..!!!
  job.currentProvider = getNextNotificationProvider(job.currentProvider);

  // add to the same queue again. in some time.
  const delayInMs: number = calcDelay(
    job.baseDelay,
    job.attempts,
    job.maxDelay,
    job.jitter
  );
  job.currentDelay = delayInMs;

  setTimeout(async () => {
    await sendToQueue(QUEUE_NAME, job);
  }, delayInMs);
};
