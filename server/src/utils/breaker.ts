import axios, { AxiosError, AxiosRequestConfig, isAxiosError } from "axios";

type CircuitOptions = {
  failureCount?: number;
  maxFailureAllowed?: number;
  timeout?: number;
};

export interface CircuitError extends Error {
  message: string;
  isRetryAble: boolean;
}

export enum CircuitState {
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

  constructor(options: CircuitOptions = {}) {
    this.failureCount = options.failureCount ?? 0;
    this.maxFailureAllowed = options.maxFailureAllowed ?? 3;
    this.timeout = options.timeout ?? 2000;
  }

  private throwCircuitError(message: string, isRetryAble: boolean) {
    let error: CircuitError = new Error(message) as CircuitError;
    error.isRetryAble = isRetryAble;
    return error;
  }

  private async executeRequest(config: AxiosRequestConfig) {
    try {
      const response = await axios.request(config);
      this.resetCircuit();
      return response;
    } catch (error) {
      let isRetryAble = false;
      if (isAxiosError(error) && this.isRetryableError(error)) {
        this.recordFailure();
        isRetryAble = true;
      }
      console.log(`[${config.url}], This Provider Failed : ${this.failureCount}`);
      throw this.throwCircuitError(
        `Request failed: ${(error as AxiosError).message}`,
        isRetryAble
      );
    }
  }

  private isRetryableError(error: AxiosError) {
    const statusCode = error.response?.status;
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

      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      this.timeoutId = setTimeout(() => {
        this.state = CircuitState.HALF;
        this.timeoutId = null;
      }, this.timeout);
    }
  }

  async fire(request: AxiosRequestConfig) {
    switch (this.state) {
      case CircuitState.CLOSE:
        return this.executeRequest(request);

      case CircuitState.HALF:
        try {
          const response = await this.executeRequest(request);
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
