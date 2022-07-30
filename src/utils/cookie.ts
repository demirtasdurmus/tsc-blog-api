import { promisify } from "util"
import crypto from "crypto"
import AppError from "./appError"


export default class Cookie {
    public encrypt = async (token: string) => {
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
    }

    static decrypt = (cookie: string) => {
        // check if cookie has the min length to be decrypted
        if (cookie.length < 43) {
            throw new AppError(401, "Invalid session")
        };
        // extract encrypted token from the cookie
        const unprefixedCookie = cookie.slice(27, cookie.length);
        const sanitizedCookie = unprefixedCookie.slice(0, 15) + unprefixedCookie.slice(69, unprefixedCookie.length);

        // decrypt the token to ascii
        const token = Buffer.from(sanitizedCookie, 'base64').toString('ascii');

        // return the session cookie
        return token;
    }

    private async getRandomBytes(size: number) {
        return (await promisify(crypto.randomBytes)(size)).toString('hex');
    }
}