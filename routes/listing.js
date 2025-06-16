const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { validateListing } = require("../utils/middleware");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const mongoose = require('mongoose');

// Validate MongoDB ID
const isValidId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

// Index route
router.get('/', wrapAsync(async (req, res) => {
    const listings = await Listing.find({}).populate('reviews');
    
    // Calculate average rating for each listing
    listings.forEach(listing => {
        if (listing.reviews && listing.reviews.length > 0) {
            const totalRating = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
            listing.averageRating = (totalRating / listing.reviews.length).toFixed(1); // To one decimal place
            listing.numReviews = listing.reviews.length; // Keep for internal calculation, not displayed now
        } else {
            listing.averageRating = 0;
            listing.numReviews = 0;
        }
    });

    res.render('./listings/index.ejs', { listings });
}));

// New listing form
router.get('/new', (req, res) => {
    res.render('./listings/new.ejs');
});

// Create new listing
router.post('/', validateListing, wrapAsync(async (req, res) => {
    const newlisting = new Listing(req.body.listing);
    newlisting.owner= req.user._id;
    await newlisting.save();
    req.flash('success', 'Successfully created a new listing !');
    res.redirect(`/listings`);
}));

// Show listing
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
        throw new ExpressError(400, "Invalid listing ID");
    }
    const listing = await Listing.findById(id).populate({path: 'reviews',populate: {path : 'author'}}).populate('owner');
    console.log(listing);
    if (!listing) {
        throw new ExpressError(404, 'Listing not found');
    }
    res.render('./listings/show.ejs', { listing });
}));

// Edit form
router.get('/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
        throw new ExpressError(400, "Invalid listing ID");
    }
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, 'Listing not found');
    }
    res.render('./listings/edit.ejs', { listing });
}));

// Update listing
router.put('/:id', validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
        throw new ExpressError(400, "Invalid listing ID");
    }
    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { 
        new: true,
        runValidators: true
    });
    if (!updatedListing) {
        throw new ExpressError(404, 'Listing not found');
    }
    req.flash('info', 'Listing updated successfully!');
    res.redirect(`/listings/${updatedListing._id}`);
}));

// Delete listing
router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
        throw new ExpressError(400, "Invalid listing ID");
    }
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        throw new ExpressError(404, 'Listing not found');
    }
    req.flash('error', 'Listing deleted successfully!');
    res.redirect('/listings');
}));

module.exports = router; 