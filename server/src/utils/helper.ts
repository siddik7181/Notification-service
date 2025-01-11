import { AxiosRequestConfig } from "axios";
import RequestResponse from "../types/response";
import Circuit, { CircuitError } from "./breaker";

export const calcDelay = (baseDelay: number, attempts: number, maxDelay: number, jitterFactor: number): number => {
    
    const exponentialDelay = Math.min(
        baseDelay * Math.pow(2, attempts),
        maxDelay
    );
    
    const jitter = exponentialDelay * jitterFactor * (Math.random() * 2 - 1);
    return Math.min(exponentialDelay + jitter, maxDelay);
}

export const handleRequests = async (request: AxiosRequestConfig): Promise<RequestResponse> => {
    const circuit = new Circuit(request);
    try {
        await circuit.fire();
        console.log(`[Request Succes By ${request.baseURL}${request.url}]: has processed`);
        return { 
            isRetryAble : false, 
            isClientError : false
        };

    } catch (e) {
        const error = (e as CircuitError);
        console.log(`[Handling Requests Error]: ${error.message}`)
        return {
            isRetryAble : error.isRetryAble, 
            isClientError : !error.isRetryAble
        }
    }
}