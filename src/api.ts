import { Router } from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
const api = Router();

api
    .use('/auth', authRoutes)
    .use('/users', userRoutes)

export default api;