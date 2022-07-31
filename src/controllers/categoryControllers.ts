import catchAsync from '../utils/catchAsync'
import CategoryService from "../services/categoryService"
const categoryService = new CategoryService()


export const getCategories = catchAsync(async (req, res, next) => {
    const data = await categoryService.getCategories()
    res.status(200).send({ status: "success", data })
});