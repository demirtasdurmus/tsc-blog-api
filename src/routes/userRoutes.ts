import { Router } from "express";
const router = Router();
import { updateProfile } from "../controllers/userControllers"
import uploadSingleFile from "../middleware/uploadSingleFile"
import resizeSignleImage from "../middleware/resizeSingleImage"


router
    .post("/",
        uploadSingleFile("profileImage", "memory"),
        resizeSignleImage("profileImage", process.env.PROFILE_IMAGES_DIR, 200, 200),
        updateProfile)


export default router;
