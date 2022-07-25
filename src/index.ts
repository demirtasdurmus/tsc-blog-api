import dotenv from "dotenv";
dotenv.config({ path: "./.config.env" });
import app from "./app";
import sampledb from "./models";
const PORT = process.env.PORT || 8000;

sampledb.authenticate()
    .then(() => console.log(`Connected to ${sampledb.config.database} successfully`))
    .catch((err) => console.log(`Unable to connect ${sampledb.config.database}:`, err.message))

sampledb.sync({ force: false })
    .then(() => console.log(`Synced to ${sampledb.config.database} successfully`))
    .catch((err) => console.log(`Unable to sync ${sampledb.config.database}:`, err.message))

const server = app.listen(PORT, () => {
    console.log(`Server is awake onn port ${PORT}:${process.env.NODE_ENV}`);
});

process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(reason.name, reason.message, reason.stack);
    server.close(() => {
        process.exit(1);
    });
});

process.on("uncaughtException", (err: Error) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message, err.stack);
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});