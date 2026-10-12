import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";
import * as auth from "../controllers/authController";

const router = Router();

router.post("/register", asyncHandler(auth.register));
router.post("/login", asyncHandler(auth.login));
router.get("/me", requireAuth, asyncHandler(auth.me));

export default router;
