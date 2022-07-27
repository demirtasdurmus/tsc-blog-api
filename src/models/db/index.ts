import Blog from "./blog";
import Category from "./category";
import Review from "./review";
import Role from "./role";
import User from "./user";

Role.hasMany(User)
User.belongsTo(Role)

User.hasMany(Blog)
Blog.belongsTo(User)

Category.hasMany(Blog)
Blog.belongsTo(Category)

Blog.hasMany(Review)
Review.belongsTo(Blog)

User.hasMany(Review)
Review.belongsTo(User)

export { Blog, Category, Review, Role, User }