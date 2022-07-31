import { Category } from "../models/db"


export default class CategoryService {
    constructor() { }

    public getCategories = async () => {
        return await Category.findAll()
    }
}