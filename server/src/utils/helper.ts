import RequestResponse from "../types/response";
import Circuit, { CircuitError } from "./breaker";
import Job from "../types/job";
import { Provider } from "./enums";

export const calcDelay = (
  baseDelay: number,
  attempts: number,
  maxDelay: number,
  jitterFactor: number
): number => {
  const exponentialDelay = Math.min(
    baseDelay * Math.pow(2, attempts),
    maxDelay
  );

  const jitter = exponentialDelay * jitterFactor * (Math.random() * 2 - 1);
  return Math.min(exponentialDelay + jitter, maxDelay);
};

export const handleRequests = async (job: Job): Promise<RequestResponse> => {
  const circuit = new Circuit(job);
  try {
    await circuit.fire();
    console.log(
      `[Request Succes By Provider: ${job.currentProvider} has processed`
    );
    return {
      isRetryAble: false,
      isClientError: false,
    };
  } catch (e) {
    const error = e as CircuitError;
    console.log(
      `[Request Failed By Provider: ${job.currentProvider}: ${error.message}`
    );
    return {
      isRetryAble: error.isRetryAble,
      isClientError: !error.isRetryAble,
    };
  }
};

export const getNextNotificationProvider = (
  currentProvider: Provider
): Provider => {
  if (currentProvider === Provider.First) return Provider.Second;
  else if (currentProvider === Provider.Second) return Provider.Third;
  return Provider.First;
};
