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