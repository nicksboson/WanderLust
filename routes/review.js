const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { validateReview, isValidId ,loggedIn} = require("../utils/middleware");

//Review Section
router.post("/", validateReview, loggedIn,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newrev = new Review(
        req.body.review)
        // Set a default author
        newrev.author = req.user._id;
        console.log(newrev);
    await newrev.save(); // Save the review first
    listing.reviews.push(newrev._id); // Push only the ID to the listing's reviews array
    await listing.save(); // Then save the listing
    req.flash('success', 'Review added successfully!');
    console.log("Review Saved ........ ");
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // Remove review from listing's reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // Delete the review document itself
    await Review.findByIdAndDelete(reviewId);
    req.flash('error', 'Review deleted successfully!');
    console.log("Review Deleted ........ ");
    res.redirect(`/listings/${id}`);
}));

module.exports = router; 