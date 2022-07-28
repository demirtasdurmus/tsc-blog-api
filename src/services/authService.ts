import AppError from "../utils/appError";
import { User } from "src/models/db";


export default class AuthService {
    constructor() { }

    registerUser = async (firstName: string, lastName: string, email: string, password: string, passwordConfirm: string) => {
        try {
            // create the user
            // const newUser = await User.create({
            //     firstName,
            //     lastName,
            //     email,
            //     password,
            //     passwordConfirm
            // });
        } catch (err: any) {
            throw new AppError(err.statusCode, err.message, err.isOperational, err.name, err.stack)
        }
    };


}