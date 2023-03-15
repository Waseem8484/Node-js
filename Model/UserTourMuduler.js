const mongoose = require("mongoose");

const dataschema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "must be name"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    require: [true, "must be price"],
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
  image: {
    data: Buffer,
    contentType: String,
  },
});

const data = mongoose.model("Data", dataschema);
module.exports = data;
