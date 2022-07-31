export const paginate = (clientPage: number = 1, clientLimit: number = 10, maxLimit: number = 100) => {
    let limit = +clientLimit < +maxLimit ? clientLimit : +maxLimit;
    let offset = (+clientPage - 1) * +limit;
    return { limit, offset }
}