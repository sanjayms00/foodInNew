require("dotenv").config()
const express = require("express");
const publicRoute = express.Router()
const session = require("express-session")
const mongoDBSession = require("connect-mongodb-session")(session)

const store = mongoDBSession({
    uri : process.env.DATABSE_URL,
    collection : "userSessions"
})

publicRoute.use(express.json())

//session middlware
publicRoute.use(session({
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : false,
    store : store,
    //cookie : {maxAge : 1000 * 60 * 60 * 24} //24 hours life
}))


// get controllers
const homeController = require("../../controller/public/homeController")
const configController = require("../../controller/public/configController");
const foodController = require("../../controller/public/foodController");
const profileController = require("../../controller/public/profileController")
const addressController = require("../../controller/public/addressController")
const orderController = require("../../controller/public/orderController")
const cartController = require("../../controller/public/cartContoller")
const checkoutController = require("../../controller/public/checkoutController")
const walletController = require("../../controller/public/walletController")
const wishlistController = require("../../controller/public/wishlistController")

//include middleware
const userMiddleWare = require("../../middleware/public/userMiddleware")

publicRoute.use(userMiddleWare.sessionCheck)

//home route
publicRoute.get("/",homeController.home)
publicRoute.get("/foods",homeController.showAllFoods)

//config routes
publicRoute.get("/login",userMiddleWare.isloggedIn, configController.login)
publicRoute.post("/loginAuthenticate",configController.loginAuthenticate)
publicRoute.get("/loginAuthenticate",userMiddleWare.isloggedIn, configController.login)
publicRoute.get("/signup",userMiddleWare.isloggedIn, configController.signup)
publicRoute.post("/signupAuthenticate", configController.signupAuthenticate)
publicRoute.get("/logout", configController.logOut)
publicRoute.get("/forgot-password",userMiddleWare.isloggedIn, configController.forgotPassword)
publicRoute.post("/forgot-password",userMiddleWare.isloggedIn, configController.forgotPasswordAuth)
publicRoute.get("/reset-password/:id/:token",userMiddleWare.isloggedIn, configController.resetPassword)
publicRoute.post("/reset-password",userMiddleWare.isloggedIn, configController.resetPasswordAuth)

//2fa varification
publicRoute.get("/verifyOtp",userMiddleWare.isloggedIn, configController.verifyOtp)
publicRoute.post("/validateOtp", userMiddleWare.isloggedIn, configController.validateOtp)
publicRoute.post("/validateNUmber", userMiddleWare.isloggedIn, configController.validateNumber)

//food routes
publicRoute.get("/foodDetail/:slug", foodController.detail)

//profile Routes
publicRoute.get("/my-profile", userMiddleWare.isBlocked,  profileController.myProfile)
publicRoute.get("/edit-profile", userMiddleWare.isBlocked, profileController.editProfile)
publicRoute.post("/update-profile", userMiddleWare.isBlocked, profileController.updateProfile)

//address routes
publicRoute.get("/address-book", userMiddleWare.isBlocked, addressController.addressBook)
publicRoute.get("/edit-address/:id", userMiddleWare.isBlocked, addressController.editAddress)
publicRoute.post("/delete-address", userMiddleWare.isBlocked, addressController.deleteAddress)
publicRoute.post("/save-address", userMiddleWare.isBlocked, addressController.saveAddress)
publicRoute.patch("/update-address", userMiddleWare.isBlocked, addressController.updateAddress)
publicRoute.patch("/set-default", userMiddleWare.isBlocked, addressController.setDefault)
publicRoute.put("/update-address", userMiddleWare.isBlocked, addressController.updateAddress)

// order routes
publicRoute.get("/orders", userMiddleWare.isBlocked, orderController.currentOrders)
publicRoute.get("/order-history", userMiddleWare.isBlocked, orderController.orderHistory)
publicRoute.get("/canceled-orders", userMiddleWare.isBlocked, orderController.canceledOrders)
publicRoute.delete("/cancel-order", userMiddleWare.isBlocked, orderController.cancelOrder)
publicRoute.patch("/rate-food", userMiddleWare.isBlocked, orderController.rating)
publicRoute.get("/track-order", userMiddleWare.isBlocked, addressController.trackOrder)

//order tacking routes
publicRoute.get("/wallet", userMiddleWare.isBlocked, walletController.wallet)

//cart routes
publicRoute.post("/add-to-cart", userMiddleWare.checkUserBlocked, cartController.addToCart)
publicRoute.post("/delete-cart-item", userMiddleWare.isBlocked, cartController.deleteCartItem)
publicRoute.get("/cart", userMiddleWare.isBlocked, cartController.showCart)
publicRoute.patch("/update-cart-data", userMiddleWare.isBlocked, cartController.updateCartByQuantity)

//wishlist routes
publicRoute.get("/wishlist", userMiddleWare.isBlocked, wishlistController.loadWishlist)
// publicRoute.post("/delete-cart-item", userMiddleWare.isBlocked, cartController.deleteCartItem)
// publicRoute.get("/cart", userMiddleWare.isBlocked, cartController.showCart)
// publicRoute.patch("/update-cart-data", userMiddleWare.isBlocked, cartController.updateCartByQuantity)


//checkout Routes
publicRoute.get("/checkout",userMiddleWare.isBlocked, checkoutController.checkout)
publicRoute.post("/authCheckout",userMiddleWare.isBlocked,  checkoutController.authCheckout)
publicRoute.post("/success",userMiddleWare.isBlocked,  checkoutController.success)

//search route
publicRoute.get("/search-result", homeController.search)

//Payment Routes
publicRoute.post("/verify-payment",userMiddleWare.isBlocked, checkoutController.verifyPayment)
publicRoute.get("/success",userMiddleWare.isBlocked, checkoutController.success)
publicRoute.get("/failed",userMiddleWare.isBlocked, checkoutController.failed)

//invoice route
publicRoute.get("/generate-pdf/:orderId",userMiddleWare.isBlocked, orderController.downloadInvoice)











//export publicRoute
module.exports = publicRoute;