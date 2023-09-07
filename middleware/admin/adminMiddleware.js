const adminSessionCheck = (req,res,next) => {
    if (req.session.adminUser) {
        next();
    } else {
        res.redirect('/admin/login');
    } 
}

module.exports = {
    adminSessionCheck
}