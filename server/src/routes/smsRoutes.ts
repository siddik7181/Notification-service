import { Router } from 'express';
import { validateSmsBody } from '../middlewares/bodyValidator';
import { sendSms } from '../controllers/smsController';

const router: Router = Router();

router.post('/', validateSmsBody, sendSms);

export default router;