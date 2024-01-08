const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");

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

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://assets.simpleviewinc.com/simpleview/image/upload/q_75/v1/crm/newyorkstate/GettyImages-486334510_CC36FC20-0DCE-7408-77C72CD93ED4A476-cc36f9e70fc9b45_cc36fc73-07dd-b6b3-09b619cd4694393e.jpg",
    creator,
  });
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find place",
      500
    );

    return next(error);
  }
  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided place id.",
      404
    );
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  // const places = Dummy_Places.filter((p) => p.creator === userId);
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find user",
      500
    );

    return next(error);
  }
  if (!places || places.length === 0) {
    const error = new HttpError(
      "Could not find a place for the provided user id.",
      404
    );

    return next(error);
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