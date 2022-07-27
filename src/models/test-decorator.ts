import { Table, Model, Column, DataType, IsEmail, Length, Unique } from 'sequelize-typescript';

@Table({
    timestamps: true,
})
export class User extends Model {
    @Length({ msg: "First name must be between 1 and 50 characters long", max: 50, min: 1 })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    firstName!: string;

    @Unique({ name: "email", msg: "This email already exists" })
    @IsEmail
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    email!: string;

    @Column({
        type: DataType.ENUM("active", "passive"),
        allowNull: false,
    })
    status!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: '',
    })
    password!: boolean;
}