import fs from "fs"
import { User } from "../models/db"
import AppError from "../utils/appError"
import { ProfileData, File } from "../interfaces"


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