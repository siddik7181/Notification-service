import RequestResponse from "../types/response";
import Job from "../types/job";
import { Provider } from "./enums";
import Sms from "../types/sms";
import Mail from "../types/mail";
import { CircuitError } from "./breaker";
import { handleEmailRequest } from "../config/thirdParty/provider/email";
import { handleSmsRequest } from "../config/thirdParty/provider/sms";

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
  try {
    await makeRequest(job.type, job.currentProvider, job.data);
    console.log(
      `[Request Succed By Provider${job.currentProvider + 1}`
    );
    return {
      isRetryAble: false,
      isClientError: false,
    };
  } catch (e) {
    const error = e as CircuitError;
    console.log(
      `[Request Failed By Provider${job.currentProvider + 1}: ${error.message}`
    );
    return {
      isRetryAble: error.isRetryAble,
      isClientError: !error.isRetryAble,
      isCircuitError: error?.isCircuitError
    };
  }
};

const makeRequest = async (type: string, provider: Provider,  data: Mail | Sms) => {
  if(type === "email") {
    await handleEmailRequest(provider, data as Mail);
    return;
  }
  await handleSmsRequest(provider, data as Sms);
}




