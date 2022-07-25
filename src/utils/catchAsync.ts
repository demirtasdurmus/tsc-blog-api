import { Request, Response, NextFunction } from "express";

type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

const catchAsync = (fn: AsyncFunction) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next))
            .catch((err: Error) => next(err));
    };
}

export default catchAsync;