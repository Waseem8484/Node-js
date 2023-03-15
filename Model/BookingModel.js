const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,

    required: [true, "Booking must belong to be tour"],
  },
  user: {
    type: mongoose.Schema.ObjectId,

    required: [true, "Booking must belong to be User"],
  },
  price: {
    type: Number,
    required: [true, "Booking must have a price"],
  },
  crteatedAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});
BookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "tour",
    select: "name",
  });
});

const BookingTour = mongoose.model("BookingTour", BookingSchema);
module.exports = BookingTour;
