import { Router } from 'express';
import { requestStats } from '../controllers/statsController';

const router: Router = Router();

router.get('/', requestStats);

export default router;