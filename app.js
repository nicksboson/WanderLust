require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/database');
const configureExpress = require('./config/express');
const { notFoundHandler, errorHandler } = require('./utils/errorHandler');

// Import routers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");

// Configure Express
configureExpress(app);

// Routes
app.get('/', (req, res) => {
    res.render("listings/home.ejs");
});

// Use Routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

// Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server only after MongoDB connection
connectDB().then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1);
}); 