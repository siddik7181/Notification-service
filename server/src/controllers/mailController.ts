import { Request, Response } from 'express';
import Mail from '../types/mail';
import * as mailService from '../services/mailService'


export const sendMail = async(req: Request, res: Response) => {
    console.log('inside controller')
    try {
        const mail: Mail = req.body;
        await mailService.sendMail(mail);
        console.log("[Controller]: Mail sended");
        res.send('Mail Sended');
        return;
    } catch (error) {
        console.error(`[Controller]: ${error}`)
        res.sendStatus(500);
        return;
    }
}
