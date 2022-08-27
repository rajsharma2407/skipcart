const mongoose = require("mongoose");

var cartSchema = mongoose.Schema({
  cartQuantity: {
    type: Number,
    required: true,
  },
  arrCart: {
    type: Array,
  },
});
module.exports = mongoose.model("Cart", cartSchema);
