const Users = require("../models/public/userModel")


//find deafault adderss
const getDefAddress = (addressId, userId) => {
    return new Promise(async(resolve, reject)=>{
        await Users.aggregate([
            {$match : {_id : userId }},
            {$unwind : '$addresses'},
            {$match : {"addresses._id" : addressId}},
            {$project : {
                _id : 0,
                addresses : 1
            }}
        ])
        .then((res)=>{
            resolve(res)
        })
        .catch((err)=>{
            reject(err)
        })
    })
}

module.exports = {
    getDefAddress
}