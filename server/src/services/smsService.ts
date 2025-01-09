import QUEUE from "../handlers";
import { sendToQueue } from "../handlers/publisher";
import Sms from "../types/sms";
import Job from "../types/job";
import { v4 as uuidv4 } from 'uuid';

export const sendSms = async (sms: Sms) => {
  const job: Job = {
    id: uuidv4(),
    data: sms
  }

  await sendToQueue(QUEUE.SMS_QUEUE, job);
  console.log("[Service]: Requested sms sended to Queue!");
};
