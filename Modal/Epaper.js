const mongoose = require("mongoose");
const EpaperSchema = new mongoose.Schema(
  {
    // paperurl: {
    //   type: String,
    //   default: "",
    // },
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
    paperdate: {
      type: Date,
    },
    other: {
      type: String,
      default: "",
    },
    uniquepaperid: {
      type: String,
      default: "",
    },
    paperimages: [
      {
        pagenumber: {
          type: Number,
          default: 0,
        },
        mainimage_url: {
          type: String,
          default: "",
        },
        title: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
        
        // subimages: [
        //   {
        //     subimage_url: {
        //       type: String,
        //       default: "",
        //     },
        //     top: {
        //       type: String,
        //       default: "",
        //     },
        //     left: {
        //       type: String,
        //       default: "",
        //     },
        //     height: {
        //       type: String,
        //       default: "",
        //     },
        //     width: {
        //       type: String,
        //       default: "",
        //     },
        //   },
        // ],
      },
    ],

    // uploadedby: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Admins",
    // },

    // subscriptionrequired: {
    //   type: Boolean,
    //   default: true,
    // },
  },
  { timestamps: true }
);

const Epaper = mongoose.model("epapers", EpaperSchema);
module.exports = Epaper;
