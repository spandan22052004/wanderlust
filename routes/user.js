const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/users.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

router.get("/signup",userController.signupFormRender);

router.post("/signup",wrapAsync(userController.signup));

router.get("/login",userController.loginFormRender);

router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: '/login',
    failureFlash: true
}),userController.login);


router.get("/logout",userController.destroyUser);


module.exports = router;