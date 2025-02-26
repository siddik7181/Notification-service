import QUEUE from ".";
import { RABBITMQURL } from "../config/secret";
import Job from "../types/job";
import amqp from "amqplib";

const RABBITMQ_URL = `amqp://${RABBITMQURL}`;
// Test whether sendToQueue is working fine for the given queue name & message
export const sendToQueue = async (queueName: string, message: Job) => {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  await channel.close();
  await connection.close();
};
// Test whether it returns the stats of mainQueue's & DLQ
export const getQueuesMessageCount = async () => {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE.DEAD_LETTER_QUEUE, { durable: true });
  await channel.assertQueue(QUEUE.MAIL_QUEUE, { durable: true });
  await channel.assertQueue(QUEUE.SMS_QUEUE, { durable: true });

  const dlq = await channel.checkQueue(QUEUE.DEAD_LETTER_QUEUE);
  const mail = await channel.checkQueue(QUEUE.MAIL_QUEUE);
  const sms = await channel.checkQueue(QUEUE.SMS_QUEUE);

  const messageCount = {
    dlq: dlq.messageCount,
    mail: mail.messageCount,
    sms: sms.messageCount,
  };

  const consumerCount = {
    dlq: dlq.consumerCount,
    mail: mail.consumerCount,
    sms: sms.consumerCount,
  };

  return { messageCount, consumerCount };
};
