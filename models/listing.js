const mongoose = require('mongoose');
const Review = require("./review.js") // Ensure Review model is imported
const user = require("./user.js")
const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        default: "https://img.freepik.com/free-vector/abstract-elegant-geometric-shape-background-design_1017-50120.jpg?ga=GA1.1.1947215817.1749316461&semt=ais_items_boosted&w=740",
        type: String,
        set:(v)=> v===""?"https://img.freepik.com/free-vector/abstract-elegant-geometric-shape-background-design_1017-50120.jpg?ga=GA1.1.1947215817.1747215817&semt=ais_items_boosted&w=740": v // Default image if none provided
    },
    country: {
        type: String,
        required: true
    },
    reviews :[{
        type : mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner :{
        type : mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    
});

// Mongoose Middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
        console.log(`Deleted all reviews associated with listing: ${listing.title}`);
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;