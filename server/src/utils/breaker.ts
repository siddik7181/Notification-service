import {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from "axios";
import { sendRequest } from "./requestHandler";
import Job from "../types/job";
import {
  callEmailProvider,
  callSmsProvider,
} from "../config/thirdParty/notification/notifications";
import { Provider } from "./enums";
import Mail from "../types/mail";
import Sms from "../types/sms";

type CircuitOptions = {
  failureCount?: number;
  maxFailureAllowed?: number;
  timeout?: number;
};

export interface CircuitError extends Error {
  message: string;
  isRetryAble: boolean;
}

enum CircuitState {
  CLOSE = "CLOSE",
  OPEN = "OPEN",
  HALF = "HALF",
}

export default class Circuit {
  private state: CircuitState = CircuitState.CLOSE;
  private timeout: number;
  private failureCount: number;
  private maxFailureAllowed: number;
  private timeoutId: NodeJS.Timeout | null = null;
  private job: Job;

  constructor(job: Job, options: CircuitOptions = {}) {
    this.job = job;
    this.failureCount = options.failureCount ?? 0;
    this.maxFailureAllowed = options.maxFailureAllowed ?? 3;
    this.timeout = options.timeout ?? 2000;
  }

  private throwCircuitError(message: string, isRetryAble: boolean) {
    let error: CircuitError = new Error(message) as CircuitError;
    error.isRetryAble = isRetryAble;
    return error;
  }

  private async executeRequest() {
    try {
      const response =
        this.job.type === "sms"
          ? await callSmsProvider(this.job.currentProvider, this.job.data as Sms)
          : await callEmailProvider(this.job.currentProvider, this.job.data as Mail);
      this.resetCircuit();
      return response;
    } catch (error) {
      let isRetryAble = false;
      console.log(`inside circuit error for response!`)
      console.log(error)
      if (isAxiosError(error) && this.isRetryableError(error)) {
        this.recordFailure();
        isRetryAble = true;
      }

      throw this.throwCircuitError(
        `Request failed: ${(error as AxiosError).message}`,
        isRetryAble
      );
    }
  }

  private isRetryableError(error: AxiosError) {
    const statusCode = error.response?.status;
    console.log('Axios Status Code: ', statusCode);
    if (!statusCode) return false;
    return statusCode >= 500 || statusCode === 408 || statusCode === 429;
  }

  private recordFailure() {
    this.failureCount++;
    if (this.failureCount >= this.maxFailureAllowed) {
      this.openCircuit();
    }
  }

  private resetCircuit() {
    this.failureCount = 0;
    this.state = CircuitState.CLOSE;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private openCircuit() {
    if (this.state !== CircuitState.OPEN) {
      this.state = CircuitState.OPEN;
      console.log(
        "Circuit is OPEN. Transitioning to HALF-OPEN in:",
        this.timeout,
        "ms"
      );

      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      this.timeoutId = setTimeout(() => {
        this.state = CircuitState.HALF;
        this.timeoutId = null;
        console.log("Circuit transitioned to HALF-OPEN.");
      }, this.timeout);
    }
  }

  async fire() {
    switch (this.state) {
      case CircuitState.CLOSE:
        return this.executeRequest();

      case CircuitState.HALF:
        try {
          const response = await this.executeRequest();
          this.resetCircuit();
          return response;
        } catch (error) {
          this.openCircuit();
          throw this.throwCircuitError("Provider is still down!", true);
        }

      case CircuitState.OPEN:
        throw this.throwCircuitError("Circuit is Open", true);
    }
  }
  getState() {
    return this.state;
  }
}
