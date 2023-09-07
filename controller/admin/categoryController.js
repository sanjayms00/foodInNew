const Category = require("../../models/admin/categoryModel")

const showCategory = async (req,res)=>{
    try {
        const categoryData = await Category.find({}).sort({_id : -1})
        res.status(200).render("admin/category/index", {data : categoryData})
    } catch (error) {
        console.log(error.message)
    }
}

const createCategory = async (req,res)=>{
    try {
        res.status(200).render("admin/category/create")
    } catch (error) {
        console.log(error.message)
    }
}

const editCategory = async (req,res)=>{
    try {
        const getCategoryData = await Category.findOne({_id : req.query.id})
        if(!getCategoryData){
            return res.status(404).render("admin/category/index", {status : "error",  msg :  "Unable to edit the category" })
        }
        res.status(200).render("admin/category/edit", {category : getCategoryData})
    } catch (error) {
        console.log(error.message)
    }
}

const updateCategory = async (req,res)=>{
    try {
        let {updateCategoryName, categoryId} = req.body
        updateCategoryName = updateCategoryName.toLowerCase().trim()
        if(!updateCategoryName){
            return res.status(400).json({status : "error", msg : "Category required"})
        }
        if(!categoryId){
            throw new Error();
        }
        const isExisting = await Category.findOne({categoryName : updateCategoryName})
        if(isExisting){
            
            return res.status(400).json({status : "error", msg : "Category already exist"})
        }
        const categoryUpdateResult = await Category.updateOne(
            {_id : categoryId},
            {$set : {categoryName : updateCategoryName}}
        );
        if(!categoryUpdateResult){
            return res.status(400).json({status : "error", msg : "Category insertion failed"})
        }
        return res.status(200).json({status : "success", msg : "Category updated"})
    } catch (error) {
        return res.status(500).json({status : "error", msg : "Category updation failed"})
    }
}

const deleteCategory = async (req,res)=>{
    try {
        const{ orderId } = req.body
        await Category.deleteOne({_id : orderId})
        .then((response)=>{
            return res.status(200).json({status : "success", msg : "Category Deleted"})
        })
    } catch (error) {
        return res.status(500).json({status : "error", msg : "Cannot delete category"})
    }
}

const saveCategory = async (req,res)=>{
    try {
        let {categoryName} = req.body
        categoryName = categoryName.toLowerCase().trim()
        if(!categoryName){
            return res.status(400).json({status : "error", msg : "Category required"})
        }
        const isExisting = await Category.findOne({categoryName})
        if(isExisting){
            return res.status(400).json({status : "error", msg : "Category already exist"})
        }
        const newCategory = new Category({
            categoryName: categoryName,
            status : true
        })
        const saveData = await newCategory.save()
        if(!saveData){
            return res.status(400).json({status : "error", msg : "Category insertion failed"})
        }
        return res.status(200).json({status : "success", msg : "Category Inserted"})
    } catch (error) {
        return res.status(500).json({status : "error", msg : "Category insertion failed"})
    }
}


const categoryStatus = async (req,res)=>{
    try {
        const {status, orderId} = req.body
        await Category.updateOne({_id : orderId}, {$set : {status : status}})
        .then((response)=>{
            return res.status(200).json({status : "success", msg : "Status Changed", btnStatus: status})
        })
    } catch (error) {
        return res.status(400).json({status : "error", msg : "can't change status"})
    }
}



module.exports = {
    showCategory,
    createCategory,
    saveCategory,
    editCategory,
    updateCategory,
    deleteCategory,
    categoryStatus

}