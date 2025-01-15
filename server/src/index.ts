import express, { Express, Request, Response } from "express";
import cors from "cors";

import router from "./routes";

import consumeQueue from "./handlers/consumer";
import { PORT, SERVERHOST } from "./config/secret";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(PORT, async () => {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log("PORT: ", PORT);
  console.log(`[server]: Server is running at http://${SERVERHOST}:${PORT}`);
  await consumeQueue();
});
