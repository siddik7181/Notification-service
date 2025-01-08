import Job from "../types/job";
import Mail from "../types/mail";
import Sms from "../types/sms";

import { v4 as uuidv4 } from 'uuid';

export const mailQueue: Job[] = [];
export const smsQueue: Job[] = [];

export const publishMail = async(mail: Mail) => {
    const job: Job = {
        id: uuidv4(),
        data: mail
    }
    mailQueue.push(job);
}
export const publishSms = async(sms: Sms) => {
    const job: Job = {
        id: uuidv4(),
        data: sms
    }
    smsQueue.push(job);
}

export const mailQueueStatus = async() => {
    return mailQueue.length;
}
export const smsQueueStatus = async() => {
    return smsQueue.length;
}