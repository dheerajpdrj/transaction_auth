const bcrypt = require("bcrypt");
const User = require("../models/user");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/authMiddleware");

exports.signupController = async (req, res) => {
  console.log("Signup Controller", req.body);
  try {
    const { email, password, name, mobileNumber } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send({ message: "Email already registered" , success: false});
    }

    // If email is not registered, create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      mobileNumber,
    });
    await newUser.save();
    res.send({ message: "User created successfully", success: true});
  } catch (error) {
    console.error(error);
    res.send({ message: "Error creating user", success: false});
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.send("Invalid email or password");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.send("Invalid email or password");
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    return res
      .status(200)
      .json({ message: "Logged in successfully", accessToken, success: true, user });
  } catch (error) {
    console.error(error);
    res.send({ message: "Error logging in", success: false});
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.send("User not found");
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.send("Current password is incorrect");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;
    await user.save();

    return res.send("Password changed successfully");
  } catch (error) {
    console.error(error);
    res.send("Error changing password");
  }
};
