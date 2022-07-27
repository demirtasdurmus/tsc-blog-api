import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import db from "../index";

interface ReviewModel extends Model<InferAttributes<ReviewModel>, InferCreationAttributes<ReviewModel>> {
    content: string;
    verifyStatus: "verified" | "pending" | "rejected";
    feedback: string;
    response: "positive" | "negative";
}

const Review = db.define<ReviewModel>('Review',
    {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Blog category is required"
                },
                len: {
                    args: [1, 1000],
                    msg: "Blog category must be between 1 and 1000 characters"
                },
            }
        },
        verifyStatus: {
            type: DataTypes.ENUM("verified", "pending", "rejected"),
            allowNull: false,
            defaultValue: "pending"
        },
        feedback: {
            type: DataTypes.STRING(250),
            allowNull: true,
            validate: {
                len: {
                    args: [1, 250],
                    msg: "Rejected feedback must be between 1 and 250 characters"
                },
            }
        },
        response: {
            type: DataTypes.ENUM("positive", "negative"),
            allowNull: true,
        },
    },
    {
        timestamps: true
    }
)

export default Review;