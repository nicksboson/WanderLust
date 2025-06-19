const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { validateListing } = require("../utils/middleware");
const listingController = require("../controllers/listingController");



const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// Index route
router.get('/', wrapAsync(listingController.getAllListings));

// New listing form
router.get('/new', listingController.renderNewForm);

// My Listings route - MUST come before /:id route
router.get('/my-listings', wrapAsync(listingController.getMyListings));

// Create new listing
 router.post('/', upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));


// Show listing
router.get('/:id', wrapAsync(listingController.showListing));

// Edit form
router.get('/:id/edit', wrapAsync(listingController.renderEditForm));

// Update listing
router.put('/:id',upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing));

// Delete listing
router.delete('/:id', wrapAsync(listingController.deleteListing));

module.exports = router; 