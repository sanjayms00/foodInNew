const Category =  require("../../models/admin/categoryModel")


//-----------------------------------------------------------------------------------------------------

//get category data
const categoryData = async () => {
    const data = await Category.find({status : 1})
    return data
}

//-----------------------------------------------------------------------------------------------------

//export all functions
module.exports = {
    categoryData
}
