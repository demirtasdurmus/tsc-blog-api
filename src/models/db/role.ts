import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import db from "../index";

interface RoleModel extends Model<InferAttributes<RoleModel>, InferCreationAttributes<RoleModel>> {
    name: "user" | "author" | "admin";
    code: string;
}

const Role = db.define<RoleModel>('Role',
    {
        name: {
            type: DataTypes.ENUM('user', 'author', 'admin'),
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING(50),
            allowNull: false,
        }
    }
);

export default Role;