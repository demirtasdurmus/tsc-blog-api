import fs from "fs"
import bcrypt from "bcrypt";
import { User } from "../models/db"
import AppError from "../utils/appError"
import { ProfileData, File, PasswordData } from "../interfaces"


export default class UserService {
    constructor() { }

    public updateProfile = async (userId: number, protocol: string, host: string, data: ProfileData, file?: File) => {
        const hostName = protocol + '://' + host
        let profileImage = "";
        if (file) {
            profileImage = hostName + '/' + file.filepath;
            let oldPath: string = "";
            if (data.oldImage) {
                oldPath = `./images/${data.oldImage.slice(hostName.length + 1)}`;
            }
            this.deleteOldImage(oldPath)
        }
        const newValues = { profileImage, ...data }
        Object.keys(newValues).forEach((key: string) => {
            if (!newValues[key as keyof ProfileData]) {
                delete newValues[key as keyof ProfileData];
            }
        });
        const user = await User.update(newValues,
            {
                where: { id: userId },
                returning: ["first_name", "last_name", "bio", "profile_image"],
                // raw: true
            }
        )
        return user[1][0].toJSON()
    }

    public updatePassword = async (userId: number, data: PasswordData) => {
        const { oldPassword, password, passwordConfirm } = data;
        if (!oldPassword) {
            throw new AppError(400, "Current password must be provided")
        }
        const user = await User.findOne({ where: { id: userId }, attributes: ["password"] });
        var passwordIsValid = bcrypt.compareSync(oldPassword, user!.password);
        if (!passwordIsValid) {
            throw new AppError(400, "Current password is incorrect")
        };
        // check if password and passwordConfirm match
        if (password !== passwordConfirm) {
            throw new AppError(400, "Passwords do not match")
        }
        // check if old and new passwords are the same
        if (password === oldPassword) {
            throw new AppError(400, "New password cannot be same as the old password")
        }
        // update password
        await User.update(
            { password: bcrypt.hashSync(password, Number(process.env.PASSWORD_HASH_CYCLE)) },
            { where: { id: userId } }
        );
        return "";
    }

    private deleteOldImage = (path: string | "") => {
        if (path) {
            fs.access(path, function (err: any) {
                if (!err) {
                    fs.unlink(path, (e) => { })
                }
            });
        }
        return
    }
}