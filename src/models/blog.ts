import slugify from 'slugify';
import { DataTypes } from 'sequelize';
import db from ".";
import { BlogModel } from '../interfaces';


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
            type: DataTypes.STRING(150),
            allowNull: true,
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
            allowNull: true,
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
    blog.slug = slugify(blog.title, { lower: true })
    blog.length = blog.content.length;
})

export default Blog;