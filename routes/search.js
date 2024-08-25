const express = require('express');
const router = express.Router();
const Listing = require('../models/listings.js');

router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        const searchCriteria = {
            $or: [
                { location: new RegExp(query, 'i') },
                { category: new RegExp(query, 'i') },
                { title: new RegExp(query, 'i') },
                { country: new RegExp(query, 'i') }
            ]
        };

        if (!isNaN(query)) {
            searchCriteria.$or.push({ price: Number(query) });
        }

        const listings = await Listing.find(searchCriteria);

        const filterType = query;

        res.render("./listings/index", { listings, query, allListing: [], filterType });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
module.exports = router;