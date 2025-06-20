const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');  
const Review = require('../models/review.js');
const User = require('../models/user.js');

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

const randomNames = [
  'Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy',
  'Mallory', 'Niaj', 'Olivia', 'Peggy', 'Rupert', 'Sybil', 'Trent', 'Uma', 'Victor', 'Wendy'
];

function getRandomEmail(name) {
  return `${name.toLowerCase()}@example.com`;
}

const goodComments = [
  "Amazing place! Had a wonderful time.",
  "Very clean and comfortable.",
  "Would definitely come back again.",
  "The host was very helpful.",
  "Great location and amenities.",
  "A hidden gem!",
  "Perfect for a weekend getaway.",
  "Loved the view!",
  "Highly recommended."
];

const badComments = [
  "Not as expected, but still good."
  // Add more negative comments if you want
];

const reviewComments = [...goodComments, ...badComments];

function getRatingForComment(comment) {
  if (goodComments.includes(comment)) {
    return Math.floor(Math.random() * 2) + 4; // 4 or 5
  } else if (badComments.includes(comment)) {
    return Math.floor(Math.random() * 2) + 1; // 1 or 2
  }
  return 3; // Neutral
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDateBefore(maxDate) {
  const max = maxDate.getTime();
  const min = new Date(2020, 0, 1).getTime(); // from Jan 1, 2020
  return new Date(Math.floor(Math.random() * (max - min)) + min);
}

const initDB = async ()=>{ 
    // Drop the entire database to ensure a clean slate
    await mongoose.connection.dropDatabase();

    // Seed users with random names and collect their IDs
    const userSeeds = randomNames.map(name => ({ email: getRandomEmail(name), username: name }));
    const createdUsers = await User.insertMany(userSeeds);
    const REVIEW_AUTHORS = createdUsers.map(user => user._id);
    // Pick a random owner for each listing
    const listingsWithOwner = initdata.data.map((obj) => ({ ...obj, owner: getRandomElement(REVIEW_AUTHORS) }));

    await Listing.insertMany(listingsWithOwner);
    console.log("Database initialized successfully ...");

    // Use the updated REVIEW_AUTHORS for reviews
    async function seedReviewsForListings() {
      const listings = await Listing.find({});
      const maxDate = new Date(2025, 5, 20); // June 20, 2025 (month is 0-indexed)
      for (let listing of listings) {
        const numReviews = Math.floor(Math.random() * 4) + 2; // 2-5 reviews per listing
        let reviewIds = [];
        for (let i = 0; i < numReviews; i++) {
          const comment = getRandomElement(reviewComments);
          const review = new Review({
            comment,
            rating: getRatingForComment(comment),
            author: getRandomElement(REVIEW_AUTHORS),
            createdAt: getRandomDateBefore(maxDate)
          });
          await review.save();
          reviewIds.push(review._id);
        }
        listing.reviews = reviewIds;
        await listing.save();
      }
      console.log("Random reviews seeded for all listings.");

      // Print all usernames in the database to verify
      const allUsers = await User.find({});
      console.log('All users in the database after seeding:');
      allUsers.forEach(u => console.log(u.username));

      // Print all reviews and their authors
      const allReviews = await Review.find({}).populate('author');
      console.log('All reviews and their authors:');
      allReviews.forEach(r => {
        console.log(`Review: ${r.comment}, Author: ${r.author ? r.author.username : 'No author'}, Rating: ${r.rating}`);
      });
    }

    await seedReviewsForListings();
};

initDB();