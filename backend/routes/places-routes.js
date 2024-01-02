const express = require("express");

const router = express.Router();

const Dummy_Places = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

router.get("/:pid", (req, res, next) => {
  const PlaceId = req.params.pid;
  const place = Dummy_Places.find((p) => p.id === PlaceId);
  console.log("GET request in places");
  res.json({ place });
});

module.exports = router;
