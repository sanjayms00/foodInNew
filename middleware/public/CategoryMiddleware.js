const category = require("../../models/admin/categoryModel")

//get category data for all the pages
const getCategoryData = async (req, res, next) => {
    try {
       const categoryData = await category.find({status : true})
       res.locals.category = categoryData;
       next();
    } catch (error) {
        next(error)
    }
    
}

module.exports = {
    getCategoryData
}