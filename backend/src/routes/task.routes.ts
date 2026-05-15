import { Router } from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/task.controller";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);
router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
export default router;
