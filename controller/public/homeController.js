const Food =  require("../../models/admin/foodModel")
const Banner =  require("../../models/admin/bannerModel")
const categoryController = require("./categoryController");


//-----------------------------------------------------------------------------------------------------

//load the index page
const home = async (req,res)=>{
    try {
        const foodData =  Food.find({status : true}).sort({_id : -1}).limit(12)
        const categories = categoryController.categoryData()
        const banner = Banner.find({status : true}).sort({position : 1})
        Promise.all([foodData, categories, banner]).then((response)=>{
            res.render("public/index", {food : response[0], categories : response[1], banner : response[2]})
        })
    } catch (error) {
        res.status(500).render({msg : "Unable load the home page"})
    }
}


//-----------------------------------------------------------------------------------------------------

//load search food
const search = async (req, res) =>{
    try {
        const search = req.query.search
        const pattern = [
            {foodName : {$regex : search, $options : 'i'}},
            {description : {$regex : search, $options : 'i'}}
        ]
        const foodData = await Food.find({$or : pattern})
        res.status(200).render("public/searchPage", {search , food : foodData})
    } catch (error) {
        res.status(500).render("public/errorPage", {status : "error", msg : "Unable to find the product"})
    }
}


//-----------------------------------------------------------------------------------------------------

//load all foods page
const showAllFoods = async (req, res) =>{
    try {   
        const page = parseInt(req.query.page) || 1

        let query = {status : true}
        sortCriteria = {}
        if(req.query.sort){
            let sort = req.query.sort
            if(sort === '1'){
                sortCriteria = { discPrice: 1 };
            }else if(sort === '-1'){
                sortCriteria = { discPrice: -1 };
            }
        }
        else if(req.query.price){
            let price = req.query.price
            if (price === '-500') {
                query.discPrice = { $lt: 500 };
              }else if(price === '-1000'){
                query.discPrice = { $lt: 1000 };
            }else if(price === '100-500'){
                query.discPrice = { $gt: 100, $lt : 500 };
            }
        }
        else if(req.query.type){
            let type = req.query.type
            if (type === 'veg') {
                query.type = 1;
            }
            else if(type === 'non-veg'){
                query.type = 0;
            }
        }
        else if(req.query.category){
            let category = req.query.category
            query.category = category
        }
        else if(req.query.rating){
            var rating = parseInt( req.query.rating)
            query.rating = rating
        }
        
        const limit = 8;

        const skip = (page - 1) * limit
        //const totalSize = await Food.find({status : true}).count()
        // const totalPages = Math.ceil(foodDataCount / limit)
        //main query for pagination
        
        if(!req.query.rating){
            var foodDataCount = await Food.find(query).count()
            var foodData =  Food.find(query).sort(sortCriteria).skip(skip).limit(limit)
        }
        else if(req.query.rating){
            var foodData = Food.aggregate([
                { $unwind: '$rating' },
                {
                    $match: {
                      'rating.value': rating, // Match the specific rating
                    },
                },
                {
                    $skip : skip
                },
                {
                    $limit : limit
                },
                {
                    $group: {
                    _id: '$_id',
                    foodData: { $first: '$$ROOT' },
                    },
                },
                {
                    $addFields: {
                    averageRating: '$averageRating', // Add averageRating to the root level
                    },
                },
                { $replaceRoot: { newRoot: '$foodData' } }, 
              ]);
              
        }
        
        const categories =  categoryController.categoryData()
        Promise.all([foodData, categories])
        .then((values) => {
            if(req.query.rating){
                foodDataCount = values[0].length
            }
            const totalPages = Math.ceil(foodDataCount / limit)
            res.status(200).render("public/allFoods", {food : values[0], categories : values[1], currentPage : page, totalPages, limit, query: req.query, foodDataCount } )
        })
        .catch((err)=>{
            res.status(500).render("public/errorPage", {status : "error", msg : "Issue loading the page"})
        });
    } catch (error) {
        
        res.status(500).render("public/errorPage", {status : "error", msg : "Unable to show food"})
    }
}

//-----------------------------------------------------------------------------------------------------

//export all functions
module.exports = {
    home,
    search,
    showAllFoods
}