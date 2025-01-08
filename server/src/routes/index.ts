
import { Router } from "express";
import mailRouter from './mailRoutes'
import smsRouter from './smsRoutes'

const router: Router = Router();

router.use('/mail', mailRouter);
router.use('/sms', smsRouter);

export default router;