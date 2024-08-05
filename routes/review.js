const express = require("express");
const router = express.Router({mergeParams : true});
const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const {validateReview,IsloggedIn,isReviewAuthor} = require("../middleware.js");




//Review post
router.post("/",IsloggedIn,validateReview,wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    await listing.save();
    console.log("Review was saved");
    req.flash("success","New Review Saved!");
    res.redirect(`/listings/${listing._id}`);
}));
//Review Delete
router.delete("/:reviewId",IsloggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull :{reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
