import dotenv from "dotenv";

// handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.stack);
    process.exit(1);
});

// configure dotenv so Node.js knows where to look
dotenv.config({ path: "./.config.env" });

// import express app
import app from "./app";

// declare the port variable
const PORT = process.env.PORT || 8000;

// set up the express server
const server = app.listen(PORT, () => {
    console.log(`Server is awake on port ${PORT}:${process.env.NODE_ENV}`);
});

// handle unhandled rejections
process.on('unhandledRejection', (err: Error) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name);
    server.close(() => {
        process.exit(1);
    });
});

// ensure graceful shutdown in case sigterm received
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('💥 Process terminated!');
    });
});