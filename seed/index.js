const mongoose = require('mongoose');
const Listing = require('../models/listing');
const Review = require('../models/review');

const MONGO_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/wanderlust';

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB for seeding");
    } catch (err) {
        console.error("Error connecting to MongoDB for seeding:", err);
        process.exit(1);
    }
}

main();

const defaultReviewContents = [
    {
        comment: "Absolutely wonderful place! Highly recommended.",
        rating: 5,
    },
    {
        comment: "A pleasant stay, great location and good amenities.",
        rating: 4,
    },
    {
        comment: "Decent experience, could be better in some areas.",
        rating: 3,
    }
];

async function seedReviewsAndListings() {
    try {
        console.log("Starting to seed reviews for each listing...");

        // Get all listings
        const allListings = await Listing.find({});

        for (let listing of allListings) {
            // Remove existing SeederBot reviews for this listing (for idempotency)
            // First, find the IDs of reviews by SeederBot that are linked to this listing
            const reviewsToRemove = await Review.find({ _id: { $in: listing.reviews }, author: "SeederBot" });
            const reviewIdsToRemove = reviewsToRemove.map(review => review._id);
            
            if (reviewIdsToRemove.length > 0) {
                // Remove review IDs from the listing's array
                listing.reviews = listing.reviews.filter(reviewId => !reviewIdsToRemove.includes(reviewId));
                // Delete the actual review documents
                await Review.deleteMany({ _id: { $in: reviewIdsToRemove } });
                await listing.save(); // Save listing after removing old reviews
                console.log(`Cleaned up old SeederBot reviews for listing: ${listing.title}`);
            }

            // Create 3 NEW review documents for EACH listing
            const newReviewsForListing = [];
            for (let i = 0; i < 3; i++) {
                const reviewData = defaultReviewContents[i % defaultReviewContents.length]; // Cycle through content
                const newReview = new Review({
                    ...reviewData,
                   
                });
                
                await newReview.save();
                newReviewsForListing.push(newReview._id);
            }
            
            // Add these new unique review IDs to the current listing
            listing.reviews.push(...newReviewsForListing);
            await listing.save();
            console.log(`Added 3 unique reviews to listing: ${listing.title}`);
        }

        console.log("Finished seeding reviews for all listings.");

    } catch (err) {
        console.error("Error during seeding:", err);
    } finally {
        mongoose.connection.close();
        console.log("MongoDB connection closed.");
    }
}

// Run the seeding function after successful connection
mongoose.connection.once('open', () => {
    seedReviewsAndListings();
}); 