import bcrypt from "bcrypt";
import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import db from "../index";
import AppError from "../../utils/appError";

interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    firstName: string;
    lastName: string;
    bio: string;
    email: string;
    password: string;
    passwordConfirm: string;
    isVerified: boolean;
    memberStatus: "active" | "passive";
    profileImage: string;
    refreshToken: string;
}

const User = db.define<UserModel>('User', {
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull: {
                msg: "First name is required"
            },
            len: {
                args: [1, 50],
                msg: "First name must be between 1 and 50 characters"
            },
        }
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notNull: {
                msg: "Last name is required"
            },
            len: {
                args: [1, 50],
                msg: "Last name must be between 1 and 50 characters"
            },
        }
    },
    bio: {
        type: DataTypes.STRING(250),
        allowNull: true,
        validate: {
            len: {
                args: [1, 250],
                msg: "User bio must be between 1 and 250 characters"
            },
        }
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            name: "email",
            msg: 'Email address already in use!'
        },
        validate: {
            isEmail: {
                msg: "Please enter a valid email address",
            },
        }
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Password is required"
            },
        }
    },
    passwordConfirm: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Password Confirm is required"
            },
            doPasswordsMatch: function (value: string) {
                if (value !== this.password) {
                    throw new AppError(400, "Password fields don't match!");
                }
            }
        }
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    memberStatus: {
        type: DataTypes.ENUM("active", "passive"),
        allowNull: false,
        defaultValue: "active",
    },
    profileImage: {
        type: DataTypes.STRING(150),
        allowNull: true,
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
},
    {
        timestamps: true
    }
);

User.beforeCreate((user: any) => {
    try {
        user.password = bcrypt.hashSync(user.password, Number(process.env.PASSWORD_HASH_CYCLE))
        user.roleId = 1;
    } catch (err: any) {
        throw new AppError(500, err.message, false, err.name, err.stack)
    }
});

User.afterCreate(async (user: UserModel) => {
    try {
        user.passwordConfirm = 'confirmed';
        await user.save({ validate: false });
    } catch (err: any) {
        throw new AppError(500, err.message, false, err.name, err.stack)
    }
});

export default User;