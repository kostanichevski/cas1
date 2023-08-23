const Movie = require("../movies/moviesShema");
// so multer ovozmozuvame uploadiranje na fajlovi vo nasata aplikacija
// npm install multer

// so uuid ovozmozuvame generiranje na unikatni id's
// npm install uuid

const multer = require("multer");
const uuid = require("uuid");

const imageId = uuid.v4();
const multerStorage = multer.diskStorage({
  // Destinacijata ima 3 parametri: req, file i callback
  destination: (req, file, callback) => {
    // prv parametar e error, vtor parametar e patekata kade bi sakale da se zacuvaat slikite
    callback(null, "public/img/movies");
  },
  filename: (req, file, callback) => {
    // movie-unikatenId-timestamp.jpg so vakov format garantirame deka nema da ima povekje sliki so isto ime
    const ext = file.mimetype.split("/")[1];
    callback(null, `movie-${imageId}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("file type not supported"), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

//poedinecna slika
exports.uploadMoviePhoto = upload.single("image");
//povekje sliki
exports.uploadMoviePhotos = upload.array("images", 3); //req.files

exports.createMovie = async (req, res) => {
  try {
    const newMovie = await Movie.create(req.body);
    res.send(newMovie);
  } catch (err) {
    res.status(404).json({
      status: "fail1",
      message: err,
    });
  }
};

exports.getAllMovies = async (req, res) => {
  try {
    // const queryObj = { ...req.query };
    // let queryString = JSON.stringify(queryObj);
    // queryString = queryString.replace(
    //   /\b(gte|gt|lte|lt)\b/g,
    //   (match) => `$${match}`
    // );

    // const query = JSON.parse(queryString);
    // const movies = await Movie.find(query);
    let movies = await Movie.find().populate("author");

    res.status(200).json({
      status: "Success",
      data: {
        movies,
      },
    });
  } catch (err) {
    res.status(200).json({
      status: "Fail2",
      message: err,
    });
  }
};

exports.getMovie = async (req, res) => {
  try {
    console.log(req.params);
    const movie = await Movie.findById(req.params.id);

    res.status(200).json({
      status: "Success",
      data: {
        movie,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail3",
      message: err,
    });
  }
};

exports.updateMovie = async (req, res) => {
  console.log(req.file);
  console.log(req.body);

  if (req.file) {
    const fileName = req.file.filename;
    req.body.image = fileName;
  }

  //povekje sliki
  if (req.files && req.files.images) {
    const filenames = req.files.images.map((file) => file.filename);
    req.body.images = filenames;
  }

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: { updatedMovie },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail4",
      message: err,
    });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail5",
      message: err,
    });
  }
};

exports.createByUser = async (req, res) => {
  try {
    // const userId = req.auth.id;
    const moviePost = await Movie.create({
      naslov: req.body.naslov,
      godina: req.body.godina,
      rating: req.body.rating,
      author: req.auth.id,
    });
    res.status(201).json(moviePost);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getByUser = async (req, res) => {
  try {
    const userId = req.auth.id;
    const myMovies = await Movie.find({ author: userId });

    res.status(201).json(myMovies);
  } catch (err) {
    res.status(500).json({
      status: "fail at getByUser function, movies.js",
      message: err,
    });
  }
};
