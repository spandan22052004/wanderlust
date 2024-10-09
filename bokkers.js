const mongoose = require('mongoose');
const Booking = require('./models/booking');  // Assuming the booking model is saved here
const Listing = require('./models/listings');  // Assuming you have a listing model as well

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

async function createDemoBooking() {
    try {
        const listing = await Listing.findOne(); // Assuming you have a listing in your collection
        if (!listing) {
            console.log("No listing found. Please create one first.");
            return;
        }

        const demoBooking = new Booking({
            name: "John Doe",
            email: "john@example.com",
            checkIn: new Date('2024-10-15'),
            checkOut: new Date('2024-10-20'),
            totalPrice: 500,
            listing:"670141c78e3a502f3fde53d8", // Reference an existing listing's ID
        });

        await demoBooking.save();
        console.log("Demo booking created:", demoBooking);
        mongoose.connection.close();
    } catch (err) {
        console.error("Error creating demo booking:", err);
        mongoose.connection.close();
    }
}

createDemoBooking();
