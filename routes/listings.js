const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { IsloggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


// Routes
// Index Route.......(1) &&  // Create Route...(4)
router.route("/")
.get(wrapAsync(listingController.index))
.post(IsloggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));



// New Route.........(3)
router.get("/new", IsloggedIn, listingController.newListing);

// Show route........(2) && // Update Route....(6) && // Delete Route .....(7)
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(IsloggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
.delete(IsloggedIn,isOwner,wrapAsync(listingController.destroyListing));


// Edit Route.....(5)
router.get("/:id/edit", IsloggedIn,isOwner, wrapAsync(listingController.editListing));


router.get("/filter/:filterType",IsloggedIn,wrapAsync(listingController.filterListings));





module.exports = router;
