const Teams = require("../models/teamsModel");

const getUserTeams = async (req, res) => {
  try {
    const { userEmail } = req.params;
    const teams = await Teams.find({ userEmail });
    res.send(teams);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const createTeam = async (req, res) => {
  try {
    const userData = req.body;
    const userTeams = await Teams.find({ userEmail: userData.userEmail });
    if (userTeams.length === 0) {
      const newTeamMember = new Teams(userData);
      const result = await newTeamMember.save();
      res.send(result);
    } else {
      const isUserAddedToTeam = await Teams.find({ email: userData.email });
      if (isUserAddedToTeam.length > 0) {
        res.status(401).json({ message: "User Already In Teams" });
      } else {
        if (userTeams[0].domain === userData.domain) {
          const newTeamMember = new Teams(userData);
          const result = await newTeamMember.save();
          res.send(result);
        } else {
          res.status(401).json({
            message: `User Domain Is Not Same As Previous Team Members,You Can Only Add Those Users Who Is Related To ${userTeams[0].domain} Domain , To This Team`,
          });
        }
      }
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = { createTeam, getUserTeams };
