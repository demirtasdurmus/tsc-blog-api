import path from "path";
import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import api from "./api";
import ErrorHandler from "./middleware/errorHandler"

const app: Application = express();

// if (process.env.NODE_ENV === "development") {
app.use(morgan("dev"));
// };
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cookieParser());
app.use(compression());
app.use(express.json());
// app.use(express.urlencoded({ extended: true, type: "multipart/form-data", limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../", "images")));

app.use(`/api/${process.env.API_VERSION}`, api);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
    res.status(404).end();
});
app.use(ErrorHandler.convert());
app.use(ErrorHandler.handle());

export default app;