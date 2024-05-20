import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import UserModel from "./Model/Users.js";
import FlightModel from "./Model/Flight.js";
import bcrypt from "bcrypt";

let app = express();

app.use(cors());
app.use(express.json());

app.post("/login", async (req, res) => {
  try {
    const { remail, rpassword } = req.body;
    const User = await UserModel.findOne({ email: remail });
    if (!User) {
      return res.status(500).json({ msg: "User not found" });
    } else {
      if (User.password === rpassword)
        return res.status(200).json({ User, msg: "Success.." });
      else return res.status(401).json({ msg: "Authentication Failed.." });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.post("/registerUser", async (req, res) => {
  try {
    const { email, phoneNumber, password } = req.body;

    // Check if a user with the same email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use." });
    }

    const user = new UserModel({
      email,
      phoneNumber,
      password,
    });

    await user.save();
    res.send({ user, msg: "Added." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post("/addFlight", async (req, res) => {
  try {
    const flightId = req.body.flightId;
    // Check if flight with the same ID already exists
    const existingFlight = await FlightModel.findOne({ flightId });
    if (existingFlight) {
      return res
        .status(400)
        .json({ error: "Flight with this ID already exists." });
    } else {
      const destination = req.body.destination;
      const date = req.body.date;
      const time = req.body.time;
      const price = req.body.price;
      const airline = req.body.airline;

      const flight = new FlightModel({
        flightId: flightId,
        destination: destination,
        date: date,
        time: time,
        price: price,
        airline: airline,
      });
    }

    await flight.save();
    res.send({ flight: flight, msg: "Flight Added." });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

app.delete("/flights/:flightId", async (req, res) => {
  try {
    const flightId = req.params.flightId;

    // Check if flight exists
    const flight = await FlightModel.findOne({ flightId });
    if (!flight) {
      return res.status(404).json({ error: "Flight not found." });
    }

    // Delete the flight
    await FlightModel.deleteOne({ flightId });

    res.json({ msg: "Flight deleted successfully." });
  } catch (error) {
    console.error("Error deleting flight:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Update flight
app.put("/updateFlight/:flightId", async (req, res) => {
  try {
    const flightId = req.params.flightId;
    const { destination, date, time, price, airline } = req.body;

    // Check if flight exists
    const flight = await FlightModel.findOne({ flightId });
    if (!flight) {
      return res.status(404).json({ error: "Flight not found." });
    }

    // Update the flight properties (if provided)
    if (destination) flight.destination = destination;
    if (date) flight.date = date;
    if (time) flight.time = time;
    if (price) flight.price = price;
    if (airline) flight.airline = airline;

    // Save the updated flight to the database
    const updatedFlight = await flight.save();

    res.json({ flight: updatedFlight, msg: "Flight updated successfully!" });
  } catch (error) {
    console.error("Error updating flight:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the flight" });
  }
});
app.get("/api/flights", async (req, res) => {
  try {
    // Fetch all flights from MongoDB
    const flights = await FlightModel.find();
    res.json({ flights });
  } catch (error) {
    console.error("Error getting flights:", error);
    res.status(500).json({ error: "An error occurred while fetching flights" });
  }
});
let conn =
  "mongodb+srv://admin:1234@cluster0.b3arj4m.mongodb.net/project?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(conn);

app.listen(3002, () => {
  console.log("Server Connected..");
});
