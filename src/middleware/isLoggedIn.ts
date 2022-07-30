import { RequestHandler } from 'express'
import catchAsync from "../utils/catchAsync"
import AuthService from '../services/authService'
const authService = new AuthService()

const isLoggedIn: RequestHandler = catchAsync(async (req, res, next) => {
    const data = await authService.checkUserSession(req.cookies[process.env.COOKIE_NAME])
    // assign the user id to the request object and pass it to the next middleware
    req.userId = data.id
    req.user = data
    return next()
})

export default isLoggedIn