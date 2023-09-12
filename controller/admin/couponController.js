const Coupon = require("../../models/admin/couponModel")
const mongoose = require('mongoose')

//----------------------------------------------------------------------------------------

//load coupon page
const showcoupon = async (req,res)=>{
    try {
        const couponData = await Coupon.find({}).sort({_id : -1})
        res.status(200).render("admin/coupon/index", {data : couponData})
    } catch (error) {
        res.status(500).render("admin/errorPage", {msg : error.message})
    }
}

//----------------------------------------------------------------------------------------

//load create coupon
const createcoupon = async (req,res)=>{
    try {
        res.status(200).render("admin/coupon/create")
    } catch (error) {
        res.status(500).render("admin/errorPage", {msg : error.message})
    }
}


//----------------------------------------------------------------------------------------

//load edit coupon
const editcoupon = async (req,res)=>{
    try {
        const id = req.query.id
        const getcouponData = await Coupon.findOne({_id : id})
        if(!getcouponData){
            return res.status(404).render("admin/coupon/index", {status : "error",  msg :  "Unable to edit the coupon" })
        }
        res.status(200).render("admin/coupon/edit", {coupon : getcouponData})
    } catch (error) {
        res.status(500).render("admin/errorPage", {msg : error.message})
    }
}


//----------------------------------------------------------------------------------------

//delete coupon
const deletecoupon = async (req,res)=>{
    try {
        const{ id } = req.body
        await Coupon.deleteOne({_id : new mongoose.Types.ObjectId(id)})
        .then((response)=>{
            return res.status(200).json({status : "success", msg : "Coupon Deleted"})
        })
    } catch (error) {
        return res.status(500).json({status : "error", msg : "Cannot delete Coupon"})
    }
}


//----------------------------------------------------------------------------------------

//save coupon
const savecoupon = async (req,res)=>{
    try {
        let {couponName, discount, minPurchase, maxAmount, validity} = req.body
        couponName = couponName.trim()
        const isExisting = await Coupon.findOne({couponName})
        if(isExisting){
            return res.status(400).json({status : "error", msg : "Coupon already exist"})
        }
        const newcoupon = new Coupon({
            couponName: couponName,
            discount: discount,
            minPurchase: minPurchase,
            maxAmount: maxAmount,
            validity: validity,
            status : true
        })
        await newcoupon.save()
        res.status(200).json({status : "success", msg : "Coupon Inserted"})
    } catch (error) {
        return res.status(500).json({status : "error", msg : "coupon insertion failed"})
    }
}


//----------------------------------------------------------------------------------------

//update coupon
const updatecoupon = async (req,res)=>{
    try {
        let {couponName, prevCouponName, couponId, discount, minPurchase, maxAmount, validity} = req.body
        couponName = couponName.trim()
        if(prevCouponName !== couponName){
            const isExisting = await Coupon.findOne({couponName})
            if(isExisting){
                return res.status(400).json({status : "error", msg : "Coupon already exist"})
            }
        }
        
        await Coupon.updateOne({_id : new mongoose.Types.ObjectId(couponId)},
        {
            $set : {
                couponName: couponName,
                discount: discount,
                minPurchase: minPurchase,
                maxAmount: maxAmount,
                validity: validity
            }
        })
        .then((response)=>{
            res.status(200).json({status : "success", msg : "Coupon Updated"})
        })
    } catch (error) {
        return res.status(500).json({status : "error", msg : "coupon insertion failed"})
    }
}


//----------------------------------------------------------------------------------------

//change coupon status
const couponStatus = async (req,res)=>{
    try {
        const {status, orderId} = req.body
        await Coupon.updateOne({_id : orderId}, {$set : {status : status}})
        .then((response)=>{
            return res.status(200).json({status : "success", msg : "Status Changed", btnStatus: status})
        })
    } catch (error) {
        return res.status(400).json({status : "error", msg : "Unable to change status"})
    }
}


//----------------------------------------------------------------------------------------

//export the functions
module.exports = {
    showcoupon,
    createcoupon,
    savecoupon,
    editcoupon,
    updatecoupon,
    deletecoupon,
    couponStatus
}