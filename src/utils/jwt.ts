import { promisify } from "util"
import jwt, { SignOptions, Secret } from "jsonwebtoken"
import AppError from "./appError"
import { JwtSignInputs, JwtVerifyInputs } from "../interfaces";


export default class JWT {
    static sign = async (inputs: JwtSignInputs) => {
        try {
            return await promisify<object, Secret, SignOptions>(jwt.sign)(
                inputs.data,
                inputs.secret,
                {
                    expiresIn: inputs.expiresIn
                }
            );
        } catch (err: any) {
            throw new AppError(err.statusCode, err.message, true, err.name, err.stack)
        }
    }

    static verify = async (inputs: JwtVerifyInputs) => {
        try {
            return await promisify<string, string>(jwt.verify)(inputs.token, inputs.secret)
        } catch (err: any) {
            throw new AppError(err.statusCode, err.message, true, err.name, err.stack)
        }
    }

    static decode = (token: string) => {
        try {
            var base64Payload = token.split('.')[1];
            var payload = Buffer.from(base64Payload, 'base64');
            return JSON.parse(payload.toString());
        } catch (err: any) {
            throw new AppError(err.statusCode, err.message, true, err.name, err.stack)
        }
    };
} 