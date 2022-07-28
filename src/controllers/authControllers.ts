import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import AuthService from "../services/authService.js"
const authService = new AuthService()

export const register: RequestHandler = catchAsync(async (req, res, next) => {
    const { firstName, lastName, email, password, passwordConfirm } = req.body
    const user = await authService.registerUser(firstName, lastName, email, password, passwordConfirm);
    res.status(201).send({ status: "success", data: user });
});

export const verify: RequestHandler = (req, res, next) => {

};

export const login: RequestHandler = (req, res, next) => {

};

export const checkAuth: RequestHandler = (req, res, next) => {

};

export const logout: RequestHandler = (req, res, next) => {

};