import { getQueuesMessageCount } from "../handlers/publisher";
import { QueueStats } from "../types/response";

export const queueStats = async (): Promise<QueueStats> => {
  return await getQueuesMessageCount();
};
