import { Router } from 'express';
import { sendMail } from '../controllers/mailController';
import { validateMailBody } from '../middlewares/bodyValidator';

const router: Router = Router();

router.post('/', validateMailBody, sendMail);

export default router;