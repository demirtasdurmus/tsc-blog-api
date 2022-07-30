import AppError from "../utils/appError"
import Cookie from "../utils/cookie"
import JWT from "../utils/jwt"
import Email from "../utils/email"
import { User, Role } from "../models/db"
import { API_URL } from "../config"
import { UserModel } from "../models/db/user"

export default class AuthService {
    constructor() { }

    registerUser = async (firstName: string, lastName: string, email: string, password: string, passwordConfirm: string) => {
        try {
            // create the user
            const newUser = await User.create({
                firstName,
                lastName,
                email,
                password,
                passwordConfirm
            });
            console.log("----", newUser.toJSON())
            // sign a jwt token
            const data = { id: newUser.id }
            const secret = process.env.JWT_VERIFY_SECRET
            const expiresIn = process.env.JWT_VERIFY_EXPIRY
            const token = await JWT.sign({ data, secret, expiresIn })
            // send a verification email
            const verificationUrl = `${API_URL}/api/${process.env.API_VERSION}/auth/verify/${token}`;
            if (process.env.NODE_ENV === "production") {
                await new Email(newUser, { verificationUrl }).sendEmailVerification();
            } else {
                console.log(token)
            }
            // return limited user info
            return {
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                createdAt: newUser.createdAt
            }
        } catch (err: any) {
            throw new AppError(err.statusCode, err.message, err.isOperational, err.name, err.stack)
        }
    };

    verifyUserAndCreateSession = async (token: string) => {
        try {
            // verify token & extract user data
            const decoded = await JWT.verify({ token, secret: process.env.JWT_VERIFY_SECRET })
            // fetch user from db
            const user = await User.findOne({
                where: {
                    id: decoded.id
                },
                attributes: ["id", "isVerified"],
                include: [Role]
            });
            if (!user) {
                throw new AppError(400, "User not found");
            };
            if (user.isVerified) {
                throw new AppError(400, "User already verified");
            };
            // verify and login the user only if the user is not verified
            user.isVerified = true;
            user.memberStatus = 'active';
            await user.save({ fields: ["isVerified", "memberStatus"] });
            // sign a session token and embed it in the cookie
            const { sessionCookie, sessionExpiry } = await this.createSession(user);
            return { sessionCookie, sessionExpiry };
        } catch (err: any) {
            throw new AppError(err.statusCode, err.message, err.isOperational, err.name, err.stack)
        }
    };

    private createSession = async (user: UserModel) => {
        try {
            const data = { id: user.id, role: user.role!.code }
            const secret = process.env.JWT_SESSION_SECRET;
            const expiresIn = process.env.JWT_SESSION_EXPIRY;
            const sessionToken = await JWT.sign({ data, secret, expiresIn });
            const sessionCookie = await new Cookie().encrypt(sessionToken);
            // create a cookie expiry date in compatible w jwt lifetime
            const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000 * +process.env.JWT_SESSION_EXPIRY.slice(0, -1));
            return { sessionCookie, sessionExpiry }
        } catch (err: any) {
            throw new AppError(err.statusCode, err.message, err.isOperational, err.name, err.stack)
        }
    }
}