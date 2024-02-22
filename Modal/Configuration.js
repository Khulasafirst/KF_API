const mongoose = require("mongoose");
const ConfigurationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    PortionData: {
      type: String,
      default: "BottomSide",
      enum: ["RightSide", "BottomSide"],
    },
    DisplayNewsBy: {
      type: String,
      default: "All",
      enum: ["All", "CategoryId"],
    },
    activeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewsCategorys",
    },
    status:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true }
);
const Configuration = mongoose.model("Configuration", ConfigurationSchema);
module.exports = Configuration;
