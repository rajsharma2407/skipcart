const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/products");
const Cart = require("../models/cart");

const checkLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

router.get("/", async (req, res) => {
  Product.find({}, async (err, product) => {
    res.render("index", { products: product });
  });
});

router.get("/register", (req, res) => {
  console.log(req.session);
  res.render("register", { name: "", email: "", password: "" });
});

router.post("/register", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  User.findOne({ email: email }, async (err, userExist) => {
    if (err) console.log(err);

    if (userExist) {
      return res.render("register", { name: name, email: email, password: "" });
    } else {
      var hashedPassword = await bcrypt.hash(password, 10);
      var newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });

      newUser.save((err) => {
        if (err) console.log(err);
        else {
          console.log("User saved");
          var cart = new Cart({
            _id: newUser._id,
            cartQuantity: 0,
            arrCart: [],
          });
          cart.save((err) => {
            if (err) console.log(err);
          });
        }

        return res.redirect("/login");
      });
    }
  });
});
const checkLogout = (req, res, next) => {
  if (req.user) {
    res.redirect("/");
  } else {
    next();
  }
};
router.get("/login", checkLogout, (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: true,
  }),
  (req, res) => {
    process.env.SESSION_NAME = req.body.email;
    if (req.body.email === "admin") {
      res.redirect("/admin");
    } else {
      res.redirect("/");
    }
  }
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google-login",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: true,
  }),
  (req, res) => {
    res.redirect("/");
  }
);

router.get("/logout", checkLogin, (req, res) => {
  req.flash("success", "Logout Successfull");
  req.logout();
  res.redirect("/");
  req.session.destroy();
});

router.get("/product/:id", checkLogin, (req, res) => {
  Product.findOne({ _id: req.params.id }, (err, product) => {
    if (err) console.log(err);
    if (product) {
      Product.find(
        { productCategory: product.productCategory, _id: { $ne: product._id } },
        (err, pro) => {
          res.render("product", { product: product, products: pro });
        }
      );
    }
  });
});
router.get("/cart", checkLogin, (req, res) => {
  Cart.findOne({ _id: req.user._id }, (err, cart) => {
    if (err) console.log(err);
    if (cart) {
      Product.find({}, (err, product) => {
        if (err) console.log(err);
        // console.log(cart);
        res.render("cart", { items: cart.arrCart, products: product });
      });
    }
  });
  // res.redirect("/login");
});
router.post("/add-to-cart/", checkLogin, (req, res) => {
  // console.log(req.body);
  var fetchId = req.body.id;
  Cart.findOne({ _id: req.user.id }, (err, doc) => {
    if (err) console.log(err);
    if (doc) {
      var flag = 0;
      doc.arrCart.forEach((val) => {
        if (val == fetchId) {
          flag = 1;
        }
      });

      if (flag == 0) {
        doc.arrCart.push(fetchId);
        doc.save((err) => {
          console.log(err);
        });
      }
      //   res.send("done");
    }

    // res.send("null");
  });
  res.redirect("/");
});
// router.get('/flash',(req,res)=>{
//     req.flash('info','this is message');
//     // req.flash('this is message');
//     res.redirect('/');
// });

// router.get('/messages',(req,res)=>{
//     res.send(res.locals.messages)
// })
module.exports = router;
