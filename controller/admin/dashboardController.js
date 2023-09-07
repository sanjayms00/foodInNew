const Orders = require("../../models/admin/ordersModel")

//load dashboard
const dashboard = async (req, res) => {
    try{
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();
        
        const todaysaleData = await Orders.aggregate([
            {
                $match : {
                    time :  {
                                $gte: new Date(currentYear, currentMonth - 1, currentDay),
                                $lt: new Date(currentYear, currentMonth - 1, currentDay + 1)
                            },
                    paymentStatus : 'recieved' ,
                    status : 'delivered'
                }
            },
            {
                $group: {
                    _id: null,
                    totalTodaySales: { $sum: 1 }, 
                    totalAmount: { $sum: { $add: ['$subTotal', '$walletAmount'] } } 
                }
            }
        ])
        console.log(todaysaleData)
        const canceledOrders = await Orders.find({
            time : { 
                $gte: new Date(currentYear, currentMonth - 1, currentDay), 
                $lt: new Date(currentYear, currentMonth - 1, currentDay + 1)
            },
            status : 'canceled'
        }).count()
        if(todaysaleData.length > 0 ){
            const totalSales = todaysaleData[0].totalTodaySales ? todaysaleData[0].totalTodaySales : 0
            res.render('admin/dashboard', {orders : totalSales, totalAmount : todaysaleData[0].totalAmount, canceled : canceledOrders})
        }else{
            
            res.render('admin/dashboard', {orders : 0, totalAmount : 0, canceled : 0})

        }
    }
    catch (error) {
        res.status(500).render("public/errorPage", { layout: false, status: 'error', msg: error.message });
    }
}
//for graph
const getSaleData = async (req, res) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        let nextYear = currentYear;
        let nextMonth = currentMonth + 1;

        console.log(currentMonth, nextMonth)
        if (nextMonth > 12) {
            nextMonth = 1;
            nextYear++;
        }
        const graphValue = await Orders.aggregate([
            {
                $match : {
                    time :  {
                        $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                        $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
                    }, 
                    paymentStatus : 'recieved', 
                    status : 'delivered'
                }
            },{
                $group : {
                        _id : {month : {$month : '$time'}},
                        totalSubTotal : { $sum: { $add: ['$subTotal', '$walletAmount'] }} 
                    }
            },
            {$sort : {'_id.month' : 1}}
            
        ]);
        
        const monthlyOrderPrices = Array.from({ length: 12 }, () => 0);
        for(let i = 0; i < graphValue.length ; i++){
            if(graphValue[i]._id.month){
                monthlyOrderPrices[graphValue[i]._id.month-1] = graphValue[i].totalSubTotal
            }
        }
        //console.log(monthlyOrderPrices)
        res.json({item : monthlyOrderPrices,})
}

//for report
async function getOrderReport(stat){
    try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate()

        let nextYear = currentYear;
        let nextMonth = currentMonth + 1;

        //console.log(currentMonth, nextMonth)
        if (nextMonth > 12) {
            nextMonth = 1;
            nextYear++;
        }
        let match = ''
        if(stat === 'today'){
            match = {
                time :  {
                    $gte: new Date(currentYear, currentMonth-1, currentDay),
                    $lt: new Date(currentYear, currentMonth - 1, currentDay + 1)
                },
                paymentStatus : 'recieved' ,
                status : 'delivered'
            }
        }else if(stat === 'month'){
            match = {
                time: {
                    $gte: new Date(`${currentYear}-${currentMonth.toString().padStart(2, '0')}-01T00:00:00.000Z`),
                    $lt: new Date(`${currentYear}-${nextMonth.toString().padStart(2, '0')}-01T00:00:00.000Z`)
                },
                paymentStatus: 'recieved',
                status: 'delivered'
            }
        }else if(stat === "year"){
            match = {
                time: {
                    $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                    $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
                },
                paymentStatus: 'recieved',
                status: 'delivered'
            }
        }
        console.log(match)
        const orderReport = await Orders.aggregate([
            {
                $match: match
            }, 
            {
                $lookup : {
                    from: 'users',
                    localField : 'user',
                    foreignField : '_id',
                    as : 'userData'
                }
            },
            {
                $unwind: '$userData'
            },
            {
                $project : {
                    _id : 0,
                    firstName : '$userData.firstName',
                    lastName : '$userData.lastName',
                    orderDetails : {
                        time: '$time',
                        orderId : '$_id',
                        status : '$status',
                        address : '$address',
                        paymentStatus : '$paymentStatus',
                        paymentMethod : '$paymentMethod',
                        walletAmount : '$walletAmount',
                        subTotal : '$subTotal',
                    }
                }
            }
        ]);
        return orderReport
    } catch (error) {
        
    }
}

const showSalesDataGet = async (req, res) => {
    const stat = req.query.sortBy || 'today'
    const orderReport = await getOrderReport(stat)
    res.render("admin/saleDataPage", {orderReport, orders : orderReport.length})
}

//export all functions like objects
module.exports = {
    dashboard,
    getSaleData,
    showSalesDataGet,
    
}