import catchAsync from '../utils/catchAsync'
import BlogService from "../services/blogService"
const blogService = new BlogService()


export const getBlogs = catchAsync(async (req, res, next) => {
    const data = await blogService.getBlogs(req.query)
    res.status(200).send({ status: "success", data })
})

export const getBlogById = catchAsync(async (req, res, next) => {
    const data = await blogService.getBlogById(+req.params.id)
    res.status(200).send({ status: "success", data })
})

export const getBlogsByCategoryId = catchAsync(async (req, res, next) => {
    const data = await blogService.getBlogsByCategoryId(+req.params.id, req.query)
    res.status(200).send({ status: "success", data })
})