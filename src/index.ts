import dotenv from "dotenv";
dotenv.config({ path: "./.config.env" })
import ErrorHandler from "./middleware/errorHandler"
ErrorHandler.initializeUncaughtException()
import app from "./app"
import db from "./models"
const PORT = process.env.PORT || 8000

db.authenticate()
    .then(() => console.log(`Connected to ${db.config.database} successfully`))
    .catch((err) => console.log(`Unable to connect ${db.config.database}:`, err.message))

db.sync({ force: true })
    .then(() => console.log(`Synced to ${db.config.database} successfully`))
    .catch((err) => console.log(`Unable to sync ${db.config.database}:`, err))

const server = app.listen(PORT, () => {
    console.log(`Server is awake onn port ${PORT}:${process.env.NODE_ENV}`);
})

ErrorHandler.initializeUnhandledRejection(server)
ErrorHandler.initializeSIGTERMlistener(server, db)
ErrorHandler.initializeSIGINTlistener(server, db)