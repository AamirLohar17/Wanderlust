const Listing = require("../models/listing.js");

// Home Route
module.exports.index = async (req, res) => {

  let { q, category } = req.query;

  let allListings;

  if (q) {

    // Search functionality
    allListings = await Listing.find({
      $or: [
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } },
        { title: { $regex: q, $options: "i" } }
      ]
    });

  } else if (category) {

    // Icon category functionality
    allListings = await Listing.find({
      category: category
    });

  } else {

    // All listings
    allListings = await Listing.find({});
  }

  if (allListings.length === 0) {
    req.flash("error", "No listings found!");
    return res.redirect("/listings");
  }

  res.render("listings/index.ejs", { allListings });
};

//NewForm
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//Show Route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

//Create New Listing Route
module.exports.createListing = async (req, res, next) => {
  // map
  const response = await fetch(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(req.body.listing.location)}.json?key=${process.env.MAP_KEY}`
  );
  const data = await response.json();
  // const coordinates = data.features[0].geometry.coordinates;
  // console.log(coordinates);


  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url, filename};

  newListing.geometry = data.features[0].geometry; //.coordinates
  
  let savedListing = await newListing.save();
  console.log(savedListing);
  
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

//Edit Listing Route
module.exports.renderEditListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl =  listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

//Update Route
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

     if(req.file)  {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url, filename};
      await listing.save()
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
  }

//Delete Listing Route
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  }