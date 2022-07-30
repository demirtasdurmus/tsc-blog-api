import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';

// db interfaces
export interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    id?: number;
    firstName: string;
    lastName: string;
    bio?: string;
    email: string;
    password: string;
    passwordConfirm: string;
    isVerified?: boolean;
    memberStatus?: "active" | "passive";
    profileImage?: string;
    refreshToken?: string;
    roleId?: number;
    RoleId?: number;
    createdAt?: string;
    updatedAt?: string;
    role?: {
        id?: number;
        name?: string;
        code?: string;
    }
}
export interface RoleModel extends Model<InferAttributes<RoleModel>, InferCreationAttributes<RoleModel>> {
    id: number;
    name: "user" | "author" | "admin";
    code: string;
}
export interface ReviewModel extends Model<InferAttributes<ReviewModel>, InferCreationAttributes<ReviewModel>> {
    content: string;
    verifyStatus: "verified" | "pending" | "rejected";
    feedback: string;
    response: "positive" | "negative";
}
export interface CategoryModel extends Model<InferAttributes<CategoryModel>, InferCreationAttributes<CategoryModel>> {
    name: string;
    keywords: string;
    categoryStatus: "active" | "passive";
}
export interface BlogModel extends Model<InferAttributes<BlogModel>, InferCreationAttributes<BlogModel>> {
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
// other interfaces
export interface EmailRequest {
    from: {
        email: string
    },
    reply_to: {
        email: string
    },
    personalizations: [
        {
            to: [{ email: string }],
            dynamic_template_data:
            {
                name: string,
                verificationUrl?: string
            }
        }
    ],
    template_id?: string
}
export interface JwtSignInputs {
    data: {
        id: number | undefined;
        email?: string;
        role?: string;
    };
    secret: string;
    expiresIn: string;
}
export interface JwtVerifyInputs {
    token: string;
    secret: string;
}
export interface LoginData {
    email: string;
    password: string;
    remember?: boolean
}