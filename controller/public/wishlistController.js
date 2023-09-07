

const loadWishlist = (req, res) =>{
    try{
        console.log("haii")
        res.render("public/wishlist", {wishlist : []})
    } catch(err) {
        res.render("public/errorPage", {msg : "unable to load the requested page"})
    }
}

module.exports = {
    loadWishlist
}