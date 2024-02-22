const mongoose = require("mongoose");
const VideoGallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      default: "",
    },
    imageurl: {
      type: String,
      default: "",
    },
    description: {
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
    videotype: {
      type: String,
      default: "",
      enum: ["YOUTUBE", "UPLOADED"],
    },
    videolengthtype: {
      type: String,
      default: "LONG",
      enum: ["SHORT", "LONG"],
    },
    //youtube,or uploaded
    youtubeurl: {
      type: String,
      default: "",
    },
    videourl: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: true,
    },
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

const VideoGallery = mongoose.model("VideoGallerys", VideoGallerySchema);
module.exports = VideoGallery;
