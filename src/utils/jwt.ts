import { promisify } from "util"
import jwt, { SignOptions, Secret } from "jsonwebtoken"
import { JwtSignInputs, JwtVerifyInputs } from "../interfaces";

export default class JWT {
    static sign = async (inputs: JwtSignInputs): Promise<any> => {
        return await promisify<object, Secret, SignOptions>(jwt.sign)(
            inputs.data,
            inputs.secret,
            {
                expiresIn: inputs.expiresIn
            }
        );
    }

    static verify = async (inputs: JwtVerifyInputs): Promise<any> => {
        return await promisify<string, Secret>(jwt.verify)(inputs.token, inputs.secret);
    }

    static decode = (token: string) => {
        var base64Payload = token.split('.')[1];
        var payload = Buffer.from(base64Payload, 'base64');
        return JSON.parse(payload.toString());
    };
} 