import { Router } from "express";
import { getDashboard } from "../controllers/analytics.controller";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);
router.get("/dashboard", getDashboard);
export default router;
