const mongoose = require("mongoose");
const AdvertisementSchema = new mongoose.Schema({
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
   
    adv_url: {
      type: String,
      default: "",
    },
   
    advttype: {
      type: String,
      default: "",
      enum: ["GOOGLEAD", "IMAGE","VIDEO"],
    },
    
    url: {
      type: String,
      default: "",
    },
    advtposition: {
        type: String,
        default: "",
        enum: ["TOP", "RIGHT","BOTTOM",'BOTTOMRIGHT'],
      },
      status: {
        type:Boolean,
        default: true,
      },
      startdate: {
        type: Date,
        default: "",
      },
      enddate: {
        type: Date,
        default: "",
      },
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admins",
    },
  },
  { timestamps: true }
);
const Advertisement = mongoose.model('Advertisements',AdvertisementSchema);
module.exports = Advertisement;