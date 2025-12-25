const express = require("express");
const router = express.Router()
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");







const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errmsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
}





//listing routes 
//Index route
router.get("/", async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})


//New Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings")
    }


    res.render("listings/show.ejs", { listing });

}))

//Create Route
router.post("/", validateListing,
    wrapAsync(async (req, res, next) => {

        let newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success", "New Listing is Added");
        res.redirect("/listings");

    })
)

//Edit route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings")
    }

    res.render("listings/edit.ejs", { listing })
}))


// update route
router.put("/:id", wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send Valid Data for Listing")
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");

}))

//delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is Deleted");
    res.redirect("/listings")
}))


module.exports = router;