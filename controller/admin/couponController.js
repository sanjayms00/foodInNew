const Coupon = require("../../models/admin/couponModel")
const mongoose = require('mongoose')
const showcoupon = async (req,res)=>{
    try {
        const couponData = await Coupon.find({}).sort({_id : -1})
        res.status(200).render("admin/coupon/index", {data : couponData})
    } catch (error) {
        console.log(error.message)
    }
}

const createcoupon = async (req,res)=>{
    try {
        res.status(200).render("admin/coupon/create")
    } catch (error) {
        console.log(error.message)
    }
}

const editcoupon = async (req,res)=>{
    try {
        const getcouponData = await Coupon.findOne({_id : req.query.id})
        if(!getcouponData){
            return res.status(404).render("admin/coupon/index", {status : "error",  msg :  "Unable to edit the coupon" })
        }
        res.status(200).render("admin/coupon/edit", {coupon : getcouponData})
    } catch (error) {
        console.log(error.message)
    }
}

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
        .then((response)=>{
            res.status(200).json({status : "success", msg : "Coupon Inserted"})
        })
    } catch (error) {
        return res.status(500).json({status : "error", msg : "coupon insertion failed"})
    }
}

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
        console.log(error.message)
        return res.status(500).json({status : "error", msg : "coupon insertion failed"})
    }
}


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



module.exports = {
    showcoupon,
    createcoupon,
    savecoupon,
    editcoupon,
    updatecoupon,
    deletecoupon,
    couponStatus

}