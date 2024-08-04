const express = require("express");
const router = express.Router({mergeParams : true});
const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const {validateReview} = require("../middleware.js");




//Review post
router.post("/",validateReview,wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("Review was saved");
    req.flash("success","New Review Saved!");
    res.redirect(`/listings/${listing._id}`);
}));
//Review Delete
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull :{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
