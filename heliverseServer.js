const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Mongo DB Strict Mode
mongoose.set("strictQuery", true);

// Server Instance
const heliverseServer = express();

heliverseServer.use(express.json({ limit: "50mb" }));
heliverseServer.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Request Parsers
heliverseServer.use(cors());
heliverseServer.use(express.json());

// Routers Import
const usersRouter = require("./routers/usersRouter");
const dataUsersRouter = require("./routers/dataUsersRouter");
const teamsRouter = require("./routers/teamsRouter");

// Routing Based on end point
heliverseServer.get("/", (req, res) => {
  res.send("Welcome To Heliverse Server");
});
heliverseServer.use("/users", usersRouter);
heliverseServer.use("/dataUsers", dataUsersRouter);
heliverseServer.use("/teams", teamsRouter);

// Database Connection Establishment
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log("Database Connection Established"))
  .catch((err) => console.error(err));

// Port Assigning
heliverseServer.listen(process.env.PORT, () => {
  console.log(`Server Listening To The Port ${process.env.PORT}`);
});
