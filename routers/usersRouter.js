const express = require("express");

const usersRouter = express.Router();
const {
  checkUser,
  createUser,
  getLoggedInUser,
} = require("../controllers/usersController");

// Create User
usersRouter.post("/", createUser);

// Check User
usersRouter.post("/authenticate", checkUser);

// Get LoggedIn User
usersRouter.get("/", getLoggedInUser);

module.exports = usersRouter;
