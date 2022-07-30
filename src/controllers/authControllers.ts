import { RequestHandler } from 'express'
import catchAsync from '../utils/catchAsync'
import AuthService from "../services/authService"
import { CLIENT_URL } from "../config"
const authService = new AuthService()

export const register: RequestHandler = catchAsync(async (req, res, next) => {
    const { firstName, lastName, email, password, passwordConfirm } = req.body
    const data = await authService.registerUser(firstName, lastName, email, password, passwordConfirm);
    res.status(201).send({ status: "success", data });
});

export const verify: RequestHandler = catchAsync(async (req, res, next) => {
    const { sessionCookie, sessionExpiry } = await authService.verifyUserAndCreateSession(req.params.token);
    res.cookie(process.env.COOKIE_NAME, sessionCookie, {
        expires: sessionExpiry,
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict"
    });
    res.redirect(`${CLIENT_URL}`);
});

export const login: RequestHandler = catchAsync(async (req, res, next) => {
    const { sessionCookie, sessionExpiry } = await authService.loginUserAndCreateSession(req.body);
    // assign the cookie to the response
    res.cookie(process.env.COOKIE_NAME, sessionCookie, {
        expires: sessionExpiry,
        httpOnly: false,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict"
    });
    // send a success message to the client
    res.status(200).send({ status: "success", data: "" });
});

export const checkAuth: RequestHandler = catchAsync(async (req, res, next) => {
    const data = await authService.checkUserSession(req.cookies[process.env.COOKIE_NAME]);
    return res.status(200).send({ status: "success", data });
});

export const logout: RequestHandler = (req, res, next) => {
    res.clearCookie(process.env.COOKIE_NAME);
    res.status(200).json({ status: 'success', data: '' });
};