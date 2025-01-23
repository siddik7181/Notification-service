import Job from "../types/job";
import { sendToQueue } from "./publisher";
import QUEUE from ".";
import {
  calcDelay,
  handleRequests,
} from "../utils/helper";
import RequestResponse from "../types/response";
import { JobStatus } from "../utils/enums";
import { currentLessProvider, deallocateProvider } from "../config/thirdParty/provider";
// Test whether the broker can manage the jobs from queues in a least connection way.. also check every functionality like retry, allocating Provider & deallocateProvider works fine.
export const broker = async (QUEUE_NAME: string, job: Job) => {
  // console.log("[broker]: come to me---> ", job);
  job.jobStatus = JobStatus.Running;
  const { isRetryAble, isClientError, isCircuitError }: RequestResponse = await handleRequests(
    job
  );
  if (!isCircuitError) {
    job.attempts += 1;
  }
  deallocateProvider(job.type, job.currentProvider);

  if (!isRetryAble) {
    if (isClientError) {
      job.jobStatus = JobStatus.ClientError;
    } else {
      job.jobStatus = JobStatus.Passed;
    }
    console.log(
      `[Broker]: ${job.id}: Your Job Processed with status: ${job.jobStatus}, waiting for new jobs..`
    );
    return;
  }

  if (job.attempts >= job.maxRetries) {
    job.jobStatus = JobStatus.ServerError;
    // add to the DQL queue again.
    await sendToQueue(QUEUE.DEAD_LETTER_QUEUE, job);
    return;
  }

  job.jobStatus = JobStatus.InQueue;
  console.log(`[Broker]: Retry left for ${job.id}: ${job.maxRetries - job.attempts}...`);

  // change the providernumber..!!!
  job.currentProvider = currentLessProvider(job.type);

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
