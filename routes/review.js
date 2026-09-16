const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controller/reviews.js");

//Post Review Route
router.post(
  "/",
  isLoggedIn, 
  validateReview,
  wrapAsync(reviewController.createNewReview));

//Delete Review Route
router.delete(
    "/:reviewId",
    isLoggedIn, isReviewAuthor,
    wrapAsync(reviewController.destroyReview));

module.exports = router;