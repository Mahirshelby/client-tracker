import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import * as clients from "../controllers/clientController";

const router = Router();
router.use(requireAuth);

router.get("/", asyncHandler(clients.list));
router.post("/", asyncHandler(clients.create));
router.get("/:id", asyncHandler(clients.getOne));
router.put("/:id", asyncHandler(clients.update));
router.delete("/:id", asyncHandler(clients.remove));

export default router;
