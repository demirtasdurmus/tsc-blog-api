import { Sequelize } from 'sequelize';

const db = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    logging: false,
    define: {
        underscored: true, // use snake_case for all fields in the database
        // freezeTableName: true, //stop the auto-pluralization performed by Sequelize
        timestamps: false // don't add timestamps to tables by default (createdAt, updatedAt)
    },
});
export default db;
import Blog from "./blog";
import Category from "./category";
import Review from "./review";
import Role from "./role";
import User from "./user";

Role.hasMany(User)
User.belongsTo(Role)

Blog.belongsTo(User, { as: "author" })
User.hasMany(Blog, { as: "blogs", foreignKey: "authorId" })

Review.belongsTo(User, { as: "owner" })
User.hasMany(Review, { as: "reviews", foreignKey: "ownerId" })

Category.hasMany(Blog)
Blog.belongsTo(Category)

Blog.hasMany(Review)
Review.belongsTo(Blog)

export { Blog, Category, Review, Role, User }

