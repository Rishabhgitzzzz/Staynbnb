const express = require("express");
const router = express.Router()
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");





//listing routes 
//Index route
router.get("/", async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})


//New Route
router.get("/new", isloggedIn, (req, res) => {

    res.render("listings/new.ejs")
})

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
        }
    }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings")
    }


    res.render("listings/show.ejs", { listing });

}))

//Create Route
router.post("/", isloggedIn, validateListing,
    wrapAsync(async (req, res, next) => {

        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New Listing is Added");
        res.redirect("/listings");

    })
)

//Edit route
router.get("/:id/edit", isloggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings")
    }

    res.render("listings/edit.ejs", { listing })
}))


// update route
router.put("/:id", isloggedIn, isOwner, wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Send Valid Data for Listing")
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing is Updated");
    res.redirect(`/listings/${id}`);

}))

//delete Route
router.delete("/:id", isloggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is Deleted");
    res.redirect("/listings")
}))


module.exports = router;



// router is a router object (a mini Express application). When you do router.get(), router.post(), etc.,
// you're adding routes TO that router object. The router object stores all those routes internally.