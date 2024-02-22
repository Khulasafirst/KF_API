const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema(
  {
    commentdescription: {
      type: String,
     default:"",
    },
    newsid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
     
    },
    videoid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VideoGallerys",
     
    },
    imagegalleryid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ImageGallery",
     
    },
    commentby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    commentstatus: {
      type: String,
      default: "Pending",
    },
    //Pending,Approved,Reject
    approvedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admins",
    },
    //News,Video,Photo,
    commentype: {
      type: "String",
      default: "News",
    },
  },
  { timestamps: true }
);
const Comment = mongoose.model("Comments", CommentSchema);
module.exports = Comment;
