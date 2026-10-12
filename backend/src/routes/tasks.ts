import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import * as tasks from "../controllers/taskController";

const router = Router();

router.get("/clients/:clientId/tasks", requireAuth, asyncHandler(tasks.listForClient));
router.post("/clients/:clientId/tasks", requireAuth, asyncHandler(tasks.createForClient));
router.put("/tasks/:id", requireAuth, asyncHandler(tasks.update));
router.delete("/tasks/:id", requireAuth, asyncHandler(tasks.remove));

export default router;
