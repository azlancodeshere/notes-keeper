
import { Router } from "express";
import { askAI } from "../controllers/ai.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/ask", authMiddleware, askAI);

export default router;
