import Job from "../types/job";
import amqp from 'amqplib';

const RABBITMQ_URL = 'amqp://rabbitmq:5672';

export const sendToQueue  = async (queueName: string, message: Job) => {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
  
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });
  
    console.log(`[Publisher]: Job sent to ${queueName}:`, message);
    await channel.close();
    await connection.close();
}