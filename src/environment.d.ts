declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            PORT: number;
            API_VERSION: string;
            DB_HOST: string
            DB_PORT: number
            DB_NAME: string
            DB_USER: string;
            DB_PASSWORD: string;
        }
    }
}

export { }
