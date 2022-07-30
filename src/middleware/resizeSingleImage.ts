import { Request, Response, NextFunction } from "express";
import sharp from "sharp"
import { v4 as uuidv4 } from "uuid"
import slugify from "slugify"
import catchAsync from "../utils/catchAsync";


const resizeSignleImage = (name: string, path: string, width?: number, height?: number, quality?: number, format: "jpeg" | "png" | "jpg" = "jpg") => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (!req.file) return next();
        let fileSlug = name
        if (name === "profileImage") fileSlug = slugify(`${req.user!.firstName} ${req.user!.lastName}`, { lower: true })

        req.file.filename = `${fileSlug}-${uuidv4()}.${format}`;
        req.file.filepath = `${path}/${req.file.filename}`;

        await sharp(req.file.buffer)
            .resize(width, height)
            .toFormat(format)
            .jpeg({ quality })
            .toFile(`images/${path}/${req.file.filename}`);
        next();
    })
}

export default resizeSignleImage