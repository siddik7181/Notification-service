import RequestResponse from "../types/response";
import Job from "../types/job";
import { Provider } from "./enums";
import Sms from "../types/sms";
import Mail from "../types/mail";
import { EmailProviderA, EmailProviderB, EmailProviderC } from "../config/thirdParty/provider/email";
import { SmsProviderA, SmsProviderB, SmsProviderC } from "../config/thirdParty/provider/sms";
import { CircuitError, CircuitState } from "./breaker";

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

const makeRequest = async (type: string, provider: Provider,  data: Mail | Sms) => {
  if (type === "email") {
    if (provider === Provider.First) {
      const emailProvider = new EmailProviderA(data as Mail);
      if (emailProvider.isProviderRunning() === CircuitState.OPEN) {
        throw ({
          message: "EmailProviderA Circuit Is Still Open!",
          isRetryAble: true
        });
      }
      await emailProvider.call();
    }else if (provider === Provider.Second) {
      const emailProvider = new EmailProviderB(data as Mail);
      if (emailProvider.isProviderRunning() === CircuitState.OPEN) {
        throw ({
          message: "EmailProviderB Circuit Is Still Open!",
          isRetryAble: true
        });
      }
      await emailProvider.call();      
    }else {
      const emailProvider = new EmailProviderC(data as Mail);
      if (emailProvider.isProviderRunning() === CircuitState.OPEN) {
        throw ({
          message: "EmailProviderC Circuit Is Still Open!",
          isRetryAble: true
        });
      }
      await emailProvider.call();
    }
  }else {
    if (provider === Provider.First) {
      const smsProvider = new SmsProviderA(data as Sms);
      if (smsProvider.isProviderRunning() === CircuitState.OPEN) {
        throw ({
          message: "SmsProviderA Circuit Is Still Open!",
          isRetryAble: true
        });
      }
      await smsProvider.call();
    }else if (provider === Provider.Second) {
      const smsProvider = new SmsProviderB(data as Sms);
      if (smsProvider.isProviderRunning() === CircuitState.OPEN) {
        throw ({
          message: "SmsProviderB Circuit Is Still Open!",
          isRetryAble: true
        });
      }
      await smsProvider.call();      
    }else {
      const smsProvider = new SmsProviderC(data as Sms);
      if (smsProvider.isProviderRunning() === CircuitState.OPEN) {
        throw ({
          message: "SmsProviderC Circuit Is Still Open!",
          isRetryAble: true
        });
      }
      await smsProvider.call();
    }
  }
}

export const getNextNotificationProvider = (
  currentProvider: Provider
): Provider => {
  if (currentProvider === Provider.First) return Provider.Second;
  else if (currentProvider === Provider.Second) return Provider.Third;
  return Provider.First;
};
