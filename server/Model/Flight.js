import mongoose from "mongoose";

const FlightSchema = mongoose.Schema({
  flightId: {
    type: String,
    required: true,
    unique: true,
  },
  destination: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  airline: {
    type: String,
    required: true,
  },
});

const FlightModel = mongoose.model("Flight", FlightSchema, "Flight");

export default FlightModel;
