const express = require("express");
const router = express.Router({mergeParams : true});
const Review = require("../models/reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const {validateReview,IsloggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



//Review post
router.post("/",IsloggedIn,validateReview,wrapAsync(reviewController.createReview));
//Review Delete
router.delete("/:reviewId",IsloggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;
