const express = require("express");
const router = express.Router()
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { index, renderNewForm, showListing, addNewListing, renderEditForm, updateListing, deleteListing } = require("../controllers/listings.js");
const { storage } = require("../cloudConfig.js");
const multer = require('multer');
const upload = multer({ storage });

//Index route
router.get("/", index);

//New Route
router.get("/new", isLoggedIn, renderNewForm);

//Show Route
router.get("/:id", wrapAsync(showListing));

//Create Route
router.post("/", isLoggedIn, validateListing, upload.single('listing[img]'),
    wrapAsync(addNewListing)
);

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner,
    wrapAsync(renderEditForm)
);


// update route
router.put("/:id", isLoggedIn, upload.single('listing[img]'), isOwner,
    wrapAsync(updateListing)
);

//delete Route
router.delete("/:id", isLoggedIn, isOwner,
    wrapAsync(deleteListing)
);
module.exports = router;



// router is a router object (a mini Express application). When you do router.get(), router.post(), etc.,
// you're adding routes TO that router object. The router object stores all those routes internally.