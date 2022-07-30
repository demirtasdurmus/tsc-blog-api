import { DataTypes } from 'sequelize';
import db from "../index";
import { RoleModel } from '../../interfaces';

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