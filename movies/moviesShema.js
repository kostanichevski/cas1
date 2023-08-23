const mongoose = require("mongoose");

const moviesSchema = new mongoose.Schema({
  naslov: {
    type: String,
    required: [true, "Mora da ima naslov"],
  },
  godina: {
    type: Number,
    // required: [true, "Vpisi godina na izdavanje"],
  },
  rating: {
    type: Number,
    // required: [true, "Vnesi ocenka"],
  },
  author: {
    type: String,
    ref: "User",
  },
  image: {
    type: String,
    default: "default.jpg",
  },
  // metascore: {
  //   type: Number,
  //   // required: [true, "Vnesi metascore"],
  // },
});

const Movie = mongoose.model("Movie", moviesSchema);

module.exports = Movie;
// ZA DOMASNA da se zavrsi web servisot

//shemata da se sostoi od naslov, godina, izlezen, imdb rating, metascore

// da se kreira crud - create - read - update - delete
// baza na rutata da e /api/movies
// da se stavat 10 filma postman so koristenje na raw jason format

// getAll
// getOne
// create\
// update
// delete
