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
    res.cookie("__rex_session", sessionCookie, {
        expires: sessionExpiry,
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "strict"
    });
    res.redirect(`${CLIENT_URL}`);
});

export const login: RequestHandler = (req, res, next) => {

};

export const checkAuth: RequestHandler = (req, res, next) => {

};

export const logout: RequestHandler = (req, res, next) => {

};