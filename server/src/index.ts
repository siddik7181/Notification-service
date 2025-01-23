import express, { Express } from "express";
import cors from "cors";

import router from "./routes";

import consumeQueue from "./handlers/consumer";
import { PORT, SERVERHOST } from "./config/secret";
import { initNotificationsProviders } from "./config/thirdParty/provider";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.listen(PORT, async () => {
  console.log(`[server]: Server is running at http://${SERVERHOST}:${PORT}`);
  initNotificationsProviders();
  await consumeQueue();
});
