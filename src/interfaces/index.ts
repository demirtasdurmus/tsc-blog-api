export interface EmailRequest {
    from: {
        email: string
    },
    reply_to: {
        email: string
    },
    personalizations: [
        {
            to: [{ email: string }],
            dynamic_template_data:
            {
                name: string,
                verificationUrl?: string
            }
        }
    ],
    template_id?: string
}

export interface JwtSignInputs {
    data: {
        id: number | undefined;
        email?: string;
        role?: string;
    };
    secret: string;
    expiresIn: string;
}

export interface JwtVerifyInputs {
    token: string;
    secret: string;
}