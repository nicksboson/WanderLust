const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { validateReview, isValidId } = require("../utils/middleware");

//Review Section
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newrev = new Review(
        req.body.review)
    newrev.author = "Anonymous"; // Set a default author
    await newrev.save(); // Save the review first
    listing.reviews.push(newrev._id); // Push only the ID to the listing's reviews array
    await listing.save(); // Then save the listing
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
    console.log("Review Deleted ........ ");
    res.redirect(`/listings/${id}`);
}));

module.exports = router; 