import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const showRegisterPage = (req, res) => {
  res.render("signup");
};
const showLoginPage = (req, res) => {
  res.render("login", { userId: req.params.userId });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, username, password, email, mobile, petroleumName, location } =
    req.body;

  //Validation --- Not empty
  if ([username, email, name, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  //Check if user already exists --- username, email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with username or email exists");
  }

  //Create user object --- Create entry in db
  const user = await User.create({
    name,
    email,
    username,
    password,
    mobile,
    location,
    petroleumName,
  });

  const createdUser = await User.findById(user._id).select("-password");

  res.status(200).redirect(`/payment/checkout/${user._id}`);
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email) {
    return res.render("login", {
      error: "Both username and email are required",
    });
  }

  const user = await User.findOne({
    $and: [{ username }, { email }],
  });

  if (!user) {
    return res.render("login", { error: "Invalid username or email" });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.render("login", { error: "Invalid credentials" });
  }

  if (!user.paymentStatus) {
    return res.redirect(`/payment/checkout/${user._id}`);
  }

  const loggedInUser = await User.findById(user._id).select("-password");

  res.json({
    success: "User logged in successfully",
    user: loggedInUser,
  });
});

export { showRegisterPage, registerUser, showLoginPage, loginUser };
