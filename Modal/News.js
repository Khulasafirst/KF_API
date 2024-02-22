const mongoose = require("mongoose");
const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: "",
    },
    time: {
      type: String,
    },
    priority: {
      type: String,
    },
    short: {
      type: String,
    },
    hindi: {
      type: String,
    },
    english: {
      type: String,
    },
    first: {
      type: String,
    },
    second: {
      type: String,
    },
    pic1: {
      type: String,
    },
    pic2: {
      type: String,
    },
    pic3: {
      type: String,
    },
    pic4: {
      type: String,
    },
    pic5: {
      type: String,
    },
    mtag: {
      type: String,
    },
    tag: {
      type: String,
    },
    pic: {
      type: String,
    },
    link: {
      type: String,
    },
    slug: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    imagename: {
      type: String,
      default: "",
    },
    thumbnailImage:{
      type: String,
      default: "",
    },
    imageurl: {
      type: String,
      default: "",
    },
    categoryid: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "NewsCategorys",
        },
        name: {
          type: String,
        },
      },
    ],
    subcategoryid: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "NewsSubCategorys",
        },
        name: {
          type: String,
        },
      },
    ],
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "States",
    },
    city: [
      {id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Citys",
      },name:{
          type: String,
      }},
    ],
    country: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Countrys",
      },
    ],
    tags: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tags",
        },
        name: {
          type: String,
        },
      },
    ],
    postedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admins",
    },
    isapproved: {
      type: String,
      default: "Approved",
      enum:['Approved','Rejected','Pending'],
    },
    //post ke samay auto  approve karna he
    //Approved,Rejected,Pending
    approvedby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admins",
    },
    isarchived: {
      type: Boolean,
      default: false,
    },
    commentId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
    breakingnews: {
      type: Boolean,
      default: false,
    },
    visitorscount: {
      type: String,
      default: 0,
    },
    orderby: {
      type: String,
      
    },
  },
  { timestamps: true }
);

const News = mongoose.model("News", NewsSchema);
module.exports = News;
