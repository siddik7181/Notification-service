import amqp from "amqplib";

import Job from "../types/job";
import QUEUE from ".";
import { broker } from "./broker";
import { RABBITMQURL } from "../config/secret";

const RABBITMQ_URL = `amqp://${RABBITMQURL}`;

const consume = async (QUEUE_NAME: string) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // channel.prefetch(1);

    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (msg) {
          const messageContent = msg.content.toString();
          const job: Job = JSON.parse(messageContent);

          await broker(QUEUE_NAME, job);
          channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  } catch (error) {
    console.error("Error consuming messages:", error);
  }
};

const consumeDLQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE.DEAD_LETTER_QUEUE, { durable: true });

    channel.prefetch(1);

    channel.consume(
      QUEUE.DEAD_LETTER_QUEUE,
      (msg) => {
        if (msg) {
          const messageContent = msg.content.toString();
          const job: Job = JSON.parse(messageContent);
          console.log("[Consumer]: Received job id DLQ:", job);
        }
      },
      {
        noAck: false,
      }
    );
  } catch (error) {
    console.error("Error consuming messages:", error);
  }
};

const consumeQueue = async () => {
  await consume(QUEUE.MAIL_QUEUE as string);
  await consume(QUEUE.SMS_QUEUE as string);

  // await consumeDLQ();
};

export default consumeQueue;
