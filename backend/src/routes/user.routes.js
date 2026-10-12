import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, refreshAccessToken } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);

router.get("/current-user", authMiddleware, getCurrentUser);

router.post("/refresh-token", refreshAccessToken);


export default router;