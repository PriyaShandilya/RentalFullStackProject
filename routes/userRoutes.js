const express = require("express");
const app = express();
const router = express.Router();
const User = require("../models/user.js")
const passport = require("passport")
const {savedRedirectUrl} = require("../Middleware.js")
const userController = require("../controllers/userController.js")

//signup in single route
router.route("/signup")
.get(userController.renderSignup)
.post(userController.register);

//login in single route
router.route("/login")
.get(userController.renderLogin)
.post(savedRedirectUrl,passport.authenticate("local",
{ failureRedirect: '/login',failureFlash:true}),userController.loginAuthenticate)

router.get("/logout",userController.logoutUser)
module.exports = router;