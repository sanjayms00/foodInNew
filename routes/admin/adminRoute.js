
require("dotenv").config()
const express = require("express")
const adminRoute = express.Router()
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const mongoDBSession = require("connect-mongodb-session")(session)

const multer = require("multer")
const uploads = multer({ 
    storage: multer.memoryStorage(),
    limits: {
      fieldSize: 10 * 1024 * 1024, 
      // Increase the limit to 10MB (adjust as needed)
    }
  });

const store = mongoDBSession({
    uri : process.env.DATABSE_URL,
    collection : "adminSessions"
})

//session middlware
adminRoute.use(session({
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : false,
    store : store
}))

//importing the controllers
const dashboardController = require("../../controller/admin/dashboardController")
const adminConfigController = require("../../controller/admin/adminConfigController")
const userController = require("../../controller/admin/userController")
const foodController = require("../../controller/admin/foodController")
const categoryController = require("../../controller/admin/categoryController")
const couponController = require("../../controller/admin/couponController")
const ordersController = require("../../controller/admin/ordersController")
const bannerController = require('../../controller/admin/bannerController')



const adminMiddleware = require("../../middleware/admin/adminMiddleware")

adminRoute.use(expressLayouts)

//authentication routes
adminRoute.get("/",adminConfigController.admin)
adminRoute.get("/login",adminConfigController.login)
adminRoute.post("/auth",adminConfigController.auth)
adminRoute.get("/auth",adminConfigController.login)
adminRoute.get("/logout",adminConfigController.logout)

//dashboard routes
adminRoute.get("/dashboard", adminMiddleware.adminSessionCheck, dashboardController.dashboard)
adminRoute.get("/sales-report", adminMiddleware.adminSessionCheck, dashboardController.showSalesDataGet)
adminRoute.get("/get-sale-data", adminMiddleware.adminSessionCheck, dashboardController.getSaleData)

//user routes
adminRoute.get("/users", adminMiddleware.adminSessionCheck, userController.showusers)
adminRoute.post("/userStatus", adminMiddleware.adminSessionCheck, userController.userStatus)

//banner routes
adminRoute.get("/banner", adminMiddleware.adminSessionCheck, bannerController.showBanner)
adminRoute.get("/create-banner", adminMiddleware.adminSessionCheck, bannerController.createBanner)
adminRoute.get("/edit-banner", adminMiddleware.adminSessionCheck, bannerController.editBanner)
adminRoute.post("/save-banner",adminMiddleware.adminSessionCheck, uploads.single('file_photo'), bannerController.saveBanner)
adminRoute.post("/update-banner", adminMiddleware.adminSessionCheck, uploads.single('file_photo'), bannerController.updateBanner)
adminRoute.delete("/delete-banner", adminMiddleware.adminSessionCheck, bannerController.deleteBanner)
adminRoute.patch("/banner-status", adminMiddleware.adminSessionCheck, bannerController.changeStatus)
adminRoute.patch("/banner-position", adminMiddleware.adminSessionCheck, bannerController.changePosition)

//food routes
adminRoute.get("/food", adminMiddleware.adminSessionCheck, foodController.showFood)
adminRoute.get("/createFood",adminMiddleware.adminSessionCheck, foodController.createFood)
adminRoute.post("/save-food", uploads.single('file_photo'), foodController.saveFood)
adminRoute.post("/updateFood", uploads.single('file_photo'), foodController.updateFood)
adminRoute.get("/editFood",adminMiddleware.adminSessionCheck, foodController.editFood)
adminRoute.get("/deleteFood",adminMiddleware.adminSessionCheck, foodController.deleteFood)
adminRoute.patch("/foodStatus", adminMiddleware.adminSessionCheck, foodController.foodStatus)

//category routes
adminRoute.get("/category", adminMiddleware.adminSessionCheck, categoryController.showCategory)
adminRoute.get("/createCategory",adminMiddleware.adminSessionCheck, categoryController.createCategory)
adminRoute.post("/saveCategory",adminMiddleware.adminSessionCheck, categoryController.saveCategory)
adminRoute.get("/editCategory",adminMiddleware.adminSessionCheck, categoryController.editCategory)
adminRoute.post("/updatecategory",adminMiddleware.adminSessionCheck, categoryController.updateCategory)
adminRoute.delete("/deleteCategory",adminMiddleware.adminSessionCheck, categoryController.deleteCategory)
adminRoute.post("/categoryStatus",adminMiddleware.adminSessionCheck, categoryController.categoryStatus)

//Coupon routes
adminRoute.get("/coupons", adminMiddleware.adminSessionCheck, couponController.showcoupon)
adminRoute.get("/createcoupon",adminMiddleware.adminSessionCheck, couponController.createcoupon)
adminRoute.post("/savecoupon",adminMiddleware.adminSessionCheck, couponController.savecoupon)
adminRoute.get("/editcoupon",adminMiddleware.adminSessionCheck, couponController.editcoupon)
adminRoute.put("/updatecoupon",adminMiddleware.adminSessionCheck, couponController.updatecoupon)
adminRoute.delete("/deletecoupon",adminMiddleware.adminSessionCheck, couponController.deletecoupon)
adminRoute.post("/couponStatus",adminMiddleware.adminSessionCheck, couponController.couponStatus)


//order routes
adminRoute.get("/orders", adminMiddleware.adminSessionCheck, ordersController.showOrders)
adminRoute.patch("/cancel-order", adminMiddleware.adminSessionCheck, ordersController.cancelOrder)
adminRoute.post("/change-status", adminMiddleware.adminSessionCheck, ordersController.changeStatus)

//export adminRoute
module.exports = adminRoute