import { Router } from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();
// Đăng kí
router.post("/register", register);
// Đăng nhập
router.post("/login", login);
// Lấy thông tin cá nhân
router.get("/me", authenticateToken, getMe);

export default router;
