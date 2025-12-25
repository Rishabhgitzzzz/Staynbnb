const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const flash = require('connect-flash');

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const sessionOptions = {
    secret: "myScretofScret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions))
app.use(flash());


main().then((res) => {
    console.log("DB Connected ");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/staynbnb');
}


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

//Parent Routers
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);  // mergeParams is used to use id in review.js


// Error handlers
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Error Occured" } = err;
    res.status(status).render("Error.ejs", { message });
})


app.listen(8080, () => {
    console.log('Listening to Port 8080');
})