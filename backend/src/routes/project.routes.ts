import { Router } from "express";
import { createProject, getProjects, updateProject, deleteProject } from "../controllers/project.controller";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();
router.use(authenticate);
router.get("/", getProjects);
router.post("/", requireAdmin, createProject);
router.put("/:id", updateProject);
router.delete("/:id", requireAdmin, deleteProject);
export default router;
