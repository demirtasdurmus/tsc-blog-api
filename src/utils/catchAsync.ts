import { RequestHandler, Request, Response, NextFunction } from "express";

const catchAsync = (fn: RequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch((err: Error) => next(err));
    };
}

export default catchAsync;