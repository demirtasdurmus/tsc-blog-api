import { DataTypes } from 'sequelize';
import db from "../index";
import { CategoryModel } from '../../interfaces';


const Category = db.define<CategoryModel>('category',
    {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Blog category is required"
                },
                len: {
                    args: [1, 100],
                    msg: "Blog category must be between 1 and 100 characters"
                },
            }
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
        categoryStatus: {
            type: DataTypes.ENUM("active", "passive"),
            allowNull: false,
            defaultValue: "active"
        },
    },
    {
        timestamps: true
    }
)

export default Category;