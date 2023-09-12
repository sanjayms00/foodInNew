
//-----------------------------------------------------------------------------------------------------

//load wishlist 
const loadWishlist = (req, res) =>{
    try{
        res.render("public/wishlist", {wishlist : []})
    } catch(err) {
        res.render("public/errorPage", {msg : "unable to load the requested page"})
    }
}


//-----------------------------------------------------------------------------------------------------

//export all functions
module.exports = {
    loadWishlist
}