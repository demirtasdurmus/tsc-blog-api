import { Router } from "express";
const router = Router();
import { updateProfile } from "../controllers/userControllers";


router
    .post("/", updateProfile)


export default router;
