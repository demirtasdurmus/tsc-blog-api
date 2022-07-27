import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import db from "../models";
const { User } = db.models

console.log("----", User)
export const register: RequestHandler = catchAsync(async (req, res, next) => {

});

export const verify: RequestHandler = (req, res, next) => {

};

export const login: RequestHandler = (req, res, next) => {

};

export const checkAuth: RequestHandler = (req, res, next) => {

};

export const logout: RequestHandler = (req, res, next) => {

};