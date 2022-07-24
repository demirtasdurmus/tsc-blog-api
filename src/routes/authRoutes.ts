import { Router } from "express";
import { register, verify, login, checkAuth, logout } from "../controllers/authControllers";
const router = Router();

router
    .post("/register", register)
    .get("/verify/:token", verify)
    .post("/login", login)
    .get("/check-auth", checkAuth)
    .get("/logout", logout)

export default router;
