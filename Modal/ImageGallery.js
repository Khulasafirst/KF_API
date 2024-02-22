const mongoose = require("mongoose");
const ImageGallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    imageurl: {
      type: String,
      default: "",
    },
    categoryid: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NewsCategorys",
      },
    ],
    subcategoryid: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NewsSubCategorys",
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tags",
      },
    ],
    state: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "States",
      },
    ],
    city: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Citys",
      },
    ],
    commentId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admins",
    },
  },
  { timestamps: true }
);
const ImageGallery = mongoose.model("ImageGallery", ImageGallerySchema);
module.exports = ImageGallery;
