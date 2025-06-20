const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const mongoose = require('mongoose');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.getAllListings = async (req, res) => {
    const { search, category } = req.query;
    let query = {};
    if (search) {
        const searchRegex = new RegExp(search, 'i');
        query = {
            $or: [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { location: { $regex: searchRegex } },
                { country: { $regex: searchRegex } }
            ]
        };
    }
    if (category) {
        if (Array.isArray(category)) {
            query.category = { $in: category };
        } else {
            query.category = category;
        }
    }
    const listings = await Listing.find(query).populate('reviews');
    listings.forEach(listing => {
        if (listing.reviews && listing.reviews.length > 0) {
            const totalRating = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
            listing.averageRating = (totalRating / listing.reviews.length).toFixed(1);
            listing.numReviews = listing.reviews.length;
        } else {
            listing.averageRating = 0;
            listing.numReviews = 0;
        }
    });
    res.render('./listings/index.ejs', { listings, search, category });
};

exports.renderNewForm = (req, res) => {
    res.render('./listings/new.ejs');
};

exports.getMyListings = async (req, res) => {
    if (!req.user) {
        req.flash('error', 'You must be logged in to view your listings');
        return res.redirect('/login');
    }
    const listings = await Listing.find({ owner: req.user._id }).populate('reviews');
    listings.forEach(listing => {
        if (listing.reviews && listing.reviews.length > 0) {
            const totalRating = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
            listing.averageRating = (totalRating / listing.reviews.length).toFixed(1);
            listing.numReviews = listing.reviews.length;
        } else {
            listing.averageRating = 0;
            listing.numReviews = 0;
        }
    });
    res.render('./listings/my-listings.ejs', { listings });
};

exports.createListing = async (req, res) => {
    let url = req.file.path;
    // Ensure category is always an array
    if (req.body.listing.category && !Array.isArray(req.body.listing.category)) {
        req.body.listing.category = [req.body.listing.category];
    }
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = url;
    await newlisting.save();
    req.flash('success', 'Successfully created a new listing !');
    res.redirect(`/listings`);
};

exports.showListing = async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
        throw new ExpressError(400, "Invalid listing ID");
    }
    const listing = await Listing.findById(id).populate({path: 'reviews',populate: {path : 'author'}}).populate('owner');
    if (!listing) {
        throw new ExpressError(404, 'Listing not found');
    }
    res.render('./listings/show.ejs', { listing });
};

exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
        throw new ExpressError(400, "Invalid listing ID");
    }
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, 'Listing not found');
    }
    res.render('./listings/edit.ejs', { listing });
};

exports.updateListing = async (req, res) => {
    const { id } = req.params;
    if (!isValidId(id)) {
        throw new ExpressError(400, "Invalid listing ID");
    }

    // Ensure category is always an array
    if (req.body.listing.category && !Array.isArray(req.body.listing.category)) {
        req.body.listing.category = [req.body.listing.category];
    }

    let imageUrl;
    if (req.file) {
        imageUrl = req.file.path;
    } else {
        // Fetch the current listing from the database to get the existing image
        const currentListing = await Listing.findById(id);
        imageUrl = currentListing.image;
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { 
        new: true,
        runValidators: true
    });
    if (!updatedListing) {
        throw new ExpressError(404, 'Listing not found');
    }
    updatedListing.image = imageUrl;
    await updatedListing.save();
    req.flash('info', 'Listing updated successfully!');
    res.redirect(`/listings/${updatedListing._id}`);
};

exports.deleteListing = async (req, res) => {
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
}; 