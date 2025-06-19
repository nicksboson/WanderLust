const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { validateReview, isValidId ,loggedIn} = require("../utils/middleware");
const reviewController = require("../controllers/reviewController");

//Review Section
router.post("/", validateReview, loggedIn, wrapAsync(reviewController.createReview));

// Delete Review Route
router.delete("/:reviewId", wrapAsync(reviewController.deleteReview));

module.exports = router; 