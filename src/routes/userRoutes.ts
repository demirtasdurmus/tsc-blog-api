import { Router } from "express";
import { updateProfile, updatePassword } from "../controllers/userControllers"
import uploadSingleFile from "../middleware/uploadSingleFile"
import resizeSignleImage from "../middleware/resizeSingleImage"
const router = Router()


router
    .post("/",
        uploadSingleFile("profileImage", "memory"),
        resizeSignleImage("profileImage", process.env.PROFILE_IMAGES_DIR, 200, 200),
        updateProfile)
    .patch("/", updatePassword)


export default router;
