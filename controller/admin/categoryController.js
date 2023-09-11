const Category = require("../../models/admin/categoryModel")
const Foods = require("../../models/admin/foodModel")
const mongoose = require("mongoose")
//load category page
const showCategory = async (req,res)=>{
    try {
        const categoryData = await Category.find({}).sort({_id : -1})
        res.status(200).render("admin/category/index", {data : categoryData})
    } catch (error) {
        res.status(500).render("admin/errorPage", {msg : "Something went wrong."})
    }
}

//-----------------------------------------------------------------------------

//load create page
const createCategory = async (req,res)=>{
    try {
        res.status(200).render("admin/category/create")
    } catch (error) {
        res.status(500).render("admin/errorPage", {msg : "Something went wrong."})
    }
}

//-----------------------------------------------------------------------------

//load edit page
const editCategory = async (req,res)=>{
    try {
        const getCategoryData = await Category.findOne({_id : req.query.id})
        if(!getCategoryData){
            return res.status(404).render("admin/category/index", {status : "error",  msg :  "Unable to edit the category" })
        }
        res.status(200).render("admin/category/edit", {category : getCategoryData})
    } catch (error) {
        res.status(500).render("admin/errorPage", {msg : "Something went wrong."})
    }
}

//-----------------------------------------------------------------------------

//update category
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

//-----------------------------------------------------------------------------

//delete category
const deleteCategory = async (req,res)=>{
    try {
        const orderId = req.body.orderId
        //check food exist in this category
        // const getCategory = await Category.find({_id : orderId})
        //const categoryName = getCategory[0].categoryName
        const checkCategory = await Foods.find({category : orderId}).count()
        if(checkCategory > 0){
            return res.status(200).json({status : "error", msg : "Foods are present under the category, Unable to delete"})
        }
        await Category.deleteOne({_id : orderId})
        res.status(200).json({status : "success", msg : "Category Deleted"})
    } catch (error) {
        return res.status(500).json({status : "error", msg : "Cannot delete category"})
    }
}

//-----------------------------------------------------------------------------

//save category
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

//-----------------------------------------------------------------------------

//chnage category status
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

//-----------------------------------------------------------------------------

//export functions
module.exports = {
    showCategory,
    createCategory,
    saveCategory,
    editCategory,
    updateCategory,
    deleteCategory,
    categoryStatus

}