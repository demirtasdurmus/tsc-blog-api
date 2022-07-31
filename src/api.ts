import { Router } from "express";
import isLoggedIn from "./middleware/isLoggedIn"
import authRoutes from "./routes/authRoutes"
import blogRoutes from "./routes/blogRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import userRoutes from "./routes/userRoutes"
const api = Router();

api
    .use('/auth', authRoutes)
    .use('/blogs', blogRoutes)
    .use('/categories', categoryRoutes)
    .use('/users', isLoggedIn, userRoutes)


export default api;