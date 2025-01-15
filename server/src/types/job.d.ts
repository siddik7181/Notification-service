import { JobStatus, Provider } from "../utils/enums";
import Mail from "./mail";
import Sms from "./sms";

type Job = {
  type: "email" | "sms";
  id: string;
  data: Mail | Sms;
  currentProvider: Provider;
  jobStatus: JobStatus;
  baseDelay: number;
  maxDelay: number;
  currentDelay: number;
  jitter: number;
  maxRetries: number;
  attempts: number;
};

export default Job;
