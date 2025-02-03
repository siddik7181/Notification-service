import { v4 as uuidv4 } from "uuid";
import { currentLessProvider } from "../config/thirdParty/provider";
import Job from "../types/job";
import { JobStatus } from "../utils/enums";
import Mail from "../types/mail";
import Sms from "../types/sms";

export const createNewJob = (type: "email" | "sms", data: Mail | Sms): Job => {
    const job: Job = {
      id: uuidv4(),
      type: type,
      data: data,
      currentProvider: currentLessProvider(type),
      baseDelay: 100,
      maxDelay: 20000,
      currentDelay: 100,
      maxRetries: 8,
      attempts: 0,
      jitter: 0.25,
      jobStatus: JobStatus.InQueue,
    };
    return job;
  }
  