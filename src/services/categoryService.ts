import { Category } from "../models"


export default class CategoryService {
    constructor() { }

    public getCategories = async () => {
        return await Category.findAll()
    }
}