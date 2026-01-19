const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/reviews.js");


//REVIEWS
//Post ROute
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

//Delete Review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(destroyReview));


module.exports = router;
