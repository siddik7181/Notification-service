import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes";
import consumeQueue from "./handlers/consumer";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use('/send', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, async () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  await consumeQueue();
});