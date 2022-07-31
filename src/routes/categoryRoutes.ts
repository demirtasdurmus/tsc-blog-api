import { Router } from "express"
import { getCategories } from "../controllers/categoryControllers"
const router = Router()


router
    .get("/", getCategories)


export default router;
