import { Router } from 'express';
import { sendMail } from '../controllers/mailController';
import { validateBody } from '../middlewares/bodyValidator';
import { emailSchema } from '../schemas/emailSchema';

const router: Router = Router();

router.post('/', validateBody(emailSchema), sendMail);

export default router;