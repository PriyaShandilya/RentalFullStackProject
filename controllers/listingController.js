const Listing = require("../models/listing.js");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAP_TOKEN;

module.exports.index = async (req,res)=>{
  let AllListing = await Listing.find();
  res.render("listings/index.ejs",{AllListing});
}

module.exports.show = async (req,res)=>{
    let {id} = req.params;
    const listings = await Listing.findById(id).populate({path:"reviews",populate:
      {
      path:"author"
    }
  }).populate("owner");
    if(!listings){
        req.flash("error","Listing you requested for does not exist or deleted!");
       return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listings});
}
module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}


module.exports.addNewList =  async (req, res) => {
    //  Geocode the location text from the form
    const response = await maptilerClient.geocoding
    .forward(req.body.listing.location, {
        limit: 1 
    });
   
   const geometry = response.features[0].geometry;
    let url = req.file.path;
    let filename = req.file.filename;
    const newList = new Listing(req.body.listing); 
    newList.owner = req.user._id;
    newList.image = {url,filename};
    newList.geometry = geometry;
     await newList.save();
    req.flash("success","New Listing added");
    res.redirect("/listings");
}

module.exports.editForm = async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
      if(!listing){
        req.flash("error","Listing you requested for does not exist or deleted!");
       return res.redirect("/listings");
    }
let originalImageUrl = listing.image.url;
    let isCloudinary = originalImageUrl.includes("cloudinary");

    if (isCloudinary) {
        // Resize via URL for performance
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250,h_150,");
    }

    // Pass isCloudinary to the view
    res.render("listings/edit.ejs", { listing, originalImageUrl, isCloudinary });
}

module.exports.updateList = async (req,res)=>{
  let {id} = req.params;
  let listings = await Listing.findByIdAndUpdate(id,{...req.body.listing});
  console.log(req.file);
  if(typeof req.file!== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listings.image = {url,filename}
  await listings.save();
  }   

  req.flash("success","Listing Updated");
  res.redirect(`/Listings/${id}`);
}

module.exports.delete = async (req,res)=>{
    let {id} = req.params;
  let del= await Listing.findByIdAndDelete(id,{new:true})
    req.flash("success","Listing deleted");
   res.redirect("/listings");
   console.log(del);

}