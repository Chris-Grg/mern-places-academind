const express = require("express");

const { check } = require("express-validator");

const router = express.Router();

const userController = require("../controllers/users-controllers");

router.get("/", userController.getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("password").isLength({ min: 8 }),
    check("email").normalizeEmail().isEmail(),
  ],
  userController.signupUser
);

router.post("/login", userController.loginUser);

module.exports = router;
