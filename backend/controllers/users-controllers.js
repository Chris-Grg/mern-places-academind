const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

// const Dummy_Users = [
//   {
//     id: "u1",
//     name: "John Doe",
//     password: "pw123",
//     email: "johndoe@doe.com",
//   },
// ];

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data",
      422
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signupUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(new HttpError("Invalid inputs passed"));
  }
  const { name, password, email } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later",
      500
    );
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead",
      422
    );
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    image:
      "https://i.pinimg.com/564x/2b/24/22/2b2422be536bd0e2d360afb61ff51d9e.jpg",
    password,
    places: [],
  });
  try {
    await newUser.save();
  } catch (err) {
    return next(new HttpError("Signing Up failed, please try again", 500));
  }
  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Could not find given email. Check credentials"
    );
    return next(error);
  }
  if (!identifiedUser || identifiedUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in",
      401
    );
    return next(error);
  }
  res.json({ message: "Logged In" });
};

module.exports = { getUsers, signupUser, loginUser };
