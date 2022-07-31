import { Category } from "../models/db"


export default class UserService {
    constructor() { }

    public getCategories = async () => {
        return await Category.findAll()
    }
}