const Category =  require("../../models/admin/categoryModel")

const categoryData = async () => {
    const data = await Category.find({status : 1})
    return data
}

module.exports = {
    categoryData
}
