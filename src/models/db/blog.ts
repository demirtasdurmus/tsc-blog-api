import slugify from 'slugify';
import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import db from "../index";
import AppError from "../../utils/appError";

interface BlogModel extends Model<InferAttributes<BlogModel>, InferCreationAttributes<BlogModel>> {
    title: string;
    slug: string;
    keywords: string;
    summary: string;
    content: string;
    image: string;
    blogStatus: "active" | "passive";
    length: number;
    clapCount: number;
}

const Blog = db.define<BlogModel>('blog',
    {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Blog title is required"
                },
                len: {
                    args: [1, 100],
                    msg: "Blog title must be between 1 and 100 characters"
                },
            }
        },
        slug: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        keywords: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Keywords are required"
                }
            }
        },
        summary: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Blog content is required"
                }
            }
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        blogStatus: {
            type: DataTypes.ENUM("active", "passive"),
            allowNull: false,
            defaultValue: "active"
        },
        length: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        clapCount: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        }
    },
    {
        timestamps: true
    }
)

Blog.beforeCreate((blog: BlogModel) => {
    try {
        blog.slug = slugify(blog.title, { lower: true })
        blog.length = blog.content.length;
    } catch (err: any) {
        throw new AppError(500, err.message, false, err.name, err.stack)
    }
})

export default Blog;