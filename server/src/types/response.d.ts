type RequestResponse = {
  isRetryAble: boolean;
  isClientError: boolean;
  isCircuitError?: boolean;
};

export type QueueStats = {
  messageCount: {
    dlq: number;
    mail: number;
    sms: number;
  };
  consumerCount: {
    dlq: number;
    mail: number;
    sms: number;
  };
};


export default RequestResponse;
