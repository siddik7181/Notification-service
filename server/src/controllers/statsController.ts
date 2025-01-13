import { Request, Response } from "express";
import * as statsService from "../services/statsService";
import { QueueStats } from "../types/response";

export const requestStats = async (req: Request, res: Response) => {
  try {
    const queueStats: QueueStats = await statsService.queueStats();
    res.send(queueStats);
    console.log("[Stats-Controller]: Stats Sended");
    return;
  } catch (error) {
    console.error(`[Stats-Controller]: ${error}`);
    res.sendStatus(500);
    return;
  }
};
