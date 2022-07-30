type User = {
    id: number,
    firstName: string,
    lastName: string,
    role: string,
    email: string
    profileImage?: string
}

declare namespace Express {
    interface Request {
        userId?: number;
        user?: User;
        file?: {
            filename: string;
            fieldname: string;
            originalname: string;
            encoding: string;
            mimetype: string;
            buffer: Buffer;
            size: number;
            filepath?: string;
        }
    }
}