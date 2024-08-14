const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { IsloggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");


// Routes
// Index Route.......(1)
router.get("/", wrapAsync(listingController.index));

// New Route.........(3)
router.get("/new", IsloggedIn, listingController.newListing);

// Show route........(2)
router.get("/:id", wrapAsync(listingController.showListing));

// Create Route...(4)
router.post("/", IsloggedIn, validateListing, wrapAsync(listingController.createListing));

// Edit Route.....(5)
router.get("/:id/edit", IsloggedIn,isOwner, wrapAsync(listingController.editListing));

// Update Route....(6)
router.put("/:id", IsloggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));

// Delete Route .....(7)
router.delete("/:id", IsloggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports = router;
