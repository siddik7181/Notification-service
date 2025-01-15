import Job from "../types/job";
import { sendToQueue } from "./publisher";
import QUEUE from ".";
import {
  calcDelay,
  getNextNotificationProvider,
  handleRequests,
} from "../utils/helper";
import RequestResponse from "../types/response";
import { JobStatus } from "../utils/enums";

export const broker = async (QUEUE_NAME: string, job: Job) => {

  job.jobStatus = JobStatus.Running;
  const { isRetryAble, isClientError }: RequestResponse = await handleRequests(
    job
  );
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
    job.jobStatus = JobStatus.ServerError;
    console.log(`[Broker]: ${job.id} failed even after retrying...`);
    // add to the DQL queue again.
    await sendToQueue(QUEUE.DEAD_LETTER_QUEUE, job);
    return;
  }

  job.jobStatus = JobStatus.InQueue;
  console.log(`Retry left: ${job.maxRetries - job.attempts}...`);

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
