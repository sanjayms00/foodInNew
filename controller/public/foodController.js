const Food = require("../../models/admin/foodModel")

const detail = async (req,res)=>{
    try {
        const slug = req.params.slug
        if(!slug){
            return res.status(400).render("public/detailPage", {msg : "no content to display"})
        }
        const foodData = await Food.findOne({slug : slug})
        const relatedDishes = await Food.find({category : foodData.category})
        res.render("public/detailPage", {data : foodData, related : relatedDishes})
    } catch (error) {
        console.log("error.message")
    }
}


//export all functions like objects
module.exports = {
    detail
}