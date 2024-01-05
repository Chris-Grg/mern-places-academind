const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const Dummy_Users = [
  {
    id: "u1",
    name: "John Doe",
    password: "pw123",
    email: "johndoe@doe.com",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: Dummy_Users });
};

const signupUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed");
  }
  const { name, password, email } = req.body;

  const hasUser = Dummy_Users.find((user) => user.email === email);
  if (hasUser) {
    throw new HttpError("Could not create user, email already exists", 422);
  }
  const newUser = {
    id: uuidv4(),
    name,
    password,
    email,
  };
  Dummy_Users.push(newUser);
  res.status(201).json({ user: newUser });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = Dummy_Users.find((user) => user.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Could not identify user. Check credentials");
  }
  res.json({ message: "Logged In" });
};

module.exports = { getUsers, signupUser, loginUser };
