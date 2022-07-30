declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'test' | 'production';
            PORT: number;
            API_VERSION: string;
            DB_HOST: string
            DB_PORT: number
            DB_NAME: string
            DB_USER: string;
            DB_PASSWORD: string;
            API_URL_TEST: string
            API_URL_PROD: string;
            CLIENT_URL_DEV: string
            CLIENT_URL_TEST: string
            CLIENT_URL_PROD: string;
            SENDGRID_API_KEY: string;
            SENDGRID_VERIFICATION_TEMPLATE_ID: string;
            SENDGRID_EMAIL_FROM: string;
            SENDGRID_EMAIL_REPLY_TO: string;
            JWT_VERIFY_SECRET: string;
            JWT_VERIFY_EXPIRY: string;
            JWT_SESSION_SECRET: string;
            JWT_SESSION_EXPIRY: string;
            JWT_REFRESH_SECRET: string;
            JWT_REFRESH_EXPIRY: string;
            PASSWORD_HASH_CYCLE: string;
        }
    }
}

export { }
