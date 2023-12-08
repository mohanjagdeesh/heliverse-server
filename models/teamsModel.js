const mongoose = require("mongoose");

const teamsSchema = mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  available: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

const Teams = mongoose.model("heliverseteams", teamsSchema);

module.exports = Teams;
