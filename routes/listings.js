const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { IsloggedIn } = require("../middleware.js");

// Validation Middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

// Routes
// Index Route.......(1)
router.get("/", wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", { allListing });
}));

// New Route.........(3)
router.get("/new", IsloggedIn, (req, res) => {
    console.log(req.user);
    res.render("./listings/new.ejs");
});

// Show route........(2)
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews').populate('owner');
    if (!listing) {
        req.flash("error", "The Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
}));

// Create Route...(4)
router.post("/", IsloggedIn, validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; 
    await newListing.save();
    req.flash("success", "New Listing Saved!");
    res.redirect("/listings");
}));

// Edit Route.....(5)
router.get("/:id/edit", IsloggedIn, wrapAsync(async (req, res) => { 
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
}));

// Update Route....(6)
router.put("/:id", IsloggedIn, validateListing, wrapAsync(async (req, res) => { 
    let { id } = req.params;
    const listingData = req.body.listing;
    const updatedListing = await Listing.findByIdAndUpdate(id, listingData, { new: true });
    console.log(updatedListing);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));

// Delete Route .....(7)
router.delete("/:id", IsloggedIn, wrapAsync(async (req, res) => { 
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;
