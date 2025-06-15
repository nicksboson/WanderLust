const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');  

const MONGO_URL = 'mongodb://localhost:27017/wanderlust'; 

main()
.then(() => {
    console.log("Connected to MongoDB");
})
.catch(err => {
    console.error("Error connecting to MongoDB:", err);
}); 

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async ()=>{ 

    await Listing.deleteMany({});

    // Add owner to each listing object before inserting
    const listingsWithOwner = initdata.data.map((obj) => ({ ...obj, owner: '684f3797a13ce3e2daf85ec8' }));

    await Listing.insertMany(listingsWithOwner);
    console.log("Database initialized successfully ...");
};

initDB();