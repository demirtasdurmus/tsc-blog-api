import { Router } from "express";
import isLoggedIn from "./middleware/isLoggedIn"
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
const api = Router();

api
    .use('/auth', authRoutes)
    .use('/users', isLoggedIn, userRoutes)

export default api;