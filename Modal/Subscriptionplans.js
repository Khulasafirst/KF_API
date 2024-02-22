const mongoose = require("mongoose");
const SubscriptionplansSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  originalamount: {
    type: String,
    default: "",
  },
  discountedamount: {
    type: String,
    default: "",
  },
  days: {
    type: String,
    default: "",
  },
  imageurl: {
    type: String,
    default: "",
  },
  // createdby: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "admin",
  // },
},{timestamps:true});

const Subscriptionplans = mongoose.model("Subscriptionplans", SubscriptionplansSchema);
module.exports = Subscriptionplans;
