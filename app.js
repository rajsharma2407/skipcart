require("dotenv").config();
const express = require("express");
const app = express();
const myRoutes = require("./routes/myRoutes");
const adminRoutes = require("./routes/adminRoutes");
const flash = require("express-flash");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("./models/user");
const fileUpload = require("express-fileupload");
const Cart = require("./models/cart");
require("./passport-config");
require("./google-config");
var PORT = process.env.PORT || 8080;

mongoose.connect(
  "mongodb+srv://mongodbraj:mongodbraj@cluster0.rrtr0.mongodb.net/skipcart?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) console.log(err);
  }
);

var db = mongoose.connection;
db.once("open", () => console.log("connection done"));
db.on("error", console.error.bind(console, "mongoose error"));

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(fileUpload());
app.use(
  session({
    secret: "SSSSHHhhhhh",
    resave: false,
    saveUninitialized: false
  })
);
app.locals.user = null;
app.locals.cart = null;
app.use(passport.initialize());
app.use(passport.session());

app.use(async (req, res, next) => {
  console.log(req);
  if(!res.locals.user){
    res.locals.user = req.user;
  }else{
    console.log(res.locals.user);
  }
  if (req.user) {
    if(res.locals.cart == null){
      res.locals.cart = {
        length: 0,
        items: []
      };
    }
    await Cart.findOne({ _id: req.user._id }, (err, cart) => {
      if (err) throw err;
      console.log(cart);
      if (cart.arrCart) {
        res.locals.cart.length = cart.arrCart.length;
      }
    });
  }
  next();
});

app.use(require("connect-flash")());
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res);
  next();
});
app.use("/", myRoutes);
app.use("/admin", adminRoutes);
app.listen(PORT, console.log(`server is started at port ${PORT}`));
