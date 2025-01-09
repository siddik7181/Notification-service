

type RetryOptions = {
    maxRetry: number;
    baseDelay: number;
    jitterFactor: number;
    attempts: number;
}

export default RetryOptions;