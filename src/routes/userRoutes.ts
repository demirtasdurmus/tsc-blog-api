import { Router } from "express";
import {
    updateProfile,
    updatePassword,
    getUserBlogs,
    getUserBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    createReview,
    updateReview
} from "../controllers/userControllers"
import authorizeOnly from "../controllers/athorizeOnly";
import uploadSingleFile from "../middleware/uploadSingleFile"
import resizeSignleImage from "../middleware/resizeSingleImage"
const router = Router()


router
    // user's profile and security
    .post("/",
        uploadSingleFile("profileImage", "memory"),
        resizeSignleImage("profileImage", process.env.PROFILE_IMAGES_DIR, 200, 200),
        updateProfile)
    .patch("/", updatePassword)

    // user's blog posts
    .get("/blogs", authorizeOnly("author", "admin"), getUserBlogs)
    .get("/blogs/:id", authorizeOnly("author", "admin"), getUserBlogById)
    .post("/blogs",
        authorizeOnly("author", "admin"),
        uploadSingleFile("blogImage", "memory"),
        resizeSignleImage("blogImage", process.env.BLOG_IMAGES_DIR, 400, 400),
        createBlog)
    .patch("/blogs/:id",
        authorizeOnly("author", "admin"),
        uploadSingleFile("blogImage", "memory"),
        resizeSignleImage("blogImage", process.env.BLOG_IMAGES_DIR, 400, 400),
        updateBlog)
    .delete("/blogs/:id", authorizeOnly("author", "admin"), deleteBlog)

    // user's reviews
    .post("/reviews", createReview)
    .patch("/reviews/:id", updateReview)


export default router;
