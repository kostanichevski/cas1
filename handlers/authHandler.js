const User = require("../pkg/db/user/userShema");

//npm install jsonwebtoken
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    // za da ne se nekoj vkluci preku postman i da napravi sing up dopisuvajki negov role morame da ja limitirame databazata
    //kreirame korisnik. kako input kreirame nash objekt zaradi pogolema bezbednost u sanatizacija na kodot
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    // da generirame i ispratime token
    // generirame token. kako prv parametar e payloadot, vtor parametar e tajnata recenica i kako tret parametar e rokot na istekuvanje
    const token = jwt.sign(
      { id: newUser._id, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    // res.cookies ima tri parametri: prviot so kako se vika cookieto, vtoriot vrednosta na cookieto i tretiot parametar se dodatni opcii
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      secure: false,
      httpOnly: true,
    });
    // res.status ni vrakja  token status i korisnikot
    res.status(200).json({
      status: "Success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1. Proveruvame dali ima vneseno password i email
    if (!email || !password) {
      return res.status(400).send("Please provide email and password");
    }
    //2. Proveruvame dali korisnikot postoi
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("A user with this email doesn't exist");
    }
    // 3. Sporeduvame password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid email or password");
    }

    // 4. Se generira i isprakja token
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );
    // 5. go isprakjame cookieto so tokenot
    res.cookie("jwt", token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      secure: false,
      httpOnly: true,
    });
    // 6. go isprakjame tokenot
    res.status(201).json({
      status: "success",
      token,
    });
  } catch (err) {
    return res.status(500).send("Internal server error");
  }
};

exports.protect = async (req, res) => {
  try {
  } catch (err) {}
};
