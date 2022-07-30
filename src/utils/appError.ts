enum ErrorStatus { Fail, Error }

export default class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    name: string;
    status: ErrorStatus;

    constructor(
        statusCode: number = 500,
        message: string,
        isOperational: boolean = true,
        name: string = "Error",
        stack: string = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = name;
        this.status = statusCode.toString().startsWith('4') ? ErrorStatus.Fail : ErrorStatus.Error;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}