import { Request, Response, NextFunction } from "express";
import multer from "multer"
import { v4 as uuidv4 } from "uuid"
import slugify from "slugify"
import AppError from "../utils/appError"
import { File } from "../interfaces";


// configure disk storage option
const storeOnDisk = (path?: string) => {
    return multer.diskStorage({
        destination: (req: Request, file: File, cb: Function) => {
            cb(null, path ? `images/${path}` : "images");
        },
        filename: (req: Request, file: File, cb: Function) => {
            const ext = file.mimetype.split('/')[1];
            let fileName: string;
            if (file.fieldname === "profileImage") {
                const userName = slugify(`${req.user!.firstName} ${req.user!.firstName}`, { lower: true })
                fileName = userName + "-" + uuidv4() + `.${ext}`
            } else {
                fileName = file.fieldname + "-" + uuidv4() + "-" + file.originalname.toLowerCase().split(' ').join('-') + `.${ext}`
            }
            cb(null, fileName)
        }
    })
}

// configure memory storage option
const memoryStorage = multer.memoryStorage()

const fileFilter = (req: Request, file: File, cb: Function) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new AppError(400, 'Only .png, .jpg and .jpeg formats are allowed!'));
    }
}

const uploadSingleFile = (name: string, strType: "memory" | "disk", path?: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const upload = multer({
            storage: strType && strType === "memory" ? memoryStorage : storeOnDisk(path),
            fileFilter: fileFilter
        }).single(name);
        return upload(req, res, function (err) {
            if (err) {
                // handle file count limit error exclusively
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return next(new AppError(400, 'Uploadable file limit exceeded!'));
                }
                return next(new AppError(400, err.message, true, err.name, err.stack));
            }
            // jump to next middleware if no error
            next()
        })
    }
}

export default uploadSingleFile