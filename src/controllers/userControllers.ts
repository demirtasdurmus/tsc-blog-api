import { RequestHandler } from 'express'
import catchAsync from '../utils/catchAsync'
import UserService from "../services/userService"
const userService = new UserService()


export const updateProfile: RequestHandler = catchAsync(async (req, res, next) => {
    const data = await userService.updateProfile(req.userId!, req.protocol, req.get('host')!, req.body, req.file);
    return res.status(200).send({ status: "success", data });
});