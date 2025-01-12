import { AxiosRequestConfig } from "axios";
import Job from "../types/job";
import { sendToQueue } from "./publisher";
import QUEUE from ".";
import { calcDelay, handleRequests } from "../utils/helper";
import  RequestResponse from "../types/response";
import { PROVIDERHOST } from "../config/secret";

export const broker = async (type: string, job: Job) => {

    if (type !== "email" && type !== "sms") {
        throw new Error('Request Type not supported!');
    }

    console.log(`[Broker]: Type -> ${type}`)

    const startPort: number = type === "sms" ? 8070 : 8090;
    const QUEUE_NAME: string = type === "sms" ? QUEUE.SMS_QUEUE : QUEUE.MAIL_QUEUE;

    const request: AxiosRequestConfig = {
        baseURL: `http://${PROVIDERHOST}:${startPort + job.providerNumber + 1}/api/${type}`,
        url: `/provider${job.providerNumber + 1}`,
        method: 'post',
        data: job.data
    }

    job.jobStatus = 'Running';
    const { isRetryAble, isClientError }: RequestResponse = await handleRequests(request);
    job.attempts += 1;

    if (!isRetryAble) {
        if (isClientError) {
            job.jobStatus = "ClientError";
        }else {
            job.jobStatus = "Passed"
        }
        console.log(`[Broker]: ${job.id}: Your Job Processed, waiting for new jobs..`);
        return;
    }

    if (job.attempts >= job.maxRetries) {
        job.jobStatus = 'ServerError';
        console.log(`[Broker]: ${job.id} failed even after retrying...`);
        // add to the DQL queue again.
        await sendToQueue(QUEUE.DEAD_LETTER_QUEUE, job);
        return;
    }
    
    job.jobStatus = 'InQueue';
    console.log(`Retry left: ${job.maxRetries - job.attempts}...`)
    console.log('Job Can Be retryed!');

    // change the providernumber..!!!
    job.providerNumber = (job.providerNumber + 1) % 3;
    
    // add to the same queue again. in some time.
    const delayInMs: number = calcDelay(job.baseDelay, job.attempts, job.maxDelay, job.jitter);
    job.currentDelay = delayInMs;

    setTimeout(async () => {
        await sendToQueue(QUEUE_NAME, job);
    }, delayInMs);
    
}