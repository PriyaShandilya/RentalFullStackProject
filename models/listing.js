const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
   url:String,
   filename:String,
  },
  price: Number,
  location: String,
  country: String,
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review",
  },
],
owner :{
  type :Schema.Types.ObjectId,
  ref:"User",
},
geometry: {
        type: {
            type: String, // This 'type' refers to the Mongoose field type
            enum: ['Point'], // The value must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }

});



listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        console.log("Deleting reviews for:", listing.title);
        const res = await Review.deleteMany({ _id: { $in: listing.reviews } });
        console.log("Delete result:", res);
    }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;