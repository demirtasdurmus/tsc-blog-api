
import { Request, Response, NextFunction } from "express"
import AppError from "../utils/appError";

const authorizeOnly = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // check if current user is authorized
        if (!roles.includes(req.user!.role)) {
            return next(new AppError(403, 'You are not authorized to perform this action!'))
        };
        // jump to the next middleware
        next();
    }
}

export default authorizeOnly