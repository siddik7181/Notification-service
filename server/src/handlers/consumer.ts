import amqp from "amqplib";

import Job from "../types/job";
import QUEUE from ".";
import { broker } from "./broker";
import { RABBITMQURL } from "../config/secret";

const RABBITMQ_URL = `amqp://${RABBITMQURL}`;

const consume = async (queueName: string) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    const QUEUE_NAME =
      queueName === "mail" ? QUEUE.MAIL_QUEUE : QUEUE.SMS_QUEUE;
    const type = queueName === "mail" ? "email" : "sms";

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log(`Waiting for messages in queue: ${QUEUE_NAME}`);

    channel.prefetch(1);

    channel.consume(
      QUEUE_NAME,
      (msg) => {
        if (msg) {
          const messageContent = msg.content.toString();
          const job: Job = JSON.parse(messageContent);

          console.log("[Consumer]: Received mail message:", job);

          // Simulate processing
          setTimeout(async () => {
            console.log(`[Consumer]: ${QUEUE_NAME} & ${type}`);
            await broker(type, job);

            console.log(`[${job.id}]: Message processed successfully`);
            channel.ack(msg);
          }, 1000);
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
    console.log(`Waiting for messages in queue: ${QUEUE.DEAD_LETTER_QUEUE}`);

    channel.prefetch(1);

    channel.consume(
      QUEUE.DEAD_LETTER_QUEUE,
      (msg) => {
        if (msg) {
          const messageContent = msg.content.toString();
          const job: Job = JSON.parse(messageContent);

          console.log("[Consumer]: Received mail message:", job);

          // Simulate processing
          setTimeout(async () => {
            console.log(
              `[${job.id}]: Message processed successfully in side DLQ!!!!`
            );
            channel.ack(msg);
          }, 1000);
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
  await consume("mail");
  await consume("sms");

  await consumeDLQ();
};

export default consumeQueue;
