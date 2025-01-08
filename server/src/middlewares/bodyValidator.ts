import { NextFunction, Request, Response } from "express";

export const validateMailBody = (req: Request, res: Response, next: NextFunction): void => {
    console.log("inside Validation!!")
    const { subject, body, recipients } = req.body;
    if (!isNonEmptyString(subject) || !isNonEmptyString(body) || !isNonEmptyStringArray(recipients)) {
        res.status(400).json({ error: "Request can't proceed!" });
        return;
    }
    next();
}
export const validateSmsBody = (req: Request, res: Response, next: NextFunction): void => {
    const { text, phone } = req.body;
    if (!isNonEmptyString(text) || !isNonEmptyString(phone)) {
        res.status(400).json({ error: "Request can't proceed!" });
        return;
    }
    next();
}

const isNonEmptyString = (input: any): boolean => {
    if (typeof input !== 'string') {
        return false;
    }
    return input.length > 0 && input.trim().length > 0;
} 

const isNonEmptyStringArray = (input: any): boolean => {
    return Array.isArray(input) && input.every(isNonEmptyString);
}
