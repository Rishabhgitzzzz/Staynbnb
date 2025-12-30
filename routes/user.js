const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require('../utils/wrapAsync.js');


router.get("/signup", (req, res,) => {
    res.render("./users/signup.ejs")
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        let newUser = new User({ email, username });
        let registerdUser = await User.register(newUser, password);
        console.log(registerdUser);
        req.flash("success", "Welcome To StayNbnb");
        res.redirect("/listings");
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");

    }

}));

module.exports = router;