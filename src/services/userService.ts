import fs from "fs"
import bcrypt from "bcrypt"
import { Op } from "sequelize"
import { User, Blog, Review, Category } from "../models"
import AppError from "../utils/appError"
import {
    ProfileData,
    File,
    PasswordData,
    BlogFilter,
    BlogData,
    ReviewModel
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
        return user[1][0]
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

    public getUserBlogs = async (authorId: number, query: BlogFilter) => {
        const { limit, offset } = this.paginate(query.page, query.limit)
        const sk = query.q ? query.q : ""
        return await Blog.findAll({
            where: {
                authorId,
                [Op.or]: [
                    {
                        title: {
                            [Op.iLike]: `%${sk}%`
                        }
                    },
                    {
                        keywords: {
                            [Op.iLike]: `%${sk}%`
                        }
                    }
                ]
            },
            attributes: { exclude: ["authorId", "slug", "categoryId", "content"] },
            include: [
                {
                    model: Category,
                    required: true,
                    attributes: ["name"]
                }
            ],
            limit,
            offset
        })
    }

    public getUserBlogById = async (authorId: number, id: number) => {
        this.isPropertyNaN(id, "blog")
        return await Blog.findOne({
            where: { id, authorId },
            include: [
                {
                    model: Category,
                    required: true,
                    attributes: ["name"]
                }
            ]
        })
    }

    public createBlog = async (authorId: number, protocol: string, host: string, data: BlogData, file?: File) => {
        const hostName = protocol + '://' + host
        let image = "";
        if (file) {
            image = hostName + '/' + file.filepath
        }
        return await Blog.create({ authorId, image, ...data })
    }

    public updateBlog = async (id: number, authorId: number, protocol: string, host: string, data: BlogData, file?: File) => {
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
                where: { id, authorId },
                returning: true,
                // raw: true
            }
        )
        return blog[1][0]
    }

    public deleteBlog = async (id: number, authorId: number) => {
        this.isPropertyNaN(id, "blog")
        await Blog.update(
            {
                blogStatus: "passive"
            }, { where: { id, authorId } })
        return ""
    }

    public clapBlog = async (id: number, userId: number) => {
        this.isPropertyNaN(id, "blog")
        const blog = await Blog.findByPk(id, { attributes: ["authorId"] })
        if (!blog) throw new AppError(400, "Blog not found")
        if (blog.authorId === userId) throw new AppError(400, "You can't clap your own blog")
        await Blog.increment('clapCount', { by: 1, where: { id } })
        return ""
    }

    public createReview = async (userId: number, data: ReviewModel) => {
        if (!data.blogId) throw new AppError(400, "Blog id must be provided")
        this.isPropertyNaN(data.blogId, "blog")
        const blog = await Blog.findByPk(data.blogId, { attributes: ["authorId"] })
        if (!blog) throw new AppError(400, "Blog not found")
        if (blog.authorId === userId) throw new AppError(400, "You can't review for your own blog")
        return await Review.create({ ownerId: userId, ...data })
    }

    public updateReview = async (id: number, userId: number, data: ReviewModel) => {
        this.isPropertyNaN(id, "review")
        const review = await Review.findByPk(id, { attributes: ["ownerId"] })
        if (!review) throw new AppError(400, "Review not found")
        if (review.ownerId !== userId) throw new AppError(400, "You can only update your own review")
        if (!data.content) throw new AppError(400, "Review content must be provided")
        const updated = await Review.update(data,
            {
                where: { id, ownerId: userId },
                returning: ["content"],
                // raw: true
            }
        )
        return updated[1][0]
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
        if (!clientPage) clientPage = 1;
        if (!clientLimit) clientLimit = 10;
        let limit = +clientLimit < +maxLimit ? clientLimit : +maxLimit;
        let offset = (+clientPage - 1) * +limit;
        return { limit, offset }
    }

    private isPropertyNaN = (prop: any, name: string) => {
        if (isNaN(prop)) throw new AppError(400, `Invalid ${name} id`)
        return
    }
}