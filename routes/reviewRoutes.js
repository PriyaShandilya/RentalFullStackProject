const express = require("express");
const router = express.Router({mergeParams:true});
const {validateReview} = require("../Middleware.js")
const {isLoggedIn,isReviewAuthor } = require("../Middleware.js")
const reviewController = require("../controllers/reviewController.js")

//review route post data
router.post("/", isLoggedIn,validateReview, reviewController.saveReviewData)

//delete review route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,reviewController.deleteReview) 
module.exports = router;``