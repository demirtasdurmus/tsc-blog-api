import httpStatus from 'http-status'
import { Request, Response, NextFunction } from 'express'
import AppError from '../utils/appError'
import { ValidationError, Error, ValidationErrorItem } from "sequelize"
import { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken"

enum ErrorStatus { Fail, Error }

export default class ErrorHandler {
    static handle = () => {
        return async (err: AppError, req: Request, res: Response, next: NextFunction) => {
            err.statusCode = err.statusCode || 500;
            err.status = ErrorStatus.Error || 'Error';
            // handling errors acoording to node_env
            if (process.env.NODE_ENV === 'production') {
                this.sendErrorProd(err, req, res);
            } else {
                this.sendErrorDev(err, res);
            };
        };
    };

    static convert = () => {
        return async (err: any, req: Request, res: Response, next: NextFunction) => {
            let error = err;
            if (!(error instanceof AppError)) {
                // set initial statusCode to 400 if not already set
                error.statusCode = error.statusCode || httpStatus.BAD_REQUEST;

                // convert errors conditionally
                if (error instanceof JsonWebTokenError) {
                    error.message = 'Invalid session. Please log in again.';
                    // error.statusCode = httpStatus.UNAUTHORIZED;
                    res.clearCookie("__session");
                } else if (error instanceof TokenExpiredError) {
                    error.message = 'Session expired. Please log in again.';
                    // error.statusCode = httpStatus.UNAUTHORIZED;
                    res.clearCookie("__session");
                } else if (error instanceof NotBeforeError) {
                    error.message = 'Session not active. Please log in again.';
                    // error.statusCode = httpStatus.UNAUTHORIZED;
                    res.clearCookie("__session");
                } else if (error instanceof ValidationError) {
                    error = this.convertSequelizeError(error);
                } else {
                    error.statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
                    error.message = error.message || httpStatus[error.statusCode];
                    error.isOperational = false;
                };

                // recreate the error object with the new arguments
                error = new AppError(error.statusCode, error.message, error.isOperational, error.name, error.stack);
            };
            // pass the error to the actual error handler middleware
            next(error);
        };
    };

    static convertt = (err: any, req: Request, res: Response, next: NextFunction) => {
        let error = err;
        if (!(error instanceof AppError)) {
            // set initial statusCode to 400 if not already set
            error.statusCode = error.statusCode || httpStatus.BAD_REQUEST;

            // convert errors conditionally
            if (error instanceof JsonWebTokenError) {
                error.message = 'Invalid session. Please log in again.';
                // error.statusCode = httpStatus.UNAUTHORIZED;
                res.clearCookie("__session");
            } else if (error instanceof TokenExpiredError) {
                error.message = 'Session expired. Please log in again.';
                // error.statusCode = httpStatus.UNAUTHORIZED;
                res.clearCookie("__session");
            } else if (error instanceof NotBeforeError) {
                error.message = 'Session not active. Please log in again.';
                // error.statusCode = httpStatus.UNAUTHORIZED;
                res.clearCookie("__session");
            } else if (error instanceof ValidationError) {
                error = this.convertSequelizeError(error);
            } else {
                error.statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
                error.message = error.message || httpStatus[error.statusCode];
                error.isOperational = false;
            };

            // recreate the error object with the new arguments
            error = new AppError(error.statusCode, error.message, error.isOperational, error.name, error.stack);
        };
        // pass the error to the actual error handler middleware
        next(error);
    };

    private static sendErrorDev = (err: AppError, res: Response) => {
        // 1) log error to console
        console.log(`-------------${err.name}------------`)
        console.log("headersSent: ?", res.headersSent)
        console.log("isOperational: ?", err.isOperational)
        console.log(err.message)
        console.log("-------------stack----------------")
        console.log(err.stack)
        console.log("----------------------------------")

        // 2) send error message to client
        res.status(err.statusCode).send({
            status: err.status,
            error: err,
            name: err.name,
            message: err.message,
            stack: err.stack
        });
    }

    private static sendErrorProd = (err: AppError, req: Request, res: Response) => {
        // Operational, trusted error: send message to client
        if (err.isOperational) {
            // check if the headers is sent
            if (!res.headersSent) {
                res.status(err.statusCode).send({
                    status: err.status,
                    message: err.message
                });
            } else {
                console.log("-------headers sent error----------")
                console.log(`-------------${err.name}------------`)
                console.log(err.message)
                console.log("-------------stack----------------")
                console.log(err.stack)
                console.log("----------------------------------")
            }
            // Programming or other unknown error: don't leak error details
        } else {
            // 1) Log error
            console.error('ERROR 💥', err);
            // 2) Send generic message if header is not sent
            !res.headersSent && res.status(500).send({
                status: 'Error',
                message: 'Something went wrong!'
            });
        }
    }

    private static convertSequelizeError = (err: ValidationError) => {
        // create a custom message for Sequelize validation errors
        let concattedMessage = err.errors.map((e: ValidationErrorItem) => e.message).join('. ');
        err.message = `Invalid input: ${concattedMessage}`;
        return err;
    }
}