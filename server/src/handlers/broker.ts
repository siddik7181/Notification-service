import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Job from "../types/job";
import Circuit, { CircuitError } from "../utils/breaker";


export const broker = async (type: string, job: Job) => {

    if (type !== "email" && type !== "sms") {
        throw new Error('Request Type not supported!');
    }

    console.log(`[Broker]: Type -> ${type}`)

    const startPort: number = type === "sms" ? 8070 : 8090;
    const requests: AxiosRequestConfig[] = [];

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

    if (shouldRetry) {
        console.log(`[Broker]: You should retry this job with id: ${job.id}`);
    }else {
        console.log(`[Broker]: ${job.id}: Your Job Processed, waiting for new jobs..`)
    }
}

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

