const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  nights: {
    type: Number,
    required: true,
  },
  listing: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Razorpay order ID
  razorpay_order_id: {
    type: String,
    default: null,
  },
  // Payment status
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  // Store the payment failure reason if any
  paymentFailureReason: {
    type: String,
    default: null,
  },
}, {
  timestamps: true // Automatically adds `createdAt` and `updatedAt`
});

// Pre-save middleware to validate check-in and check-out dates
bookingSchema.pre("save", function(next) {
  if (this.checkIn >= this.checkOut) {
    const error = new Error("Check-in date must be before check-out date.");
    return next(error);
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
