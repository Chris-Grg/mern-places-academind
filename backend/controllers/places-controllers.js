const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");

let Dummy_Places = [
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

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed", 422));
  }

  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };
  Dummy_Places.push(createdPlace);
  res.status(201).json({ place: createdPlace });
};

const getPlaceById = (req, res, next) => {
  const PlaceId = req.params.pid;
  const place = Dummy_Places.find((p) => p.id === PlaceId);
  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided place id.", 404)
    );
  }
  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const places = Dummy_Places.filter((p) => p.creator === userId);
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }
  res.json({ places });
};

const deletebyId = (req, res, next) => {
  const placeId = req.params.pid;
  if (!Dummy_Places.find((p) => p.id === placeId)) {
    throw new HttpError("Could not find a place for the provided place id.");
  }
  Dummy_Places = Dummy_Places.filter((p) => p.id !== placeId);
  res.status(200).json({ message: placeId + " deleted" });
};

const updateById = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed");
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...Dummy_Places.find((p) => p.id === placeId) };
  const placeIndex = Dummy_Places.findIndex((p) => p.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  Dummy_Places[placeIndex] = updatedPlace;
  res.status(200).json({ place: updatedPlace });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletebyId = deletebyId;
exports.updateById = updateById;
