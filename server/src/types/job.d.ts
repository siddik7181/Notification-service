import Mail from "./mail";
import Sms from "./sms";

type Job = {
  id: string;
  data: Mail | Sms;
  providerNumber: number;
  jobStatus: "InQueue" | "Running" | "ServerError" | "ClientError" | "Passed";

  baseDelay: number;
  maxDelay: number;
  currentDelay: number;
  jitter: number;
  maxRetries: number;
  attempts: number;
};

export default Job;
