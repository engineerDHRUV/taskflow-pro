import { Router } from "express";
import { getUsers, getUserById, updateUser } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
export default router;
