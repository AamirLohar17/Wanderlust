if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
};
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  initData.data = await Promise.all(
    initData.data.map(async (obj) => {

      // Location ko coordinates me convert karo
      const response = await fetch(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          obj.location
        )}.json?key=${process.env.MAP_KEY}&country=IN&language=en`
      );

      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        throw new Error(`Location not found: ${obj.location}`);
      }

      const coordinates = data.features[0].geometry.coordinates;

      return {
        ...obj,
        owner: "6a9e83e38e300396c6d37988",
        geometry: {
          type: "Point",
          coordinates: coordinates
        }
      };
    })
  );

  await Listing.insertMany(initData.data);

  console.log("Data was initialize");
};

initDB();