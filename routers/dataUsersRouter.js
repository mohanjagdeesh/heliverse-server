const express = require("express");
const {
  getAllUsers,
  insertUser,
  getUniqueOnes,
  deleteUser,
  getSpecificUser,
  updateUserDetails,
} = require("../controllers/dataUsersController");
const dataUsersRouter = express.Router();

// Get All Users With Filtration For Displaying Data
dataUsersRouter.get("/", getAllUsers);

// Insert User
dataUsersRouter.post("/", insertUser);

// Unique Ones
dataUsersRouter.get("/unique", getUniqueOnes);

// Get Specific User
dataUsersRouter.get("/:userId", getSpecificUser);

// Delete User
dataUsersRouter.delete("/:userId", deleteUser);

// Update User
dataUsersRouter.put("/", updateUserDetails);

module.exports = dataUsersRouter;
