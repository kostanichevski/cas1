const Movie = require("../movies/moviesShema");

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
    const queryObj = { ...req.query };
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    const query = JSON.parse(queryString);
    const movies = await Movie.find(query);

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
    const movie = await Movie.findOne({ naslov: req.params.naslov });

    res.status(200).json({
      status: "Success",
      data: { movie },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail3",
      message: err,
    });
  }
};

exports.updateMovie = async (req, res) => {
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
