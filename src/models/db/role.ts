import { Model, DataTypes, InferAttributes, InferCreationAttributes } from 'sequelize';
import db from "../index";

interface RoleModel extends Model<InferAttributes<RoleModel>, InferCreationAttributes<RoleModel>> {
    id: number;
    name: "user" | "author" | "admin";
    code: string;
}

const Role = db.define<RoleModel>('role',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
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