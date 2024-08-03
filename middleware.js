module.exports.IsloggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to take any action!");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl = (req,res,next) => {
    if (req.session.redirectUrl) {
        res.locals.saveRedirect = req.session.redirectUrl;
    }
    next();
};
