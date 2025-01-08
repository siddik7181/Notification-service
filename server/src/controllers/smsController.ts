import { Request, Response } from 'express';
import Sms from '../types/sms';
import * as smsService from '../servies/smsService'


export const sendSms = async(req: Request, res: Response) => {
    try {
        const mail: Sms = req.body;
        await smsService.sendSms(mail);
        res.send('Sms Sended');
        return;
    } catch (error) {
        console.error(`ControllerError: ${error}`)
        res.sendStatus(500);
        return;
    }
}
