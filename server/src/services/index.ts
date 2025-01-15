import { v4 as uuidv4 } from "uuid";
import { currentLessBusyEmailProvider } from "../config/thirdParty/provider";
import Job from "../types/job";
import { randomDelayLessThenMs, randomLessThen1 } from "../utils/timer";
import { JobStatus } from "../utils/enums";
import Mail from "../types/mail";
import Sms from "../types/sms";

export const createNewJob = (type: "email" | "sms", data: Mail | Sms): Job => {
    const job: Job = {
      id: uuidv4(),
      type: type,
      data: data,
      currentProvider: currentLessBusyEmailProvider(),
      baseDelay: randomDelayLessThenMs(500),
      maxDelay: randomDelayLessThenMs(20000),
      currentDelay: randomDelayLessThenMs(500),
      maxRetries: randomDelayLessThenMs(10),
      attempts: 0,
      jitter: randomLessThen1(),
      jobStatus: JobStatus.InQueue,
    };
    return job;
  }
  