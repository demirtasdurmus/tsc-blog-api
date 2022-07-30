import { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken"


export class JWTError extends JsonWebTokenError {
    statusCode: number
    constructor(statusCode: number, message: string) {
        super(message)
        this.statusCode = statusCode
    }
}