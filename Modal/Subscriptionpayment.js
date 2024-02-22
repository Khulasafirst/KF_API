const mongoose = require("mongoose");
const SubscriptionpaymentSchema = new mongoose.Schema({
 
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      amount: {
        type: String,
        default: "",
      },
      subscription_plan_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscriptionplans",
      },
      paymentmethod: {
        type: String,
        default: "",
      },
      paymentstatus: {
        type: Boolean,
        default:false,
      },
    createdby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admins",
  },
},{timestamps:true});

const Subscriptionpayment = mongoose.model("Subscriptionpayment", SubscriptionpaymentSchema);
module.exports = Subscriptionpayment;
