import { Router } from 'express';
import { validateBody } from '../middlewares/bodyValidator';
import { sendSms } from '../controllers/smsController';
import { smsSchema } from '../schemas/smsSchema';

const router: Router = Router();

router.post('/', validateBody(smsSchema), sendSms);

export default router;