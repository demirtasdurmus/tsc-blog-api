import { Sequelize } from 'sequelize-typescript';

const db = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    logging: false,
    // models: [User],
    define: {
        underscored: true, // use snake_case for all fields in the database
        // freezeTableName: true, //stop the auto-pluralization performed by Sequelize
        timestamps: false // don't add timestamps to tables by default (createdAt, updatedAt)
    },
});
export default db;
import "./db"

