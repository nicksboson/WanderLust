const Listing = require("../models/listing");
const Review = require("../models/review");

exports.createReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newrev = new Review(req.body.review);
    newrev.author = req.user._id;
    await newrev.save();
    listing.reviews.push(newrev._id);
    await listing.save();
    req.flash('success', 'Review added successfully!');
    res.redirect(`/listings/${listing._id}`);
};

exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('error', 'Review deleted successfully!');
    res.redirect(`/listings/${id}`);
}; 