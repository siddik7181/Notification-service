import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Job from "../types/job";
import Circuit, { CircuitError } from "../utils/breaker";
import { sendToQueue } from "./publisher";
import QUEUE from ".";


export const broker = async (type: string, job: Job) => {

    if (type !== "email" && type !== "sms") {
        throw new Error('Request Type not supported!');
    }

    console.log(`[Broker]: Type -> ${type}`)

    const startPort: number = type === "sms" ? 8070 : 8090;
    const requests: AxiosRequestConfig[] = [];
    const QUEUE_NAME: string = type === "sms" ? QUEUE.SMS_QUEUE : QUEUE.MAIL_QUEUE;

    [1,2,3].forEach(inc => {
        let request: AxiosRequestConfig = {
            baseURL: `http://localhost:${startPort + inc}/api/${type}`,
            url: `/provider${inc}`,
            method: 'post',
            data: job.data
        }
        requests.push(request);
    });

    const shouldRetry: boolean = await handleRequests(requests);

    if (!shouldRetry) {
        console.log(`[Broker]: ${job.id}: Your Job Processed, waiting for new jobs..`);
        return;
    }
    
    console.log(`Retry left: ${job.options.maxRetry}`)

    
    if (job.options.maxRetry > 0) {
        console.log('Job Can Be retryed!');
        job.options.maxRetry -= 1;
        job.options.attempts += 1;
        
        
        // add to the same queue again. in some time.
        const delayInMs = calculateExponentialJitter(
            job.options.baseDelay,
            job.options.jitterFactor,
            job.options.attempts
        );
        setTimeout(async () => {
            await sendToQueue(QUEUE_NAME, job);
        }, delayInMs);
        
    }else {
        console.log(`[${job.id}]: Can't process now, sending to DLQ`);
        // add to the DQL queue again.
        await sendToQueue(QUEUE.DEAD_LETTER_QUEUE, job);
    }
}

const calculateExponentialJitter = (baseDelay: number, jitterFactor: number, attempt: number): number => {
    const MAX_DELAY = 20000; // 20sec.
    const exponentialDelay = baseDelay * Math.pow(2, attempt);
    const randomFactor = Math.random();
    return Math.min(exponentialDelay + Math.floor(randomFactor * jitterFactor), MAX_DELAY);
};


const handleRequests = async (requests: AxiosRequestConfig[]): Promise<boolean> => {
    let isRetryAble = false;

    for (const request of requests) {
        console.log(`Processing with ${request.baseURL}${request.url}..`);
        const circuit = new Circuit(request);
        try {
            await circuit.fire();
            console.log(`${request.baseURL}${request.url} has processed`);
            return false;
        } catch (e) {
            const error = (e as CircuitError);
            isRetryAble = error.isRetryAble;
            console.log(`[Handling Requests Error]: ${error.message}`)
        }
    }

    return isRetryAble;

}

