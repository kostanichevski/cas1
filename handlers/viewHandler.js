const Movie = require("../movies/moviesShema");

exports.getLoginForm = (req, res) => {
  try {
    res.status(200).render("login", {
      title: "Login",
      podnaslov: "Login to see HBO movies",
    });
  } catch (err) {
    res.status(500).send("Error");
  }
};

exports.movieView = async (req, res) => {
  try {
    const movies = await Movie.find();

    //prv parametar e ejs file a vtor toa sto sakame da go prikazeme (informaciite) ili da go dademe na viewmMovies ili ejs filot
    res.status(200).render("viewMovies", {
      status: "Success",
      movies,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.createMovie = async (req, res) => {
  try {
    await Movie.create(req.body);
    res.redirect("/viewMovies");
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    await Movie.findByIdAndDelete(movieId);
    res.redirect("/viewMovies");
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.viewMovieDetails = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).send("movie not found");
    } else {
      res.status(2000).render("movieDetails", {
        status: "Success",
        movie,
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.modifyMovie = async (req, res) => {
  try {
    await Movie.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/viewMovies" + req.params.id);
  } catch (err) {
    res.status(500).send(err);
  }
};
