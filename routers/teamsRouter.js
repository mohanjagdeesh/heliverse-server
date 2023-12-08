const express = require("express");
const teamsRouter = express.Router();

const { getUserTeams, createTeam } = require("../controllers/teamsController");

// Get User Teams
teamsRouter.get("/:userEmail", getUserTeams);

// Create Team
teamsRouter.post("/", createTeam);

module.exports = teamsRouter;
