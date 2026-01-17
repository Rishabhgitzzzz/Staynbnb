const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const { renderSignUpForm, signUp, renderLoginform, login, logIn, logOut } = require('../controllers/users.js');



router.get("/signup", renderSignUpForm);

router.post("/signup", wrapAsync(signUp));

router.get("/login", renderLoginform);

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), logIn);

router.get("/logout", logOut);

module.exports = router;