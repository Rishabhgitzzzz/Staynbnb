const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');



router.get("/signup", (req, res,) => {
    res.render("./users/signup.ejs")
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let newUser = new User({ email, username });
        let registerdUser = await User.register(newUser, password);
        // console.log(registerdUser);
        req.logIn(registerdUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome To StayNbnb");
            res.redirect("/listings");
        })

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");

    }

}));


router.get("/login", (req, res) => {
    res.render("./users/login.ejs");
})


router.post("/login", saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    async (req, res) => {
        req.flash("success", "Welcome to StayNbnb You Logged In");
        let redirectUrl = res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl);
    });



router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You Logged Out");
        res.redirect("listings");
    })
});

module.exports = router;