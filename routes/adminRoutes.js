const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const mkdirp = require("mkdirp");
const Product = require("../models/products");
const Category = require("../models/categories");
const Cart = require("../models/cart");

const checkAdmin = (req, res, next) => {
  const str = process.env.SESSION_NAME;
  if (str != undefined && str == "admin" || str == "admin@admin.com") 
  {
    next();
  }
  else {
    res.redirect("/");
  }
};

router.get("/", checkAdmin, (req, res) => {
  Product.find({}, (err, products) => {
    if (err) console.log(err);
    res.render("admin/admin_index", { products: products });
  });
});

router.get("/add-category", checkAdmin, (req, res) => {
  res.render("admin/add_category");
});

router.post("/add-category", checkAdmin, (req, res) => {
  var title = req.body.title;
  var slug = title.replace(/\s+/g, "-").toLowerCase();

  Category.findOne({ categorySlug: slug }, (err, doc) => {
    if (err) console.log(err);
    if (doc) {
      res.redirect("/admin/add-category");
    } else {
      var cat = new Category({
        categoryName: title,
        categorySlug: slug,
      });
      cat.save((err) => {
        if (err) console.log(err);
      });
      res.redirect("/admin");
    }
  });
});

router.get("/add-product", checkAdmin, (req, res) => {
  Category.find({}, (err, cat) => {
    res.render("admin/add_product", { categories: cat });
  });
});

router.post("/add-product", (req, res) => {
  var productName = req.body.productName;
  var productCategory = req.body.productCategory;
  var productPrice = req.body.productPrice;
  var productImageName;
  if (req.files != null) productImageName = req.files.productImage.name;
  else productImageName = "";

  var myProduct = new Product({
    productName: productName,
    productCategory: productCategory,
    productImage: productImageName,
    productPrice: productPrice,
  });

  myProduct.save((err) => {
    if (err) console.log(err);

    mkdirp("public/product_images/" + myProduct._id).then((err) => {
      console.log(err);
      var path =
        "public/product_images/" + myProduct._id + "/" + productImageName;

      if (productImageName != "") {
        var productImage = req.files.productImage;
        productImage.mv(path, (err) => {
          return console.log(err);
        });
      }
    });
  });
  res.redirect("/admin/add-product");
});

router.get("/all-products", (req, res) => {
  Product.find({}, (err, product) => {
    if (err) console.log(err);
    res.render("admin/all_product", { products: product });
  });
});

router.get("/all-category", (req, res) => {
  Category.find({}, (err, categories) => {
    if (err) console.log(err);
    res.render("admin/all_category", { categories: categories });
  });
});

router.get("/edit-product/:id", (req, res) => {
  var id = req.params.id;
  Product.findOne({ _id: id }, (err, doc) => {
    if (err) console.log(err);
    if (doc) {
      Category.find({}, (err, cat) => {
        res.render("admin/edit_product", { product: doc, categories: cat });
      });
    }
  });
});

router.post("/edit-product/:id", (req, res) => {
  var id = req.params.id.toString();
  var productImageName;
  Product.findOne({ _id: req.params.id }, (err, product) => {
    if (err) console.log(err);
    if (product) {
      if (req.files == null) {
        productImageName = product.productImage;
      } else {
        console.log("product Find");
        if (product.productImage != null) {
          var filePath =
            "public/product_images/" + id + "/" + product.productImage;
          fs.unlinkSync(filePath);
        }
        productImageName = req.files.productImage.name;
        var imagePath = "public/product_images/" + id + "/" + productImageName;
        var newImage = req.files.productImage;
        newImage.mv(imagePath, (err) => {
          console.log(err);
        });
      }
    }
    Product.findByIdAndUpdate(
      id,
      {
        productName: req.body.productName,
        productCategory: req.body.productCategory,
        productPrice: req.body.productPrice,
        productImage: productImageName,
      },
      (err) => {
        if (err) console.log(err);
      }
    );
  });
  res.redirect("/admin/edit-product/" + id);
});
router.get("/delete-product/:id", (req, res) => {
  var id = req.params.id.toString();

  Product.findByIdAndDelete(id, (err, product) => {
    if (err) console.log(err);
    var file = "public/product_images/" + id + "/" + product.productImage;
    var path = "public/product_images/" + id;
    // fs.unlinkSync(file);
    fs.rmdir(path, (err) => {
      if (err) console.log(err);
    });
  });
  res.redirect("/admin/all-products");
});
router.get("/edit-category/:id", (req, res) => {
  const id = req.params.id;
  Category.findOne({ _id: id }, (err, category) => {
    if (err) console.log(err);

    res.render("admin/edit_category", { category: category });
  });
});

router.post("/edit-category/:id", (req, res) => {
  const id = req.params.id.toString();
  Category.findByIdAndUpdate(
    id,
    {
      categoryName: req.body.title,
      categorySlug: req.body.title.replace(/\s+/g, "-").toLowerCase(),
    },
    (err) => {
      console.log(err);
    }
  );
  res.redirect("/admin/edit-category" + "/" + id);
});

router.get("/delete-category/:id", (req, res) => {
  const id = req.params.id;
  Category.findByIdAndDelete(id, (err) => {
    if (err) console.log(err);
  });
  res.redirect("/admin/all-category");
});

router.get("/cart/delete/:id", (req, res) => {
  console.log(req.params.id);
  Cart.find({ _id: req.user._id }, (err, user) => {
    if (err) console.log(err);
    if (user) {
      user[0].arrCart.map((val, index) => {
        if (val == req.params.id) {
          console.log(val);
          user[0].arrCart.splice(index, 1);
        }
      });
      user[0].save();
    }
  });
  res.redirect("/cart");
});

module.exports = router;
