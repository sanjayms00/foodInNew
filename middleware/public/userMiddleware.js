const Users = require("../../models/public/userModel")
const Cart = require("../../models/public/cartModel")

const isloggedIn = (req, res, next) => {
    if (req.session.isauth) {
        res.redirect("/")
    }else{
        next();
    }
}

const isBlocked = async (req,res,next) => {
    try {
        const checkBlockedUser = await Users.findOne({_id : req.session.isauth})
        if(!checkBlockedUser){
            res.redirect("/")
        }
        if(checkBlockedUser.blocked){
            res.redirect("/logout")
        }
        next()
    } catch (error) {
        console.log(error.message)
    }
}

const checkUserBlocked = async (req,res,next) => {
    try {
        const checkBlockedUser = await Users.findOne({_id : req.session.isauth})
        if(checkBlockedUser.blocked){
            return res.status(403).json({status : "blocked", msg : "User is Blocked"})
        }
        next()
    } catch (error) {
        console.log(error.message)
    }
}

const sessionCheck = async (req, res, next) => {

    const cart = await Cart.findOne({ userId: req.session.isauth });
    if (cart) {
        res.locals.CartLength = cart.items.length;
    }else{
        res.locals.CartLength = false
    }
    const isAuthenticated = req.session.isauth ? true : false;
    res.locals.userId = req.session.isauth;
    res.locals.isBlocked = req.session.isBlocked ? true : false; 
    res.locals.isAuthenticated = isAuthenticated;
    res.locals.userName = req.session.userName;
    next();
}

const loginCheck = (req,res,next)=>{
    if (req.session.isloggedIn === true) {
        next();
    }else{
        res.redirect("/")
    }
}




module.exports = {
    isloggedIn,
    sessionCheck,
    loginCheck,
    isBlocked,
    checkUserBlocked,
}