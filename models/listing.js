const mongoose = require('mongoose');

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
        set:(v)=> v===""?"https://img.freepik.com/free-vector/abstract-elegant-geometric-shape-background-design_1017-50120.jpg?ga=GA1.1.1947215817.1749316461&semt=ais_items_boosted&w=740": v // Default image if none provided
    },
    country: {
        type: String,
        required: true
    }
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;