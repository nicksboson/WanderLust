require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ejs = require('ejs');

// Middleware setup
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// View engine setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MongoDB connection
const MONGO_URL = 'mongodb://localhost:27017/wanderlust';

async function main() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

// Routes
app.get('/', (req, res) => {
    res.send("Welcome to Wanderlust!");
});

app.get('/listings', async (req, res, next) => {
    try {
        const listings = await Listing.find({});
        res.render('./listings/index.ejs', { listings });
    } catch (err) {
        next(err);
    }
});

app.get('/listings/new', (req, res) => {
    res.render('./listings/new.ejs');
});

app.get('/listings/:id', async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            throw new Error('Listing not found');
        }
        res.render('./listings/show.ejs', { listing });
    } catch (err) {
        next(err);
    }
});

app.post('/listings', async (req, res, next) => {
    try {
        const newlisting = new Listing(req.body.listing);
        await newlisting.save();
        res.redirect(`/listings`);
    } catch (err) {
        next(err);
    }
});

app.get('/listings/:id/edit', async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            throw new Error('Listing not found');
        }
        res.render('./listings/edit.ejs', { listing });
    } catch (err) {
        next(err);
    }
});

app.put('/listings/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
        if (!updatedListing) {
            throw new Error('Listing not found');
        }
        res.redirect(`/listings/${updatedListing._id}`);
    } catch (err) {
        next(err);
    }
});

app.delete('/listings/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(id);
        if (!deletedListing) {
            throw new Error('Listing not found');
        }
        res.redirect('/listings');
    } catch (err) {
        next(err);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something went wrong!');
});

// Start server only after MongoDB connection
main().then(() => {
    app.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
}).catch(err => {
    console.error("Failed to start server:", err);
    process.exit(1);
}); 