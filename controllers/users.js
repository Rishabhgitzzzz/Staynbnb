const User = require('../models/user.js');

module.exports.renderSignUpForm = (req, res,) => {
    res.render("./users/signup.ejs")
}

module.exports.signUp = async (req, res) => {
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

}

module.exports.renderLoginform = (req, res) => {
    res.render("./users/login.ejs");
}

module.exports.logIn = async (req, res) => {
    req.flash("success", "Welcome to StayNbnb You Logged In");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You Logged Out");
        res.redirect("listings");
    })
}