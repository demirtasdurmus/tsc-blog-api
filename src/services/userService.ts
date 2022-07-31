import fs from "fs"
import bcrypt from "bcrypt"
import { Op } from "sequelize"
import { User, Blog } from "../models/db"
import AppError from "../utils/appError"
import {
    ProfileData,
    File,
    PasswordData,
    BlogFilter,
    BlogData
} from "../interfaces"


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
            this.deleteFileIfExists(oldPath)
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

    public getUserBlogs = async (userId: number, query: BlogFilter) => {
        const { limit, offset } = this.paginate(query.page, query.limit)
        return await Blog.findAll({
            where: {
                userId,
                [Op.or]: [
                    {
                        title: {
                            [Op.iLike]: `%${query.q}%`
                        }
                    },
                    {
                        keywords: {
                            [Op.iLike]: `%${query.q}%`
                        }
                    }
                ]
            },
            limit,
            offset
        })
    }

    public getUserBlogById = async (userId: number, id: number) => {
        this.isPropertyNaN(id, "blog")
        return await Blog.findOne({ where: { id, userId } })
    }

    public createBlog = async (userId: number, protocol: string, host: string, data: BlogData, file?: File) => {
        const hostName = protocol + '://' + host
        let image = "";
        if (file) {
            image = hostName + '/' + file.filepath
        }
        return await Blog.create({ userId, image, ...data })
    }

    public updateBlog = async (id: number, userId: number, protocol: string, host: string, data: BlogData, file?: File) => {
        this.isPropertyNaN(id, "blog")
        const hostName = protocol + '://' + host
        let image = "";
        if (file) {
            image = hostName + '/' + file.filepath;
            let oldPath: string = "";
            if (data.oldImage) {
                oldPath = `./images/${data.oldImage.slice(hostName.length + 1)}`;
            }
            this.deleteFileIfExists(oldPath)
        }
        const newValues = { image, ...data }
        // console.log("---", newValues)
        Object.keys(newValues).forEach((key: string) => {
            if (!newValues[key as keyof BlogData]) {
                delete newValues[key as keyof BlogData];
            }
        });
        const blog = await Blog.update(newValues,
            {
                where: { id, userId },
                returning: true,
                // raw: true
            }
        )
        return blog[1][0].toJSON()
    }

    public deleteBlog = async (id: number, userId: number) => {
        this.isPropertyNaN(id, "blog")
        await Blog.update(
            {
                blogStatus: "passive"
            }, { where: { id, userId } })
        return ""
    }

    private deleteFileIfExists = (path: string | "") => {
        if (path) {
            fs.access(path, function (err: any) {
                if (!err) {
                    fs.unlink(path, (e) => { })
                }
            });
        }
        return
    }

    private paginate = (clientPage: number = 1, clientLimit: number = 10, maxLimit: number = 100) => {
        let limit = +clientLimit < +maxLimit ? clientLimit : +maxLimit;
        let offset = (+clientPage - 1) * +limit;
        return { limit, offset }
    }

    private isPropertyNaN = (prop: any, name: string) => {
        if (isNaN(prop)) throw new AppError(400, `Invalid ${name} id`)
        return
    }
}