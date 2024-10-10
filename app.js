if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}
console.log(process.env.SECRET);


const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");
const Booking = require("./models/booking.js");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/reviews.js");
const session = require("express-session")
const flash = require("connect-flash");
const User = require("./models/users.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { IsloggedIn, isOwner, validateListing } = require("./middleware.js");
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
//--------------------------------------------------------//
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js");
const searchRouter = require("./routes/search.js");

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static("/public"));

main().then(() => {
    console.log("Connected with DB");
}).catch((err) => {
    console.error("Error connecting to database:", err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Set up nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

//Root route.....(0)
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

//Booking details



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demoUser",async(req,res)=>{
//  const fakeUser = new User({
//     email : "deltastudent123@gmail.com",
//     username :"delta-student"
//  });
//  let registerdUser = await User.register(fakeUser,"helloworld");
//  res.send(registerdUser);
// })
app.use("/listings", searchRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.get("/privacy", (req, res) => {
    res.render("includes/privacy.ejs");
});
app.get("/terms", (req, res) => {
    res.render("includes/terms.ejs");
});
//booking details 
app.get("/book/:id", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("./listings/book.ejs", { listing });
});
app.post("/booking/:id", async (req, res) => {
    try {

        if (!req.user) {
            req.flash("error", "You must be logged in to make a booking.");
            return res.redirect("/login");
        }
        // Fetch the listing to get the price

        const listing = await Listing.findById(req.params.id);
        const nights = (new Date(req.body.booking.checkOut) - new Date(req.body.booking.checkIn)) / (1000 * 60 * 60 * 24);
        const totalPrice = (listing.price * 0.18999999) + listing.price * nights; // Total price calculation

        const booking = new Booking({
            name: req.body.booking.name,
            email: req.body.booking.email,
            checkIn: req.body.booking.checkIn,
            checkOut: req.body.booking.checkOut,
            totalPrice: totalPrice,
            nights: nights,
            listing: req.params.id,
            user: req.user._id
        });

        await booking.save(); // Save the booking

        // Redirect to confirmation page
        res.redirect(`/payment/${booking._id}`);
    } catch (error) {
        console.log(error);
        req.flash("error", "There was an error processing your booking.");
        res.redirect(`/listings/${req.params.id}`); // Redirect back to the listing page
    }
});

app.get("/payment/:id", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('listing');
        if (!booking) {
            return res.status(404).send("Booking not found");
        }

        // Render your payment page here, passing the booking details
        res.render("./listings/payment.ejs", { booking });
    } catch (error) {
        console.log(error);
        req.flash("error", "Could not retrieve booking details for payment.");
        res.redirect("/");
    }
});

app.post("/process-payment/:id", async (req, res) => {
    const { id } = req.params;

    // Here, implement the payment processing logic (e.g., with a payment gateway)
    // After successful payment, update the booking status, send a confirmation email, etc.

    try {
        // Find the booking and populate necessary fields
        const booking = await Booking.findById(id).populate("listing user");
        if (!booking) {
            req.flash("error", "Booking not found.");
            return res.redirect(`/payment/${id}`);
        }
        // Amount in paise(razorpay accepts round off payments)
        const amountToPaise = Math.round(booking.totalPrice * 100 * 85);

        // Prepare Razorpay order creation payload
        const options = {
            amount: amountToPaise , 
            currency: "INR",
            receipt: `receipt_${id}`,
            payment_capture: 1
        };

        // Create an order using Razorpay API
        const order = await razorpay.orders.create(options);
        // Assuming the payment was successful
        req.flash("success", "Payment successful! Thank you for your booking.");
        // Send confirmation emails to both the user and the listing owner

        // 1. Email to the user
        const userMailOptions = {
            from: process.env.EMAIL_USER,
            to: booking.email, // User's email
            subject: "Booking Confirmation",
            text: `Dear ${booking.name},\n\nYour booking for the listing "${booking.listing.title}" has been confirmed! Your check-in date is ${booking.checkIn} and check-out date is ${booking.checkOut}. The total amount charged is ₹${booking.totalPrice}.\n\nThank you for booking with us!\nBest regards, Your Team`
        };

        // 2. Email to the listing owner
        const ownerMailOptions = {
            from: process.env.EMAIL_USER,
            to: booking.listing.owner.email, // Owner's email
            subject: "New Booking for Your Listing",
            text: `Dear ${booking.listing.owner.name},\n\nYour listing "${booking.listing.title}" has been booked by ${booking.name}. The check-in date is ${booking.checkIn} and check-out date is ${booking.checkOut}. The total price is ₹${booking.totalPrice}.\n\nThank you for hosting with us!\nBest regards, Your Team`
        };

        // Send both emails asynchronously
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(ownerMailOptions);

        // Redirect to confirmation page
        res.redirect(`/confirmation/${id}`); // Redirect to a confirmation page
    } catch (error) {
        console.log(error);
        req.flash("error", "Payment failed. Please try again.");
        res.redirect(`/payment/${id}`);
    }
});

app.get("/confirmation/:id", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('listing');
        if (!booking) {
            return res.status(404).send("Booking not found");
        }

        // Render the confirmation page with booking details
        res.render("./listings/confirmation.ejs", { booking });
    } catch (error) {
        console.log(error);
        req.flash("error", "Could not retrieve booking details.");
        res.redirect("/");
    }
});

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("./listings/error.ejs", { message });
})

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
