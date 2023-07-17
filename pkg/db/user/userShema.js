const mongoose = require("mongoose");
const validator = require("validator"); //npm install validator
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, //sekoj email da e unikaten
    lowercase: true, //site bukvi da se mali
    validate: [validator.isEmail, "Please provide a valid email"], //validacija dali vrednosta e vistinski email
  },
  role: {
    type: String,
    enum: ["user", "admin"], // enum se koristi koga imame tocno zadadeni parametri
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [4, "Password must be at least 8 characters long"],
    // validate: [validator.isStrongPassword, "Please provide a strong password"], //validacija dali e silen passwordot
  },
});

// npm install bcryptjs !!!!!
userSchema.pre("save", async function (next) {
  // so ovaa metoda na prevremen return sprecuvame dase aktivira celosnata funkcija ako kondicijata e ispolneta
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
  // so ovaa this.password go selektirame passwordot sto sakame da go hashirame so pomosh na bcrypt bibliotekata koja ima dva parametri i toa prviot parametar e vrednosta sto sakame da izvrsime promena i vtoriot parametar e jacinata na hashiranjeto, vo denesno vreme sekogash pisuvajte nad 12

  // Ovoj kod go dava istiot rezultat so kodot pogore
  //   if (this.isModified("password")) {
  //     this.password = await bcrypt.hash(this.password, 12);
  //   }
  //   next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
