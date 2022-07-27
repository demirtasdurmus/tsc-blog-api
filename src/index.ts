import dotenv from "dotenv";
dotenv.config({ path: "./.config.env" });
import app from "./app";
import db from "./models";
const PORT = process.env.PORT || 8000;

db.authenticate()
    .then(() => console.log(`Connected to ${db.config.database} successfully`))
    .catch((err) => console.log(`Unable to connect ${db.config.database}:`, err.message))

db.sync({ force: true })
    .then(() => console.log(`Synced to ${db.config.database} successfully`))
    .catch((err) => console.log(`Unable to sync ${db.config.database}:`, err))

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
    db.close()
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    db.close()
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT RECEIVED. Shutting down gracefully');
    db.close()
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});