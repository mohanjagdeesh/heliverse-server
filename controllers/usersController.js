const User = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../cloudinary/cloudinary");

const createUser = async (req, res) => {
  try {
    const { email, password, name, profilePic } = req.body;

    const userCheck = await User.find({ email });
    if (userCheck.length !== 0) {
      res
        .status(401)
        .json({ message: `User Already Existed With This ${email}` });
    } else {
      const result = await cloudinary.uploader.upload(
        profilePic,
        {
          upload_preset: "unauthorised_upload",
          public_id: `${name}-avatar`,
          allowed_formats: ["jpg", "jpeg", "png"],
        },
        function (error, result) {
          if (error) {
            return error;
          } else {
            return result;
          }
        }
      );
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        profilePic: result?.secure_url,
      });
      const response = await newUser.save();
      res.send(response);
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const checkUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userList = await User.find({ email });
    if (userList.length !== 0) {
      const userDetails = userList[0];
      const isPasswordMatched = await bcrypt.compare(
        password,
        userDetails.password
      );
      if (isPasswordMatched) {
        const payLoad = {
          email,
          password,
        };
        const secretKey = process.env.JSON_SECRET_KEY;
        const token = jwt.sign(payLoad, secretKey);
        res.send({
          status: true,
          statusText: "User Loggedin Successfully",
          jwtToken: token,
          userDetails,
        });
      } else {
        res.send({ status: false, statusText: "Password Mismatched" });
      }
    } else {
      res.send({ status: false, statusText: "Email Mismatched" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getLoggedInUser = async (req, res) => {
  try {
    const { userEmail } = req.query;
    const user = await User.find({ email: userEmail });
    res.send({ name: user[0].name, profilePic: user[0].profilePic });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = { checkUser, createUser, getLoggedInUser };
