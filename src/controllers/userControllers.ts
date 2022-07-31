import { RequestHandler } from 'express'
import catchAsync from '../utils/catchAsync'
import UserService from "../services/userService"
const userService = new UserService()


export const updateProfile: RequestHandler = catchAsync(async (req, res, next) => {
    const data = await userService.updateProfile(req.userId!, req.protocol, req.get('host')!, req.body, req.file);
    return res.status(200).send({ status: "success", data });
})

export const updatePassword: RequestHandler = catchAsync(async (req, res, next) => {
    const data = await userService.updatePassword(req.userId!, req.body);
    return res.status(200).send({ status: "success", data });
})

export const getUserBlogs: RequestHandler = catchAsync(async (req, res, next) => {
    const data = await userService.getUserBlogs(req.userId!, req.query);
    return res.status(200).send({ status: "success", data });
})

export const getUserBlogById: RequestHandler = catchAsync(async (req, res, next) => {
    const data = await userService.getUserBlogById(req.userId!, +req.params.id);
    return res.status(200).send({ status: "success", data });
})

export const createBlog: RequestHandler = catchAsync(async (req, res, next) => {
    const data = await userService.createBlog(req.userId!, req.protocol, req.get('host')!, req.body, req.file);
    return res.status(200).send({ status: "success", data });
})

export const updateBlog: RequestHandler = catchAsync(async (req, res, next) => {
    const data = await userService.updatePassword(req.userId!, req.body);
    return res.status(200).send({ status: "success", data });
})

export const deleteBlog: RequestHandler = catchAsync(async (req, res, next) => {
    const data = await userService.updatePassword(req.userId!, req.body);
    return res.status(200).send({ status: "success", data });
})