import { getQueuesMessageCount } from "../handlers/publisher";
import { QueueStats } from "../types/response";


export const queueStats = async (): Promise<QueueStats> => {
    console.log('[Stats-Service] ...');
    return await getQueuesMessageCount();
}