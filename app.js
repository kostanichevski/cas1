// SOAP i REST APIs
// SOAP - XML za transfer
// REST - XML ili JSON za transfer
// API - Application Programming Interface
// REST - Representational state transfer
// npm init -y , npm install express, npm install mongoose, npm install dotenv, npm install ejs

//process.env e mesto kade sto nashata aplikacija zhivee(okolina)
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// JWT - JSON WEB TOKEN
// sekogas e stateless
// Logiranje - koga korisnikot se logira serverot proveruva akreditacija i generira JSON web token
// Avtorizacija (Authorization) - odkoga korisnikot vekje se logiral, aplikacijata mu go vrakja nazad tokenot pak do korisnikot vo forma na cookies ili korisnikot go zacuvuva vo forma na lokalen storage
// Verifikacija (Verification) - koga korisnikot ima request kon serverot so jwt tokenot, serverot prvo go verifikuva poptisot od tokenot potoa serverot proveruva dali korisnikot ima dozvola da ja zeme povratnata usluga od requestot ili pobaruvanjeto.
// Ako potpisot e validen togas korisnikot uspesno ja dobiva uslugata od requestot
////////////////////////////////////////////////////////////////////////////////////////////////////////
// JWT ima 3 dela
//- header: cuva informacii za algoritmot koj go koristime za logiranje
//- payload: zacuvuvame podatoci od korisnikot i koga e izdaden
//- signature: potpis koj go socinuva hashiraniot header i payload i e potpisan so taen kluc koj sto go znae samo serverot
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// gi povikuvame paketite
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const db = require("./pkg/db/index");
// inicijalizirame aplikacija
const app = express();
const jwt = require("express-jwt");
//povikuvanje na exported functions
const movies = require("./handlers/movies");
const authHandler = require("./handlers/authHandler");
// povikuvame middlewares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// ovde go koristime middlewarot sto ni ovozmozuva da gi protektirame
app.use(
  jwt
    .expressjwt({
      algorithms: ["HS256"],
      secret: process.env.JWT_SECRET,
    })
    .unless({
      path: ["/api/v1/signup", "/api/v1/login"],
    })
);

app.get("/movies", movies.getAllMovies);
app.post("/movies", movies.createMovie);
app.get("/movies/:naslov", movies.getMovie);
app.patch("/movies/:id", movies.updateMovie);
app.delete("/movies/:id", movies.deleteMovie);
//izvrsuvanje na init fukncija so koja se konektirame so databaza
db.init();

app.post("/api/v1/signup", authHandler.signup);
app.post("/api/v1/login", authHandler.login);
// app.get("/users/signup", authHandler.)
// slusame aplikacija
app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log("Could not start service");
  }
  console.log("Service started successfully");
});

// localhost:10000/api/v1/signup
//odkako se kreira user
//posle se ide samo /login i se logiras ss isti infos
// dobies token i posle ss tj token u authentication ga stavis bearer token i posle kd napises get localhost:10000/movies ke mozes da gi otvoris i ke ti gi pokaze svi movies
