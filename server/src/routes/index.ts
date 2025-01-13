import { Router } from "express";
import mailRouter from "./mailRoutes";
import smsRouter from "./smsRoutes";
import statsRouter from "./statsRoutes";

const router: Router = Router();

router.use("/email", mailRouter);
router.use("/sms", smsRouter);
router.use("/stats", statsRouter);

export default router;
