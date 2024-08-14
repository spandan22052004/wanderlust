const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/users.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.signupFormRender)
.post(wrapAsync(userController.signup));



router.route("/login")
.get(userController.loginFormRender)
.post(saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: '/login',
    failureFlash: true
}),userController.login);


router.get("/logout",userController.destroyUser);


module.exports = router;