import { Request, Response } from "express";
import Sms from "../types/sms";
import * as smsService from "../services/smsService";

export const sendSms = async (req: Request, res: Response) => {
  try {
    const sms: Sms = req.body;
    await smsService.sendSms(sms);
    res.send("Sms Sended");
    return;
  } catch (error) {
    console.error(`ControllerError: ${error}`);
    res.sendStatus(500);
    return;
  }
};
