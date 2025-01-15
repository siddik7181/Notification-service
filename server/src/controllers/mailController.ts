import { Request, Response } from "express";
import Mail from "../types/mail";
import * as mailService from "../services/mailService";

export const sendMail = async (req: Request, res: Response) => {
  try {
    const mail: Mail = req.body;
    await mailService.sendMail(mail);
    res.send("Mail Sended");
    return;
  } catch (error) {
    console.error(`[Controller]: ${error}`);
    res.sendStatus(500);
    return;
  }
};
