import { promisify } from "util"
import crypto from "crypto"
import AppError from "./appError"


export default class Cookie {
    private async getRandomBytes(size: number) {
        try {
            const key = await promisify(crypto.randomBytes)(size);
            return key.toString('hex');
        } catch (err: any) {
            throw new AppError(err.statusCode, err.message, true, err.name, err.stack)
        }
    }
    encrypt = async (token: string) => {
        try {
            const encryptedToken = Buffer.from(token).toString('base64');

            // create a random string and encrypt to prefix the encrypted token
            const randomStringPrefix = await this.getRandomBytes(10);
            const encryptedPrefix = Buffer.from(randomStringPrefix).toString('base64');
            const configuredPrefix = encryptedPrefix.slice(0, encryptedPrefix.length - 1); // 27 chars long

            // create a random string and encrypt to inject in the middle of the encrypted token
            const randomStringMiddle = await this.getRandomBytes(20);
            const encryptedMiddle = Buffer.from(randomStringMiddle).toString('base64');
            const configuredMiddle = encryptedMiddle.slice(0, encryptedMiddle.length - 2); // 54 chars long

            // create seesion cookie
            const cookie = `${configuredPrefix}${encryptedToken.slice(0, 15)}${configuredMiddle}${encryptedToken.slice(15, encryptedToken.length)}`;

            // return the session cookie
            return cookie;
        } catch (err: any) {
            throw new AppError(err.statusCode, err.message, true, err.name, err.stack)
        }
    }

    decrypt = (cookie: string) => {
        try {
            // check if cookie has the min length to be decrypted
            if (cookie.length < 43) {
                return null;
            };
            // extract encrypted token from the cookie
            const unprefixedCookie = cookie.slice(27, cookie.length);
            const sanitizedCookie = unprefixedCookie.slice(0, 15) + unprefixedCookie.slice(69, unprefixedCookie.length);

            // decrypt the token to ascii
            const token = Buffer.from(sanitizedCookie, 'base64').toString('ascii');

            // return the session cookie
            return token;
        } catch (err: any) {
            throw new AppError(err.statusCode, err.message, true, err.name, err.stack)
        }
    }
}