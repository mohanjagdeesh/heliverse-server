const HeliverseDataUsers = require("../models/dataUsersModel");
const cloudinary = require("../cloudinary/cloudinary");

const getAllUsers = async (req, res) => {
  try {
    const { gender, domain, available, paginationCount, searchValue } =
      req.query || {};

    let query = {};

    if (gender) query["gender"] = gender;
    if (domain) query["domain"] = domain;
    if (available) query["available"] = available;

    if (searchValue) {
      query.$or = [
        { first_name: { $regex: searchValue, $options: "i" } },
        { last_name: { $regex: searchValue, $options: "i" } },
      ];
    }

    try {
      const users = await HeliverseDataUsers.find(query);
      const paginatedUsers = users.slice(
        paginationCount * 20,
        paginationCount * 20 + 20
      );

      res.send({
        paginatedUsers,
        paginatedUsersLength: paginatedUsers.length,
        totalUsers: users.length,
      });
    } catch (error) {
      console.error("Error occurred while fetching users:", error);
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const insertUser = async (req, res) => {
  try {
    const { avatar, first_name, last_name, email, domain, available, gender } =
      req.body;

    const userCheck = await HeliverseDataUsers.find({ email });
    if (userCheck.length !== 0) {
      res
        .status(401)
        .json({ message: `User Already Existed With This ${email}` });
    } else {
      // Generating Url with Cloudinary for avatar
      const result = await cloudinary.uploader.upload(
        avatar,
        {
          upload_preset: "unauthorised_upload",
          public_id: `${first_name}-avatar`,
          allowed_formats: ["jpg", "jpeg", "png"],
          resource_type: "image",
        },
        function (error, result) {
          if (error) {
            return error;
          } else {
            return result;
          }
        }
      );

      // Creating New User
      const newUser = new HeliverseDataUsers({
        first_name,
        last_name,
        email,
        domain,
        available,
        gender,
        avatar: result?.secure_url,
      });

      const output = await newUser.save();
      res.send(output);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const getUniqueOnes = async (req, res) => {
  try {
    const uniqueOnes = await HeliverseDataUsers.distinct("available");
    res.send(uniqueOnes);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await HeliverseDataUsers.deleteOne({ _id: userId });
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getSpecificUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await HeliverseDataUsers.find({ _id: userId });
    res.send(user[0]);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const { userId, first_name, last_name, email, gender, domain, available } =
      req.body;
    const updationResult = await HeliverseDataUsers.updateOne(
      { _id: userId },
      {
        $set: {
          first_name,
          last_name,
          email,
          gender,
          domain,
          available,
        },
      }
    );
    res.send(updationResult);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {
  getAllUsers,
  insertUser,
  getUniqueOnes,
  deleteUser,
  getSpecificUser,
  updateUserDetails,
};
