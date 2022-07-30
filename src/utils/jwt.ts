import { promisify } from "util"
import jwt, { SignOptions, Secret, JwtPayload } from "jsonwebtoken"
import AppError from "./appError"
import { JwtSignInputs, JwtVerifyInputs } from "../interfaces";

interface DecodedData {
    id: number;
    role?: string
}

// declare module 'util' {
//     function promisify<T>(fn: T): Promisify<T>;
// }

// type Promisify<T> = {
//     [K in keyof T]: T[K] extends (req: infer U, b: any, c: any, callback: (e: any, r: infer V) => void) => any
//       ? (r: U) => Promise<V>
//       : never
//   };

// type Promisify<DecodedData>: void;

// type I = {
//     token: string,
//     secret: string
// }

// type Promisify<T> = {
//     [K in keyof T]: T[K] extends (req: infer U, b: any, c: any, callback: (e: any, r: infer V) => void) => any
//     ? (r: U) => Promise<V>
//     : never
// };

// usage
// type IYourServiceClientStub = Promisify<I>;

type Promisify = ((a: number, b: number, callback: (err: Error | null) => void) => DecodedData)

// type Promisify<T> = (fn: T) => DecodedData;
export default class JWT {
    static sign = async (inputs: JwtSignInputs): Promise<any> => {
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

    static verify = async (inputs: JwtVerifyInputs): Promise<any> => {
        try {
            return await promisify<string, Secret>(jwt.verify)(inputs.token, inputs.secret);
        } catch (err: any) {
            throw new AppError(401, err.message, true, err.name, err.stack)
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