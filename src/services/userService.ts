import AppError from "../utils/appError"
import { UserModel, LoginData } from "../interfaces"


export default class UserService {
    constructor() { }

    public updateProfile = async (data: UserModel) => {
        try {

        } catch (err: any) {
            throw new AppError(err.statusCode, err.message, err.isOperational, err.name, err.stack)
        }
    }
}