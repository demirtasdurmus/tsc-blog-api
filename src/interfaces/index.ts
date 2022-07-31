import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';

// db interfaces
export interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    id?: number;
    firstName: string;
    first_name?: string;
    lastName: string;
    last_name?: string;
    bio?: string;
    email: string;
    password: string;
    passwordConfirm: string;
    isVerified?: boolean;
    memberStatus?: "active" | "passive";
    profileImage?: string;
    profile_image?: string;
    refreshToken?: string;
    roleId?: number;
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
    id?: number;
    title: string;
    slug?: string;
    keywords?: string;
    summary?: string;
    content: string;
    image?: string;
    blogStatus?: "active" | "passive";
    length?: number;
    clapCount?: number;
    userId?: number;
    categoryId?: number;
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
export interface File {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
    filepath?: string
}
export interface ProfileData {
    firstName: string;
    lastName: string;
    bio: string;
    oldImage: string;
    profileImage?: string;
}
export interface PasswordData {
    oldPassword: string;
    password: string;
    passwordConfirm: string;
}
export interface BlogFilter {
    page?: number;
    limit?: number;
    q?: string;
}
export interface BlogData {
    title: string;
    keywords: string;
    summary?: string;
    content: string;
    image?: string;
    categoryId: number
}