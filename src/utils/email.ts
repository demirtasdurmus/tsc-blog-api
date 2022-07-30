import axios from "axios";
import AppError from "./appError";
import { UserModel } from "../models/db/user";
import { EmailRequest } from "../interfaces";


export default class Email {
    request: EmailRequest
    constructor(user: UserModel, data: any, fromOption: string = `${process.env.SENDGRID_EMAIL_FROM}`) {
        this.request = {
            "from": {
                "email": `platform.rexven.com <${fromOption}>`
            },
            "reply_to": {
                "email": `${process.env.SENDGRID_EMAIL_REPLY_TO}`
            },
            "personalizations": [
                {
                    "to": [{ "email": user.email }],
                    "dynamic_template_data": { name: user.firstName.toUpperCase(), ...data }
                }
            ]
        }
    }

    private send = async (templateId: string) => {
        this.request.template_id = templateId;
        try {
            return await axios.post("https://api.sendgrid.com/v3/mail/send", this.request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
                    }
                });
        } catch (err: any) {
            throw new AppError(err.statusCode, err.message, false, err.name, err.stack)
        }
    }

    public sendEmailVerification = async () => {
        await this.send(process.env.SENDGRID_VERIFICATION_TEMPLATE_ID);
    }
}