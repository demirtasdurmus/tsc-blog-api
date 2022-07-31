import { Router } from "express"
import {
    getBlogs,
    getBlogById,
    getBlogsByCategoryId
} from "../controllers/blogControllers"
const router = Router()


router
    .get("/", getBlogs)
    .get("/:id", getBlogById)
    .get("/categories/:id", getBlogsByCategoryId)


export default router;
