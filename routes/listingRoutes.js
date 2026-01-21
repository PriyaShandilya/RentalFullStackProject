const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing } = require("../Middleware.js")
const listingController = require("../controllers/listingController.js")
const multer = require('multer');
const {storage} = require("../cloudinaryConfig.js")
const upload = multer({storage})
// route 1
router.route("/")
.get(listingController.index) //to render index page
.post( isLoggedIn, validateListing,upload.single('listing[image]'), listingController.addNewList); // to save data of new listing


//create new listing, cannot put after id would not work
router.get("/new",isLoggedIn, listingController.renderNewForm)

// route 2
router.route("/:id")
.get(listingController.show) // show page of after clicking on particular listing
.put(validateListing,upload.single('listing[image]'),isLoggedIn,isOwner,listingController.updateList) //updated data through
.delete(isLoggedIn,isOwner,listingController.delete) // delete listing

//edit route
router.get("/:id/edit", isLoggedIn,isOwner,listingController.editForm)

module.exports = router;