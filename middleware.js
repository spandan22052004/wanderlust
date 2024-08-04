const mongoose= require("mongoose");
const Listing = require("./models/listings");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");




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

module.exports.isOwner = async(req,res,next)=>{
 let{id} = req.params;
 let listing = await Listing.findById(id);
 if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
 }
 next();
};


module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}
