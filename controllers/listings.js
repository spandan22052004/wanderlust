const Listing = require("../models/listings");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req, res) => {
    const allListing = await Listing.find({});
    res.render("./listings/index.ejs", { allListing });
};

module.exports.newListing = (req, res) => {
    console.log(req.user);
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path :'reviews',populate :{path :'author',},}).populate('owner');
    if (!listing) {
        req.flash("error", "The Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    if (!req.body.listing) {
        req.flash("error", "Listing data is missing!");
        return res.redirect("/listings/new");
    }

    console.log(req.body);

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
    }).send();

    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new Listing(req.body.listing); 
    newListing.owner = req.user._id; 
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
     
    try {
        const savedListing = await newListing.save();
        console.log(savedListing);
        req.flash("success", "New Listing Saved!");
        res.redirect("/listings");
    } catch (e) {
        console.log(e);
        next(e);
    }
};

module.exports.filterListings = async (req, res) => {
    const { filterType } = req.params;
    const filteredListings = await Listing.find({ filter: filterType });

    res.render('./listings/index.ejs', { 
        allListing: filteredListings, 
        filterType
    });
};

module.exports.editListing = async (req, res) => { 
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let originalImage = listing.image.url;
    originalImage = originalImage.replace("/upload","/upload/h_200");


    res.render("./listings/edit.ejs", { listing , originalImage });
};
module.exports.updateListing = async (req, res) => { 
    let { id } = req.params;
    const listingData = req.body.listing;
    const updatedListing = await Listing.findByIdAndUpdate(id, listingData, { new: true });
    console.log(updatedListing);
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = {url,filename};
    await updatedListing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => { 
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};